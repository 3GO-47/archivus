/* ============================================================
   ARCHIVUS — the Realms: the archive's own notes (v11).
   Hand-written, unlike src/data/realms.js (which is generated).
     forms  — the constitutional form of each state: how the offices
              are arranged, NOT how free the country is. Compiled by
              the archive from standard references, November 2026.
     note   — for states with a declared state doctrine, a governing
              ideology worth naming, or a recent rupture: one or two
              sentences, and (d) the matching node in the Doctrines.
   Where a note describes events after 2025 it says so: the scores
   beside it describe 2025.
   ============================================================ */
window.ARCHIVUS_REALMS_NOTES = {
  /* forced changes too recent for V-Dem v16: [iso, year, month, day, type, types, what fell, what followed, source] */
  after: [
    ["GNB", 2025, 11, 26, 0, [0], "Embaló's rule", "High Military Command under General Horta Inta-a", "https://en.wikipedia.org/wiki/List_of_coups_and_coup_attempts_since_2010"]
  ],
  afterNote: "Also on record after the dataset closed: a failed coup attempt in Benin on 7 December 2025. The lists consulted show no coup or attempt in 2026 up to 13 November. V-Dem dates an ending to the day the old rules stopped applying, so some entries — self-coups especially — mark a constitutional rupture rather than a day of violence.",
  forms: {
    PR: ["Presidential republic", "A directly elected president heads both state and government and does not depend on parliament's confidence."],
    SP: ["Semi-presidential republic", "A directly elected president shares executive power with a prime minister answerable to parliament."],
    PA: ["Parliamentary republic", "The government rests on a parliamentary majority; the head of state is ceremonial or chosen by parliament."],
    CM: ["Constitutional monarchy", "A hereditary monarch reigns; a government answerable to parliament rules."],
    EM: ["Executive monarchy", "A constitution and a parliament exist, but the monarch still governs."],
    AM: ["Absolute monarchy", "The monarch rules without an elected government able to overrule him."],
    OP: ["One-party state", "A single party holds a constitutional monopoly of power."],
    MJ: ["Military government", "Officers who took power by force rule directly or through a body they appoint."],
    TH: ["Theocracy", "Clerics hold final authority over the state."],
    DR: ["Directorial republic", "A collegial council elected by parliament serves as the executive."],
    TR: ["Transitional or contested", "No settled constitutional order: an interim government, rival governments, or a state at war with itself."],
    TE: ["Territory", "Not a sovereign state; rated separately by the indices."]
  },
  form: {
    AFG: "TH", AGO: "PR", ALB: "PA", ARE: "AM", ARG: "PR", ARM: "PA", AUS: "CM", AUT: "PA", AZE: "PR", BDI: "PR", BEL: "CM", BEN: "PR", BFA: "MJ", BGD: "PA",
    BGR: "PA", BHR: "EM", BIH: "PA", BLR: "PR", BOL: "PR", BRA: "PR", BRB: "PA", BTN: "CM", BWA: "PA", CAF: "PR", CAN: "CM", CHE: "DR", CHL: "PR", CHN: "OP",
    CIV: "PR", CMR: "PR", COD: "SP", COG: "PR", COL: "PR", COM: "PR", CPV: "SP", CRI: "PR", CUB: "OP", CYP: "PR", CZE: "PA", DEU: "PA", DJI: "PR", DNK: "CM",
    DOM: "PR", DZA: "SP", ECU: "PR", EGY: "PR", ERI: "OP", ESP: "CM", EST: "PA", ETH: "PA", FIN: "PA", FJI: "PA", FRA: "SP", GAB: "PR", GBR: "CM", GEO: "PA",
    GHA: "PR", GIN: "PR", GMB: "PR", GNB: "MJ", GNQ: "PR", GRC: "PA", GTM: "PR", GUY: "PR", HKG: "TE", HND: "PR", HRV: "PA", HTI: "TR", HUN: "PA", IDN: "PR",
    IND: "PA", IRL: "PA", IRN: "TH", IRQ: "PA", ISL: "PA", ISR: "PA", ITA: "PA", JAM: "CM", JOR: "EM", JPN: "CM", KAZ: "PR", KEN: "PR", KGZ: "PR", KHM: "CM",
    KOR: "PR", KWT: "EM", LAO: "OP", LBN: "PA", LBR: "PR", LBY: "TR", LKA: "SP", LSO: "CM", LTU: "SP", LUX: "CM", LVA: "PA", MAR: "EM", MDA: "PA", MDG: "MJ",
    MDV: "PR", MEX: "PR", MKD: "PA", MLI: "MJ", MLT: "PA", MMR: "MJ", MNE: "PA", MNG: "SP", MOZ: "PR", MRT: "SP", MUS: "PA", MWI: "PR", MYS: "CM", NAM: "SP",
    NER: "MJ", NGA: "PR", NIC: "PR", NLD: "CM", NOR: "CM", NPL: "PA", NZL: "CM", OMN: "AM", PAK: "PA", PAN: "PR", PER: "PR", PHL: "PR", PNG: "CM", POL: "SP",
    PRK: "OP", PRT: "SP", PRY: "PR", PSE: "TE", PSG: "TE", QAT: "AM", ROU: "SP", RUS: "SP", RWA: "PR", SAU: "AM", SDN: "MJ", SEN: "SP", SGP: "PA", SLB: "CM",
    SLE: "PR", SLV: "PR", SML: "TE", SOM: "PA", SRB: "PA", SSD: "TR", STP: "SP", SUR: "PA", SVK: "PA", SVN: "PA", SWE: "CM", SWZ: "AM", SYC: "PR", SYR: "TR",
    TCD: "PR", TGO: "PA", THA: "CM", TJK: "PR", TKM: "PR", TLS: "SP", TTO: "PA", TUN: "PR", TUR: "PR", TWN: "SP", TZA: "PR", UGA: "PR", UKR: "SP", URY: "PR",
    USA: "PR", UZB: "PR", VEN: "PR", VNM: "OP", VUT: "PA", XKX: "PA", YEM: "TR", ZAF: "PA", ZMB: "PR", ZWE: "PR", ZZB: "TE",
    AND: "CM", ATG: "CM", BLZ: "CM", BRN: "AM", DMA: "PA", GRD: "CM", KIR: "PA", LIE: "EM", MHL: "PA", FSM: "PA", MCO: "EM", NRU: "PA", PLW: "PR", WSM: "PA",
    SMR: "PA", KNA: "CM", LCA: "CM", VCT: "CM", BHS: "CM", TON: "CM", TUV: "CM"
  },
  note: {
    CHN: { t: "Rule by the Communist Party. The official doctrine is Marxism–Leninism, Mao Zedong Thought and \"socialism with Chinese characteristics\" — since 2017 with Xi Jinping Thought written into the party and state constitutions — alongside a largely market economy.", d: "dengism" },
    PRK: { t: "Rule by the Workers' Party under the Kim family, now in its third generation. The state doctrine is Juche (self-reliance), formalised as Kimilsungism–Kimjongilism.", d: "juche" },
    VNM: { t: "Rule by the Communist Party: Marxism–Leninism and Ho Chi Minh Thought, with a market economy since the Đổi Mới reforms of 1986.", d: "ml" },
    LAO: { t: "Rule by the Lao People's Revolutionary Party since 1975; Marxism–Leninism.", d: "ml" },
    CUB: { t: "Rule by the Communist Party since the 1959 revolution declared itself socialist in 1961; Marxism–Leninism joined to the nationalism of José Martí.", d: "ml" },
    ERI: { t: "Rule by the People's Front for Democracy and Justice, the former liberation movement. No national election has been held since independence in 1993." },
    IRN: { t: "The Islamic Republic rests on Khomeini's doctrine of the guardianship of the jurist (velayat-e faqih): a senior cleric holds final authority over elected institutions. After 2025: Ali Khamenei was killed on 28 February 2026 at the opening of the war with the United States and Israel; Mojtaba Khamenei was named supreme leader on 8 March.", d: "islamism" },
    AFG: { t: "The Taliban's Islamic Emirate, restored in August 2021: rule by an emir and a clerical council on a Deobandi reading of Islamic law, with no constitution and no elections.", d: "islamism" },
    SAU: { t: "The House of Saud rules without elected national institutions. Its claim rests on its historic alliance with the Wahhabi religious establishment and, increasingly, on a state-led nationalism of economic transformation.", d: "absolutism" },
    BRN: { t: "The sultan rules under the state philosophy of Melayu Islam Beraja — Malay Islamic Monarchy.", d: "absolutism" },
    RUS: { t: "A personalist presidency under Vladimir Putin, in power since 2000. The governing creed is statist nationalism; the 2020 constitutional amendments wrote \"traditional values\" into the basic law and reset his term limits.", d: "nationalism" },
    BLR: { t: "Alexander Lukashenko has ruled since 1994 on a Soviet-nostalgic statism, closely bound to Russia." },
    IND: { t: "A constitutionally secular, federal parliamentary democracy, governed since 2014 by the Bharatiya Janata Party, whose doctrine is Hindutva — Hindu nationalism.", d: "hindutva" },
    TUR: { t: "Founded on Kemalist secular nationalism; governed since 2002 by Recep Tayyip Erdoğan's AKP — conservative, rooted in political Islam and increasingly nationalist. A 2017 referendum replaced the parliamentary system with an executive presidency.", d: "kemalism" },
    HUN: { t: "Viktor Orbán's Fidesz governed from 2010 on what he called \"illiberal\" national conservatism. After 2025: Fidesz lost the April 2026 election to Péter Magyar's centre-right Tisza party, which won a two-thirds majority. The scores here still describe Orbán's last full year.", d: "natcon" },
    USA: { t: "A presidential federal republic. Donald Trump's second administration, national-populist and conservative, took office in January 2025. After 2025: the Democrats won both houses of Congress in the midterm elections of 3 November 2026. See the United States view for the detail." },
    VEN: { t: "Governed since 1999 by chavismo, the \"Bolivarian socialism\" of Hugo Chávez's party. After 2025: United States forces captured Nicolás Maduro on 3 January 2026, and Vice-President Delcy Rodríguez was sworn in as interim president with the ruling party still in office.", d: "bolivarian" },
    NIC: { t: "Daniel Ortega, the Sandinista leader of the 1979 revolution, has ruled since 2007; a 2025 constitutional change made his wife Rosario Murillo co-president. V-Dem records the change as a self-coup." },
    SLV: { t: "Nayib Bukele has governed under a state of exception since 2022; in 2025 the legislature removed presidential term limits, which V-Dem records as a self-coup. His appeal rests on security results rather than a doctrine.", d: "populism" },
    ARG: { t: "Since December 2023 governed by Javier Milei, who describes himself as a libertarian and anarcho-capitalist — the first head of state to do so.", d: "libertarian" },
    BOL: { t: "The Movement for Socialism of Evo Morales governed for most of 2006–2025; the centre-right Rodrigo Paz won the October 2025 run-off." },
    SYR: { t: "Half a century of Baathist rule by the Assad family ended on 8 December 2024, when an offensive led by the Islamist Hayat Tahrir al-Sham took Damascus. A transitional government under its leader, Ahmed al-Sharaa, has governed since.", d: "baathism" },
    EGY: { t: "A military-backed presidency. Abdel Fattah el-Sisi, then army chief, removed the elected Muslim Brotherhood president Mohamed Morsi in July 2013 and has ruled since on state nationalism.", d: "nationalism" },
    DZA: { t: "Power rests with the army and the heirs of the National Liberation Front that won independence in 1962. The army's cancellation of the 1992 election, which Islamists were winning, opened a decade of civil war." },
    TUN: { t: "The one democracy to emerge from the 2011 Arab uprisings. President Kais Saied suspended parliament in July 2021 and replaced the constitution in 2022; V-Dem records this as a self-coup." },
    LBY: { t: "Divided since 2014 between a government in Tripoli and a rival administration in the east backed by Khalifa Haftar's forces." },
    SDN: { t: "The army removed Omar al-Bashir in 2019 after mass protests, then overthrew the civilian-led transition in October 2021. Since April 2023 the army and the paramilitary Rapid Support Forces have been at war." },
    YEM: { t: "Divided since the Houthi movement (Ansar Allah, a Zaydi Shia revivalist movement) took the capital Sanaa in 2014–15; the internationally recognised government sits in the south.", d: "islamism" },
    IRQ: { t: "A parliamentary republic since the 2005 constitution, working by an informal division of offices among Shia, Sunni and Kurdish parties." },
    LBN: { t: "A confessional republic: the presidency, premiership and speakership are reserved for a Maronite, a Sunni and a Shia respectively." },
    PAK: { t: "An Islamic republic with a parliamentary constitution in which the army has been the decisive political actor, ruling directly for about half of the country's history." },
    BGD: { t: "Sheikh Hasina's fifteen-year government fell to a student-led uprising on 5 August 2024; an interim government under Muhammad Yunus followed. After 2025: a general election in February 2026 returned the Bangladesh Nationalist Party to power." },
    MMR: { t: "The army (Tatmadaw) has ruled since its coup of 1 February 2021 against the elected government of Aung San Suu Kyi's party, and has been fighting a nationwide armed resistance since." },
    THA: { t: "A constitutional monarchy in which the army and the palace are decisive: about a dozen successful coups since the end of absolute monarchy in 1932, most recently in 2006 and 2014." },
    KHM: { t: "A constitutional monarchy dominated by the Cambodian People's Party; Hun Sen, in power from 1985, handed the premiership to his son Hun Manet in 2023." },
    SGP: { t: "A parliamentary republic governed without interruption by the People's Action Party since 1959." },
    MLI: { t: "Ruled by officers since the coups of 2020 and 2021. With Burkina Faso and Niger it left ECOWAS to form the Alliance of Sahel States — sovereigntist, hostile to the former colonial power France, and fighting jihadist insurgencies that hold much of the countryside." },
    BFA: { t: "Two coups in 2022 brought Captain Ibrahim Traoré to power. The junta invokes the legacy of Thomas Sankara, the revolutionary officer who ruled 1983–87, and is allied with Mali and Niger." },
    NER: { t: "The presidential guard overthrew the elected president Mohamed Bazoum in July 2023; the junta is allied with Mali and Burkina Faso." },
    GIN: { t: "Colonel Mamady Doumbouya took power in the coup of September 2021; he was elected president in December 2025 under a constitution adopted that year." },
    GAB: { t: "The army ended fifty-six years of Bongo family rule in August 2023; its leader, General Brice Oligui Nguema, was elected president in April 2025." },
    TCD: { t: "When President Idriss Déby was killed in 2021 the army installed his son Mahamat, who was elected president in 2024." },
    MDG: { t: "After weeks of youth-led protests an army unit (CAPSAT) under Colonel Michael Randrianirina took power on 14 October 2025." },
    GNB: { t: "Officers seized power on 26 November 2025, the day before presidential election results were due, and installed General Horta Inta-a as transitional president." },
    ETH: { t: "A federal republic organised by ethnicity. The Prosperity Party of Abiy Ahmed governs; the war in Tigray (2020–22) and later regional insurgencies have strained the federation." },
    RWA: { t: "Governed since the 1994 genocide by the Rwandan Patriotic Front and Paul Kagame." },
    UGA: { t: "Yoweri Museveni has ruled since his guerrilla army took Kampala in 1986." },
    KOR: { t: "President Yoon Suk-yeol declared martial law on 3 December 2024; the National Assembly voted it down within hours. He was impeached and removed in April 2025, and Lee Jae-myung won the election that followed." },
    BRA: { t: "Supporters of the defeated president Jair Bolsonaro stormed the seats of all three branches on 8 January 2023. In September 2025 the Supreme Court convicted Bolsonaro of plotting a coup to stay in power." },
    NPL: { t: "A republic since 2008, after a ten-year Maoist insurgency ended in a peace settlement. Youth-led protests brought down the government in September 2025; elections followed in March 2026.", d: "maoism" },
    ISR: { t: "A parliamentary democracy founded on Zionism, the Jewish national movement. The ratings for Israel exclude the West Bank and Gaza, which the indices rate separately.", d: "zionism" },
    GEO: { t: "Governed by the Georgian Dream party; the disputed parliamentary election of October 2024 and the suspension of the country's EU accession talks brought months of protest." },
    SRB: { t: "Governed by Aleksandar Vučić's Progressive Party; a student-led protest movement has run since November 2024." },
    HKG: { t: "A special administrative region of China. The national security law imposed by Beijing in 2020 ended the organised opposition." },
    PSG: { t: "Hamas, an Islamist movement, won the 2006 Palestinian election and seized Gaza by force in June 2007. The territory has been devastated by the war that followed its attack on Israel of 7 October 2023.", d: "islamism" },
    SOM: { t: "A federal government in Mogadishu, backed by African Union forces, has fought the jihadist movement al-Shabaab since 2006." },
    HTI: { t: "No elected officials have held office since 2023; a transitional council was installed in April 2024 while armed gangs control most of the capital." }
  }
};
