/* ARCHIVUS — Narrative tours.
   Each tour is a thread through the archive: the oracle flies the Chronicle
   from event to event, one flight at a time, with a line of narration.
   Steps reference event ids; works in any view. */
window.ARCHIVUS_TOURS = [
  { id: "written-word", title: "The Written Word — cuneiform to the web",
    blurb: "How the technology of memory escaped the temple and ate the world.",
    steps: [
      { e: "writing", n: "It begins as accounting: clay tokens pressed into wet tablets at Uruk. Recorded history starts as a receipt." },
      { e: "hieroglyphs", n: "Egypt makes script sacred — the god Thoth's gift, per the Transmissions codex." },
      { e: "alphabet", n: "Phoenician traders shrink writing to 22 letters anyone can learn. Literacy stops being a priesthood." },
      { e: "paper", n: "Cai Lun's paper makes the written word cheap enough to lose." },
      { e: "koreatype", n: "Korea casts metal movable type two centuries before Mainz." },
      { e: "printing", n: "Gutenberg industrializes the word. Within a lifetime, Luther weaponizes it." },
      { e: "telegraph", n: "Morse detaches the message from the messenger — information now outruns any horse." },
      { e: "web", n: "Berners-Lee gives every document an address. The clay tablet's descendant is a hyperlink." }
    ] },
  { id: "long-plague", title: "The Long Plague — six visitations",
    blurb: "The other constant companion of civilization.",
    steps: [
      { e: "justinian_plague", n: "541 CE: Yersinia pestis rides the grain ships into Constantinople and breaks late antiquity's spine." },
      { e: "blackdeath", n: "Eight centuries later it returns along the Mongol roads and kills a third of Europe." },
      { e: "broadstreet", n: "1854: John Snow maps cholera deaths around one pump — disease becomes data." },
      { e: "germtheory", n: "Pasteur and Koch name the invisible enemy the Book of Jubilees once called spirits." },
      { e: "flu", n: "1918: the deadliest pandemic in history hitches on the troopships of a world war." },
      { e: "smallpox", n: "1980: for the first time ever, humanity drives a disease extinct on purpose." },
      { e: "covid", n: "2020: the fastest-mapped pathogen in history meets the most connected world in history." }
    ] },
  { id: "bombs-ancestry", title: "The Bomb's Ancestry — Oppenheimer's thread",
    blurb: "From pure curiosity about light to the desert flash — in forty years.",
    steps: [
      { e: "curie", n: "Marie Curie finds atoms that spend themselves — matter is not eternal." },
      { e: "quantum", n: "Planck to Heisenberg: the atom's interior gets rules, and the rules allow fission." },
      { e: "einstein", n: "E = mc²: a footnote of relativity prices the energy in a gram of matter." },
      { e: "manhattan", n: "Los Alamos: 130,000 people industrialize a physics paper. Parsons' rocketry generation works one mesa over." },
      { e: "bomb", n: "Hiroshima. The Transmissions codex would file this under fire — Prometheus, punished." },
      { e: "coldwar", n: "Two powers hold the flash over every city for forty years — and never drop it." },
      { e: "nuclearpower", n: "The same nucleus boils water at Obninsk. Every gift in this archive is double-edged." },
      { e: "fusion", n: "2022: ignition. The star in the bottle, briefly — the thread continues." }
    ] },
  { id: "empires-relay", title: "The Empire Relay — the crown changes hands",
    blurb: "Five thousand years of the same experiment: how much world can one center hold?",
    steps: [
      { e: "uruk", n: "The first city invents the crowd — then someone must rule it." },
      { e: "sargon", n: "Sargon binds many cities under one Akkadian fist: the first empire." },
      { e: "persia", n: "Cyrus scales tolerance itself into an imperial technology." },
      { e: "alexander", n: "Alexander proves an empire can be conquered faster than it can be governed." },
      { e: "augustus", n: "Rome perfects the machine: roads, law, and a peace that lasts two centuries." },
      { e: "mongol", n: "The steppe answers: the largest land empire in history, built at a gallop." },
      { e: "constantinople1453", n: "Ottoman cannon end Rome's last echo — and push Europe onto the ocean." },
      { e: "scramble", n: "Empire's final form: a continent divided with a ruler in Berlin." },
      { e: "decolonization", n: "And the relay reverses: thirty new flags in fifteen years. The experiment continues elsewhere." }
    ] },
  { id: "knowledge-travels", title: "How Knowledge Travels — the living silsila",
    blurb: "The Transmissions codex insists knowledge is handed down. Here is its documented route.",
    steps: [
      { e: "alexandria", n: "Alexandria tries to hold every book in one place — and teaches the world what a library is." },
      { e: "wisdom", n: "Baghdad's House of Wisdom translates Greece and India into Arabic, and adds algebra." },
      { e: "alandalus", n: "Córdoba hands the corpus to Europe through Toledo's translators." },
      { e: "universities", n: "Bologna and Paris invent the institution that outlives every teacher." },
      { e: "printing", n: "Print makes the chain uncuttable — no fire can now burn the only copy." },
      { e: "copernicus", n: "A canon reads Ptolemy in print and quietly moves the Earth." },
      { e: "newton", n: "Standing on shoulders, by his own account — the silsila made method." },
      { e: "quantum", n: "The method eats its own certainties and keeps working anyway." },
      { e: "ai", n: "The chain's newest link learns from the entire chain at once. You are using it now." }
    ] }
];

/* ---- learning threads added with the Myth & Cult and Horizon layers ---- */
window.ARCHIVUS_TOURS = window.ARCHIVUS_TOURS.concat([
  { id: "gods-roads", title: "The Gods' Roads — how pantheons travel",
    blurb: "Seven skies, four family trees, and the documented bridges between them.",
    steps: [
      { e: "lionman", n: "38,000 BCE: someone carves a lion-headed man from mammoth ivory — the oldest image of a thing that does not exist. Religion enters the record before farming, cities or writing." },
      { e: "eridu-temple", n: "Eridu, 5400 BCE: eighteen temples stacked on one sacred spot. Enki is worshipped three thousand years before writing can spell him. Cult precedes text — everywhere." },
      { e: "sumer-godlists", n: "The Fara lists, c. 2600 BCE: the oldest named gods on Earth. An, Enlil, Inanna. From here the Bloodline's root grows." },
      { e: "pyramid-texts", n: "Saqqara, c. 2350 BCE: Egypt answers with the oldest surviving religious book — carved in stone, addressed to eternity." },
      { e: "kumarbi-cycle", n: "Hattusa, c. 1300 BCE: the sky-god castrated, his throne seized. Watch this plot: it is about to emigrate." },
      { e: "hesiod-theogony", n: "Greece, c. 700 BCE: Uranus castrated, Cronus overthrown, Zeus enthroned. The Kumarbi plot, received and made canon — the best-documented myth migration in history." },
      { e: "theodosius-ban", n: "392 CE: Rome outlaws the old cults. Delphi falls silent; the Olympic flame goes out. The classical gods' civic death — though the Transmissions codex says the teaching went underground instead." },
      { e: "eddas", n: "Iceland, 1220 CE: a Christian antiquarian writes the entire Norse mythology down to save the poetry. Sometimes the archive is built by the other side." },
      { e: "florentine-codex", n: "Mexico, 1569: Nahua elders dictate their gods to a Franciscan as the temples come down. The last pantheon enters the record at the moment it leaves the world." }
    ] },
  { id: "the-forecast", title: "The Forecast — how to read the future like a historian",
    blurb: "Certain orbits, slipping schedules, ranged projections, naked claims: the four grades of tomorrow.",
    steps: [
      { e: "eclipse-2027", n: "Grade one — CERTAIN. August 2, 2027, the sun goes out over Luxor for 6m23s. We can say this to the second, centuries out. Orbital mechanics is the only true prophecy." },
      { e: "apophis-flyby", n: "Apophis, Friday April 13, 2029 — closer than the GPS satellites. Named for Ra's serpent; the Babylonians would have sacrificed. We sell eclipse glasses." },
      { e: "artemis-landing", n: "Grade two — SCHEDULED. Artemis III has a date the way a construction site has a date. Programs slip; physics doesn't." },
      { e: "warming-1p5", n: "Grade three — PROJECTED. The 1.5° crossing is a model ensemble with error bars, not an appointment. The IPCC publishes ranges; the archive keeps them." },
      { e: "population-peak", n: "The UN's 2080s peak: projection built from a hundred national censuses. First voluntary population decline since the Black Death — and that one wasn't voluntary." },
      { e: "amr-2050", n: "Projections are also warnings designed to be wrong: the 10-million-deaths figure exists so that policy makes it false. Some forecasts are self-defeating on purpose." },
      { e: "singularity-claim", n: "Grade four — CLAIM. Kurzweil's 2045 gets filed exactly like Joachim of Fiore's Third Age: a date, a source, no endorsement. The archive takes no position on prophets. It takes positions on dates." },
      { e: "venus-transit", n: "And past every claim, the clockwork: Venus crosses the sun in 2117 whether or not anyone is left arguing. End where history ends — with the things that keep their appointments." }
    ] },
  { id: "long-engines", title: "The Long Engines — five threads that run past the present",
    blurb: "Follow fire, plague, crowd, mind and sky straight through NOW and out the other side.",
    steps: [
      { e: "fire", n: "FIRE: a million years of banked coals lead here —" },
      { e: "steam", n: "— to Watt, and the carbon bill nobody itemized." },
      { e: "fusion-power", n: "The thread's anticipated end: burning the sea's hydrogen like the sun does. Seventy years of 'twenty years away' — now with actual net-energy shots." },
      { e: "penicillin", n: "PLAGUE: Fleming buys humanity a century's armistice with the microbes." },
      { e: "amr-2050", n: "The armistice expires mid-century unless the pipeline outruns the evolution. The oldest war resumes." },
      { e: "uruk", n: "CROWD: Uruk invents the city, and the city invents almost everything else." },
      { e: "urban-70", n: "By 2050 seven in ten of us live in Uruk's descendants. The six-thousand-year migration completes." },
      { e: "turing", n: "MIND: Turing asks whether machinery can think, and builds the machinery either way." },
      { e: "agi-median", n: "The survey median lands mid-century — a distribution, not a date, and the widest error bars on this entire instrument." },
      { e: "moon", n: "SKY: footprints in the Sea of Tranquility, then a fifty-year intermission." },
      { e: "crewed-mars", n: "The intermission is scheduled to end at Mars in the 2030s. Every date so far has slipped. The direction hasn't." }
    ] }
]);
