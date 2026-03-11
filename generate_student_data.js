const fs = require("fs");
const path = require("path");

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDate(dateStr) {
   const [y, m, d] = dateStr.split("-").map(Number);
   return `${d} ${MONTHS[m - 1]} ${y}`;
}

function readJson(file) {
   return JSON.parse(fs.readFileSync(path.join(__dirname, file), "utf8"));
}

function writeJson(file, data) {
   fs.writeFileSync(path.join(__dirname, file), JSON.stringify(data, null, 3), "utf8");
}

function avg(arr) {
   if (!arr.length) return null;
   return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ── Config ───────────────────────────────────────────────────────────────────

const config       = readJson("config.json");
const weights      = config.scoring.weights;
const thresholds   = config.scoring.skillThresholds;
const maxRecs      = config.scoring.maxSkillRecommendations;
const minRecs      = config.scoring.minSkillRecommendations;
const focusToSkills = config.focusToSkills;
const testSkillMap  = config.testSkillMapping;
const vylPrograms   = config.programmes.vyl;
const hwThreshold   = config.recommendations.homework.scoreThreshold;
const vocThreshold  = config.recommendations.vocabulary.scoreThreshold;

// Skills found via outcome.skill; grammar/pronunciation found via outcome.system
const SKILL_LIST     = ["speaking", "listening", "reading", "writing", "grammar", "pronunciation"];
const LANG_SKILLS    = ["speaking", "listening", "reading", "writing"];
const SYSTEM_SKILLS  = ["grammar", "pronunciation"];

// ── Compute composite score for one skill (0–100) ────────────────────────────

function computeSkillScore(skill, data, isVYL) {
   const attended = (data.lessons ?? []).filter(l => l.classes_seats?.isAttended);
   const parts = {};

   // 1. Language skill rating (speaking/listening/reading/writing; 1–5 → 0–100)
   if (LANG_SKILLS.includes(skill)) {
      const val = data.languageSkills?.[skill];
      if (val !== null && val !== undefined) {
         parts.languageSkill = val * 20;
      }
   }

   // 2. Lesson outcome average for this skill (1–5 → 0–100)
   const outcomeVals = attended
      .flatMap(l => l.outcomes ?? [])
      .filter(o => SYSTEM_SKILLS.includes(skill) ? o.system === skill : o.skill === skill)
      .map(o => o.result);
   const outcomeAvg = avg(outcomeVals);
   if (outcomeAvg !== null) parts.outcomeAvg = outcomeAvg * 20;

   // 3. Test scores mapped to this skill (YL only; VYL assessments handled separately)
   if (!isVYL) {
      const testVals = [];

      if (data.progressTest?.scores) {
         for (const [key, skills] of Object.entries(testSkillMap.progressTest ?? {})) {
            if (skills.includes(skill) && data.progressTest.scores[key] != null) {
               testVals.push(data.progressTest.scores[key]);
            }
         }
      }

      if (data.cambridgeTest?.scores) {
         for (const [key, skills] of Object.entries(testSkillMap.cambridgeTest ?? {})) {
            if (skills.includes(skill) && data.cambridgeTest.scores[key] != null) {
               testVals.push(data.cambridgeTest.scores[key]);
            }
         }
      }

      const testAvg = avg(testVals);
      if (testAvg !== null) parts.testScore = testAvg;
   }

   // 4. Homework average for lessons whose focus maps to this skill
   const skillFocuses = Object.entries(focusToSkills)
      .filter(([, skills]) => skills.includes(skill))
      .map(([focus]) => focus);

   const hwVals = attended
      .filter(l =>
         skillFocuses.includes(l.info?.focus ?? "") &&
         l.classes_seats?.homework?.hasHomework &&
         l.classes_seats.homework.score != null
      )
      .map(l => l.classes_seats.homework.score);
   const hwAvg = avg(hwVals);
   if (hwAvg !== null) parts.hwByFocus = hwAvg;

   // Weighted composite — renormalize if any source is absent
   const weightMap = {
      languageSkill : weights.languageSkill,
      outcomeAvg    : weights.outcomeAvg,
      testScore     : weights.testScore,
      hwByFocus     : weights.hwByFocus,
   };

   let totalWeight = 0;
   let weightedSum = 0;
   for (const [key, val] of Object.entries(parts)) {
      const w = weightMap[key];
      weightedSum += val * w;
      totalWeight += w;
   }

   return totalWeight === 0 ? null : weightedSum / totalWeight;
}


// ── Main ─────────────────────────────────────────────────────────────────────

const DATA_FILES = [
   "data/data1.json",
   "data/data2.json",
   "data/data3.json",
   "data/data4.json",
   "data/data5.json",
   "data/data6.json",
   "data/data7.json",
];

for (const file of DATA_FILES) {
   const filePath = path.join(__dirname, file);
   if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} — file not found`);
      continue;
   }

   const data = readJson(file);
   const lessons = data.lessons ?? [];
   const isVYL = vylPrograms.includes(data.student?.program ?? "");
   const recs = [];

   // ── Homework sub-points ─────────────────────────────────────────────────
   const hwSubPoints = lessons
      .filter(l => {
         if (!l.classes_seats?.isAttended) return false;
         const score = l.classes_seats?.homework?.hasHomework
            ? (l.classes_seats.homework.score ?? null)
            : null;
         return score !== null && score < hwThreshold;
      })
      .map(l => {
         const score = l.classes_seats.homework.score;
         const title = l.title?.en ?? l.id;
         const focus = l.info?.focus ?? "";
         const date  = l.classes_seats?.date ? fmtDate(l.classes_seats.date) : "";
         return `${title} \u2013 ${focus} (${date}): Homework (${score}%)`;
      });

   if (hwSubPoints.length) {
      recs.push({
         en: config.recommendations.homework.message.en,
         vn: config.recommendations.homework.message.vn,
         subPoints: hwSubPoints,
      });
   }

   // ── Vocabulary sub-points ───────────────────────────────────────────────
   const vocSubPoints = lessons
      .filter(l => {
         if (!l.classes_seats?.isAttended) return false;
         const score = l.classes_seats?.vocabulary?.hasVocabulary
            ? (l.classes_seats.vocabulary.score ?? null)
            : null;
         return score !== null && score < vocThreshold;
      })
      .map(l => {
         const score = l.classes_seats.vocabulary.score;
         const title = l.title?.en ?? l.id;
         const focus = l.info?.focus ?? "";
         const date  = l.classes_seats?.date ? fmtDate(l.classes_seats.date) : "";
         return `${title} \u2013 ${focus} (${date}): Vocabulary (${score}%)`;
      });

   if (vocSubPoints.length) {
      recs.push({
         en: "Complete or retry these vocabulary exercises:",
         vn: "Hoàn thành hoặc làm lại các bài tập từ vựng sau:",
         subPoints: vocSubPoints,
      });
   }

   // ── VYL generic assessment signal ──────────────────────────────────────
   if (isVYL && data.progressTest?.scores) {
      const assessVals = Object.values(data.progressTest.scores).filter(v => v != null);
      const assessAvg = avg(assessVals);
      if (assessAvg !== null && assessAvg < config.vylAssessment.threshold) {
         recs.push({
            en: config.vylAssessment.message.en,
            vn: config.vylAssessment.message.vn,
            subPoints: [],
         });
      }
   }

   // ── Skill recommendations ───────────────────────────────────────────────
   // Compute composite score for each applicable skill
   const skillScores = [];
   for (const skill of SKILL_LIST) {
      const score = computeSkillScore(skill, data, isVYL);
      if (score !== null) skillScores.push({ skill, score });
   }

   // Sort worst-first
   skillScores.sort((a, b) => a.score - b.score);

   // Triggered: below the moderate threshold, capped at max
   const triggered = skillScores
      .filter(s => s.score < thresholds.moderate)
      .slice(0, maxRecs);

   // Pad up to minimum using next-lowest scores above threshold
   const skillRecs = [...triggered];
   if (skillRecs.length < minRecs) {
      const used = new Set(skillRecs.map(r => r.skill));
      for (const s of skillScores) {
         if (skillRecs.length >= minRecs) break;
         if (!used.has(s.skill)) {
            skillRecs.push(s);
            used.add(s.skill);
         }
      }
   }

   for (const { skill, score } of skillRecs) {
      const level = score < thresholds.strong ? "strong" : "moderate";
      const msg = config.skillRecommendations[skill][level];
      recs.push({ en: msg.en, vn: msg.vn, subPoints: [] });
   }

   // ── Fallback if still nothing ───────────────────────────────────────────
   if (recs.length === 0) {
      const defaults = config.recommendations.defaults;
      defaults.en.forEach((en, i) =>
         recs.push({ en, vn: defaults.vn[i] ?? "", subPoints: [] })
      );
   }

   data.recommendations = recs;
   writeJson(file, data);
   console.log(`Updated ${file} — ${recs.length} recommendation(s) (VYL: ${isVYL})`);
}
