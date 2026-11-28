/* ============================================================
   ARCHIVUS — WORLD WAR III · the line-ups (v20)
   Who stands where under each of the five ways it could start.

   Asked for on 2026-11-27, bluntly: the page showed "no presumed alliances under the varying scenarios".
   That was right. The camps on the Board are the same whichever spark is chosen; a war is not.

   WHAT THIS IS
   A PRESUMED line-up: the Archive's own reading, country by country, of what each would most likely do,
   from things that are on the record — a treaty text, a base, an arms supplier, what it did the last
   time. It is a judgment, and every row says what it rests on and how firm it is:
       b  bound      a treaty text obliges it
       i  already    it has already done this, in this very quarrel
       p  presumed   no text obliges it; the record points this way
       o  open       it could go either way, and the row says on what it turns
   None of this is a prediction, and none of it is sourced to a forecaster: where the Board cites
   studies, this page argues from facts and says so.

   ROLES
       G1 G2  a principal: one of the states the war is between (the page prints "At war")
       F1 F2  fights beside the first or the second side
       B1 B2  backs a side without fighting: arms, bases, money, intelligence, sanctions
       H      hedges: tied to both, or trading its position for a price
       O      stays out

   SCHEMA   scenario id (as in ww3.js sparks) → { tag, sides: [first, second], short: [first, second], read, hinge, basis: [source keys],
            who: { country: [role, why, firmness] } }
   Country names are the map's own. `basis` names what was opened for the reading: keys of `src` below, or of ww3.js,
   conflicts.js and situation.js. A row carries no link of its own: its proof is the scenario's basis, shown beside it.
   ============================================================ */
window.ARCHIVUS_WW3_LINEUPS = {
  meta: { asOf: "2026-11-27" },
  src: {
    nat:    ["NATO — The North Atlantic Treaty, Washington, 4 April 1949 (official text)", "https://www.nato.int/cps/en/natohq/official_texts_17120.htm", "Article 5: 'such action as it deems necessary, including the use of armed force'. Article 6: Europe, North America, Turkey, and the islands of the North Atlantic north of the Tropic of Cancer"],
    natfl:  ["NATO — Strengthening NATO's eastern flank (the forward land forces and who leads each)", "https://www.nato.int/en/what-we-do/deterrence-and-defence/strengthening-natos-eastern-flank", "Estonia: United Kingdom. Latvia: Canada, a brigade since July 2024. Lithuania: Germany, a brigade inaugurated May 2025, up to 5,000 troops by 2027. Poland: United States. Bulgaria: Italy"],
    unc:    ["US Forces Korea — Germany joins United Nations Command (2 August 2024)", "https://www.usfk.mil/Media/Press-Products/Press-Releases/Article/3859125/germany-joins-united-nations-command/", "the eighteenth member state"],
    unckt:  ["The Korea Times — Germany joins UN Command as 18th member state", "https://www.koreatimes.co.kr/southkorea/defense/20240802/germany-joins-un-command-as-18th-member-state", "in 2023 the members vowed a 'united' response to 'any renewal of hostilities'"],
    gt17:   ["Al Jazeera — China to remain 'neutral' if North Korea attacks first (on the Global Times editorial of 11 August 2017)", "https://www.aljazeera.com/news/2017/8/11/china-to-remain-neutral-if-north-korea-attacks-first", "neutral if the North strikes first; would 'prevent' an attempt to overthrow it"],
    at24:   ["SIPRI — Trends in International Arms Transfers, 2024 (fact sheet)", "https://www.sipri.org/sites/default/files/2025-03/fs_2503_at_2024.pdf", "2020–24: Pakistan 81% from China. India 36% from Russia (72% in 2010–14), 33% France, 13% Israel. Poland 45% United States, 42% South Korea. Taiwan 98% and Japan 97% from the United States"],
    saupak: ["Al Jazeera — Saudi Arabia signs mutual defence pact with nuclear-armed Pakistan (17 September 2025)", "https://aljazeera.com/news/2025/9/17/saudi-arabia-signs-mutual-defence-pact-with-nuclear-armed-pakistan", "'any aggression against either country shall be considered an aggression against both'; a Saudi official: relations with India 'more robust than ever'"]
  },
  /* v21 · military spending in 2025, US$ billion, for the countries of `order` that are among SIPRI's forty largest spenders (source key
     `milex`, in ww3.js). A country with no entry is below the fortieth place ($6.4 billion) or is one SIPRI does not estimate (North Korea,
     the United Arab Emirates, Syria, Yemen): the sums the page prints are therefore floors, and say so. "e" marks SIPRI's own estimates. */
  spend: { "United States of America": 954, "China": 336, "Russia": 190, "Germany": 114, "India": 92.1, "United Kingdom": 89.0, "Ukraine": 84.1, "Saudi Arabia": 83.2, "France": 68.0, "Japan": 62.2,
    "Israel": 48.3, "Italy": 48.1, "South Korea": 47.8, "Poland": 46.8, "Canada": 37.5, "Australia": 35.3, "Turkey": 30.0, "Brazil": 23.9, "Taiwan": 18.2, "Norway": 17.0, "Sweden": 16.5,
    "Indonesia": 15.0, "Pakistan": 11.9, "Vietnam": 10.5, "Finland": 8.1, "Iran": 7.4, "Iraq": 6.4 },
  spendMeta: { src: "milex", floor: 6.4, none: ["North Korea", "United Arab Emirates", "Syria", "Yemen"], est: ["China", "Russia", "Ukraine", "Saudi Arabia"] },
  roles: { G1: "A principal, first side", G2: "A principal, second side", F1: "Fights", F2: "Fights", B1: "Backs, does not fight", B2: "Backs, does not fight", H: "Hedges", O: "Stays out" },
  firm: { b: ["Bound", "a treaty text obliges it"], i: ["Already so", "it has already done this in this quarrel"], p: ["Presumed", "no text obliges it; the record points this way"], o: ["Open", "it could go either way"] },
  order: ["United States of America", "Canada", "United Kingdom", "France", "Germany", "Italy", "Poland", "Estonia", "Latvia", "Lithuania", "Finland", "Sweden", "Norway", "Hungary", "Turkey", "Ukraine", "Belarus", "Russia", "Kazakhstan",
    "China", "Taiwan", "Japan", "South Korea", "North Korea", "Philippines", "Vietnam", "Thailand", "Indonesia", "Australia", "New Zealand", "India", "Pakistan",
    "Iran", "Israel", "Saudi Arabia", "United Arab Emirates", "Qatar", "Iraq", "Jordan", "Syria", "Yemen", "Egypt", "Brazil", "South Africa"],
  scen: {
    taiwan: {
      tag: "Taiwan", sides: ["The United States and those who fight beside it", "China"], short: ["the United States", "China"], basis: ["nat", "dp", "rfacsis", "tertrais", "cnas", "at24"],
      read: "A Pacific war, and NATO is not in it. The treaty that binds Europe to America stops at the Tropic of Cancer: Guam and Hawaii are outside it. Washington fights with three allies that matter, Japan, Australia and the Philippines, and its strongest alliance watches.",
      hinge: "Japan. The war is fought from American bases on Japanese soil. If Tokyo lets them be used, China must strike Japan or fight with one hand; if it does not, every wargame says the island is lost.",
      who: {
        "Taiwan": ["G1", "The island itself. It fights; the question is for how many weeks alone.", "i"],
        "China": ["G2", "The attacker in every version of this scenario.", "p"],
        "United States of America": ["F1", "No treaty obliges it: the Taiwan Relations Act promises arms and 'grave concern'. Every wargame assumes it fights; its policy since 1979 has been not to say.", "o"],
        "Japan": ["F1", "Hosts the bases the war would be fought from. Its 2015 security laws allow it to fight when its own survival is threatened, and the nearest Japanese island is 110 km from Taiwan.", "p"],
        "Australia": ["F1", "ANZUS, AUKUS, and American bombers and marines rotating through its north. It has fought beside the United States in every major war since 1918.", "p"],
        "Philippines": ["B1", "A treaty ally since 1951 that has opened bases to American forces, some of them in the north of Luzon, facing Taiwan. The treaty binds Washington to Manila if Manila is hit, which those bases make likely.", "p"],
        "South Korea": ["B1", "A treaty ally with about 28,500 Americans on its soil, and North Korea across the line. It would resist those troops being used for Taiwan and would not send its own.", "p"],
        "New Zealand": ["B1", "A partner, not an ally in force: its ANZUS tie to Washington has been suspended since 1986.", "o"],
        "United Kingdom": ["B1", "AUKUS and the occasional carrier; no treaty duty east of Suez. Submarines and intelligence, probably not an army.", "p"],
        "Canada": ["B1", "Sails the Taiwan Strait with the Americans; bound to nothing in the Pacific.", "p"],
        "France": ["B1", "A Pacific power with territories and citizens there, and the European most careful not to be drawn into this one.", "o"],
        "Germany": ["B1", "Sanctions, at the cost of its largest trading partner. No forces.", "p"],
        "Italy": ["B1", "Sanctions; no forces.", "p"], "Poland": ["B1", "Sanctions; its army stays facing Russia.", "p"],
        "Estonia": ["O", "Bound to nothing here, and watching its own border.", "p"], "Latvia": ["O", "Bound to nothing here, and watching its own border.", "p"], "Lithuania": ["B1", "The one European state that has already paid for a quarrel with Beijing over Taiwan.", "p"],
        "Finland": ["O", "Bound to nothing here.", "p"], "Sweden": ["O", "Bound to nothing here.", "p"], "Norway": ["O", "Bound to nothing here.", "p"],
        "Hungary": ["H", "The European Union's readiest host for Chinese investment; it would slow any sanctions.", "p"],
        "Turkey": ["H", "Sells to both and would say so.", "p"],
        "Russia": ["B2", "'No limits', and no treaty: nothing obliges it to fight. Oil, arms and intelligence, and pressure in Europe to pin American forces there.", "p"],
        "North Korea": ["B2", "Bound to China by the 1961 treaty only if China is attacked. Its use is as a second front: a crisis in Korea would hold American and South Korean forces in place.", "o"],
        "Iran": ["B2", "Sells China most of the oil it exports, and already holds an American fleet in the Gulf.", "p"],
        "Pakistan": ["B2", "China's closest arms client: 81% of its imported arms are Chinese. Words, votes and a tied-down India; no troops.", "p"],
        "Belarus": ["O", "Follows Moscow, and Moscow does not fight this one.", "p"], "Kazakhstan": ["O", "Sells to China and stays out.", "p"], "Ukraine": ["O", "At war already; its interest is that Russia not be freed by an American defeat.", "p"],
        "India": ["H", "In the Quad and in a border dispute with China, and allied to no one. It would not fight for Taiwan; it might use the moment on the Himalayan line, or sell its neutrality dear.", "o"],
        "Vietnam": ["O", "Disputes the same sea with China and is bound by its own rule of 'four noes': no alliances, no foreign bases.", "p"],
        "Thailand": ["H", "An American treaty ally on paper since 1954 and a Chinese arms customer in practice.", "p"],
        "Indonesia": ["O", "Non-aligned by founding doctrine; the straits it sits on are what both sides need.", "p"],
        "Saudi Arabia": ["H", "Hosts American forces and sells China its oil. A blockade of China runs through its customers.", "p"],
        "United Arab Emirates": ["H", "Hosts American forces and sells China its oil.", "p"], "Qatar": ["H", "Hosts the largest American base in the region and sells China its gas.", "p"],
        "Israel": ["O", "An American client with no part in the Pacific.", "p"], "Iraq": ["O", "No part in it.", "p"], "Jordan": ["O", "No part in it.", "p"], "Syria": ["O", "No part in it.", "p"], "Yemen": ["O", "No part in it, unless the Gulf opens as a second front.", "p"], "Egypt": ["O", "Holds the canal and takes no side.", "p"],
        "Brazil": ["O", "China is its largest customer; it would condemn the war and sell to both.", "p"], "South Africa": ["O", "In BRICS with China and Russia; it would abstain.", "p"]
      }
    },
    baltic: {
      tag: "Baltic", sides: ["NATO", "Russia"], short: ["NATO", "Russia"], basis: ["nat", "natfl", "dp", "kt", "cnas", "at24"],
      read: "The only scenario in which a treaty binds a whole alliance at once, and the one where the treaty's wording matters most: Article 5 obliges each member to take 'such action as it deems necessary'. It does not say war. Thirty-two governments each decide what is necessary.",
      hinge: "The United States. Without it NATO still outspends Russia several times over, but the nuclear guarantee, the airlift and the command are American. Whether Washington treats a seized border town as war is the whole question.",
      who: {
        "Estonia": ["G1", "The ground. A British-led NATO force is already on it.", "b"], "Latvia": ["G1", "The ground. A Canadian-led NATO brigade has been on it since 2024.", "b"], "Lithuania": ["G1", "The ground, and the land corridor to Kaliningrad. A German brigade was inaugurated on it in 2025 and grows to 5,000 by 2027.", "b"],
        "Russia": ["G2", "The attacker in every version of this scenario.", "p"],
        "Poland": ["F1", "Bound, next door, and spending a larger share of its income on arms than any other member.", "b"],
        "Finland": ["F1", "Bound since 2023, with the longest border with Russia of any member, and a Swedish-led NATO force on its soil.", "b"],
        "United Kingdom": ["F1", "Bound, and it leads the NATO force in Estonia: it is in the war in the first hour.", "b"],
        "Germany": ["F1", "Bound, and its brigade is in Lithuania: it is in the war in the first hour.", "b"],
        "Canada": ["F1", "Bound, and its soldiers lead the brigade in Latvia.", "b"],
        "France": ["F1", "Bound; a nuclear power that has said its vital interests have a European dimension.", "b"],
        "Sweden": ["F1", "Bound since 2024; the Baltic is its sea.", "b"], "Norway": ["F1", "Bound; shares an Arctic border with Russia.", "b"], "Italy": ["F1", "Bound; leads the NATO force in Bulgaria.", "b"],
        "United States of America": ["F1", "Bound by Article 5, whose words leave each member to judge what action is necessary. It leads the NATO force in Poland.", "o"],
        "Turkey": ["F1", "Bound, with NATO's second-largest army; it also buys Russian gas, bought Russian air defences and never joined the sanctions.", "o"],
        "Hungary": ["B1", "Bound, and long the member most reluctant to act against Moscow. Bases and airspace, probably; soldiers, doubtful.", "o"],
        "Ukraine": ["F1", "Already fighting Russia. A NATO–Russia war makes it the alliance's largest army in the field.", "i"],
        "Belarus": ["F2", "In a union state with Russia, in its treaty organisation, hosting its nuclear weapons, and the road by which Russia invaded Ukraine in 2022.", "p"],
        "North Korea": ["F2", "Bound to Russia by the treaty of 2024, and it has already sent soldiers to fight for Russia in Europe.", "i"],
        "China": ["B2", "Russia's economic lifeline and its supplier of the parts that weapons are made of. No treaty, no troops, and no wish to lose Europe as a market.", "p"],
        "Iran": ["B2", "Has supplied the drones Russia fires at Ukraine.", "i"],
        "Kazakhstan": ["O", "In Russia's treaty organisation, and it sent no one to Ukraine and recognised none of the annexations.", "p"],
        "Japan": ["B1", "Sanctions and money, as over Ukraine; no forces.", "p"], "South Korea": ["B1", "Poland's second arms supplier: 42% of what it imported in 2020–24.", "p"], "Australia": ["B1", "Sanctions and arms, as over Ukraine.", "p"], "New Zealand": ["B1", "Sanctions.", "p"],
        "Taiwan": ["O", "No part in it, and fearing what China does while America looks west.", "p"], "Philippines": ["O", "No part in it.", "p"], "Vietnam": ["O", "Buys Russian arms; stays out.", "p"], "Thailand": ["O", "No part in it.", "p"], "Indonesia": ["O", "No part in it.", "p"],
        "India": ["H", "Russia has been its largest arms supplier for half a century (36% of imports in 2020–24, down from 72%). It abstained on Ukraine and would again.", "p"],
        "Pakistan": ["O", "No part in it.", "p"],
        "Israel": ["H", "An American client that has kept its line to Moscow open throughout the war in Ukraine.", "p"],
        "Saudi Arabia": ["H", "Sets the oil price together with Russia.", "p"], "United Arab Emirates": ["H", "Where Russian money and trade went when the sanctions fell.", "p"], "Qatar": ["B1", "The gas that replaces Russia's in Europe.", "p"],
        "Iraq": ["O", "No part in it.", "p"], "Jordan": ["O", "No part in it.", "p"], "Syria": ["O", "Russia's former client; its bases there are the question.", "o"], "Yemen": ["O", "No part in it.", "p"], "Egypt": ["H", "Buys Russian grain and arms and takes American aid.", "p"],
        "Brazil": ["H", "In BRICS with Russia; it abstains and sells.", "p"], "South Africa": ["H", "In BRICS with Russia; it abstains.", "p"]
      }
    },
    gulf: {
      tag: "Gulf", sides: ["The United States and Israel", "Iran"], short: ["the United States and Israel", "Iran"], basis: ["cfrIran", "irancas", "cnas", "dp", "cfrYem"],
      read: "The one scenario that is not a scenario: it began on 28 February 2026 and is not over. It shows what each camp is worth under fire. Iran's partners sent intelligence, drones and words, and none of them fought. Iran struck six Gulf states that host American forces, which put them on the American side whether they chose it or not.",
      hinge: "Russia and China. Neither fought for Iran in 2026. The study the Board cites judges that a long stand-off could lead Russia to help Iran tie down American forces; if either moves from backing to fighting, a regional war becomes the world's.",
      who: {
        "Iran": ["G2", "The ground. Struck on 28 February 2026 and its Supreme Leader killed; its ports are under American blockade.", "i"],
        "Israel": ["G1", "Struck Iran with the United States in 2026, and was struck by its missiles.", "i"],
        "United States of America": ["G1", "No treaty with Israel, and it struck Iran alongside it in 2026 and blockades its ports.", "i"],
        "United Kingdom": ["B1", "Helped shoot down Iranian missiles aimed at Israel in 2024.", "p"],
        "France": ["B1", "Helped shoot down Iranian missiles aimed at Israel in 2024.", "p"],
        "Jordan": ["B1", "Shot down Iranian drones crossing its sky in 2024; it lies between the two.", "p"],
        "Germany": ["B1", "Arms to Israel and sanctions on Iran.", "p"], "Italy": ["B1", "Sanctions; ships in the Red Sea.", "p"], "Canada": ["B1", "Sanctions.", "p"], "Australia": ["B1", "Sanctions; a ship now and then.", "p"],
        "Yemen": ["F2", "The Houthis, who hold the capital, are Iran's ally and have been at open war with Saudi Arabia since 2026.", "i"],
        "Iraq": ["H", "Its government hosts American troops; its Iran-aligned militias fought on Iran's side in 2026 and were bombed for it.", "i"],
        "Syria": ["O", "Iran's corridor until the fall of Assad in December 2024; closed to it since.", "p"],
        "Russia": ["B2", "In the war of 2026 it gave political backing, intelligence and upgraded drones, and did not fight.", "i"],
        "China": ["B2", "Buys most of the oil Iran exports. Money and votes; no forces.", "p"],
        "North Korea": ["B2", "The source of much of Iran's missile technology.", "p"],
        "Belarus": ["O", "Follows Moscow, and Moscow does not fight this one.", "p"],
        "Saudi Arabia": ["B1", "Struck by Iran in 2026 and at open war with Iran's Houthi allies since. It hosts American forces and buys three-quarters of its arms from the United States.", "i"],
        "United Arab Emirates": ["B1", "Struck by Iran in 2026, with more dead than any other Gulf state. It hosts American forces.", "i"],
        "Qatar": ["H", "Struck by Iran in 2026, host to American forces, and the place where the two sides talk.", "i"],
        "Turkey": ["H", "A NATO member and Iran's neighbour and rival; it would mediate and trade.", "p"],
        "Egypt": ["O", "Loses the canal's revenue when the Red Sea is closed, and stays out.", "p"],
        "Pakistan": ["H", "Iran's neighbour, Saudi Arabia's ally by the agreement of 2025, and the mediator of the memorandum of June 2026.", "i"],
        "India": ["H", "Buys Gulf oil, runs a port in Iran, and buys arms from Israel.", "p"],
        "Japan": ["O", "Much of its oil comes through Hormuz; it pays for the war without being in it.", "p"], "South Korea": ["O", "Much of its oil comes through Hormuz.", "p"], "Taiwan": ["O", "No part in it.", "p"], "Philippines": ["O", "No part in it.", "p"], "Vietnam": ["O", "No part in it.", "p"], "Thailand": ["O", "No part in it.", "p"], "Indonesia": ["O", "No part in it; sympathy with the Palestinians, not with Tehran.", "p"], "New Zealand": ["O", "No part in it.", "p"],
        "Poland": ["O", "No part in it.", "p"], "Estonia": ["O", "No part in it.", "p"], "Latvia": ["O", "No part in it.", "p"], "Lithuania": ["O", "No part in it.", "p"], "Finland": ["O", "No part in it.", "p"], "Sweden": ["O", "No part in it.", "p"], "Norway": ["O", "No part in it.", "p"], "Hungary": ["O", "No part in it.", "p"],
        "Ukraine": ["B1", "Has been bombed with Iranian drones for four years.", "p"], "Kazakhstan": ["O", "No part in it.", "p"],
        "Brazil": ["O", "Condemns the strikes; no part in it.", "p"], "South Africa": ["O", "Took Israel to the world court; no part in the fighting.", "p"]
      }
    },
    korea: {
      tag: "Korea", sides: ["South Korea and the United States", "North Korea"], short: ["South Korea", "North Korea"], basis: ["dp", "unc", "unckt", "gt17", "kt", "at24"],
      read: "The oldest line-up on the map, and the least noticed: the war of 1950 never ended, and the United Nations Command that fought it still exists. Eighteen states belong to it, Germany the latest in 2024, and in 2023 they vowed a 'united' response to 'any renewal of hostilities'. That is how Turkey, Thailand and Norway come to be on a list for a war in Korea.",
      hinge: "China. Its treaty of 1961 obliges it to help if North Korea is attacked. In 2017 a state newspaper said China should stay neutral if the North struck first, and would stop anyone overthrowing it. Who fired first is therefore the most important fact of the war, and the hardest to establish.",
      who: {
        "South Korea": ["G1", "The ground. Half its people live within range of the North's artillery.", "b"],
        "North Korea": ["G2", "The ground, with nuclear weapons.", "p"],
        "United States of America": ["F1", "Bound by the 1953 treaty, with about 28,500 troops on the peninsula who are in it from the first shell.", "b"],
        "Japan": ["B1", "American bases in Japan are the rear of any war in Korea, and all of Japan is within the North's missile range. It is struck early; whether it then fights is its own decision.", "p"],
        "United Kingdom": ["B1", "A member of the United Nations Command.", "p"], "France": ["B1", "A member of the United Nations Command.", "p"], "Canada": ["B1", "A member of the United Nations Command.", "p"],
        "Australia": ["B1", "A member of the United Nations Command; it fought here in 1950.", "p"], "New Zealand": ["B1", "A member of the United Nations Command.", "p"], "Philippines": ["B1", "A member of the United Nations Command.", "p"],
        "Thailand": ["B1", "A member of the United Nations Command.", "p"], "Turkey": ["B1", "A member of the United Nations Command: it sent a brigade in 1950.", "p"], "Italy": ["B1", "A member of the United Nations Command.", "p"], "Norway": ["B1", "A member of the United Nations Command.", "p"],
        "Germany": ["B1", "Joined the United Nations Command in 2024, its eighteenth member.", "p"],
        "South Africa": ["H", "Still a member of the United Nations Command, and in BRICS with China and Russia.", "o"],
        "China": ["B2", "Bound by the 1961 treaty if the North is attacked. A state newspaper said in 2017 it should stay neutral if the North struck first.", "o"],
        "Russia": ["B2", "Bound by the treaty of 2024 to give military aid without delay if the North is invaded. Its army is in Ukraine.", "b"],
        "Belarus": ["O", "Follows Moscow at a distance.", "p"], "Iran": ["B2", "A customer for the North's missiles.", "p"],
        "Poland": ["B1", "South Korea's arms customer: 42% of Poland's imports in 2020–24.", "p"],
        "Taiwan": ["O", "No part in it, and fearing it is next.", "p"], "Vietnam": ["O", "No part in it.", "p"], "Indonesia": ["O", "No part in it.", "p"], "India": ["O", "Chaired the commission that exchanged the prisoners in 1953; takes no side.", "p"], "Pakistan": ["O", "No part in it.", "p"],
        "Estonia": ["O", "No part in it.", "p"], "Latvia": ["O", "No part in it.", "p"], "Lithuania": ["O", "No part in it.", "p"], "Finland": ["O", "No part in it.", "p"], "Sweden": ["H", "Sits on the commission that has supervised the armistice since 1953.", "p"], "Hungary": ["O", "No part in it.", "p"],
        "Ukraine": ["B1", "Has already fought North Korean soldiers, in Russia.", "i"], "Kazakhstan": ["O", "No part in it.", "p"],
        "Israel": ["O", "No part in it.", "p"], "Saudi Arabia": ["O", "No part in it.", "p"], "United Arab Emirates": ["O", "No part in it.", "p"], "Qatar": ["O", "No part in it.", "p"], "Iraq": ["O", "No part in it.", "p"], "Jordan": ["O", "No part in it.", "p"], "Syria": ["O", "No part in it.", "p"], "Yemen": ["O", "No part in it.", "p"], "Egypt": ["O", "No part in it.", "p"],
        "Brazil": ["O", "No part in it.", "p"]
      }
    },
    himalaya: {
      tag: "India–Pakistan", sides: ["India", "Pakistan"], short: ["India", "Pakistan"], basis: ["at24", "saupak", "cfrInd", "dp"],
      read: "The scenario where the two camps of the Board mean least. America's partner India is armed by Russia and France; China's client Pakistan has a defence pact with Saudi Arabia, America's largest arms customer in the Gulf. It becomes a world war by one road only: if China, which holds land India claims, moves on the Himalayan line while India is fighting in the west.",
      hinge: "China. It armed the Pakistani air force that fought India in May 2025, and it has its own disputed border with India along the whole Himalaya. Whether it stops at arms is the difference between the fifth war between two neighbours and a war between the world's two largest nations.",
      who: {
        "India": ["G1", "The ground, with nuclear weapons.", "i"],
        "Pakistan": ["G2", "The ground, with nuclear weapons.", "i"],
        "China": ["B2", "Supplies 81% of Pakistan's imported arms, and holds territory India claims.", "i"],
        "Turkey": ["B2", "Backed Pakistan in public during the fighting of May 2025.", "p"],
        "Saudi Arabia": ["B2", "Signed a mutual defence agreement with Pakistan in September 2025 ('aggression against either is aggression against both'), and said the same week that its relations with India had never been stronger.", "o"],
        "Russia": ["B1", "India's largest arms supplier: 36% of its imports in 2020–24, and 72% ten years earlier.", "p"],
        "France": ["B1", "India's second arms supplier: 33% of its imports in 2020–24.", "p"],
        "Israel": ["B1", "India's third arms supplier: 13% of its imports in 2020–24.", "p"],
        "United States of America": ["H", "India's partner in the Quad and Pakistan's patron for decades. It brokered the ceasefire of May 2025.", "i"],
        "United Kingdom": ["H", "Home to large communities from both; it mediates.", "p"],
        "Iran": ["H", "Pakistan's neighbour, and India runs a port on its coast.", "p"],
        "United Arab Emirates": ["H", "Banker and back channel to both.", "p"], "Qatar": ["H", "Mediates.", "p"],
        "Japan": ["O", "In the Quad with India; no forces.", "p"], "Australia": ["O", "In the Quad with India; no forces.", "p"],
        "Kazakhstan": ["O", "No part in it.", "p"], "Belarus": ["O", "No part in it.", "p"], "North Korea": ["O", "Once traded missile designs with Pakistan; no part in it now.", "p"],
        "Canada": ["O", "No part in it.", "p"], "Germany": ["O", "No part in it.", "p"], "Italy": ["O", "No part in it.", "p"], "Poland": ["O", "No part in it.", "p"], "Estonia": ["O", "No part in it.", "p"], "Latvia": ["O", "No part in it.", "p"], "Lithuania": ["O", "No part in it.", "p"], "Finland": ["O", "No part in it.", "p"], "Sweden": ["O", "No part in it.", "p"], "Norway": ["O", "No part in it.", "p"], "Hungary": ["O", "No part in it.", "p"], "Ukraine": ["O", "No part in it.", "p"],
        "Taiwan": ["O", "No part in it; a China busy in the Himalaya is a China not crossing the strait.", "p"], "South Korea": ["O", "No part in it.", "p"], "Philippines": ["O", "No part in it.", "p"], "Vietnam": ["O", "No part in it.", "p"], "Thailand": ["O", "No part in it.", "p"], "Indonesia": ["O", "No part in it.", "p"], "New Zealand": ["O", "No part in it.", "p"],
        "Iraq": ["O", "No part in it.", "p"], "Jordan": ["O", "No part in it.", "p"], "Syria": ["O", "No part in it.", "p"], "Yemen": ["O", "No part in it.", "p"], "Egypt": ["O", "No part in it.", "p"], "Brazil": ["O", "No part in it.", "p"], "South Africa": ["O", "No part in it.", "p"]
      }
    }
  }
};
