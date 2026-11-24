/* ============================================================
   ARCHIVUS — THE ORACLE (v14, redrawn v14.1)
   What the whole record points to. Four views of one file of
   words (src/data/oracle.js) over two kinds of numbers:
     · long-run world series    — src/data/oracle-series.js
     · the Archive's own record — democracy since 1789 (realms.js),
       regimes ended by force (coups-record.js), the Conflicts, and
       the events themselves (polities, pandemics, inventions)
   Views:
     · the Reading  — the loom (every line on one frame, 10,000 BCE to 2100), the
                      deductions, and the ledger of all the lines
     · the Lines    — each line in full: the charts, what the record
                      shows, what it points to (graded), the case
                      against, what to watch
     · the Horizon  — every dated expectation in the Archive, sorted
                      by the kind of knowledge it rests on
     · Method       — the rules, the limits, the Archive's own lean,
                      every source
   No figure in a sentence is typed in: facts() computes them all and
   fill() writes them into the {{tokens}}. Nothing is cut to a recent
   window: every chart starts at its source's first year.
   Deep link:  oracle.html#v=lines&i=climate   oracle.html#v=horizon&e=agi-median
   ============================================================ */
(function () {
  "use strict";
  const W0 = window, K = W0.ARCHIVUS_KIT || {}, O = W0.ARCHIVUS_ORACLE, SS = W0.ARCHIVUS_ORACLE_SERIES;
  const R = W0.ARCHIVUS_REALMS, CR = W0.ARCHIVUS_COUPS_RECORD, CF = W0.ARCHIVUS_CONFLICTS, EVS = W0.ARCHIVUS_EVENTS || [], ERAS = W0.ARCHIVUS_ERAS || [];
  const EB = {}; EVS.forEach(e => { EB[e.id] = e; });
  const NOW = +O.asOf.slice(0, 4);
  const S = {}; Object.keys(SS.s).forEach(k => { S[k] = SS.s[k].d; });        /* key → [[year, value], …] */
  const GR = {}; O.grades.forEach((g, i) => { GR[g.id] = Object.assign({ i }, g); });
  const HC = {}; O.horizon.classes.forEach(c => { HC[c.id] = c; });
  const LB = {}; O.lines.forEach(l => { LB[l.id] = l; });

  /* ---------------- small helpers ---------------- */
  const at = (k, y) => { const r = S[k].find(p => p[0] === y); return r ? r[1] : null; };
  const near = (k, y) => S[k].reduce((a, p) => Math.abs(p[0] - y) < Math.abs(a[0] - y) ? p : a);
  const last = k => S[k][S[k].length - 1], first = k => S[k][0];
  const maxP = (k, f) => S[k].filter(f || (() => true)).reduce((a, p) => p[1] > a[1] ? p : a);
  const minP = (k, f) => S[k].filter(f || (() => true)).reduce((a, p) => p[1] < a[1] ? p : a);
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  const int = v => Math.round(v).toLocaleString("en-US");
  const ppl = v => v >= 1e9 ? (v / 1e9).toFixed(v >= 1e10 ? 1 : 2) + " billion" : v >= 1e7 ? Math.round(v / 1e6) + " million" : (v / 1e6).toFixed(1) + " million";
  const p01 = v => v < 10 ? v.toFixed(1) : String(Math.round(v));
  const list = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  const quant = (sorted, f) => { const i = (sorted.length - 1) * f, lo = Math.floor(i); return sorted[lo] + (sorted[Math.min(lo + 1, sorted.length - 1)] - sorted[lo]) * (i - lo); };
  const yearLabel = y => y <= -20000 ? Math.round(-y / 1000) + "k BCE" : y < 0 ? (-y).toLocaleString("en-US") + " BCE" : y <= 1 ? "1 CE" : String(y);
  /* least-squares line through a series between two years: [intercept, slope] */
  const fit = (k, from, to) => { const p = S[k].filter(r => r[0] >= from && r[0] <= to), mx = mean(p.map(r => r[0])), my = mean(p.map(r => r[1]));
    const b = p.reduce((s, r) => s + (r[0] - mx) * (r[1] - my), 0) / p.reduce((s, r) => s + (r[0] - mx) * (r[0] - mx), 0); return [my - b * mx, b]; };

  /* ---------------- the Archive's own record, as series ---------------- */
  const Wd = R.world;
  S["a.ldi"] = Wd.ldi.map((v, i) => [Wd.y0 + i, v]); S["a.edi"] = Wd.edi.map((v, i) => [Wd.y0 + i, v]);
  /* the ebbs of democracy: each crest of the world average since 1900 (highest value within twelve years either side) and
     the trough that follows it. The sample changes in 1900, so nothing before it is read as a wave. */
  const EBBS = (function () {
    const a = S["a.ldi"], pk = [], tr = [];
    a.forEach((p, i) => { if (p[0] < 1901) return; const w = a.slice(Math.max(0, i - 12), i + 13).map(q => q[1]);
      if (p[1] === Math.max.apply(null, w) && (!pk.length || p[0] - pk[pk.length - 1][0] > 12)) pk.push(p);
      if (p[1] === Math.min.apply(null, w) && p[0] > 1920 && i < a.length - 5 && (!tr.length || p[0] - tr[tr.length - 1][0] > 12)) tr.push(p); });
    return pk.map(p => { const t = tr.find(q => q[0] > p[0]) || null, end = t || a[a.length - 1]; return { from: p[0], to: end[0], top: p[1], low: end[1], open: !t }; });
  })();
  /* regimes ended by force per 100 states a year, by decade */
  const FORCE = (function () {
    const out = [];
    for (let d = 1790; d <= CR.meta.last; d += 10) { let n = 0, sy = 0; for (let y = d; y < d + 10 && y <= CR.meta.last; y++) sy += Wd.n[y - Wd.y0] || 0;
      CR.ends.forEach(e => { if (e[1] >= d && e[1] < d + 10) n++; }); out.push({ d, n, sy, rate: 100 * n / sy, part: d + 9 > CR.meta.last }); }
    return out;
  })();
  S["a.force"] = FORCE.map(f => [f.d, +f.rate.toFixed(2)]);
  const TH = O.threads;
  const POL = TH.polities.map(id => ({ id, n: TH.names[id] || EB[id].title, s: EB[id].startYear, e: EB[id].endYear, dur: EB[id].endYear - EB[id].startYear })).sort((a, b) => a.s - b.s);
  const STAND = TH.standing.map(s => ({ id: s[0], n: s[1], s: EB[s[0]].startYear, e: NOW, dur: NOW - EB[s[0]].startYear, open: 1 }));
  const thread = t => t.map(s => ({ id: s[0], n: s[1], y: EB[s[0]].startYear }));
  const PLAGUES = thread(TH.plagues), INFO = thread(TH.info);
  const gaps = a => a.slice(1).map((p, i) => p.y - a[i].y);
  const HZ = EVS.filter(e => O.horizon.of[e.id]).map(e => ({ e, c: O.horizon.of[e.id] })).sort((a, b) => a.e.startYear - b.e.startYear);

  /* ---------------- facts: every number a sentence uses ---------------- */
  function facts() {
    const F = {}, pr = "popProj";
    /* people */
    F.p10k = ppl(at("pop", -10000)); F.p0 = ppl(at("pop", 0)); F.p1800 = ppl(at("pop", 1800)); F.p1950 = ppl(at("pop", 1950)); F.pNow = ppl(last("pop")[1]); F.pNowY = last("pop")[0];
    const lp = S.pop.length; F.gr65 = (100 * (Math.pow(at("pop", 1970) / at("pop", 1965), 1 / 5) - 1)).toFixed(1); F.grNow = (100 * (Math.pow(S.pop[lp - 1][1] / S.pop[lp - 2][1], 1 / (S.pop[lp - 1][0] - S.pop[lp - 2][0])) - 1)).toFixed(1);
    F.f65 = at("fert", 1965).toFixed(1); F.fNow = last("fert")[1].toFixed(2); F.fNowY = last("fert")[0]; F.f2100 = at("fertProj", 2100).toFixed(2);
    F.a1970 = Math.round(at("age", 1970)); F.aNow = Math.round(near("ageProj", NOW)[1]); F.a2050 = Math.round(at("ageProj", 2050)); F.a2100 = Math.round(at("ageProj", 2100));
    F.u1800 = p01(at("urban", 1800)); F.u1900 = p01(at("urban", 1900)); F.uNow = p01(last("urban")[1]); F.uHalf = S.urban.find(p => p[1] >= 50)[0];
    F.p2050 = ppl(at(pr, 2050)); const pk = maxP(pr); F.pPeak = (pk[1] / 1e9).toFixed(1) + " billion"; F.pPeakDec = Math.floor(pk[0] / 10) * 10 + "s";
    /* life and wealth */
    F.l1800 = Math.round(at("life", 1800)); F.l1950 = Math.round(at("life", 1950)); F.lNow = Math.round(last("life")[1]); F.lNowY = last("life")[0];
    F.l1955 = at("life", 1955).toFixed(1); F.l1960 = at("life", 1960).toFixed(1); F.l1965 = at("life", 1965).toFixed(1);
    F.c1800 = p01(at("child", 1800)); F.c1950 = p01(at("child", 1950)); F.cNow = p01(last("child")[1]); F.cNowY = last("child")[0];
    F.pv1820 = p01(at("poor", 1820)); F.pv1950 = p01(at("poor", 1950)); F.pvNow = p01(last("poor")[1]); F.pvNowY = last("poor")[0];
    const pvp = maxP("poorN"); F.pvPeakN = ppl(pvp[1]); F.pvPeakY = pvp[0]; F.pvNowN = ppl(last("poorN")[1]);
    F.lit1820 = p01(at("lit", 1820)); F.litNow = p01(last("lit")[1]); F.litNowY = last("lit")[0];
    F.gX = Math.round(last("gdppc")[1] / at("gdppc", 1820)); F.gNowY = last("gdppc")[0];
    /* energy */
    F.e1800 = int(at("enTot", 1800)); F.eNow = int(last("enTot")[1]); F.eNowY = last("enTot")[0]; F.eX = Math.round(last("enTot")[1] / at("enTot", 1800));
    const share = S.enFos.map((p, i) => [p[0], 100 * p[1] / S.enTot[i][1]]), sp = share.reduce((a, p) => p[1] > a[1] ? p : a);
    F.fosNow = Math.round(share[share.length - 1][1]); F.fosPk = Math.round(sp[1]); F.fosPkY = sp[0]; F.fosRecY = maxP("enFos")[0];
    F.bioX = (last("enBio")[1] / at("enBio", 1800)).toFixed(1); F.lowX = Math.round(last("enLow")[1] / at("enLow", 1965));
    const falls = S.enFos.slice(1).map((p, i) => p[1] < S.enFos[i][1] ? S.enFos[i][0] + "–" + p[0] : null).filter(Boolean); F.fosFall = falls.join(", ") || "none";
    const rl = minP("renew"); F.rn1900 = Math.round(at("renew", 1900)); F.rnLow = Math.round(rl[1]); F.rnLowY = rl[0]; F.rnNow = Math.round(last("renew")[1]);
    F.sol0 = Math.round(first("solar")[1]); F.solNow = last("solar")[1].toFixed(2); F.solX = (100 * (1 - last("solar")[1] / first("solar")[1])).toFixed(1);
    /* climate */
    F.ppmNow = Math.round(last("ppm")[1]); F.ppmNowY = last("ppm")[0]; F.ppmPre = Math.round(maxP("ppm", p => p[0] < 1800)[1]); F.ppm1750 = Math.round(near("ppm", 1750)[1]);
    F.co21950 = at("co2e", 1950).toFixed(1); F.co2Now = last("co2e")[1].toFixed(1); F.co2NowY = last("co2e")[0];
    const done = p => p[0] < NOW, tm = maxP("temp", done), tf = fit("temp", NOW - 30, NOW - 1);       /* the current year is incomplete and is left out of every statistic */
    F.tMax = tm[1].toFixed(2); F.tMaxY = tm[0]; F.t10 = mean(S.temp.filter(p => p[0] >= NOW - 10 && done(p)).map(p => p[1])).toFixed(2);
    F.tSlope = (tf[1] * 10).toFixed(2); F.t15Y = Math.round((1.5 - tf[0]) / tf[1]); F.t2Y = Math.round((2 - tf[0]) / tf[1]);
    /* war */
    const wt = S.warDead.reduce((s, p) => s + p[1], 0), ww = S.warDead.filter(p => (p[0] >= 1914 && p[0] <= 1918) || (p[0] >= 1939 && p[0] <= 1945)).reduce((s, p) => s + p[1], 0);
    F.mTot = Math.round(wt / 1e6) + " million"; F.mShare = Math.round(100 * ww / wt);
    const rm = minP("warRate"), r22 = at("warRate", 2022), dec = d => mean(S.warRate.filter(p => p[0] >= d && p[0] < d + 10).map(p => p[1]));
    F.r1950 = Math.round(at("warRate", 1950)); F.rMin = rm[1].toFixed(2); F.rMinY = rm[0]; F.r2022 = r22.toFixed(1); F.rSince = S.warRate.filter(p => p[0] < 2022 && p[1] >= r22).pop()[0]; F.rNow = last("warRate")[1].toFixed(1);
    F.r2020s = dec(2020).toFixed(1); F.r1980s = dec(1980).toFixed(1);
    const nm = minP("nConf"); F.ncNow = last("nConf")[1]; F.ncNowY = last("nConf")[0]; F.ncMin = nm[1]; F.ncMinY = nm[0]; F.niNow = last("nInter")[1];
    const np = maxP("nukes"), rise = S.nukes.filter((p, i) => i && p[0] > np[0] && p[1] > S.nukes[i - 1][1]);
    F.nkPk = int(np[1]); F.nkPkY = np[0]; F.nkNow = int(last("nukes")[1]); F.nkCut = Math.round(100 * (1 - last("nukes")[1] / np[1])); F.nkRiseY = rise.length ? rise[0][0] : "—";
    F.cfN = CF.list.length; F.cfWar = CF.list.filter(c => c.lv >= 4).length;
    /* power: shares of world output */
    const cnL = minP("pwCN"), usP = maxP("pwUS"), ukP = maxP("pwUK"), jpP = maxP("pwJP"), inL = minP("pwIN"), s1 = v => v.toFixed(1), pwY = last("pwCN")[0];
    F.pwNowY = pwY; F.cn1820 = s1(at("pwCN", 1820)); F.cnLow = s1(cnL[1]); F.cnLowY = cnL[0]; F.cnNow = s1(last("pwCN")[1]); F.cn2020 = s1(at("pwCN", 2020));
    F.us1820 = s1(at("pwUS", 1820)); F.usPk = s1(usP[1]); F.usPkY = usP[0]; F.usNow = s1(last("pwUS")[1]); F.ukPk = s1(ukP[1]); F.ukPkY = ukP[0]; F.ukNow = s1(last("pwUK")[1]); F.jpPk = s1(jpP[1]); F.jpPkY = jpP[0]; F.jpNow = s1(last("pwJP")[1]);
    F.in1850 = s1(at("pwIN", 1850)); F.inLow = s1(inL[1]); F.inLowY = inL[0]; F.inNow = s1(last("pwIN")[1]);
    const cross = S.pwCN.findIndex((p, i) => i && p[0] > usP[0] && p[1] > at("pwUS", p[0]) && S.pwCN[i - 1][1] <= at("pwUS", S.pwCN[i - 1][0])); F.xA = S.pwCN[cross - 1][0]; F.xB = S.pwCN[cross][0];
    const both = S.pwIN.filter(p => at("pwCN", p[0]) != null).map(p => [p[0], p[1] + at("pwCN", p[0])]), ciL = both.reduce((a, p) => p[1] < a[1] ? p : a);
    F.ci1850 = s1(both.find(p => p[0] === 1850)[1]); F.ciLow = s1(ciL[1]); F.ciLowY = ciL[0]; F.ciNow = s1(both[both.length - 1][1]);
    F.inLikeCnY = S.pwCN.filter(p => p[0] >= cnL[0]).reduce((a, p) => Math.abs(p[1] - last("pwIN")[1]) < Math.abs(a[1] - last("pwIN")[1]) ? p : a)[0];
    F.cnGainA = ((at("pwCN", 2020) - at("pwCN", 2010)) / 10).toFixed(1); F.cnGainB = ((last("pwCN")[1] - at("pwCN", 2020)) / (pwY - 2020)).toFixed(1);
    F.inDecadesUp = [1990, 2000, 2010, 2020].every((y, i, a) => at("pwIN", y) > at("pwIN", i ? a[i - 1] : inL[0])) && last("pwIN")[1] > at("pwIN", 2020) ? 1 : 0;      /* checked by the validator */
    F.gpwYrs = NOW - 1945;
    /* rule */
    const L = S["a.ldi"], cur = EBBS[EBBS.length - 1], pct = e => Math.round(100 * (1 - e.low / e.top));
    F.d1789 = L[0][1].toFixed(2); F.dPk = cur.top.toFixed(2); F.dPkY = cur.from; F.dNow = L[L.length - 1][1].toFixed(2); F.dNowY = L[L.length - 1][0]; F.dDrop = pct(cur); F.ebbLen = cur.to - cur.from;
    F.e1 = EBBS[0].from + " to " + EBBS[0].to; F.e1drop = pct(EBBS[0]); F.e1len = EBBS[0].to - EBBS[0].from; F.e2 = EBBS[1].from + " to " + EBBS[1].to; F.e2drop = pct(EBBS[1]); F.e2len = EBBS[1].to - EBBS[1].from;
    F.crests = EBBS.map(e => e.top.toFixed(2)).join(", "); F.troughs = EBBS.filter(e => !e.open).map(e => e.low.toFixed(2)).join(", ");
    const C = R.countries; F.fell = C.filter(c => c.d5 != null && c.d5 <= -0.05).length; F.rose = C.filter(c => c.d5 != null && c.d5 >= 0.05).length;
    [0, 1, 2, 3].forEach(k => { F["rc" + k] = C.filter(c => c.row === k).length; }); F.demNow = F.rc2 + F.rc3;
    let pre = 0; for (let y = 1900; y < 1990; y++) { const n = C.filter(c => c.hr && (c.hr[y - R.meta.y0] === "2" || c.hr[y - R.meta.y0] === "3")).length; if (n > pre) pre = n; } F.demPre90 = pre;
    F.dN0 = Wd.n[0]; F.dN1 = Wd.n[Wd.n.length - 1];
    /* force */
    const fr = d => FORCE.find(f => f.d === d).rate.toFixed(1), name = f => f.d + "s", by = FORCE.slice().sort((a, b) => a.rate - b.rate);
    F.feN = int(CR.ends.length); F.fr1800s = fr(1800); F.fr1940s = fr(1940); F.fr1960s = fr(1960); F.fr2010s = fr(2010); F.fr2020s = fr(2020);
    F.frMaxDec = name(by[by.length - 1]); F.frMinDec = name(by[0]); F.frCalm = list(by.slice(0, 4).sort((a, b) => a.d - b.d).map(name)); F.fe2020n = CR.ends.filter(e => e[1] >= 2020).length;
    F.calmThisCentury = by.slice(0, 4).filter(f => f.d >= 2000).length;                         /* checked by the validator against the verdict */
    const inc = CR.stats.income.quartiles; F.coupPoor = (100 * inc[0][3] / inc[0][2]).toFixed(1); F.coupRich = (100 * inc[3][3] / inc[3][2]).toFixed(1); F.coupLib = CR.stats.byRegime[3][2];
    /* orders */
    const du = POL.map(p => p.dur).sort((a, b) => a - b), mx = POL.reduce((a, p) => p.dur > a.dur ? p : a), age = id => STAND.find(s => s.id === id).dur;
    F.polN = POL.length; F.polMed = Math.round(quant(du, 0.5)); F.polQ1 = Math.round(quant(du, 0.25)); F.polQ3 = Math.round(quant(du, 0.75)); F.polMaxN = "the " + mx.n; F.polMax = int(mx.dur);
    F.usAge = age("usconst"); F.trAge = age("ataturk"); F.unAge = age("un"); F.inAge = age("indiaind"); F.prcAge = age("chinarev"); F.euAge = age("eu");
    F.usVs = Math.abs(F.usAge - F.polMed) <= 0.15 * F.polMed ? "close to" : F.usAge < F.polMed ? "below" : "above";
    /* plagues */
    const mod = PLAGUES.filter(p => p.y >= 1817);
    F.plN = PLAGUES.length; F.plSince = NOW - PLAGUES[PLAGUES.length - 1].y; F.plList = list(PLAGUES.map(p => p.n + " (" + p.y + ")")); F.plGaps = list(gaps(PLAGUES).map(int));
    F.plModN = mod.length; F.plModSpan = NOW - mod[0].y; F.plRate = Math.round(F.plModSpan / F.plModN) + " years";
    /* machines */
    F.infoList = INFO[0].n + " (" + yearLabel(INFO[0].y) + "); " + gaps(INFO).map((g, i) => int(g) + (i ? "" : " years") + " to " + INFO[i + 1].n).join("; ");
    const c0 = first("chips"), c1 = last("chips"), f0 = first("flops"), f1 = last("flops"), n0 = first("net"), n1 = last("net");
    F.chX = Math.round(c1[1] / c0[1] / 1e6) + " million"; F.chDbl = ((c1[0] - c0[0]) / Math.log2(c1[1] / c0[1])).toFixed(1); F.flDbl = ((f1[0] - f0[0]) / Math.log2(f1[1] / f0[1])).toFixed(1);
    F.n2005 = Math.round(n0[1]); F.nNow = Math.round(n1[1]); F.nNowY = n1[0]; F.net90Y = Math.round(n1[0] + (90 - n1[1]) / ((n1[1] - n0[1]) / (n1[0] - n0[0])));
    F.agiY = EB["agi-median"].startYear; F.singY = EB["singularity-claim"].startYear;
    return F;
  }
  const F = facts(), MISSING = [];
  const fill = s => String(s).replace(/\{\{(\w+)\}\}/g, (m, k) => F[k] != null ? F[k] : (MISSING.push(k), "?"));
  W0.ARCHIVUS_ORACLE_FACTS = F; W0.ARCHIVUS_ORACLE_CHECK = { fill, MISSING, EBBS, FORCE, POL, PLAGUES, INFO, HZ };
  if (typeof document === "undefined") return;                       /* the validator stops here */

  const $ = K.$, esc = K.esc, T = s => esc(fill(s));
  const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen"], nWord = n => WORDS[n] || String(n);
  const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const WHEN = +O.asOf.slice(8) + " " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][+O.asOf.slice(5, 7) - 1] + " " + O.asOf.slice(0, 4);
  /* one small engraved sign per line (16-unit box, drawn in the line's own colour) */
  const ICON = {
    power: '<circle cx="8" cy="8" r="6.2"/><path d="M8 1.8v1.8M8 12.4v1.8M1.8 8h1.8M12.4 8h1.8M6.2 9.8l1.1-3.5 3.5-1.1-1.1 3.5z"/>',
    orders: '<path d="M2 5.8L8 2.2l6 3.6M3 6.6h10M4.3 7v5.2M8 7v5.2M11.7 7v5.2M2.5 13.2h11"/>',
    war: '<path d="M2.5 2.5l8.2 8.2M13.5 2.5l-8.2 8.2M9.2 12.2l3-3M6.8 12.2l-3-3M11.6 11.6l1.9 1.9M4.4 11.6l-1.9 1.9"/>',
    rule: '<path d="M8 2.2v11.4M3 4.8h10M5.4 13.6h5.2M3 4.8L1.4 9a1.7 1.7 0 0 0 3.2 0zM13 4.8L11.4 9a1.7 1.7 0 0 0 3.2 0z"/>',
    force: '<path d="M2.6 11.4L2 5.2l3.4 2.6L8 3.4l2.6 4.4L14 5.2l-.6 6.2zM3.2 13.6h9.6"/>',
    machines: '<rect x="4.4" y="4.4" width="7.2" height="7.2" rx="1"/><path d="M6.6 1.8v2.6M9.4 1.8v2.6M6.6 11.6v2.6M9.4 11.6v2.6M1.8 6.6h2.6M1.8 9.4h2.6M11.6 6.6h2.6M11.6 9.4h2.6"/>',
    life: '<path d="M8 13.6C3.8 10.6 2 8.3 2 6.1a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2.2-1.8 4.5-6 7.5z"/>',
    people: '<circle cx="5.6" cy="5" r="2"/><circle cx="11.2" cy="5.8" r="1.6"/><path d="M1.8 13.4c0-2.6 1.7-4.2 3.8-4.2s3.8 1.6 3.8 4.2M10.4 9.6c.3-.1.6-.1.9-.1 1.7 0 3 1.4 3 3.7"/>',
    plagues: '<circle cx="8" cy="8" r="3.3"/><path d="M8 1.6v3.1M8 11.3v3.1M1.6 8h3.1M11.3 8h3.1M3.5 3.5l2.2 2.2M10.3 10.3l2.2 2.2M12.5 3.5l-2.2 2.2M5.7 10.3l-2.2 2.2"/>',
    energy: '<path d="M9.2 1.6L3.6 9h4l-.8 5.4L12.4 7h-4z"/>',
    climate: '<path d="M8 2a1.6 1.6 0 0 0-1.6 1.6v5.1a3 3 0 1 0 3.2 0V3.6A1.6 1.6 0 0 0 8 2zM8 6.2v4.6"/>'
  };
  const icon = id => '<svg class="or-ic" viewBox="0 0 16 16" aria-hidden="true">' + ICON[id] + "</svg>";
  let uid = 0;

  /* ---------------- number formats ---------------- */
  const big = v => v >= 1e12 ? (v / 1e12).toFixed(v >= 1e13 ? 0 : 1) + " tn" : v >= 1e9 ? (v / 1e9).toFixed(v >= 1e10 ? 0 : 1) + " bn" : v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + " m" : v >= 1e4 ? Math.round(v / 1e3) + "k" : int(v);
  const FMT = {
    people: v => big(v), big: v => big(v), int: v => v >= 1e6 ? big(v) : int(v), twh: v => v >= 1e4 ? Math.round(v / 1e3) + "k" : int(v),
    pct: v => (v < 10 && v % 1 ? v.toFixed(1) : Math.round(v)) + "%", pct1: v => v.toFixed(1) + "%", num0: v => String(Math.round(v)), num1: v => v.toFixed(1), num2: v => v.toFixed(2), ppm: v => String(Math.round(v)),
    usd: v => "$" + big(v), usd2: v => "$" + (v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : Math.round(v)), gt: v => v < 10 ? v.toFixed(1) : String(Math.round(v)),
    degc: v => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(1) + "°"
  };

  /* ---------------- charts ---------------- */
  /* the time axis. With `breaks` it is cut into equal-width panels, each linear inside itself, so 12,000 years and the last
     75 share one frame; the cuts are drawn. Without, it is one linear span. */
  function axis(c, L, pw) {
    const B = c.breaks || [c.x0, c.x1], n = B.length - 1, w = c.weights || B.slice(1).map(() => 1), cum = [0]; w.forEach(v => cum.push(cum[cum.length - 1] + v)); const tot = cum[n];   /* panels may be given unequal widths */
    const x = yr => { let i = 0; while (i < n - 1 && yr > B[i + 1]) i++; return L + (cum[i] + K.clamp((yr - B[i]) / (B[i + 1] - B[i]), 0, 1) * w[i]) / tot * pw; };
    const inv = px => { const u = K.clamp((px - L) / pw, 0, 0.9999) * tot; let i = 0; while (i < n - 1 && u > cum[i + 1]) i++; return B[i] + (u - cum[i]) / w[i] * (B[i + 1] - B[i]); };
    return { x, inv, B, n, broken: !!c.breaks };
  }
  function xTicks(ax, W, T0, ph, H) {
    let h = "";
    if (ax.broken) { const wd = b => yearLabel(b).length * 6.2 + 8, endL = ax.x(ax.B[ax.n]) - wd(ax.B[ax.n]); let right = -1e9;
      ax.B.forEach((b, i) => { const X = ax.x(b), a = i === 0 ? "start" : i === ax.n ? "end" : "middle", l = i === 0 ? X : X - wd(b) / 2;
        if (i && i < ax.n) h += '<line class="cut" x1="' + X + '" x2="' + X + '" y1="' + T0 + '" y2="' + (T0 + ph) + '"/>';
        if (i && i < ax.n && (l < right || X + wd(b) / 2 > endL)) return;                 /* the two ends always; an inner label only where it has room */
        right = i === 0 ? X + wd(b) : X + wd(b) / 2; h += '<text x="' + X + '" y="' + (H - 5) + '" text-anchor="' + a + '">' + yearLabel(b) + "</text>"; }); }
    else { const span = ax.B[1] - ax.B[0], want = W < 520 ? 4 : 8, step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find(s => span / s <= want) || 1000;
      for (let y = Math.ceil(ax.B[0] / step) * step; y <= ax.B[1]; y += step) h += '<text x="' + ax.x(y) + '" y="' + (H - 5) + '" text-anchor="middle">' + y + "</text>"; }
    return h;
  }
  const future = (ax, x1, T0, ph) => { if (ax.B[ax.n] <= NOW) return ""; const X = ax.x(NOW + 0.9), w = x1 - X;
    return '<rect class="fut" x="' + X + '" y="' + T0 + '" width="' + w + '" height="' + ph + '"/>' + (w > 96 ? '<text class="futt" x="' + (X + 5) + '" y="' + (T0 + ph - 6) + '">not yet happened</text>' : ""); };
  /* a line with its light: a blurred copy underneath, the crisp stroke on top */
  const lit = (d, col, w, dash) => (dash ? "" : '<path class="glow" fill="none" stroke="' + col + '" stroke-width="' + (w + 3.5) + '" stroke-opacity=".5" filter="url(#or-glow)" d="' + d + '"/>')
    + '<path fill="none" stroke="' + col + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="5 4" stroke-opacity=".85"' : "") + ' stroke-linejoin="round" stroke-linecap="round" d="' + d + '"/>';
  const fade = (col, a) => { const id = "og" + (++uid); return { id, def: '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + col + '" stop-opacity="' + a + '"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></linearGradient>' }; };
  const ember = (x, y, col, r) => '<circle class="pulse" cx="' + x + '" cy="' + y + '" r="' + (r * 2.4) + '" fill="' + col + '" fill-opacity=".22"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + col + '"/>';

  function plot(c, W, H) {
    const f = FMT[c.f] || FMT.num1, fa = FMT[c.fa] || f, small = W < 520, L = 46, Rm = c.endLabels ? (small ? 50 : 134) : 14, T0 = 12, B0 = 22, pw = W - L - Rm, ph = H - T0 - B0, ax = axis(c, L, pw), lo = ax.B[0], hi = ax.B[ax.n];
    let ser = c.series.map(s => ({ s, p: S[s.k].filter(p => p[0] >= lo && p[0] <= hi) }));
    if (c.stack) { const acc = ser[0].p.map(() => 0); ser = ser.map(o => ({ s: o.s, p: o.p, base: acc.slice(), top: o.p.map((p, i) => (acc[i] += p[1])) })); }
    const vals = [].concat.apply([], ser.map(o => o.top || o.p.map(p => p[1]))), log = c.y === "log";
    const y0 = c.y0 != null ? c.y0 : log ? Math.pow(10, Math.floor(Math.log10(Math.min.apply(null, vals.filter(v => v > 0))))) : Math.min(0, Math.min.apply(null, vals));
    const y1 = c.y1 != null ? c.y1 : log ? Math.pow(10, Math.ceil(Math.log10(Math.max.apply(null, vals)))) : Math.max.apply(null, vals) * 1.06;
    const y = v => log ? T0 + ph - (Math.log10(Math.max(v, y0)) - Math.log10(y0)) / (Math.log10(y1) - Math.log10(y0)) * ph : T0 + ph - (v - y0) / (y1 - y0) * ph;
    let h = future(ax, W - Rm, T0, ph), defs = "", gl = [], ends = [];
    if (log) { const d0 = Math.round(Math.log10(y0)), d1 = Math.floor(Math.log10(y1) + 1e-9), st = Math.ceil((d1 - d0) / 6); for (let d = d0; d <= d1; d += st) gl.push(Math.pow(10, d)); }
    else { const span = y1 - y0, st = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 25, 50, 100, 1e3, 1e4, 2e4, 5e4, 1e5].find(s => span / s <= 6) || span / 5; for (let v = Math.ceil(y0 / st - 1e-9) * st; v <= y1 + 1e-9; v += st) gl.push(+v.toFixed(6)); }
    gl.forEach(v => { h += '<line class="gl" x1="' + L + '" x2="' + (W - Rm) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="' + (L - 6) + '" y="' + (y(v) + 3) + '" text-anchor="end">' + fa(v) + "</text>"; });
    h += xTicks(ax, W, T0, ph, H);
    if (c.bands) (c.bands === "a.ebbs" ? EBBS : []).forEach(e => { h += '<rect class="band" x="' + ax.x(e.from) + '" y="' + T0 + '" width="' + (ax.x(e.to) - ax.x(e.from)) + '" height="' + ph + '"/><text class="mkt" x="' + (ax.x(e.from) + 3) + '" y="' + (T0 + 10) + '">' + e.from + "–" + (e.open ? "" : String(e.to).slice(2)) + "</text>"; });
    (c.marks || []).forEach((m, i) => { if (m[0] < lo || m[0] > hi) return; const X = ax.x(m[0]); h += '<line class="mk" x1="' + X + '" x2="' + X + '" y1="' + T0 + '" y2="' + (T0 + ph) + '"/><text class="mkt" x="' + (X - 4) + '" y="' + (T0 + 10 + (i % 2) * 11) + '" text-anchor="end">' + esc(m[1]) + "</text>"; });
    [c.level, c.level2].forEach(l => { if (l) h += '<line class="lvl" x1="' + L + '" x2="' + (W - Rm) + '" y1="' + y(l[0]) + '" y2="' + y(l[0]) + '"/><text class="mkt" x="' + (L + 5) + '" y="' + (y(l[0]) - 4) + '">' + esc(l[1]) + "</text>"; });
    const solo = ser.filter(o => !o.s.dash).length === 1;
    ser.forEach(o => { if (!o.p.length) return; const top = o.top || o.p.map(p => p[1]), pts = o.p.map((p, i) => [ax.x(p[0]), y(top[i])]), col = o.s.c, e = pts[pts.length - 1];
      if (o.base) { const g = fade(col, 0.95); defs += g.def.replace('stop-opacity="0"', 'stop-opacity=".55"'); h += '<path fill="url(#' + g.id + ')" d="' + K.path(pts) + o.p.map((p, i) => [ax.x(p[0]), y(o.base[i])]).reverse().map(q => "L" + q[0].toFixed(1) + " " + q[1].toFixed(1)).join("") + 'Z"/>'; return; }
      if ((o.s.area || solo) && !o.s.dash) { const g = fade(col, 0.34); defs += g.def; h += '<path fill="url(#' + g.id + ')" d="' + K.path(pts) + "L" + e[0].toFixed(1) + " " + (T0 + ph) + "L" + pts[0][0].toFixed(1) + " " + (T0 + ph) + 'Z"/>'; }
      h += lit(K.path(pts), col, o.s.dash ? 1.6 : 2, o.s.dash);
      if (!o.s.dash) { h += ember(e[0], e[1], col, 3); if (c.endLabels) ends.push({ y: e[1], col, t: (small ? "" : o.s.n + " ") + f(top[top.length - 1]) }); } });
    if (c.trend) { const t = c.trend, ab = fit(t.k, t.from, t.to), col = c.series[0].c; h += '<line stroke="' + col + '" stroke-width="1.4" stroke-dasharray="5 4" x1="' + ax.x(t.from) + '" y1="' + y(ab[0] + ab[1] * t.from) + '" x2="' + ax.x(t.until) + '" y2="' + y(ab[0] + ab[1] * t.until) + '"/>'; }
    ends.sort((a, b) => a.y - b.y).forEach((e, i, a) => { if (i && e.y - a[i - 1].y < 13) e.y = a[i - 1].y + 13; h += '<text class="endl" x="' + (W - Rm + 9) + '" y="' + (e.y + 3.5) + '" fill="' + e.col + '">' + esc(e.t) + "</text>"; });
    h += '<line class="guide" x1="0" x2="0" y1="' + T0 + '" y2="' + (T0 + ph) + '" visibility="hidden"/>';
    return { svg: '<svg class="chart" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(c.t) + '"><defs>' + defs + "</defs>" + h + "</svg>",
      read: px => { const yr = ax.inv(px), out = []; let X = null, Y = null; ser.forEach(o => { if (!o.p.length) return; const p = o.p.reduce((a, q) => Math.abs(q[0] - yr) < Math.abs(a[0] - yr) ? q : a); if (Math.abs(ax.x(p[0]) - px) > 40) return; if (X == null) { X = ax.x(p[0]); Y = p[0]; } if (p[0] === Y) out.push(o.s.n + " " + f(p[1])); }); return X == null ? null : { x: X, t: yearLabel(Y) + " · " + out.join(" · ") }; } };
  }
  /* one bar per decade */
  function cols(c, W, H) {
    const d = FORCE, L = 40, Rm = 10, T0 = 16, B0 = 22, pw = W - L - Rm, ph = H - T0 - B0, bw = pw / d.length, mx = Math.ceil(Math.max.apply(null, d.map(f => f.rate)) / 2) * 2, y = v => T0 + ph - v / mx * ph;
    const gA = fade(c.c, 0.95), gB = fade("#e8c455", 1); let h = ""; for (let v = 0; v <= mx; v += 2) h += '<line class="gl" x1="' + L + '" x2="' + (W - Rm) + '" y1="' + y(v) + '" y2="' + y(v) + '"/><text x="' + (L - 6) + '" y="' + (y(v) + 3) + '" text-anchor="end">' + v + "</text>";
    d.forEach((f, i) => { const X = L + i * bw, now = f.d >= 2000;
      h += '<rect x="' + (X + 1.5) + '" y="' + y(f.rate) + '" width="' + Math.max(1, bw - 3) + '" height="' + (T0 + ph - y(f.rate)) + '" rx="2" fill="url(#' + (now ? gB.id : gA.id) + ')" opacity="' + (f.part ? ".7" : "1") + '"><title>' + f.d + "s: " + f.n + " regimes ended by force, " + f.rate.toFixed(2) + " per 100 states a year" + (f.part ? " (decade not over)" : "") + "</title></rect>";
      if (f.d % (W < 520 ? 50 : 20) === 0 || i === d.length - 1) h += '<text x="' + (X + bw / 2) + '" y="' + (H - 5) + '" text-anchor="middle">' + f.d + "s</text>";
      if (f.rate > mx * 0.8 || now) h += '<text class="lab" x="' + (X + bw / 2) + '" y="' + (y(f.rate) - 4) + '" text-anchor="middle">' + f.rate.toFixed(1) + "</text>"; });
    return { svg: '<svg class="chart" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(c.t) + '"><defs>' + gA.def.replace('stop-opacity="0"', 'stop-opacity=".45"') + gB.def.replace('stop-opacity="0"', 'stop-opacity=".5"') + "</defs>" + h + "</svg>",
      read: px => { const i = Math.floor((px - L) / bw), f = d[i]; return f ? { x: L + (i + 0.5) * bw, t: f.d + "s · " + f.n + " regimes ended by force · " + f.rate.toFixed(2) + " per 100 states a year" + (f.part ? " (decade not over)" : "") } : null; } };
  }
  /* one bar per polity, founding to fall */
  function gantt(c, W) {
    const rows = POL.concat(STAND), rh = W < 520 ? 12 : 14, L = 6, Rm = 8, T0 = 8, B0 = 22, H = T0 + rows.length * rh + B0, pw = W - L - Rm, ph = H - T0 - B0, ax = axis(c, L, pw);
    let h = xTicks(ax, W, T0, ph, H);
    rows.forEach((p, i) => { const x0 = ax.x(p.s), x1 = Math.max(ax.x(p.e), x0 + 2), yy = T0 + i * rh, col = p.open ? "#e8c455" : "#5b93b8", lab = esc(p.n) + " · " + int(p.dur), right = x1 + 6 + lab.length * 5.4 < W - Rm;
      h += (p.open ? '<rect class="glow" x="' + x0 + '" y="' + (yy + 2) + '" width="' + (x1 - x0) + '" height="' + (rh - 6) + '" fill="' + col + '" fill-opacity=".6" filter="url(#or-glow)"/>' : "")
        + '<rect x="' + x0 + '" y="' + (yy + 2) + '" width="' + (x1 - x0) + '" height="' + (rh - 6) + '" rx="2" fill="' + col + '" fill-opacity="' + (p.open ? ".95" : ".8") + '"><title>' + esc(p.n) + ": " + yearLabel(p.s) + " – " + (p.open ? "still standing" : yearLabel(p.e)) + " · " + int(p.dur) + " years</title></rect>"
        + '<text class="gt' + (p.open ? " on" : "") + '" x="' + (right ? x1 + 5 : x0 - 5) + '" y="' + (yy + rh - 4.5) + '" text-anchor="' + (right ? "start" : "end") + '">' + lab + "</text>"; });
    return { svg: '<svg class="chart" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(c.t) + '">' + h + "</svg>", read: null };
  }
  /* a thread of dated records and the years between them */
  function gapsChart(c, W) {
    const a = c.k === "a.info" ? INFO : PLAGUES, H = 184, L = 14, Rm = 14, T0 = 8, B0 = 22, pw = W - L - Rm, ph = H - T0 - B0, ax = axis(c, L, pw), base = T0 + 108, g = gaps(a);
    let h = xTicks(ax, W, T0, ph, H) + '<line class="thr" x1="' + ax.x(a[0].y) + '" x2="' + ax.x(a[a.length - 1].y) + '" y1="' + base + '" y2="' + base + '" stroke="' + c.c + '"/>', lastX = [-99, -99, -99, -99, -99];
    a.forEach((p, i) => { const X = ax.x(p.y), lab = p.n.replace(/^the /, ""), w = lab.length * 5.6 + 8, cx = K.clamp(X, L + w / 2, W - Rm - w / 2); let lv = 0; while (lv < 4 && cx - w / 2 < lastX[lv]) lv++; lastX[lv] = cx + w / 2;
      h += '<line class="mk" x1="' + X + '" x2="' + X + '" y1="' + (base - 12 - lv * 18) + '" y2="' + base + '"/>' + "<g><title>" + esc(p.n) + ", " + yearLabel(p.y) + "</title>" + ember(X, base, c.c, 3.6) + "</g>"
        + '<text class="gt on" x="' + cx + '" y="' + (base - 16 - lv * 18) + '" text-anchor="middle">' + esc(lab) + "</text>";
      if (i) { const X0 = ax.x(a[i - 1].y); if (X - X0 > 26) h += '<text class="gp" x="' + (X0 + X) / 2 + '" y="' + (base + 16) + '" text-anchor="middle">' + int(g[i - 1]) + (X - X0 > 60 ? " yrs" : "") + "</text>"; } });
    return { svg: '<svg class="chart" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(c.t) + '">' + h + "</svg>", read: null };
  }
  const DRAW = { cols, gantt, gaps: gapsChart };
  /* mount every .or-ch in a container at its measured width; move the guide and the read-out with the pointer */
  function mountCharts(box, charts) {
    box.querySelectorAll(".or-ch").forEach(el => { const c = charts[+el.dataset.c], host = el.querySelector(".or-host"), out = el.querySelector(".or-read"), W = Math.max(280, Math.floor(host.clientWidth)), H = innerWidth <= 700 ? 210 : c.tall ? 330 : 250;
      const r = (DRAW[c.type] || plot)(c, W, H); host.innerHTML = r.svg; if (!r.read) return;
      const g = host.querySelector(".guide"), rest = out.textContent;
      host.onpointermove = e => { const b = host.getBoundingClientRect(), hit = r.read(e.clientX - b.left); if (!hit) return; out.textContent = hit.t; out.classList.add("on"); if (g) { g.setAttribute("x1", hit.x); g.setAttribute("x2", hit.x); g.setAttribute("visibility", "visible"); } };
      host.onpointerleave = () => { out.textContent = rest; out.classList.remove("on"); if (g) g.setAttribute("visibility", "hidden"); }; });
  }
  const isWide = c => c.type === "gantt" || c.type === "gaps";
  const chartBlock = (c, i) => '<figure class="or-ch or-panel' + (isWide(c) ? " tall wide" : "") + '" data-c="' + i + '"><figcaption><b>' + esc(c.t) + "</b><small>" + esc(c.sub || "") + '</small></figcaption><div class="or-host"></div>'
    + '<div class="cleg">' + (c.series || []).map(s => '<span><i style="background:' + s.c + (s.dash ? ";opacity:.55" : "") + '"></i>' + esc(s.n) + "</span>").join("")
    + (c.type === "gantt" ? '<span><i style="background:#5b93b8"></i>ended</span><span><i style="background:#e8c455"></i>still standing</span>' : c.type === "cols" ? '<span><i style="background:' + c.c + '"></i>1790s–1990s</span><span><i style="background:#e8c455"></i>this century</span>' : "") + "</div>"
    + '<div class="or-read">' + (isWide(c) ? "hover a mark for its dates" : "move over the chart to read a year") + "</div></figure>";
  /* the whole of a series in 150 pixels */
  function spark(k, logY, col) {
    if (!k) return '<span class="or-none">see the line</span>';
    const d = S[k], W = 150, H = 28, x0 = d[0][0], x1 = d[d.length - 1][0], v = d.map(p => logY ? Math.log10(Math.max(p[1], 1e-9)) : p[1]), lo = Math.min.apply(null, v), hi = Math.max.apply(null, v);
    return '<div class="or-sp"><svg class="or-spark" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + yearLabel(x0) + " to " + x1 + '"><path stroke="' + col + '" d="' + K.path(d.map((p, i) => [1 + (p[0] - x0) / (x1 - x0) * (W - 2), H - 3 - (v[i] - lo) / (hi - lo || 1) * (H - 6)])) + '"/></svg><small>' + yearLabel(x0) + " – " + x1 + (logY ? " · log" : "") + "</small></div>";
  }

  /* THE LOOM: every line of the record on one frame, from the dawn of farming to 2100. One row per line, each drawn to its own
     scale on a shared, broken time axis; the eras of the Archive along the top; the present as one bright thread through all of
     them; what is expected at the foot. It answers "where am I in history?" before any sentence is read. */
  const ERA_SHORT = { prehistory: "Prehistory", neolithic: "Neolithic", bronze: "Bronze Age", iron: "Iron Age", axial: "Axial Age", classical: "Classical", lateantique: "Late Antiquity", medieval: "Post-Classical", renaissance: "Renaissance", earlymodern: "Early Modern", revolutions: "Revolutions & Industry", worldwars: "World Wars", coldwar: "Cold War", digital: "Digital", horizon: "The Horizon" };
  function loom(W) {
    const small = W < 700, Lw = small ? 100 : 176, Rw = small ? 0 : 192, T0 = 48, rh = small ? 38 : 54, hzH = 40, B0 = 26, rows = O.lines;
    const H = T0 + rows.length * rh + hzH + B0, pw = W - Lw - Rw, X1 = Lw + pw, yEnd = T0 + rows.length * rh;
    const ax = axis(small ? { breaks: [-10000, 1500, 1900, NOW, 2100], weights: [0.8, 1, 1.5, 1] } : { breaks: [-10000, 0, 1500, 1800, 1950, NOW, 2050, 2100], weights: [0.7, 0.8, 1, 1.5, 1.7, 0.9, 0.5] }, Lw, pw), lo = ax.B[0], hi = ax.B[ax.n], XN = ax.x(NOW);
    const inx = p => p[0] >= lo && p[0] <= hi; let defs = "", h = "";
    ERAS.forEach((e, i) => { if (e.end <= lo) return; const x0 = ax.x(Math.max(e.start, lo)), x1 = ax.x(Math.min(e.end, hi)), w = x1 - x0, fut = e.start >= NOW; if (w < 1) return;
      h += '<rect x="' + x0 + '" y="4" width="' + Math.max(0, w - 1) + '" height="20" rx="2" fill="' + (fut ? "#b48ef0" : i % 2 ? "#5b93b8" : "#8d96af") + '" fill-opacity="' + (fut ? ".34" : i % 2 ? ".3" : ".2") + '"><title>' + esc(e.name) + ": " + yearLabel(e.start) + " – " + yearLabel(e.end) + "</title></rect>";
      const nm = ERA_SHORT[e.id] || e.name; if (w > nm.length * 6.3 + 8) h += '<text class="rb" x="' + (x0 + w / 2) + '" y="18" text-anchor="middle">' + esc(nm) + "</text>"; });
    h += '<rect class="lm-fut" x="' + XN + '" y="' + (T0 - 8) + '" width="' + (X1 - XN) + '" height="' + (yEnd - T0 + 8 + hzH) + '"/>';
    ax.B.forEach((b, i) => { if (i && i < ax.n && b !== NOW) h += '<line class="cut" x1="' + ax.x(b) + '" x2="' + ax.x(b) + '" y1="' + (T0 - 8) + '" y2="' + (yEnd + hzH) + '"/>'; });
    rows.forEach((l, r) => { const y0 = T0 + r * rh, top = y0 + 9, bot = y0 + rh - 8, mid = (top + bot) / 2, m = l.loom || {}, col = l.c;
      /* a series scaled into this row: value → y, with the lowest and highest of everything drawn on the row at its floor and ceiling */
      const scaled = (sets, log, floor) => { const tv = v => log ? Math.log10(Math.max(v, floor || 1e-9)) : v, all = [].concat.apply([], sets).map(p => tv(p[1])), a = Math.min.apply(null, all), b = Math.max.apply(null, all); return p => [ax.x(p[0]), bot - (tv(p[1]) - a) / (b - a || 1) * (bot - top)]; };
      const thread = (k, c2, log, floor, projK, shade) => { const p = S[k].filter(inx), q = projK ? S[projK].filter(inx) : [], at = scaled([p, q], log, floor), pts = p.map(at), e = pts[pts.length - 1];
        if (shade) { const g = fade(c2, 0.3); defs += g.def; h += '<path fill="url(#' + g.id + ')" d="' + K.path(pts) + "L" + e[0].toFixed(1) + " " + bot + "L" + pts[0][0].toFixed(1) + " " + bot + 'Z"/>'; }
        h += lit(K.path(pts), c2, 2); if (q.length) h += lit(K.path([e].concat(q.map(at))), c2, 1.4, 1); h += ember(e[0], e[1], c2, 2.4); };
      if (m.type === "line") thread(m.k, col, m.log, m.floor, m.proj, 1);
      else if (m.type === "multi") { const sets = m.ks.map(k => S[k[0]].filter(inx)), at = scaled(sets, 0); m.ks.forEach((k, i) => { const pts = sets[i].map(at), e = pts[pts.length - 1]; h += lit(K.path(pts), k[1], i ? 1.5 : 2.1) + ember(e[0], e[1], k[1], 2.4); }); }
      else if (m.type === "marks") { const a = m.k === "a.info" ? INFO : PLAGUES, xs = a.filter(p => p.y >= lo).map(p => ax.x(p.y));
        if (m.also) thread(m.also.k, col, m.also.log, 0, null, 1);
        h += '<line class="thr" x1="' + xs[0] + '" x2="' + xs[xs.length - 1] + '" y1="' + mid + '" y2="' + mid + '" stroke="' + col + '"/>' + a.filter(p => p.y >= lo).map(p => "<g><title>" + esc(p.n) + ", " + yearLabel(p.y) + "</title>" + ember(ax.x(p.y), mid, col, 2.6) + "</g>").join(""); }
      else if (m.type === "spans") { const lanes = [-1e9, -1e9, -1e9, -1e9], lh = (bot - top) / lanes.length;
        POL.concat(STAND).forEach(p => { const x0 = ax.x(Math.max(p.s, lo)), x1 = Math.max(ax.x(p.e), x0 + 1.5); let k = lanes.findIndex(v => v <= x0 - 2); if (k < 0) k = lanes.indexOf(Math.min.apply(null, lanes)); lanes[k] = x1;
          h += '<rect x="' + x0 + '" y="' + (top + k * lh + 0.5) + '" width="' + (x1 - x0) + '" height="' + Math.max(2.5, lh - 2.5) + '" rx="1.2" fill="' + (p.open ? "#f4d77a" : col) + '" fill-opacity="' + (p.open ? "1" : ".5") + '"><title>' + esc(p.n) + ": " + yearLabel(p.s) + " – " + (p.open ? "still standing" : yearLabel(p.e)) + "</title></rect>"; }); }
      else if (m.type === "cols") { const mx = Math.max.apply(null, FORCE.map(f => f.rate)); FORCE.forEach(f => { const x0 = ax.x(f.d), x1 = ax.x(Math.min(f.d + 10, NOW)), hh = f.rate / mx * (bot - top); h += '<rect x="' + (x0 + 0.5) + '" y="' + (bot - hh) + '" width="' + Math.max(1, x1 - x0 - 1) + '" height="' + hh + '" rx="1" fill="' + col + '" fill-opacity=".85"><title>' + f.d + "s: " + f.rate.toFixed(1) + " per 100 states a year</title></rect>"; }); }
      h += '<line class="lm-sep" x1="0" x2="' + W + '" y1="' + (y0 + rh) + '" y2="' + (y0 + rh) + '"/>'
        + '<svg x="' + (small ? 4 : 12) + '" y="' + (mid - 8) + '" width="16" height="16" viewBox="0 0 16 16"><g fill="none" stroke="' + col + '" color="' + col + '" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">' + ICON[l.id] + "</g></svg>"
        + '<text class="lm-n" x="' + (small ? 25 : 38) + '" y="' + (mid + (small ? 4 : 0)) + '">' + esc(small ? l.n.replace(/ and .*$/, "") : l.n) + "</text>" + (small ? "" : '<text class="lm-k" x="38" y="' + (mid + 14) + '">' + (l.kind === "cycle" ? "a return" : "a trend") + "</text>")
        + (Rw ? '<text class="lm-v" x="' + (X1 + 14) + '" y="' + (mid - 1) + '" fill="' + col + '">' + T(l.now[1]) + '</text><text class="lm-k" x="' + (X1 + 14) + '" y="' + (mid + 12) + '">' + esc(fill(l.now[0])) + "</text>" : "")
        + '<rect class="lm-row" data-i="' + l.id + '" x="0" y="' + y0 + '" width="' + W + '" height="' + rh + '" tabindex="0" role="button" aria-label="Open the line: ' + esc(l.n) + '"><title>Open the line: ' + esc(l.n) + "</title></rect>"; });
    /* the foot: what is expected, one dot each, by the kind of knowledge it rests on */
    const hy = yEnd + hzH / 2 + 2, seen = {};
    h += '<text class="lm-n" x="' + (small ? 25 : 38) + '" y="' + (hy + 4) + '">' + (small ? "Horizon" : "The Horizon") + "</text>" + (Rw ? '<text class="lm-k" x="' + (X1 + 14) + '" y="' + (hy + 4) + '">' + HZ.length + " dated expectations</text>" : "")
      + HZ.map(o => { const X = ax.x(Math.min(o.e.startYear, hi)), k = Math.round(X / 5), n = seen[k] = (seen[k] || 0) + 1; return '<circle class="hz-d" data-e="' + o.e.id + '" cx="' + X + '" cy="' + (hy + ((n - 1) % 3 - 1) * 7) + '" r="3" fill="' + HC[o.c].c + '"><title>' + o.e.startYear + " · " + esc(o.e.title) + "</title></circle>"; }).join("");
    /* the present */
    h += '<line class="glow" x1="' + XN + '" x2="' + XN + '" y1="' + (T0 - 12) + '" y2="' + (yEnd + hzH) + '" stroke="#e8c455" stroke-width="5" stroke-opacity=".55" filter="url(#or-glow)"/><line class="nowl" x1="' + XN + '" x2="' + XN + '" y1="' + (T0 - 12) + '" y2="' + (yEnd + hzH) + '"/>' + ember(XN, T0 - 12, "#e8c455", 3.4);
    const wd = t => t.length * 6.2 + 10, nowT = "now · " + NOW, used = [[XN - wd(nowT) / 2, XN + wd(nowT) / 2]];
    h += '<text class="nowt" x="' + XN + '" y="' + (H - 7) + '" text-anchor="middle">' + nowT + "</text>";
    [0, ax.n].concat(ax.B.map((b, i) => i).slice(1, -1)).forEach(i => { const b = ax.B[i]; if (b === NOW) return; const t = yearLabel(b), x = ax.x(b), l = i === 0 ? x : i === ax.n ? x - wd(t) : x - wd(t) / 2, r = l + wd(t);
      if (used.some(u => l < u[1] && r > u[0])) return; used.push([l, r]); h += '<text x="' + x + '" y="' + (H - 7) + '" text-anchor="' + (i === 0 ? "start" : i === ax.n ? "end" : "middle") + '">' + t + "</text>"; });
    h += '<line class="guide" x1="0" x2="0" y1="' + (T0 - 8) + '" y2="' + (yEnd + hzH) + '" visibility="hidden"/><text class="lm-gy" x="0" y="' + (T0 - 12) + '" text-anchor="middle" visibility="hidden"></text>';
    return { svg: '<svg class="chart or-loom" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Every line of the record on one frame, 10,000 BCE to 2100, with the present marked"><defs>' + defs + "</defs>" + h + "</svg>",
      year: px => px < Lw || px > X1 ? null : ax.inv(px) };
  }
  function mountLoom() {
    const host = $("rd-loom"), r = loom(Math.max(300, Math.floor(host.clientWidth))); host.innerHTML = r.svg;
    const g = host.querySelector(".guide"), t = host.querySelector(".lm-gy"), hide = () => { g.setAttribute("visibility", "hidden"); t.setAttribute("visibility", "hidden"); };
    host.onpointermove = e => { const x = e.clientX - host.getBoundingClientRect().left, yr = r.year(x); if (yr == null) return hide(); const y = yr < -1000 ? Math.round(yr / 100) * 100 : yr < 1500 ? Math.round(yr / 10) * 10 : Math.round(yr);
      g.setAttribute("x1", x); g.setAttribute("x2", x); g.setAttribute("visibility", "visible"); t.setAttribute("x", x); t.textContent = yearLabel(y); t.setAttribute("visibility", "visible"); };
    host.onpointerleave = hide;
  }

  /* ---------------- state ---------------- */
  const st = { v: "reading", i: O.lines[0].id, e: null, hc: null };
  let tabs, built = {};
  const pips = l => '<span class="or-pips" title="' + esc(l.deduce.map(d => GR[d[0]].n).join(" · ")) + '">' + l.deduce.map(d => '<i style="background:' + GR[d[0]].c + '"></i>').join("") + "</span>";
  const badge = g => '<span class="or-g" style="color:' + GR[g].c + ";border-color:" + GR[g].c + '">' + esc(GR[g].n) + "</span>";
  const EYE = '<svg viewBox="0 0 92 92" aria-hidden="true"><circle class="glow" cx="46" cy="46" r="17" fill="#e8c455" fill-opacity=".35" filter="url(#or-glow2)"/>'
    + '<g class="ring"><circle cx="46" cy="46" r="43" fill="none" stroke="#c9a227" stroke-opacity=".7" stroke-dasharray="1.5 7.5"/></g><g class="ring ring2"><circle cx="46" cy="46" r="36.5" fill="none" stroke="#c9a227" stroke-opacity=".45" stroke-dasharray="18 6 2 6"/></g>'
    + '<path d="M9 46C22 27 70 27 83 46 70 65 22 65 9 46z" fill="none" stroke="#e8c455" stroke-width="1.5"/><circle class="iris" cx="46" cy="46" r="11.5" fill="none" stroke="#e8c455" stroke-width="1.5"/><circle cx="46" cy="46" r="4.6" fill="#e8c455"/>'
    + '<path d="M46 3v7M46 82v7M3 46h4M85 46h4" stroke="#c9a227" stroke-width="1.2"/></svg>';
  const head = (t, s) => '<h4 class="or-h"><span>' + esc(t) + "</span></h4>" + (s ? '<p class="or-hs">' + esc(s) + "</p>" : "");

  /* ---------------- the Reading ---------------- */
  function drawReading() {
    const n = O.lines.length;
    $("rd-pane").innerHTML = '<div class="or-top"><div class="or-eye">' + EYE + '</div><div><div class="or-kicker">The Reading · as it stands on ' + esc(WHEN) + '</div><h2 class="or-title">Where the record points</h2>'
      + '<p class="lead">The Archive gathers the record in one place. This is what it points to: ' + nWord(O.reading.length) + " deductions, each resting on a line you can open, each graded by what it rests on, each set beside the best case against it. None is a prophecy.</p></div></div>"
      + '<section class="or-panel or-loomwrap"><div class="or-ph"><b>The loom</b><small>every line of the record on one frame, from the dawn of farming to 2100 · the time axis is cut into panels so the last two centuries can be seen · each line is drawn to its own scale · click a line to open it</small></div><div id="rd-loom"></div>'
      + '<div class="cleg or-ll"><span><i class="nowk"></i>now</span><span><i class="dsh"></i>projected by its source</span>' + O.horizon.classes.map(c => '<span><i style="background:' + c.c + ';border-radius:50%"></i>' + esc(c.n.toLowerCase()) + "</span>").join("") + "<span>· at the foot: what is expected, and on what footing</span></div></section>"
      + head("What it points to")
      + '<ol class="or-syn">' + O.reading.map((r, i) => { const l = LB[r[0]]; return '<li><button data-i="' + r[0] + '" style="border-top-color:' + l.c + '"><span class="num" style="color:' + l.c + '">' + ROMAN[i + 1] + '</span><span class="sg" style="color:' + l.c + '">' + icon(r[0]) + "</span><b>" + T(r[1]) + "</b><span>" + T(r[2]) + "</span><em>" + esc(l.n) + " →" + pips(l) + "</em></button></li>"; }).join("") + "</ol>"
      + head("The ledger", "All " + nWord(n) + " lines, each drawn from the first year its source covers. The dots are the grades of its deductions.")
      + '<div class="mx-wrap or-panel" style="padding:0"><table class="tbl or-tbl"><thead><tr><th>Line</th><th>The whole record</th><th>Now</th><th>Where it points</th><th>Grades</th></tr></thead><tbody>'
      + O.lines.map(l => '<tr data-i="' + l.id + '" tabindex="0"><td class="m"><span class="sg" style="color:' + l.c + '">' + icon(l.id) + "</span><b>" + esc(l.n) + "</b><small>" + esc(l.kind === "cycle" ? "a return" : "a trend") + " · " + esc(l.q) + '</small></td><td class="sp">' + spark(l.spark, l.sparkLog, l.c) + '</td><td class="nw"><b>' + T(l.now[1]) + "</b><small>" + T(l.now[0]) + "</small></td><td>" + T(l.verdict) + "</td><td>" + pips(l) + "</td></tr>").join("")
      + "</tbody></table></div>"
      + '<div class="cleg or-gl">' + O.grades.map(g => '<span title="' + esc(g.def) + '"><i style="background:' + g.c + ';border-radius:50%"></i><b>' + esc(g.n) + "</b></span>").join("") + "</div>";
    mountLoom();
  }

  /* ---------------- the Lines ---------------- */
  function drawLines() {
    const l = LB[st.i], ix = O.lines.indexOf(l), prev = O.lines[ix - 1], next = O.lines[ix + 1], ul = a => "<ul>" + a.map(x => "<li>" + T(x) + "</li>").join("") + "</ul>";
    const srcs = l.src.map(k => k.indexOf("archive:") === 0 ? "<span>" + esc(k.slice(8)) + "</span>" : K.link("https://ourworldindata.org/grapher/" + SS.s[k].slug, SS.s[k].t + " — " + SS.s[k].c.replace(/ [–-] (with|processed).*$/, ""))).join("");
    $("ln-pane").innerHTML = '<div class="grid2 md"><div class="col"><div class="mlist or-list">' + O.lines.map(x => '<button data-i="' + x.id + '" class="' + (x.id === st.i ? "on" : "") + '"><span class="sg" style="color:' + x.c + '">' + icon(x.id) + "</span>" + esc(x.n) + pips(x) + "<small>" + esc(x.q) + "</small></button>").join("") + "</div></div>"
      + '<div class="col or-line"><header class="or-hero"><div class="or-emb" style="color:' + l.c + ";border-color:" + l.c + '">' + icon(l.id) + '</div><div><span class="or-kind">' + ROMAN[ix + 1] + " · " + (l.kind === "cycle" ? "a return · what has happened before, and how often" : "a trend · what has moved one way, and for how long") + "</span><h3>" + esc(l.n) + "<small>" + esc(l.q) + '</small></h3><p class="or-verdict">' + T(l.verdict) + "</p></div></header>"
      + '<div class="or-stats">' + l.stats.map(s => '<div style="border-top-color:' + l.c + '"><b>' + T(s[0]) + "</b><span>" + T(s[1]) + "</span></div>").join("") + "</div>"
      + '<div class="or-charts n' + l.charts.length + (l.charts.some(isWide) ? " w" : "") + '">' + l.charts.map(chartBlock).join("") + "</div>"
      + '<div class="or-cols"><section class="or-card"><h4><i>◆</i>What the record shows</h4>' + ul(l.shows) + "</section>"
      + '<section class="or-card"><h4><i>➤</i>What it points to<small>graded by what it rests on</small></h4><ul class="or-ded">' + l.deduce.map(d => '<li style="border-left-color:' + GR[d[0]].c + '">' + badge(d[0]) + '<span class="hz">' + esc(d[1]) + "</span><p>" + T(d[2]) + "</p></li>").join("") + "</ul></section>"
      + '<section class="or-card against"><h4><i>⚖</i>The case against</h4>' + ul(l.against) + "</section>"
      + '<section class="or-card"><h4><i>◉</i>What to watch</h4>' + ul(l.watch) + "</section></div>"
      + '<div class="chips tp">' + l.links.map(k => '<a class="chipbtn" href="' + esc(k[1]) + '">' + esc(k[0]) + " →</a>").join("") + "</div>"
      + '<div class="cleg or-gl">' + O.grades.map(g => '<span title="' + esc(g.def) + '"><i style="background:' + g.c + ';border-radius:50%"></i><b>' + esc(g.n) + "</b> " + esc(g.def.split(".")[0].replace(/:.*$/, "")) + ".</span>").join("") + "</div>"
      + '<p class="srcs"><b>Drawn from</b>' + srcs + "</p>"
      + '<nav class="or-step">' + (prev ? '<button data-i="' + prev.id + '"><small>← ' + ROMAN[ix] + "</small>" + esc(prev.n) + "</button>" : "<span></span>") + (next ? '<button data-i="' + next.id + '"><small>' + ROMAN[ix + 2] + " →</small>" + esc(next.n) + "</button>" : "<span></span>") + "</nav></div></div>";
    mountCharts($("ln-pane"), l.charts);
  }

  /* ---------------- the Horizon ---------------- */
  const hzShown = () => HZ.filter(h => !st.hc || h.c === st.hc);
  const circa = o => o.e.approximate && o.c !== "clock" ? "c. " : "";      /* an orbit or a calendar date is not approximate */
  function hzStrip(W) {
    const a = hzShown(), cls = O.horizon.classes, lh = 44, small = W < 700, H = 30 + cls.length * lh + 24, L = small ? 84 : 112, Rm = 16, T0 = 14, B0 = 24, pw = W - L - Rm, ph = H - T0 - B0, ax = axis({ breaks: [NOW, 2035, 2050, 2075, 2120] }, L, pw), seen = {}, placed = [];
    let h = xTicks(ax, W, T0, ph, H), dots = "", labs = "";
    cls.forEach((c, i) => { const yy = T0 + 26 + i * lh; h += '<line class="thr" x1="' + L + '" x2="' + (W - Rm) + '" y1="' + yy + '" y2="' + yy + '" stroke="' + c.c + '"/><text class="lane-t" x="' + (L - 12) + '" y="' + (yy + 3.5) + '" text-anchor="end" fill="' + c.c + '">' + esc(c.n) + "</text>"; });
    const nodes = a.map(o => { const i = cls.indexOf(HC[o.c]), k = o.c + o.e.startYear, n = seen[k] = (seen[k] || 0) + 1, r = 3.4 + Math.max(0, (o.e.importance || 7) - 6) * 0.9; return { o, r, x: ax.x(o.e.startYear) + (n - 1) * 9, y: T0 + 26 + i * lh + ((n - 1) % 2 ? -9 : 0), on: st.e === o.e.id }; });
    nodes.forEach(n => { dots += '<circle class="glow" cx="' + n.x + '" cy="' + n.y + '" r="' + (n.r + 2) + '" fill="' + HC[n.o.c].c + '" fill-opacity=".55" filter="url(#or-glow)"/><circle class="hz-d' + (n.on ? " on" : "") + '" data-e="' + n.o.e.id + '" cx="' + n.x + '" cy="' + n.y + '" r="' + (n.on ? n.r + 2 : n.r) + '" fill="' + HC[n.o.c].c + '"><title>' + n.o.e.startYear + " · " + esc(n.o.e.title) + "</title></circle>"; });
    /* name the weightiest, where a name fits without touching another name or another dot */
    if (!small) nodes.slice().sort((p, q) => (q.o.e.importance || 0) - (p.o.e.importance || 0) || p.x - q.x).forEach(n => { if (placed.length >= 12 && !n.on) return; const t = n.o.e.title.replace(/ — .*$/, "").replace(/^The /, ""), s = t.length > 30 ? t.slice(0, 28) + "…" : t, w = s.length * 5.5 + 6, x0 = n.x - w / 2, y0 = n.y - n.r - 16, box = [K.clamp(x0, L, W - Rm - w), y0, w, 12];
      if (placed.some(b => box[0] < b[0] + b[2] && box[0] + box[2] > b[0] && box[1] < b[1] + b[3] && box[1] + box[3] > b[1])) return;
      if (nodes.some(m => m !== n && m.x > box[0] - 4 && m.x < box[0] + box[2] + 4 && m.y > box[1] - 4 && m.y < box[1] + box[3] + 4)) return;
      placed.push(box); labs += '<text class="gt on" x="' + (box[0] + w / 2) + '" y="' + (y0 + 10) + '" text-anchor="middle">' + esc(s) + "</text>"; });
    return '<svg class="chart" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="The Archive\'s dated expectations, ' + NOW + ' to 2120, by kind">' + h + dots + labs + "</svg>";
  }
  function drawHorizon() {
    const a = hzShown(), n = c => HZ.filter(h => h.c === c).length, decs = {};
    a.forEach(o => { const d = o.e.startYear < 2030 ? "Before 2030" : o.e.startYear >= 2060 ? "2060 and after" : "The " + Math.floor(o.e.startYear / 10) * 10 + "s"; (decs[d] = decs[d] || []).push(o); });
    $("hz-pane").innerHTML = '<div class="or-top slim"><div><div class="or-kicker">The Horizon · ' + HZ[0].e.startYear + " – " + HZ[HZ.length - 1].e.startYear + '</div><h2 class="or-title">What is next</h2>'
      + '<p class="lead">As far as anything dated can be said. The Archive holds ' + HZ.length + " expectations. They are not equally knowable, so they are sorted by what each rests on: an orbit, a plan, a trend, or a claim.</p></div></div>"
      + '<div class="chips">' + '<button class="chipbtn' + (st.hc ? "" : " on") + '" data-hc="">All ' + HZ.length + "</button>" + O.horizon.classes.map(c => '<button class="chipbtn' + (st.hc === c.id ? " on" : "") + '" data-hc="' + c.id + '" title="' + esc(c.def) + '"><span class="fdot" style="background:' + c.c + '"></span>' + esc(c.n) + " " + n(c.id) + "</button>").join("") + "</div>"
      + '<section class="or-panel"><div class="or-ph"><b>The sky ahead</b><small>one light per expectation · larger = weightier in the Archive · the time axis is cut at 2035, 2050 and 2075</small></div><div id="hz-strip"></div></section>'
      + '<div class="or-defs">' + O.horizon.classes.map(c => '<div style="border-top-color:' + c.c + '"><b style="color:' + c.c + '">' + esc(c.n) + "</b><span>" + esc(c.def) + "</span></div>").join("") + "</div>"
      + Object.keys(decs).map(d => head(d + " · " + decs[d].length) + '<div class="or-hz">' + decs[d].map(o => '<button data-e="' + o.e.id + '" class="' + (st.e === o.e.id ? "on" : "") + '" style="border-left-color:' + HC[o.c].c + '"><span class="y">' + circa(o) + o.e.startYear + "</span><b>" + esc(o.e.title) + '</b><i style="color:' + HC[o.c].c + '">' + esc(HC[o.c].n) + "</i></button>").join("") + "</div>").join("");
    $("hz-strip").innerHTML = hzStrip(Math.max(300, Math.floor($("hz-strip").clientWidth)));
  }

  /* ---------------- Method & sources ---------------- */
  function drawMethod() {
    const M = O.method, slugs = {}, reg = {}, tot = EVS.length;
    Object.keys(SS.s).forEach(k => { const s = SS.s[k]; (slugs[s.slug] = slugs[s.slug] || { s, a: s.d[0][0], b: s.d[s.d.length - 1][0] }); slugs[s.slug].a = Math.min(slugs[s.slug].a, s.d[0][0]); slugs[s.slug].b = Math.max(slugs[s.slug].b, s.d[s.d.length - 1][0]); });
    EVS.forEach(e => { reg[e.region] = (reg[e.region] || 0) + 1; });
    const regs = Object.keys(reg).sort((a, b) => reg[b] - reg[a]), since1800 = EVS.filter(e => e.startYear >= 1800 && e.startYear <= NOW).length;
    $("mt-pane").innerHTML = '<div class="or-top slim"><div><div class="or-kicker">Method &amp; sources</div><h2 class="or-title">How the Oracle reasons</h2><p class="lead">The rules it follows, where that reasoning fails, and everything it is drawn from.</p></div></div>'
      + '<div class="or-cols"><section class="or-card"><h4><i>◆</i>The rules</h4><ol class="or-rules">' + M.rules.map(r => "<li><b>" + esc(r[0]) + ".</b> " + esc(r[1]) + "</li>").join("") + "</ol></section>"
      + '<section class="or-card"><h4><i>➤</i>The grades</h4>' + O.grades.map(g => '<div class="or-q" style="border-color:' + g.c + '"><b style="color:' + g.c + '">' + esc(g.n) + "</b><span>" + esc(g.def) + "</span></div>").join("") + "</section>"
      + '<section class="or-card against"><h4><i>⚖</i>What this cannot do</h4><ul>' + M.limits.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul></section>"
      + '<section class="or-card"><h4><i>◉</i>The Archive\'s own lean<small>counted from its ' + tot + " records when this page opened</small></h4><ul><li>" + regs.slice(0, 4).map(r => esc(r) + " " + Math.round(100 * reg[r] / tot) + "%").join(" · ") + " · every other region " + Math.round(100 * regs.slice(4).reduce((s, r) => s + reg[r], 0) / tot) + "%.</li><li>Records dated 1800 or later: " + Math.round(100 * since1800 / tot) + "% of the total, for " + ((NOW - 1800) / 120).toFixed(1) + "% of the twelve thousand years since farming began.</li><li>The returns computed from the Archive's own records (Orders, Plagues, the steps in Machines) inherit this lean.</li></ul></section></div>"
      + head("The series", "World totals, averages and shares, read from Our World in Data on " + SS.fetched + ". Each is drawn from the first year its source covers.")
      + '<div class="mx-wrap or-panel" style="padding:0"><table class="tbl or-src"><thead><tr><th>Series</th><th>Underlying source</th><th>Covers</th><th>Updated</th></tr></thead><tbody>'
      + Object.keys(slugs).map(k => { const o = slugs[k]; return '<tr><td class="m">' + K.link("https://ourworldindata.org/grapher/" + k, o.s.t) + "</td><td>" + esc(o.s.c) + '</td><td class="yr">' + yearLabel(o.a) + " – " + o.b + '</td><td class="yr">' + esc(o.s.upd || "") + "</td></tr>"; }).join("")
      + '<tr><td class="m"><a href="realms.html#v=drift&s=world">Democracy scores and regimes ended by force</a></td><td>V-Dem v16 (March 2026), as built into the Realms and the Coups — ' + K.link("https://www.v-dem.net/data/the-v-dem-dataset/", "v-dem.net") + '</td><td class="yr">1789 – ' + R.meta.last + '</td><td class="yr">' + esc(R.meta.built || "") + "</td></tr>"
      + '<tr><td class="m"><a href="index.html">Polities, pandemics, inventions, the Horizon</a></td><td>The Archive\'s own records; each carries its source</td><td class="yr">' + yearLabel(Math.min.apply(null, POL.map(p => p.s))) + " – " + HZ[HZ.length - 1].e.startYear + '</td><td class="yr"></td></tr>'
      + '<tr><td class="m"><a href="conflicts.html">Conflicts under way</a></td><td>The Conflicts instrument; 66 sources listed there</td><td class="yr">' + esc(CF.meta.asOf) + '</td><td class="yr">' + esc(CF.meta.asOf) + "</td></tr></tbody></table></div>"
      + '<p class="lead" style="font-size:12px">The series were thinned when stored: every point before 1800, then every fifth or tenth year, yearly where a series is short or jagged. The raw file is in the project at <code>research/data/owid-world-series.json</code>.</p>';
  }

  /* ---------------- side panel ---------------- */
  function hzCard(o) {
    const e = o.e, c = HC[o.c], rel = (e.related || []).map(id => EB[id]).filter(Boolean);
    return '<button class="sd-x" title="Close (Esc)">×</button><div class="sd-k">' + circa(o) + e.startYear + " · expected</div><h2 class=\"sd-t\">" + esc(e.title) + "</h2>"
      + '<div class="or-q" style="border-color:' + c.c + '"><b style="color:' + c.c + '">' + esc(c.n) + "</b><span>" + esc(c.def) + "</span></div><p>" + esc(e.desc) + "</p>"
      + '<p class="srcs">' + (e.source ? K.link(e.source, K.host(e.source)) : "") + "</p>"
      + (rel.length ? '<div class="sd-k">In the record</div>' + rel.map(r => '<a class="rel" href="index.html#e=' + r.id + '">' + esc(r.title) + "<i>" + yearLabel(r.startYear) + "</i></a>").join("") : "")
      + '<div class="sd-k">In the Archive</div><a class="rel s" href="index.html#e=' + e.id + '">Open this record on the timeline<i>with its place among the others</i></a>';
  }
  function intro() {
    const t = { reading: ["THE READING", "Where the record points, in " + nWord(O.reading.length) + " deductions, over the loom of all " + nWord(O.lines.length) + " lines."], lines: ["THE LINES", "Each line in full."],
      horizon: ["THE HORIZON", "Every dated expectation in the Archive, sorted by how knowable it is."], method: ["METHOD", "The rules the Oracle follows, the ways it can be wrong, and every source."] }[st.v];
    return '<div class="sd-k">' + t[0] + "</div><p>" + t[1] + "</p>"
      + '<div class="sd-k">How far to trust a deduction</div>' + O.grades.map(g => '<div class="q" style="border-color:' + g.c + '"><b style="color:' + g.c + '">' + esc(g.n) + "</b><span>" + esc(g.def) + "</span></div>").join("")
      + '<div class="q" style="border-color:#8d96af"><b style="color:#c4cad8">Not a prophecy</b><span>The numbers are other people\'s measurements. The deductions are the Archive\'s reading of them, and each stands beside the best case against it.</span></div>'
      + '<div class="sd-k">Start with</div>' + O.lines.slice(0, 4).map(l => '<button class="rel" data-i="' + l.id + '" style="border-left-color:' + l.c + '">' + esc(l.n) + "<i>" + esc(l.q) + "</i></button>").join("");
  }
  function renderSide() {
    const side = $("dc-side"), o = st.v === "horizon" && st.e && HZ.find(h => h.e.id === st.e), html = o ? hzCard(o) : null;
    if (!html && (innerWidth <= 860 || st.v === "lines" || st.v === "reading")) { side.hidden = true; return; }      /* the loom and the lines take the full width */
    side.hidden = false; side.innerHTML = '<div class="dc-card' + (html ? "" : " intro") + '">' + (html || intro()) + "</div>"; side.scrollTop = 0;
  }

  /* ---------------- wiring ---------------- */
  const VIEW = { reading: drawReading, lines: drawLines, horizon: drawHorizon, method: drawMethod };
  function sync(fromHash) {
    tabs.paint(); renderSide(); VIEW[st.v]();             /* the side panel first: it decides how wide the charts can be */
    if (!fromHash) K.hash.write({ v: st.v, i: st.v === "lines" ? st.i : null, e: st.v === "horizon" ? st.e : null });
    document.title = "ARCHIVUS — The Oracle" + (st.v === "lines" ? " · " + LB[st.i].n : "");
  }
  const go = v => { st.v = v; sync(); const p = $("v-" + v).querySelector(".pane"); if (p) p.scrollTop = 0; };
  const openLine = id => { if (!LB[id]) return; st.v = "lines"; st.i = id; sync(); const p = $("ln-pane"); p.scrollTop = 0; if (innerWidth <= 860) p.querySelector(".or-line").scrollIntoView({ block: "start" }); };
  const openEvent = id => { st.v = "horizon"; st.e = id; if (st.hc && O.horizon.of[id] !== st.hc) st.hc = null; sync(); };
  function applyHash() {
    if (location.hash === K.hash.self && built.boot) return;
    const q = K.hash.read();
    if (q.v && tabs.ids.indexOf(q.v) >= 0) st.v = q.v;
    if (q.i && LB[q.i]) { st.i = q.i; if (!q.v) st.v = "lines"; }
    st.e = q.e && O.horizon.of[q.e] ? q.e : null; if (st.e && !q.v) st.v = "horizon";
    built.boot = 1; sync(true);
  }
  function boot() {
    tabs = K.tabs(() => st.v, go);
    $("dc-stage").addEventListener("click", e => {
      const hc = e.target.closest("[data-hc]"); if (hc) { st.hc = hc.dataset.hc || null; if (st.e && st.hc && O.horizon.of[st.e] !== st.hc) st.e = null; return sync(); }
      const ev = e.target.closest("[data-e]"); if (ev) return openEvent(ev.dataset.e);
      const b = e.target.closest("[data-i]"); if (b) openLine(b.dataset.i);
    });
    $("dc-stage").addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches("tr[data-i], rect[data-i]")) openLine(e.target.dataset.i); });
    $("dc-side").addEventListener("click", e => {
      if (e.target.closest(".sd-x")) { st.e = null; return sync(); }
      const b = e.target.closest("[data-i]"); if (b) openLine(b.dataset.i);
    });
    document.addEventListener("keydown", e => {
      if (e.target.closest("input, textarea") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape" && st.e) { st.e = null; return sync(); }
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      if (st.v === "lines") { const n = O.lines[O.lines.indexOf(LB[st.i]) + d]; if (n) { st.i = n.id; sync(); } }
      else if (st.v === "horizon" && st.e) { const a = hzShown(), n = a[a.findIndex(h => h.e.id === st.e) + d]; if (n) { st.e = n.e.id; sync(); } }
    });
    const hay = O.lines.map(l => ({ label: l.n, sub: "Line · " + l.q, i: l.id, t: (l.n + " " + l.q + " " + fill(l.verdict) + " " + l.shows.join(" ")).toLowerCase() }))
      .concat(HZ.map(h => ({ label: h.e.title, sub: h.e.startYear + " · " + HC[h.c].n, e: h.e.id, t: (h.e.title + " " + h.e.desc).toLowerCase() })));
    K.finder($("dc-q"), q => hay.filter(h => h.t.indexOf(q) >= 0), h => h.e ? openEvent(h.e) : openLine(h.i));
    let rt = 0, lw = innerWidth; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth === lw) return; lw = innerWidth; renderSide(); VIEW[st.v](); }, 160); });
    window.addEventListener("hashchange", applyHash);
    applyHash();
  }
  boot();
})();
