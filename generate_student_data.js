const fs = require("fs");
const path = require("path");

// ── Helpers ─────────────────────────────────────────────────────────────────

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

// ── Main ─────────────────────────────────────────────────────────────────────

const config = readJson("config.json");
const hwThreshold  = config.recommendations?.homework?.scoreThreshold   ?? 80;
const vocThreshold = config.recommendations?.vocabulary?.scoreThreshold ?? 80;
const speakThreshold = config.recommendations?.speaking?.threshold ?? 4;

const DATA_FILES = ["data1.json", "data2.json", "data3.json"];

for (const file of DATA_FILES) {
   const data = readJson(file);
   const lessons = data.lessons ?? [];
   const recs = [];

   // ── Homework recommendation ─────────────────────────────────────────────
   const hwSubPoints = lessons
      .filter((l) => {
         if (!l.classes_seats?.isAttended) return false;
         const score = l.classes_seats?.homework?.hasHomework
            ? (l.classes_seats.homework.score ?? null)
            : null;
         return score !== null && score < hwThreshold;
      })
      .map((l) => {
         const score = l.classes_seats.homework.score;
         const title = l.title?.en ?? l.id;
         const focus = l.info?.focus ?? "";
         const date  = l.classes_seats?.date ? fmtDate(l.classes_seats.date) : "";
         return `${title} \u2013 ${focus} (${date}): Homework (${score}%)`;
      });

   if (hwSubPoints.length) {
      recs.push({
         en: "Complete or retry these homework activities:",
         vn: "Hoàn thành hoặc làm lại các bài tập về nhà sau:",
         subPoints: hwSubPoints,
      });
   }

   // ── Vocabulary recommendation ───────────────────────────────────────────
   const vocSubPoints = lessons
      .filter((l) => {
         if (!l.classes_seats?.isAttended) return false;
         const score = l.classes_seats?.vocabulary?.hasVocabulary
            ? (l.classes_seats.vocabulary.score ?? null)
            : null;
         return score !== null && score < vocThreshold;
      })
      .map((l) => {
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

   // ── Speaking recommendation ─────────────────────────────────────────────
   const speaking = data.languageSkills?.speaking ?? null;
   if (speaking !== null && speaking < speakThreshold) {
      recs.push({
         en: config.recommendations?.speaking?.message
            ?? "Ask your child to answer simple English questions aloud at home.",
         vn: "Khuyến khích con trả lời các câu hỏi tiếng Anh đơn giản to tiếng ở nhà.",
         subPoints: [],
      });
   }

   // ── Fallback if nothing was triggered ──────────────────────────────────
   if (recs.length === 0) {
      const defaults = config.recommendations?.defaults ?? [
         "Keep a short and regular English routine at home.",
         "Encourage your child to speak in complete English sentences.",
         "Celebrate small wins to keep motivation high.",
      ];
      defaults.forEach((en) => recs.push({ en, vn: "", subPoints: [] }));
   }

   data.recommendations = recs;
   writeJson(file, data);
   console.log(`Updated ${file} — ${recs.length} recommendation(s)`);
}
