/* ARCHIVUS — THE PANTHEONS
   Seven divine family trees, with domains and the connections between
   religions. Three kinds of cross-links:
     o = shared origin (Proto-Indo-European inheritance — the same god, aged)
     s = documented syncretism (cult chains, interpretatio, named fusions)
     p = parallel archetype (the same office, independently staffed)
   Node: id, pa (pantheon), n (name), sub (equivalents/epithets), d (domain ids),
         p (parents), u (consort id), t (note), gen (tier within pantheon). */
window.ARCHIVUS_PANTHEONS = {
  pantheons: {
    meso:  { name: "Mesopotamian",       color: "#c9a227" },
    canaan:{ name: "Canaanite / Ugarit", color: "#c87f3a" },
    egypt: { name: "Egyptian (Ennead)",  color: "#a67c00" },
    greek: { name: "Greek · Roman",      color: "#7c9ac9" },
    norse: { name: "Norse",              color: "#5bc8dd" },
    vedic: { name: "Vedic · Hindu",      color: "#d4738f" },
    aztec: { name: "Aztec / Mexica",     color: "#5faa5f" }
  },
  /* worship horizons: earliest CULT evidence — as distinct from earliest text */
  horizons: {
    meso:  "⛩ Worship horizon: temple sequence at Eridu from c. 5400 BCE — cult precedes writing here by ~3,000 years.",
    canaan:"⛩ Worship horizon: Bronze-Age Levantine shrines; the name El inherited from older Semitic ʾil, in personal names at Ebla by c. 2500 BCE.",
    egypt: "⛩ Worship horizon: predynastic Nile burials and the Hierakonpolis shrine, c. 4000–3500 BCE.",
    greek: "⛩ Worship horizon: PIE steppe religion c. 4500–2500 BCE (kurgan rites) meeting Minoan–Mycenaean sanctuaries; Dodona's oak oracle claimed from c. 2000 BCE.",
    norse: "⛩ Worship horizon: the same PIE stock; Scandinavian bog offerings and rock-art sun-ships from c. 1500 BCE.",
    vedic: "⛩ Worship horizon: Indo-Iranian fire ritual and horse sacrifice on the steppe c. 2000 BCE (Sintashta) — the Veda memorized long before writing.",
    aztec: "⛩ Worship horizon: Mesoamerican deep stock — Olmec ritual c. 1200 BCE; Tlaloc and the Feathered Serpent at Teotihuacan by 200 CE."
  },
  domains: {
    sky:    "Sky / Heavens",   storm: "Storm / Thunder",  sun:  "Sun",
    moon:   "Moon",            sea:   "Sea / Waters",     earth:"Earth",
    death:  "Death / Underworld", war: "War",             love: "Love / Fertility",
    wisdom: "Wisdom / Magic",  craft: "Craft / Smithing", harvest:"Harvest / Grain",
    fire:   "Fire",            justice:"Justice / Law",   trickster:"Trickster",
    king:   "Kingship",        messenger:"Messenger / Psychopomp", home:"Hearth / Home",
    hunt:   "Hunt / Wild",     serpent:"Serpent / Chaos"
  },
  gods: [
  /* ---- Mesopotamian ---- */
  { id:"apsu", pa:"meso", n:"Apsu", d:["sea"], p:[], gen:0, t:"The fresh-water abyss beneath the world; first begetter of the Enuma Elish." },
  { id:"tiamat", pa:"meso", n:"Tiamat", d:["sea","serpent"], p:[], u:"apsu", gen:0, t:"Salt sea and dragon-mother; from her split body, sky and earth." },
  { id:"anshar", pa:"meso", n:"Anshar", sub:"whole sky", d:["sky"], p:["apsu","tiamat"], gen:1 },
  { id:"kishar", pa:"meso", n:"Kishar", sub:"whole earth", d:["earth"], p:["apsu","tiamat"], u:"anshar", gen:1 },
  { id:"anu", pa:"meso", n:"Anu", sub:"An — Sky Father", d:["sky","king"], p:["anshar","kishar"], gen:2, t:"Remote high king of heaven; his 'anutu' is kingship itself." },
  { id:"enlil", pa:"meso", n:"Enlil", sub:"Lord Wind", d:["storm","king"], p:["anu"], gen:3, t:"Holder of the Tablet of Destinies; his word is the storm." },
  { id:"enki", pa:"meso", n:"Enki / Ea", sub:"Lord of the Deep", d:["sea","wisdom","craft"], p:["anu"], gen:3, t:"Keeper of the ME, friend of mankind — the Bloodline's engineer and the Transmissions' first suspect." },
  { id:"ninhursag", pa:"meso", n:"Ninhursag", sub:"Lady of the Mountain", d:["earth","love"], p:[], u:"enki", gen:3 },
  { id:"nanna", pa:"meso", n:"Nanna / Sin", d:["moon"], p:["enlil"], gen:4, t:"Moon-lord of Ur — the city of the Bloodline's patriarchs." },
  { id:"utu", pa:"meso", n:"Utu / Shamash", d:["sun","justice"], p:["nanna"], gen:5, t:"The sun who sees everything; giver of Hammurabi's law." },
  { id:"inanna", pa:"meso", n:"Inanna / Ishtar", sub:"Queen of Heaven", d:["love","war"], p:["nanna"], gen:5, t:"Morning and evening star; stole the ME from Enki; descended to the dead and returned." },
  { id:"ereshkigal", pa:"meso", n:"Ereshkigal", d:["death"], p:["nanna"], gen:5, t:"Queen of the great below, from whom no traveler returns unmarked." },
  { id:"nergal", pa:"meso", n:"Nergal", d:["war","death","fire"], p:["enlil"], gen:4, u:"ereshkigal" },
  { id:"marduk", pa:"meso", n:"Marduk", sub:"Bel — lord of Babylon", d:["storm","king","serpent"], p:["enki"], gen:4, t:"Slew Tiamat and built the world from her body — the Chaoskampf's first full script." },
  { id:"nabu", pa:"meso", n:"Nabu", d:["wisdom","messenger"], p:["marduk"], gen:5, t:"Scribe of destinies, patron of writing." },

  /* ---- Canaanite / Ugaritic ---- */
  { id:"el", pa:"canaan", n:"El", sub:"the Bull, father of years", d:["sky","king"], p:[], gen:0, t:"The seated grey-bearded high god of Ugarit; his name is simply 'God' — and it survives inside El-ohim, Isra-el, Beth-el." },
  { id:"asherah", pa:"canaan", n:"Asherah", sub:"Lady of the Sea", d:["love","sea"], p:[], u:"el", gen:0, t:"Mother of the seventy gods; her poles stood beside early Israelite altars." },
  { id:"baal", pa:"canaan", n:"Baal Hadad", sub:"Rider on the Clouds", d:["storm","king"], p:["el","asherah"], gen:1, t:"Defeats Sea and Death to win kingship — the storm-king pattern Israel's neighbors knew by heart." },
  { id:"anat", pa:"canaan", n:"Anat", d:["war","love"], p:["el","asherah"], gen:1, t:"Baal's ferocious sister-ally, wading in the blood of armies." },
  { id:"yam", pa:"canaan", n:"Yam", sub:"Sea / River", d:["sea","serpent"], p:["el","asherah"], gen:1, t:"The raging sea, Baal's first enemy — Tiamat's western cousin." },
  { id:"mot", pa:"canaan", n:"Mot", sub:"Death", d:["death"], p:["el","asherah"], gen:1, t:"Swallows Baal; the dry season is his reign." },
  { id:"shapash", pa:"canaan", n:"Shapash", d:["sun","justice"], p:["el","asherah"], gen:1, t:"Torch of the gods, who travels the underworld nightly." },

  /* ---- Egyptian (Heliopolitan Ennead + court) ---- */
  { id:"nun", pa:"egypt", n:"Nun", d:["sea"], p:[], gen:0, t:"The dark primeval waters before the first sunrise." },
  { id:"atum", pa:"egypt", n:"Atum-Ra", sub:"the self-created", d:["sun","king"], p:["nun"], gen:1, t:"Rose from Nun on the first mound; the sun as first cause." },
  { id:"shu", pa:"egypt", n:"Shu", sub:"air", d:["sky"], p:["atum"], gen:2 },
  { id:"tefnut", pa:"egypt", n:"Tefnut", sub:"moisture", d:["sea"], p:["atum"], u:"shu", gen:2 },
  { id:"geb", pa:"egypt", n:"Geb", d:["earth"], p:["shu","tefnut"], gen:3, t:"The earth is a god lying beneath his sister the sky — Egypt inverts everyone else's marriage." },
  { id:"nut", pa:"egypt", n:"Nut", d:["sky"], p:["shu","tefnut"], u:"geb", gen:3, t:"Star-bodied sky, arched over Geb; swallows the sun each dusk and births it each dawn." },
  { id:"osiris", pa:"egypt", n:"Osiris", d:["death","harvest","king"], p:["geb","nut"], gen:4, t:"Murdered, dismembered, reassembled — the first to die and rule beyond it; every pharaoh becomes him." },
  { id:"isis", pa:"egypt", n:"Isis", sub:"great of magic", d:["wisdom","love"], p:["geb","nut"], u:"osiris", gen:4, t:"Rebuilt her husband and tricked Ra's true name from him; her cult later spans the whole Roman sea." },
  { id:"set", pa:"egypt", n:"Set", d:["storm","trickster","war"], p:["geb","nut"], gen:4, t:"Desert, chaos and the murder of Osiris — yet he alone can slay Apophis nightly." },
  { id:"nephthys", pa:"egypt", n:"Nephthys", d:["death","home"], p:["geb","nut"], u:"set", gen:4 },
  { id:"horus", pa:"egypt", n:"Horus", d:["sky","king","sun"], p:["osiris","isis"], gen:5, t:"The falcon whose eyes are sun and moon; the living pharaoh's own name." },
  { id:"anubis", pa:"egypt", n:"Anubis", d:["death","messenger"], p:["set","nephthys"], gen:5, t:"Jackal of the scales, who weighs the heart against the feather." },
  { id:"thoth", pa:"egypt", n:"Thoth", sub:"Djehuty", d:["wisdom","moon","messenger"], p:[], gen:4, t:"Ibis-scribe of the gods, inventor of writing — the Transmissions' original teacher." },
  { id:"hathor", pa:"egypt", n:"Hathor", d:["love","sky"], p:["atum"], gen:4, t:"Golden cow of joy, music and drunkenness; Ra's eye when the sun turns wrathful." },

  /* ---- Greek (Roman equivalents as sub-labels) ---- */
  { id:"chaos", pa:"greek", n:"Chaos", d:["sky","serpent"], p:[], gen:0, t:"Not disorder but the yawning gap — the first thing to exist (Hesiod)." },
  { id:"gaia", pa:"greek", n:"Gaia", sub:"≡ Terra", d:["earth"], p:["chaos"], gen:1, t:"Earth herself, mother and ground of every later god." },
  { id:"uranus", pa:"greek", n:"Uranus", sub:"≡ Caelus", d:["sky"], p:["gaia"], u:"gaia", gen:1, t:"Sky fathered on Earth; unmanned by his own son with a sickle of adamant." },
  { id:"cronus", pa:"greek", n:"Cronus", sub:"≡ Saturn", d:["harvest","king"], p:["uranus","gaia"], gen:2, t:"Ate his children to keep the throne; his festival became Saturnalia, then Christmas' season." },
  { id:"rhea", pa:"greek", n:"Rhea", sub:"≡ Ops", d:["earth","love"], p:["uranus","gaia"], u:"cronus", gen:2 },
  { id:"iapetus", pa:"greek", n:"Iapetus", d:["death"], p:["uranus","gaia"], gen:2, t:"Titan father of Prometheus and Atlas — the board equates him with Japheth, son of Noah." },
  { id:"prometheus", pa:"greek", n:"Prometheus", d:["fire","craft","trickster"], p:["iapetus"], gen:3, t:"Stole fire in a fennel stalk and paid on the rock — the Transmissions' punished teacher." },
  { id:"zeus", pa:"greek", n:"Zeus", sub:"≡ Jupiter", d:["sky","storm","king","justice"], p:["cronus","rhea"], gen:3, t:"Zeus Patēr — the Sky Father by his oldest, inherited name; thunder as verdict." },
  { id:"hera", pa:"greek", n:"Hera", sub:"≡ Juno", d:["love","king","home"], p:["cronus","rhea"], u:"zeus", gen:3 },
  { id:"poseidon", pa:"greek", n:"Poseidon", sub:"≡ Neptune", d:["sea","storm"], p:["cronus","rhea"], gen:3, t:"Earth-shaker; his trident stirs both sea and ground." },
  { id:"hades", pa:"greek", n:"Hades", sub:"≡ Pluto", d:["death","king"], p:["cronus","rhea"], gen:3, t:"The Unseen; so feared the Greeks called him 'the Wealthy One' instead." },
  { id:"hestia", pa:"greek", n:"Hestia", sub:"≡ Vesta", d:["home","fire"], p:["cronus","rhea"], gen:3, t:"First-born, first-fed: every hearth-flame is her altar." },
  { id:"demeter", pa:"greek", n:"Demeter", sub:"≡ Ceres", d:["harvest","earth"], p:["cronus","rhea"], gen:3, t:"Her grief makes winter; her daughter's return, spring. 'Cereal' is her name." },
  { id:"athena", pa:"greek", n:"Athena", sub:"≡ Minerva", d:["wisdom","war","craft"], p:["zeus"], gen:4, t:"Born armored from Zeus' split skull; strategy against Ares' slaughter." },
  { id:"apollo", pa:"greek", n:"Apollo", sub:"≡ Apollo", d:["sun","wisdom","justice"], p:["zeus"], gen:4, t:"Oracle, plague, music, light — Delphi's voice in the Transmissions." },
  { id:"artemis", pa:"greek", n:"Artemis", sub:"≡ Diana", d:["moon","hunt"], p:["zeus"], gen:4 },
  { id:"hermes", pa:"greek", n:"Hermes", sub:"≡ Mercury", d:["messenger","trickster","wisdom"], p:["zeus"], gen:4, t:"Guide of souls, god of roads, thieves and eloquence — fused with Thoth as Trismegistus." },
  { id:"ares", pa:"greek", n:"Ares", sub:"≡ Mars", d:["war"], p:["zeus","hera"], gen:4, t:"Rage of battle, despised at Athens — but Mars, in Rome, fathers the city itself." },
  { id:"hephaestus", pa:"greek", n:"Hephaestus", sub:"≡ Vulcan", d:["craft","fire"], p:["hera"], gen:4, t:"Lame smith of Olympus; the board's Tubal-Cain is 'the Vulcan' after his Roman name." },
  { id:"aphrodite", pa:"greek", n:"Aphrodite", sub:"≡ Venus", d:["love"], p:["uranus"], gen:4, t:"Foam-born of Uranus' fall — or Ishtar come west via Cyprus, as the cult trail shows." },
  { id:"dionysus", pa:"greek", n:"Dionysus", sub:"≡ Bacchus", d:["harvest","trickster"], p:["zeus"], gen:4, t:"Twice-born god of the vine, mask and ecstasy; Herodotus saw Osiris in him." },
  { id:"persephone", pa:"greek", n:"Persephone", sub:"≡ Proserpina", d:["death","harvest"], p:["zeus","demeter"], u:"hades", gen:4, t:"Queen below for the pomegranate's sake; the seasons hinge on her commute." },

  /* ---- Norse ---- */
  { id:"ymir", pa:"norse", n:"Ymir", d:["earth","serpent"], p:[], gen:0, t:"Frost-giant of the void; the world is his butchered body — sky his skull, sea his blood. Tiamat's northern echo." },
  { id:"buri", pa:"norse", n:"Búri", d:["king"], p:[], gen:0, t:"Licked free of the ice by the primeval cow Auðumbla." },
  { id:"borr", pa:"norse", n:"Borr", d:["king"], p:["buri"], gen:1 },
  { id:"bestla", pa:"norse", n:"Bestla", d:["earth"], p:["ymir"], u:"borr", gen:1, t:"Giant-daughter — every Aesir god carries Ymir's blood through her." },
  { id:"odin", pa:"norse", n:"Odin", sub:"Wōden — All-Father", d:["wisdom","war","king","messenger"], p:["borr","bestla"], gen:2, t:"Traded an eye for a drink of wisdom, hanged himself for the runes; Rome read him as Mercury — hence Wednesday." },
  { id:"frigg", pa:"norse", n:"Frigg", d:["love","home","wisdom"], p:[], u:"odin", gen:2, t:"Knows every fate and tells none; Friday bears her name." },
  { id:"thor", pa:"norse", n:"Thor", sub:"Þunraz — Thunder", d:["storm","war"], p:["odin"], gen:3, t:"Mjölnir against the World-Serpent — the Chaoskampf still running at Ragnarök; Thursday is his." },
  { id:"baldr", pa:"norse", n:"Baldr", d:["sun","justice"], p:["odin","frigg"], gen:3, t:"The shining innocent, killed by a mistletoe dart and a trickster's aim — the whitest grief in the north." },
  { id:"tyr", pa:"norse", n:"Týr", sub:"*Tīwaz", d:["war","justice"], p:["odin"], gen:3, t:"Fed his sword-hand to the wolf to seal an oath; the old PIE sky-god demoted to Tuesday." },
  { id:"heimdall", pa:"norse", n:"Heimdallr", d:["sky","justice"], p:["odin"], gen:3, t:"Nine mothers, gold teeth, hears grass grow; his horn opens the last battle." },
  { id:"loki", pa:"norse", n:"Loki", d:["trickster","fire"], p:[], gen:2, t:"Blood-brother to Odin, father of monsters, engineer of Baldr's death — bound with his son's entrails until the end." },
  { id:"hel", pa:"norse", n:"Hel", d:["death"], p:["loki"], gen:3, t:"Half fair, half corpse-blue; her name became the English word for the place." },
  { id:"jormungandr", pa:"norse", n:"Jörmungandr", d:["sea","serpent"], p:["loki"], gen:3, t:"The Midgard Serpent, girdling the world with its tail in its teeth — the ouroboros Kekulé dreamed." },
  { id:"fenrir", pa:"norse", n:"Fenrir", d:["war","serpent"], p:["loki"], gen:3, t:"The wolf that will swallow Odin; bound by a ribbon made of impossible things." },
  { id:"njord", pa:"norse", n:"Njörðr", d:["sea","harvest"], p:[], gen:2, t:"Vanir hostage of the gods' first war — wealth, wind and fair sailing." },
  { id:"freyr", pa:"norse", n:"Freyr", d:["harvest","love","sun"], p:["njord"], gen:3, t:"Gave away his sword for love and will fight Ragnarök with an antler." },
  { id:"freyja", pa:"norse", n:"Freyja", d:["love","war","wisdom"], p:["njord"], gen:3, t:"Takes half the battle-slain before Odin picks; taught the Aesir seiðr magic — Inanna's northern sister." },

  /* ---- Vedic · Hindu ---- */
  { id:"dyaus", pa:"vedic", n:"Dyaus Pitar", sub:"Sky Father", d:["sky"], p:[], gen:0, t:"*Dyēus Ph₂tḗr in Sanskrit — the exact same name as Zeus Patēr and Ju-piter, three thousand miles apart." },
  { id:"prithvi", pa:"vedic", n:"Prithvi", sub:"Earth Mother", d:["earth"], p:[], u:"dyaus", gen:0 },
  { id:"indra", pa:"vedic", n:"Indra", d:["storm","war","king"], p:["dyaus","prithvi"], gen:1, t:"Vajra in hand, slew the serpent Vritra to free the waters — the Rigveda's central deed and the Chaoskampf's eastern verse." },
  { id:"agni", pa:"vedic", n:"Agni", d:["fire","messenger"], p:["dyaus","prithvi"], gen:1, t:"Fire as the mouth of the gods — every offering travels by him. The Rigveda's first word is his name." },
  { id:"surya", pa:"vedic", n:"Surya", d:["sun"], p:["dyaus","prithvi"], gen:1, t:"The seven-horsed sun; the Gayatri mantra salutes his light." },
  { id:"ushas", pa:"vedic", n:"Ushas", d:["sun","love"], p:["dyaus","prithvi"], gen:1, t:"Dawn, cognate with Eos and Aurora — the loveliest survival of the old sky family." },
  { id:"varuna", pa:"vedic", n:"Varuna", d:["sea","justice","sky"], p:["dyaus","prithvi"], gen:1, t:"Keeper of ṛta, the cosmic order; sees every lie by the light of a thousand eyes." },
  { id:"yama", pa:"vedic", n:"Yama", d:["death","justice"], p:["surya"], gen:2, t:"First mortal to die, therefore first king of the dead — the path-finder everyone follows." },
  { id:"brahma", pa:"vedic", n:"Brahma", d:["wisdom","king"], p:[], gen:2, t:"Creator of the Trimurti; his consort Saraswati carries the Vedic river-goddess forward." },
  { id:"saraswati", pa:"vedic", n:"Saraswati", d:["wisdom"], p:[], u:"brahma", gen:2, t:"River become goddess of speech, learning and music — patron of every scribe in this archive." },
  { id:"vishnu", pa:"vedic", n:"Vishnu", d:["king","justice","sun"], p:[], gen:2, t:"The preserver, descending as avatar whenever order fails — Rama, Krishna, and more to come." },
  { id:"lakshmi", pa:"vedic", n:"Lakshmi", d:["love","harvest"], p:[], u:"vishnu", gen:2, t:"Fortune churned from the ocean of milk." },
  { id:"shiva", pa:"vedic", n:"Shiva", sub:"Rudra", d:["storm","death","wisdom"], p:[], gen:2, t:"Vedic Rudra grown vast: destroyer, ascetic, lord of the dance that ends and renews the world." },
  { id:"parvati", pa:"vedic", n:"Parvati", sub:"Durga · Kali", d:["love","war","earth"], p:[], u:"shiva", gen:2, t:"Mountain-daughter whose fiercer faces ride tigers and wear skulls." },
  { id:"ganesha", pa:"vedic", n:"Ganesha", d:["wisdom","trickster"], p:["shiva","parvati"], gen:3, t:"Elephant-headed remover of obstacles; scribe of the Mahabharata — he broke off his own tusk to keep writing." },
  { id:"kartikeya", pa:"vedic", n:"Kartikeya", sub:"Skanda · Murugan", d:["war"], p:["shiva","parvati"], gen:3 },

  /* ---- Aztec / Mexica ---- */
  { id:"ometeotl", pa:"aztec", n:"Ometeotl", sub:"Two-God", d:["sky","king"], p:[], gen:0, t:"The dual lord-and-lady of the highest heaven, beyond worship — pure generative polarity." },
  { id:"quetzalcoatl", pa:"aztec", n:"Quetzalcoatl", sub:"Feathered Serpent", d:["wisdom","sky","serpent","craft"], p:["ometeotl"], gen:1, t:"Wind, learning, the calendar and maize — a benevolent serpent, where the Old World's dragons are enemies. No contact: pure convergence. See the Transmissions." },
  { id:"tezcatlipoca", pa:"aztec", n:"Tezcatlipoca", sub:"Smoking Mirror", d:["trickster","war","death"], p:["ometeotl"], gen:1, t:"Quetzalcoatl's rival and mirror; night, sorcery and the fate of kings." },
  { id:"huitzilopochtli", pa:"aztec", n:"Huitzilopochtli", d:["sun","war"], p:["ometeotl"], gen:1, t:"Hummingbird of the South, who led the Mexica to the eagle on the cactus — Tenochtitlan's own god." },
  { id:"tlaloc", pa:"aztec", n:"Tlaloc", d:["storm","harvest"], p:["ometeotl"], gen:1, t:"Goggle-eyed giver of rain, oldest god in the valley — his temple shared the Templo Mayor's summit." },
  { id:"mictlantecuhtli", pa:"aztec", n:"Mictlantecuhtli", d:["death"], p:["ometeotl"], gen:1, t:"Skeletal lord of Mictlan, nine layers down; Quetzalcoatl stole mankind's bones from him." }
  ],

  /* ---- the connections between religions ---- */
  xlinks: [
    { a:"dyaus", b:"zeus", k:"o", t:"*Dyēus Ph₂tḗr — 'Sky Father'. Dyaus Pitar, Zeus Patēr, Ju-piter: one inherited name, three thousand miles and years apart. The single strongest proof of the Indo-European family." },
    { a:"tyr", b:"zeus", k:"o", t:"*Dyēus again: Norse Týr (*Tīwaz) is the same old sky-god, demoted to war and Tuesday." },
    { a:"indra", b:"thor", k:"o", t:"The *Perkʷunos thread: thunder-weapon in hand, each slays the great serpent — vajra on Vritra, Mjölnir on Jörmungandr." },
    { a:"ushas", b:"aphrodite", k:"o", t:"Ushas is cognate with Greek Eos and Roman Aurora — dawn as radiant maiden across the whole family." },
    { a:"marduk", b:"baal", k:"p", t:"Chaoskampf, act one and two: Marduk splits Tiamat, Baal breaks Yam — the storm-king earns his throne by killing the sea." },
    { a:"baal", b:"zeus", k:"p", t:"Chaoskampf, act three: Zeus against Typhon. The storm-god's dragon-fight travels the whole ancient world." },
    { a:"tiamat", b:"yam", k:"p", t:"The sea as the enemy: salt chaos personified, needing a champion's victory before the world can be ordered." },
    { a:"tiamat", b:"ymir", k:"p", t:"World from monster's corpse: Marduk builds from Tiamat's halves; Odin's line builds from Ymir's body. Same blueprint, different butcher." },
    { a:"inanna", b:"aphrodite", k:"s", t:"Documented cult chain: Inanna → Ishtar → Phoenician Astarte → Cypriot Aphrodite. The morning star's westward migration, port by port." },
    { a:"inanna", b:"freyja", k:"p", t:"Love and war in one goddess, taking her share of the slain — the office recurs at the family's far northern edge." },
    { a:"thoth", b:"hermes", k:"s", t:"Fused in Ptolemaic Alexandria as Hermes Trismegistus — the thrice-great teacher whose Emerald Tablet anchors the Transmissions codex." },
    { a:"hermes", b:"odin", k:"s", t:"Interpretatio: Rome read Wōden as Mercury — psychopomp, wanderer, wisdom-trader. Dies Mercurii became Wednesday, Wōden's day." },
    { a:"hermes", b:"anubis", k:"s", t:"Guides of the dead, later literally merged as Hermanubis in Roman Egypt." },
    { a:"osiris", b:"dionysus", k:"s", t:"Identified by Herodotus (Histories 2.42): the dying and returning god of vegetal life and ecstatic rite." },
    { a:"isis", b:"demeter", k:"s", t:"Herodotus' other equation — the searching mother. Isis' cult later absorbed the whole Mediterranean's goddesses." },
    { a:"el", b:"anu", k:"p", t:"The seated high father, remote and presiding — and El's name flows on into the Bloodline's own scriptures: Elohim, Israel." },
    { a:"ereshkigal", b:"hades", k:"p", t:"Sovereigns, not fiends: the underworld as a kingdom with a throne, law and a queen or king upon it." },
    { a:"hades", b:"hel", k:"p", t:"The same dark office at the family's northern end — and Hel's name became the English word for the place." },
    { a:"utu", b:"shapash", k:"p", t:"The sun as circuit judge — seeing all by day, traveling the underworld by night, giving law at noon." },
    { a:"utu", b:"surya", k:"p", t:"The all-seeing charioteer of the sky, witness to every oath." },
    { a:"enki", b:"prometheus", k:"p", t:"The crafty water-deep benefactor who sides with mankind against the high god's wrath — and pays for it." },
    { a:"enki", b:"quetzalcoatl", k:"p", t:"Convergence with no possible contact: the wise serpent-associated craftsman-god who gives mankind its arts — the Transmissions' pattern, independently invented." },
    { a:"loki", b:"set", k:"p", t:"The insider-enemy: kin to the gods, killer of the shining one (Baldr / Osiris), indispensable and bound." },
    { a:"zeus", b:"indra", k:"o", t:"Storm-king of the middle air, wielder of the bolt, chief by force of weather — the Indo-European throne itself." },
    { a:"nabu", b:"thoth", k:"p", t:"The divine scribe: writing is so uncanny every pantheon assigns it a god — see the Transmissions on Penemue." },
    { a:"hephaestus", b:"enki", k:"p", t:"The smith-craftsman under the king: the maker's office. The board's Tubal-Cain 'the Vulcan' carries it into the Bloodline." }
  ]
};
