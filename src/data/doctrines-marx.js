/* ============================================================
   ARCHIVUS — THE DOCTRINES, part two: the Marxist family.
   ------------------------------------------------------------
   manifesto  the 1848 pamphlet dissected: publication facts,
              each section's theses with where the idea CAME FROM
              and what its heirs DID WITH it, the ten-point
              programme and its fate, the prefaces.
              (Paraphrase throughout; only a few famous phrases
              are quoted.)
   red        the shared core, the ten questions on which the
              family divides, and each current's answer.
   schisms    the dated breaks.
   record     what happened where the doctrine held power —
              defenders' case, critics' case, sourced ranges.
   states     party-states by year and alignment (The Atlas).
   Source codes use the same w:/b:/s:/m: prefixes as doctrines.js.
   ============================================================ */
(function () {
  "use strict";
  const D = window.ARCHIVUS_DOCTRINES = window.ARCHIVUS_DOCTRINES || {};

  D.manifesto = {
    title: "Manifest der Kommunistischen Partei",
    facts: [
      ["Commissioned", "by the second congress of the Communist League, London, 29 November – 8 December 1847"],
      ["Written", "by Marx in Brussels, December 1847 – January 1848, reworking Engels's Principles of Communism. In late January the League's committee demanded the manuscript by 1 February, or 'further measures' would follow."],
      ["Published", "London, late February 1848 — a 23-page German pamphlet, unsigned, printed by J. E. Burghard at 46 Liverpool Street, Bishopsgate, for the German Workers' Educational Association"],
      ["That same week", "revolution broke out in Paris (22–24 February). The pamphlet arrived too late and in too few copies to influence the risings of 1848."],
      ["First in English", "November 1850, translated by Helen Macfarlane for the Chartist weekly The Red Republican — the first printing to name its authors. Her opening had not a 'spectre' but a 'frightful hobgoblin' stalking Europe."],
      ["Standard English text", "Samuel Moore's translation, revised and annotated by Engels, 1888"],
      ["What survives", "one manuscript page, in Amsterdam. With Capital, volume I, it was entered on UNESCO's Memory of the World register in 2013."]
    ],
    absent: "Not in the Manifesto: 'dictatorship of the proletariat' (first used 1850), 'surplus value' (worked out in the 1850s), 'base and superstructure' (1859), 'from each according to ability, to each according to need' (1875), the vanguard party (Lenin, 1902), 'socialism in one country' (Stalin, 1924), people's war (Mao, 1930s). Each is a later layer.",
    sections: [
      { n: "Preamble", t: "A spectre is haunting Europe",
        g: "Every power of old Europe — Pope and Tsar, Metternich and Guizot — has allied to hunt the 'spectre' of communism. Since all of them already treat it as a power, it is time the communists said openly what they want.",
        th: [] },
      { n: "I", t: "Bourgeois and Proletarians",
        g: "A compressed history of the world, and the most admiring portrait of capitalism ever written by its enemies.",
        th: [
          { t: "All recorded history is the history of class struggles.",
            from: "The French historians Thierry and Guizot, and Saint-Simon, had written history as the struggle of classes; Marx said so himself. Engels's 1888 footnote limits the claim to written history: before it, he believed, lay a primitive communism.", fr: ["classhist", "saintsimon"],
            after: "The one thesis every heir keeps. They divide on which classes count: Lenin adds the poor peasantry as ally, Mao makes it the main force, the New Left looks beyond class altogether." },
          { t: "The bourgeoisie has played a most revolutionary part: it created a world market, more colossal productive forces than all earlier generations together, and cannot exist without constantly revolutionising production — 'all that is solid melts into air'.",
            from: "Adam Smith and Ricardo on markets and the division of labour; Saint-Simon's cult of industry; Engels's own years in Manchester.", fr: ["smith", "ricardo", "saintsimon", "condition"],
            after: "The root of the 'stages' doctrine — capitalism has a necessary job to do first — on which Mensheviks, Bolsheviks and Maoists would part. Economists from Schumpeter onward borrowed the picture as 'creative destruction'." },
          { t: "The modern state is a committee for managing the common affairs of the whole bourgeoisie.",
            from: "Marx's own break with Hegel, for whom the state stood above the clash of private interests.", fr: ["hegel", "gideology"],
            after: "If so, can the state be used or must it be smashed? Bernstein and the social democrats: used. Lenin's State and Revolution: smashed. Bakunin: any state, the workers' included, is the same committee with new members." },
          { t: "Capitalism suffers periodic crises of overproduction — an epidemic that earlier ages would have found absurd — and escapes each only by preparing a worse one.",
            from: "Sismondi's theory of crises; Fourier on poverty born of plenty; the slump of 1847 itself.", fr: ["sismondi", "fourier"],
            after: "Kautsky and Luxemburg built theories of inevitable breakdown on it; Bernstein (1899) answered that capitalism was learning to stabilise itself; Keynes proposed to manage the cycle rather than abolish the system." },
          { t: "Industry gathers workers into great masses, teaches them to combine, and so produces capitalism's own grave-diggers. Wages meanwhile are pressed toward bare subsistence.",
            from: "Chartism and the English trade unions; the revolt of the Silesian weavers (1844); Ricardo's and Malthus's wage theory, which Marx later dropped.", fr: ["chartism", "condition", "ricardo"],
            after: "The most disputed forecast. Real wages rose after 1850 and the middle classes grew: Bernstein's case for revision. Lenin replied that empire's profits had bought off a 'labour aristocracy'. And if the workers will not dig the grave — who? The vanguard (Lenin), the peasantry (Mao), students and the excluded (Marcuse)." }
        ] },
      { n: "II", t: "Proletarians and Communists",
        g: "What communists want, answers to the usual objections, and a programme.",
        th: [
          { t: "The communists are not a separate party opposed to other working-class parties. They are simply its most resolute section, with the clearest view of the line of march.",
            from: "The League's own position as a small society inside a large movement, with the Chartists as the model party.", fr: ["league", "chartism"],
            after: "Both sides of 1903 could quote it: Martov for a broad party open to the whole class, Lenin for a tight vanguard that sees further than the class does. The Comintern's Twenty-One Conditions (1920) settled it by decree — a separate party after all." },
          { t: "The theory of the communists can be summed up in one phrase: abolition of bourgeois private property — not of personal belongings earned by labour, but of capital, which lives by commanding the labour of others.",
            from: "Rousseau's Discourse on Inequality, Babeuf and Proudhon's 'property is theft' — though the Manifesto's distinction between property and capital is aimed against Proudhon; the Ricardian socialists on profit as a deduction from labour.", fr: ["rousseau", "babouvism", "mutualism", "ricsoc"],
            after: "Common ground for the whole family — and the start of its largest quarrel: owned by whom? The state (Stalin), self-managed enterprises (Tito), workers' councils (Pannekoek), the commune (Kropotkin), or regulated rather than owned (social democracy)." },
          { t: "Replies to the charges that communists would abolish the family, the fatherland and culture: the bourgeois family already rests on money, and working men have no country.",
            from: "Fourier and the Saint-Simonians on marriage and the position of women; Owen on education.", fr: ["fourier", "saintsimon", "owen"],
            after: "Engels's Origin of the Family (1884), Bebel, Zetkin and Kollontai built socialist feminism here. 'No country' collapsed in August 1914 and returned as Lenin's right of nations to self-determination — opposed by Luxemburg." },
          { t: "The first step is to raise the proletariat to the position of ruling class and win the battle of democracy, then to use political power to centralise production in the hands of the state. When classes have gone, public power loses its political character: an association in which the free development of each is the condition of the free development of all.",
            from: "The Chartists' faith in the vote; Babeuf and Blanqui on taking power; Saint-Simon on government giving way to the administration of things.", fr: ["chartism", "blanquism", "babouvism", "saintsimon"],
            after: "The fork in the whole tradition. Read 'democracy' and you arrive at Kautsky, Martov and the parliamentary road; read 'ruling class' and 'centralise' and you arrive at the Bolshevik dictatorship. Marx's own later gloss was the Paris Commune. Anarchists rejected the passage whole." }
        ] },
      { n: "III", t: "Socialist and Communist Literature",
        g: "A polemical field guide to the rival socialisms of the 1840s — the first of many Marxist demolitions of the neighbours.",
        th: [
          { t: "Reactionary socialism: 'feudal' socialism (aristocrats denouncing the bourgeoisie in the workers' name), petty-bourgeois socialism (Sismondi — right about the disease, backward-looking in the cure), and German 'True' socialism (French ideas turned into philosophical phrases).",
            from: "Young England and the French Legitimists; Sismondi; Karl Grün and, in part, Moses Hess.", fr: ["sismondi", "hess", "onenation"],
            after: "The template for later charges of 'petty-bourgeois deviation' against rivals to left and right." },
          { t: "Conservative or bourgeois socialism: reformers who want the existing society without its struggles — a bourgeoisie without a proletariat. Proudhon is the named example.",
            from: "Marx's The Poverty of Philosophy (1847), his reply to Proudhon.", fr: ["mutualism"],
            after: "The argument Luxemburg would turn on Bernstein in 1900, and communists on social democracy for a century." },
          { t: "Critical-utopian socialism and communism: Saint-Simon, Fourier and Owen attacked every principle of existing society and are full of valuable material — but they appeal to all classes at once and expect model experiments to do the work of politics.",
            from: "The utopians themselves, read with respect. Babeuf is set apart as the voice of the proletariat in the great Revolution.", fr: ["utopian", "saintsimon", "fourier", "owen"],
            after: "Engels turned the contrast into a doctrine: Socialism, Utopian and Scientific (1880). Twentieth-century critics turned it round and asked which of the two had been the utopian." }
        ] },
      { n: "IV", t: "Position of the Communists in Relation to the Various Existing Opposition Parties",
        g: "Two pages of tactics for February 1848 — out of date within weeks, argued over for a century.",
        th: [
          { t: "Communists support every revolutionary movement against the existing order: the Chartists in England, the agrarian reformers in America, the Social-Democrats in France, the Radicals in Switzerland, the party of agrarian revolution in Poland.",
            from: "The League's actual alliances in 1847.", fr: ["chartism", "league"],
            after: "The seed of every later debate on alliances: united fronts, popular fronts (1935), Mao's 'bloc of four classes'." },
          { t: "In Germany, fight alongside the bourgeoisie against absolute monarchy — while never ceasing to teach workers that the bourgeoisie is their enemy. Germany's bourgeois revolution will be only the prelude to an immediately following proletarian one.",
            from: "The French Revolution read as a sequence that had stopped halfway.", fr: ["leftright", "jacobinism"],
            after: "The single most consequential sentence for Russia. Mensheviks stressed 'alongside the bourgeoisie' and a long interval; Trotsky stressed 'immediately following' and called it permanent revolution, a phrase from Marx's 1850 address; Lenin moved from the first reading toward the second in April 1917." },
          { t: "Communists disdain to conceal their aims. The proletarians have nothing to lose but their chains. Working men of all countries, unite!",
            from: "The motto the League adopted in 1847 in place of 'All men are brothers'.", fr: ["league"],
            after: "Four Internationals (1864, 1889, 1919, 1938) took the slogan. In 1920 the Comintern extended it: workers and oppressed peoples of all countries." }
        ] }
    ],
    programme: {
      note: "Section II ends with ten measures 'pretty generally applicable' in the most advanced countries. In their 1872 preface Marx and Engels said no special stress should be laid on them, and that the passage 'would in many respects be very differently worded today'.",
      items: [
        ["Abolition of property in land; rents applied to public purposes", "Carried out in the party-states (Soviet decree on land, 1917; China, 1950s). Elsewhere it survives as land-value taxation — Henry George's version."],
        ["A heavy progressive income tax", "Now ordinary in almost every state. Britain had an income tax from 1842; Prussia made it progressive in 1891; the United States amended its constitution for one in 1913."],
        ["Abolition of all right of inheritance", "Nowhere durably. Soviet Russia abolished inheritance in 1918 and restored it in 1922. Inheritance and estate taxes are the surviving trace."],
        ["Confiscation of the property of emigrants and rebels", "A measure of every revolution since 1789, including the ones against communist governments."],
        ["Centralisation of credit in a national bank with state capital and an exclusive monopoly", "Central banks are universal, but as bankers to commercial banks; a state monopoly of credit existed only in the planned economies."],
        ["Centralisation of communication and transport in the hands of the state", "State posts, telegraphs and railways were the rule in much of the world for a century — often built by conservatives — and widely privatised after 1980."],
        ["More state-owned factories; waste land brought into cultivation; soil improved to a common plan", "Nationalised industry spread far beyond the communist world after 1945 (coal, steel, energy), then receded. Planned land reclamation ran from the Dutch polders to the Virgin Lands."],
        ["Equal liability of all to work; industrial armies, especially for agriculture", "The darkest afterlife: Trotsky's 'militarisation of labour' (1920), Soviet labour mobilisation, China's communes. Also, more mildly, national labour services."],
        ["Agriculture combined with industry; the gap between town and country gradually abolished", "Garden cities and regional planning on one side; on the other, China's 'sent-down youth' and the Khmer Rouge's emptying of the cities."],
        ["Free education for all children in public schools; an end to children's factory labour in its present form; schooling combined with production", "The most complete success: free public schooling and child-labour law are near-universal, adopted by governments of every colour."]
      ]
    },
    editions: [
      [1848, "London", "First edition, in German, anonymous. A Swedish translation follows within the year."],
      [1850, "London", "First English translation (Helen Macfarlane, The Red Republican). The authors are named for the first time."],
      [1869, "Geneva", "First Russian translation, attributed to Bakunin."],
      [1872, "Leipzig", "New German edition. The preface, written after the Paris Commune, concedes that the programme is dated and adds one correction: the working class cannot simply lay hold of the ready-made state machinery."],
      [1882, "Geneva", "Second Russian edition. The last preface Marx signed asks whether Russia's peasant commune could pass straight to communism — and answers: perhaps, if a Russian revolution sets off a workers' revolution in the West."],
      [1883, "Hottingen-Zürich", "German edition, three months after Marx's death; Engels alone states the 'basic thought' and credits it to Marx."],
      [1888, "London", "The authorised English edition (Samuel Moore, with Engels). Engels explains why in 1847 it could not have been called a Socialist manifesto: socialism then meant respectable utopians, communism the working class."],
      [1917, "Petrograd and after", "After October the pamphlet is printed by states in the hundreds of millions — among the most reproduced texts in history."]
    ],
    u: "m:archive/marx/works/1848/communist-manifesto/"
  };

  /* ───────────── THE RED FAMILY ───────────── */
  D.red = {
    core: [
      ["Historical materialism", "How people produce their living shapes their law, politics and ideas; history advances through successive modes of production.", "Juche replaces it with 'man is the master of everything'; Western Marxists soften it."],
      ["Class struggle", "Since the first surplus, societies have been divided into classes with opposed interests, and that conflict is the engine of change.", "Bernstein and the social democrats come to prefer cooperation between classes; Eurocommunists, broad alliances."],
      ["Exploitation", "Profit arises from labour that workers perform beyond what their wages pay for — surplus value.", "Largely abandoned by revisionists and by Deng's reformers in practice."],
      ["Capitalism is transitory", "It develops production as nothing before it, yet breeds crises and creates the class that will end it.", "Bernstein doubts the breakdown; Dengism postpones the question for a century."],
      ["Social ownership", "The means of production should be held in common rather than privately.", "All agree on the phrase; they fight over whether 'common' means the state, the enterprise, the council or the commune."],
      ["Internationalism", "The interests of workers cross frontiers; class comes before nation.", "Broken in August 1914; bent by 'socialism in one country', Titoism, Maoism and Juche."],
      ["The goal", "A classless society in which the state, as an instrument of class rule, has nothing left to do.", "Shared on paper by all but the revisionists; indefinitely deferred by every party that held power."],
      ["Theory guides practice", "Philosophers have only interpreted the world; the point is to change it.", "Shared by all — which is why each quarrel over theory became a split."]
    ],
    dims: [
      ["agent", "Who makes the revolution?"],
      ["party", "What is the party?"],
      ["road", "How is power won?"],
      ["stages", "Must capitalism come first?"],
      ["scope", "One country or the world?"],
      ["state", "The state afterwards"],
      ["econ", "The economy"],
      ["peasant", "The peasantry"],
      ["dem", "Democracy and dissent"],
      ["nation", "Nation and empire"]
    ],
    cur: [
      { id: "marxism", s: "Marx & Engels", c: {
        agent: "The industrial working class, organising itself: its emancipation must be its own act.",
        party: "Communists are the most resolute part of the workers' movement, not a sect apart. No blueprint for organisation.",
        road: "Revolution — though Marx allowed (1872) that workers might win peacefully where democracy exists, as in England, America and Holland.",
        stages: "Broadly yes: no social order perishes before its productive forces are developed (1859). But see the 1882 preface on Russia.",
        scope: "International of necessity: the leading countries together.",
        state: "A transitional 'dictatorship of the proletariat' on the Commune's model — recallable delegates on workers' wages — after which the state withers away.",
        econ: "Common ownership and conscious planning. Two phases: reward by work done, later by need (1875).",
        peasant: "Mostly a conservative mass — 'a sack of potatoes' (1852) — needing the workers' lead; an ally where it revolts.",
        dem: "'Win the battle of democracy'; universal suffrage as a weapon. Few guarantees spelled out for opposition.",
        nation: "'Working men have no country' — yet backed Polish and Irish independence: a people that oppresses another cannot itself be free." } },
      { id: "revisionism", s: "Bernstein → social democracy", c: {
        agent: "A broad democratic alliance of workers and the middle classes.",
        party: "A mass electoral party of reform that should 'dare to appear what it is'.",
        road: "Ballots, unions, cooperatives, municipal reform. No rupture.",
        stages: "Capitalism is not collapsing; it grows over into socialism piece by piece.",
        scope: "National parliaments; a loose International.",
        state: "The democratic state is the instrument — to be extended, not smashed.",
        econ: "A mixed economy, regulation, welfare; later Keynes. Public ownership a means, not an end.",
        peasant: "Voters to be won; protect the smallholder.",
        dem: "Both means and end: democracy is 'the absence of class government'.",
        nation: "National defence is legitimate (1914); some early revisionists accepted colonial policy." } },
      { id: "menshevism", s: "Menshevism", c: {
        agent: "The working class — but in Russia it is too small to rule; first the bourgeoisie must overthrow Tsarism.",
        party: "A broad party open to any worker who supports it under its direction (Martov's Rule 1), with internal democracy and legal unions.",
        road: "Back the bourgeois-democratic revolution and act as its left opposition. In 1917, joined the Provisional Government.",
        stages: "Yes, strictly: decades of capitalism and democracy before socialism is possible in Russia.",
        scope: "Socialism in Russia only with, or after, revolution in the advanced West.",
        state: "A democratic republic: Constituent Assembly, multiparty soviets, civil liberties.",
        econ: "Capitalist development under democratic control; against forced requisitioning; urged something like the NEP before Lenin adopted it.",
        peasant: "'Municipalise' the land under elected local bodies; wary of peasants as a property-minded class.",
        dem: "Non-negotiable: opposed dispersing the Constituent Assembly and one-party rule; Martov denounced the Red Terror.",
        nation: "Split in 1914 between 'defencists' and Martov's internationalists; governed independent Georgia, 1918–21." } },
      { id: "leninism", s: "Leninism", c: {
        agent: "The working class allied with the poor peasantry — led by the party.",
        party: "A centralised vanguard of professional revolutionaries: a member must work in one of its organisations (Lenin's Rule 1). 'Democratic centralism'.",
        road: "Armed insurrection; smash the old state machine; 'all power to the soviets'.",
        stages: "The bourgeois revolution can be led by workers and peasants and 'grow over' into a socialist one (April Theses, 1917).",
        scope: "Break the imperialist chain at its weakest link, then hold out until the German revolution arrives.",
        state: "A Commune-type state of soviets in theory (1917); in practice one-party rule, the Cheka and, from 1921, a ban on factions.",
        econ: "Nationalised banks and industry; War Communism (1918–21); then the NEP — markets below, the state on the 'commanding heights'.",
        peasant: "'Land to the peasants' in 1917; grain seizures in the civil war; the alliance restored by the NEP.",
        dem: "'Bourgeois' democracy is a shell for capital; proletarian dictatorship is rule 'unrestricted by any laws'. Rival parties gone by 1921.",
        nation: "The right of nations to self-determination, up to secession; imperialism as capitalism's highest stage; alliance with colonial revolt." } },
      { id: "luxemburgism", s: "Luxemburgism", c: {
        agent: "The working masses in spontaneous action — the mass strike.",
        party: "A mass party that learns from the class and gives it direction but cannot stand in for it. Against 'ultra-centralism'.",
        road: "Mass strikes growing over into revolution; workers' councils (1918).",
        stages: "Capitalism must break down (The Accumulation of Capital, 1913): 'socialism or barbarism'.",
        scope: "Strictly international: only Europe's revolution can save Russia's.",
        state: "The dictatorship of a class, not of a party or a clique — with unrestricted democracy.",
        econ: "Socialisation carried out by the workers themselves.",
        peasant: "Opposed Lenin's land distribution: it creates a new class of owners hostile to socialism.",
        dem: "Free elections, press and assembly are the revolution's lifeblood; without them only the bureaucracy stays active (1918).",
        nation: "Against national self-determination as a slogan: it divides workers and serves each country's bourgeoisie." } },
      { id: "councilcom", s: "Council communism", c: {
        agent: "The whole working class, organised in councils at the workplace.",
        party: "None in Lenin's sense — at most a group for clarifying ideas. Parties and unions belong to the old world.",
        road: "Mass strikes, occupations, councils taking over production. Boycott parliament.",
        stages: "The West, not Russia, is the model; Bolshevism fits a peasant country's bourgeois revolution.",
        scope: "International or nothing.",
        state: "The council system is the only 'state'; any separate apparatus is a new ruling class.",
        econ: "Direct workers' management; some proposed accounting in labour-time instead of money.",
        peasant: "Marginal — and the reason Russian methods cannot be exported.",
        dem: "Delegates mandated and recallable at any moment.",
        nation: "National liberation is a bourgeois cause." } },
      { id: "trotskyism", s: "Trotskyism", c: {
        agent: "The working class, drawing the peasantry behind it — even where it is a small minority.",
        party: "Lenin's vanguard party (which Trotsky opposed until 1917), with the right to form factions restored; a Fourth International.",
        road: "Insurrection on the October model; 'transitional demands'; united fronts of workers' parties, never 'popular fronts' with liberals.",
        stages: "No separate stage: the democratic revolution passes straight over into the socialist one — permanent revolution.",
        scope: "Socialism in one country is impossible; an isolated workers' state degenerates.",
        state: "Soviet democracy. The USSR is a 'degenerated workers' state' that needs a political revolution against its bureaucracy.",
        econ: "State ownership and planning with workers' control; rapid industrialisation — urged before Stalin took it up.",
        peasant: "No independent role: the peasantry follows either the worker or the bourgeois. Tax the rich peasant to fund industry.",
        dem: "Multi-party soviet democracy (from 1936) — though in power Trotsky upheld one-party rule and helped crush Kronstadt.",
        nation: "Self-determination, as Lenin; unconditional defence of the USSR against attack, Stalin notwithstanding." } },
      { id: "ml", s: "Marxism–Leninism", c: {
        agent: "The working class allied with the collective-farm peasantry, led by the party.",
        party: "'Monolithic': no factions; the leadership's line is the party's; periodic purges.",
        road: "Insurrection in theory. In Eastern Europe after 1945, the Red Army and 'people's democracy'; abroad, popular fronts (1935).",
        stages: "Two stages for colonial countries; in the USSR, socialism declared achieved in 1936.",
        scope: "Socialism in one country is possible and is the task of the hour; the world movement's first duty is to defend the USSR.",
        state: "Grows stronger as socialism advances, because class struggle sharpens; the withering away is postponed.",
        econ: "State ownership, five-year plans, priority to heavy industry, collectivised farms.",
        peasant: "Forced collectivisation (1929–33) and 'liquidation of the kulaks as a class'.",
        dem: "One party, one list. The liberties of the 1936 constitution stayed on paper; opposition was treason.",
        nation: "'National in form, socialist in content': federal republics on paper, a Russian centre in practice; whole peoples deported in the 1940s." } },
      { id: "maoism", s: "Maoism", c: {
        agent: "The peasantry as the main force, the working class (through the party) as leader; a 'bloc of four classes' at first.",
        party: "A vanguard kept honest by the 'mass line' — and to be shaken by the masses when it hardens: 'bombard the headquarters'.",
        road: "Protracted people's war: rural bases encircle the cities. 'Political power grows out of the barrel of a gun.'",
        stages: "New Democracy first — anti-imperialist and anti-feudal, with the national capitalists — then socialism, hurried after 1953.",
        scope: "Self-reliance; after 1960 the world's 'countryside' (the Third World) encircles its 'cities', and the USSR is denounced as social-imperialist.",
        state: "'People's democratic dictatorship'. Class struggle continues under socialism — hence continuing revolution.",
        econ: "Soviet-style plans, then communes and mass mobilisation (the Great Leap); 'politics in command' over expertise and incentive.",
        peasant: "The heart of the revolution: land reform (1947–52), then collectives and people's communes (1958).",
        dem: "'Let a hundred flowers bloom' (1956–57), then the Anti-Rightist Campaign; mass criticism in place of legal opposition.",
        nation: "National liberation from imperialism is the first task; Han-led 'autonomy' for minorities." } },
      { id: "titoism", s: "Titoism", c: {
        agent: "The working class, through self-managed enterprises.",
        party: "A 'League of Communists' meant to guide rather than command — still the only party.",
        road: "Its own partisan war (1941–45), owing little to the Red Army: the root of its independence.",
        stages: "Each country chooses its own road and pace.",
        scope: "National roads to socialism; non-alignment between the blocs.",
        state: "A decentralised federation of six republics; the withering away should begin now, through self-management.",
        econ: "Socially owned firms run by workers' councils and competing on a market; open borders for trade and labour.",
        peasant: "Collectivisation abandoned in 1953; private smallholdings kept.",
        dem: "More liberty than the Soviet bloc — travel, culture — but no rival parties; Djilas was jailed for saying a 'new class' ruled.",
        nation: "'Brotherhood and unity' of the South Slav nations; co-founder of the Non-Aligned Movement (1961)." } },
      { id: "guevarism", s: "Guevarism", c: {
        agent: "The guerrilla nucleus, rooted among the peasants, which sparks the masses.",
        party: "Follows the armed struggle rather than preceding it; Cuba's Communist Party was founded after victory (1965).",
        road: "The foco: a small rural insurgency creates revolutionary conditions instead of waiting for them.",
        stages: "No waiting on a 'national bourgeoisie': straight to socialism (declared in 1961).",
        scope: "Continental — 'two, three, many Vietnams'; Cuban troops and doctors abroad.",
        state: "A one-party state under a commander-in-chief, with mass organisations on every block.",
        econ: "Guevara: central budgeting and moral incentives over markets. Later, Soviet-style planning on Soviet subsidy.",
        peasant: "The guerrilla's base and first beneficiary (agrarian reform, 1959).",
        dem: "'Within the revolution, everything; against it, nothing' (Castro, 1961).",
        nation: "Anti-imperialism above all: the revolution as national liberation from the United States." } },
      { id: "juche", s: "Juche", c: {
        agent: "The popular masses — who need the Leader as a body needs a brain.",
        party: "The Leader's instrument; succession by bloodline.",
        road: "The legend of the anti-Japanese guerrillas; a state founded under Soviet occupation (1948).",
        stages: "Man, not economic stages, is the master of everything.",
        scope: "Socialism 'of our own style', sealed from the world.",
        state: "Permanent, leader-centred, and from the 1990s 'military-first'.",
        econ: "Autarkic heavy industry and collective farms; state rationing; markets tolerated since the famine.",
        peasant: "Fully collectivised by 1958.",
        dem: "None: hereditary political castes (songbun) and prison camps.",
        nation: "The Korean nation is the subject of history; reunification is the sacred goal." } },
      { id: "eurocom", s: "Eurocommunism", c: {
        agent: "A broad alliance of workers, the middle strata and Catholics.",
        party: "A mass parliamentary party; democratic centralism loosened, then dropped.",
        road: "Elections and coalition (the 'historic compromise'); alternation in office accepted.",
        stages: "A long 'war of position' inside democratic institutions (Gramsci).",
        scope: "Independent of Moscow; the PCI accepted NATO and the European Community.",
        state: "The democratic state is to be transformed, not smashed. The PCF dropped 'dictatorship of the proletariat' in 1976; the PCE dropped 'Leninism' in 1978.",
        econ: "A mixed economy with planning and key sectors nationalised.",
        peasant: "No distinct doctrine.",
        dem: "Pluralism, civil liberties and free elections as permanent, not tactical.",
        nation: "Each party answers to its own nation; condemned the invasions of 1968 and 1979." } },
      { id: "dengism", s: "Dengism", c: {
        agent: "The party, as moderniser of the nation.",
        party: "The Leninist monopoly kept — first of the Four Cardinal Principles — with collective leadership and retirement rules (since loosened).",
        road: "Power is already held; the task is development.",
        stages: "China is in the 'primary stage of socialism', which will last a century.",
        scope: "'Reform and opening': join the world market; keep a low profile.",
        state: "Strong and technocratic; the 'people's democratic dictatorship' retained.",
        econ: "Communes dissolved, special economic zones, private firms, state banks — 'it does not matter whether the cat is black or white'.",
        peasant: "The household responsibility system (1978–83) returned farming to families.",
        dem: "Economic freedom without political pluralism; Tiananmen, June 1989.",
        nation: "National rejuvenation; 'one country, two systems' for Hong Kong and Taiwan." } }
    ],
    /* the comparison the user asked for by name opens first */
    start: ["menshevism", "leninism", "trotskyism", "maoism"]
  };

  D.schisms = [
    [1872, "Marx against Bakunin", "The Hague. Is the state to be captured or abolished? The anarchists are expelled and the First International dies of it.", "collectivist"],
    [1899, "Bernstein against Kautsky", "Is capitalism collapsing, or can it be reformed into socialism? Revisionism is condemned and quietly adopted.", "revisionism"],
    [1903, "Lenin against Martov", "Brussels and London. Who is a member — and so what kind of party? Bolsheviks and Mensheviks.", "menshevism"],
    [1914, "War", "Vote for your own government's war, or against all of them? The Second International collapses in a day.", "warcredits"],
    [1918, "Lenin against Kautsky and Luxemburg", "The Constituent Assembly is dispersed. Dictatorship of a class, or of a party? Democracy as form, or as substance?", "luxemburgism"],
    [1920, "The Twenty-One Conditions", "Every socialist party must choose Moscow or its reformists. Communists and Social Democrats become separate parties everywhere.", "comintern"],
    [1921, "Kronstadt and the left communists", "The sailors of 1917 demand free soviets and are crushed; factions are banned; the council communists leave or are expelled.", "councilcom"],
    [1924, "Stalin against Trotsky", "Socialism in one country, or permanent revolution? Settled by expulsion (1927), exile (1929) and an ice-axe (1940).", "trotskyism"],
    [1948, "Stalin against Tito", "May a communist country disobey Moscow? Yugoslavia does, and survives.", "titoism"],
    [1956, "Khrushchev against Stalin's ghost", "The Secret Speech, then tanks in Budapest. Was Stalin an aberration, or the system?", "secretspeech"],
    [1960, "Beijing against Moscow", "Peaceful coexistence or revolution? The world movement splits in two; Albania sides with China.", "sinosoviet"],
    [1968, "Prague", "Can the system reform itself with a free press? Not while the Red Army decides. Western parties begin to walk away.", "eurocom"],
    [1978, "Deng against the Maoists", "Is the market a tool or a betrayal? China turns; Albania breaks with it; Maoism survives chiefly in insurgencies.", "dengism"],
    [1989, "The Wall", "The Soviet bloc dissolves without a war. Five party-states remain.", "perestroika"]
  ];

  /* What happened where the doctrine held power. Each entry gives the case its defenders make,
     the case its critics make, and sourced figures as ranges. No verdict is offered. */
  D.record = {
    note: "A death toll measures a regime. Whether it indicts the doctrine is precisely what this family has argued about since 1918: Stalin's heirs, Trotsky's, Luxemburg's and Bernstein's each give a different answer. Figures are scholarly ranges, not single numbers, and several are contested.",
    rows: [
      { n: "Soviet Union", y: "1917–1991", id: "ml",
        pro: "Turned a peasant empire into an industrial power within a generation; literacy rose from about a quarter of the population (1897) to near-universal by the 1950s; bore the main weight of the war against Nazi Germany at a cost of some 24–27 million lives; first satellite and first human in orbit.",
        con: "The famine of 1930–33 killed an estimated 5.7–8.7 million; the Great Terror of 1937–38 saw roughly 680,000 executions recorded in NKVD files; about 18 million people passed through the Gulag camps (1930–53), with 1.5–1.7 million recorded deaths; whole nationalities were deported in the 1940s.",
        u: ["w:Soviet_famine_of_1930–1933", "w:Great_Purge", "w:Gulag", "w:Likbez"] },
      { n: "China", y: "1949–", id: "maoism",
        pro: "Reunified the country after a century of invasion and civil war; land reform; life expectancy rose from under 40 around 1949 to the mid-60s by the late 1970s; since 1978, according to the World Bank, close to 800 million people have risen above the extreme-poverty line.",
        con: "The famine of the Great Leap Forward (1959–61) killed between 15 and 55 million people by scholarly estimates; the Cultural Revolution (1966–76) cost a further several hundred thousand to two million lives and persecuted many more; the 1989 Tiananmen protests were suppressed by the army.",
        u: ["w:Great_Chinese_Famine", "w:Cultural_Revolution", "w:Poverty_in_China", "w:History_of_the_People's_Republic_of_China_(1949–1976)"] },
      { n: "Eastern Europe", y: "1945–1989", id: "ml",
        pro: "Rebuilt war-ruined countries with full employment, cheap housing, universal schooling and health care, and a high share of women in work.",
        con: "Installed and kept by an occupying army: risings were crushed in East Berlin (1953), Budapest (1956) and Prague (1968); secret police such as the Stasi kept files on millions; a wall was built to stop people leaving.",
        u: ["w:Eastern_Bloc", "w:Stasi"] },
      { n: "Cambodia", y: "1975–1979", id: "maoism",
        pro: "None that its former sympathisers still defend; most Maoists disown it. It was overthrown by communist Vietnam.",
        con: "Between 1.5 and 2 million people — about a quarter of the population — died by execution, starvation and forced labour after the cities were emptied.",
        u: ["w:Cambodian_genocide"] },
      { n: "Cuba", y: "1959–", id: "guevarism",
        pro: "The 1961 literacy campaign; infant mortality and life expectancy comparable to far richer countries; tens of thousands of doctors sent abroad.",
        con: "One legal party since 1965; political prisoners; forced-labour camps for dissidents and gay men (UMAP, 1965–68); repeated mass emigration; an economy dependent first on Soviet and then on Venezuelan support.",
        u: ["w:Cuban_literacy_campaign", "w:Human_rights_in_Cuba"] },
      { n: "North Korea", y: "1948–", id: "juche",
        pro: "Rapid reconstruction and industrial growth into the 1960s, when it out-produced the South.",
        con: "The famine of the 1990s killed between 240,000 and 3.5 million people by differing estimates; a UN commission of inquiry (2014) found crimes against humanity, including a system of political prison camps.",
        u: ["w:North_Korean_famine", "w:Human_rights_in_North_Korea"] },
      { n: "The reform road in office", y: "1919–", id: "socdem",
        pro: "The parties that left Marxism behind built the welfare states of Scandinavia, Britain, Germany and Austria — among the highest living standards and lowest inequality on record — within multiparty democracy.",
        con: "From the left: capitalism was left standing, and after 1980 much of the settlement was rolled back, often by the same parties. From the right: high taxation and slower growth by the 1970s.",
        u: ["w:Nordic_model", "w:Welfare_state"] },
      { n: "Marxists elected", y: "1957–", id: "demsoc",
        pro: "Communists won free elections in Kerala (1957, and often since) and governed within the constitution; Salvador Allende won Chile's presidency in 1970 on a programme of a legal road to socialism.",
        con: "Allende's government was overthrown by the armed forces on 11 September 1973 amid economic crisis and US hostility — taken by revolutionaries as proof that the legal road is closed, and by others as a warning about governing without a majority.",
        u: ["w:Communism_in_Kerala", "w:Presidency_of_Salvador_Allende"] }
    ],
    total: "How many in all? The Black Book of Communism (1997) proposed some 94–100 million deaths. Two of its own contributors disputed the total and its introduction's equation with Nazism, and other scholars' sums differ widely — chiefly on whether famine deaths should be counted as killings. Comparable ledgers have been drawn up for colonial empires and for the world wars; counting settles less than either side hopes.",
    totalU: ["w:Mass_killings_under_communist_regimes", "w:The_Black_Book_of_Communism"]
  };

  /* Party-states by year. align: S Soviet-aligned · C China-aligned · I independent of both ·
     R market reform under the party · M Marxist government inside a multiparty system.
     part: only part of the modern country (the map uses today's borders). */
  D.states = [
    { n: ["Russia"], seg: [[1917, 1991, "S"]], l: "Soviet Russia / USSR" },
    { n: ["Ukraine", "Belarus", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Armenia", "Azerbaijan", "Georgia"], seg: [[1922, 1991, "S"]], l: "Soviet republics" },
    { n: ["Estonia", "Latvia", "Lithuania", "Moldova"], seg: [[1940, 1991, "S"]], l: "Baltic states and Moldova (annexed 1940)" },
    { n: ["Mongolia"], seg: [[1924, 1990, "S"]] },
    { n: ["Poland"], seg: [[1945, 1989, "S"]] },
    { n: ["Germany"], seg: [[1949, 1990, "S"]], part: 1, l: "East Germany (GDR)" },
    { n: ["Czechia", "Slovakia"], seg: [[1948, 1989, "S"]], l: "Czechoslovakia" },
    { n: ["Hungary"], seg: [[1949, 1989, "S"]] },
    { n: ["Romania"], seg: [[1947, 1989, "S"]] },
    { n: ["Bulgaria"], seg: [[1946, 1990, "S"]] },
    { n: ["Albania"], seg: [[1946, 1961, "S"], [1961, 1978, "C"], [1978, 1991, "I"]] },
    { n: ["Serbia", "Croatia", "Slovenia", "Bosnia and Herz.", "Montenegro", "Macedonia", "Kosovo"], seg: [[1945, 1948, "S"], [1948, 1991, "I"]], l: "Yugoslavia" },
    { n: ["China"], seg: [[1949, 1960, "S"], [1960, 1978, "C"], [1978, 2100, "R"]] },
    { n: ["North Korea"], seg: [[1948, 1961, "S"], [1961, 2100, "I"]] },
    { n: ["Vietnam"], seg: [[1954, 1986, "S"], [1986, 2100, "R"]], l: "Vietnam (the North; the whole country from 1976)" },
    { n: ["Laos"], seg: [[1975, 1986, "S"], [1986, 2100, "R"]] },
    { n: ["Cambodia"], seg: [[1975, 1979, "C"], [1979, 1989, "S"]], l: "Cambodia (Khmer Rouge, then the Vietnamese-backed republic)" },
    { n: ["Cuba"], seg: [[1961, 1991, "S"], [1991, 2100, "I"]] },
    { n: ["Yemen"], seg: [[1969, 1990, "S"]], part: 1, l: "South Yemen" },
    { n: ["Afghanistan"], seg: [[1978, 1992, "S"]] },
    { n: ["Ethiopia", "Eritrea"], seg: [[1974, 1991, "S"]], l: "Ethiopia (the Derg)" },
    { n: ["Angola"], seg: [[1975, 1991, "S"]] },
    { n: ["Mozambique"], seg: [[1975, 1990, "S"]] },
    { n: ["Benin"], seg: [[1974, 1990, "S"]] },
    { n: ["Congo"], seg: [[1969, 1991, "S"]], l: "People's Republic of the Congo" },
    { n: ["Somalia", "Somaliland"], seg: [[1969, 1977, "S"]] },
    { n: ["Madagascar"], seg: [[1975, 1991, "S"]] },
    { n: ["Chile"], seg: [[1970, 1973, "M"]], l: "Chile (Allende's Popular Unity)" },
    { n: ["Nicaragua"], seg: [[1979, 1990, "M"]], l: "Nicaragua (the Sandinistas)" }
  ];
  D.align = { S: ["Aligned with Moscow", "#e5484d"], C: ["Aligned with Beijing", "#f0a03c"], I: ["Independent of both", "#e58fc0"], R: ["Market reform under the party", "#e8c455"], M: ["Marxist government in a multiparty system", "#8fb7ff"] };

  D.sources = [
    ["Marx & Engels, Manifesto of the Communist Party (1848; English 1888) — Marxists Internet Archive", "m:archive/marx/works/1848/communist-manifesto/"],
    ["Lenin, The Three Sources and Three Component Parts of Marxism (1913)", "m:archive/lenin/works/1913/mar/x01.htm"],
    ["Stanford Encyclopedia of Philosophy — Karl Marx", "s:marx"],
    ["Britannica — Menshevik", "b:Menshevik"], ["Britannica — Bolshevik", "b:Bolshevik"],
    ["Britannica — Leninism", "b:Leninism"], ["Britannica — Trotskyism", "b:Trotskyism"], ["Britannica — Maoism", "b:Maoism"],
    ["International Institute of Social History — the Manifesto manuscript", "https://iisg.nl/collections/manifest"],
    ["Wikipedia — The Political Compass (the model and its critics)", "w:The_Political_Compass"],
    ["Wikipedia — Mass killings under communist regimes (the estimates and the dispute)", "w:Mass_killings_under_communist_regimes"],
    ["Wikipedia — Great Chinese Famine", "w:Great_Chinese_Famine"]
  ];
})();
