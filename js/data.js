// TØRLAGT — content, story and flow. SPOILERS. Everything here is data, checked by tools/lint.js.
// Creatures only, invented places, no religion. The drug is invented (dug = dew).
(function (K) {
  'use strict';
  K.CONFIG = {
    id: 'toerlagt',
    title: 'Tørlagt',
    tagline: 'En svamp i ørkenen',
    endings: 4,
    yes: ['Ja!', 'Præcis!', 'Flot!', 'Rigtigt!'],
    no: ['Nej!', 'Av!', 'Ikke helt.'],
    run: () => ({ tally: {} }),
    ending: (st) => K.endingOf(st),
  };
  K.ENDINGS = { blomstret: 'Blomstret', hvid: 'Hvid', toerlagt: 'Tørlagt', tilbagefald: 'Tilbagefald' };
  K.CHAPTERS = [
    { title: 'Ankomst', topic: 'en/et/plural + farver' },
    { title: 'Komplimenter', topic: 'Sikke …!' },
    { title: 'Puklen', topic: 'den/det/de + -e' },
    { title: 'Trippet', topic: 'mærkelige adjektiver' },
    { title: 'Gruppen', topic: 'Kan du det?! · også / heller ikke' },
    { title: 'Opsugningen', topic: 'for + adjektiv · alt' },
  ];

  K.CAST = {
    svampen: { name: 'Svampen (dig)', e: '🧽', color: '#f2d24b' },
    kaktus: { name: 'Kaktussen', e: '🌵', color: '#5fae5a', pitch: 0.8 },
    skorpion: { name: 'Skorpionen', e: '🦂', color: '#d9883b', pitch: 1.2 },
    firben: { name: 'Firbenet', e: '🦎', color: '#7bd36b', pitch: 1.3 },
    kamel: { name: 'Kamelen', e: '🐫', color: '#c8a06a', pitch: 0.7 },
    flue: { name: 'Fluesvampen', e: '🍄', color: '#e2403a', pitch: 1.1 },
    grib: { name: 'Gribben', e: '🦅', color: '#8a7f73', pitch: 0.9 },
    gruppen: { name: 'Gruppen', e: '🌵🦂🦎🐫', color: '#c9c3b8' },
  };
  K.SCENES = {
    title: { from: '#3a2147', to: '#120b14' },
    lejr: { from: '#e6b56a', to: '#7c4a22', label: 'Lejren' },
    nat: { from: '#151a36', to: '#05060c', label: 'Natten' },
    trip: { from: '#7b2ff7', to: '#f107a3', label: 'Farverne', trip: true },
    pukkel: { from: '#b98a52', to: '#3b2412', label: 'Inde i puklen' },
    ude: { from: '#9fd3e8', to: '#e9d9a8', label: 'Ude' },
  };
  K.COLORS = {
    roed: { hex: '#d8352a' }, groen: { hex: '#2f9e44' }, blaa: { hex: '#2f6fd8' }, gul: { hex: '#f2c230' },
    sort: { hex: '#1b1b1b', dark: true }, hvid: { hex: '#f4f1ea' }, brun: { hex: '#7a4a24', dark: true }, graa: { hex: '#8d8d8d' },
    orange: { hex: '#f08a24' }, lilla: { hex: '#8e44ad', dark: true },
  };
  K.PATTERNS = { stribet: 'stripes', prikket: 'dots', ternet: 'checks' };

  const L = (w, da, en) => ({ w, da, en });

  // ---------- mini-game content
  const FIRBENET = [
    { e: '🧢', col: 'groen', right: 'en grøn kasket', wrong: ['en grønt kasket', 'et grøn kasket'], why: 'kasket is an en-word: no ending.' },
    { e: '🧣', col: 'gul', right: 'et gult tørklæde', wrong: ['et gul tørklæde', 'et gule tørklæde'], why: 'tørklæde is an et-word: gul → gult.' },
    { e: '🧦', col: 'roed', right: 'nogle røde sokker', wrong: ['nogle rød sokker', 'nogle rødt sokker'], why: 'Plural: rød → røde.' },
    { e: '👗', col: 'hvid', pat: 'stribet', right: 'en stribet kjole', wrong: ['en stribede kjole', 'et stribet kjole'], why: 'en-word, indefinite: stribet stays stribet.' },
    { e: '👖', col: 'blaa', right: 'nogle blå bukser', wrong: ['nogle blåt bukser', 'en blå bukser'], why: 'bukser is plural; blå gets no -e.' },
    { e: '👔', col: 'sort', right: 'et sort slips', wrong: ['et sorte slips', 'en sort slips'], why: 'slips is an et-word; sort already ends in -t.' },
    { e: '🧥', col: 'brun', right: 'en brun jakke', wrong: ['en brunt jakke', 'et brun jakke'], why: 'jakke is an en-word: no ending.' },
    { e: '👟', col: 'orange', right: 'nogle orange sko', wrong: ['nogle orangee sko', 'nogle oranget sko'], why: 'orange never changes.' },
  ].map((r) => Object.assign({ prompt: 'Hvad har Firbenet på?' }, r));

  const KOMPLIMENTER = [
    { e: '🧢', col: 'groen', answers: ['Sikke en smart kasket'], traps: ['et', 'smarte'], why: 'en kasket → Sikke en smart kasket!' },
    { e: '🧣', col: 'roed', answers: ['Sikke et pænt tørklæde'], traps: ['en', 'pæne'], why: 'et tørklæde → pæn gets -t: Sikke et pænt tørklæde!' },
    { e: '👟', col: 'hvid', answers: ['Sikke nogle lækre sko'], traps: ['lækker', 'en'], why: 'Plural: lækker → lækre.' },
    { e: '🧥', col: 'sort', answers: ['Sikke en lækker jakke'], traps: ['lækkert', 'et'], why: 'en jakke: lækker, no ending.' },
    { e: '👔', col: 'gul', answers: ['Sikke et flot slips'], traps: ['flotte', 'en'], why: 'flot already ends in -t: et flot slips.' },
    { e: '👖', col: 'blaa', answers: ['Sikke nogle smarte bukser'], traps: ['smart', 'et'], why: 'Plural: smart → smarte.' },
  ];

  const REPLAY = [
    { who: 'flue', prompt: 'Hvad skal jeg sige til svampen?', right: 'Sikke en flot svamp!', wrong: ['Sikke et flot svamp!', 'Sikke en flotte svamp!'], why: 'en svamp → Sikke en flot svamp!' },
    { who: 'flue', prompt: 'Den er gul. Hvad skal jeg sige?', right: 'Sikke en gul svamp!', wrong: ['Sikke en gult svamp!', 'Sikke et gul svamp!'], why: 'en svamp: gul, no ending.' },
    { who: 'flue', prompt: 'Og så?', right: 'Vi er jo begge svampe.', wrong: ['Vi er jo begge svamp.', 'Vi er jo begge svampen.'], why: 'Plural: en svamp → to svampe.' },
  ];

  const PUKLEN = [
    { e: '🛋️', col: 'roed', lieCol: 'groen', right: 'den røde sofa', wrong: ['den rød sofa', 'det røde sofa'], colWrong: 'den grønne sofa', says: 'Min RØDE sofa!', why: 'After den: rød → røde.' },
    { e: '🗄️', col: 'hvid', lieCol: 'lilla', right: 'det hvide skab', wrong: ['det hvidt skab', 'den hvide skab'], colWrong: 'det lilla skab', says: 'Mit HVIDE skab!', why: 'After det the adjective gets -e, not -t: det hvide skab.' },
    { e: '🪑', col: 'gul', lieCol: 'blaa', right: 'de gule stole', wrong: ['de gul stole', 'de gult stole'], colWrong: 'de blå stole', says: 'Mine GULE stole!', why: 'After de: gul → gule.' },
    { e: '💡', col: 'brun', right: 'min gamle lampe', wrong: ['min gammel lampe', 'mit gamle lampe'], why: 'After min: gammel → gamle.' },
    { e: '🛏️', col: 'sort', lieCol: 'orange', right: 'den sorte seng', wrong: ['den sort seng', 'det sorte seng'], colWrong: 'den orange seng', says: 'Min SORTE seng!', why: 'After den: sort → sorte.' },
    { e: '🪑', col: 'groen', right: 'de små stole', wrong: ['de lille stole', 'de små stol'], why: 'lille → små in the plural.' },
    { e: '🗄️', col: 'blaa', lieCol: 'roed', right: 'mit blå skab', wrong: ['mit blåt skab', 'min blå skab'], colWrong: 'mit røde skab', says: 'Mit BLÅ skab!', why: 'After mit the adjective gets -e, but blå never does: mit blå skab.' },
    { e: '💺', col: 'lilla', lieCol: 'gul', right: 'den lilla lænestol', wrong: ['den lillae lænestol', 'det lilla lænestol'], colWrong: 'den gule lænestol', says: 'Min LILLA lænestol!', why: 'lilla never changes.' },
  ].map((r) => Object.assign({ prompt: 'Hvad er det?' }, r));

  const TRIPPET = [
    ['en lilla kjole', 'en lillat kjole', '👗'], ['de små stole', 'de lille stole', '🪑'], ['den gamle kommode', 'den gammele kommode', '🗃️'],
    ['et orange tæppe', 'et oranget tæppe', '🟧'], ['de lækre puder', 'de lækker puder', '🟪'], ['det grå skab', 'det gråt skab', '🗄️'],
    ['de blå puder', 'de blåt puder', '🟦'], ['et lille bord', 'et lillet bord', '🟫'], ['de gamle stole', 'de gammel stole', '🪑'],
  ];

  const GRUPPEN = [
    { who: 'skorpion', say: 'Jeg kan godt lide den gule sofa.', cue: '❗', right: 'Kan du det?!', wrong: ['Kan du ikke?!', 'Er du det?!'], why: 'Surprise: repeat the verb. kan godt lide → Kan du det?!' },
    { who: 'kamel', say: 'Jeg er ikke så vild med de stribede gardiner.', cue: '❗', right: 'Er du ikke?!', wrong: ['Er du det?!', 'Kan du ikke?!'], why: 'Negative statement with er → Er du ikke?!' },
    { who: 'firben', say: 'Jeg synes, det røde bord er grimt.', cue: '❗', right: 'Synes du det?!', wrong: ['Synes du ikke?!', 'Er du det?!'], why: 'synes → Synes du det?!' },
    { who: 'kamel', say: 'Jeg er vild med de blå puder.', cue: '🤝', right: 'Det er jeg også.', wrong: ['Det er jeg heller ikke.', 'Det kan jeg også.'], why: 'Agree with a positive: også. Same verb: er.' },
    { who: 'skorpion', say: 'Jeg kan ikke lide det grå skab.', cue: '🤝', right: 'Det kan jeg heller ikke.', wrong: ['Det kan jeg også.', 'Det er jeg heller ikke.'], why: 'Agree with a negative: heller ikke. Same verb: kan.' },
    { who: 'firben', say: 'Jeg er træt af mit t.', cue: '❗', right: 'Er du det?!', wrong: ['Er du ikke?!', 'Kan du det?!'], why: 'Positive statement with er → Er du det?!' },
  ];

  const REVIEW = [
    { e: '🛋️', col: 'roed', prompt: 'Sofaen er alt for stor. Hvad siger du?', right: 'Den er alt for stor.', wrong: ['Den er alt for stort.', 'Det er alt for stor.'], why: 'en sofa → den, stor (no ending).' },
    { e: '🗄️', col: 'hvid', prompt: 'Skabet er lidt for lille.', right: 'Det er lidt for lille.', wrong: ['Den er lidt for lille.', 'Det er lidt for lillet.'], why: 'et skab → det. lille never gets -t.' },
    { e: '🪑', col: 'gul', prompt: 'Stolene er alt for små.', right: 'De er alt for små.', wrong: ['De er alt for lille.', 'Den er alt for små.'], why: 'Plural: små.' },
    { e: '🧣', col: 'lilla', prompt: 'Sig noget pænt om tørklædet.', right: 'Sikke et flot tørklæde!', wrong: ['Sikke en flot tørklæde!', 'Sikke et flotte tørklæde!'], why: 'et tørklæde: flot.' },
    { e: '🛏️', col: 'brun', prompt: 'Kamelen peger på sin seng.', right: 'den brune seng', wrong: ['den brun seng', 'det brune seng'], why: 'After den: -e.' },
    { e: '🧦', col: 'blaa', prompt: 'Firbenet har …', right: 'nogle blå sokker', wrong: ['nogle blåt sokker', 'et blå sokker'], why: 'blå gets no -e in the plural.' },
    { who: 'skorpion', prompt: 'Jeg er ikke så vild med lilla. 🤝', right: 'Det er jeg heller ikke.', wrong: ['Det er jeg også.', 'Det kan jeg heller ikke.'], why: 'Negative + er → Det er jeg heller ikke.' },
  ];

  // ---------- the flow. ch = chapter start (card). replay: true = played again from Kapitler.
  const lesson = (o) => Object.assign({ screen: 'lesson', replay: true }, o);
  K.FLOW = [
    // ===== 1 · Ankomst
    { screen: 'card', ch: 1, title: 'Nat 1', sub: 'Ankomst', music: 'calm' },
    { screen: 'panel', scene: 'lejr', cast: ['grib', 'kaktus'], lines: [
      { n: 'A vulture lands, drops you in the sand from a modest height, and ticks something off a list.' },
      L('grib', 'Tørkeriget. Sidste stop.', 'The Dry Kingdom. Last stop.'),
      { th: 'I am a sponge. I have been wet for most of my life. Apparently that is the problem.' },
      { n: 'Your file says: soaks up everything. Mostly dew, the glowing kind that makes the world change colour. Three years. Sent here by: the other sponges.' },
      L('kaktus', 'Velkommen til Lejren. Her er der ingen dug.', 'Welcome to the Camp. There is no dew here.'),
    ] },
    lesson({ who: 'kaktus', scene: 'lejr', title: 'Farver: en, et, nogle', say: { da: 'En rød hat. Et rødt tørklæde. Nogle røde sokker.', en: 'A red hat. A red scarf. Some red socks.' },
      rule: 'The colour agrees with the noun. en-word: no ending. et-word: +t. Plural: +e. (blå and grå: no -e. orange and lilla never change.)',
      ex: ['en grøn kasket', 'et grøn[t] slips', 'nogle grøn[ne] sokker', 'nogle blå bukser'],
      try: { e: '🧣', col: 'gul', q: 'Firbenet har ___ på.', right: 'et gult tørklæde', wrong: ['et gul tørklæde', 'en gult tørklæde'], why: 'tørklæde is an et-word: gul → gult.' } }),
    { screen: 'panel', scene: 'lejr', cast: ['firben', 'kaktus'], lines: [
      L('firben', 'Jeg har lige købt et t.', 'I have just bought a t.'),
      { th: 'The lizard is wearing a wooden letter T as a hat. He changes colour every time he buys something. He buys a lot.' },
    ] },
    { screen: 'quiz', replay: true, id: 'Firbenet', variant: 'firbenet', title: 'Firbenet', sub: 'Han køber og køber.', n: 5, rounds: FIRBENET },
    { screen: 'panel', scene: 'nat', cast: ['flue'], music: 'tense', lines: [
      { n: 'Night. Next to your bed, something grows with a soft pop. Red, with white dots. It smiles.' },
      L('flue', 'Hej, fætter. Vi er jo begge svampe.', 'Hi, cousin. We are both svampe, after all.'),
      { th: 'In Danish a sponge and a mushroom are the same word. I did not ask for this.' },
    ] },

    // ===== 2 · Komplimenter
    { screen: 'card', ch: 2, title: 'Nat 5', sub: 'Komplimenter', music: 'calm' },
    { screen: 'panel', scene: 'lejr', cast: ['skorpion', 'kaktus'], lines: [
      { n: 'The scorpion is allowed six compliments a day. It is ten past nine in the morning. He has had four.' },
      L('skorpion', 'Sig noget pænt om min kasket. Bare én gang.', 'Say something nice about my cap. Just once.'),
    ] },
    lesson({ who: 'skorpion', scene: 'lejr', title: 'Sikke …!', say: { da: 'Sikke en flot kasket! Sikke et flot slips! Sikke nogle flotte sko!', en: 'What a nice cap! What a nice tie! What nice shoes!' },
      rule: 'Sikke + en / et / nogle + adjective + noun! The adjective agrees: en pæn, et pænt, nogle pæne. (flot already ends in t: et flot.)',
      ex: ['Sikke en pæn jakke!', 'Sikke et pæn[t] tørklæde!', 'Sikke nogle pæn[e] bukser!', 'Hvor er det en flot kjole!'],
      try: { e: '👔', col: 'roed', q: 'Sig noget pænt om slipset:', right: 'Sikke et pænt slips!', wrong: ['Sikke en pænt slips!', 'Sikke et pæne slips!'], why: 'et slips → et pænt slips.' } }),
    { screen: 'komplimenter', replay: true, id: 'Komplimenter', title: 'Komplimenter', sub: 'Skorpionen vil have mere.', n: 5, rounds: KOMPLIMENTER },
    { screen: 'panel', scene: 'lejr', cast: ['skorpion', 'kaktus'], mood: { skorpion: 'stiff' }, music: 'tense', lines: [
      { n: 'Next morning the scorpion is standing in the middle of the camp, stiff as a stone, smiling, covered in small white dots.' },
      L('kaktus', 'Han har fået for mange.', 'He has had too many.'),
      { n: 'Next to your bed the sand is damp. You do not remember being wet.' },
    ] },
    { screen: 'card', title: 'Nat 1', sub: 'set fra den anden side' },
    { screen: 'panel', scene: 'nat', cast: ['flue'], lines: [
      { n: 'The first night again, from the other side of the dune. A red mushroom is pacing, as far as a mushroom can pace.' },
      { n: 'It takes a tiny bottle of dew, drinks one drop, shivers, and practises what it is going to say.' },
    ] },
    { screen: 'quiz', id: 'Fluesvampen', variant: 'replay', keep: true, title: 'Fluesvampen', sub: 'Den øver sig.', rounds: REPLAY },
    { screen: 'panel', scene: 'nat', cast: ['flue'], lines: [
      { n: 'It drinks one more drop. Then it goes over the dune, towards your bed.' },
    ] },

    // ===== 3 · Puklen
    { screen: 'card', ch: 3, title: 'Nat 10', sub: 'Puklen', music: 'calm' },
    { screen: 'panel', scene: 'lejr', cast: ['kamel', 'kaktus'], lines: [
      { n: 'Inspection tomorrow. The camel must empty his humps. He has not emptied them in eleven years.' },
      L('kamel', 'Vi smider ikke noget ud.', "We don't throw anything out."),
    ] },
    lesson({ who: 'kamel', scene: 'pukkel', title: 'Den røde sofa', say: { da: 'Den gamle kommode. Ikke en gammel kommode. MIN gamle kommode.', en: 'The old chest of drawers. Not an old one. MY old chest of drawers.' },
      rule: 'After den / det / de and after min / mit / mine, the adjective ends in -e: den røde sofa, det røde bord, de røde stole, mit røde skab. Not blå, grå, orange, lilla. lille → små in the plural.',
      ex: ['den rød[e] sofa', 'det rød[e] bord – ikke rødt!', 'de [små] stole', 'mit gaml[e] bord'],
      try: { e: '🪑', col: 'brun', q: 'Kamelen peger:', right: 'den brune stol', wrong: ['den brun stol', 'det brune stol'], why: 'After den: brun → brune.' } }),
    { screen: 'panel', scene: 'nat', cast: ['flue'], music: 'tense', lines: [
      { n: 'That night you are so dry that you crack when you turn over. The mushroom is already there.' },
      L('flue', 'Du er helt tør, fætter. Én dråbe dug, og du er blød igen.', 'You are completely dry, cousin. One drop of dew, and you are soft again.'),
    ] },
    { screen: 'choice', scene: 'nat', cast: ['flue'], who: 'svampen', prompt: 'Svar:', options: [
      { da: 'Nej tak.', set: { drank1: false } },
      { da: 'Ja tak.', set: { drank1: true } },
      { en: '(EN) No, thanks.', set: { drank1: false } },
    ] },
    { screen: 'panel', scene: 'nat', cast: ['flue'], lines: [
      (st) => (st.flags.drank1
        ? [{ n: 'One drop. You go soft all over. The stars turn green, then pink. It feels very good. That is the problem.' }, { th: 'The camel\'s furniture is going to look very strange tomorrow.' }]
        : [{ n: 'You say no. You crack a little more. The mushroom shrugs, which for a mushroom is mostly the cap.' }, { th: 'Dry is a skill. I am bad at it. I am doing it anyway.' }]),
    ] },
    { screen: 'quiz', replay: true, id: 'Puklen', variant: 'puklen', title: 'Puklen', sub: 'Alt skal ud. Kamelen er ikke glad.', n: 6, rounds: PUKLEN },
    { screen: 'panel', scene: 'lejr', cast: ['kamel', 'flue'], lines: [
      { n: 'The mushroom has come to watch the inspection. In the heat it is sweating red.' },
      L('kamel', 'Du drypper.', 'You are dripping.'),
      { n: 'The camel pulls a towel out of his hump and wipes the mushroom\'s cap. Where he wipes, it is white.' },
      L('kamel', 'Den er hvid indeni.', 'It is white inside.'),
      { th: 'The dealer is not red. The dealer is wearing red. Somebody sold it the dew first.' },
      { n: 'At the very bottom of the empty hump: a tiny oasis. A red cap floats in it. On the water, in white dots, your name: SVAMPEN.' },
    ] },

    // ===== 4 · Trippet
    { screen: 'card', ch: 4, title: 'Nat 17', sub: 'Trippet', music: 'trip' },
    { screen: 'panel', scene: 'trip', cast: ['flue', 'firben'], lines: [
      { n: 'Spores drift over the camp every night now, more each time. Tonight there are so many that the desert floor turns slowly into colour, like a carpet being pulled.' },
      L('flue', 'Bliv i farverne. Jeg passer på dig.', 'Stay in the colours. I will look after you.'),
    ] },
    { screen: 'choice', scene: 'trip', cast: ['flue'], who: 'svampen', prompt: 'Svar:', options: [
      { da: 'Nej tak.', set: { stayed2: false } },
      { da: 'Ja tak.', set: { stayed2: true } },
      { en: '(EN) No.', set: { stayed2: false } },
    ] },
    { screen: 'panel', scene: 'trip', cast: ['flue', 'firben'], lines: [
      (st) => (st.flags.stayed2
        ? [{ n: 'You stay. Everything is lilla, and it is wonderful, and it is lilla.' }]
        : [{ n: 'You say no. Behind you, the lizard says yes. He is already halfway in.' }, { th: 'I go in after him. Of course I do.' }]),
    ] },
    lesson({ who: 'flue', scene: 'trip', title: 'Mærkelige adjektiver', say: { da: 'Lilla er altid lilla. Det er det eneste, der ikke ændrer sig.', en: 'Lilla is always lilla. It is the only thing that does not change.' },
      rule: 'orange and lilla never change. blå and grå: et blåt, but de blå (no -e). lille → små in the plural. gammel → gamle and lækker → lækre lose an e.',
      ex: ['en lilla kjole · et lilla tæppe · de lilla puder', 'de [blå] puder', 'de [små] stole', 'den gaml[e] kommode · de lækr[e] puder'],
      try: { e: '🪑', col: 'orange', q: 'De ___ stole.', hint: 'small', right: 'små', wrong: ['lille', 'småe'], why: 'lille → små in the plural.' } }),
    { screen: 'trippet', replay: true, id: 'Trippet', title: 'Farverne', sub: 'Tryk kun på det, der er sandt.', need: 6, pairs: TRIPPET },
    { screen: 'panel', scene: 'trip', cast: ['flue'], lines: [
      { n: 'The anchors hold. The colours stop spinning. You are looking down at the camp from very high up.' },
      { n: 'From your bed a trail of tiny white dots runs to every other bed. The scorpion\'s. The lizard\'s. The camel\'s.' },
      { th: 'The damp patch. My name in the water. It is me. I soak the spores up by day and sweat them out at night.' },
      L('flue', 'Velkommen i familien, fætter.', 'Welcome to the family, cousin.'),
    ] },

    // ===== 5 · Gruppen
    { screen: 'card', ch: 5, title: 'Nat 23', sub: 'Gruppen', music: 'calm' },
    { screen: 'panel', scene: 'lejr', cast: ['kaktus', 'skorpion', 'firben', 'kamel'], mood: { firben: 'tint' }, lines: [
      { n: 'Group circle. The scorpion is back. One white dot left. He moves very carefully.' },
      (st) => ({ n: st.flags.stayed2 ? 'You are still a little lilla at the edges. The lizard has turned lilla too, to keep you company, or out of habit.' : 'The lizard is still lilla from the trip. He keeps apologising to his own tail.' }),
    ] },
    lesson({ who: 'kaktus', scene: 'lejr', title: 'Kan du det?!', say: { da: 'Jeg kan godt lide den gule sofa. Kan du det?! Det kan jeg også.', en: 'I like the yellow sofa. Do you?! So do I.' },
      rule: 'Surprised? Repeat the verb as a short question, positive stays positive (det), negative stays negative (ikke): Kan du det?! · Er du ikke?! · Synes du det?! Agree: også after something positive, heller ikke after something negative.',
      ex: ['Jeg er vild med de blå puder. – Er du det?!', 'Jeg kan ikke lide det grå skab. – Kan du ikke?!', 'Jeg er træt af min gamle sofa. – Det er jeg [også].', 'Jeg er ikke så vild med de stribede gardiner. – Det er jeg [heller ikke].'],
      try: { q: 'Jeg kan godt lide lilla. 🤝', right: 'Det kan jeg også.', wrong: ['Det kan jeg heller ikke.', 'Det er jeg også.'], why: 'Positive + kan → Det kan jeg også.' } }),
    { screen: 'quiz', replay: true, id: 'Gruppen', variant: 'gruppen', keep: true, title: 'Gruppen', sub: 'Alle siger, hvad de synes.', rounds: GRUPPEN },
    { screen: 'choice', scene: 'lejr', cast: ['kaktus', 'skorpion', 'firben', 'kamel'], who: 'svampen', prompt: 'Det er din tur.', options: [
      { da: 'Det er mig. Det er mine sporer.', set: { confessed: true } },
      { da: 'Ingenting.', set: { confessed: false } },
      { en: '(EN) Nothing.', set: { confessed: false } },
    ] },
    { screen: 'panel', scene: 'lejr', cast: ['kaktus', 'flue'], lines: [
      (st) => (st.flags.confessed
        ? [L('kaktus', 'Det ved vi godt.', 'We know.'), { n: 'Everyone has a white dot somewhere. Nobody moves away from you.' }]
        : [{ n: 'You say nothing. Nobody asks. Everyone has a white dot somewhere.' }]),
      { n: 'Then the mushroom comes over the dune and sits down in the circle without asking. Its red is smudged.' },
      L('kaktus', 'Du er ikke rød.', 'You are not red.'),
      { n: 'It does not answer. It stays.' },
      L('firben', 'Hvor længe har du været tør, Kaktus?', 'How long have you been dry, Cactus?'),
      L('kaktus', 'Tre hundrede år. Jeg er en kaktus. Det er ikke så svært.', 'Three hundred years. I am a cactus. It is not that hard.'),
      { n: 'Behind the dune the mushroom\'s bottles burst in the heat, one after another. A cloud of spores rises over the camp. It will come down on the last night.' },
      L('kaktus', 'Den sidste nat suger du det hele op. Og så vrider vi dig. Alle sammen.', 'On the last night you soak it all up. And then we wring you out. All of us.'),
      { th: 'A plan. It is a terrible plan. It is the only one with me in it.' },
    ] },

    // ===== 6 · Opsugningen
    { screen: 'card', ch: 6, title: 'Nat 30', sub: 'Opsugningen', music: 'tense' },
    { screen: 'panel', scene: 'nat', cast: ['kaktus', 'kamel', 'firben', 'skorpion'], lines: [
      { n: 'The cloud comes down. The group takes a corner of you each. You are going to soak it all up, and they are going to hold on.' },
    ] },
    lesson({ who: 'kamel', scene: 'nat', title: 'For stor', say: { da: 'Mine pukler er lidt for store.', en: 'My humps are a bit too big.' },
      rule: 'for + adjective = too. lidt for = a bit too, alt for = far too. The adjective still agrees: Den er for stor. Det er for stort. De er for store.',
      ex: ['Den er lidt for stor.', 'Det er alt for stor[t].', 'De er lidt for [små].', 'Skabet er alt for stor[t].'],
      try: { e: '🛋️', col: 'roed', q: 'Sofaen er ___.', hint: 'far too big', right: 'alt for stor', wrong: ['alt for stort', 'alt for store'], why: 'en sofa → stor, no ending.' } }),
    { screen: 'quiz', replay: true, id: 'Opsugningen', variant: 'review', title: 'Opsugningen', sub: 'Hvert rigtigt svar suger en sky op.', n: 5, rounds: REVIEW },
    { screen: 'panel', scene: 'nat', cast: ['flue'], lines: [
      { n: 'You are heavy, full, wet with spores. Dots are blooming on your skin. The mushroom leans in, very quietly.' },
      L('flue', 'Du kan blive blød. For altid. Så skal du aldrig tælle nætter igen.', 'You can be soft. Forever. Then you never have to count nights again.'),
    ] },
    { screen: 'choice', scene: 'nat', cast: ['flue', 'kaktus'], who: 'svampen', prompt: 'Svar:', options: [
      { da: 'Nej tak. Jeg vil være tør.', set: { final: false } },
      { da: 'Ja tak.', set: { final: true } },
      { en: '(EN) No. I want to be dry.', set: { final: false } },
    ] },
    { screen: 'act', do: 'ranks' },
    { screen: 'panel', scene: 'ude', cast: ['kaktus', 'flue'], music: 'happy', lines: [(st) => K.epilogue(st)] },
  ];

  K.epilogue = function (st) {
    const e = K.endingOf(st);
    if (e === K.ENDINGS.blomstret) return [
      { n: 'You bloom. You keep blooming. By morning you are the size of a dune, and the desert is every colour there is.' },
      { n: 'Everyone is very happy. Nobody can find the way home. Nobody can say what colour anything is.' },
      { n: 'The cactus is watering a dune.' },
      L('kaktus', 'Nå.', 'Well.'),
    ];
    const cork = { n: 'The lizard takes the wooden T off his head and corks the last bottle of dew with it.' };
    if (e === K.ENDINGS.hvid) return [
      cork,
      { n: 'They wring you out together. Spores and dew run into the sand and stay there.' },
      { n: 'Next season. A new group circle. A small white mushroom sits in it.' },
      L('flue', 'Hej. Jeg hedder Fluesvampen. Jeg har været tør i tre uger.', 'Hi. My name is Fluesvampen. I have been dry for three weeks.'),
      L('gruppen', 'Hej, Fluesvampen.', 'Hi, Fluesvampen.'),
    ];
    if (e === K.ENDINGS.toerlagt) return [
      cork,
      { n: 'They wring you out together. It hurts in a dull, sensible way.' },
      { n: 'You walk out of the Dry Kingdom light, dry and slightly crunchy. A vulture is waiting.' },
      L('grib', 'Sidste stop. Igen.', 'Last stop. Again.'),
    ];
    return [
      cork,
      { n: 'They wring you out together. You leave dry. Three small white dots stay on your side and do not wash off.' },
      L('kaktus', 'Vi ses næste år. De fleste kommer igen.', 'See you next year. Most come back.'),
    ];
  };

  // ---------- glossary (every Danish word on screen)
  K.DICT = {
    en: 'a (en-word)', et: 'a (et-word)', nogle: 'some', den: 'it / the (en-word)', det: 'it / the (et-word)', de: 'they / the (plural)', min: 'my (en-word)', mit: 'my (et-word)', mine: 'my (plural)',
    ja: 'yes', nej: 'no', tak: 'thanks', ikke: 'not', og: 'and', jeg: 'I', du: 'you', dig: 'you (object)', han: 'he', vi: 'we', er: 'is / are', har: 'have / has', kan: 'can', skal: 'shall, must', vil: 'want to',
    her: 'here', der: 'there / that', så: 'then / so', jo: 'after all, you know', begge: 'both', også: 'also, too', heller: 'either (heller ikke = not … either)', altid: 'always', aldrig: 'never', igen: 'again', bare: 'just', én: 'one (stressed)', ét: 'one (stressed)',
    hej: 'hi', velkommen: 'welcome', til: 'to', sidste: 'last', stop: 'stop', ingen: 'no (none)', dug: 'dew', svamp: 'sponge / mushroom', svampe: 'sponges / mushrooms', svampen: 'the sponge / the mushroom', fætter: 'cousin',
    tørkeriget: 'the Dry Kingdom (invented)', lejren: 'the camp', nat: 'night', ankomst: 'arrival', sikke: 'what a …!', hvor: 'how / where', mærkelige: 'strange', adjektiver: 'adjectives', adjektiv: 'adjective', farver: 'colours', farverne: 'the colours',
    hat: 'hat', kasket: 'cap', tørklæde: 'scarf', tørklædet: 'the scarf', sokker: 'socks', slips: 'tie', slipset: 'the tie', kjole: 'dress', bukser: 'trousers', jakke: 'jacket', sko: 'shoes', t: 'the letter t',
    sofa: 'sofa', sofaen: 'the sofa', skab: 'cupboard', skabet: 'the cupboard', stol: 'chair', stole: 'chairs', stolene: 'the chairs', lampe: 'lamp', seng: 'bed', lænestol: 'armchair', kommode: 'chest of drawers', bord: 'table', tæppe: 'rug, blanket', puder: 'cushions', gardiner: 'curtains', pukler: 'humps', puklen: 'the hump',
    rød: 'red', rødt: 'red (et-form)', røde: 'red (-e form)', grøn: 'green', grønt: 'green (et-form)', grønne: 'green (-e form)', gul: 'yellow', gult: 'yellow (et-form)', gule: 'yellow (-e form)', blå: 'blue (no -e)', grå: 'grey (no -e)', hvid: 'white', hvidt: 'white (et-form)', hvide: 'white (-e form)', sort: 'black', sorte: 'black (-e form)', brun: 'brown', brune: 'brown (-e form)', orange: 'orange (never changes)', lilla: 'purple (never changes)', stribet: 'striped', stribede: 'striped (-e form)',
    pæn: 'nice, pretty', pænt: 'nice (et-form)', pæne: 'nice (-e form)', flot: 'fine, good-looking', flotte: 'fine (-e form)', smart: 'smart', smarte: 'smart (-e form)', lækker: 'lovely', lækkert: 'lovely (et-form)', lækre: 'lovely (-e form)', gammel: 'old', gamle: 'old (-e form)', lille: 'small', små: 'small (plural)', stor: 'big', stort: 'big (et-form)', store: 'big (-e form)', grimt: 'ugly (et-form)',
    'ørkenen': 'the desert', op: 'up (suge op = soak up)', inde: 'inside', natten: 'the night', altid: 'always (for altid = forever)', 'tørlagt': 'dried out / sober', blomstret: 'bloomed', tilbagefald: 'relapse', kommer: 'come(s)', hvidt_: '',
    vrider: 'wring(s)', sammen: 'together (alle sammen = all of us)', hele: 'whole (det hele = all of it)',
    eneste: 'only (det eneste = the only thing)', 'ændrer': 'change(s) (ændrer sig = changes)', sig: 'say! / oneself', noget: 'something', om: 'about', gang: 'time (én gang = once)', hvad: 'what', siger: 'say(s)', sige: 'say', peger: 'point(s)', på: 'on', sin: 'his/her own',
    købt: 'bought', købe: 'buy', køber: 'buy(s)', lige: 'just', vil: 'want(s)', have: 'have', mere: 'more', fået: 'had, got', for: 'for / too', mange: 'many', øver: 'practise(s)', sig_: '',
    hvid_: '', indeni: 'inside', drypper: 'drip(s)', smider: 'throw(s)', ud: 'out', alt: 'everything / far (alt for = far too)', glad: 'happy', helt: 'completely', tør: 'dry', dråbe: 'drop', blød: 'soft', bliv: 'stay!', blive: 'become, stay', passer: 'look(s) after (passe på)', familien: 'the family', i: 'in',
    kun: 'only', tryk: 'tap!', sandt: 'true', lidt: 'a little', synes: 'think(s) (opinion)', godt: 'well (kan godt lide = like)', lide: 'like (kan lide)', vild: 'wild (vild med = crazy about)', med: 'with', træt: 'tired (træt af = tired of)', af: 'of', so: '',
    alle: 'everyone', tur: 'turn', mig: 'me', sporer: 'spores', ingenting: 'nothing', ved: 'know(s)', rød_: '', længe: 'long (time)', været: 'been', kaktus: 'cactus', tre: 'three', hundrede: 'hundred', år: 'year(s)', svært: 'difficult',
    hvert: 'every (et-word)', rigtigt: 'right, correct', svar: 'answer', suger: 'suck(s), soak(s)', sky: 'cloud', altså: 'so, really', siger_: '', tælle: 'count', nætter: 'nights', altid_: '', vær: 'be!', være: 'be', ude: 'outside',
    hedder: 'is called', uger: 'weeks', ses: 'see each other (vi ses = see you)', næste: 'next', fleste: 'most', gør: 'do(es)', hej_: '',
    præcis: 'exactly', av: 'ouch', ja_: '', nå: 'well, oh', bunken: 'the pile', tom: 'empty', anden: 'other', side: 'side', set: 'seen', fra: 'from', opsugningen: 'the soaking-up', gruppen: 'the group', komplimenter: 'compliments', trippet: 'the trip',
    firbenet: 'the lizard', kamelen: 'the camel', skorpionen: 'the scorpion', kaktussen: 'the cactus', fluesvampen: 'the red mushroom (a character)', gribben: 'the vulture', dit: 'your (et-word)', dine: 'your (plural)', din: 'your', lektion: 'lesson',
    videre: 'onwards', fortsæt: 'continue', begynd: 'begin', forfra: 'from the start', indstillinger: 'settings', kapitler: 'chapters', låst: 'locked', test: 'test', stemmen: 'the voice', høre: 'hear',
  };
  Object.keys(K.DICT).forEach((k) => { if (!K.DICT[k]) delete K.DICT[k]; });
  K.NAMES = [];
})(window.K = window.K || {});
