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

function percentToShields(percent) {
   const p = Number(percent);
   if (!Number.isFinite(p)) return null;
   const clamped = Math.min(100, Math.max(0, p));
   return Math.min(5, Math.floor(clamped / 20) + 1);
}

function getCefrLevel(ceScore, table) {
   const entry = table.find((r) => ceScore >= r.min && ceScore <= r.max);
   return entry ? entry.cefr : "—";
}

function average(values) {
   const nums = values.map(num).filter((v) => v !== null);
   if (!nums.length) return null;
   return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/* ── Language ────────────────────────────────── */
function getLang() {
   return localStorage.getItem("lang") || "vn";
}

function S() {
   return STRINGS[getLang()] || STRINGS.en;
}

/* Resolve a config message that may be { en, vn } or a plain string */
function tMsg(msgObj) {
   if (!msgObj) return null;
   const lang = getLang();
   if (typeof msgObj === "object" && !Array.isArray(msgObj)) return msgObj[lang] ?? msgObj.en ?? null;
   return msgObj;
}

/* Apply all data-i18n text to the DOM */
function applyStrings() {
   const s = S();
   document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (s[key] !== undefined) el.textContent = s[key];
   });
}

/* Render FAQ <details> items from strings */
function renderFaq() {
   const s = S();
   const container = $("faq-list");
   if (!container) return;
   container.innerHTML = s.faq
      .map((item) => {
         const idAttr = item.id ? ` id="${item.id}"` : "";
         return `<details${idAttr}><summary>${item.q}</summary><div class="faq-content">${item.a}</div></details>`;
      })
      .join("");
}

function setLang(lang) {
   localStorage.setItem("lang", lang);
   document.documentElement.lang = lang;
   applyStrings();
   renderFaq();
   if (appData && appConfig) render(appData, appConfig);
}

function toggleLang() {
   setLang(getLang() === "en" ? "vn" : "en");
}

/* ── Date helpers (language-aware) ──────────── */
function fmtDate(s) {
   const [y, m, d] = s.split("-");
   const months = S().monthsShort;
   return `${parseInt(d)} ${months[+m - 1]} ${y}`;
}

function monthName(period) {
   if (!period) return "";
   const [y, m] = period.start.split("-");
   return `${S().monthsFull[+m - 1]} ${y}`;
}

/* ── Performance note ────────────────────────── */
function performanceNote(avg, completion, cfg) {
   const a = num(avg) ?? 0;
   const c = num(completion) ?? 0;
   const s = S();
   const pn = cfg?.performanceNote ?? {};
   const strongScore = pn.strongScoreMin ?? 85;
   const goodScore = pn.goodScoreMin ?? 80;
   const strongComp = pn.strongCompletionMin ?? 80;
   const msgs = pn.messages ?? {};
   if (a >= strongScore && c >= strongComp) return tMsg(msgs.strong) ?? s.perfStrong;
   if (a >= goodScore) return tMsg(msgs.goodScore) ?? s.perfGoodScore;
   if (c >= strongComp) return tMsg(msgs.goodCompletion) ?? s.perfGoodComp;
   return tMsg(msgs.default) ?? s.perfDefault;
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
   const lang = getLang();
   const s = S();
   const url = window.location.href;
   const name = document.getElementById("hdr-name")?.textContent || "Student";
   const school = document.querySelector(".brand-name")?.textContent || "XYZ School";
   const period = document.getElementById("hdr-period")?.textContent || "";
   const program = document.getElementById("hdr-program")?.textContent || "";
   const isEocShare = appData?.reportType === "eoc";
   const titleTpl = isEocShare ? s.shareTitleEoc : s.shareTitle;
   const title = titleTpl.replace("{name}", name).replace("{school}", school);
   const vars = { name, school, program, period };
   const defaultLines = [
      "📊 {name} just received their monthly learning report from {school}!",
      "Program: {program}",
      "Period: {period}",
      "At {school}, we help young learners build real English skills through engaging, structured lessons. Every month, parents receive a detailed report tracking attendance, language skills, homework, vocabulary, and more.",
      "Tap the link to view the full report 👇",
   ];
   const text = (appConfig?.shareText?.[lang] ?? appConfig?.shareText?.en ?? defaultLines)
      .map((line) => line.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? ""))
      .filter((line) => line !== "" && !line.endsWith(": "))
      .join("\n\n");
   if (navigator.share) {
      navigator.share({ title, text, url });
   } else {
      navigator.clipboard?.writeText(`${title}\n\n${text}\n\n${url}`).then(() => alert(s.copiedAlert));
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
   if (score >= 4) return "var(--green)";
   if (score >= 3) return "var(--yellow)";
   return "var(--red)";
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
   const lang = getLang();
   const s = S();

   const isEoc = d.reportType === "eoc";

   /* Header */
   $("hdr-name").textContent = d.student.name || "";
   const courseProgramLevel = [d.student.courseCode, d.student.program, d.student.level].filter((x) => !blank(x)).join(" - ");
   $("hdr-course").textContent = courseProgramLevel || "";
   const badgeEl = document.querySelector("[data-i18n='periodBadge']");
   if (badgeEl && isEoc) badgeEl.textContent = s.periodBadgeEoc;
   if (d.period) {
      $("hdr-period").textContent = `${fmtDate(d.period.start)} – ${fmtDate(d.period.end)}`;
      document.title = isEoc ? `${monthName(d.period)} End of Course Progress Report – ${d.student.name}` : `${monthName(d.period)} Progress Report – ${d.student.name}`;
   }

   /* Staff */
   const staff = d.staff;
   if (staff && (!blank(staff.teachers) || !blank(staff.teachingAssistants))) {
      const renderNames = (names) =>
         (Array.isArray(names) ? names : [])
            .filter(Boolean)
            .map((n) => `<span class="staff-name">${n}</span>`)
            .join("");
      const teachersHtml = renderNames(staff.teachers);
      const tasHtml = renderNames(staff.teachingAssistants);
      $("staff-teachers").innerHTML = teachersHtml;
      $("staff-tas").innerHTML = tasHtml;
      if (!teachersHtml) $("staff-teachers-group").classList.add("hidden");
      if (!tasHtml) $("staff-tas-group").classList.add("hidden");
   } else {
      $("sec-staff").classList.add("hidden");
   }

   /* Feedback — use lang, fall back to en */
   if (d.AiFeedback) {
      const feedbackText = d.AiFeedback[lang] ?? d.AiFeedback.en;
      if (feedbackText) $("feedback-summary").textContent = feedbackText;
   }

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
      const attThresholds = attCfg.thresholds ?? [];
      const found = attThresholds.find((t) => pct >= t.min) ?? {};
      $("att-msg").textContent = tMsg(found.message) ?? tMsg(attCfg.defaultMessage) ?? s.attFallback;
   } else {
      $("sec-att").classList.add("hidden");
   }

   /* Language Skills */
   if (d.languageSkills && !blank(d.languageSkills)) {
      const labels = s.skillLabels;
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
      const labels = s.pblLabels;
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
      $("pbl-dates-note").textContent = pblDates ? `${s.pblDatesPrefix}${pblDates}` : s.pblDefaultNote;
   } else {
      $("sec-pbl").classList.add("hidden");
   }

   /* Cambridge Test */
   const camb = d.cambridgeTest?.scores;
   if (camb && !blank(camb)) {
      const cambType = d.cambridgeTest.type ?? "";
      const isKey = cambType.includes("Key");
      const isPrelim = cambType.includes("Preliminary");
      let html = "";

      if (isKey || isPrelim) {
         const baseScore = isPrelim ? 120 : 100;
         const labels = isPrelim
            ? [
                 ["reading", s.cambridgeLabels.reading],
                 ["writing", s.cambridgeLabels.writing],
                 ["speaking", s.cambridgeLabels.speaking],
                 ["listening", s.cambridgeLabels.listening],
              ]
            : [
                 ["readingWriting", s.cambridgeLabels.readingWriting],
                 ["speaking", s.cambridgeLabels.speaking],
                 ["listening", s.cambridgeLabels.listening],
              ];
         for (const [key, lbl] of labels) {
            const v = camb[key];
            if (v === null || v === undefined || v === "") continue;
            const ceScore = Math.round(baseScore + 0.5 * num(v));
            const cefr = getCefrLevel(ceScore, cfg.cambridgeCefrTable);
            html += `
<div class="mini-card">
  <div class="mini-label">${lbl}</div>
  <div class="cambridge-ce-row">
    <span class="cambridge-ce-score">${ceScore}</span>
    <span class="cambridge-cefr-badge">${cefr}</span>
  </div>
</div>`;
         }
      } else {
         const labels = [
            ["readingWriting", s.cambridgeLabels.readingWriting],
            ["speaking", s.cambridgeLabels.speaking],
            ["listening", s.cambridgeLabels.listening],
         ];
         for (const [key, lbl] of labels) {
            const v = camb[key];
            if (v === null || v === undefined || v === "") continue;
            const score = num(v);
            const shields = percentToShields(score);
            const shieldsHtml = Array.from({ length: 5 }, (_, i) =>
               i < shields
                  ? `<svg class="shield-icon shield-on" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 1 L19 5 L19 12 C19 18 10 23 10 23 C10 23 1 18 1 12 L1 5 Z" fill="currentColor"/></svg>`
                  : `<svg class="shield-icon shield-off" viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 1 L19 5 L19 12 C19 18 10 23 10 23 C10 23 1 18 1 12 L1 5 Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
            ).join("");
            html += `
<div class="mini-card">
  <div class="mini-label">${lbl}</div>
  <div class="mini-shields">${shieldsHtml}</div>
</div>`;
         }
      }

      $("cambridge-grid").innerHTML = html;
      if (!html) $("sec-cambridge").classList.add("hidden");
      $("cambridge-note").textContent = d.cambridgeTest.type ? s.cambridgeNoteType.replace("{type}", d.cambridgeTest.type) : s.cambridgeNoteDefault;

      const slug = Object.entries(cfg.cambridgeTypeSlug).find(([k]) => cambType.includes(k))?.[1];
      const infoEl = $("cambridge-info");
      if (slug && d.cambridgeTest.type) {
         const url =
            getLang() === "en" ? `https://www.cambridgeenglish.org/exams-and-tests/qualifications/${slug}/` : `https://www.cambridgeenglish.org/vn/exams-and-tests/${slug}/`;
         const linkText = s.cambridgeInfoLink.replace("{type}", d.cambridgeTest.type);
         const link = `<a href="${url}" target="_blank" rel="noopener">${linkText}</a>`;
         infoEl.innerHTML = s.cambridgeInfo.replace("{link}", link);
      } else {
         infoEl.textContent = "";
      }
   } else {
      $("sec-cambridge").classList.add("hidden");
   }

   /* Progress Test */
   const prog = d.progressTest?.scores;
   if (prog && !blank(prog)) {
      let html = "";
      for (const [key, v] of Object.entries(prog)) {
         if (v === null || v === undefined || v === "") continue;
         const lbl = s.progressLabels[key] ?? key;
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
   const finalScore = num(d.finalScore);
   if (finalScore !== null) {
      $("final-donut-wrap").innerHTML = buildDonut(finalScore, "final", cfg);
      $("final-note").textContent = s.finalCalcNote.replace("{score}", Math.round(finalScore));
      requestAnimationFrame(() => setTimeout(() => animateDonut("final", finalScore), 150));
   } else {
      $("sec-final").classList.add("hidden");
   }

   /* Recommendations */
   const recCfg = cfg?.recommendations ?? {};
   const recList = [];

   if (Array.isArray(d.recommendations) && d.recommendations.length) {
      /* Use pre-built recommendations from data JSON — use lang, fall back to en */
      d.recommendations.forEach((rec) => {
         const text = rec[lang] ?? rec.en;
         const subHtml =
            Array.isArray(rec.subPoints) && rec.subPoints.length
               ? `<ul>${rec.subPoints.map((sp) => `<li>${typeof sp === "object" ? (sp[lang] ?? sp.en) : sp}</li>`).join("")}</ul>`
               : "";
         recList.push(`${text}${subHtml}`);
      });
   } else {
      /* Fallback: generate from config thresholds */
      const vocabComp = vOk ? num(vcb.completionRate) : null;
      const hwComp = hwOk ? num(hw.completionRate) : null;
      const speaking = d.languageSkills ? num(d.languageSkills.speaking) : null;
      if (vocabComp !== null && vocabComp < (recCfg.vocabulary?.completionThreshold ?? 80)) recList.push(tMsg(recCfg.vocabulary?.message) ?? s.recVocab);
      if (hwComp !== null && hwComp < (recCfg.homework?.completionThreshold ?? 85)) recList.push(tMsg(recCfg.homework?.message) ?? s.recHomework);
      if (speaking !== null && speaking < (recCfg.speaking?.threshold ?? 4)) recList.push(tMsg(recCfg.speaking?.message) ?? s.recSpeaking);
      if (!recList.length) {
         const defaults = recCfg.defaults;
         const defaultList = defaults && !Array.isArray(defaults) ? (defaults[lang] ?? defaults.en ?? s.recDefaults) : (defaults ?? s.recDefaults);
         defaultList.forEach((r) => recList.push(r));
      }
   }

   $("recommendations-list").innerHTML = recList.map((r) => `<li>${r}</li>`).join("");

   /* Footer */
   $("ftr-course").textContent = `© Copyright ${new Date().getFullYear()} ILA Vietnam`;
   $("ftr-date").textContent = d.period
      ? (isEoc ? s.footerReportEoc : s.footerReport).replace("{month}", monthName(d.period))
      : isEoc
        ? s.footerFallbackEoc
        : s.footerMonthlyReport;
}

let appConfig;
let appData;

/* ── Early lang init — runs synchronously before fetch ──────────
   Applies strings and FAQ immediately so static text is correct
   on first paint, before async data arrives.
   Function declarations above are hoisted so this is safe.       */
document.documentElement.lang = getLang();
applyStrings();
renderFaq();

/* ── Load data and render ────────────────────── */
const studentParam = new URLSearchParams(window.location.search).get("student") || "1";
const dataFile = `data/data${studentParam}.json`;

/* ── Student photo (with SVG fallback) ──────── */
function loadStudentPhoto(photoFile) {
   if (!photoFile) return;
   const wrap = document.getElementById("avatar-wrap");
   const img = new Image();
   img.src = `assets/images/${photoFile}`;
   img.alt = "Student photo";
   img.onload = () => {
      wrap.innerHTML = "";
      wrap.appendChild(img);
   };
}

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
      appData = data;
      loadStudentPhoto(data.student?.photo);
      render(data, config);
      document.body.classList.add("loaded");
   })
   .catch((err) => {
      console.error("Report load error:", err);
      document.body.classList.add("loaded"); /* show page even on error */
   });

/* Safety: reveal page after 2s in case of slow load */
setTimeout(() => document.body.classList.add("loaded"), 2000);
