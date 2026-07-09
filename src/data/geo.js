/* ARCHIVUS — Gazetteer: approximate anchor coordinates [lat, lon] per event id.
   One representative point per event (origin city, site, or epicenter), accurate
   to ~1°. Events absent here (global/diffuse processes) appear in the Atlas
   view's "global currents" gutter instead of on the map. */
window.ARCHIVUS_GEO = {
  /* prehistory & neolithic */
  sapiens: [31.9, -8.9],          /* Jebel Irhoud */
  outofafrica: [12.5, 43.3],      /* Bab-el-Mandeb crossing */
  australia: [-25.0, 133.0],
  caveart: [45.05, 1.17],         /* Lascaux */
  americas: [65.0, -170.0],       /* Beringia */
  gobekli: [37.22, 38.92],
  agriculture: [36.5, 39.0],      /* northern Fertile Crescent */
  jericho: [31.87, 35.44],
  rice: [30.5, 112.0],            /* middle Yangzi */
  catalhoyuk: [37.67, 32.83],
  copper: [38.0, 43.0],           /* eastern Anatolia */
  uruk: [31.32, 45.64],

  /* bronze */
  bronzework: [36.0, 40.0],
  writing: [31.32, 45.64],
  egypt_unify: [25.1, 32.8],      /* Hierakonpolis */
  hieroglyphs: [25.7, 32.6],
  indus: [27.33, 68.14],          /* Mohenjo-daro */
  gizapyramid: [29.98, 31.13],
  sargon: [33.1, 44.1],           /* Akkad (approx.) */
  minoan: [35.30, 25.16],         /* Knossos */
  hammurabi: [32.54, 44.42],      /* Babylon */
  shang: [36.12, 114.32],         /* Anyang */
  olmec: [18.10, -94.04],         /* La Venta */
  collapse: [35.0, 33.0],         /* eastern Mediterranean */
  vedas: [30.0, 75.0],            /* Punjab */
  enheduanna: [30.96, 46.10],     /* Ur */
  gilgamesh: [31.32, 45.64],
  newkingdom: [25.72, 32.61],     /* Thebes */

  /* iron & axial */
  ironwork: [39.0, 35.0],
  zhou: [34.3, 108.9],
  alphabet: [34.12, 35.65],       /* Byblos */
  kush: [16.93, 33.72],           /* Meroë */
  assyria: [36.36, 43.15],        /* Nineveh */
  rome_founded: [41.89, 12.48],
  exodus_temple: [31.78, 35.23],
  zoroaster: [36.0, 60.0],
  polynesia: [-17.5, -149.5],
  israel_kingdom: [31.78, 35.23],
  upanishads: [25.32, 83.0],      /* Varanasi */
  olympics: [37.64, 21.63],
  buddha: [24.70, 84.99],         /* Bodh Gaya */
  confucius: [35.60, 116.99],     /* Qufu */
  persia: [29.93, 52.89],         /* Pasargadae */
  athens_dem: [37.98, 23.73],
  roman_republic: [41.89, 12.48],
  babylon_exile: [32.54, 44.42],
  second_temple: [31.78, 35.23],
  neobabylon: [32.54, 44.42],

  /* classical */
  marathon: [38.15, 23.96],
  parthenon: [37.97, 23.72],
  socrates: [37.98, 23.73],
  alexander: [40.76, 22.52],      /* Pella */
  ashoka: [25.61, 85.14],         /* Pataliputra */
  qin: [34.38, 108.71],           /* Xianyang */
  greatwall: [40.43, 116.57],
  punic: [36.85, 10.32],          /* Carthage */
  han: [34.34, 108.94],           /* Chang'an */
  silkroad: [40.0, 75.0],
  caesar: [41.89, 12.48],
  augustus: [41.89, 12.48],
  jesus: [31.78, 35.23],
  paper: [34.62, 112.45],         /* Luoyang */
  teotihuacan: [19.69, -98.84],
  peloponnesian: [37.94, 22.93],
  paxromana: [41.89, 12.48],
  trajan: [41.89, 12.48],
  antonine: [41.89, 12.48],
  temple70: [31.78, 35.23],
  crisis3c: [41.89, 12.48],
  hanwudi: [34.34, 108.94],

  /* late antiquity */
  constantine: [41.01, 28.98],
  gupta: [25.61, 85.14],
  maya: [17.22, -89.62],          /* Tikal */
  romefall: [41.89, 12.48],
  aksum: [14.13, 38.72],
  hagia: [41.01, 28.98],
  justinian_plague: [41.01, 28.98],
  hijra: [24.47, 39.61],          /* Medina */
  nicaea: [40.43, 29.72],
  constantinople330: [41.01, 28.98],
  rome410: [41.89, 12.48],
  attila: [47.0, 19.0],           /* Pannonia */
  clovis: [49.26, 4.03],          /* Reims */
  justinian: [41.01, 28.98],

  /* post-classical */
  conquests: [33.51, 36.29],      /* Damascus */
  tang: [34.34, 108.94],
  zero: [25.35, 72.62],           /* Bhillamala */
  abbasid: [33.34, 44.40],
  wisdom: [33.34, 44.40],
  charlemagne: [50.78, 6.08],     /* Aachen */
  vikings: [59.0, 10.0],
  vinland: [51.60, -55.53],       /* L'Anse aux Meadows */
  song: [34.79, 114.35],          /* Kaifeng */
  hastings: [50.91, 0.49],
  crusades: [31.78, 35.23],
  angkor: [13.41, 103.87],
  zimbabwe: [-20.27, 30.93],
  mongol: [47.20, 102.85],        /* Karakorum */
  magnacarta: [51.44, -0.56],     /* Runnymede */
  mali: [16.77, -3.01],           /* Timbuktu */
  blackdeath: [45.03, 35.38],     /* Kaffa, entry to Europe */
  ming: [32.06, 118.80],          /* Nanjing */
  zhenghe: [32.06, 118.80],
  ghana_empire: [15.5, -8.0],
  cahokia: [38.66, -90.06],
  kievanrus: [50.45, 30.52],
  hre: [50.78, 6.08],
  genji: [35.01, 135.77],         /* Kyoto */
  schism1054: [41.01, 28.98],
  universities: [44.49, 11.34],   /* Bologna */
  baghdad1258: [33.34, 44.40],
  polo: [45.44, 12.34],           /* Venice */
  avignon: [43.95, 4.81],
  hundredyears: [48.85, 2.35],
  peasants1381: [51.51, -0.13],
  joan: [47.90, 1.90],            /* Orléans */
  tours: [47.39, 0.69],
  alandalus: [37.88, -4.78],      /* Córdoba */
  verdun843: [49.16, 5.38],

  /* renaissance & discovery */
  printing: [50.00, 8.27],        /* Mainz */
  constantinople1453: [41.01, 28.98],
  renaissanceflor: [43.77, 11.26],
  columbus: [24.05, -74.50],      /* San Salvador landfall */
  dagama: [11.25, 75.77],         /* Calicut */
  reformation: [51.87, 12.65],    /* Wittenberg */
  magellan: [-53.5, -70.9],       /* Strait of Magellan */
  suleiman: [41.01, 28.98],
  cortes: [19.43, -99.13],        /* Tenochtitlan */
  mughal: [28.60, 77.20],
  copernicus: [54.36, 19.68],     /* Frombork */
  slavetrade: [6.36, 2.09],       /* Ouidah */
  inca: [-13.52, -71.97],         /* Cusco */
  sistine: [41.90, 12.45],
  benin: [6.34, 5.63],
  reconquista: [37.18, -3.60],    /* Granada */
  armada: [50.2, -4.1],

  /* early modern */
  tokugawa: [35.68, 139.69],      /* Edo */
  galileo: [45.41, 11.88],        /* Padua */
  thirtyyears: [50.09, 14.42],    /* Prague */
  westphalia: [51.96, 7.63],      /* Münster */
  qing: [39.90, 116.40],
  newton: [52.21, 0.12],          /* Cambridge */
  encyclopedie: [48.85, 2.35],
  shakespeare: [51.51, -0.10],
  voc: [52.37, 4.90],             /* Amsterdam */
  jamestown: [37.21, -76.78],
  engcivilwar: [51.51, -0.13],
  glorious: [51.51, -0.13],

  /* revolutions & industry */
  steam: [55.86, -4.25],          /* Glasgow */
  industrial: [53.48, -2.24],     /* Manchester */
  amrev: [39.95, -75.16],         /* Philadelphia */
  wealthnations: [55.95, -3.19],  /* Edinburgh */
  usconst: [39.95, -75.16],
  frrev: [48.85, 2.35],
  haiti: [18.54, -72.34],
  napoleon: [48.85, 2.35],
  latamind: [10.5, -66.9],        /* Caracas */
  railway: [54.57, -1.32],        /* Darlington */
  abolition: [51.50, -0.13],
  telegraph: [38.90, -77.04],
  darwin: [51.50, -0.13],
  germtheory: [48.85, 2.35],
  meiji: [35.68, 139.69],
  electricity: [40.56, -74.60],   /* Menlo Park */
  scramble: [52.52, 13.40],       /* Berlin Conference */
  suffrage: [-41.29, 174.78],     /* Wellington */
  flight: [36.02, -75.67],        /* Kitty Hawk */
  einstein: [46.95, 7.45],        /* Bern */
  indiaraj: [28.60, 77.20],
  uscivilwar: [39.81, -77.23],    /* Gettysburg */
  taiping: [32.06, 118.80],
  suez: [30.70, 32.34],
  photography: [48.85, 2.35],
  cinema: [45.76, 4.84],          /* Lyon */
  vienna1815: [48.21, 16.37],
  rev1848: [48.85, 2.35],
  crimean: [44.60, 33.53],        /* Sevastopol */
  sepoy: [28.60, 77.20],
  germany1871: [48.80, 2.13],     /* Versailles */
  goldstandard: [51.51, -0.10],   /* City of London */
  curie: [48.85, 2.35],
  quantum: [55.68, 12.57],        /* Copenhagen */
  radio: [47.56, -52.71],         /* St John's */
  russojapanese: [38.80, 121.26], /* Port Arthur */
  mexrev: [19.43, -99.13],
  xinhai: [30.55, 114.30],        /* Wuchang */
  fed: [38.90, -77.04],
  vaccination: [51.51, -0.13],

  /* world wars */
  ww1: [49.9, 2.9],               /* Somme, Western Front */
  russianrev: [59.93, 30.34],     /* Petrograd */
  versailles: [48.80, 2.13],
  penicillin: [51.52, -0.17],     /* St Mary's, London */
  depression: [40.71, -74.01],
  holocaust: [50.03, 19.18],      /* Auschwitz */
  bomb: [34.39, 132.46],          /* Hiroshima */
  franzferdinand: [43.86, 18.41], /* Sarajevo */
  armenian: [39.0, 40.0],
  league: [46.20, 6.15],          /* Geneva */
  jazzage: [29.95, -90.07],       /* New Orleans */
  marchonrome: [41.89, 12.48],
  hyperinflation: [52.52, 13.40],
  hitler33: [52.52, 13.40],
  newdeal: [38.90, -77.04],
  spanishcivil: [40.42, -3.70],
  sinojapanese: [32.06, 118.80],  /* Nanjing */
  television: [51.51, -0.13],
  brettonwoods: [44.25, -71.44],

  /* cold war */
  un: [40.75, -73.97],
  transistor: [40.68, -74.40],    /* Murray Hill */
  indiaind: [28.60, 77.20],
  chinarev: [39.90, 116.40],
  dna: [52.21, 0.12],
  sputnik: [45.92, 63.34],        /* Baikonur */
  decolonization: [5.56, -0.20],  /* Accra */
  cuba: [23.13, -82.38],
  moon: [28.57, -80.65],          /* launch, Kennedy Space Center */
  arpanet: [34.07, -118.44],      /* UCLA */
  pc: [37.32, -122.03],
  chinareform: [22.54, 114.06],   /* Shenzhen */
  smallpox: [46.20, 6.15],        /* WHO, Geneva */
  berlinwall: [52.52, 13.40],
  ussrfall: [55.75, 37.62],
  marshall: [48.85, 2.35],
  udhr: [48.86, 2.29],            /* Palais de Chaillot */
  nato: [38.90, -77.04],
  korea: [38.0, 127.0],
  vietnam: [16.0, 107.0],
  civilrights: [38.90, -77.04],
  nixonshock: [38.90, -77.04],
  oilcrisis: [24.70, 46.70],      /* Riyadh */
  iranrev: [35.69, 51.39],
  gulf: [29.37, 47.98],

  /* digital & contemporary */
  web: [46.23, 6.05],             /* CERN */
  sept11: [40.71, -74.01],
  genome: [39.00, -77.10],        /* Bethesda */
  socialmedia: [37.42, -122.08],
  smartphone: [37.33, -122.03],
  gfc: [40.71, -74.01],
  arabspring: [36.80, 10.18],     /* Tunis */
  crispr: [37.87, -122.26],       /* Berkeley */
  paris: [48.85, 2.35],
  covid: [30.55, 114.30],         /* Wuhan */
  ai: [37.42, -122.08],
  jwst: [5.2, -52.8],             /* Kourou launch */
  eu: [50.85, 5.69],              /* Maastricht */
  asianfc: [13.75, 100.50],       /* Bangkok */
  brexit: [51.50, -0.13],
  ukraine2022: [50.45, 30.52]
};
