/* ── Utilities ───────────────────────────────── */
const $ = (id) => document.getElementById(id);

function blank(v) {
   if (v === null || v === undefined || v === "") return true;
   if (typeof v === "object" && !Array.isArray(v)) return Object.values(v).every((x) => x === null || x === undefined || x === "");
   return false;
}

function num(v) {
   const n = parseFloat(v);
   return isNaN(n) ? null : n;
}

function fmtDate(s) {
   const [y, m, d] = s.split("-");
   return `${parseInt(d)} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m - 1]} ${y}`;
}

function monthName(period) {
   if (!period) return "";
   const [y, m] = period.start.split("-");
   return `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][+m - 1]} ${y}`;
}

function average(values) {
   const nums = values.map(num).filter((v) => v !== null);
   if (!nums.length) return null;
   return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function performanceNote(avg, completion, cfg) {
   const a = num(avg) ?? 0;
   const c = num(completion) ?? 0;
   const pn = cfg?.performanceNote ?? {};
   const strongScore = pn.strongScoreMin ?? 85;
   const goodScore = pn.goodScoreMin ?? 80;
   const strongComp = pn.strongCompletionMin ?? 80;
   const msgs = pn.messages ?? {};
   if (a >= strongScore && c >= strongComp) return msgs.strong ?? "Strong performance and steady practice.";
   if (a >= goodScore) return msgs.goodScore ?? "Good accuracy. More regular completion will strengthen progress.";
   if (c >= strongComp) return msgs.goodCompletion ?? "Practice is happening. Focus on accuracy during review.";
   return msgs.default ?? "This area needs more regular practice at home.";
}

/* ── Colour logic (0–100 scale) ──────────────── */
function col(pct, cfg) {
   const g = cfg?.colors?.greenMin ?? 85;
   const y = cfg?.colors?.yellowMin ?? 70;
   if (pct >= g) return { cls: "c-green", fill: "var(--green)", trk: "var(--green-trk)" };
   if (pct >= y) return { cls: "c-yellow", fill: "var(--yellow)", trk: "var(--yellow-trk)" };
   return { cls: "c-red", fill: "var(--red)", trk: "var(--red-trk)" };
}

/* ── Language skill colour (1–5 scale) ──────── */
function skillCol(score) {
   if (score >= 3) return { cls: "c-green", fill: "var(--green)", trk: "var(--green-trk)" };
   if (score >= 2) return { cls: "c-yellow", fill: "var(--yellow)", trk: "var(--yellow-trk)" };
   return { cls: "c-red", fill: "var(--red)", trk: "var(--red-trk)" };
}

/* ── Share ───────────────────────────────────── */
function shareReport() {
   const url = window.location.href;
   const name = document.getElementById("hdr-name")?.textContent || "Student";
   const school = document.querySelector(".brand-name")?.textContent || "XYX School";
   const period = document.getElementById("hdr-period")?.textContent || "";
   const program = document.getElementById("hdr-program")?.textContent || "";
   const title = `${name}'s Monthly Report — ${school}`;
   const vars = { name, school, program, period };
   const defaultLines = [
      "📊 {name} just received their monthly learning report from {school}!",
      "Program: {program}",
      "Period: {period}",
      "At {school}, we help young learners build real English skills through engaging, structured lessons. Every month, parents receive a detailed report tracking attendance, language skills, homework, vocabulary, and more.",
      "Tap the link to view the full report 👇",
   ];
   const text = (appConfig?.shareText?.en ?? defaultLines)
      .map((line) => line.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ""))
      .filter((line) => line !== "" && !line.endsWith(": "))
      .join("\n");
   if (navigator.share) {
      navigator.share({ title, text, url });
   } else {
      navigator.clipboard?.writeText(`${title}\n\n${text}\n\n${url}`).then(() => alert("Link copied to clipboard."));
   }
}

/* ── FAQ scroll + open ──────────────────────── */
function openFaq(id) {
   const el = document.getElementById(id);
   if (!el) return;
   el.open = true;
   el.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ── PBL star colour (1–5 scale) ─────────────── */
function starFill(score) {
   if (score >= 4) return "var(--green)"; /* 4–5/5 — excellent */
   if (score >= 3) return "var(--yellow)"; /* 3/5 — good        */
   return "var(--red)"; /* 1–2/5 — needs work */
}

/* ── Donut chart (r=45, circ≈283) ───────────── */
const CIRC = 282.74;

function buildDonut(score, idSuffix, cfg) {
   const pct = Math.min(100, Math.max(0, num(score) ?? 0));
   const c = col(pct, cfg);
   return `
<div class="donut-wrap">
  <svg class="donut-svg" viewBox="0 0 110 110">
    <circle class="donut-trk" cx="55" cy="55" r="45" stroke="${c.trk}"/>
    <circle class="donut-fill" id="df-${idSuffix}" cx="55" cy="55" r="45" stroke="${c.fill}"/>
  </svg>
  <div class="donut-center">
    <div class="donut-score ${c.cls}">${Math.round(pct)}</div>
    <div class="donut-unit">/ 100</div>
  </div>
</div>`;
}

function animateDonut(idSuffix, pct) {
   const el = $("df-" + idSuffix);
   if (el) el.style.strokeDashoffset = CIRC - (pct / 100) * CIRC;
}

/* ════════════════════════════════════════════
   RENDER
════════════════════════════════════════════ */
function render(d, cfg) {
   /* Header */
   $("hdr-name").textContent = d.student.name || "";
   const courseProgramLevel = [d.student.courseCode, d.student.program, d.student.level].filter((x) => !blank(x)).join(" - ");
   $("hdr-course").textContent = courseProgramLevel || "";
   if (d.period) {
      $("hdr-period").textContent = `${fmtDate(d.period.start)} – ${fmtDate(d.period.end)}`;
      document.title = `${monthName(d.period)} Report – ${d.student.name}`;
   }

   /* Feedback */
   if (d.AiFeedback?.en) {
      $("feedback-summary").textContent = d.AiFeedback.en;
   }

   /* Language skills average (used for Final Score) */
   const outcomesAvgRaw = d.languageSkills && !blank(d.languageSkills) ? average(Object.values(d.languageSkills)) : null;

   /* Attendance */
   if (!blank(d.attendance)) {
      const pct = num(d.attendance);
      const c = col(pct, cfg);
      $("att-num").textContent = pct + "%";
      $("att-num").className = "att-num " + c.cls;
      $("att-fill").style.width = pct + "%";
      $("att-fill").style.background = c.fill;
      $("att-track").style.background = c.trk;
      $("att-msg").className = "att-msg " + c.cls;
      const attCfg = cfg?.attendance ?? {};
      const attThresholds = attCfg.thresholds ?? [
         { min: 95, message: "Outstanding attendance this month!" },
         { min: 85, message: "Great attendance — well done!" },
         { min: 75, message: "Good, but let's aim a little higher!" },
      ];
      const attMsg = (attThresholds.find((t) => pct >= t.min) ?? {}).message ?? attCfg.defaultMessage ?? "Attendance needs attention. Please contact us.";
      $("att-msg").textContent = attMsg;
   } else {
      $("sec-att").classList.add("hidden");
   }

   /* Language Skills */
   if (d.languageSkills && !blank(d.languageSkills)) {
      const labels = { reading: "Reading", writing: "Writing", speaking: "Speaking", listening: "Listening" };
      let html = "";
      for (const [key, lbl] of Object.entries(labels)) {
         const v = d.languageSkills[key];
         if (v === null || v === undefined || v === "") continue;
         const score = num(v);
         const pct = (score / 5) * 100;
         const c = skillCol(score);
         html += `
<div class="skill-row">
  <div class="skill-name">${lbl}</div>
  <div class="skill-track" style="background:${c.trk}">
    <div class="skill-fill" style="width:${pct}%; background:${c.fill}"></div>
  </div>
  <div class="skill-val ${c.cls}">${score.toFixed(1)}</div>
  <div class="skill-max">/ 5.0</div>
</div>`;
      }
      $("skills-list").innerHTML = html;
      if (!html) $("sec-outcomes").classList.add("hidden");
   } else {
      $("sec-outcomes").classList.add("hidden");
   }

   /* Homework */
   const hw = d.homework;
   const hwOk = hw && !blank(hw);
   if (hwOk) {
      const score = num(hw.averageScore);
      const comp = num(hw.completionRate);
      $("hw-donut-wrap").innerHTML = score != null ? buildDonut(score, "hw", cfg) : "";
      if (score != null) $("hw-avg").textContent = score + "%";
      if (comp != null) $("hw-completion").textContent = comp + "%";
      $("hw-note").textContent = performanceNote(hw.averageScore, hw.completionRate, cfg);
      requestAnimationFrame(() =>
         setTimeout(() => {
            if (score != null) animateDonut("hw", score);
         }, 150),
      );
   } else {
      $("sec-hw").classList.add("hidden");
   }

   /* Vocabulary */
   const vcb = d.vocabulary;
   const vOk = vcb && !blank(vcb);
   if (vOk) {
      const score = num(vcb.averageScore);
      const comp = num(vcb.completionRate);
      $("vocab-donut-wrap").innerHTML = score != null ? buildDonut(score, "vocab", cfg) : "";
      if (score != null) $("vocab-avg").textContent = score + "%";
      if (comp != null) $("vocab-completion").textContent = comp + "%";
      $("vocab-note").textContent = performanceNote(vcb.averageScore, vcb.completionRate, cfg);
      requestAnimationFrame(() =>
         setTimeout(() => {
            if (score != null) animateDonut("vocab", score);
         }, 150),
      );
   } else {
      $("sec-vocab").classList.add("hidden");
   }

   /* 21st Century Skills */
   const pblScores = d.pbl?.scores;
   if (pblScores && !blank(pblScores)) {
      const labels = {
         creativity: "Creativity",
         collaboration: "Collaboration",
         criticalThinking: "Critical Thinking",
         communication: "Communication",
         selfReflection: "Self-Reflection",
         digitalLiteracy: "Digital Literacy",
      };
      const PATH = `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`;
      let html = "";
      for (const [key, lbl] of Object.entries(labels)) {
         const v = pblScores[key];
         if (v === null || v === undefined || v === "") continue;
         const score = Math.round(num(v));
         const fill = starFill(score);
         let stars = "";
         for (let i = 1; i <= 5; i++) {
            stars += `<svg class="pbl-star${i <= score ? " on" : ""}" viewBox="0 0 24 24" fill="${i <= score ? fill : "var(--star-off)"}">${PATH}</svg>`;
         }
         html += `
<div class="pbl-row">
  <div class="pbl-name">${lbl}</div>
  <div class="pbl-stars">${stars}</div>
  <div class="pbl-num">${score}/5</div>
</div>`;
      }
      $("pbl-rows").innerHTML = html;
      if (!html) $("sec-pbl").classList.add("hidden");
      const pblDates = Array.isArray(d.pbl.dates) && d.pbl.dates.length ? d.pbl.dates.map(fmtDate).join(" · ") : "";
      $("pbl-dates-note").textContent = pblDates ? `Lessons: ${pblDates}` : "Project-based learning skills, rated out of 5.";
   } else {
      $("sec-pbl").classList.add("hidden");
   }

   /* Cambridge Test */
   const camb = d.cambridgeTest?.scores;
   if (camb && !blank(camb)) {
      const labels = [
         ["readingWriting", "Reading & Writing"],
         ["speaking", "Speaking"],
         ["listening", "Listening"],
      ];
      let html = "";
      for (const [key, lbl] of labels) {
         const v = camb[key];
         if (v === null || v === undefined || v === "") continue;
         const score = num(v);
         const c = col(score, cfg);
         html += `
<div class="mini-card">
  <div class="mini-label">${lbl}</div>
  <div class="mini-value ${c.cls}">${Math.round(score)}%</div>
</div>`;
      }
      $("cambridge-grid").innerHTML = html;
      if (!html) $("sec-cambridge").classList.add("hidden");
      $("cambridge-note").textContent = d.cambridgeTest.type ? `Results for ${d.cambridgeTest.type} practice test.` : "Results from the Cambridge practice test.";
   } else {
      $("sec-cambridge").classList.add("hidden");
   }

   /* Progress Test */
   const prog = d.progressTest?.scores;
   if (prog && !blank(prog)) {
      const labels = [
         ["readingWritingGrammarVocabulary", "Reading, Writing & Grammar"],
         ["speaking", "Speaking"],
         ["listening", "Listening"],
      ];
      let html = "";
      for (const [key, lbl] of labels) {
         const v = prog[key];
         if (v === null || v === undefined || v === "") continue;
         const score = num(v);
         const c = col(score, cfg);
         html += `
<div class="mini-card">
  <div class="mini-label">${lbl}</div>
  <div class="mini-value ${c.cls}">${Math.round(score)}%</div>
</div>`;
      }
      $("progress-grid").innerHTML = html;
      if (!html) $("sec-progress").classList.add("hidden");
   } else {
      $("sec-progress").classList.add("hidden");
   }

   /* Final Score */
   const outcomesAvgPct = outcomesAvgRaw !== null ? (outcomesAvgRaw / 5) * 100 : null;
   const finalCandidates = [
      hwOk ? num(hw.averageScore) : null,
      vOk ? num(vcb.averageScore) : null,
      camb && !blank(camb) ? average(Object.values(camb)) : null,
      prog && !blank(prog) ? average(Object.values(prog)) : null,
      outcomesAvgPct,
   ].filter((v) => v !== null);

   const finalScore = finalCandidates.length ? average(finalCandidates) : null;
   if (finalScore !== null) {
      $("final-donut-wrap").innerHTML = buildDonut(finalScore, "final", cfg);
      $("final-note").textContent =
         `This score averages available assessment data for this month. It currently shows ${Math.round(finalScore)} out of 100. You can replace this with your official scoring formula.`;
      requestAnimationFrame(() => setTimeout(() => animateDonut("final", finalScore), 150));
   } else {
      $("sec-final").classList.add("hidden");
   }

   /* Recommendations */
   const recCfg = cfg?.recommendations ?? {};
   const lessonRetryCfg = cfg?.lessonRetry ?? {};
   const THRESHOLDS = {
      homework: lessonRetryCfg.homeworkThreshold ?? 80,
      vocabulary: lessonRetryCfg.vocabularyThreshold ?? 80,
   };

   const recList = [];

   /* Use pre-built recommendations from JSON if available */
   if (Array.isArray(d.recommendations) && d.recommendations.length) {
      d.recommendations.forEach((rec) => {
         const subHtml =
            Array.isArray(rec.subPoints) && rec.subPoints.length ? `<ul>${rec.subPoints.map((sp) => `<li>${typeof sp === "object" ? sp.en : sp}</li>`).join("")}</ul>` : "";
         recList.push(`${rec.en}${subHtml}`);
      });
   } else {
      /* Fallback: generate from thresholds */
      const vocabComp = vOk ? num(vcb.completionRate) : null;
      const hwComp = hwOk ? num(hw.completionRate) : null;
      const speaking = d.languageSkills ? num(d.languageSkills.speaking) : null;
      if (vocabComp !== null && vocabComp < (recCfg.vocabulary?.completionThreshold ?? 80))
         recList.push(recCfg.vocabulary?.message ?? "Review vocabulary for 5–10 minutes, three times each week.");
      if (hwComp !== null && hwComp < (recCfg.homework?.completionThreshold ?? 85))
         recList.push(recCfg.homework?.message ?? "Set a regular homework time at home to improve completion.");
      if (speaking !== null && speaking < (recCfg.speaking?.threshold ?? 4))
         recList.push(recCfg.speaking?.message ?? "Ask your child to answer simple English questions aloud at home.");
      if (!recList.length) {
         const defaults = recCfg.defaults ?? [
            "Keep a short and regular English routine at home.",
            "Encourage your child to speak in complete English sentences.",
            "Celebrate small wins to keep motivation high.",
         ];
         defaults.forEach((s) => recList.push(s));
      }
   }

   $("recommendations-list").innerHTML = recList.map((s) => `<li>${s}</li>`).join("");

   /* Footer */
   $("ftr-course").textContent = d.student.courseCode ? `Course ${d.student.courseCode}` : "";
   $("ftr-date").textContent = d.period ? `${monthName(d.period)} Report` : "Monthly Report";
}

let appConfig;

/* ── Load data and render ────────────────────── */
const studentParam = new URLSearchParams(window.location.search).get("student") || "1";
const dataFile = `data${studentParam}.json`;

/* ── Student photo (with SVG fallback) ──────── */
(function () {
   const wrap = document.getElementById("avatar-wrap");
   const fallbackSVG = wrap.innerHTML;
   const img = new Image();
   img.src = `assets/images/student${studentParam}.png`;
   img.alt = "Student photo";
   img.onload = () => {
      wrap.innerHTML = "";
      wrap.appendChild(img);
   };
})();
Promise.all([
   fetch(dataFile).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${dataFile} (${r.status})`);
      return r.json();
   }),
   fetch("config.json").then((r) => {
      if (!r.ok) throw new Error(`Failed to load config.json (${r.status})`);
      return r.json();
   }),
])
   .then(([data, config]) => {
      appConfig = config;
      render(data, config);
   })
   .catch((err) => console.error("Report load error:", err));
