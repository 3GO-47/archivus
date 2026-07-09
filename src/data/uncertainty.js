/* ARCHIVUS — True dating uncertainty for contested events.
   id → [earliest plausible startYear, latest plausible startYear] per mainstream
   scholarship (see research/sources.md "Known dating controversies").
   Rendered in the Chronicle view as faded bands behind the event node.
   The nominal startYear in events.js stays the conventional/most-cited date. */
window.ARCHIVUS_UNCERTAINTY = {
  fire:          [-800000, -300000],  /* habitual use: contested from ~1 Mya to ~300 kya */
  sapiens:       [-315000, -260000],  /* Jebel Irhoud pushes early */
  outofafrica:   [-90000,  -50000],
  australia:     [-65000,  -45000],   /* Madjedbebe vs conservative dates */
  caveart:       [-40000,  -30000],
  dog:           [-30000,  -13000],
  americas:      [-23000,  -13000],   /* pre-Clovis vs Clovis-first */
  iceage_end:    [-9750,   -9600],
  agriculture:   [-10500,  -8500],
  gobekli:       [-9600,   -9000],
  rice:          [-8000,   -6000],
  copper:        [-5500,   -4500],
  bronzework:    [-3500,   -3000],
  writing:       [-3400,   -3100],
  egypt_unify:   [-3150,   -3050],
  hieroglyphs:   [-3250,   -3100],
  indus:         [-2800,   -2600],
  vedas:         [-1700,   -1200],
  zoroaster:     [-1500,   -600],     /* the widest scholarly spread in the archive */
  polynesia:     [-1300,   -800],
  olmec:         [-1400,   -1200],
  kush:          [-1100,   -1000],
  israel_kingdom:[-1100,   -1000],    /* united monarchy historicity debated */
  exodus_temple: [-1000,   -950],
  upanishads:    [-900,    -600],
  rome_founded:  [-850,    -750],     /* archaeology vs Varronian tradition */
  buddha:        [-563,    -480],     /* long vs short chronology */
  silkroad:      [-138,    -114],
  jesus:         [-6,      -4],
  zero:          [598,     668],
  genji:         [1000,    1012],
  littleiceage:  [1250,    1350]      /* onset debated */
};
