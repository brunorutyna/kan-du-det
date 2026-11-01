// TØRLAGT · DEL 4: RIFFET. SPOILERS. Chapters 20–24: vocabulary review of the book's chapter 2 (jobs, colleagues,
// calling in sick, appointments) and 3.1 (rooms, lost things). Desert lore from Bruno's music (stoner, psych, doom),
// all invented. One playthrough, set-up → swerve. Design: claude/toerlagt-del4.md (§14–15 are final).
(function (K) {
  'use strict';
  const L = (w, da, en) => ({ w, da, en });
  const lesson = (o) => Object.assign({ screen: 'lesson', replay: true }, o);
  const sc = (st, id) => ((st.tally || {})[id] || { ok: 0 }).ok;
  const f = (st) => st.flags || {};
  const sour = (w, da, en) => [L(w, da, en)];

  Object.assign(K.CAST, {
    fata: { name: 'Fata Morganaen', e: '✨', color: '#c9b8e8', pitch: 1.2 },
    skarab: { name: 'Skarabæen', e: '🪲', color: '#3c8f7a', pitch: 0.8 },
    raev: { name: 'Ørkenræven', e: '🦊', color: '#e08a3c', pitch: 1.3 },
    slange: { name: 'Klapperslangen', e: '🐍', color: '#9a7d3f', pitch: 0.9 },
    ged: { name: 'Geden', e: '🐐', color: '#b8b0a0', pitch: 1.0 },
    mammut: { name: 'Mammutten', e: '🦣', color: '#7a5a3a', pitch: 0.5 },
    rulle: { name: 'Rullebusken', e: '🌾', color: '#c9a95c', pitch: 1.1 },
  });
  Object.assign(K.SCENES, {
    oerken: { from: '#e3a95c', to: '#6b3a16', label: 'Den dybe ørken' },
    klit: { from: '#d9a05a', to: '#4a2a12', label: 'Klitten, der trækker vejret' },
    oere: { from: '#4a2c1c', to: '#120806', label: 'Mammuttens øre' },
    oeretrip: { from: '#5a2c6c', to: '#120618', label: 'Mammuttens øre', trip: true },
    ruinen: { from: '#3a3226', to: '#0f0c08', label: 'Ruinen' },
  });
  K.CHAPTERS.push(
    { title: 'Jobsamtalen', topic: 'repetition: job, i/på, i gang med' },
    { title: 'Kollegerne', topic: 'repetition: der, sin/hans, adjektiver' },
    { title: 'Afbud', topic: 'repetition: syg, aftaler, datoer, klokken' },
    { title: 'Ruinen', topic: 'repetition: rum, op/oppe, den/dem, egen' },
    { title: 'Riffet', topic: 'repetition: alt fra kapitel 2 og 3.1' },
  );
  const smokeScene = (st) => (f(st).smoke21 || f(st).smoke22 ? 'oeretrip' : 'oere');

  // ---------- content
  const job = (ask, en, answers, traps, why, end) => ({ ask, en, answers, traps, why, end: end || '.' });
  const JOB = [
    job('Hvad er det nu, du laver?', 'I am a musician.', ['Jeg er musiker'], ['en', 'som'], 'No article with a job: Jeg er musiker.'),
    job('Hvor arbejdede du før?', 'I worked at a hotel.', ['Jeg arbejdede på et hotel', 'På et hotel arbejdede jeg'], ['i', 'som'], 'på et hotel.'),
    job('Og din bror?', 'He works in a bank.', ['Han arbejder i en bank', 'I en bank arbejder han'], ['på', 'som'], 'i en bank.'),
    job('Hvad laver du lige nu?', 'Right now I am busy with a new song.', ['Lige nu er jeg i gang med en ny sang', 'Jeg er i gang med en ny sang lige nu'], ['ved', 'at'], 'i gang med + a noun. After Lige nu: the verb, then the subject (er jeg).'),
    job('Og hvad mere?', 'I am learning Danish.', ['Jeg er ved at lære dansk', 'Jeg er i gang med at lære dansk'], ['lærte', 'på'], 'ved at / i gang med at + infinitive.'),
    job('Har du travlt?', 'I have far too much to do.', ['Jeg har alt for meget at lave'], ['mange', 'lavet'], 'meget: uncountable (at lave).'),
    job('Og opgaver?', 'I have far too many tasks.', ['Jeg har alt for mange opgaver'], ['meget', 'opgave'], 'mange: countable plural (opgaver).'),
    job('Hvad kunne du godt tænke dig at lave?', 'I would like to play in a band.', ['Jeg kunne godt tænke mig at spille i et band'], ['spillet', 'dig'], 'kunne godt tænke mig at + infinitive.'),
  ];

  const MEMBERS = [
    { id: 'skarab', e: '🪲', label: 'Skarabæen' }, { id: 'raev', e: '🦊', label: 'Ørkenræven' }, { id: 'slange', e: '🐍', label: 'Klapperslangen' },
    { id: 'ged', e: '🐐', label: 'Geden' }, { id: 'fata', e: '✨', label: 'Fata Morganaen' },
  ];
  const KOLLEGER = [
    { desc: 'Det er ham, der altid kommer for sent.', target: 'slange', hint: 'late', why: 'The snake arrived last, sneezing.' },
    { desc: 'Det er hende, der aldrig tager sin maske af. Hun er lidt mærkelig.', target: 'ged', hint: 'mask', follow: { q: 'Geden tager aldrig ___ maske af.', right: 'sin', wrong: ['hendes', 'sit'], why: 'The owner is the subject (Geden): sin.' } },
    { desc: 'Det er ham, der altid er tjekket. Han kommer aldrig for sent.', target: 'skarab', hint: 'organised' },
    { desc: 'Han spiller alt for højt. Han er ret arrogant.', target: 'raev', hint: 'loud', follow: { q: 'Hvad synes du om ham?', right: 'Jeg synes faktisk, han er ret arrogant.', wrong: ['Jeg faktisk synes, han er ret arrogant.', 'Jeg synes faktisk, er han ret arrogant.'], why: 'faktisk goes right after synes; then normal order: han er.' } },
    { desc: 'Hun er her kun, når du ikke kigger. Hun er lidt forvirret.', target: 'fata', hint: 'mirage', follow: { q: 'Skarabæen har læst Fata Morganaens kontrakt. Han har læst ___ kontrakt.', right: 'hendes', wrong: ['sin', 'hans'], why: 'Her contract, not his own: hendes.' } },
    { desc: 'Det er ham, der altid er forkølet. Han er tit sur.', target: 'slange', hint: 'cold' },
    { desc: 'Han er afslappet og dygtig. Han ruller sin egen forstærker.', target: 'skarab', hint: 'rolls', follow: { q: 'Ræven låner Skarabæens pibe. Han ryger ___ pibe.', right: 'hans', wrong: ['sin', 'sine'], why: 'Not his own pipe: hans.' } },
    { desc: 'Hun glemmer altid sine sange. Hun er utjekket.', target: 'ged', hint: 'forgets' },
    { desc: 'Det er ham, der altid er på vej væk.', target: 'ingen', hint: 'not on stage', last: true, why: 'Nobody on stage. (Something rolled past earlier.)' },
  ];

  const kal = (ask, en, answers, traps, why, end) => ({ ask, en, answers, traps, why, end: end || '.', drunk: 'røg' });
  const KALENDER = [
    kal('Klapperslangen ringer:', 'Unfortunately I can’t come today.', ['Jeg kan desværre ikke komme i dag', 'I dag kan jeg desværre ikke komme'], ['at', 'kommer'], 'kan + infinitive; desværre ikke after the verb.'),
    kal('Hvorfor ikke?', 'I have a fever.', ['Jeg har feber'], ['febre', 'er'], 'have feber (no article).'),
    kal('Du svarer:', 'Get well soon!', ['God bedring'], ['godt', 'bedre'], 'God bedring! (en bedring).', '!'),
    kal('Geden synger:', "Won't you cancel my concert?", ['Vil du ikke aflyse min koncert'], ['aflyser', 'mit'], 'Vil du ikke + infinitive. en koncert → min.', '?'),
    kal('Du spørger Fata Morganaen:', 'Can we move the concert to Friday?', ['Kan vi flytte koncerten til fredag'], ['flytter', 'om'], 'Kan vi + infinitive.', '?'),
    kal('Hun svarer:', 'On Friday at half past nine (9.30).', ['På fredag klokken halv ti', 'Klokken halv ti på fredag', 'Fredag klokken halv ti'], ['om', 'ni'], 'halv ti = 9.30: halv counts towards the next hour.'),
    kal('Mammuttens kalender:', 'It sleeps on the third of August.', ['Den sover den tredje august', 'Den tredje august sover den'], ['tre', 'tredte'], 'Dates: den + ordinal (tredje).'),
    kal('Hvor er Ørkenræven?', 'He has sent his apologies (melde afbud).', ['Han har meldt afbud'], ['melder', 'afbuddet'], 'melde afbud → har meldt afbud.'),
    kal('Hvor er Skarabæen?', 'He has gone down to the basement.', ['Han er gået ned i kælderen', 'Ned i kælderen er han gået'], ['nede', 'på'], 'Movement: ned (not nede). i kælderen.'),
    kal('Hvor er Geden?', 'I think she is ill. (You think it is a fact, but you are not sure.)', ['Jeg tror, hun er syg', 'Hun er syg, tror jeg'], ['synes', 'ved'], 'tror = you think it is a fact but are not sure. synes = an opinion; ved = you know for sure.'),
  ];

  const ROOMS = [
    { id: 'loft', e: '🪜', label: 'loftet', level: 'oppe' },
    { id: 'sove', e: '🛏️', label: 'soveværelset', level: 'inde' },
    { id: 'stue', e: '🛋️', label: 'stuen', level: 'inde', start: true },
    { id: 'koekken', e: '🍳', label: 'køkkenet', level: 'ude' },
    { id: 'gang', e: '🚪', label: 'gangen', level: 'ude' },
    { id: 'kaelder', e: '🕸️', label: 'kælderen', level: 'nede', lock: 'noegler' },
    { id: 'bad', e: '🛁', label: 'badeværelset', level: 'nede', lock: 'maske' },
  ];
  const step = (q, right, wrong, why) => ({ q, right, wrong, why });
  const ASKS = [
    { id: 'hoer', who: 'raev', e: '🎧', item: 'høretelefoner', room: 'loft', clue: 'Mine høretelefoner ligger oppe på loftet.', steps: [
      step('Hvad siger du?', 'Jeg går op og henter dem.', ['Jeg går oppe og henter dem.', 'Jeg går op og henter den.'], 'Movement: op. Plural thing you take: dem.'),
      step('Ørkenræven: Vil du ikke tage dem med til mig?', 'Jo, det skal jeg nok.', ['Ja, det skal jeg nok.', 'Jo, jeg skal nok det.'], 'Yes to a negative question: jo. A promise: skal nok.'),
    ] },
    { id: 'noegler', who: 'skarab', e: '🔑', item: 'nøgler', room: 'koekken', clue: 'Mine nøgler ligger ude i køkkenet. (De åbner kælderen.)', steps: [
      step('Hvad siger du?', 'Jeg går ud og henter dem.', ['Jeg går ude og henter dem.', 'Jeg går ud og henter det.'], 'Movement: ud. nøgler (plural): dem.'),
      step('Skarabæen: Har du dem?', 'Ja, her er dine nøgler.', ['Ja, her er din nøgler.', 'Ja, her er dit nøgler.'], 'Plural: dine.'),
    ] },
    { id: 'maske', who: 'ged', e: '🎭', item: 'maske', room: 'sove', clue: 'Min maske ligger inde i soveværelset. (Bag masken kan man se skjulte døre.)', steps: [
      step('Hvad siger du?', 'Jeg går ind og henter den.', ['Jeg går inde og henter den.', 'Jeg går ind og henter dem.'], 'Movement: ind. en maske: den.'),
      step('Geden: Har du den?', 'Ja, her er din maske.', ['Ja, her er dit maske.', 'Ja, her er sin maske.'], 'en maske: din.'),
    ] },
    { id: 'skind', who: 'slange', e: '🐍', item: 'skind', room: 'kaelder', needs: 'hoer', clue: 'Mit gamle skind ligger nede i kælderen.', steps: [
      step('Hvad siger du?', 'Jeg går ned og henter det.', ['Jeg går nede og henter det.', 'Jeg går ned og henter den.'], 'Movement: ned. et skind: det.'),
      step('Klapperslangen: Har du det?', 'Ja, her er dit gamle skind.', ['Ja, her er din gamle skind.', 'Ja, her er dit gammel skind.'], 'et skind: dit; after dit the adjective gets -e: gamle.'),
    ] },
    { id: 'pung', who: 'skarab', e: '👛', item: 'pung', room: 'gang', needs: 'hoer', clue: 'Min pung er væk. Rullebusken har den, tror jeg. Han er ude i gangen.', steps: [
      step('Du spørger Rullebusken:', 'Har du set Skarabæens pung?', ['Har du set Skarabæen pung?', 'Har du set Skarabæens pungen?'], 'Genitive -s, and no -en after it.'),
      step('Rullebusken: Ja, den har jeg. Vil du have den?', 'Ja tak. Jeg tager den med til ham.', ['Ja tak. Jeg tager den med til han.', 'Ja tak. Jeg tager det med til ham.'], 'Object: ham. en pung: den.'),
    ] },
    { id: 'handsker', who: 'fata', e: '🧤', item: 'handsker', room: 'stue', clue: 'Mine egne handsker ligger inde i stuen.', steps: [
      step('Hvad siger du?', 'Jeg går ind og henter dem.', ['Jeg går inde og henter dem.', 'Jeg går ind og henter den.'], 'Movement: ind. Plural: dem.'),
      step('Fata Morganaen: Er det mine egne?', 'Ja, det er dine egne handsker.', ['Ja, det er dine egen handsker.', 'Ja, det er dine eget handsker.'], 'Plural: egne.'),
    ] },
    { id: 'vand', who: 'skarab', e: '💧', item: 'vand', room: 'bad', needs: 'maske', clue: 'Dit eget vand står nede på badeværelset, i en flaske. Bag et forhæng.', steps: [
      step('Hvad siger du?', 'Jeg går ned og henter mit eget vand.', ['Jeg går ned og henter min eget vand.', 'Jeg går nede og henter mit eget vand.'], 'et vand: mit eget. Movement: ned.'),
      step('Skarabæen: Er det dit eget?', 'Ja, det er mit eget.', ['Ja, det er min egen.', 'Ja, det er mine egne.'], 'et vand: mit eget.'),
    ] },
  ];

  const WAVES = [
    { rule: 'Ting i et hus', en: 'Things in a house', pickup: 'magnet', fits: ['nøgler', 'pung', 'briller', 'høretelefoner', 'taske', 'rygsæk', 'paraply'], others: ['kok', 'feber', 'lørdag', 'kollega', 'tjener'] },
    { rule: 'Job', en: 'Jobs', pickup: 'wide', fits: ['musiker', 'kok', 'lærer', 'journalist', 'tjener', 'programmør', 'læge'], others: ['kælder', 'hue', 'influenza', 'loft', 'fredag'] },
    { rule: 'Syg', en: 'Being ill, calling in sick', pickup: 'magnet', fits: ['feber', 'forkølet', 'influenza', 'god bedring', 'melde afbud', 'syg'], others: ['loft', 'bas', 'programmør', 'handsker', 'koncert'] },
    { rule: 'min / mit / mine: kun rigtige', en: 'Only the right possessive', pickup: 'wide',
      fits: ['mine nøgler', 'min pung', 'mit ur', 'mine briller', 'min taske', 'mit kamera'], others: ['mit nøgler', 'mine pung', 'min ur', 'mit briller', 'mine taske', 'min kamera'],
      twins: { 'mine nøgler': 'mit nøgler', 'min pung': 'mine pung', 'mit ur': 'min ur', 'mine briller': 'mit briller', 'min taske': 'mine taske', 'mit kamera': 'min kamera' } },
  ];

  // ---------- outcome of part 4 (open)
  const PART4_GAMES = ['Kollegerne', 'Kalenderen', 'Ruinen', 'Riffet'];
  K.acc4 = (st) => { let ok = 0, n = 0; PART4_GAMES.forEach((g) => { const t = (st.tally || {})[g]; if (t) { ok += t.ok; n += t.n; } }); return n ? ok / n : 1; };
  K.outcome4 = (st) => (f(st).smoke24 ? 'Evigt' : K.acc4(st) >= 0.7 ? 'Mammutten danser' : 'Mammutten går');
  const outcomeLines = (st) => {
    const o = K.outcome4(st);
    if (o === 'Evigt') return [{ n: 'You smoke it all. You become a thousand sponges, every one of them squeezing out the riff. The mammoth sways. Nobody ever stops. Nobody ever wants to.' }, L('skarab', 'Vi er fire.', 'We are four.')];
    if (o === 'Mammutten danser') return [{ n: 'The mammoth stands up in the moonlight and dances, slowly, for one whole riff. Then it lies down again, smiling with its entire trunk.' }, { n: 'The band is unemployed and delighted. You are wet, soft and free.' }, L('skarab', 'Vi er fire. Og svampen.', 'We are four. And the sponge.')];
    return [{ n: 'The mammoth stands up, stretches, and walks off across the desert with the band still in its ear. You watch from the sand, wet and alone.' }, L('skarab', 'Vi er fire!', 'We are four! (from very far away)')];
  };
  const prevEnd = K.CONFIG.endNote;
  K.CONFIG.endNote = (st) => (st.part === 4 ? K.outcome4(st) : prevEnd ? prevEnd(st) : '');

  // ---------- the flow of part 4
  const P4 = [
    // ===== 20 · Jobsamtalen
    { screen: 'card', ch: 20, part4: true, title: 'Del 4', sub: 'Riffet', music: 'calm' },
    { screen: 'panel', scene: 'oerken', cast: ['svampen', 'grib'], lines: [
      { n: 'Dry, alone and slightly crunchy, you walk into the deep desert. A vulture passes overhead.' },
      L('grib', 'Alene igen? Så er du fri.', 'Alone again? Then you are free.'),
      { n: 'In the sand, in big letters: BAND SØGER ROADIE. LØN: RØG. Next to it, a chair. On the chair, sometimes, a shimmer: the manager, a mirage.' },
    ] },
    lesson({ who: 'fata', scene: 'oerken', title: 'Repetition: job og arbejde', say: { da: 'Hvad er det nu, du laver? Er du i gang med noget? Hvad kunne du godt tænke dig at lave?', en: 'What is it you do again? Are you busy with something? What would you like to do?' },
      rule: 'No article with a job: Jeg er musiker. Workplaces: i et firma / i en bank, på et hotel / på en avis / på et hospital. Busy right now: i gang med + a noun; i gang med at / ved at + infinitive. A wish: kunne godt tænke sig at + infinitive. mange + countable (opgaver), meget + uncountable (arbejde, at lave).',
      ex: ['Jeg er musiker.', 'Jeg arbejder [på] et hotel.', 'Jeg er [ved at] skrive en sang.', 'Jeg har alt for [mange] opgaver.'],
      try: { q: 'Jeg arbejder ___ en bank.', right: 'i', wrong: ['på', 'som'], why: 'i en bank.' } }),
    { screen: 'komplimenter', replay: true, id: 'Jobsamtalen', actor: 'fata', ask: 'Svar på spørgsmålet.', askEn: 'Build your answer.', sayBtn: 'Svar', end: '.', n: 8, title: 'Jobsamtalen', sub: 'Fata Morganaen spørger. Kontrakten skriver sig selv.', rounds: JOB },
    { screen: 'choice', scene: 'oerken', cast: ['fata'], who: 'svampen', prompt: 'Fata Morganaen: Kontrakten siger: Lønnen er røg. Passer det dig?', options: [
      { da: 'Ja, det passer mig fin.', set: { misFin: true } },
      { da: 'Nej tak. Jeg vil have penge.', set: { penge: true } },
      { da: 'Ja, det passer mig fint.', set: {} },
      { en: '(EN) Fine by me.', set: {}, after: sour('fata', 'Hvad var det nu, du sagde? … Nå. Du er ansat.', 'What was it you said? … Well. You are hired.') },
    ] },
    { screen: 'panel', scene: 'oerken', cast: ['fata'], lines: [
      (st) => (f(st).misFin ? { n: '"Fin" — close enough. She signs for you.' } : f(st).penge ? L('fata', 'Penge? Vi har ingen penge. Vi har røg. Du er ansat.', 'Money? We have no money. We have smoke. You are hired.') : { n: 'She signs.' }),
      { n: 'The contract has six lines. You count them twice.' },
      L('fata', 'Du starter i morgen. Vi spiller oppe på klitten.', 'You start tomorrow. We play up on the dune.'),
    ] },

    // ===== 21 · Kollegerne
    { screen: 'card', ch: 21, title: 'Kollegerne', sub: 'Kapitel 21 · Du knaser, når du går.', music: 'tense' },
    { screen: 'panel', scene: 'klit', cast: ['svampen', 'skarab'], lines: [
      { n: 'Morning. You are smaller than yesterday, and you crackle when you walk.' },
      { th: 'Odd. I have not been near any water.' },
      { n: 'The dune is warm. It breathes. Halfway up, a door of fur opens, and you walk into an ear.' },
      L('skarab', 'Velkommen. Det er Mammuttens øre. Den har sovet i ni hundrede år.', 'Welcome. This is the mammoth’s ear. It has slept for nine hundred years.'),
      L('skarab', 'Hvis riffet stopper, vågner den. Det står i kontrakten.', 'If the riff stops, it wakes up. It is in the contract.'),
      { n: 'You check the contract. There were six lines. There are seven now. Line seven is too small to read.' },
    ] },
    { screen: 'panel', scene: 'oere', cast: ['raev', 'slange', 'ged'], lines: [
      { n: 'The band: a fox with enormous ears, a rattlesnake who arrives last and sneezing, a goat in a mask. And, rolling past the stage without stopping, a tumbleweed that nobody mentions.' },
      L('skarab', 'Vi er fire.', 'We are four.'),
      { th: 'Five, if you count me. Nobody counts me.' },
    ] },
    lesson({ who: 'skarab', scene: 'oere', title: 'Repetition: kolleger', say: { da: 'Det er ham, der altid kommer for sent. Hun tager aldrig sin maske af. Jeg synes faktisk, han er ret arrogant.', en: 'He is the one who is always late. She never takes off her mask. I actually think he is quite arrogant.' },
      rule: 'A der-clause: the adverb comes before the verb (… der altid kommer). sin / sit / sine when the owner is the subject of the same clause; hans / hendes when it belongs to someone else. synes + adverb: Jeg synes faktisk, … People: dygtig, tjekket, utjekket, afslappet, nervøs, forvirret, sur, mærkelig, arrogant.',
      ex: ['Det er ham, der [altid] kommer for sent.', 'Hun tager aldrig [sin] maske af.', 'Ræven låner Skarabæens pibe. Han ryger [hans] pibe.', 'Jeg synes [faktisk], han er sur.'],
      try: { q: 'Skarabæen ruller ___ egen forstærker.', right: 'sin', wrong: ['hans', 'sit'], why: 'His own (the subject’s): sin. en forstærker.' } }),
    { screen: 'choice', scene: 'oere', cast: ['skarab'], who: 'svampen', prompt: 'Skarabæen: Én pibe, og du kan mærke riffet. Spejlsand.', options: [
      { da: 'Ja, jeg vil ryger.', set: { smoke21: true, misRyger: true } },
      { da: 'Nej tak. Jeg vil kunne se.', set: { smoke21: false } },
      { da: 'Ja tak.', set: { smoke21: true } },
      { en: '(EN) No, thanks.', set: { smoke21: false }, after: sour('skarab', 'Engelsk? Det kan man ikke ryge.', "English? You can't smoke that.") },
    ] },
    { screen: 'panel', scene: 'oere', cast: ['raev', 'skarab'], lines: [
      (st) => (f(st).misRyger ? { n: '"Ryger" is all the beetle hears. He lights the pipe for you.' } : []),
      (st) => (f(st).smoke21 ? [{ n: 'The smoke tastes of hot glass. Everything appears twice: two foxes, two snakes, two of you. One of each pair is lying.' }, L('raev', 'Nå, du er sjov. Du er sød.', 'Oh, you are fun. You are sweet.')]
        : [L('raev', 'Han ryger ikke? Kedelig.', "He doesn't smoke? Boring.")]),
      { n: 'The riff starts. The band plays. You carry, plug in, tune up, and learn who is who.' },
    ] },
    { screen: 'board', replay: true, id: 'Kollegerne', mode: 'stage', cols: 3, twinFlag: 'smoke21', title: 'Kollegerne', sub: 'Hvem er det? Tryk på dem på scenen.', tiles: MEMBERS, rounds: KOLLEGER },
    { screen: 'panel', scene: 'oere', cast: ['skarab'], lines: [
      (st) => (sc(st, 'Kollegerne') >= 9 ? { n: 'You know them all now, including the one who is never there.' } : { n: 'You mix up the fox and the snake twice. The snake is not amused.' }),
      L('skarab', 'På lørdag spiller vi for Mammutten. Den har fødselsdag. Det er en stor koncert.', 'On Saturday we play for the mammoth. It is its birthday. It is a big concert.'),
    ] },

    // ===== 22 · Afbud
    { screen: 'card', ch: 22, title: 'Afbud', sub: 'Kapitel 22 · Lørdag', music: 'happy' },
    { screen: 'panel', scene: 'oere', cast: ['fata', 'rulle'], lines: [
      { n: 'Saturday. The birthday concert starts on time, exactly as promised. The mammoth snores in tune.' },
      { n: 'Outside, new letters in the sand: BAND SØGER ROADIES. Plural.' },
      L('fata', 'Vi har ansat en til. Han er altid på vej væk.', 'We have hired one more. He is always on his way off.'),
      { n: 'A tumbleweed rolls in, and out again. Then the calls start.' },
      L('slange', 'Jeg kan desværre ikke komme. Jeg har feber.', "Unfortunately I can't come. I have a fever."),
      (st) => ({ n: f(st).smoke21 ? 'Then the goat sends her apologies, as a chant. Then the fox, who is coming down very hard.' : 'Then the goat sends her apologies, as a chant. Then the fox.' }),
      { n: 'The riff must not stop. You play bass with one hand and drums with the other, and sort out the calendar with your foot.' },
    ] },
    lesson({ who: 'fata', scene: 'oere', title: 'Repetition: syg, aftaler og tid', say: { da: 'Jeg kan desværre ikke komme. Kan vi flytte koncerten? På fredag klokken halv ti?', en: "Unfortunately I can't come. Can we move the concert? On Friday at half past nine?" },
      rule: 'Calling in sick: Jeg kan desværre ikke komme. Jeg er syg / har feber. Reply: God bedring! Cancel or move: aflyse, flytte, melde afbud. på + weekday = the coming one. Dates: den + ordinal (den tredje august). halv ti = 9.30 (halv counts towards the next hour). tror = you think it is a fact; synes = an opinion. Movement ned / ind; place nede / inde.',
      ex: ['Jeg har [feber].', '[På] fredag', 'den [tredje] august', '[halv] ti = 9.30'],
      try: { q: 'Klokken er 9.30. Den er halv ___.', right: 'ti', wrong: ['ni', 'tolv'], why: 'halv ti = 9.30.' } }),
    { screen: 'komplimenter', replay: true, id: 'Kalenderen', actor: 'fata', drunkFlag: 'smoke21', ask: 'Sig det.', askEn: 'Build the sentence.', sayBtn: 'Sig det', end: '.', n: 10, title: 'Kalenderen', sub: 'Alle melder afbud. Riffet må ikke stoppe.', rounds: KALENDER },
    { screen: 'card', title: 'Kapitel 23½', sub: 'I morgen tidlig, set fra Rullebusken', ms: 1600 },
    { screen: 'panel', scene: 'ruinen', cast: ['rulle'], lines: [
      { n: 'Tomorrow morning. A tumbleweed rolls into the ruin under the mammoth before anybody else. It rolls over a wallet. The wallet comes with it.' },
      { n: 'It rolls on into the hallway and stays there, very relaxed. It does not know what a wallet is.' },
    ] },
    { screen: 'panel', scene: 'oere', cast: ['slange'], lines: [
      { n: 'Back to Saturday night. The snake was never ill.' },
      { n: 'He was shedding his skin. A brand-new snake slides out of the old one, shiny and confused.' },
      L('slange', 'Hvad er det nu, vi spiller?', "What is it we're playing again?"),
      (st) => (sc(st, 'Kalenderen') >= 7 ? { n: 'Thanks to your calendar the rest of the concert is moved to next Friday at half past nine, between two of the mammoth’s naps.' }
        : { n: 'Your calendar puts the concert at the mammoth’s mealtime. The band is briefly swallowed, then politely returned.' }),
    ] },
    { screen: 'choice', scene: 'oere', cast: ['skarab'], who: 'svampen', prompt: 'Skarabæen: Én pibe til, så klarer du dagen.', options: (st) => (f(st).smoke21 ? [
      { da: 'Ja, en til.', set: { smoke22: true } },
      { da: 'Nej, i dag jeg ryger ikke.', set: { smoke22: true, misRyger2: true } },
      { da: 'Nej. I dag ryger jeg ikke.', set: { smoke22: false } },
      { en: '(EN) Not today.', set: { smoke22: true }, after: sour('skarab', 'Hvad? Nå. Her.', 'What? Well. Here.') },
    ] : [
      { da: 'Ja tak.', set: { smoke22: true } },
      { da: 'Nej tak.', set: { smoke22: false } },
      { da: 'Nej, jeg ikke ryger.', set: { smoke22: true, misRyger2: true } },
      { en: '(EN) No, thanks.', set: { smoke22: false }, after: sour('skarab', 'Engelsk igen. Nå.', 'English again. Well.') },
    ]) },
    { screen: 'panel', scene: 'oere', cast: ['fata', 'skarab'], lines: [
      (st) => (f(st).misRyger2 ? { n: '"Jeg … ryger" is all the beetle hears.' } : []),
      (st) => (f(st).smoke22 ? { n: f(st).smoke21 ? 'The second pipe is easier than the first. That is how it works.' : 'Your first pipe. The ear turns into a hall of mirrors.' }
        : f(st).smoke21 ? { n: 'You shake for an hour. The riff shakes with you. It does not stop.' } : { n: 'You stay sober and very tired. The riff does not stop.' }),
      L('fata', 'Grejet er væk. Det er nede i ruinen. I finder det i morgen tidlig.', 'The gear is gone. It is down in the ruin. You will find it tomorrow morning.'),
    ] },

    // ===== 23 · Ruinen
    { screen: 'card', ch: 23, title: 'Ruinen', sub: 'Kapitel 23', music: 'calm' },
    { screen: 'panel', scene: 'ruinen', cast: ['skarab'], lines: [
      { n: 'Under the mammoth there is a ruin. Inside the ruin there is … a house. An attic, a bedroom, a kitchen, a basement. And in the middle, humming, a loudspeaker the size of a barn.' },
      { n: 'The riff is coming from here. Not from the band. Not tonight. Not ever.' },
      L('skarab', 'Vi har spillet playback i ni hundrede år.', 'We have been miming for nine hundred years.'),
      L('skarab', 'Vi er stadig fire.', 'We are still four.'),
    ] },
    lesson({ who: 'skarab', scene: 'ruinen', title: 'Repetition: rum og ting', say: { da: 'Mine nøgler ligger ude i køkkenet. Jeg går ud og henter dem.', en: 'My keys are out in the kitchen. I will go out and get them.' },
      rule: 'Place (nothing moves): inde, ude, oppe, nede. Movement: ind, ud, op, ned. i køkkenet / i kælderen / i soveværelset / i stuen, but på loftet / på badeværelset. den (en-word), det (et-word), de / dem (plural; dem when you find or take them). min / mit / mine, egen / eget / egne. Vil du ikke …? – Jo, det skal jeg nok.',
      ex: ['De ligger [ude] i køkkenet.', 'Jeg går [ud] og henter [dem].', '[på] loftet', 'mit [eget] vand'],
      try: { q: 'Mine briller ligger oppe på loftet. Jeg går op og henter ___.', right: 'dem', wrong: ['den', 'de'], why: 'briller (plural), taken: dem.' } }),
    { screen: 'board', replay: true, id: 'Ruinen', mode: 'map', cols: 3, title: 'Ruinen', sub: 'Vælg selv rækkefølgen. Nogle døre åbner sig først senere.', tiles: ROOMS, requests: ASKS },
    { screen: 'panel', scene: 'ruinen', cast: ['skarab'], lines: [
      { n: 'The last thing, behind the curtain in the bathroom, was a bottle with your name on it. Water. Yours.' },
      L('skarab', 'Linje syv: Vandet er vores.', 'Line seven: The water is ours.'),
      { n: 'Your water has been cooling the loudspeaker since your first day. That is why you crackle.' },
      { n: 'You drink it back. You are soft again. The loudspeaker hums a little hotter.' },
      L('skarab', 'I morgen spiller du riffet selv. Riffet må ikke stoppe.', 'Tomorrow you play the riff yourself. The riff must not stop.'),
    ] },

    // ===== 24 · Riffet
    { screen: 'card', ch: 24, title: 'Riffet', sub: 'Kapitel 24', music: 'tense' },
    { screen: 'panel', scene: 'oere', cast: ['mammut', 'skarab'], lines: [
      { n: 'The concert. You stand where the loudspeaker was, and you squeeze, and the riff comes out of you. Words, mostly.' },
      { n: 'Halfway through, the mammoth opens one eye. It is not angry. It wants to hear the riff awake, for once.' },
      L('mammut', 'Spil.', 'Play.'),
    ] },
    { screen: 'choice', scene: 'oere', cast: ['skarab'], who: 'svampen', prompt: 'Skarabæen: Ryg det hele, så kan du spille for evigt.', options: (st) => [
      { da: 'Nej tak. Jeg kunne godt tænke mig at spiller det ædru.', set: { smoke24: true, misSpiller: true } },
      { da: 'Ja.', set: { smoke24: true } },
      f(st).smoke21 || f(st).smoke22 ? { da: 'Nej tak. Jeg kunne godt tænke mig at spille det ædru.', set: { smoke24: false } } : { da: 'Nej tak.', set: { smoke24: false } },
      { en: '(EN) No, thanks. I want to play it sober.', set: { smoke24: false }, after: sour('skarab', 'Nå. Så spil.', 'Well. Then play.') },
    ] },
    { screen: 'panel', scene: 'oere', cast: ['skarab'], lines: [
      (st) => (f(st).misSpiller ? { n: '"… spiller det …" The beetle only hears that you want to play, and hands you the pipe.' } : []),
      (st) => (f(st).smoke24 ? { n: 'You smoke it all. The sandstorm slows down. Every word arrives with a twin.' } : { n: 'You stay as you are. The sandstorm rises. The words come fast and honest.' }),
    ] },
    { screen: 'riff', replay: true, id: 'Riffet', highFlag: 'smoke24', need: 6, title: 'Riffet', sub: 'Fang kun det, der passer. Riffet må ikke stoppe.', waves: WAVES },
    { screen: 'panel', scene: 'klit', cast: ['mammut', 'skarab'], music: 'happy', lines: [(st) => outcomeLines(st)] },
    { screen: 'card', title: 'Fortsættes …', sub: 'Del 5 kommer', ms: 1600 },
    { screen: 'act', do: 'ranks' },
    { screen: 'end' },
  ];
  K.FLOW.push(...P4);

  const NEW = {
    alene: 'alone', fri: 'free', band: 'band', søger: 'look(s) for', roadie: 'roadie', roadies: 'roadies', løn: 'pay', lønnen: 'the pay', røg: 'smoke',
    laver: 'do(es), make(s)', gang: 'way (i gang med = busy with) / hallway', tænke: 'think (kunne godt tænke sig = would like)', dig: 'you (object)', mig: 'me', arbejde: 'work', firma: 'firm, company', bank: 'bank', hotel: 'hotel', avis: 'newspaper', hospital: 'hospital', opgaver: 'tasks', opgave: 'task', lave: 'do, make', musiker: 'musician', sang: 'song', lære: 'learn', lærer: 'teacher / learn(s)', dansk: 'Danish', svar: 'answer!', spørgsmålet: 'the question', arbejdede: 'worked', bror: 'brother', travlt: 'busy (have travlt)', spille: 'play', spiller: 'play(s)', svarer: 'answer(s)', kontrakten: 'the contract', passer: 'fit(s), suit(s) / look(s) after', fin: 'fine (adjective; after passer the adverb fint is needed)', fint: 'fine', penge: 'money', ansat: 'hired', starter: 'start(s)', klitten: 'the dune',
    kollegerne: 'the colleagues', knaser: 'crackle(s)', går: 'walk(s), go(es)', mammuttens: "the mammoth's", øre: 'ear', sovet: 'slept', ni: 'nine', hundrede: 'hundred', riffet: 'the riff', stopper: 'stop(s)', vågner: 'wake(s) up', linje: 'line', syv: 'seven', fire: 'four', altid: 'always', sent: 'late (for sent = too late)', tager: 'take(s)', maske: 'mask', af: 'off / of', faktisk: 'actually', ret: 'quite', arrogant: 'arrogant', ryger: 'smoke(s)', pibe: 'pipe', ruller: 'roll(s)', egen: 'own', forstærker: 'amplifier', mærke: 'feel', spejlsand: 'mirror sand', se: 'see', sjov: 'fun', sød: 'sweet', kedelig: 'boring', ingen: 'none, no', mærkelig: 'strange', tjekket: 'organised', højt: 'loudly, high', kigger: 'look(s)', forvirret: 'confused', forkølet: 'having a cold', tit: 'often', sur: 'grumpy', afslappet: 'relaxed', dygtig: 'skilled', glemmer: 'forget(s)', sange: 'songs', utjekket: 'disorganised', vej: 'way (på vej væk = on the way off)', væk: 'away, gone', hendes: 'her', hans: 'his', sin: 'his/her own', sine: 'his/her own (plural)', sit: 'his/her own (et-word)', læst: 'read (har læst)', låner: 'borrow(s)', skarabæens: "the scarab's", morganaens: "(Fata) Morgana's", lørdag: 'Saturday', fødselsdag: 'birthday', stor: 'big', koncert: 'concert',
    afbud: 'apologies (melde afbud = send apologies)', ringer: 'call(s)', desværre: 'unfortunately', feber: 'fever', febre: '(plural of feber; wrong here)', god: 'good', bedring: 'recovery (God bedring! = get well)', godt: 'well', bedre: 'better', synger: 'sing(s)', aflyse: 'cancel', aflyser: 'cancel(s)', mit: 'my (et-word)', min: 'my', flytte: 'move', flytter: 'move(s)', koncerten: 'the concert', fredag: 'Friday', klokken: 'the clock (klokken halv ti = at 9.30)', halv: 'half (halv ti = 9.30)', ti: 'ten', tolv: 'twelve', kalender: 'calendar', sover: 'sleep(s)', tredje: 'third', tre: 'three', tredte: '(wrong: tredje)', august: 'August', meldt: 'sent (meldt afbud)', melder: 'send(s) (melde afbud)', afbuddet: '(wrong here)', gået: 'gone', ned: 'down (movement)', nede: 'down (place)', kælderen: 'the basement', tror: 'think, believe (fact)', synes: 'think (opinion)', ved: 'know(s)', syg: 'ill', kalenderen: 'the calendar', ansatte: 'hired',
    ruinen: 'the ruin', grejet: 'the gear', finder: 'find(s)', tidlig: 'early', klarer: 'manage(s)', dagen: 'the day', til: 'to / more (en til = one more)', set: 'seen', rullebusken: 'the tumbleweed (invented name; standard: steppeløber)', playback: 'miming', stadig: 'still', nøgler: 'keys', ude: 'out (place)', ud: 'out (movement)', køkkenet: 'the kitchen', henter: 'fetch(es)', dem: 'them', de: 'they', loftet: 'the attic', op: 'up (movement)', oppe: 'up (place)', ind: 'in (movement)', inde: 'in (place)', soveværelset: 'the bedroom', stuen: 'the living room', gangen: 'the hallway', badeværelset: 'the bathroom', vand: 'water', eget: 'own (et-word)', egne: 'own (plural)', briller: 'glasses', høretelefoner: 'headphones', skind: 'skin', gamle: 'old (-e form)', gammel: 'old', pung: 'wallet', pungen: 'the wallet', handsker: 'gloves', skjulte: 'hidden', døre: 'doors', masken: 'the mask', åbner: 'open(s)', bag: 'behind', forhæng: 'curtain', ham: 'him', han: 'he', jo: 'yes (to a negative question)', nok: 'surely (skal nok = will, promise)', dine: 'your (plural)', din: 'your', her: 'here', skarabæen: 'the scarab (dung beetle)', ørkenræven: 'the fennec fox', klapperslangen: 'the rattlesnake', geden: 'the goat', mammutten: 'the mammoth',
    hus: 'house', ting: 'thing(s)', taske: 'bag', rygsæk: 'backpack', paraply: 'umbrella', kok: 'cook', kollega: 'colleague', tjener: 'waiter', job: 'job', journalist: 'journalist', programmør: 'programmer', læge: 'doctor', kælder: 'basement', hue: 'woolly hat', influenza: 'flu', loft: 'attic', bas: 'bass', ur: 'watch', kamera: 'camera', mine: 'my (plural)', rigtige: 'right (-e form)', kun: 'only', melde: 'send (melde afbud)', fang: 'catch!', evigt: 'forever', hele: 'whole (det hele = all of it)', ædru: 'sober', spil: 'play!', ryge: 'smoke', danser: 'dance(s)', svampen: 'the sponge', og: 'and',
    lærte: 'learned', lavet: 'done, made', flaske: 'bottle', står: 'stand(s)', spillet: 'played',
    meget: 'very, much', fata: '(Fata Morgana: a mirage)', morganaen: '(Fata Morganaen: the mirage)', kontrakt: 'contract', ræven: 'the fox', spillet: 'played', vores: 'ours, our', stoppe: 'stop', ryg: 'smoke!', burde: 'ought to (burde være = should be)', død: 'dead', selv: 'yourself, self',
    vi: 'we', er: 'am, are, is', jeg: 'I', du: 'you', det: 'it, that / the (et-word)', den: 'it / the (en-word)', nu: 'now', hvad: 'what', hvor: 'where', hvorfor: 'why', ikke: 'not', noget: 'something', ja: 'yes', nej: 'no', tak: 'thanks', kan: 'can', vil: 'want(s), will', har: 'have, has', ligger: 'lie(s), is (located)', siger: 'say(s)', spørger: 'ask(s)', morgen: 'morning (i morgen = tomorrow)',
  };
  const OVERRIDE = ['gang', 'passer'];
  Object.entries(NEW).forEach(([k, v]) => { if (v && (!(k in K.DICT) || OVERRIDE.includes(k))) K.DICT[k] = v; });
})(window.K = window.K || {});
