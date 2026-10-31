// TØRLAGT · DEL 2: TUEN. SPOILERS. Chapters 7–14, after the ending of part 1. Open end (to be continued).
// Grammar from Bruno's workbook pages (own sentences, nothing copied): plural groups, adjective + plural,
// en/et + definite plural, imperative / infinitive / present (+ -re/-rer), past -ede/-te, modal verbs,
// time prepositions, da/når and hvis/om. Creatures only; invented places; adult themes kept dry and non-explicit.
(function (K) {
  'use strict';
  const L = (w, da, en) => ({ w, da, en });
  const lesson = (o) => Object.assign({ screen: 'lesson', replay: true }, o);

  Object.assign(K.CAST, {
    formand: { name: 'Formanden', e: '🐜', color: '#b5582e', pitch: 1.4 },
    myre: { name: 'En myre', e: '🐜', color: '#c0703f', pitch: 1.6 },
    dronning: { name: 'Dronningen', e: '🐜👑', color: '#e0a92e', pitch: 0.8 },
    han: { name: 'En han', e: '🐜💨', color: '#9b7bd1', pitch: 1.2 },
    betjent: { name: 'Betjenten', e: '🪲', color: '#3f6e8c', pitch: 0.9 },
    bi: { name: 'Bien', e: '🐝', color: '#f2c230', pitch: 1.3 },
    dommer: { name: 'Dommeren', e: '🐢', color: '#6f8f4e', pitch: 0.6 },
    tusind: { name: 'Tusindbenet', e: '🐛', color: '#8fc04a', pitch: 1.5 },
  });
  Object.assign(K.SCENES, {
    tue: { from: '#c9772f', to: '#3a1d0c', label: 'Tuen' },
    kammer: { from: '#f2c66b', to: '#6b3a10', label: 'Dronningens kammer' },
    celle: { from: '#3b3f47', to: '#101215', label: 'Cellen' },
    bar: { from: '#5b2a6e', to: '#1c0c22', label: 'Nektarbaren' },
    ret: { from: '#6b4a33', to: '#1d1712', label: 'Retten (i en gammel støvle)' },
    station: { from: '#1d2a52', to: '#070a16', label: 'Stationen' },
    tog: { from: '#3a1f5c', to: '#0c0716', label: 'Nattoget' },
    kaffehav: { from: '#8a5a32', to: '#2a160a', label: 'Endestation' },
  });
  K.CHAPTERS.push(
    { title: 'Tuen', topic: 'flertal: -er, -e, ingenting' },
    { title: 'Dronningen', topic: 'adjektiv + flertal' },
    { title: 'Kronen', topic: 'en af / et af · bestemt flertal' },
    { title: 'Forhøret', topic: 'kom! / komme / kommer · -re / -rer' },
    { title: 'I går aftes', topic: 'datid: -ede / -te' },
    { title: 'Retten', topic: 'må, vil, skal, kan' },
    { title: 'Tusindbenet', topic: 'tid: på, om, i, for … siden' },
    { title: 'Brevet', topic: 'da / når · hvis / om' },
  );

  // ---------- content
  const G = ['+er / +r', '+e', 'ingen endelse'];
  const n = (e, sg, pl, g) => ({ e, prompt: `${sg} – to …?`, right: G[g], wrong: G.filter((x, i) => i !== g), why: `${sg} → to ${pl}` });
  const KASSER = [
    n('🚌', 'en bus', 'busser', 0), n('🐟', 'en fisk', 'fisk', 2), n('🐱', 'en kat', 'katte', 1), n('🐶', 'en hund', 'hunde', 1),
    n('🪟', 'et vindue', 'vinduer', 0), n('🐭', 'en mus', 'mus', 2), n('🐴', 'en hest', 'heste', 1), n('🏠', 'et hus', 'huse', 1),
    n('🥄', 'en ske', 'skeer', 0), n('🚲', 'en cykel', 'cykler', 0), n('🍞', 'et brød', 'brød', 2), n('🚢', 'et skib', 'skibe', 1),
    n('🥒', 'en agurk', 'agurker', 0), n('🐦', 'en fugl', 'fugle', 1), n('🍌', 'en banan', 'bananer', 0), n('✈️', 'et fly', 'fly', 2),
    n('🔪', 'en kniv', 'knive', 1), n('🎟️', 'en billet', 'billetter', 0), n('🏝️', 'en ø', 'øer', 0), n('🪨', 'en sten', 'sten', 2),
    n('🐾', 'et dyr', 'dyr', 2), n('📅', 'et år', 'år', 2),
    Object.assign(n('👑', 'en krone', 'kroner', 0), { must: true, who: 'formand', say: 'Den her skal op til dronningen. Pas godt på den.' }),
  ];

  const give = (e, offer, right, wrong, why) => ({ e, who: 'han', say: offer, prompt: 'Dronningen: Jeg vil have to!', right, wrong, why });
  const one = (e, offer, right, wrong, why) => ({ e, who: 'han', say: offer, prompt: 'Dronningen: Jeg vil kun have én!', right, wrong, why });
  const PARADE = [
    give('🚗', 'Jeg giver dig en ny bil.', 'to nye biler', ['to ny biler', 'to nye bil'], 'Plural: ny → nye, bil → biler.'),
    give('🛏️', 'Jeg giver dig en bred seng.', 'to brede senge', ['to bred senge', 'to brede seng'], 'Plural: bred → brede, seng → senge.'),
    give('🍰', 'Jeg giver dig en lækker kage.', 'to lækre kager', ['to lækker kager', 'to lækre kage'], 'lækker → lækre (it drops an e).'),
    give('🌳', 'Jeg giver dig et højt træ.', 'to høje træer', ['to højt træer', 'to høje træ'], 'Plural: høj → høje (not -t), træ → træer.'),
    give('🏨', 'Jeg giver dig et flot hotel.', 'to flotte hoteller', ['to flot hoteller', 'to flotte hotel'], 'flot → flotte; hotel → hoteller.'),
    give('🧢', 'Jeg giver dig en smart kasket.', 'to smarte kasketter', ['to smart kasketter', 'to smarte kasket'], 'smart → smarte; kasket → kasketter.'),
    give('📺', 'Jeg giver dig et brugt fjernsyn.', 'to brugte fjernsyn', ['to brugt fjernsyn', 'to brugte fjernsyner'], 'brugt → brugte; fjernsyn has no plural ending.'),
    one('🐱', 'Jeg giver dig to grå katte.', 'en grå kat', ['en grå katte', 'et grå kat'], 'Singular: en kat. grå never gets -e.'),
    one('🏢', 'Jeg giver dig to smarte kontorer.', 'et smart kontor', ['en smart kontor', 'et smarte kontor'], 'et kontor: smart (already ends in t).'),
    one('🐄', 'Jeg giver dig to brune køer.', 'en brun ko', ['en brune ko', 'et brun ko'], 'en ko: brun, no ending.'),
    one('🔒', 'Jeg giver dig to sikre låse.', 'en sikker lås', ['en sikre lås', 'et sikkert lås'], 'en lås: sikker.'),
    one('🏝️', 'Jeg giver dig to små øer.', 'en lille ø', ['en små ø', 'et lille ø'], 'en ø; små → lille in the singular.'),
  ];

  const SPOR = [
    ['en af stolene', 'et af stolene', '🪑'], ['et af bordene', 'en af bordene', '🍽️'], ['et af vinduerne', 'en af vinduerne', '🪟'],
    ['en af kagerne', 'et af kagerne', '🍰'], ['et af glassene', 'en af glassene', '🥛'], ['en af knivene', 'et af knivene', '🔪'],
    ['kagerne', 'kagene', '🍰'], ['stolene', 'stolerne', '🪑'], ['hotellerne', 'hotelerne', '🏨'],
    ['børnene', 'barnene', '🍼'], ['bordene', 'borderne', '🍽️'], ['vinduerne', 'vinduene', '🪟'],
  ];

  const v3 = (q, forms, k, why, hint) => ({ who: 'betjent', prompt: q, right: forms[k], wrong: forms.filter((x, i) => i !== k), why, hint });
  const FORHOER = [
    v3('Jeg kan ikke ___ i morgen.', ['kom', 'komme', 'kommer'], 1, 'After kan: the infinitive.'),
    v3('Hun ___ i morgen.', ['kom', 'komme', 'kommer'], 2, 'Subject + verb now: present (-r).'),
    v3('___ her og hjælp mig!', ['Kom', 'Komme', 'Kommer'], 0, 'An order: the imperative (the stem).'),
    v3('Gider du ___ to minutter?', ['vent', 'vente', 'venter'], 1, 'After gider du: the infinitive.'),
    v3('Hvem ___ du på?', ['vent', 'vente', 'venter'], 2, 'A question in the present: venter.'),
    v3('___ lige min taske!', ['Tag', 'Tage', 'Tager'], 0, 'An order: tag!'),
    v3('Han tør ikke ___ bussen.', ['tag', 'tage', 'tager'], 1, 'After tør: the infinitive.'),
    v3('Hvorfor ___ du ikke døren?', ['åbn', 'åbne', 'åbner'], 2, 'A question in the present: åbner.'),
    v3('Du må ikke ___ ved mine ting.', ['rør', 'røre', 'rører'], 1, 'After må: the infinitive. -re, not -rer.'),
    v3('Hun ___ aldrig ulovligt.', ['parker', 'parkere', 'parkerer'], 2, 'Present: parkerer (-rer).'),
    v3('Det er svært at ___ her.', ['parker', 'parkere', 'parkerer'], 1, 'After at: the infinitive (-re).'),
    v3('Vi sidder og ___ problemet.', ['diskuter', 'diskutere', 'diskuterer'], 2, 'sidder og diskuterer: both in the present.'),
  ];

  const past = (q, right, wrong, why) => ({ who: 'bi', say: q, prompt: 'I går …', right, wrong, why });
  const AFTEN = [
    past('Du danser med alle hannerne.', 'Du dansede med alle hannerne.', ['Du danste med alle hannerne.', 'Du dansde med alle hannerne.'], 'danse → dansede (-ede).'),
    past('Du spiser fire kager.', 'Du spiste fire kager.', ['Du spisede fire kager.', 'Du spist fire kager.'], 'spise → spiste (-te).'),
    past('Du smiler til dronningen.', 'Du smilede til dronningen.', ['Du smilte til dronningen.', 'Du smild til dronningen.'], 'smile → smilede (-ede).'),
    past('Du taler med hende om sukker.', 'Du talte med hende om sukker.', ['Du taltede med hende om sukker.', 'Du tale med hende om sukker.'], 'tale → talte (-te).'),
    past('Hun låner dig sin krone.', 'Hun lånte dig sin krone.', ['Hun lånede dig sin krone.', 'Hun lånt dig sin krone.'], 'låne → lånte (-te).'),
    past('Du prøver den på.', 'Du prøvede den på.', ['Du prøvte den på.', 'Du prøvet den på.'], 'prøve → prøvede (-ede).'),
    past('Hun ringer efter mere sukker.', 'Hun ringede efter mere sukker.', ['Hun ringed efter mere sukker.', 'Hun ringet efter mere sukker.'], 'ringe → ringede (-ede).'),
    past('Du glemmer alt.', 'Du glemte alt.', ['Du glemmede alt.', 'Du glemt alt.'], 'glemme → glemte (-te).'),
    past('Bien kører dig hjem.', 'Bien kørte dig hjem.', ['Bien kørede dig hjem.', 'Bien kørt dig hjem.'], 'køre → kørte (-te).'),
    past('Dronningen lukker baren.', 'Dronningen lukkede baren.', ['Dronningen lukte baren.', 'Dronningen lukket baren.'], 'lukke → lukkede (-ede).'),
  ];

  const RETTEN = [
    { e: '⚖️', en: 'You must answer.', answers: ['Du skal svare', 'Du må svare'], traps: ['at', 'vil'], drunk: 'svarer', end: '.', why: 'skal + infinitive, no "at".' },
    { e: '🤥', en: 'You must not lie.', answers: ['Du må ikke lyve', 'Du skal ikke lyve'], traps: ['at', 'vil'], drunk: 'lyver', end: '.', why: 'må ikke = must not.' },
    { e: '🔍', en: 'Can you prove it?', answers: ['Kan du bevise det'], traps: ['at', 'vil'], drunk: 'beviser', end: '?', why: 'Question: the verb first. kan + infinitive.' },
    { e: '🗣️', en: 'Do you want to say something?', answers: ['Vil du sige noget'], traps: ['at', 'skal'], drunk: 'siger', end: '?', why: 'vil = want to.' },
    { e: '🍬', en: 'The queen wants to keep the sugar.', answers: ['Dronningen vil beholde sukkeret'], traps: ['at', 'kan'], drunk: 'beholder', end: '.', why: 'vil + infinitive.' },
    { e: '🤷', en: "I can't remember it.", answers: ['Jeg kan ikke huske det', 'Det kan jeg ikke huske', 'Jeg husker det ikke', 'Det husker jeg ikke'], traps: ['at', 'må'], drunk: 'huskede', end: '.', why: 'kan ikke + infinitive. "Det kan jeg ikke huske" is also right.' },
  ];

  // the train windows: true time phrases drift past, with their wrong twins
  const VINDUER = [
    ['i aften', 'om aften', '🌆'], ['for tre dage siden', 'i tre dage siden', '📅'], ['ved syvtiden', 'i syvtiden', '🕖'],
    ['i fredags', 'på fredags', '🗓️'], ['om sommeren', 'om sommer', '☀️'], ['i år', 'om år', '📆'],
    ['for en uge siden', 'om en uge siden', '⏪'], ['på mandag', 'om mandag', '🚃'], ['om morgenen', 'i morgenen', '🌅'],
  ];
  // the reply letter: build it from tiles (da / når / hvis / om, with inversion after a fronted clause)
  const SVAR = [
    { e: '🌊', en: 'When I was small, I lived in the sea.', answers: ['Da jeg var lille, boede jeg i havet', 'Jeg boede i havet, da jeg var lille'], traps: ['når', 'om'], end: '.', why: 'Once, in the past: da. After the da-clause the verb comes first: boede jeg.' },
    { e: '🌧️', en: 'When it rains, I get happy.', answers: ['Når det regner, bliver jeg glad', 'Jeg bliver glad, når det regner'], traps: ['at', 'om'], end: '.', why: 'Every time: når. Then inversion: bliver jeg.' },
    { e: '✉️', en: 'If you want, you can write again.', answers: ['Hvis du vil, kan du skrive igen', 'Du kan skrive igen, hvis du vil'], traps: ['om', 'at'], end: '.', why: 'A condition: hvis. Then inversion: kan du.' },
    { e: '❓', en: "I don't know if you are red.", answers: ['Jeg ved ikke, om du er rød', 'Om du er rød, ved jeg ikke'], traps: ['hvis', 'når'], end: '.', why: 'Whether, after "ved ikke": om.' },
    { e: '🤔', en: 'I ask myself whether you miss me.', answers: ['Jeg spørger mig selv, om du savner mig'], traps: ['hvis', 'at'], end: '.', why: 'Whether, after "spørger": om.' },
  ];


  // ---------- the flow of part 2
  const sc = (st, id) => ((st.tally || {})[id] || { ok: 0 }).ok;
  const sour = (w, da, en) => [L(w, da, en)];
  const prev = (st) => {
    const p = st.flags.prev;
    if (p === K.ENDINGS.blomstret) return { n: 'Still slightly mushroom-shaped, you flag down the vulture taxi. You want to go home: to the sea.' };
    if (p === K.ENDINGS.tilbagefald) return { n: 'Three white dots, one vulture taxi, one long flight. You want to go home: to the sea.' };
    return { n: 'Dry, light and slightly crunchy, you climb into the vulture taxi. You want to go home: to the sea.' };
  };
  const P2 = [
    // ===== 7 · Tuen (plural groups)
    { screen: 'card', ch: 7, part2: true, title: 'Del 2', sub: 'Tuen', music: 'happy' },
    { screen: 'panel', scene: 'tue', cast: ['grib', 'formand'], lines: [
      (st) => prev(st),
      L('grib', 'Havet? Det er ikke min rute. Du kan stå af her.', 'The sea? That is not my route. You can get off here.'),
    ] },
    lesson({ who: 'formand', scene: 'tue', title: 'Flertal: -er, -e eller ingenting', say: { da: 'En bil, to biler. En stol, to stole. En fisk, to fisk. Her tæller vi alt.', en: 'One car, two cars. One chair, two chairs. One fish, two fish. Here we count everything.' },
      rule: 'The plural has three main groups: +er / +r (bil → biler, kvinde → kvinder), +e (stol → stole, hund → hunde), or no ending (fisk → fisk, år → år). Learn the plural together with the word.',
      ex: ['en bil – to bil[er]', 'en stol – to stol[e]', 'en fisk – to fisk', 'et vindue – to vindue[r]'],
      try: { e: '🐶', q: 'En hund, to ___.', right: 'hunde', wrong: ['hunder', 'hund'], why: 'hund → hunde (+e).' } }),
    { screen: 'choice', scene: 'tue', cast: ['formand'], who: 'svampen', prompt: 'Formanden: Vil du have en kop kaffe? Her sover vi aldrig.', options: [
      { da: 'Nej, jeg drikke ikke kaffe.', set: { kaffe: true, misKaffe: true } },
      { da: 'Ja tak.', set: { kaffe: true } },
      { da: 'Nej tak.', set: { kaffe: false } },
      { en: '(EN) No, thanks.', set: { kaffe: false }, after: sour('formand', 'Dansk, tak. Vi har travlt.', 'Danish, please. We are busy.') },
    ] },
    { screen: 'panel', scene: 'tue', cast: ['formand'], lines: [
      (st) => (st.flags.misKaffe ? [{ n: '"Drikke" without the -r. The foreman only hears "kaffe". You get a cup the size of a bucket.' }] : []),
      (st) => (st.flags.kaffe
        ? { n: 'You soak up the whole cup at once. Every pore vibrates. You are given the night shift: everything the ants carry in goes into the right crate.' }
        : { n: 'The foreman drinks your cup as well. You are given the night shift: everything the ants carry in goes into the right crate.' }),
    ] },
    { screen: 'quiz', replay: true, id: 'Kasserne', variant: 'scene', cast: ['formand'], pileWrong: '📦', fixed: G, n: 8, title: 'Kasserne', sub: 'Hvilken kasse? Forkerte kasser lander på Formanden.', rounds: KASSER },
    { screen: 'panel', scene: 'tue', cast: ['myre'], lines: [
      (st) => ({ n: sc(st, 'Kasserne') >= 6 ? 'The foreman, dusted with coffee, nods at you. From an ant, that is a medal.' : 'The foreman crawls out from under a pile of wrong crates and says nothing, very loudly.' }),
      L('myre', 'Dronningen vil se svampen. Nu.', 'The queen wants to see the sponge. Now.'),
    ] },

    // ===== 8 · Dronningen (adjective + plural, both ways)
    { screen: 'card', ch: 8, title: 'Dronningens kammer', sub: 'Kapitel 8', music: 'calm' },
    { screen: 'panel', scene: 'kammer', cast: ['dronning', 'han'], lines: [
      { n: 'The queen is enormous, sticky and eating sugar out of a bucket. She wears the crown you sorted last night. A hundred males pose with gifts.' },
      L('dronning', 'Jeg skal vælge en han. I nat er der bryllupsflyvning.', 'I must choose a male. Tonight is the wedding flight.'),
    ] },
    lesson({ who: 'dronning', scene: 'kammer', title: 'Adjektiver i flertal', say: { da: 'En flot han. To flotte hanner. Jeg tager dem begge.', en: 'A handsome male. Two handsome males. I will take them both.' },
      rule: 'In the plural the adjective gets -e: en stor by → to store byer, et hvidt æg → to hvide æg. blå and grå: no -e. lille → små. gammel → gamle, lækker → lækre. Some never change: moderne, ældre, spændende. Back to one: the en/et form again.',
      ex: ['en stor by – to stor[e] byer', 'et hvidt æg – to hvid[e] æg', 'en lille ø – to [små] øer', 'to blå fugle – en blå fugl'],
      try: { e: '🐱', q: 'en ung kat – to ___', right: 'unge katte', wrong: ['ung katte', 'unge kat'], why: 'Plural: ung → unge, kat → katte.' } }),
    { screen: 'quiz', replay: true, id: 'Gaverne', variant: 'scene', cast: ['dronning'], pileRight: true, n: 8, title: 'Gaverne', sub: 'Hannerne giver gaver. Dronningen vil have to – eller kun én.', rounds: PARADE },
    { screen: 'choice', scene: 'kammer', cast: ['dronning'], who: 'svampen', prompt: 'Dronningen: Du er blød og gul. Vil du flyve med i nat?', options: (st) => [
      { da: 'Nej tak. Jeg kan ikke flyve.', set: { flyvning: false } },
      { da: 'Nej, jeg kan ikke flyver.', set: { flyvning: true, misFly: true } },
      sc(st, 'Gaverne') >= 6 ? { da: 'Ja tak. Med glæde.', set: { flyvning: true } } : { da: 'Ja tak.', set: { flyvning: true } },
      { en: '(EN) No, thanks.', set: { flyvning: false }, after: sour('dronning', 'En dronning taler ikke engelsk.', 'A queen does not speak English.') },
    ] },
    { screen: 'panel', scene: 'kammer', cast: ['dronning'], lines: [
      (st) => (st.flags.misFly ? [{ n: '"Kan … flyver". The queen hears only "flyver" and claps.' }] : []),
      (st) => (st.flags.flyvning
        ? [{ n: 'You cannot fly. Two males carry you up between them. The queen winks with an eye you did not know she had. What happens in the air stays in the air.' }, { n: 'Somewhere around midnight you all land, giggling, on the roof of the Nectar Bar.' }]
        : [{ n: 'You stay on the ground. At midnight the foreman takes his coffee break at the Nectar Bar and takes you with him. The queen arrives soon after, alone and very awake.' }]),
      { n: 'Morning. The queen is back in her chamber, happy and slightly crumpled.' },
      L('dronning', 'Hvor er min krone?', 'Where is my crown?'),
    ] },

    // ===== 9 · Kronen (en/et af + definite plural)
    { screen: 'card', ch: 9, title: 'Kronen', sub: 'Kapitel 9', music: 'tense' },
    { screen: 'panel', scene: 'kammer', cast: ['betjent', 'dronning'], lines: [
      { n: 'A beetle in a very small hat arrives. Police. He sniffs everything, including you, for slightly too long.' },
      L('betjent', 'Jeg leder efter kronen. Rør ikke noget.', 'I am looking for the crown. Do not touch anything.'),
    ] },
    lesson({ who: 'betjent', scene: 'kammer', title: 'En af stolene · et af bordene', say: { da: 'Et af bordene er væltet. En af stolene mangler. Og hvem har spist kagerne?', en: 'One of the tables is knocked over. One of the chairs is missing. And who has eaten the cakes?' },
      rule: 'Definite plural: take the plural and add -ne (stole → stolene, borde → bordene, kager → kagerne, hoteller → hotellerne); plurals with no ending add -ene (børn → børnene). "One of": take en or et from the singular word: en stol → en af stolene, et bord → et af bordene.',
      ex: ['en af stol[ene]', 'et af bord[ene]', 'kager – kage[rne]', 'børn – [børnene]'],
      try: { e: '🪟', q: '___ af vinduerne er åbent.', right: 'Et', wrong: ['En', 'De'], why: 'et vindue → et af vinduerne.' } }),
    { screen: 'trippet', replay: true, id: 'Sporene', calm: true, title: 'Sporene', sub: 'Tryk på det, der er rigtigt.', need: 6, pairs: SPOR },
    { screen: 'panel', scene: 'kammer', cast: ['betjent'], lines: [
      L('betjent', 'Du sorterede en krone i nat. Den står på din liste.', 'You sorted a crown last night. It is on your list.'),
      { n: 'The beetle squeezes you gently. Sugar runs out of your pores. One pore has a small, crown-shaped dent.' },
      L('betjent', 'Du er anholdt.', 'You are under arrest.'),
    ] },

    // ===== 10 · Forhøret (imperative / infinitive / present, -re / -rer)
    { screen: 'card', ch: 10, title: 'Forhøret', sub: 'Kapitel 10', music: 'tense' },
    { screen: 'panel', scene: 'celle', cast: ['betjent'], lines: [
      { n: 'A small cell. One lamp. The beetle has brought coffee for himself. Every wrong answer earns him another cup.' },
      L('betjent', 'Sid ned. Svar på mine spørgsmål.', 'Sit down. Answer my questions.'),
    ] },
    lesson({ who: 'betjent', scene: 'celle', title: 'Kom! · at komme · han kommer', say: { da: 'Kom her! Du skal komme her. Du kommer her nu.', en: 'Come here! You must come here. You are coming here now.' },
      rule: 'Imperative = the stem: kom! vent! hjælp! tag! åbn! Infinitive after kan, skal, vil, må, tør, gider and after "at": kan komme, at vente. Present = + r: kommer, venter. Verbs on -re: you cannot hear køre / kører. Look at the sentence: a subject doing it now → -rer; after a modal or "at" → -re.',
      ex: ['Vent! · Jeg kan vent[e]. · Hun vent[er].', 'Hjælp mig! · Gider du hjælp[e]? · Han hjælp[er].', 'Hun vil kør[e]. · Hun kør[er] for stærkt.', 'Må jeg parker[e] her? · Han parker[er] ulovligt.'],
      try: { q: 'Hun ___ for stærkt.', right: 'kører', wrong: ['køre', 'kør'], why: 'Subject + verb now: kører.' } }),
    { screen: 'quiz', replay: true, id: 'Forhøret', variant: 'scene', cast: ['betjent'], pileWrong: '☕', n: 8, title: 'Forhøret', sub: 'Hvert forkert svar: en kop kaffe mere til Betjenten.', rounds: FORHOER },
    { screen: 'panel', scene: 'celle', cast: ['betjent'], lines: [
      (st) => (sc(st, 'Forhøret') >= 6
        ? [{ n: 'Your answers are so clear that the beetle takes off your handcuffs. He still thinks you did it. He just likes your grammar.' }]
        : [{ n: 'The beetle, on yet another coffee, is vibrating gently. You spend the night in the cell, cuffed to a peanut.' }]),
      L('betjent', 'Bien siger, at du var på Nektarbaren i nat. Med en krone på hovedet.', 'The bee says you were at the Nectar Bar last night. With a crown on your head.'),
    ] },

    // ===== 11 · I går aftes (past tense -ede / -te)
    { screen: 'card', ch: 11, title: 'I går aftes', sub: 'Kapitel 11', music: 'trip' },
    { screen: 'panel', scene: 'bar', cast: ['bi'], lines: [
      { n: 'The Nectar Bar. Low light, slow music, the bee bartender polishing a thimble.' },
      L('bi', 'Du kan ikke huske noget? Du drak tre glas gæret nektar. Så kan ingen huske noget.', 'You can\'t remember anything? You drank three glasses of fermented nectar. Then nobody remembers anything.'),
    ] },
    lesson({ who: 'bi', scene: 'bar', title: 'I går: -ede eller -te', say: { da: 'I går dansede du. Du spiste fire kager. Og så legede du konge.', en: 'Yesterday you danced. You ate four cakes. And then you played king.' },
      rule: 'Past tense, group 1: + ede (danse → dansede, lave → lavede, huske → huskede). Group 2: + te (spise → spiste, læse → læste, køre → kørte, høre → hørte, bruge → brugte). You cannot always hear it: learn the past with the verb.',
      ex: ['danse – dans[ede]', 'spise – spis[te]', 'køre – kør[te]', 'smile – smil[ede]'],
      try: { q: 'I går ___ du med hannerne. (danse)', right: 'dansede', wrong: ['danste', 'dansde'], why: 'danse → dansede.' } }),
    { screen: 'quiz', replay: true, id: 'I går', variant: 'scene', cast: ['bi'], meter: '🍯', n: 8, keep: true, title: 'I går aftes', sub: 'Bien fortæller. Du husker – i datid.', rounds: AFTEN },
    { screen: 'panel', scene: 'bar', cast: ['bi', 'betjent'], lines: [
      (st) => (sc(st, 'I går') >= 6
        ? [{ n: 'Your own words bring it back, sharp as a thimble: at three in the morning the queen took the crown off your head and swapped it for a bucket of sugar.' }, { th: 'And the crown she wore this morning? The one I sorted. A copy. Made of sugar. En krone, to kroner.' }]
        : [L('betjent', 'Klokken tre byttede dronningen kronen til sukker. Og hun har en kopi. Af sukker.', 'At three the queen swapped the crown for sugar. And she has a copy. Made of sugar.'), { th: 'The beetle worked it out before me. He is very pleased with himself.' }]),
      L('betjent', 'Hun meldte den stjålet, så ingen ville slikke på kopien.', 'She reported it stolen, so nobody would lick the copy.'),
      L('bi', 'Et glas til? På huset.', 'Another glass? On the house.'),
    ] },
    { screen: 'choice', scene: 'bar', cast: ['bi'], who: 'svampen', prompt: 'Svar:', options: [
      { da: 'Ja tak. Bare ét.', set: { nektar2: true } },
      { da: 'Nej, jeg vil ikke drikker mere.', set: { nektar2: true, misNektar: true } },
      { da: 'Nej tak. Jeg skal i retten i morgen.', set: { nektar2: false } },
      { en: '(EN) No.', set: { nektar2: false }, after: sour('bi', 'Her taler vi dansk, skat.', 'Here we speak Danish, darling.') },
    ] },

    // ===== 12 · Retten (modal verbs)
    { screen: 'card', ch: 12, title: 'Retten', sub: 'Kapitel 12', music: 'tense' },
    { screen: 'panel', scene: 'ret', cast: ['dommer', 'dronning'], lines: [
      (st) => (st.flags.misNektar ? { n: 'Last night: "vil … drikker". The bee heard "drikker mere" and poured. This morning your pores are still open like flowers.' } : st.flags.nektar2 ? { n: 'Last night: one more glass. This morning your pores are still open like flowers.' } : { n: 'You went back to the cell and slept, dry.' }),
      { n: 'The court sits inside an old boot. The judge is a tortoise. Each word takes him about a minute.' },
      (st) => (st.flags.nektar2 ? L('dommer', 'Du … lugter … af … nektar.', 'You … smell … of … nectar.') : L('dommer', 'Man … må … ikke … stjæle … kroner.', 'One … must … not … steal … crowns.')),
    ] },
    lesson({ who: 'dommer', scene: 'ret', title: 'Må, vil, skal, kan', say: { da: 'Du skal svare. Du må ikke lyve. Vil du sige noget? Kan du bevise det?', en: 'You must answer. You must not lie. Do you want to say something? Can you prove it?' },
      rule: 'skal = must / is going to · må = may, or have to (må ikke = must not) · vil = want to · kan = can. After all four: the infinitive, without "at". Sometimes two are possible.',
      ex: ['Man [må] ikke ryge her.', 'Du [skal] svare.', '[Vil] du sige noget?', 'Jeg [kan] bevise det.'],
      try: { q: 'Du ___ ikke røre ved kronen! Det er forbudt.', right: 'må', wrong: ['vil', 'kan'], why: 'Forbidden: må ikke.' } }),
    { screen: 'komplimenter', replay: true, id: 'Retten', actor: 'dommer', drunkFlag: 'nektar2', ask: 'Byg sætningen.', askEn: 'Build the sentence.', sayBtn: 'Sig det', end: '.', n: 5, title: 'Retten', sub: 'Dommeren venter. Meget længe.', rounds: RETTEN },
    { screen: 'choice', scene: 'ret', cast: ['dommer', 'dronning'], who: 'svampen', prompt: 'Dommeren: Hvem … tog … kronen?', options: (st) => (sc(st, 'Retten') >= 4 ? [
      { da: 'Dronningen. Hun byttet den til sukker.', set: { anklage: false, misRet: true } },
      { da: 'Det kan jeg ikke huske.', set: { anklage: false } },
      { da: 'Dronningen. Hun byttede den til sukker.', set: { anklage: true } },
      { en: "(EN) I can't remember.", set: { anklage: false }, after: sour('dommer', 'Dansk … tak.', 'Danish … please.') },
    ] : [
      { da: 'Det kan jeg ikke huske.', set: { anklage: false } },
      { da: 'Dronningen. Hun byttet den til sukker.', set: { anklage: false, misRet: true } },
      { en: "(EN) I can't remember.", set: { anklage: false }, after: sour('dommer', 'Dansk … tak.', 'Danish … please.') },
    ]) },
    { screen: 'panel', scene: 'ret', cast: ['dommer', 'dronning'], lines: [
      (st) => (st.flags.misRet ? [{ n: '"Byttet" instead of "byttede". The judge spends four minutes looking for the verb, then gives up.' }] : []),
      (st) => (st.flags.anklage
        ? [{ n: 'The court gasps, slowly. The queen drops her bucket and her sugar crown cracks.' }, L('dronning', 'Det er rigtigt. Jeg kan ikke lade være.', 'It is true. I cannot help it.')]
        : [{ n: 'The queen looks at you for a long time. Then she says it herself.' }, L('dronning', 'Det var mig. Jeg byttede den til sukker.', 'It was me. I swapped it for sugar.')]),
      L('dommer', 'Svampen … er … fri. … Men … du … skal … forlade … Tuen.', 'The sponge … is … free. … But … you … must … leave … the Anthill.'),
    ] },

    // ===== 13 · Tusindbenet (time prepositions)
    { screen: 'card', ch: 13, title: 'Tusindbenet', sub: 'Kapitel 13', music: 'calm' },
    { screen: 'panel', scene: 'station', cast: ['tusind'], lines: [
      (st) => (st.flags.anklage ? { n: 'A note from the queen, written in sugar: Forræder. (Traitor.)' } : { n: 'A small bag of sugar from the queen, and a note: Tak.' }),
      (st) => (st.flags.flyvning ? { n: 'On the back, in smaller writing: 4.000 æg. Tillykke, far.' } : null),
      L('tusind', 'Jeg kører aldrig om mandagen. Men på mandag kører jeg. Det er noget helt andet.', 'I never run on Mondays. But this Monday I run. That is something else entirely.'),
    ] },
    lesson({ who: 'tusind', scene: 'station', title: 'På, om, i, for … siden', say: { da: 'Om mandagen sover jeg. På mandag kører jeg. I mandags kørte jeg ikke.', en: 'On Mondays I sleep. This Monday I run. Last Monday I did not run.' },
      rule: 'på mandag = this coming Monday · om mandagen = every Monday · i mandags = last Monday. om natten = at night (always) · i aften = this evening. i tre timer = for three hours · om tre timer = in three hours · for tre timer siden = three hours ago. ved syvtiden = around seven · til tiden = on time.',
      ex: ['[på] mandag · [om] mandagen · [i] mandags', '[i] aften · [om] aftenen', '[i] to timer · [om] to timer · [for] to timer [siden]', '[ved] syvtiden · [til] tiden'],
      try: { q: 'Toget kommer ___ en time.', hint: 'one hour from now', right: 'om', wrong: ['ved', 'til'], why: 'om + time = from now.' } }),
    { screen: 'trippet', replay: true, id: 'Vinduerne', calm: true, title: 'Vinduerne', sub: 'Skiltene suser forbi. Tryk kun på dem, der er rigtige.', need: 6, pairs: VINDUER },
    { screen: 'panel', scene: 'tog', cast: ['tusind'], lines: [
      (st) => (st.flags.kaffe ? { n: 'You cannot sleep. The coffee from the first night is still in your pores, counting windows.' } : { n: 'You sleep. A thousand legs rock you like a very organised sea.' }),
      { n: 'Halfway through the night the centipede stops in the middle of nowhere. Someone has left an envelope on your seat. It smells of warm oil and mushrooms.' },
    ] },

    // ===== 14 · Brevet (da / når, hvis / om) — open end
    { screen: 'card', ch: 14, title: 'Brevet', sub: 'Kapitel 14', music: 'tense' },
    { screen: 'panel', scene: 'tog', cast: ['tusind'], lines: [
      { n: 'The envelope says TIL SVAMPEN, in little white dots. Inside, one line: "Da jeg mødte dig, var du helt tør. Skriv til mig, hvis du vil." No address, only: send it with the centipede.' },
    ] },
    lesson({ who: 'tusind', scene: 'tog', title: 'Da eller når · hvis eller om', say: { da: 'Da jeg var ung, kørte jeg om dagen. Når det regner, kører jeg langsomt. Hvis du skriver, tager jeg brevet med.', en: 'When I was young, I ran in the daytime. When it rains, I run slowly. If you write, I will take the letter.' },
      rule: 'da = one time in the past · når = every time, or in the future · hvis = if (a condition) · om = whether (after "ved ikke", "spørger", "er i tvivl"). After a da/når/hvis-clause first, the verb comes before the subject: Hvis du vil, kan du …',
      ex: ['[Da] jeg var lille, boede jeg i havet.', '[Når] det regner, bliver jeg glad.', '[Hvis] du er træt, kan du sove.', 'Jeg ved ikke, [om] han kommer.'],
      try: { q: 'Jeg ved ikke, ___ toget kommer.', right: 'om', wrong: ['hvis', 'når'], why: 'Whether: om.' } }),
    { screen: 'komplimenter', replay: true, id: 'Svaret', actor: 'svampen', ask: 'Skriv svaret.', askEn: 'Build the sentence.', sayBtn: 'Skriv det', end: '.', n: 5, title: 'Svaret', sub: 'Du skriver tilbage.', rounds: SVAR },
    { screen: 'panel', scene: 'kaffehav', cast: ['tusind'], music: 'trip', lines: [
      { n: 'The centipede takes your letter. Before he folds it, you see a P.S. you did not write, in white dots: Havet er ikke der, hvor du tror. Vi ses, fætter.' },
      { n: 'The centipede stops. Outside the window there is a sea. It is brown. It steams. It smells very strongly of coffee.' },
      L('tusind', 'Endestation. Havet.', 'Last stop. The sea.'),
      (st) => ({ th: st.flags.kaffe ? 'That is not my sea. … But it smells good.' : 'That is not my sea.' }),
    ] },
    { screen: 'card', title: 'Fortsættes …', sub: 'Del 3 kommer', ms: 1600 },
    { screen: 'act', do: 'ranks' },
    { screen: 'end' },
  ];
  K.FLOW.push(...P2);

  Object.assign(K.DICT, {
    travlt: 'busy (have travlt = be busy)', meldte: 'reported', 'stjålet': 'stolen', slikke: 'lick', kopien: 'the copy', ville: 'would, wanted to',
    andet: 'other (noget helt andet = something else entirely)', beholder: 'keep(s)', beviser: 'prove(s)', byttet: '(swapped, participle)', dansk: 'Danish', drikke: 'drink', drikker: 'drink(s)', dronning: 'queen', engelsk: 'English', flyver: 'fly / flies', formanden: 'the foreman', glæde: 'joy (med glæde = gladly)', klokken: 'the clock (klokken tre = at three)', kopi: 'copy', liste: 'list', lugter: 'smell(s)', lyver: 'lie(s)', pas: 'look after! (pas på)', skat: 'darling (also: tax)', sommeren: 'the summer', sommer: 'summer', sorterede: 'sorted', står: 'stand(s) / is written', travle: 'busy', uge: 'week', morgenen: 'the morning', mandags: '(i mandags = last Monday)', mandagen: 'Monday (om mandagen = on Mondays)', aftenen: 'the evening', vinduerne_: '', suser: 'rush(es)', forbi: 'past', skiltene: 'the signs', tilbage: 'back', svaret: 'the answer, reply', 'helt': 'completely',
    del: 'part', arbejder: 'work(s)', at: 'to / that', baren: 'the bar', e: '(the ending -e)', r: '(the ending -r)', er_: '', hende: 'her', hjem: 'home', hun: 'she', huske: 'remember', hvorfor: 'why', kagen: 'the cake', man: 'one, you (people in general)', men: 'but', selv: 'self (mig selv = myself)', sove: 'sleep', ti: 'ten', tuen: 'the anthill (city)', havet: 'the sea', rute: 'route', stå: 'stand (stå af = get off)', 'tæller': 'count(s)', alt: 'everything', bil: 'car', biler: 'cars', fisk: 'fish (plural too)', vindue: 'window', vinduer: 'windows', vinduerne: 'the windows', flertal: 'plural', endelse: 'ending', ingen: 'no', hund: 'dog', hunde: 'dogs', hunder: '(wrong form)', kop: 'cup', kaffe: 'coffee', sover: 'sleep(s)', lang: 'long', natten: 'the night', kasserne: 'the crates', kasse: 'crate', hvilken: 'which', to: 'two',
    bus: 'bus', kat: 'cat', mus: 'mouse / mice', hest: 'horse', hus: 'house', ske: 'spoon', cykel: 'bicycle', brød: 'bread', skib: 'ship', agurk: 'cucumber', fugl: 'bird', banan: 'banana', fly: 'plane(s)', kniv: 'knife', billet: 'ticket', ø: 'island', sten: 'stone(s)', dyr: 'animal(s)', år: 'year(s)',
    dronningen: 'the queen', se: 'see', nu: 'now', myre: 'ant', vælge: 'choose', han: 'he / a male', hanner: 'males', hannerne: 'the males', bryllupsflyvning: 'wedding flight', flyvning: 'flight', tager: 'take(s)', dem: 'them', begge: 'both', by: 'town', byer: 'towns', æg: 'egg(s)', fugle: 'birds', ung: 'young', unge: 'young (-e form)', katte: 'cats', gaverne: 'the gifts', giver: 'give(s)', kun: 'only', ny: 'new', nye: 'new (-e form)', bred: 'wide', brede: 'wide (-e form)', senge: 'beds', kage: 'cake', kager: 'cakes', højt: 'tall (et-form)', høje: 'tall (-e form)', træ: 'tree', træer: 'trees', hotel: 'hotel', hoteller: 'hotels', kasketter: 'caps', brugt: 'used', brugte: 'used (-e form) / used (past)', fjernsyn: 'TV(s)', kontorer: 'offices', kontor: 'office', køer: 'cows', ko: 'cow', sikre: 'safe (-e form)', sikker: 'safe', låse: 'locks', lås: 'lock', børn: 'children', barn: 'child', blød: 'soft', flyve: 'fly', krone: 'crown', min: 'my',
    kronen: 'the crown', leder: 'look(s) (leder efter = look for)', efter: 'after / for', rør: 'touch!', bordene: 'the tables', væltet: 'knocked over', stolene: 'the chairs', mangler: 'is missing', hvem: 'who', spist: 'eaten', kagerne: 'the cakes', vinduerne_: '', åbent: 'open (et-form)', sporene: 'the clues', glassene: 'the glasses', knivene: 'the knives', hotellerne: 'the hotels', børnene: 'the children', anholdt: 'arrested',
    forhøret: 'the interrogation', sid: 'sit!', ned: 'down', svar: 'answer! / answer', spørgsmål: 'question(s)', kom: 'come! / came', komme: 'come', kommer: 'come(s)', vent: 'wait!', vente: 'wait', venter: 'wait(s)', hjælp: 'help!', hjælpe: 'help', 'hjælper': 'help(s)', tag: 'take!', tage: 'take', 'åbn': 'open!', åbne: 'open', åbner: 'open(s)', 'røre': 'touch', 'rører': 'touch(es)', parker: 'park!', parkere: 'park', parkerer: 'park(s)', diskuter: 'discuss!', diskutere: 'discuss', diskuterer: 'discuss(es)', kør: 'drive!', køre: 'drive', kører: 'drive(s), run(s)', gider: 'bother(s) (gider du? = would you mind?)', tør: "dare(s) / dry", morgen: 'morning (i morgen = tomorrow)', bussen: 'the bus', døren: 'the door', ting: 'thing(s)', ulovligt: 'illegally', svært: 'difficult', sidder: 'sit(s)', problemet: 'the problem', stærkt: 'fast, strongly', minutter: 'minutes', taske: 'bag', bien: 'the bee', nektarbaren: 'the Nectar Bar', hovedet: 'the head', går: 'go(es) (i går = yesterday)',
    aftes: '(i går aftes = last night)', drak: 'drank', glas: 'glass(es)', gæret: 'fermented', nektar: 'nectar', ingen: 'nobody / no', dansede: 'danced', danse: 'dance', spiste: 'ate', spise: 'eat', legede: 'played', konge: 'king', fire: 'four', fortæller: 'tell(s)', husker: 'remember(s)', datid: 'past tense', danser: 'dance(s)', spiser: 'eat(s)', smiler: 'smile(s)', smilede: 'smiled', smile: 'smile', taler: 'speak(s)', talte: 'spoke', låner: 'lend(s) / borrow(s)', lånte: 'lent', sin: 'his/her own', prøver: 'tries', prøvede: 'tried', kørte: 'drove', glemmer: 'forget(s)', glemte: 'forgot', lukker: 'close(s)', lukkede: 'closed', ringer: 'ring(s), call(s)', ringede: 'rang, called', mere: 'more', sukker: 'sugar', huskede: 'remembered', hører: 'hear(s)', hørte: 'heard', musik: 'music', retten: 'the court', 'må': 'may, must (må ikke = must not)',
    dommeren: 'the judge', stjæle: 'steal', kroner: 'crowns', lyve: 'lie (tell lies)', bevise: 'prove', forbudt: 'forbidden', ryge: 'smoke', byg: 'build!', sætningen: 'the sentence', beholde: 'keep', sukkeret: 'the sugar', tog: 'took / train', byttede: 'swapped', lade: 'let (kan ikke lade være = can\'t help it)', være: 'be', var: 'was', fri: 'free', forlade: 'leave', tusindbenet: 'the centipede', toget: 'the train', fredag: 'Friday', fredagen: 'Friday (om fredagen = on Fridays)', fredags: '(i fredags = last Friday)', mandag: 'Monday', dagen: 'the day', også: 'also', timer: 'hours', time: 'hour', siden: 'ago (for … siden)', sidste: 'last', fremme: 'there, arrived', syvtiden: 'around seven (ved syvtiden)', tiden: 'the time (til tiden = on time)', aften: 'evening', lave: 'do, make', fødselsdag: 'birthday', dage: 'days', ventet: 'waited', køreplanen: 'the timetable', 'højt': 'tall / out loud',
    brevet: 'the letter', da: 'when (once, past) / then', når: 'when (every time, future)', hvis: 'if', om: 'whether / in (time) / about', ung_: '', regner: 'rains', langsomt: 'slowly', læse: 'read', lille: 'small', boede: 'lived', træt: 'tired', mødte: 'met', tænker: 'think(s)', 'bliver': 'become(s)', skrive: 'write', prikker: 'dots', spørger: 'ask(s)', savner: 'miss(es)', solen: 'the sun', ned_: '', 'nætter': 'nights', svarer: 'answer(s)', skriver: 'write(s)', tvivl: 'doubt (i tvivl = unsure)', gang: 'time', hinanden: 'each other', regnede: 'rained', fortsættes: 'to be continued', kommer_: '', kapitel: 'chapter', 'endestation': 'last stop', dronningens: "the queen's", kammer: 'chamber', cellen: 'the cell', stationen: 'the station', nattoget: 'the night train', gammel: 'old', støvle: 'boot', lyst: 'light (et-form)',
  });
  Object.keys(K.DICT).forEach((k) => { if (!K.DICT[k]) delete K.DICT[k]; });
})(window.K = window.K || {});
