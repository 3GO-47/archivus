/* ============================================================
   ARCHIVUS — THE CONFLICTS (v13)
   Every armed conflict and armed standoff under way as of the
   date in meta.asOf, placed on one ladder from tension to major
   war, with the belligerents, who has designated which of them a
   terrorist organisation, and what each side has lost.

   HOW TO READ AND EXTEND THIS FILE
   · src   — the sources, by key: [title, url, date]. Every figure
             below names one. Nothing here is from memory alone.
   · list  — one object per conflict:
       id, n (name), rg (region), lv (1–5, see levels), tr (trend:
       "up" | "flat" | "down" | null = not assessed), trBy (who says),
       ty (type), since, at [lat, lon] (pin), where [map country
       names, as in assets/world2.js — only where the fighting covers
       much of the country; otherwise the pin alone], sum (how it came about),
       now (latest), d25 / d26 / cum (deaths: 2025, 2026 to late
       August, cumulative — from the one comparable table, src.wl),
       toll  — [what, figure, who says, srcKey] for totals, civilians,
               displaced: figures that belong to no one side
       sides — [{ n, parties: [{ n, k, at?, us?, uk?, note? }],
                  loss: [[what, figure, who says, kind, srcKey]] }]
               k: "state" | "armed" | "gang" | "bloc"
               us / uk: date of designation as a terrorist organisation
               kind: "own" (a side's admission of its own losses),
                     "claim" (what its enemy says it lost),
                     "est" (an outside estimate), "count" (a named count)
       src   — keys of the sources used for this conflict
   · A figure with kind "claim" is a claim. The page never adds
     claims to counts, and never totals across sources.
   · Dates: 2026 unless a year is given.
   ============================================================ */
window.ARCHIVUS_CONFLICTS = {
  meta: {
    asOf: "2026-11-14",
    note: "Compiled 14 November 2026 from the sources listed. Wars move faster than any table: every figure carries its own date, and the newest news item read for each conflict is in its 'now' line."
  },

  /* the ladder. Thresholds follow the tiers used by the Uppsala programme and by Wikipedia's running table
     (100 / 1,000 / 10,000 deaths a year); the five names follow the Heidelberg barometer's five intensities. */
  levels: [
    { n: 1, name: "Tension", c: "#5b93b8", def: "A dispute pursued by threat: drills, blockades, sanctions, troops massed. The parties are not killing each other, or only by accident." },
    { n: 2, name: "Crisis", c: "#e2c044", def: "Force is used — shelling, raids, rammings, a truce that keeps being broken — but deaths are few: under about 100 a year." },
    { n: 3, name: "Armed conflict", c: "#ee8f3a", def: "Sustained organised violence: roughly 100 to 1,000 deaths a year." },
    { n: 4, name: "War", c: "#e0502f", def: "Roughly 1,000 to 10,000 deaths a year, or open combat between armed forces even where no count exists." },
    { n: 5, name: "Major war", c: "#ff2e55", def: "Full kinetic warfare: more than about 10,000 deaths a year — front lines, air campaigns, cities fought over." }
  ],

  /* who designates. A designation is an act of a government, not a finding of fact; lists differ. */
  des: {
    us: { name: "United States", list: "Foreign Terrorist Organizations (State Department)", src: "fto" },
    uk: { name: "United Kingdom", list: "Proscribed organisations (Home Office, Terrorism Act 2000)", src: "uk" }
  },

  src: {
    wl: ["Wikipedia — List of ongoing armed conflicts (annual fatality table; latest citations Aug 2026)", "https://en.wikipedia.org/wiki/List_of_ongoing_armed_conflicts", "2026-08"],
    ww: ["Wikipedia — List of wars: 2020–present", "https://en.wikipedia.org/wiki/List_of_wars:_2020%E2%80%93present", "2026"],
    fto: ["US Department of State — Foreign Terrorist Organizations (the list, with dates)", "https://www.state.gov/foreign-terrorist-organizations", "2026-11"],
    ftogt: ["US Department of State — Foreign terrorist designations of Guatemalan groups", "https://www.state.gov/releases/office-of-the-spokesman/2026/11/foreign-terrorist-designations-of-guatemalan-groups/", "2026-11-13"],
    uk: ["UK Home Office — Proscribed terrorist groups or organisations (updated 7 July 2026)", "https://gov.uk/government/publications/proscribed-terror-groups-or-organisations--2/proscribed-terrorist-groups-or-organisations-accessible-version", "2026-07-07"],
    cfr: ["Council on Foreign Relations — Global Conflict Tracker, dashboard", "https://www.cfr.org/global-conflict-tracker/dashboard", "2026-11"],
    cfrUkr: ["CFR — War in Ukraine", "https://www.cfr.org/global-conflict-tracker/conflict/conflict-ukraine", "2026-11-13"],
    mz: ["Mediazona — Russian losses in the war with Ukraine (count by name, with the BBC)", "https://en.zona.media/article/2026/11/06/casualties_eng-trl", "2026-11-06"],
    stripes: ["Stars and Stripes — Hacked records show staggering Russian death toll", "https://www.stripes.com/theaters/europe/2026-11-09/ukraine-war-russian-casualty-numbers-23410343.html", "2026-11-09"],
    csis: ["Defense News — Casualties in Ukraine war could hit 2 million, report warns (CSIS estimates)", "https://www.defensenews.com/global/europe/2026/01/28/casualties-in-ukraine-war-could-hit-2-million-report-warns/", "2026-01-28"],
    hrmmu: ["LIGA.net — UN: civilian casualties in Ukraine reached a record high in September 2026", "https://news.liga.net/en/amp/war/news/the-number-of-civilian-casualties-in-ukraine-is-rising-and-reached-a-record-high-in-september-2026-according-to-the-un", "2026-10-16"],
    cfrIran: ["CFR — Conflict With Iran", "https://www.cfr.org/global-conflict-tracker/conflict/confrontation-between-united-states-and-iran", "2026-11-12"],
    irancas: ["Wikipedia — Casualties of the 2026 Iran war (table of each source's count)", "https://en.wikipedia.org/wiki/Casualties_of_the_2026_Iran_war", "2026-08"],
    ajiran: ["Al Jazeera — Iran stands by demands to end the war as US ramps up military pressure", "https://www.aljazeera.com/news/2026/11/9/iran-stands-by-demands-to-end-the-war-as-us-ramps-up-military-pressure", "2026-11-09"],
    cfrLeb: ["CFR — Conflict With Hezbollah in Lebanon", "https://www.cfr.org/global-conflict-tracker/conflict/political-instability-lebanon", "2026-11-13"],
    lebwar: ["Wikipedia — 2026 Lebanon war", "https://en.wikipedia.org/wiki/2026_Lebanon_war", "2026-08"],
    lebcf: ["Wikipedia — 2026 Israel–Lebanon ceasefire", "https://en.wikipedia.org/wiki/2026_Israel%E2%80%93Lebanon_ceasefire", "2026-06"],
    cfrIsr: ["CFR — Israeli-Palestinian Conflict", "https://www.cfr.org/global-conflict-tracker/conflict/israeli-palestinian-conflict", "2026-11"],
    wafa: ["WAFA — Gaza death toll surges to 74,640 (Gaza Health Ministry figures)", "https://english.wafa.ps/Pages/Details/176714", "2026-11-07"],
    ajgaza: ["Al Jazeera — Israeli forces kill four in Gaza as fifth Palestinian dies of wounds", "https://www.aljazeera.com/news/2026/11/3/israeli-forces-kill-four-in-gaza-as-fifth-palestinian-dies-of-wounds", "2026-11-03"],
    toi: ["Times of Israel — 3 years of war: IDF data", "https://www.timesofisrael.com/3-years-of-war-data-shows-idf-hit-100000-targets-as-31500-projectiles-fired-at-israel/", "2026-10-07"],
    jta: ["JTA — IDF official says 71,000 killed in Gaza war, matching Gaza health ministry estimate", "https://www.jta.org/2026/01/29/israel/idf-official-says-71000-killed-in-gaza-war-matching-gaza-health-ministry-estimate", "2026-01-29"],
    cfrYem: ["CFR — Conflict in Yemen and the Red Sea", "https://www.cfr.org/global-conflict-tracker/conflict/war-yemen", "2026-11"],
    ajyemen: ["Al Jazeera — Fighting intensifies in Yemen as Houthis deny targeting Mecca (WHO figures)", "https://www.aljazeera.com/news/2026/11/12/fighting-intensifies-in-yemen-as-houthis-deny-targeting-mecca", "2026-11-12"],
    chyemen: ["Channels Television — Death toll from Saudi attack in Yemen rises to 44 (Houthi media)", "https://www.channelstv.com/2026/11/09/death-toll-from-saudi-attack-in-yemen-rises-to-44/", "2026-11-09"],
    cfrSyr: ["CFR — Instability in Syria", "https://www.cfr.org/global-conflict-tracker/conflict/conflict-syria", "2026-11"],
    syr: ["Wikipedia — Syrian conflict (2024–present)", "https://en.wikipedia.org/wiki/Syrian_conflict_(2024%E2%80%93present)", "2026"],
    cfrIrq: ["CFR — Instability in Iraq", "https://www.cfr.org/global-conflict-tracker/conflict/political-instability-iraq", "2026-11-08"],
    cfrTur: ["CFR — Conflict Between Turkey and Armed Kurdish Groups", "https://www.cfr.org/global-conflict-tracker/conflict/conflict-between-turkey-and-armed-kurdish-groups", "2026-10"],
    cfrSud: ["CFR — Civil War in Sudan", "https://www.cfr.org/global-conflict-tracker/conflict/power-struggle-sudan", "2026-11-10"],
    ajsudan: ["Al Jazeera — How SAF successes in Sudan's Kordofan could turn tide against the RSF", "https://www.aljazeera.com/news/2026/11/14/how-saf-successes-in-sudans-kordofan-could-turn-tide-against-the-rsf", "2026-11-14"],
    cfrSsd: ["CFR — Instability in South Sudan", "https://www.cfr.org/global-conflict-tracker/conflict/civil-war-south-sudan", "2026-11-12"],
    cfrEth: ["CFR — Conflict in Ethiopia", "https://www.cfr.org/global-conflict-tracker/conflict/conflict-ethiopia", "2026-11"],
    ctpEth: ["Critical Threats Project — Ethiopia War Security Review, 13 November 2026", "https://www.criticalthreats.org/analysis/november-13-2026", "2026-11-13"],
    eth26: ["Wikipedia — 2026 Ethiopian offensive", "https://en.wikipedia.org/wiki/2026_Ethiopian_offensive", "2026-10-18"],
    cfrSom: ["CFR — Conflict With Al-Shabaab in Somalia", "https://www.cfr.org/global-conflict-tracker/conflict/al-shabab-somalia", "2026-11-12"],
    ctpAf: ["Critical Threats Project — Africa File, 13 August 2026 (Somalia, Nigeria)", "https://www.criticalthreats.org/analysis/aussom-shabaab-somalia-puntland-fgs-somalia-iswap-boko-nigeria-africa-file-august-13-2026", "2026-08-13"],
    cfrSah: ["CFR — Violent Extremism in the Sahel", "https://www.cfr.org/global-conflict-tracker/conflict/violent-extremism-sahel", "2026-11-05"],
    acledSah: ["ACLED — Economic warfare escalates as militants expand beyond the Sahel", "https://acleddata.com/report/economic-warfare-escalates-militants-expand-beyond-sahel", "2025-12-11"],
    usnig: ["Wikipedia — 2026 United States intervention in Nigeria", "https://en.wikipedia.org/wiki/2026_United_States_intervention_in_Nigeria", "2026-05-30"],
    cfrDrc: ["CFR — Conflict in the Democratic Republic of Congo", "https://www.cfr.org/global-conflict-tracker/conflict/violence-democratic-republic-congo", "2026-11-13"],
    undrc: ["UN News — Security Council: DRC peace deals fail to halt fighting as Ebola deepens crisis", "https://news.un.org/en/story/2026/09/1168482", "2026-09-29"],
    cfrCar: ["CFR — Conflict in the Central African Republic", "https://www.cfr.org/global-conflict-tracker/conflict/violence-central-african-republic", "2026-10-30"],
    cfrLby: ["CFR — Instability in Libya", "https://www.cfr.org/global-conflict-tracker/conflict/civil-war-libya", "2026-09"],
    cfrMya: ["CFR — Civil War in Myanmar", "https://www.cfr.org/global-conflict-tracker/conflict/rohingya-crisis-myanmar", "2026-11-10"],
    myan: ["Wikipedia — Myanmar civil war (2021–present)", "https://en.wikipedia.org/wiki/Myanmar_civil_war_(2021%E2%80%93present)", "2026"],
    f24: ["France 24 — More than 100,000 killed in Myanmar since 2021 coup, monitor says", "https://www.france24.com/en/asia-pacific/20260701-myanmar-mourns-as-post-coup-conflict-death-toll-hits-100-000", "2026-07-01"],
    cfrAfp: ["CFR — Conflict Between Afghanistan and Pakistan", "https://www.cfr.org/global-conflict-tracker/conflict/war-afghanistan", "2026-11"],
    afpak: ["Wikipedia — 2026 Afghanistan–Pakistan war (each side's claims and admissions)", "https://en.wikipedia.org/wiki/2026_Afghanistan%E2%80%93Pakistan_war", "2026-03"],
    lwj: ["FDD's Long War Journal — Taliban–Pakistan border clashes continue, TTP attack kills 10 Pakistani police", "https://www.longwarjournal.org/archives/2026/11/taliban-pakistan-border-clashes-continue-ttp-attack-kills-10-pakistani-police.php", "2026-11-12"],
    ajafp: ["Al Jazeera — Over 370 Afghans killed in Pakistan conflict in first 3 months of 2026: UN", "https://www.aljazeera.com/news/2026/5/12/over-370-afghans-killed-in-pakistan-conflict-in-first-3-months-of-2026-un", "2026-05-12"],
    cfrInd: ["CFR — Conflict Between India and Pakistan", "https://www.cfr.org/global-conflict-tracker/conflict/conflict-between-india-and-pakistan", "2026-11-06"],
    cfrTwn: ["CFR — Confrontation Over Taiwan", "https://www.cfr.org/global-conflict-tracker/conflict/confrontation-over-taiwan", "2026-10-27"],
    aei: ["AEI — China & Taiwan Update, 6 November 2026", "https://www.aei.org/commentary/china-taiwan-update-november-6-2026/", "2026-11-06"],
    cfrKor: ["CFR — Confrontation With North Korea", "https://www.cfr.org/global-conflict-tracker/conflict/north-korea-crisis", "2026-09-22"],
    cfrScs: ["CFR — Territorial Disputes in the South China Sea", "https://www.cfr.org/global-conflict-tracker/conflict/territorial-disputes-south-china-sea", "2026-10-30"],
    thai: ["Al Jazeera — Thailand and Cambodia agree on ceasefire to end weeks of deadly fighting", "https://www.aljazeera.com/news/2025/12/27/thailand-and-cambodia-agree-on-ceasefire-cambodia-defence-ministry-says", "2025-12-27"],
    cfrMex: ["CFR — Criminal Violence in Mexico", "https://www.cfr.org/global-conflict-tracker/conflict/criminal-violence-mexico", "2026-11-08"],
    acledLac: ["ACLED — Latin America and the Caribbean overview, January 2026", "https://acleddata.com/update/latin-america-and-caribbean-overview-january-2026", "2026-01-13"],
    oss: ["Wikipedia — Operation Southern Spear", "https://en.wikipedia.org/wiki/Operation_Southern_Spear", "2026-09"],
    cfrVen: ["CFR — Instability in Venezuela", "https://www.cfr.org/global-conflict-tracker/conflict/instability-venezuela", "2026-11"],
    ecu: ["Wikipedia — Ecuadorian conflict (2024–present)", "https://en.wikipedia.org/wiki/Ecuadorian_conflict_(2024%E2%80%93present)", "2026"],
    cfrHti: ["CFR — Criminal Violence in Haiti", "https://www.cfr.org/global-conflict-tracker/conflict/instability-haiti", "2026-11"],
    unhti: ["UN News — Haiti: more than 1,000 killed between July and September, UN report reveals", "https://news.un.org/en/story/2026/11/1168789", "2026-11-12"],
    cfrNt: ["CFR — Instability in the Northern Triangle", "https://www.cfr.org/global-conflict-tracker/conflict/violent-instability-northern-triangle", "2026"],
    cfrArm: ["CFR — Tensions Between Armenia and Azerbaijan", "https://www.cfr.org/global-conflict-tracker/conflict/nagorno-karabakh-conflict", "2026-09-01"]
  },

  list: [
    /* ---------------------------- EUROPE ---------------------------- */
    { id: "ukraine", n: "Russia – Ukraine", rg: "Europe", lv: 5, tr: "flat", trBy: "CFR", ty: "War between states", since: 2014, at: [48.4, 37.6], where: ["Ukraine"],
      sum: "Russia seized Crimea and backed a war in the Donbas in 2014, and invaded the whole country on 24 February 2022. It is the largest war in Europe since 1945, fought along a front of about a thousand kilometres and, at long range, against each other's cities, refineries and power grids.",
      now: "Russian forces are pressing toward Kostiantynivka, Pokrovsk and Myrnohrad; Ukraine holds about 19% of Donetsk province. US envoys met President Putin in Moscow on 12 Nov after three-way talks in Abu Dhabi. There is no ceasefire. October was, by one research institute's count, Russia's costliest month of the war.",
      d25: "80,245", d26: "42,286", cum: "369,000 – 827,000+",
      toll: [["Civilians killed, Jan–Sep 2026", "2,570 (and 15,211 injured)", "UN monitoring mission (HRMMU)", "hrmmu"], ["Civilians, September 2026 alone", "328 killed, 2,105 injured — the worst month on the UN's record", "UN monitoring mission (HRMMU)", "hrmmu"]],
      sides: [
        { n: "Russia", parties: [{ n: "Armed Forces of Russia", k: "state" }, { n: "North Korean troops", k: "state", note: "Listed as a belligerent on Russia's side since 2024." }],
          loss: [["Soldiers confirmed dead, by name", "286,000", "Mediazona and the BBC, to 6 Nov 2026", "count", "mz"],
                 ["Deaths linked to the war", "about 450,100, to 28 Aug 2026", "Leaked registry records analysed by pro-Ukrainian hackers — not verified", "est", "stripes"],
                 ["Killed", "up to 325,000 (1.2 million casualties), to Dec 2025", "CSIS", "est", "csis"],
                 ["Killed or seriously wounded", "nearly 1.6 million", "Institute for the Study of War, Nov 2026", "est", "stripes"],
                 ["Killed", "just under 6,000 — the last figure Moscow gave, in Sept 2022", "Russian Ministry of Defence", "own", "csis"]] },
        { n: "Ukraine", parties: [{ n: "Armed Forces of Ukraine", k: "state" }],
          loss: [["Killed", "up to 140,000 (500,000 – 600,000 casualties), to Dec 2025", "CSIS", "est", "csis"],
                 ["Soldiers killed", "over 46,000", "President Zelensky, Feb 2025", "own", "csis"]] }
      ], src: ["cfrUkr", "mz", "stripes", "csis", "hrmmu", "wl"] },

    { id: "armaz", n: "Armenia – Azerbaijan", rg: "Europe", lv: 1, tr: "down", trBy: "CFR", ty: "Territorial dispute", since: 1988, at: [39.9, 46.6], where: ["Armenia", "Azerbaijan"],
      sum: "Two wars over Nagorno-Karabakh (1988–94, 2020) and an Azerbaijani offensive in September 2023 that emptied the enclave of more than 100,000 Armenians. In August 2025 the two leaders initialled a peace agreement in Washington.",
      now: "The treaty is initialled, not signed: in July 2026 an Azerbaijani official said Baku will not sign until Armenia amends its constitution, which is tied to a 2027 referendum. No border incidents are reported for 2026.",
      d25: "8", d26: "2", cum: "39,800 – 49,000+", toll: [],
      sides: [{ n: "Armenia", parties: [{ n: "Armenia", k: "state" }], loss: [] }, { n: "Azerbaijan", parties: [{ n: "Azerbaijan", k: "state" }], loss: [] }], src: ["cfrArm", "wl"] },

    { id: "kosovo", n: "Kosovo – Serbia", rg: "Europe", lv: 1, tr: null, ty: "Territorial dispute", since: 2022, at: [42.9, 20.9], where: ["Kosovo", "Serbia"],
      sum: "Serbia does not recognise Kosovo's independence, declared in 2008. A crisis in the Serb-majority north has run since 2022, with barricades, boycotts and, in September 2023, a gun battle at Banjska.",
      now: "Listed as ongoing; no deaths are recorded for 2026 in the sources read.",
      d25: null, d26: null, cum: null, toll: [],
      sides: [{ n: "Kosovo", parties: [{ n: "Kosovo", k: "state" }], loss: [] }, { n: "Serbia", parties: [{ n: "Serbia", k: "state" }], loss: [] }], src: ["ww"] },

    /* ---------------------------- MIDDLE EAST ---------------------------- */
    { id: "iran", n: "United States & Israel – Iran", rg: "Middle East", lv: 4, tr: "up", trBy: "CFR", ty: "War between states", since: 2026, at: [27.0, 56.2], where: ["Iran"],
      sum: "On 28 February 2026 the United States and Israel struck Iran, killing Supreme Leader Ali Khamenei; the Assembly of Experts named his son Mojtaba to succeed him. Iran struck US bases, Israel and the Gulf states and closed the Strait of Hormuz; the US blockaded Iran's ports. A two-week ceasefire in April and a Pakistan-mediated memorandum in June lowered the fighting without ending it, and it flared again in July.",
      now: "US strikes hit Qeshm island on the night of 8–9 Nov; Washington called earlier strikes 'defensive'. The blockade of Iran's southern ports stands. Iranian state television says 11 tankers were attacked in ten days in Hormuz. Talks continue through Qatar and Pakistan; Iran's seven demands include an end to the blockade and to sanctions.",
      d25: null, d26: "8,000 – 10,600 on all fronts, Lebanon included", cum: null,
      toll: [["Killed on all fronts of the 2026 war, Lebanon included", "8,000 – 10,600", "Sum of the sources' counts, as tabulated", "irancas"], ["Displaced by the war", "up to 3.2 million", "UNHCR", "cfrIran"],
             ["Deadliest single incident reported", "at least 175 killed when a US strike hit an elementary school", "New York Times", "cfrIran"]],
      sides: [
        { n: "United States, Israel and the Gulf states", parties: [{ n: "United States", k: "state" }, { n: "Israel", k: "state" }, { n: "Gulf states struck by Iran (UAE, Kuwait, Oman, Saudi Arabia, Bahrain, Qatar)", k: "bloc" }],
          loss: [["Israel: killed", "72 — 40 soldiers, 1 contractor, 26 civilians by Iranian missiles, 5 civilians by Hezbollah fire (to 5 Aug)", "Israeli military and government data", "own", "irancas"],
                 ["United States: killed", "19 service members and 1 contractor; 624 wounded (to 21 Jul)", "US figures, as reported by TIME", "own", "irancas"],
                 ["Gulf states: killed", "UAE 15 · Oman 14 · Kuwait 12 · Saudi Arabia 3 · Bahrain 2–3 · Qatar 1", "Each government", "own", "irancas"]] },
        { n: "Iran and its allies", parties: [{ n: "Islamic Revolutionary Guard Corps (IRGC)", k: "state", at: [35.7, 51.4], us: "15 Apr 2019", note: "An arm of the Iranian state; the only state body on the US list." }, { n: "Armed forces of Iran", k: "state" },
            { n: "Kata'ib Hizballah and allied Iraqi militias", k: "armed", at: [33.0, 44.1], us: "2 Jul 2009" }],
          loss: [["Iran: killed", "3,528", "Iranian government", "own", "irancas"], ["Iran: killed", "3,400 (UN OCHA) · 3,684 (HRANA, a rights group)", "Outside counts", "count", "irancas"],
                 ["Iran: killed", "6,000", "Israeli military", "claim", "irancas"],
                 ["Of HRANA's count to 7 Apr", "1,701 civilians (at least 254 children), 1,221 military, 714 unclassified", "HRANA", "count", "irancas"],
                 ["Iranian military killed", "at least 6,620, to 8 Apr", "Hengaw, a rights group", "est", "irancas"],
                 ["Iraq: killed", "146, of them more than 101 militia fighters", "As tabulated", "count", "irancas"]] }
      ], src: ["cfrIran", "irancas", "ajiran", "fto"] },

    { id: "lebanon", n: "Israel – Hezbollah (Lebanon)", rg: "Middle East", lv: 4, tr: "flat", trBy: "CFR", ty: "War between a state and an armed group", since: 2023, at: [33.3, 35.5], where: ["Lebanon"],
      sum: "Hezbollah and Israel have exchanged fire since October 2023 and fought a war in 2024. On 2 March 2026, after the strikes on Iran, Hezbollah fired on Israel; Israel resumed large-scale bombing and invaded on 16 March. A US-brokered truce from 16 April was extended several times. A framework in June tied Israel's withdrawal to Hezbollah's disarmament, which Hezbollah rejected.",
      now: "Israel holds roughly a fifth of Lebanese territory. On 13 Nov Lebanese state media reported Israeli artillery and tank fire on Majdal Zoun, Bayt al-Sayyad and Mayfadoun.",
      d25: null, d26: "4,324 in Lebanon", cum: null,
      toll: [["Killed in Lebanon since 2 Mar 2026", "4,324 (12,221 injured) — the count does not separate fighters from civilians", "Lebanese Health Ministry", "irancas"],
             ["UN peacekeepers killed", "7 (Indonesia 4, France 2, Serbia 1)", "As tabulated", "irancas"], ["Displaced in Lebanon", "over 1 million", "Unattributed in the source", "lebwar"]],
      sides: [
        { n: "Israel", parties: [{ n: "Israel Defense Forces", k: "state" }],
          loss: [["Civilians killed by Hezbollah fire", "5 (to 5 Aug)", "Israeli government data", "own", "irancas"], ["Soldiers", "Counted within the 40 Israeli soldiers killed on all fronts of the 2026 war; no separate Lebanon total is published in the sources read", "Israeli military", "own", "irancas"]] },
        { n: "Hezbollah", parties: [{ n: "Hezbollah", k: "armed", at: [33.85, 35.86], us: "8 Oct 1997", uk: "2019" }],
          loss: [["Fighters killed", "over 1,000", "Hezbollah internal sources, per Asharq Al-Awsat", "own", "irancas"], ["Fighters killed", "1,700", "Israeli military", "claim", "irancas"]] },
        { n: "Lebanese state (not a party to the fighting)", parties: [{ n: "Lebanese Armed Forces", k: "state" }],
          loss: [["Soldiers and security officers killed in Israeli strikes", "at least 6 soldiers and 13 State Security officers, in the incidents listed", "Lebanese authorities", "own", "lebwar"]] }
      ], src: ["cfrLeb", "irancas", "lebwar", "lebcf", "fto", "uk"] },

    { id: "gaza", n: "Israel – Hamas (Gaza and the West Bank)", rg: "Middle East", lv: 4, tr: "up", trBy: "CFR", ty: "War between a state and an armed group", since: 2023, at: [31.4, 34.4], where: ["Palestine", "Israel"],
      sum: "On 7 October 2023 a Hamas-led attack killed some 1,200 people in Israel, most of them civilians, and took 251 hostages. Israel's campaign in Gaza followed. A US-brokered ceasefire took effect in October 2025: the remaining hostages were released and a US-created Board of Peace oversees the plan. Hamas dissolved its government in Gaza but has refused to disarm, citing continued Israeli strikes.",
      now: "The ceasefire holds in name. Gaza's Health Ministry counts 1,610 people killed since it began (to 7 Nov 2026); six were killed in a strike on the Nasser medical complex in November. Raids continued in the West Bank at Marda, Nablus and Jenin.",
      d25: null, d26: "about 1,600 in Gaza since the Oct 2025 ceasefire", cum: "74,640 in Gaza",
      toll: [["Killed in Gaza since 7 Oct 2023", "74,640 (175,947 injured) — the count does not separate fighters from civilians", "Gaza Health Ministry, 7 Nov 2026", "wafa"],
             ["The same count, as Israel's army sees it", "An Israeli military official accepted a toll of about 71,000 in January 2026", "Israeli military official, per JTA", "jta"],
             ["Killed in Gaza since the ceasefire of Oct 2025", "1,610 (5,819 injured)", "Gaza Health Ministry, 7 Nov 2026", "wafa"],
             ["Palestinians killed in the West Bank since Oct 2023", "more than 1,100", "Palestinian Authority Health Ministry", "toi"]],
      sides: [
        { n: "Israel", parties: [{ n: "Israel Defense Forces", k: "state" }],
          loss: [["Killed in the 7 Oct 2023 attack", "some 1,200, mostly civilians; 251 taken hostage", "Israeli authorities", "own", "toi"],
                 ["Soldiers, reservists and security officers killed since 7 Oct 2023, all fronts", "970 — of them 472 in the Gaza ground offensive; 6,424 wounded", "Israeli military, 7 Oct 2026", "own", "toi"]] },
        { n: "Hamas and allied groups", parties: [{ n: "Hamas", k: "armed", at: [31.5, 34.45], us: "8 Oct 1997", uk: "2021" }, { n: "Palestinian Islamic Jihad", k: "armed", at: [31.3, 34.3], us: "8 Oct 1997", uk: "2001" },
            { n: "Popular Front for the Liberation of Palestine", k: "armed", us: "8 Oct 1997" }, { n: "Al-Aqsa Martyrs Brigade", k: "armed", at: [32.2, 35.25], us: "27 Mar 2002" }],
          loss: [["Fighters killed in Gaza", "over 24,000", "Israeli military estimate", "claim", "toi"], ["Fighters killed inside Israel on 7 Oct 2023", "about 1,600", "Israeli military estimate", "claim", "toi"],
                 ["Own count", "Hamas has not published a total of its dead in the sources read", "—", "own", "toi"]] }
      ], src: ["cfrIsr", "wafa", "ajgaza", "toi", "jta", "fto", "uk"] },

    { id: "yemen", n: "Yemen: Houthis – Saudi-led coalition", rg: "Middle East", lv: 4, tr: "up", trBy: "CFR", ty: "Civil war with foreign intervention", since: 2014, at: [15.4, 44.2], where: ["Yemen"],
      sum: "The Houthis took Sanaa in 2014; a Saudi-led coalition intervened in 2015 for the internationally recognised government. A truce from 2022 kept the fronts largely quiet until 2026, when open war returned: Saudi air strikes on Houthi territory, and Houthi missiles and drones on Saudi Arabia.",
      now: "Fighting intensified in November across al-Jawf, Marib, al-Bayda, Taiz, Lahij and al-Dhale; Houthi shelling hit Aden. Saudi Arabia says it intercepted cruise missiles aimed at Riyadh and drones aimed at Mecca province; the Houthis deny targeting Mecca and say they hit Yanbu and Riyadh's airport.",
      d25: "2,940", d26: "4,072", cum: "385,000+",
      toll: [["Casualties recorded", "11,755 — 2,098 killed and 9,657 wounded; more than 2,000 of them in nine days", "World Health Organization, to 8 Nov 2026", "ajyemen"], ["Displaced since 1 Aug 2026", "more than 320,000", "World Health Organization", "ajyemen"]],
      sides: [
        { n: "Houthis", parties: [{ n: "Ansarallah (the Houthis)", k: "armed", at: [15.9, 44.0], us: "5 Mar 2025", note: "Listed by the US in January 2021, delisted that February, listed again in March 2025. Not on the UK list." }],
          loss: [["Fighters killed or wounded", "at least 138", "Yemeni army spokesman — not verified", "claim", "ajyemen"], ["Killed in Saudi strikes on Sanaa province", "44", "Houthi media, 9 Nov", "own", "chyemen"]] },
        { n: "Recognised government and the Saudi-led coalition", parties: [{ n: "Government of Yemen", k: "state" }, { n: "Saudi Arabia and coalition", k: "state" }], loss: [["Own count", "No total is published in the sources read", "—", "own", "ajyemen"]] },
        { n: "Also present", parties: [{ n: "Al-Qaeda in the Arabian Peninsula", k: "armed", at: [14.3, 47.2], us: "19 Jan 2010" }], loss: [] }
      ], src: ["cfrYem", "ajyemen", "chyemen", "wl", "fto"] },

    { id: "syria", n: "Syria after Assad", rg: "Middle East", lv: 4, tr: "flat", trBy: "CFR", ty: "Post-war violence and occupation", since: 2011, at: [35.2, 38.6], where: ["Syria"],
      sum: "Rebels led by Hay'at Tahrir al-Sham took Damascus on 8 December 2024 and Bashar al-Assad fled to Moscow. The transitional government under Ahmed al-Sharaa has since fought Assad loyalists on the coast, Druze armed groups in Sweida and, on and off, the Kurdish-led SDF, which agreed in March 2025 to merge into the state. Israel has held the buffer zone, Mount Hermon and Quneitra since the day Assad fell.",
      now: "Deaths are far below 2025's. Clashes between the government and the SDF ran into 2026; Islamic State cells remain active.",
      d25: "8,837", d26: "1,575", cum: "664,800+",
      toll: [["Killed, Dec 2024 – Sep 2025", "10,672+, of them 3,020 executed outside any court", "Syrian Observatory for Human Rights", "syr"]],
      sides: [
        { n: "Transitional government", parties: [{ n: "Syrian transitional government (formerly Hay'at Tahrir al-Sham)", k: "state", note: "HTS was removed from the US list on 8 July 2025; the UK revoked its order in October 2025." }], loss: [] },
        { n: "Armed groups opposed to it, or outside it", parties: [{ n: "Syrian Democratic Forces", k: "armed", at: [36.5, 40.7] }, { n: "Assad loyalist insurgents", k: "armed", at: [35.4, 36.0] }, { n: "Druze armed groups (Sweida)", k: "armed", at: [32.7, 36.6] },
            { n: "Islamic State", k: "armed", at: [34.6, 39.0], us: "17 Dec 2004", uk: "2014" }],
          loss: [] },
        { n: "Foreign forces", parties: [{ n: "Israel (holds territory in the south)", k: "state" }, { n: "United States", k: "state" }], loss: [["US: killed", "2 soldiers and a civilian interpreter, shot at Palmyra on 13 Dec 2025 by an alleged Islamic State gunman", "US authorities", "own", "syr"]] }
      ], src: ["cfrSyr", "syr", "wl", "fto", "uk"] },

    { id: "iraq", n: "Iraq: militias, Islamic State and the Iran war", rg: "Middle East", lv: 3, tr: "flat", trBy: "CFR", ty: "Insurgency and spillover", since: 2003, at: [33.3, 44.4], where: ["Iraq"],
      sum: "Iraq's Iran-aligned militias, part of the state's Popular Mobilization Forces, fought on Iran's side in 2026 and were bombed for it by the US and Israel. Islamic State sleeper cells still attack.",
      now: "A drone strike forced the Khor Mor gas field in Iraqi Kurdistan to stop work on 8 Nov; drones hit Iranian Kurdish opposition groups in Erbil and Sulaymaniyah on 4 Nov. The new prime minister faced a September deadline to disarm the pro-Iran militias.",
      d25: "574", d26: "419", cum: "334,700 – 1,215,000+",
      toll: [["Killed in Iraq during the 2026 Iran war", "146 (522 injured)", "As tabulated", "irancas"], ["Iraqi Kurdistan", "32 killed — 27 of them Peshmerga — by Iranian strikes and pro-Iranian groups", "As tabulated", "irancas"]],
      sides: [
        { n: "Iraqi state and US forces", parties: [{ n: "Iraq", k: "state" }, { n: "United States", k: "state" }], loss: [["Iraqi forces killed in US strikes on militia positions", "7 soldiers and 2 policemen", "As tabulated", "own", "irancas"]] },
        { n: "Iran-aligned militias", parties: [{ n: "Kata'ib Hizballah", k: "armed", at: [32.6, 44.0], us: "2 Jul 2009" }, { n: "Asa'ib Ahl al-Haq", k: "armed", us: "10 Jan 2020" }, { n: "Harakat al-Nujaba", k: "armed", us: "18 Sep 2025" }, { n: "Kata'ib Sayyid al-Shuhada", k: "armed", us: "18 Sep 2025" }],
          loss: [["Militia fighters killed in US and Israeli strikes", "more than 101, including 30 of the Islamic Resistance in Iraq", "As tabulated", "count", "irancas"]] },
        { n: "Islamic State", parties: [{ n: "Islamic State", k: "armed", at: [35.5, 43.2], us: "17 Dec 2004", uk: "2014" }], loss: [] }
      ], src: ["cfrIrq", "irancas", "wl", "fto", "uk"] },

    { id: "pkk", n: "Turkey – PKK", rg: "Middle East", lv: 1, tr: "down", trBy: "CFR", ty: "Insurgency, ending", since: 1984, at: [37.3, 43.6], where: ["Turkey"],
      sum: "Four decades of war between Turkey and the Kurdistan Workers' Party cost nearly 40,000 lives. In May 2025 the PKK's leadership voted to disband.",
      now: "Turkey passed a law in August 2026 setting the legal terms of disbandment and reintegration; PKK fighters left four camps in northern Iraq in October 2026. Kurdish parties say Ankara has not delivered the reforms it promised.",
      d25: "300", d26: "5", cum: "nearly 40,000",
      toll: [["Killed since 1984", "nearly 40,000", "UK Home Office country report (2018)", "cfrTur"]],
      sides: [{ n: "Turkey", parties: [{ n: "Turkey", k: "state" }], loss: [] }, { n: "PKK", parties: [{ n: "Kurdistan Workers' Party (PKK)", k: "armed", at: [36.9, 44.2], us: "8 Oct 1997", uk: "2001", note: "Voted to dissolve itself in May 2025; still on both lists." }], loss: [] }], src: ["cfrTur", "wl", "fto", "uk"] },

    /* ---------------------------- AFRICA ---------------------------- */
    { id: "sudan", n: "Sudan: army – Rapid Support Forces", rg: "Africa", lv: 5, tr: "up", trBy: "CFR", ty: "Civil war", since: 2023, at: [13.2, 29.4], where: ["Sudan"],
      sum: "War broke out on 15 April 2023 between the army of General Abdel Fattah al-Burhan and the Rapid Support Forces of Mohamed Hamdan Dagalo. It has produced the world's largest displacement and a famine. The RSF took El Fasher, the last army-held capital in Darfur, in October 2025 after a long siege.",
      now: "The army took al-Khuwai in West Kordofan on 13 Nov and has broken the siege of El Obeid; analysts say the RSF, which holds all five Darfur states, has gone over to the defensive there. A suspected RSF drone strike near Ed Damazin killed nine on 10 Nov. Ethiopia expelled six Sudanese diplomats on 4 Nov after Khartoum accused it of hosting RSF drone sites.",
      d25: "21,994 – 80,000+", d26: "10,179", cum: "about 150,000 since April 2023",
      toll: [["The yearly figures on this card", "come from a table row that also takes in South Sudan", "Wikipedia's table", "wl"], ["Killed since April 2023", "about 150,000 — widely cited; the article gives no source", "Al Jazeera, 14 Nov 2026", "ajsudan"], ["Displaced", "more than 14 million of 53 million people; about 4.5 million have fled abroad", "Al Jazeera, 14 Nov 2026", "ajsudan"], ["Facing starvation", "nearly 400,000", "NPR", "cfrSud"]],
      sides: [
        { n: "Sudanese Armed Forces and allies", parties: [{ n: "Sudanese Armed Forces", k: "state" }, { n: "Allied Darfur armed movements", k: "armed" }, { n: "Sudanese Muslim Brotherhood", k: "armed", at: [15.6, 32.5], us: "16 Mar 2026", note: "Designated by the US in March 2026. The designation names the movement; the sources read do not describe its part in the fighting." }],
          loss: [["Own count", "Neither side publishes its losses", "—", "own", "ajsudan"]] },
        { n: "Rapid Support Forces and allies", parties: [{ n: "Rapid Support Forces", k: "armed", at: [13.6, 25.3] }, { n: "SPLM-North (al-Hilu faction)", k: "armed", at: [11.0, 29.7] }], loss: [["Own count", "Neither side publishes its losses", "—", "own", "ajsudan"]] },
        { n: "Foreign backers, as reported", parties: [{ n: "For the RSF: the United Arab Emirates (which denies it). For the army: Egypt, Iran, Russia", k: "bloc" }], loss: [] }
      ], src: ["cfrSud", "ajsudan", "wl", "fto"] },

    { id: "southsudan", n: "South Sudan", rg: "Africa", lv: 3, tr: "up", trBy: "CFR", ty: "Civil war, resuming", since: 2013, at: [8.3, 32.0], where: ["S. Sudan"],
      sum: "The 2013–18 civil war killed an estimated 383,000. Its peace deal collapsed in 2025: a Nuer militia overran the army base at Nasir, President Kiir arrested his rival and vice-president Riek Machar, and Machar's party declared the agreement dead. Ugandan troops and aircraft fight for the government.",
      now: "Machar is on trial for treason. The army took Akobo in March 2026; an attack in Abiemnom that month killed more than 200. Factions of the opposition army have been fighting each other since October. Elections are set for December 2026.",
      d25: null, d26: null, cum: "383,000 in 2013–18",
      toll: [["Killed in the Abiemnom attack, March 2026", "more than 200", "Amnesty International, per CFR", "cfrSsd"], ["Internally displaced", "over 2 million", "CFR", "cfrSsd"], ["No annual count", "The comparable table folds South Sudan into Sudan's wars; the level here rests on the events reported, not a death toll", "The Archive", "wl"]],
      sides: [
        { n: "Government", parties: [{ n: "South Sudan People's Defence Forces", k: "state" }, { n: "Uganda (troops and air strikes)", k: "state" }], loss: [] },
        { n: "Opposition", parties: [{ n: "SPLA-in-Opposition", k: "armed", at: [8.6, 33.1] }, { n: "Nuer White Army", k: "armed", at: [8.6, 33.07] }], loss: [["Killed in fighting between its own factions", "more than 40 soldiers since October 2026", "CFR", "count", "cfrSsd"]] }
      ], src: ["cfrSsd", "ww", "wl"] },

    { id: "ethiopia", n: "Ethiopia: Tigray, Amhara and the Eritrean border", rg: "Africa", lv: 4, tr: "up", trBy: "CFR", ty: "Civil war, with a neighbour drawn in", since: 2020, at: [14.1, 38.7], where: ["Ethiopia", "Eritrea"],
      sum: "The Tigray war of 2020–22 ended in a truce that left Tigray's forces armed and Eritrea aggrieved. War returned on 23 September 2026, when a coalition of Tigrayan forces, Amhara Fano militias and an Afar front seized the airports of Axum, Shire and Mekelle. Federal forces retook Mekelle's airport in early October and then Adigrat, Adwa and Zalambessa.",
      now: "Federal and Tigrayan forces are fighting around Rama, Gomahalo and Semema. Ethiopian and Eritrean forces exchanged artillery fire around Badme on 11–13 Nov; Eritrea accuses Ethiopia of invading it, Ethiopia accuses Eritrea of arming the rebels. The G7 has called for restraint.",
      d25: "6,322", d26: "5,152 (to August, before the new war)", cum: "500,000 – 616,300+",
      toll: [["Civilians killed at Alamata", "14 in a drone strike on a school (22 Sep); at least 52 in fighting (28 Sep)", "BBC, as cited", "eth26"], ["No reliable total", "Neither side's battlefield claims are verified; the review of 13 Nov gives none", "Critical Threats Project", "ctpEth"]],
      sides: [
        { n: "Federal government", parties: [{ n: "Ethiopian National Defense Force", k: "state" }], loss: [["Killed and wounded", "272 killed, 260 wounded — the source does not say on which side", "Ethiopian government", "own", "eth26"]] },
        { n: "Coalition of rebel forces", parties: [{ n: "Tigray Defense Forces (TPLF)", k: "armed", at: [13.5, 39.5] }, { n: "Fano (Amhara)", k: "armed", at: [11.6, 37.9] }, { n: "Afar National Unity Revolutionary Front", k: "armed", at: [13.3, 40.2] }], loss: [] },
        { n: "Eritrea", parties: [{ n: "Eritrean Defence Forces", k: "state", note: "Eritrea denies any part in forming the rebel coalition." }], loss: [] }
      ], src: ["cfrEth", "ctpEth", "eth26", "wl"] },

    { id: "somalia", n: "Somalia: government – al-Shabaab", rg: "Africa", lv: 4, tr: "flat", trBy: "CFR", ty: "Insurgency", since: 2006, at: [2.6, 45.0], where: ["Somalia"],
      sum: "Al-Shabaab, an al-Qaeda affiliate, has fought Somalia's federal government and the African Union forces protecting it since 2006. The government is also at odds with its own member states: Puntland seized federal-aligned bases in August 2026.",
      now: "The African Union mission risks collapse: Washington has said it will end logistical support after December 2026, and the mission's end date has been brought forward. A suspected al-Shabaab ambush killed eight in Kenya's Mandera county on 10 Nov.",
      d25: "10,788", d26: "5,601", cum: "376,200 – 1,000,000+",
      toll: [],
      sides: [
        { n: "Government and its allies", parties: [{ n: "Somali National Army", k: "state" }, { n: "African Union mission (AUSSOM)", k: "bloc" }, { n: "Turkey and the United States (air strikes)", k: "state" }],
          loss: [["Soldiers killed at Teedan, 2 Aug", "41 (and 40 injured)", "Al-Shabaab", "claim", "ctpAf"], ["Soldiers killed near Awdheegle, 10 Aug", "at least 10 (reports); al-Shabaab claims 52 casualties", "Local reports · al-Shabaab", "claim", "ctpAf"],
                 ["Kenyan soldiers killed, 28 Jul", "5", "As reported", "count", "ctpAf"], ["African Union soldiers killed since 2007", "over 3,500", "Al Jazeera (2023), per CFR", "est", "cfrSom"]] },
        { n: "Al-Shabaab", parties: [{ n: "Al-Shabaab", k: "armed", at: [1.2, 43.6], us: "18 Mar 2008", uk: "2010" }], loss: [["Own count", "No total is published in the sources read", "—", "own", "cfrSom"]] }
      ], src: ["cfrSom", "ctpAf", "wl", "fto", "uk"] },

    { id: "sahel", n: "The Sahel: JNIM and Islamic State against the juntas", rg: "Africa", lv: 5, tr: "up", trBy: "CFR", ty: "Insurgency", since: 2012, at: [14.3, -2.6], where: ["Mali", "Burkina Faso", "Niger"],
      sum: "Jihadist insurgencies that began in northern Mali in 2012 now contest most of rural Mali, Burkina Faso and western Niger. All three states are ruled by soldiers who expelled French and UN forces and brought in Russia's. The borderlands of the three account for more than half the world's deaths from terrorism.",
      now: "JNIM has turned to economic warfare: a fuel and transport blockade of western Mali that cut the roads to Bamako and left the capital short of fuel. Both groups are pushing south into Benin and north-western Nigeria. A Malian drone strike at Hassi Laghdaf in October 2026 killed at least 13 civilians, according to rights activists; the government said it hit an armed group.",
      d25: "24,046", d26: "18,132", cum: "488,500+",
      toll: [["Killed in Mali, Burkina Faso and Niger, 1 Jan – 28 Nov 2025", "over 10,000", "ACLED", "acledSah"], ["The annual figures on this card", "cover the wider table row, 'Islamist insurgencies in the Maghreb and Sahel', which reaches from Algeria to Nigeria", "Wikipedia's table", "wl"]],
      sides: [
        { n: "The three juntas and Russia", parties: [{ n: "Armies of Mali, Burkina Faso and Niger", k: "state" }, { n: "Africa Corps (successor to the Wagner Group)", k: "armed", at: [12.65, -8.0], uk: "2023", note: "The UK proscribed the Wagner Group in 2023. Africa Corps, an arm of Russia's defence ministry, replaced it in Mali." }],
          loss: [["Soldiers killed in one ambush, Koubel-Alpha, Sept 2025", "about 90 (Burkina Faso)", "ACLED", "count", "acledSah"], ["Beninese soldiers killed in Park W, Apr 2025", "over 50", "ACLED", "count", "acledSah"]] },
        { n: "Jihadist groups", parties: [{ n: "JNIM (al-Qaeda's Sahel coalition)", k: "armed", at: [14.5, -4.2], us: "6 Sep 2018", uk: "2019" }, { n: "Islamic State Sahel Province", k: "armed", at: [15.2, 1.6], us: "23 May 2018", note: "Listed by the US as ISIS in the Greater Sahara." }],
          loss: [["Own count", "No total is published in the sources read", "—", "own", "acledSah"]] }
      ], src: ["cfrSah", "acledSah", "wl", "fto", "uk"] },

    { id: "nigeria", n: "Nigeria: Islamic State, Boko Haram and the bandits", rg: "Africa", lv: 4, tr: "up", trBy: "ACLED, per Critical Threats", ty: "Insurgency", since: 2009, at: [11.9, 13.3], where: ["Nigeria"],
      sum: "Boko Haram's insurgency in the north-east, begun in 2009, split in 2016; its offshoot, Islamic State West Africa Province, is now the stronger and the two fight each other over Lake Chad. In the north-west, armed bandits and a newer Islamic State-linked group, Lakurawa, hold sway. The United States began striking in Nigeria on 25 December 2025.",
      now: "ACLED records more ISWAP attacks in 2026 than in all of 2025. A joint US–Nigerian raid killed ISWAP's leader, Abu Bilal al-Minuki, in mid-May. About 200 US troops arrived in February to train and advise; after the May strikes the US commander said most would leave.",
      d25: "3,200", d26: "3,400", cum: "107,300+",
      toll: [],
      sides: [
        { n: "Nigeria and the United States", parties: [{ n: "Nigerian Armed Forces", k: "state" }, { n: "United States", k: "state" }], loss: [["Own count", "No US or Nigerian forces were harmed in the May offensive; no annual total is published in the sources read", "Nigerian and US officials", "own", "usnig"]] },
        { n: "Armed groups", parties: [{ n: "Islamic State West Africa Province", k: "armed", at: [13.0, 13.6], us: "28 Feb 2018" }, { n: "Boko Haram", k: "armed", at: [11.1, 13.7], us: "14 Nov 2013", uk: "2013" }, { n: "Ansaru", k: "armed", at: [10.6, 7.4], us: "14 Nov 2013", uk: "2012" }, { n: "Lakurawa", k: "armed", at: [13.3, 4.8] }, { n: "Bandit groups (north-west)", k: "gang", at: [12.2, 6.6] }],
          loss: [["ISWAP and Boko Haram fighters killed in joint operations, to 18 May 2026", "about 175", "Nigerian Defence Headquarters", "claim", "usnig"], ["Lakurawa fighters killed in the Dec 2025 strike", "about 155, with about 200 missing", "The New Humanitarian", "est", "usnig"],
                 ["ISWAP fighters killed by a Boko Haram faction, 29 Jul", "about 20", "ACLED", "count", "ctpAf"]] }
      ], src: ["usnig", "ctpAf", "wl", "fto", "uk"] },

    { id: "drc", n: "Eastern Congo: M23, the ADF and Kinshasa", rg: "Africa", lv: 4, tr: "up", trBy: "CFR", ty: "Civil war with foreign intervention", since: 1996, at: [-1.7, 29.2], where: ["Dem. Rep. Congo"],
      sum: "The M23 rebellion, which Kinshasa and UN experts say is backed by Rwanda, took Goma in January 2025 and Bukavu that February. Kinshasa and Kigali signed the Washington Accords in December 2025 and Kinshasa and the rebels a framework at Doha; neither has stopped the fighting. Further north the ADF, an Islamic State affiliate, massacres villagers.",
      now: "On 11 Nov the rebel front, now merged under former president Joseph Kabila, advanced in South Kivu and was added to the UN sanctions list. ADF attacks in Mambasa, Ituri, killed at least 22 the same day. The east is also in the grip of the country's largest Ebola outbreak: 3,901 deaths by 26 Sep.",
      d25: "7,737 – 10,000+", d26: "3,467", cum: "219,700+",
      toll: [["Killed in rebel-held areas, June–July 2026", "more than 300", "Congolese government — Rwanda rejects the claim", "undrc"], ["Internally displaced", "more than 7 million", "CFR", "cfrDrc"]],
      sides: [
        { n: "Government", parties: [{ n: "Armed Forces of the DRC", k: "state" }], loss: [["Own count", "No total is published in the sources read", "—", "own", "cfrDrc"]] },
        { n: "M23 and its backers", parties: [{ n: "M23 / Congo River Alliance", k: "armed", at: [-1.68, 29.22], note: "Not on the US or UK lists; under UN sanctions." }, { n: "Rwanda (accused; denies it)", k: "state" }], loss: [["Own count", "No total is published in the sources read", "—", "own", "cfrDrc"]] },
        { n: "Other armed groups", parties: [{ n: "Allied Democratic Forces (ISIS-DRC)", k: "armed", at: [1.0, 29.6], us: "11 Mar 2021" }, { n: "CODECO", k: "armed", at: [1.9, 30.4] }], loss: [] }
      ], src: ["cfrDrc", "undrc", "wl", "fto"] },

    { id: "cameroon", n: "Cameroon: the Anglophone war and the far north", rg: "Africa", lv: 4, tr: null, ty: "Separatist war and insurgency", since: 2017, at: [5.9, 10.1], where: ["Cameroon"],
      sum: "Two wars in one country: English-speaking separatists fighting for an independent 'Ambazonia' in the west since 2017, and Boko Haram and Islamic State raids in the far north.",
      now: "No dated report for November 2026 was read; the level rests on the year's death count.",
      d25: "1,966", d26: "1,418", cum: "11,000+", toll: [],
      sides: [{ n: "Government", parties: [{ n: "Cameroon", k: "state" }], loss: [] }, { n: "Armed groups", parties: [{ n: "Ambazonian separatist militias", k: "armed", at: [5.9, 10.1] }, { n: "Boko Haram", k: "armed", at: [11.0, 14.1], us: "14 Nov 2013", uk: "2013" }], loss: [] }], src: ["wl", "fto", "uk"] },

    { id: "car", n: "Central African Republic", rg: "Africa", lv: 3, tr: "flat", trBy: "CFR", ty: "Civil war", since: 2012, at: [6.6, 20.9], where: ["Central African Rep."],
      sum: "A decade of war between the government and shifting coalitions of ex-Séléka and anti-balaka militias. President Touadéra, re-elected in a contested vote in December 2025, relies on Russia's Africa Corps.",
      now: "An attack at Am-Dafok on 30 June 2026 killed 29 and displaced more than 17,000. The UN mission is leaving some bases; in October the UN warned against an early drawdown.",
      d25: "1,276", d26: "478", cum: "16,300+", toll: [["Displaced by the violence", "over 1 million; 750,000 refugees", "CFR", "cfrCar"]],
      sides: [{ n: "Government and its allies", parties: [{ n: "Central African Republic", k: "state" }, { n: "Africa Corps (successor to the Wagner Group)", k: "armed", at: [4.4, 18.6], uk: "2023" }, { n: "UN mission (MINUSCA)", k: "bloc" }], loss: [] },
              { n: "Rebel coalitions", parties: [{ n: "Coalition of Patriots for Change, ex-Séléka and anti-balaka groups", k: "armed", at: [7.8, 22.4] }], loss: [] }], src: ["cfrCar", "wl", "uk"] },

    { id: "mozambique", n: "Mozambique: Cabo Delgado", rg: "Africa", lv: 3, tr: null, ty: "Insurgency", since: 2017, at: [-12.3, 40.3], where: ["Mozambique"],
      sum: "An Islamic State affiliate has fought in the gas-rich northern province of Cabo Delgado since 2017.",
      now: "No dated report for November 2026 was read; the level rests on the year's death count.",
      d25: "824", d26: "434", cum: "7,800+", toll: [],
      sides: [{ n: "Government", parties: [{ n: "Mozambique", k: "state" }], loss: [] }, { n: "Insurgents", parties: [{ n: "ISIS-Mozambique", k: "armed", at: [-11.6, 40.0], us: "11 Mar 2021" }], loss: [] }], src: ["wl", "fto"] },

    { id: "libya", n: "Libya", rg: "Africa", lv: 3, tr: "flat", trBy: "CFR", ty: "Divided state", since: 2011, at: [31.2, 16.6], where: ["Libya"],
      sum: "Two governments since 2014: one in Tripoli, recognised by the UN, and one in the east, backed by Khalifa Haftar's forces. Elections stay postponed; militias fight over the capital and the oil.",
      now: "A drone struck Tripoli's Brega fuel depot on 3 Sept 2026; an armed group shut a valve on the El Sharara pipeline on 21 Sept, cutting production.",
      d25: "282", d26: "177", cum: "30,300 – 43,000", toll: [],
      sides: [{ n: "Tripoli", parties: [{ n: "Government of National Unity and allied militias", k: "state" }], loss: [] }, { n: "The east", parties: [{ n: "Libyan National Army (Haftar)", k: "armed", at: [32.1, 20.1] }], loss: [] }], src: ["cfrLby", "wl"] },

    { id: "wsahara", n: "Western Sahara", rg: "Africa", lv: 2, tr: null, ty: "Territorial dispute", since: 1975, at: [24.6, -13.0], where: ["W. Sahara"],
      sum: "Morocco holds most of the territory; the Polisario Front, based in Algeria, ended a 29-year ceasefire in November 2020 and has shelled the Moroccan wall since.",
      now: "Listed as ongoing, at a low level.",
      d25: "54", d26: "5", cum: "14,000 – 21,000+", toll: [],
      sides: [{ n: "Morocco", parties: [{ n: "Morocco", k: "state" }], loss: [] }, { n: "Polisario", parties: [{ n: "Polisario Front", k: "armed", at: [27.7, -8.1] }], loss: [] }], src: ["wl", "ww"] },

    /* ---------------------------- ASIA ---------------------------- */
    { id: "myanmar", n: "Myanmar", rg: "Asia", lv: 5, tr: "flat", trBy: "CFR", ty: "Civil war", since: 2021, at: [21.6, 96.3], where: ["Myanmar"],
      sum: "The army overthrew the elected government on 1 February 2021. A nationwide uprising joined older ethnic armies; together they hold more of the country than the army does. In April 2026 the coup leader, Min Aung Hlaing, became president of a nominally civilian government widely seen as a façade for military rule.",
      now: "Resistance forces and ethnic armies control about 42% of the country against the army's 21%; neither has a decisive edge. On 10 Nov the army said it had taken a rebel headquarters and several bases in the south.",
      d25: "15,824", d26: "8,348", cum: "over 100,000 since the coup",
      toll: [["Killed since the 2021 coup", "more than 100,000", "A conflict monitor, per France 24 (July 2026)", "f24"], ["Killed, to 1 Jan 2026", "89,200 – 96,000+", "ACLED", "myan"], ["Displaced", "5.2 million", "CFR", "cfrMya"], ["By side", "No source read divides the dead between the army and its opponents", "—", "myan"]],
      sides: [
        { n: "The military", parties: [{ n: "Tatmadaw (Myanmar's armed forces) and allied militias", k: "state", note: "Not on the US or UK terrorist lists." }], loss: [] },
        { n: "Resistance and ethnic armies", parties: [{ n: "People's Defence Force (National Unity Government)", k: "armed", at: [22.1, 95.1] }, { n: "Arakan Army", k: "armed", at: [20.1, 93.0] }, { n: "Kachin Independence Army", k: "armed", at: [25.4, 97.4] }, { n: "Karen National Liberation Army", k: "armed", at: [17.2, 97.8] }, { n: "Karenni and Chin forces", k: "armed", at: [19.6, 97.2] }], loss: [] }
      ], src: ["cfrMya", "myan", "f24", "wl"] },

    { id: "afpak", n: "Afghanistan – Pakistan", rg: "Asia", lv: 4, tr: "flat", trBy: "CFR", ty: "War between states", since: 2025, at: [33.6, 70.1], where: ["Afghanistan", "Pakistan"],
      sum: "Pakistan accuses the Taliban government of sheltering the Pakistani Taliban, which kills its soldiers and police. Border fighting in October 2025 became open war on 21–26 February 2026, when Pakistan bombed Nangarhar, Paktika and Khost and declared 'open war'. A pause over Eid in March did not last.",
      now: "The two armies clashed at Angoor Adda and near the Torkham crossing between 29 Oct and 1 Nov; Afghanistan said Pakistani air raids killed nine in Kunar and Helmand on 1 Oct. No ceasefire is in force.",
      d25: "4,409", d26: "5,097", cum: null,
      toll: [["The yearly figures on this card", "cover every conflict inside Afghanistan, not only the war with Pakistan", "Wikipedia's table", "wl"], ["Afghans killed, Jan–Mar 2026", "over 370", "United Nations, per Al Jazeera", "ajafp"], ["Civilians killed in Afghanistan, 26 Feb – 5 Mar", "56 (129 injured)", "UN mission in Afghanistan", "afpak"], ["Displaced in Afghanistan", "about 115,000", "UNHCR, early March", "afpak"]],
      sides: [
        { n: "Pakistan", parties: [{ n: "Pakistan Armed Forces", k: "state" }],
          loss: [["Soldiers killed", "13 (27 injured)", "Pakistan", "own", "afpak"], ["Soldiers killed", "327 (350+ injured)", "Afghan Ministry of Defence", "claim", "afpak"]] },
        { n: "Afghanistan", parties: [{ n: "Taliban government forces", k: "state" }, { n: "Tehrik-e Taliban Pakistan (fighting from Afghan soil, Pakistan says)", k: "armed", at: [33.0, 69.9], us: "1 Sep 2010", uk: "2011" }],
          loss: [["Soldiers killed", "28 (42 injured), to 3 Mar", "Afghanistan", "own", "afpak"], ["Taliban fighters killed", "796 (1,043+ injured), plus 80+ Pakistani Taliban", "Pakistan", "claim", "afpak"]] }
      ], src: ["cfrAfp", "afpak", "lwj", "ajafp", "wl", "fto", "uk"] },

    { id: "pakistan", n: "Pakistan: the Pakistani Taliban and Baloch insurgents", rg: "Asia", lv: 4, tr: null, ty: "Insurgency", since: 2004, at: [30.2, 67.0], where: ["Pakistan"],
      sum: "Two insurgencies inside Pakistan: the Pakistani Taliban in Khyber Pakhtunkhwa, and Baloch separatists in Balochistan. The Islamic State's Khorasan branch attacks both the state and its rivals.",
      now: "A Pakistani Taliban ambush killed 10 policemen in Kohat on 11 Nov; authorities said 18 militants died in the firefight. A suicide attack claimed by an allied group killed 31 on 18 Sept.",
      d25: "985", d26: "1,110", cum: "23,100+",
      toll: [["Pakistanis killed in three years by attacks from Afghan soil", "4,700", "A Pakistani diplomat, 29 Oct 2026 — a claim", "lwj"]],
      sides: [
        { n: "Pakistan", parties: [{ n: "Pakistani army and police", k: "state" }], loss: [["Police killed at Kohat, 11 Nov", "10", "Pakistani authorities", "own", "lwj"]] },
        { n: "Insurgents", parties: [{ n: "Tehrik-e Taliban Pakistan", k: "armed", at: [33.2, 70.5], us: "1 Sep 2010", uk: "2011" }, { n: "Balochistan Liberation Army", k: "armed", at: [28.5, 65.4], us: "12 Aug 2025", uk: "2006" }, { n: "Islamic State Khorasan Province", k: "armed", at: [34.4, 70.5], us: "14 Jan 2016" }],
          loss: [["Militants killed at Kohat, 11 Nov", "18", "Pakistani authorities", "claim", "lwj"]] }
      ], src: ["lwj", "wl", "fto", "uk"] },

    { id: "kashmir", n: "India – Pakistan and Kashmir", rg: "Asia", lv: 3, tr: "flat", trBy: "CFR", ty: "Territorial dispute between nuclear states", since: 1947, at: [34.1, 74.6], where: [],
      sum: "After an attack that killed 26 people in Kashmir in April 2025, India struck nine sites in Pakistan and Pakistani-held Kashmir on 6 May 2025; four days of missile, drone and air combat followed before a US-brokered ceasefire. India has suspended the Indus Waters Treaty; Pakistan calls any diversion of its rivers an act of war.",
      now: "The ceasefire has held since May 2025. An Indian destroyer and a Pakistani patrol vessel collided in the Arabian Sea on 15 Sept 2026; Indian border guards killed two Pakistani civilians on 2 Oct, in an incident both sides describe differently. Elections in several Kashmir constituencies were postponed amid deadly unrest and an internet blackout.",
      d25: "975", d26: "200", cum: "202,200 – 2,000,000",
      toll: [["May 2025", "The tracker read gives no agreed casualty figures for the four days of fighting", "CFR", "cfrInd"]],
      sides: [
        { n: "India", parties: [{ n: "India", k: "state" }], loss: [] },
        { n: "Pakistan", parties: [{ n: "Pakistan", k: "state" }], loss: [["Civilians killed by Indian border guards, 2 Oct 2026", "2 — accounts disputed", "AP, per CFR", "count", "cfrInd"]] },
        { n: "Militant groups in Kashmir", parties: [{ n: "Lashkar-e-Tayyiba", k: "armed", at: [31.8, 74.3], us: "26 Dec 2001", uk: "2001" }, { n: "Jaish-e-Mohammed", k: "armed", at: [29.4, 71.7], us: "26 Dec 2001", uk: "2001" }, { n: "Hizbul Mujahideen", k: "armed", at: [34.4, 73.5], us: "17 Aug 2017" }], loss: [] }
      ], src: ["cfrInd", "wl", "fto", "uk"] },

    { id: "taiwan", n: "The Taiwan Strait", rg: "Asia", lv: 1, tr: "flat", trBy: "CFR (‘developing’)", ty: "Standoff", since: 1949, at: [24.2, 119.6], where: ["Taiwan"],
      sum: "China claims Taiwan and has not renounced force to take it. Since 2022 its aircraft and ships have operated around the island almost daily, with large named exercises each year.",
      now: "Taiwan counted 49 Chinese air sorties on 2 Nov and reported more than 100 Chinese navy and coast-guard vessels in the western Pacific on 3 Nov; analysts believe an unannounced exercise larger than 'Justice Mission 2025' is under way. US officials increasingly judge an invasion unlikely before 2028.",
      d25: null, d26: null, cum: null, toll: [["Deaths", "None", "—", "cfrTwn"]],
      sides: [{ n: "China", parties: [{ n: "People's Liberation Army", k: "state" }], loss: [] }, { n: "Taiwan", parties: [{ n: "Taiwan", k: "state" }, { n: "United States (arms, undeclared guarantee)", k: "state" }], loss: [] }], src: ["cfrTwn", "aei"] },

    { id: "korea", n: "The Korean peninsula", rg: "Asia", lv: 1, tr: "flat", trBy: "CFR (‘developing’)", ty: "Standoff", since: 1950, at: [38.0, 127.0], where: ["North Korea", "South Korea"],
      sum: "The war of 1950–53 ended in an armistice, not a peace. North Korea has nuclear weapons, tests missiles, and has sent troops to fight for Russia.",
      now: "Three South Korean soldiers were injured by a suspected landmine in the demilitarised zone on 21 Sept 2026. North Korea held a live-fire drill on 14 Sept and commissioned a second destroyer. On 4 Nov Kim Yo Jong rejected a US invitation to meet at the APEC summit.",
      d25: null, d26: null, cum: null, toll: [["Deaths", "None reported in 2026", "—", "cfrKor"]],
      sides: [{ n: "North Korea", parties: [{ n: "North Korea", k: "state" }], loss: [] }, { n: "South Korea and the United States", parties: [{ n: "South Korea", k: "state" }, { n: "United States (about 29,000 troops)", k: "state" }], loss: [["Soldiers injured, 21 Sept 2026", "3 (suspected landmine)", "South Korea", "own", "cfrKor"]] }], src: ["cfrKor", "aei"] },

    { id: "scs", n: "The South China Sea", rg: "Asia", lv: 2, tr: "flat", trBy: "CFR", ty: "Territorial dispute", since: 2012, at: [15.1, 117.8], where: [],
      sum: "China claims almost the whole sea and has built bases on its reefs. Its coast guard blocks, rams and water-cannons Philippine vessels at Scarborough and Second Thomas Shoals. The US–Philippine defence treaty covers Philippine forces there.",
      now: "China and the Philippines clashed three times in one week in July 2026. China held a drill at Scarborough Shoal on 27 Sept and announced 'readiness patrols' there on 30 Oct.",
      d25: null, d26: null, cum: null, toll: [["Deaths", "None reported", "—", "cfrScs"]],
      sides: [{ n: "China", parties: [{ n: "China Coast Guard and navy", k: "state" }], loss: [] }, { n: "The Philippines", parties: [{ n: "Philippines", k: "state" }, { n: "United States (treaty ally)", k: "state" }], loss: [] }], src: ["cfrScs"] },

    { id: "thaicam", n: "Thailand – Cambodia", rg: "Asia", lv: 2, tr: null, ty: "Border dispute", since: 2025, at: [14.4, 103.6], where: ["Thailand", "Cambodia"],
      sum: "A dispute over temples and an unmarked border turned to artillery and air strikes twice in 2025: five days in July, which killed dozens, and twenty days in December, which killed more than 100 and displaced more than half a million.",
      now: "A ceasefire signed by the two defence ministers took effect at noon on 27 December 2025, with ASEAN observers and troops frozen in place. The running list of wars records the fighting as ended in 2025; no report of renewed fighting in 2026 was read.",
      d25: "more than 100 in December alone", d26: null, cum: null,
      toll: [["Killed in the December 2025 fighting, both countries", "more than 100", "Al Jazeera — unattributed", "thai"], ["Displaced, both countries", "more than half a million", "Al Jazeera", "thai"]],
      sides: [{ n: "Thailand", parties: [{ n: "Thailand", k: "state" }], loss: [["By side", "The report read gives no breakdown", "—", "own", "thai"]] }, { n: "Cambodia", parties: [{ n: "Cambodia", k: "state" }], loss: [["Soldiers captured", "18, to be returned under the truce", "Joint statement", "own", "thai"]] }], src: ["thai", "ww"] },

    { id: "philippines", n: "The Philippines: communist and Islamist insurgencies", rg: "Asia", lv: 3, tr: null, ty: "Insurgency", since: 1969, at: [7.6, 124.4], where: ["Philippines"],
      sum: "The New People's Army, the armed wing of the Communist Party, has fought since 1969; in Mindanao, Abu Sayyaf and Islamic State affiliates persist after the main Moro fronts made peace.",
      now: "No dated report for November 2026 was read; the level rests on the year's death count.",
      d25: "537", d26: "332", cum: "166,600 – 245,200", toll: [],
      sides: [{ n: "Government", parties: [{ n: "Philippines", k: "state" }], loss: [] }, { n: "Insurgents", parties: [{ n: "Communist Party of the Philippines / New People's Army", k: "armed", at: [9.0, 126.0], us: "9 Aug 2002" }, { n: "Abu Sayyaf", k: "armed", at: [6.0, 121.0], us: "8 Oct 1997", uk: "2001" }, { n: "ISIS-Philippines", k: "armed", at: [7.9, 124.3], us: "28 Feb 2018" }], loss: [] }], src: ["wl", "fto", "uk"] },

    { id: "india", n: "India: Maoist and north-eastern insurgencies", rg: "Asia", lv: 3, tr: null, ty: "Insurgency", since: 1954, at: [19.1, 81.3], where: [],
      sum: "A Maoist ('Naxalite') insurgency in the forests of central India and several ethnic insurgencies in the north-east.",
      now: "No dated report for November 2026 was read; the level rests on the year's death count.",
      d25: "980", d26: "482", cum: "81,400", toll: [],
      sides: [{ n: "Government", parties: [{ n: "India", k: "state" }], loss: [] }, { n: "Insurgents", parties: [{ n: "Communist Party of India (Maoist)", k: "armed", at: [19.1, 81.3] }, { n: "North-eastern armed groups", k: "armed", at: [24.8, 93.9] }], loss: [] }], src: ["wl"] },

    { id: "papua", n: "West Papua", rg: "Asia", lv: 3, tr: null, ty: "Separatist insurgency", since: 1962, at: [-4.0, 138.3], where: [],
      sum: "Papuan separatists have fought Indonesian rule since the 1960s.",
      now: "No dated report for November 2026 was read; the level rests on the year's death count.",
      d25: "258", d26: "260", cum: "100,400 – 500,000", toll: [],
      sides: [{ n: "Indonesia", parties: [{ n: "Indonesia", k: "state" }], loss: [] }, { n: "Separatists", parties: [{ n: "West Papua National Liberation Army", k: "armed", at: [-4.0, 138.3] }], loss: [] }], src: ["wl"] },

    /* ---------------------------- AMERICAS ---------------------------- */
    { id: "mexico", n: "Mexico: the state and the cartels", rg: "Americas", lv: 4, tr: "flat", trBy: "CFR", ty: "Criminal war", since: 2006, at: [24.8, -107.4], where: ["Mexico"],
      sum: "Mexico has fought its drug cartels with the army since 2006, and the cartels have fought each other. In February 2025 the United States put six Mexican cartels on its terrorist list, and added two more in July 2026.",
      now: "Mexican forces, with US intelligence, killed the Jalisco cartel's leader, Nemesio 'El Mencho' Oseguera, in February 2026; a wave of burning vehicles and road blocks followed. The Sinaloa cartel has been at war with itself since 2024. A raid on 8 Nov arrested an alleged Jalisco cell leader and nineteen others.",
      d25: "8,973 – 10,767", d26: "5,547", cum: "358,000 – 417,000",
      toll: [["By side", "No source read divides the dead between security forces, cartel members and bystanders", "—", "cfrMex"], ["Sinaloa", "the most violent state in 2025, with 17% of the country's violence", "ACLED", "acledLac"]],
      sides: [
        { n: "The Mexican state", parties: [{ n: "Mexican army, navy and National Guard", k: "state" }, { n: "United States (intelligence, sanctions)", k: "state" }], loss: [] },
        { n: "The cartels", parties: [{ n: "Cártel de Jalisco Nueva Generación", k: "gang", at: [20.7, -103.4], us: "20 Feb 2025" }, { n: "Cártel de Sinaloa", k: "gang", at: [24.8, -107.4], us: "20 Feb 2025" }, { n: "Cártel del Noreste", k: "gang", at: [27.5, -99.5], us: "20 Feb 2025" }, { n: "La Nueva Familia Michoacana", k: "gang", at: [19.2, -100.6], us: "20 Feb 2025" },
            { n: "Cártel del Golfo", k: "gang", at: [25.9, -97.5], us: "20 Feb 2025" }, { n: "Cárteles Unidos", k: "gang", at: [19.4, -102.1], us: "20 Feb 2025" }, { n: "Juárez Cartel (La Línea)", k: "gang", at: [31.7, -106.4], us: "16 Jul 2026" }, { n: "Los Viagras", k: "gang", at: [19.1, -102.4], us: "16 Jul 2026" }], loss: [] }
      ], src: ["cfrMex", "acledLac", "wl", "fto"] },

    { id: "caribbean", n: "The US campaign in the Caribbean and Venezuela", rg: "Americas", lv: 3, tr: "flat", trBy: "CFR", ty: "Foreign military campaign", since: 2025, at: [11.6, -66.6], where: ["Venezuela"],
      sum: "From 1 September 2025 the United States struck boats it said carried drugs for 'narco-terrorists'. In November it listed the Cartel de los Soles, which it says is run from inside the Venezuelan state, as a terrorist organisation; it then blockaded Venezuela's tankers. On 3 January 2026 US forces bombed Caracas and seized President Nicolás Maduro and his wife, who were flown to New York to stand trial. Delcy Rodríguez was sworn in to succeed him.",
      now: "The campaign widened to Ecuador in March 2026 and was reorganised in August as a standing task force for the hemisphere. A UN special rapporteur says there are reasonable grounds to believe the boat strikes are crimes against humanity; Washington says they are self-defence.",
      d25: null, d26: null, cum: null,
      toll: [["No yearly figure", "The comparable table's Venezuela row counts a different, older conflict; the level here rests on the strike tolls below", "The Archive", "wl"], ["People killed in strikes on small vessels", "238 (3 captured), to September 2026", "As tabulated", "oss"], ["The same, by another count", "223 killed in 68 attacks", "UN special rapporteur", "oss"]],
      sides: [
        { n: "United States", parties: [{ n: "US Southern Command", k: "state" }], loss: [["Killed and wounded in the January 2026 raid", "1 killed (not in combat), 7 wounded", "US figures", "own", "oss"]] },
        { n: "Venezuela and Cuba", parties: [{ n: "Venezuelan armed forces", k: "state" }, { n: "Cartel de los Soles", k: "gang", at: [10.5, -66.9], us: "24 Nov 2025", note: "The US says it is led from inside the Venezuelan state." }, { n: "Tren de Aragua", k: "gang", at: [10.2, -67.6], us: "20 Feb 2025" }],
          loss: [["Venezuelans killed, 3 Jan 2026", "at least 23 military and 2 civilians", "BBC, citing local media", "count", "oss"], ["Cubans killed, 3 Jan 2026", "32", "Cuban government", "own", "oss"]] }
      ], src: ["oss", "cfrVen", "acledLac", "wl", "fto"] },

    { id: "colombia", n: "Colombia", rg: "Americas", lv: 4, tr: null, ty: "Insurgency and criminal war", since: 1964, at: [8.2, -73.0], where: ["Colombia"],
      sum: "The 2016 peace with the FARC left behind its dissident factions, the older ELN guerrillas and the Clan del Golfo, the country's largest criminal army, all fighting the state and each other for coca country and the Venezuelan border.",
      now: "Clashes between security forces and armed groups rose 72% in 2025, and drone attacks quadrupled. An ELN drone attack on an army base at Aguachica killed seven on 18 Dec 2025.",
      d25: "2,293", d26: "1,481", cum: "460,300+", toll: [],
      sides: [
        { n: "Government", parties: [{ n: "Colombian armed forces", k: "state" }], loss: [["Killed at Aguachica, 18 Dec 2025", "7 officers", "ACLED", "count", "acledLac"]] },
        { n: "Armed groups", parties: [{ n: "National Liberation Army (ELN)", k: "armed", at: [8.4, -72.9], us: "8 Oct 1997" }, { n: "FARC dissidents (FARC-EP, Segunda Marquetalia)", k: "armed", at: [2.3, -73.0], us: "1 Dec 2021" }, { n: "Clan del Golfo", k: "gang", at: [8.0, -76.6], us: "17 Dec 2025" }], loss: [] }
      ], src: ["acledLac", "wl", "fto"] },

    { id: "ecuador", n: "Ecuador: the state and the gangs", rg: "Americas", lv: 4, tr: null, ty: "Criminal war", since: 2024, at: [-2.2, -79.9], where: ["Ecuador"],
      sum: "On 9 January 2024, after a gang leader's prison escape and the storming of a television studio, President Noboa declared an 'internal armed conflict' against the gangs that move Andean cocaine through Ecuador's ports.",
      now: "Joint operations with the US began on 3 March 2026; on 6 March a US–Ecuadorian strike hit a camp of the Comandos de la Frontera. US Marines have boarded and sunk suspected cartel supply boats since August.",
      d25: "4,070", d26: "2,876", cum: "13,000+",
      toll: [["Violent deaths in prisons, 2025", "at least 115 — more than triple 2024", "ACLED", "acledLac"]],
      sides: [
        { n: "Government and the United States", parties: [{ n: "Ecuador", k: "state" }, { n: "United States", k: "state" }], loss: [["Police and soldiers killed", "40+ police, 2 soldiers — undated", "As tabulated", "own", "ecu"]] },
        { n: "The gangs", parties: [{ n: "Los Choneros", k: "gang", at: [-1.05, -80.45], us: "5 Sep 2025" }, { n: "Los Lobos", k: "gang", at: [-2.2, -79.9], us: "5 Sep 2025" }, { n: "Chone Killers", k: "gang", at: [-2.25, -79.6], us: "2 Jul 2026" }, { n: "Los Tiguerones", k: "gang", at: [0.95, -79.65], us: "10 Sep 2026" }],
          loss: [["Arrested", "31,000+ suspects, 700 of them accused of terrorism", "As tabulated", "claim", "ecu"]] }
      ], src: ["ecu", "acledLac", "wl", "fto"] },

    { id: "haiti", n: "Haiti: the state and the gangs", rg: "Americas", lv: 4, tr: "up", trBy: "CFR", ty: "Criminal war", since: 2020, at: [18.6, -72.3], where: ["Haiti"],
      sum: "Since the assassination of President Moïse in 2021, gangs — allied from 2024 as Viv Ansanm, 'living together' — have taken most of Port-au-Prince. A UN-authorised Gang Suppression Force has yet to deploy in full; the police fight with the help of a private military company's drones.",
      now: "Between July and September 2026 at least 1,167 people were killed. More than half died in security-force operations, and the UN counted 44 cases of summary execution, or attempts at it, involving the police, up from 14 the quarter before.",
      d25: "4,826", d26: "2,359", cum: "25,000+",
      toll: [["Killed, July – September 2026", "at least 1,167 (459 injured)", "UN office in Haiti (BINUH)", "unhti"], ["Who killed them", "more than half in security-force operations against gangs; over 45% of incidents by gangs; about 5% by self-defence groups", "UN office in Haiti", "unhti"],
             ["Bystanders", "more than 16% of those killed or hurt in security-force operations had no link to gangs", "UN office in Haiti", "unhti"], ["Sexual violence by gang members, same quarter", "344 victims, aged 8 to 75", "UN office in Haiti", "unhti"]],
      sides: [
        { n: "Government", parties: [{ n: "Haitian National Police", k: "state" }, { n: "Gang Suppression Force (UN-authorised)", k: "bloc" }], loss: [] },
        { n: "The gangs", parties: [{ n: "Viv Ansanm", k: "gang", at: [18.55, -72.33], us: "5 May 2025" }, { n: "Gran Grif", k: "gang", at: [19.1, -72.6], us: "5 May 2025" }],
          loss: [["Boys recruited by a gang, killed fighting the security forces at Gressier, Aug 2026", "at least 32, aged 14–16", "UN office in Haiti", "count", "unhti"]] }
      ], src: ["cfrHti", "unhti", "wl", "fto"] },

    { id: "brazil", n: "Brazil: the factions", rg: "Americas", lv: 3, tr: null, ty: "Criminal war", since: 1992, at: [-22.9, -43.3], where: [],
      sum: "Brazil's two great prison-born factions, the Primeiro Comando da Capital of São Paulo and the Comando Vermelho of Rio, fight the police and each other. The United States listed both as terrorist organisations in June 2026.",
      now: "No dated report for November 2026 was read. The comparable table's count (130+ in 2025) covers named operations only and understates the toll.",
      d25: "130+", d26: "12+", cum: "50,000+", toll: [],
      sides: [{ n: "The state", parties: [{ n: "Brazilian police forces", k: "state" }], loss: [] }, { n: "The factions", parties: [{ n: "Comando Vermelho", k: "gang", at: [-22.9, -43.3], us: "5 Jun 2026" }, { n: "Primeiro Comando da Capital", k: "gang", at: [-23.5, -46.6], us: "5 Jun 2026" }], loss: [] }], src: ["wl", "fto"] },

    { id: "triangle", n: "Northern Central America: the gangs", rg: "Americas", lv: 3, tr: "flat", trBy: "CFR", ty: "Criminal war", since: 2022, at: [14.7, -88.4], where: ["Honduras", "El Salvador", "Guatemala"],
      sum: "El Salvador (from 2022) and Honduras have ruled by emergency decree against the MS-13 and Barrio 18 gangs, jailing tens of thousands. On 13 November 2026 the United States listed a Guatemalan trafficking clan, Los Lorenzanas, as a terrorist organisation.",
      now: "Honduras: 509 deaths in 2026 so far by the comparable table; El Salvador: 9.",
      d25: "561 (Honduras) · 10 (El Salvador)", d26: "509 (Honduras) · 9 (El Salvador)", cum: null, toll: [],
      sides: [{ n: "The three states", parties: [{ n: "Honduras, El Salvador, Guatemala", k: "state" }], loss: [] },
              { n: "The gangs", parties: [{ n: "Mara Salvatrucha (MS-13)", k: "gang", at: [13.7, -89.2], us: "20 Feb 2025" }, { n: "Barrio 18", k: "gang", at: [14.1, -87.2], us: "24 Sep 2025" }, { n: "Los Lorenzanas", k: "gang", at: [15.0, -89.5], us: "13 Nov 2026", note: "Takes effect on publication in the Federal Register." }], loss: [] }], src: ["cfrNt", "wl", "fto", "ftogt"] }
  ]
};
