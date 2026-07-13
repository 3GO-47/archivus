/* ============================================================
   ARCHIVUS — THE TRIAL
   The archive turned examiner. Every round draws ten fresh
   questions straight from the 548 records, so no two trials
   are alike, and every answer links back to the record so a
   wrong guess becomes a lesson. Four ordeals:
     · PRECEDENCE — which came first?
     · THE DATE   — when did it happen?
     · THE THREAD — which record is truly connected?
     · THE HORIZON — which of these has not happened yet?
   ============================================================ */
(function () {
  "use strict";
  const ALL = (window.ARCHIVUS_EVENTS || []).filter(e => Number.isFinite(e.startYear));
  const PAST = ALL.filter(e => !e.future && (e.importance || 0) >= 6);
  const BIG = ALL.filter(e => !e.future && (e.importance || 0) >= 7);
  const FUT = ALL.filter(e => e.future);
  const BY_ID = Object.fromEntries(ALL.map(e => [e.id, e]));
  const fmtY = y => y < 0 ? Math.abs(y).toLocaleString() + " BCE" : y + " CE";
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const link = e => '<a href="index.html#e=' + e.id + '&v=chronicle">' + e.title + '</a>';

  /* ---------- question forges ---------- */
  function qPrecedence() {
    let a, b, guard = 0;
    do {
      a = rnd(BIG); b = rnd(BIG);
      guard++;
    } while (guard < 60 && (a.id === b.id || Math.abs(a.startYear - b.startYear) < Math.max(60, Math.abs(Math.min(a.startYear, b.startYear)) * 0.05)));
    const first = a.startYear <= b.startYear ? a : b;
    return {
      kicker: "ORDEAL OF PRECEDENCE",
      q: "Which came first?",
      opts: shuffle([a, b]).map(e => ({ label: e.title, e, right: e === first })),
      verdict: ok => (ok ? "Correct. " : "Not so. ") + link(first) + " (" + fmtY(first.startYear) + ") precedes " +
        link(first === a ? b : a) + " (" + fmtY(first === a ? b.startYear : a.startYear) + ")." +
        (Math.abs(a.startYear - b.startYear) > 1000 ? " A gap of " + Math.abs(a.startYear - b.startYear).toLocaleString() + " years." : "")
    };
  }
  function qDate() {
    const e = rnd(BIG);
    const y = e.startYear;
    const age = Math.abs(2026 - y);
    const spread = Math.max(30, Math.round(age * 0.22));
    const decoys = new Set();
    let guard = 0;
    while (decoys.size < 3 && guard++ < 60) {
      const sign = Math.random() < 0.5 ? -1 : 1;
      const d = y + sign * Math.round(spread * (0.5 + Math.random()));
      if (Math.abs(d - y) >= Math.max(25, spread * 0.35) && d < 2140) decoys.add(d);
    }
    const opts = shuffle([y, ...decoys]).map(v => ({ label: (e.approximate ? "c. " : "") + fmtY(v), right: v === y }));
    return {
      kicker: "ORDEAL OF THE DATE",
      q: "When: " + e.title + "?",
      opts,
      verdict: ok => (ok ? "Correct — " : "The record says ") + link(e) + " · " + (e.approximate ? "c. " : "") + fmtY(y) +
        ". " + (e.desc || "").split(". ")[0] + "."
    };
  }
  function qThread() {
    const withRel = BIG.filter(e => (e.related || []).some(r => BY_ID[r]));
    const e = rnd(withRel);
    const truth = BY_ID[rnd(e.related.filter(r => BY_ID[r]))];
    const decoys = [];
    let guard = 0;
    while (decoys.length < 3 && guard++ < 80) {
      const d = rnd(PAST);
      if (d.id !== e.id && d.id !== truth.id &&
          !(e.related || []).includes(d.id) && !(d.related || []).includes(e.id) &&
          !decoys.some(x => x.id === d.id)) decoys.push(d);
    }
    return {
      kicker: "ORDEAL OF THE THREAD",
      q: "Which record does the archive bind directly to “" + e.title + "”?",
      opts: shuffle([truth, ...decoys]).map(x => ({ label: x.title, right: x.id === truth.id })),
      verdict: ok => (ok ? "Woven true. " : "The true thread runs to " + link(truth) + ". ") +
        link(e) + " (" + fmtY(e.startYear) + ") ⟷ " + link(truth) + " (" + fmtY(truth.startYear) + ")."
    };
  }
  function qHorizon() {
    const f = rnd(FUT);
    const decoys = [];
    let guard = 0;
    while (decoys.length < 3 && guard++ < 60) {
      const d = rnd(BIG.filter(e => e.startYear > 1400));
      if (!decoys.some(x => x.id === d.id)) decoys.push(d);
    }
    return {
      kicker: "ORDEAL OF THE HORIZON",
      q: "One of these has NOT happened yet. Which?",
      opts: shuffle([f, ...decoys]).map(x => ({ label: x.title, right: x.id === f.id })),
      verdict: ok => (ok ? "Correct — " : "It is ") + link(f) + ", anticipated " + fmtY(f.startYear) +
        ". " + (f.desc || "").split(". ")[0] + "."
    };
  }

  /* ---------- the trial ---------- */
  const FORGES = [qPrecedence, qDate, qThread, qHorizon];
  let round = [], idx = 0, score = 0, streak = 0, best = 0;

  function newTrial() {
    round = [];
    /* a balanced draw: 3 precedence, 3 dates, 2 threads, 2 horizon — shuffled */
    [qPrecedence, qPrecedence, qPrecedence, qDate, qDate, qDate, qThread, qThread, qHorizon, qHorizon]
      .forEach(f => round.push(f()));
    round = shuffle(round);
    idx = 0; score = 0; streak = 0; best = 0;
    document.getElementById("tr-final").style.display = "none";
    show();
  }

  function show() {
    const Q = round[idx];
    document.getElementById("tr-n").textContent = idx + 1;
    document.getElementById("tr-score").textContent = score;
    document.getElementById("tr-streak").textContent = streak >= 2 ? "🔥 streak " + streak : "";
    document.getElementById("tr-fill").style.width = (idx / 10 * 100) + "%";
    document.getElementById("tr-kicker").textContent = Q.kicker;
    document.getElementById("tr-q").textContent = Q.q;
    const box = document.getElementById("tr-opts");
    box.innerHTML = "";
    const v = document.getElementById("tr-verdict");
    v.style.display = "none"; v.innerHTML = "";
    document.getElementById("tr-next").style.display = "none";
    document.getElementById("tr-kicker").style.display = "";
    document.getElementById("tr-q").style.display = "";
    box.style.display = "";
    Q.opts.forEach(o => {
      const b = document.createElement("button");
      b.className = "tr-opt";
      b.textContent = o.label;
      b.addEventListener("click", () => answer(o, b, Q));
      box.appendChild(b);
    });
  }

  function answer(o, btn, Q) {
    const btns = [...document.querySelectorAll(".tr-opt")];
    btns.forEach(b => b.disabled = true);
    btns.forEach((b, i) => {
      const opt = Q.opts[i];
      if (opt.right) b.classList.add("right");
      else if (b === btn) b.classList.add("wrong");
      else b.classList.add("faded");
    });
    if (o.right) { score++; streak++; best = Math.max(best, streak); } else streak = 0;
    document.getElementById("tr-score").textContent = score;
    const v = document.getElementById("tr-verdict");
    v.innerHTML = Q.verdict(o.right);
    v.style.display = "block";
    const nx = document.getElementById("tr-next");
    nx.textContent = idx === 9 ? "Hear the judgement ▶" : "Next question ▶";
    nx.style.display = "block";
    nx.focus();
  }

  function judge() {
    document.getElementById("tr-fill").style.width = "100%";
    ["tr-kicker", "tr-q"].forEach(i2 => document.getElementById(i2).style.display = "none");
    document.getElementById("tr-opts").style.display = "none";
    document.getElementById("tr-verdict").style.display = "none";
    document.getElementById("tr-next").style.display = "none";
    const ranks = [
      [10, "ORACLE", "Flawless. The archive suspects you wrote it."],
      [8, "ARCHIVIST", "You walk the stacks like you shelved them yourself."],
      [6, "SCRIBE", "A steady hand. The deep past still hides a few things from you."],
      [4, "INITIATE", "The door is open; the library is long. Take a tour."],
      [0, "WANDERER", "History happened to other people, apparently. The Codex awaits."]
    ];
    const [, rank, sub] = ranks.find(([min]) => score >= min);
    document.getElementById("tr-rank").textContent = rank;
    document.getElementById("tr-sub").innerHTML = "You answered <b>" + score + " of 10</b>" +
      (best >= 3 ? " with a streak of " + best : "") +
      ".<br>" + sub + "<br><span style='font-size:12px;color:#59617c'>Every trial draws fresh questions from all 548 records.</span>";
    document.getElementById("tr-final").style.display = "block";
  }

  document.getElementById("tr-next").addEventListener("click", () => {
    if (idx === 9) return judge();
    idx++; show();
  });
  document.getElementById("tr-again").addEventListener("click", newTrial);
  newTrial();
})();
