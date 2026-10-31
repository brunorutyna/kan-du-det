// TØRLAGT · DEL 3: KAFFEHAVET. SPOILERS. Chapters 15–19: a review of every topic from chapters 1–14,
// built for ONE playthrough: every chapter ends promising one thing and the next does something else.
// Design: claude/toerlagt-del3.md (§16–17 are the final structure). Creatures only; invented places; adult themes dry.
(function (K) {
  'use strict';
  const L = (w, da, en) => ({ w, da, en });
  const lesson = (o) => Object.assign({ screen: 'lesson', replay: true }, o);
  const sc = (st, id) => ((st.tally || {})[id] || { ok: 0 }).ok;
  const miss = (st, id) => { const t = (st.tally || {})[id]; return t ? t.n - t.ok : 0; };
  const sour = (w, da, en) => [L(w, da, en)];
  const f = (st) => st.flags || {};
  // what you soaked, in the order the story offers it; thirst = how many
  const SOAKS = ['kaffe3', 'blaek', 'dug', 'gele'];
  const thirst = (st) => SOAKS.filter((k) => f(st)[k]).length;

  Object.assign(K.CAST, {
    yngel: { name: 'Yngelen', e: '🐛🐛🐛', color: '#d9c36b', pitch: 1.9 },
    pupper: { name: 'En puppe', e: '🫘', color: '#b59a7a', pitch: 1.8 },
    unge: { name: 'Børnene', e: '🐜🐜🐜', color: '#c0703f', pitch: 1.8 },
    blaek: { name: 'Blæksprutten', e: '🐙', color: '#5a3f8f', pitch: 0.75 },
    kylling: { name: 'Fårekyllingen', e: '🦗', color: '#7aa63f', pitch: 1.4 },
    moel: { name: 'Natsværmeren', e: '🦋', color: '#9a8fb5', pitch: 1.1 },
  });
  Object.assign(K.SCENES, {
    strand: { from: '#6b4423', to: '#1f120a', label: 'Kaffehavet' },
    undervand: { from: '#2a1a10', to: '#05030a', label: 'Under havet' },
    rev: { from: '#2b1846', to: '#07040d', label: 'Revet', trip: true },
    oerkentue: { from: '#d39a54', to: '#5a3416', label: 'Tuen i ørkenen' },
    daggry: { from: '#f2a65a', to: '#3b2a4f', label: 'Daggry' },
  });
  K.CHAPTERS.push(
    { title: 'Klækningen', topic: 'repetition: farver · flertal' },
    { title: 'Revet', topic: 'repetition: den/det/de · en af · lilla, små' },
    { title: 'Værtsgruppen', topic: 'repetition: Sikke! · Kan du det?! · for' },
    { title: 'Tuen kommer', topic: 'repetition: kom! · datid · kan, vil, må' },
    { title: 'Sværmen', topic: 'repetition: tid · da/når · hvis/om · dine fejl' },
  );

  // ---------- content
  const nv = (e, prompt, right, wrong, why, extra) => Object.assign({ e, prompt, right, wrong, why }, extra || {});
  const NAVNE = [
    nv('🟢🐛', 'Hvad ser du?', 'en grøn larve', ['en grønt larve', 'et grøn larve'], 'en larve: no ending on the adjective.'),
    nv('⚪🥚', 'Hvad ser du?', 'et hvidt æg', ['et hvid æg', 'en hvidt æg'], 'et æg: hvid → hvidt.', { who: 'yngel', say: 'Hvor er min krone?' }),
    nv('🟡🐛🐛🐛', 'Hvad ser du?', 'nogle gule larver', ['nogle gul larver', 'nogle gule larve'], 'Plural: gul → gule, larve → larver.'),
    nv('🥚🥚', 'et æg – to …?', 'to æg', ['to æger', 'to æge'], 'æg has no plural ending.'),
    nv('👶👶', 'et barn – to …?', 'to børn', ['to barner', 'to barne'], 'barn → børn (irregular).', { who: 'yngel', say: 'Kom her og hjælp mig!' }),
    nv('🐜🐜', 'en myre – to …?', 'to myrer', ['to myre', 'to myrere'], 'myre → myrer (+r).'),
    nv('🔵🐛🐛', 'Hvad ser du?', 'to blå larver', ['to blåt larver', 'to blå larve'], 'blå: no -t in the plural; larve → larver.'),
    nv('🐜🐜🤏', 'Hvad ser du? (små)', 'to små myrer', ['to lille myrer', 'to små myre'], 'lille → små in the plural.', { who: 'yngel', say: 'Du må ikke lyve.' }),
    nv('⚫🥚🥚', 'Hvad ser du?', 'to sorte æg', ['to sort æg', 'to sorte æger'], 'Plural: sort → sorte; æg stays æg.'),
  ];

  const BLAEK = [
    ['den gamle sten', 'den gammel sten', '🪨'], ['mit store skib', 'mit stort skib', '🚢'], ['det hvide skib', 'det hvidt skib', '⛵'],
    ['min gamle hat', 'min gammel hat', '🎩'],
    ['et lilla skib', 'et lillat skib', '🟣'], ['de små fisk', 'de lille fisk', '🐟'], ['de grå sten', 'de gråt sten', '🪨'], ['et orange tæppe', 'et oranget tæppe', '🟠'],
    ['en af larverne', 'en af larver', '🐛'], ['et af æggene', 'en af æggene', '🥚'], ['en af fiskene', 'et af fiskene', '🐟'],
  ];

  const rx = (who, say, cue, right, wrong, why) => ({ who, say, cue, right, wrong, why });
  const gp = (who, say, prompt, right, wrong, why) => ({ who, say, prompt, right, wrong, why });
  const VAERT = [
    rx('kamel', 'Jeg kan godt lide mine fugle.', '❗', 'Kan du det?!', ['Kan du ikke?!', 'Er du det?!'], 'Surprise keeps the polarity: kan godt → Kan du det?!'),
    rx('skorpion', 'Jeg er ikke træt af komplimenter.', '❗', 'Er du ikke?!', ['Er du det?!', 'Kan du ikke?!'], 'er ikke → Er du ikke?!'),
    rx('kaktus', 'Jeg synes, ørkenen er smuk.', '❗', 'Synes du det?!', ['Synes du ikke?!', 'Er du det?!'], 'synes → Synes du det?!'),
    rx('kamel', 'Jeg er træt.', '🤝', 'Det er jeg også.', ['Det er jeg heller ikke.', 'Det kan jeg også.'], 'Agree with a positive sentence: også.'),
    rx('skorpion', 'Jeg kan ikke sove.', '🤝', 'Det kan jeg heller ikke.', ['Det kan jeg også.', 'Det er jeg heller ikke.'], 'Agree with a negative sentence: heller ikke.'),
    rx('kaktus', 'Jeg er vild med stilhed.', '🤝', 'Det er jeg også.', ['Det kan jeg også.', 'Det er jeg heller ikke.'], 'er vild med → Det er jeg også.'),
    gp('kaktus', 'Hvad med dig?', 'Jeg ___ godt lide pupper.', 'kan', ['er', 'vil'], 'kan godt lide = like.'),
    gp('skorpion', 'Sig noget pænt om mine nye sko!', 'Sikke nogle ___ sko!', 'flotte', ['flot', 'flotter'], 'Sikke nogle + adjective with -e.'),
    gp('skorpion', 'Se mit æg!', 'Sikke et ___ æg!', 'stort', ['store', 'stor'], 'Sikke et + adjective with -t.'),
    gp('kamel', 'Der er mange fugle i min pukkel.', 'Puklen er lidt for ___.', 'lille', ['små', 'lidt'], 'One hump: lille. (små is plural.)'),
    gp('kaktus', 'Se pupperne.', 'De er alt for ___.', 'små', ['lille', 'småe'], 'Plural: små.'),
  ];

  const fr = (e, en, answers, traps, why, end) => ({ e, en, answers, traps, why, end: end || '.', drunk: 'lyserød' });
  const FRIERNE = [
    fr('🦗', 'Come with me!', ['Kom med mig'], ['komme', 'kommer'], 'An order: the stem, kom!', '!'),
    fr('🦗', "Don't touch my wings!", ['Rør ikke mine vinger', 'Rør ikke ved mine vinger'], ['røre', 'rører'], 'An order: rør! (not røre / rører).', '!'),
    fr('🦗', 'Every day I eat ten cakes.', ['Hver dag spiser jeg ti kager', 'Jeg spiser ti kager hver dag', 'Ti kager spiser jeg hver dag'], ['spise', 'spis'], 'Present: spiser. After "Hver dag" the verb comes first.'),
    fr('🦋', 'Yesterday I danced for you.', ['I går dansede jeg for dig', 'Jeg dansede for dig i går', 'For dig dansede jeg i går'], ['danser', 'dansed'], 'danse → dansede (-ede).'),
    fr('🦋', 'Yesterday I drove all night.', ['I går kørte jeg hele natten', 'Jeg kørte hele natten i går', 'Hele natten kørte jeg i går'], ['kørede', 'kører'], 'køre → kørte (-te).'),
    fr('🦋', 'Yesterday I remembered your name.', ['I går huskede jeg dit navn', 'Jeg huskede dit navn i går', 'Dit navn huskede jeg i går'], ['huskte', 'husker'], 'huske → huskede (-ede).'),
    fr('🐜', 'I can fly high.', ['Jeg kan flyve højt', 'Højt kan jeg flyve'], ['at', 'flyver'], 'kan + infinitive, no "at".'),
    fr('🐜', 'I want to carry your eggs.', ['Jeg vil bære dine æg', 'Dine æg vil jeg bære'], ['at', 'bærer'], 'vil + infinitive.'),
    fr('🐜', 'You must not say no.', ['Du må ikke sige nej', 'Nej må du ikke sige'], ['at', 'siger'], 'må ikke + infinitive.'),
  ];

  const sv = (prompt, right, wrong, why, extra) => Object.assign({ e: '🐜', who: 'unge', prompt, right, wrong, why }, extra || {});
  const SVAERM = [
    sv('Vi flyver ___ fredag.', 'på', ['om', 'for'], 'på fredag = this coming Friday.'),
    sv('Æggene kom ___ tre dage siden.', 'for', ['i', 'om'], 'for … siden = ago.'),
    sv('Myrer arbejder ___ dagen.', 'om', ['for', 'til'], 'om dagen = in the daytime (every day).'),
    sv('Jeg husker det: ___ jeg var et æg, var det mørkt.', 'Da', ['Når', 'Hvis'], 'One time in the past: da.'),
    sv('Hvis du vil, ___ bo her.', 'kan du', ['du kan', 'kan'], 'After a hvis-clause the verb comes first: kan du.'),
    sv('Jeg ved ikke, ___ far kommer.', 'om', ['hvis', 'da'], 'Whether, after "ved ikke": om.', { must: true, flag: 'pupa', say: 'Jeg ved ikke, om far kommer.' }),
    sv('Sikke nogle ___ vinger!', 'flotte', ['flot', 'flottes'], 'Sikke nogle + -e.'),
    sv('Vingerne er lidt for ___.', 'store', ['stor', 'stort'], 'Plural subject: store.'),
  ];
  // when the player has fewer than four old mistakes on record, these stand in for them
  const FALLBACK = [
    sv('I går ___ hun til dig.', 'smilede', ['smilte', 'smiler'], 'smile → smilede.'),
    sv('Jeg kan se en af ___.', 'larverne', ['larver', 'larvene'], 'en af + the definite plural.'),
    sv('___ ikke dronningen!', 'Rør', ['Røre', 'Rører'], 'An order: rør!'),
    sv('Der er to ___ æg.', 'hvide', ['hvidt', 'hvid'], 'Plural: hvide.'),
  ];

  // ---------- your own old mistakes (new system): an index of self-contained rounds from parts 1–2
  K.historyIndex = function () {
    const idx = {}, end = K.part3Start();
    K.FLOW.forEach((step, i) => {
      if (i >= end || step.screen !== 'quiz' || !step.rounds) return;
      if (step.variant === 'firbenet' || step.variant === 'puklen' || step.variant === 'review') return; // their answer depends on a colour
      step.rounds.forEach((r) => {
        if (r.col || r.lieCol || !r.right || idx[r.right]) return;
        idx[r.right] = { r, ch: K.chapterOf(i), cast: step.cast || [], fixed: step.fixed };
      });
    });
    return idx;
  };
  K.historyKeys = function (missed) {
    const idx = K.historyIndex();
    return Object.entries(missed || {}).filter(([k, n]) => idx[k] && n > 0).sort((a, b) => b[1] - a[1] || idx[a[0]].ch - idx[b[0]].ch).slice(0, 4).map(([k]) => k);
  };
  K.historyRounds = function (keys) {
    const idx = K.historyIndex();
    return (keys || []).filter((k) => idx[k]).map((k) => {
      const h = idx[k];
      return Object.assign({}, h.r, { must: true, cast: h.r.cast || (h.r.who ? [] : h.cast), prompt: h.r.prompt || 'Hvad svarer du?', hint: `Det sagde du forkert i kapitel ${h.ch}` });
    });
  };
  const swarmRounds = (st, authored) => {
    const hist = K.historyRounds((st && st.hist) || []);
    return hist.concat(FALLBACK.slice(0, Math.max(0, 4 - hist.length)), authored);
  };

  // ---------- endings of part 3 (open)
  const lastSoak = (st) => ['dug', 'blaek', 'kaffe3'].find((k) => f(st)[k]);
  K.colonyOf = function (st) {
    if (f(st).gift) return 'Prinsgemalen';
    const n = ['kaffe3', 'blaek', 'dug'].filter((k) => f(st)[k]).length;
    if (n >= 3) return 'Kolonien Alt';
    const last = lastSoak(st);
    if (last === 'dug') return 'Kolonien Dug';
    if (last === 'blaek') return 'Kolonien Blæk';
    if (last === 'kaffe3') return 'Kolonien Kaffe';
    return 'Kolonien Tør';
  };
  const MOTTO = {
    Prinsgemalen: 'Vi arbejder for mor.', 'Kolonien Alt': 'Vi vil have det hele.', 'Kolonien Dug': 'Vi ser alle farver.',
    'Kolonien Blæk': 'Vi skriver på alt.', 'Kolonien Kaffe': 'Vi sover aldrig.', 'Kolonien Tør': 'Vi er tørre. Det er fint.',
  };
  const wrongMotto = (st) => {
    const x = f(st);
    if (x.misSuger) return 'Vi vil ikke suger.';
    if (x.misFlew) return 'Vi flyvede altid.';
    if (x.misGift) return 'Vi vil gifter os.';
    if (x.misBo) return 'Vi skal bor, hvor vi vil.';
    if (x.pupa === false) return 'Vi kommer altid for sen.';
    return 'Vi drikke kaffe om natten.';
  };
  K.mottoOf = (st) => (K.accuracy(st) >= 0.8 ? { da: MOTTO[K.colonyOf(st)], ok: true } : { da: wrongMotto(st), ok: false });
  const colonyLines = (st) => {
    const c = K.colonyOf(st), x = f(st), out = [];
    if (c === 'Prinsgemalen') out.push({ n: 'You become prince consort. You sit on a small throne in the anthill and soak up sugar water all day. Your children work for their mother. They still call you far.' }, L('kaktus', 'Nå.', 'Well. (on a postcard)'));
    else if (c === 'Kolonien Alt') out.push({ n: 'The colony wants everything at once: coffee, ink, dew. They build a city in one night, paint it every colour, and nobody ever sleeps in it.' });
    else if (c === 'Kolonien Dug') out.push({ n: 'The colony is pink with white dots. They see colours that are not there and name them all, correctly.' });
    else if (c === 'Kolonien Blæk') out.push({ n: 'The colony writes on everything: on stones, on leaves, on each other. Nobody can read it. Everybody agrees with it.' });
    else if (c === 'Kolonien Kaffe') out.push({ n: 'The colony never sleeps. It finishes a city before breakfast and starts another one out of boredom.' });
    else out.push({ n: 'The colony is dry, punctual and slightly boring. The cactus visits once.' }, L('kaktus', 'Nå. Det er godt.', 'Well. That is good.'));
    if (x.boMig) out.push({ n: 'They live in you. Four thousand small tenants. You are a building now.' });
    else if (x.boLejr) out.push({ n: 'They settle in the camp. The hosts’ circle gets a lot bigger.' });
    else if (x.boTue) out.push({ n: 'They walk back to the anthill with their mother.' });
    else out.push({ n: 'They settle on the beach of the coffee sea, within smelling distance.' });
    const m = K.mottoOf(st);
    out.push({ n: 'The colony carves its first motto into a stone:' }, L('unge', m.da, m.ok ? 'Correct Danish.' : 'It has a mistake in it. It is carved in stone. It stays.'));
    return out;
  };
  K.CONFIG.endNote = (st) => (st.part === 3 ? `${K.colonyOf(st)} · «${K.mottoOf(st).da}»` : '');

  // ---------- the flow of part 3
  const P3 = [
    // ===== 15 · Klækningen
    { screen: 'card', ch: 15, part3: true, title: 'Del 3', sub: 'Kaffehavet', music: 'calm' },
    { screen: 'panel', scene: 'strand', cast: ['svampen'], lines: [
      { n: 'Last stop. A beach of brown sand, a sea of hot coffee, steam everywhere. You have not soaked up a drop. Yet.' },
      { n: 'Then you start to itch. Everywhere. In every hole at once.' },
    ] },
    lesson({ who: 'formand', scene: 'strand', title: 'Repetition: flertal og farver', say: { da: 'Husk: en larve, to larver. Et æg, to æg. Et barn, to børn.', en: 'Remember: one larva, two larvae. One egg, two eggs. One child, two children.' },
      rule: 'Plural: +er / +r (larve → larver), +e (hund → hunde), or nothing (æg → æg); some are irregular (barn → børn). Adjectives: en grøn larve · et grønt æg · to grønne larver. blå, grå, lilla and orange never get -e; lille becomes små.',
      ex: ['en grøn larve – to grøn[ne] larve[r]', 'et hvid[t] æg – to hvid[e] æg', 'en lille myre – to [små] myre[r]'],
      try: { e: '👶', q: 'et barn – to ___', right: 'børn', wrong: ['barner', 'barne'], why: 'barn → børn.' } }),
    { screen: 'panel', scene: 'strand', cast: ['yngel'], music: 'tense', lines: [
      { n: 'Four thousand eggs hatch out of you at once. Small, pale, wriggling. Every one of them looks at you.' },
      L('yngel', 'Far! Far! Far!', 'Dad! Dad! Dad!'),
      { th: 'Far. That is new.' },
      L('yngel', 'Vi har hørt alt. Inde i dig. Alt, hvad du sagde.', 'We heard everything. Inside you. Everything you said.'),
    ] },
    { screen: 'choice', scene: 'strand', cast: ['yngel'], who: 'svampen', prompt: 'Yngelen: Fløj du med dronningen?', options: [
      { da: 'Ja, jeg fløj.', set: { flew: true } },
      { da: 'Ja, jeg flyvede.', set: { flew: true, misFlew: true } },
      { da: 'Nej, jeg fløj ikke.', set: { flew: false } },
      { en: '(EN) I flew with her, yes.', set: { flew: true }, after: sour('yngel', 'Hvad betyder det?', 'What does that mean?') },
    ] },
    { screen: 'panel', scene: 'strand', cast: ['yngel'], lines: [
      (st) => (f(st).misFlew ? [L('yngel', 'Flyvede! Flyvede!', '(wrong: fløj)'), { n: 'They love the word. It is wrong. They keep it.' }] : []),
      (st) => (f(st).flew ? { n: 'That explains the eggs. Somewhere above the Nectar Bar, between two males and a queen, something was laid in a sponge.' }
        : [{ n: 'You did not fly. You remember a sticky night at the Nectar Bar and a queen who was very awake.' }, L('yngel', 'Mor sagde: Du havde så mange huller. Det var praktisk.', 'Mum said: You had so many holes. It was practical.')]),
      { n: 'They want to be named. All of them. Right now.' },
    ] },
    { screen: 'quiz', replay: true, id: 'Navnene', variant: 'scene', cast: ['yngel'], pileRight: true, pileWrong: '〰️', n: 9, title: 'Navnene', sub: 'Sig, hvad du ser. Forkerte navne bliver hængende.', rounds: NAVNE },
    { screen: 'panel', scene: 'strand', cast: ['yngel'], lines: [
      (st) => (sc(st, 'Navnene') >= 6 ? [L('yngel', 'Tak, far.', 'Thanks, Dad.'), { n: 'They call you far. Correctly. It is more moving than you expected.' }]
        : [L('yngel', 'Tak, farer!', 'Thanks, dangers! (they mean fædre, dads)'), { n: 'Half of them now call you "farer". You let it go.' }]),
    ] },
    { screen: 'choice', scene: 'strand', cast: ['yngel'], who: 'svampen', prompt: 'Yngelen: Far, vi er tørstige. Havet er kaffe.', options: [
      { da: 'Nej. Vi bliver tørre.', set: { kaffe3: false } },
      { da: 'Ja. Vi suger.', set: { kaffe3: true } },
      { da: 'Nej, vi vil ikke suger.', set: { kaffe3: true, misSuger: true } },
      { en: "(EN) No. We stay dry.", set: { kaffe3: false }, after: sour('yngel', 'Hvad betyder det? … Okay, far.', 'What does that mean? … OK, Dad.') },
    ] },
    { screen: 'panel', scene: 'strand', cast: ['yngel', 'tusind'], lines: [
      (st) => (f(st).misSuger ? { n: '"Suger" is the only word they catch. Four thousand larvae roll into the sea, and you go with them.' } : []),
      (st) => (f(st).kaffe3 ? [{ n: 'You lie down in the coffee. You soak. They soak. Four thousand small hearts go very fast.' }, L('yngel', 'MERE! MERE! MERE!', 'MORE! MORE! MORE!')]
        : [{ n: 'You crawl up on a dry rock and stay there. They complain for an hour, in correct plurals.' }]),
      { n: 'A long green train comes along the beach, on a hundred legs.' },
      L('tusind', 'Næste stop: Tuen. Dronningen venter.', 'Next stop: the anthill. The queen is waiting.'),
    ] },

    // ===== 16 · Revet
    { screen: 'card', ch: 16, title: 'Revet', sub: 'Kapitel 16', music: 'tense' },
    { screen: 'panel', scene: 'undervand', cast: ['tusind', 'grib'], lines: [
      { n: 'The train does not turn towards the anthill. It turns towards the sea, and keeps going. Coffee comes up to the windows.' },
      L('tusind', 'Om tirsdagen kører jeg under havet. Det står i køreplanen.', 'On Tuesdays I run under the sea. It is in the timetable.'),
      (st) => (f(st).kaffe3 ? { n: 'The larvae drink the window. You have to hold them back.' } : []),
      { n: 'The vulture flies low over the sinking train and shouts through the last dry window.' },
      L('grib', 'Du drikkede blæk dér! Og tuen gåede over ørkenen. Og du blev gifted!', 'You drinked ink there! And the anthill goed across the desert. And you got marrieded!'),
    ] },
    { screen: 'choice', scene: 'undervand', cast: ['grib'], who: 'svampen', prompt: 'Gribben: Du drikkede blæk dér!', options: [
      { da: 'Nej. Jeg drakkede ikke blæk.', set: { misGrib: true } },
      { da: 'Nej. Jeg drak ikke blæk.', set: { retGrib: true } },
      { en: '(EN) I have never been there.', set: {}, after: sour('grib', 'Jeg taler ikke engelsk. Jeg flyver.', "I don't speak English. I fly.") },
    ] },
    { screen: 'panel', scene: 'rev', cast: ['grib', 'blaek'], music: 'trip', lines: [
      (st) => (f(st).misGrib ? { n: 'The vulture nods. "Drakkede. Ja." He is delighted to be agreed with.' } : []),
      L('grib', 'Ikke endnu.', 'Not yet.'),
      { n: 'The train stops on a reef of black ink. An octopus sits on it, writing in the water. Every word she says floats up in ink.' },
      L('blaek', 'Velkommen. Jeg sælger blæk. Et glas, og du ser ordene, som de er.', 'Welcome. I sell ink. One glass, and you see the words as they are.'),
    ] },
    { screen: 'choice', scene: 'rev', cast: ['blaek'], who: 'svampen', prompt: 'Blæksprutten: Et glas blæk?', options: (st) => (thirst(st) ? [
      { da: 'Ja tak.', set: { blaek: true } },
      { da: 'Nej. I dag vi drikker ikke noget.', set: { blaek: true, misBlaek: true } },
      { da: 'Nej. I dag drikker vi ikke noget.', set: { blaek: false } },
      { da: 'Ja, jeg vil drikker.', set: { blaek: true, misBlaek: true } },
      { en: '(EN) No, thanks.', set: { blaek: true }, after: sour('blaek', 'Jeg forstår kun blæk. Værsgo.', 'I only understand ink. Here you go.') },
    ] : [
      { da: 'Ja, jeg vil drikker.', set: { blaek: true, misBlaek: true } },
      { da: 'Nej tak.', set: { blaek: false } },
      { da: 'Ja tak.', set: { blaek: true } },
      { en: '(EN) No, thanks.', set: { blaek: false }, after: sour('blaek', 'Engelsk? Det kan man ikke skrive i kaffe.', "English? You can't write that in coffee.") },
    ]) },
    { screen: 'panel', scene: 'rev', cast: ['blaek', 'yngel'], lines: [
      (st) => (f(st).misBlaek ? { n: 'All the larvae hear is "drikker". The octopus hears it too, and pours.' } : []),
      (st) => (f(st).blaek ? [{ n: 'The ink tastes of nothing, and then of everything. Words come loose from the things they belong to and float.' }, L('yngel', 'Far, ordene svømmer!', 'Dad, the words are swimming!')]
        : thirst(st) ? [{ n: 'You say no. The larvae cry ink-coloured tears for exactly as long as it takes to be annoying. You hold on.' }]
          : [{ n: 'You say no. The octopus writes "nej" in the water and watches it sink.' }]),
      { n: 'Ink or no ink, the reef does not hold still. Labels drift past. Most of them lie.' },
    ] },
    lesson({ who: 'blaek', scene: 'rev', title: 'Repetition: den/det/de · en af · lilla, små', say: { da: 'Den gamle sten. Det lilla skib. De små fisk. En af fiskene.', en: 'The old stone. The purple ship. The small fish. One of the fish.' },
      rule: 'After den / det / de and min / mit / mine the adjective gets -e: den gamle sten, mit store skib. blå, grå, lilla and orange never change; lille becomes små in the plural; gammel becomes gamle. en af / et af + the definite plural: en af fiskene, et af æggene.',
      ex: ['den gaml[e] sten', 'det [lilla] skib', 'de [små] fisk', 'et af æg[gene]'],
      try: { e: '🐟', q: 'en af ___', right: 'fiskene', wrong: ['fisk', 'fiskenes'], why: 'en af + the definite plural: fiskene.' } }),
    { screen: 'trippet', replay: true, id: 'Blækket', title: 'Blækket', sub: 'Fang de sande ord. Løgnene spreder blæk.', need: 9, calm: (st) => !f(st).blaek, pairs: BLAEK },
    { screen: 'panel', scene: 'rev', cast: ['blaek'], lines: [
      (st) => (miss(st, 'Blækket') <= 2 ? { n: 'The octopus writes one word on your side, in ink that will not wash off: RIGTIGT.' }
        : { n: 'The octopus writes one word on your side, in ink that will not wash off. She spells it RIGTIKT. She does not correct it.' }),
      L('blaek', 'Kender du dronningen? Hun var min. Før hun fik en krone.', 'Do you know the queen? She was mine. Before she got a crown.'),
      L('blaek', 'Jeg kender vejen til hende.', 'I know the way to her.'),
      { n: 'She wraps eight arms around you, very gently, and swims.' },
    ] },

    // ===== 17 · Værtsgruppen
    { screen: 'card', ch: 17, title: 'Værtsgruppen', sub: 'Kapitel 17', music: 'calm' },
    { screen: 'panel', scene: 'lejr', cast: ['kaktus', 'pupper'], lines: [
      { n: 'You wake up in warm sand. You know this circle. On your chest, a note in ink:' },
      L('blaek', 'Du skal ikke til en dronning. Du skal i gruppen.', 'You are not going to a queen. You are going to the group.'),
      { n: 'The brood is very quiet. Overnight they have turned into pupae. Four thousand small beans.' },
      L('kaktus', 'Pupper siger ikke noget. De lytter.', 'Pupae do not say anything. They listen.'),
    ] },
    lesson({ who: 'kaktus', scene: 'lejr', title: 'Repetition: Sikke …! · Kan du det?! · for', say: { da: 'Sikke nogle stille pupper. De er lidt for stille. Det er jeg også.', en: 'What quiet pupae. They are a bit too quiet. So am I.' },
      rule: 'Sikke en / et / nogle + adjective + noun (Sikke et stort æg!). A surprised reaction keeps the polarity: Jeg kan godt … – Kan du det?! · Jeg er ikke … – Er du ikke?! Agree: Det er jeg også. / Det kan jeg heller ikke. for + adjective = too: lidt for stor, alt for små.',
      ex: ['Sikke [et] stor[t] æg!', 'Jeg er træt. – Det er jeg [også].', 'Jeg kan ikke sove. – Det kan jeg [heller ikke].', 'Den er [lidt for] lille.'],
      try: { q: 'Jeg kan ikke lide sand. – Det kan jeg ___.', right: 'heller ikke', wrong: ['også', 'ikke også'], why: 'Agreeing with a negative: heller ikke.' } }),
    { screen: 'panel', scene: 'lejr', cast: ['kamel', 'skorpion', 'kaktus'], lines: [
      { n: 'This is Værtsgruppen: a circle for creatures with something living inside them. You are the newest member.' },
      L('kamel', 'Jeg har en rede i min pukkel. Fugle. De synger om natten.', 'I have a nest in my hump. Birds. They sing at night.'),
      L('skorpion', 'Jeg har ikke noget indeni. Jeg kommer for komplimenterne.', 'I have nothing inside. I come for the compliments.'),
      { n: 'A small bird looks out of the cactus’s arm. He does not mention it.' },
    ] },
    { screen: 'quiz', replay: true, id: 'Værtsmødet', variant: 'gruppen', n: 11, title: 'Værtsmødet', sub: 'Reager rigtigt. Gruppen stemmer bagefter.', rounds: VAERT },
    { screen: 'panel', scene: 'lejr', cast: ['flue'], music: 'tense', lines: [
      { n: 'After the meeting a mushroom sits down next to you. She is not red any more. She is pale pink, as if she has been washed many times.' },
      L('flue', 'Hej, fætter. Én dråbe til de små? Deres første tur.', 'Hi, cousin. One drop for the little ones? Their first trip.'),
    ] },
    { screen: 'choice', scene: 'lejr', cast: ['flue'], who: 'svampen', prompt: 'Fluesvampen: Én dråbe dug?', options: (st) => [
      { da: 'Ja, en dråbe.', set: { dug: true } },
      { da: 'Nej, de er for lille.', set: { dug: true, misDug: true } },
      thirst(st) ? { da: 'Nej. I dag får de ikke noget.', set: { dug: false } } : { da: 'Nej. De er for små.', set: { dug: false } },
      { en: '(EN) No. They are too small.', set: { dug: false }, after: sour('flue', 'Du taler ikke dansk i dag, fætter.', 'You are not speaking Danish today, cousin.') },
    ] },
    { screen: 'panel', scene: 'nat', cast: ['flue', 'kaktus', 'pupper'], lines: [
      (st) => (f(st).misDug ? { n: '"For lille" — one of them is too small? She shrugs and gives the drop to the biggest one, who shares.' } : []),
      (st) => (f(st).dug ? [{ n: 'One drop. Four thousand pupae turn pink with white dots. Somewhere inside them, music starts.' }, L('flue', 'Tak. Nu ved jeg det.', 'Thanks. Now I know.'), L('flue', 'Jeg har været tør i tre uger. Dråben var en test. Af mig. Ikke af dig.', 'I have been dry for three weeks. The drop was a test. Of me. Not of you.')]
        : [L('flue', 'Jeg har været tør i tre uger. Dråben var en test. Af mig. Ikke af dig.', 'I have been dry for three weeks. The drop was a test. Of me. Not of you.'), { n: 'She looks at the little bottle for a long time. Then she pours it into the sand.' }]),
      (st) => (sc(st, 'Værtsmødet') >= 7 ? L('kaktus', 'Gruppen har stemt. Du må sove i cirklen.', 'The group has voted. You may sleep in the circle.')
        : L('kaktus', 'Gruppen har stemt. Du sover udenfor. I sandet.', 'The group has voted. You sleep outside. In the sand.')),
      { n: 'In the dark, one pupa says one sentence, very clearly.' },
      L('pupper', 'Jeg ved ikke, om far kommer.', "I don't know if Dad is coming."),
      { n: 'Then nothing again.' },
      L('kaktus', 'I næste uge taler vi om grænser.', 'Next week we will talk about boundaries.'),
    ] },

    // ===== 18 · Tuen kommer
    { screen: 'card', ch: 18, title: 'Tuen kommer', sub: 'Kapitel 18', music: 'tense' },
    { screen: 'panel', scene: 'oerkentue', cast: ['unge', 'myre', 'dronning'], lines: [
      (st) => (sc(st, 'Værtsmødet') >= 7 ? { n: 'At dawn the ground shakes. An anthill the size of a hill walks over the dune on a million legs and sits down around the circle. You are in the middle of it. Around you stand four thousand young ants: your children, grown overnight.' }
        : { n: 'At dawn the ground shakes. An anthill the size of a hill walks over the dune on a million legs and sits down on top of you. Your children dig you out. They are ants now. Overnight.' }),
      L('myre', 'Hvor yngelen er, dér er tuen.', 'Where the brood is, there is the anthill.'),
      (st) => (f(st).flew ? L('dronning', 'Du burde være død. Hannerne dør efter flyvningen. Det står i kontrakten.', 'You should be dead. The males die after the flight. It is in the contract.')
        : L('dronning', 'Du er her stadig. Og mine børn har boet i dig.', 'You are still here. And my children have lived in you.')),
      (st) => (miss(st, 'Blækket') <= 2 ? L('dronning', 'Der står RIGTIGT på dig. Det er hendes håndskrift.', 'It says RIGTIGT on you. That is her handwriting.')
        : L('dronning', 'Der står RIGTIKT på dig. Hun kunne aldrig stave.', 'It says RIGTIKT on you. She never could spell.')),
      L('dronning', 'Jeg søger en han. Igen. Der står tre friere i kø.', 'I am looking for a male. Again. Three suitors are in the queue.'),
      (st) => (f(st).dug ? { n: 'The dew is still in you. Every suitor arrives in three slightly pink copies.' } : []),
    ] },
    lesson({ who: 'dommer', scene: 'oerkentue', title: 'Repetition: kom! · kommer · datid · kan, vil, må', say: { da: 'Kom her! Hvad kan du? Hvad gjorde du i går?', en: 'Come here! What can you do? What did you do yesterday?' },
      rule: 'An order is the stem: kom! spis! rør ikke! Present tense: -r (kommer, rører). After kan / vil / skal / må, and after at: the infinitive (komme, røre), and no "at" after a modal. Past: -ede (dansede, huskede) or -te (spiste, kørte); some are irregular: drak, fløj, gik.',
      ex: ['[Kom] med mig!', 'Jeg [kan] flyve.', 'I går dans[ede] jeg.', 'Jeg spis[te] ti kager.'],
      try: { q: 'Du må ikke ___ min krone.', right: 'røre', wrong: ['rører', 'rør'], why: 'After må: the infinitive (-re).' } }),
    { screen: 'komplimenter', replay: true, id: 'Frierne', actor: 'dronning', drunkFlag: 'dug', ask: 'Byg frierens sætning.', askEn: 'Build the suitor’s sentence.', sayBtn: 'Sig det', end: '.', n: 9, title: 'Frierne', sub: 'Fårekyllingen giver ordrer. Natsværmeren taler i datid. Hannen kan alt.', rounds: FRIERNE },
    { screen: 'panel', scene: 'oerkentue', cast: ['dronning', 'unge'], lines: [
      (st) => (sc(st, 'Frierne') >= 6 ? { n: 'Every suitor said exactly what he meant. The queen is unimpressed by all three.' } : { n: 'Half of what the suitors said came out wrong. The queen found that the most attractive part.' }),
      L('dronning', 'Der er en frier mere på listen.', 'There is one more suitor on the list.'),
      { n: 'She reads the last name. It is yours. Your children signed you up while you slept.' },
      L('unge', 'Far skal giftes!', 'Dad is getting married!'),
      L('dronning', 'Du er den første han, der ikke døde. Det er romantisk.', 'You are the first male who did not die. That is romantic.'),
    ] },
    { screen: 'choice', scene: 'oerkentue', cast: ['dronning'], who: 'svampen', prompt: 'Dronningen: Vil du gifte dig med mig? Først en skål gelé.', options: (st) => [
      { da: 'Ja, jeg vil gifter mig.', set: { gift: true, gele: true, misGift: true } },
      sc(st, 'Frierne') >= 6 ? { da: 'Nej tak. Jeg skal passe børnene.', set: { gift: false } } : thirst(st) ? { da: 'Nej. I dag siger jeg nej tak.', set: { gift: false } } : { da: 'Nej tak.', set: { gift: false } },
      { da: 'Ja. Jeg vil gerne.', set: { gift: true, gele: true } },
      { en: '(EN) No, thank you.', set: { gift: false }, after: sour('dronning', 'En dronning taler stadig ikke engelsk.', 'A queen still does not speak English.') },
    ] },
    { screen: 'panel', scene: 'oerkentue', cast: ['dronning', 'kylling'], lines: [
      (st) => (f(st).misGift ? L('unge', 'Gifter mig! Gifter mig!', '(wrong: gifte mig)') : []),
      (st) => (f(st).gift ? [{ n: 'You drink the royal jelly. You grow. A little. In all directions.' }, L('dronning', 'Brylluppet er i morgen. Ved daggry flyver vi.', 'The wedding is tomorrow. At dawn we fly.')]
        : [L('dronning', 'Så tager jeg fårekyllingen. Han siger i det mindste, hvad jeg skal gøre.', 'Then I will take the cricket. At least he tells me what to do.'), L('dronning', 'Vi flyver i morgen tidlig. Du kan se på.', 'We fly early tomorrow. You may watch.')]),
    ] },

    // ===== 19 · Sværmen
    { screen: 'card', ch: 19, title: 'Sværmen', sub: 'Kapitel 19', music: 'happy' },
    { screen: 'panel', scene: 'daggry', cast: ['unge', 'dronning'], lines: [
      (st) => (f(st).kaffe3 ? [L('unge', 'Kaffe først! Kaffe først!', 'Coffee first! Coffee first!'), { n: 'They have not forgotten the sea. Neither have you.' }] : []),
      { n: 'Dawn. The flight happens, exactly as promised. Wings everywhere.' },
      (st) => (f(st).gift ? { n: 'But the wings are not yours. Your children have grown them overnight. It is their wedding flight. The queen goes up with them, and you stay on the sand in your wedding jelly.' }
        : { n: 'The queen goes up with the cricket. Behind her, four thousand of your children open brand new wings and go up too. Nobody asked you.' }),
      L('unge', 'Vi flyver nu, far. Men først: husk.', 'We are flying now, Dad. But first: remember.'),
    ] },
    lesson({ who: 'tusind', scene: 'daggry', title: 'Repetition: tid · da / når · hvis / om', say: { da: 'Om tirsdagen kører jeg under havet. For tre dage siden var de æg. På fredag er de væk.', en: 'On Tuesdays I run under the sea. Three days ago they were eggs. On Friday they will be gone.' },
      rule: 'på fredag = this Friday · om fredagen = on Fridays · for tre dage siden = three days ago · om morgenen = in the mornings. da = once, in the past · når = every time, or in the future · hvis = if · om = whether (after ved ikke, spørger). After a clause in front, the verb comes first: Hvis du vil, kan du …',
      ex: ['[for] tre dage siden', '[om] morgenen', '[Da] jeg var lille, …', 'Jeg ved ikke, [om] …'],
      try: { q: 'Hvis du vil, ___ bo her.', right: 'kan du', wrong: ['du kan', 'kan'], why: 'After the hvis-clause the verb comes first: kan du.' } }),
    { screen: 'panel', scene: 'daggry', cast: ['unge'], lines: [
      { n: 'As they rise, they shout. You know some of these sentences far too well: they are the ones you got wrong. In the desert. In the anthill.' },
      L('unge', 'Det sagde du forkert, far. Vi hørte det. Indeni.', 'You said that wrong, Dad. We heard it. Inside.'),
    ] },
    { screen: 'quiz', replay: true, id: 'Sværmen', variant: 'scene', cast: ['unge'], pileRight: true, n: 13, title: 'Sværmen', sub: 'Ret dem, før de flyver. Rigtige svar letter.', dyn: swarmRounds, rounds: SVAERM },
    { screen: 'panel', scene: 'daggry', cast: ['unge', 'grib'], lines: [
      (st) => (f(st).pupa === false ? L('unge', 'Far kom ikke. Far kom for sent.', "Dad didn't come. Dad came too late.") : L('unge', 'Far kom.', 'Dad came.')),
      { n: 'A vulture lands beside you. Late.' },
      L('grib', 'Jeg flyver baglæns. Det er derfor, jeg altid kommer for sent.', 'I fly backwards. That is why I am always late.'),
      (st) => (f(st).gift && f(st).blaek ? L('grib', 'Se? Jeg sagde det.', 'See? I said so.')
        : f(st).gift || f(st).blaek ? L('grib', 'Nå. To ud af tre.', 'Well. Two out of three.')
          : L('grib', 'Ingen blæk, intet bryllup? Nå. Tuen gik i hvert fald.', 'No ink, no wedding? Well. The anthill did walk, at least.')),
    ] },
    { screen: 'choice', scene: 'daggry', cast: ['unge'], who: 'svampen', prompt: 'Børnene (fra luften): Far! Hvad kan du godt lide?', options: [
      { da: 'Jeg kan godt lide kaffe.', set: { like: true } },
      { da: 'Jeg kan godt lider kaffe.', set: { misLide: true } },
      { da: 'Jeg kan godt lide at være tør.', set: { like: true } },
      { da: 'Jeg kan godt lide jer.', set: { like: true } },
      { en: '(EN) I like you.', set: {}, after: sour('unge', 'Hvad? Vi kan ikke høre dig!', "What? We can't hear you!") },
    ] },
    { screen: 'choice', scene: 'daggry', cast: ['unge'], who: 'svampen', prompt: 'Børnene: Hvor skal vi bo?', options: [
      { da: 'I skal bo her, ved havet.', set: { boHav: true } },
      { da: 'I skal bo i Lejren.', set: { boLejr: true } },
      { da: 'I skal bor i Tuen.', set: { boTue: true, misBo: true } },
      { da: 'I skal bo i mig.', set: { boMig: true } },
      { da: 'I skal bo i Tuen.', set: { boTue: true } },
      { en: '(EN) Wherever you like.', set: { boHav: true }, after: sour('unge', 'Så bliver vi her.', 'Then we stay here.') },
    ] },
    { screen: 'panel', scene: 'daggry', cast: ['unge'], music: 'happy', lines: [
      (st) => (f(st).misLide ? { n: 'From very high up you hear four thousand voices practising "lider". It will take years.' } : []),
      (st) => colonyLines(st),
    ] },
    { screen: 'card', title: 'Fortsættes …', sub: 'Del 4 kommer', ms: 1600 },
    { screen: 'act', do: 'ranks' },
    { screen: 'end' },
  ];
  // part 3 starts after part 2's last "end"
  K.FLOW.push(...P3);

  Object.assign(K.DICT, {
    larve: 'larva', larver: 'larvae', larverne: 'the larvae', puppe: 'pupa', pupper: 'pupae', pupperne: 'the pupae', yngel: 'brood', yngelen: 'the brood',
    æg: 'egg(s)', æggene: 'the eggs', æger: '(wrong plural of æg)', æge: '(wrong)', barner: '(wrong plural of barn)', barne: '(wrong)', myrere: '(wrong)',
    grønt: 'green (et-form)', grønne: 'green (-e form)', hvidt: 'white (et-form)', hvide: 'white (-e form)', hvid: 'white', gul: 'yellow', gule: 'yellow (-e form)', blåt: 'blue (et-form)', sort: 'black', sorte: 'black (-e form)', ser: 'see(s)',
    far: 'dad, father', farer: 'dangers (they mean fædre, fathers)', hørt: 'heard', inde: 'inside', indeni: 'inside', sagde: 'said', fløj: 'flew', flyvede: '(wrong past of flyve: fløj)', mor: 'mum, mother', huller: 'holes', praktisk: 'practical', tak: 'thanks',
    tørstige: 'thirsty', suger: 'soak(s), suck(s)', tørre: 'dry (-e form)', mere: 'more', næste: 'next', stop: 'stop', venter: 'wait(s)',
    tirsdagen: 'Tuesday (om tirsdagen = on Tuesdays)', under: 'under', drikkede: '(wrong past: drak)', blæk: 'ink', dér: 'there', gåede: '(wrong past: gik)', ørkenen: 'the desert', blev: 'became, got', gifted: '(wrong: gift)', drakkede: '(wrong past: drak)', drak: 'drank', taler: 'speak(s)', endnu: 'yet', velkommen: 'welcome', sælger: 'sell(s)', ordene: 'the words', som: 'as, like, who', glas: 'glass', forstår: 'understand(s)', kun: 'only', værsgo: 'here you go', skrive: 'write', dag: 'day (i dag = today)', noget: 'something, anything', svømmer: 'swim(s)', blæksprutten: 'the octopus',
    sten: 'stone(s)', skib: 'ship', fisk: 'fish', fiskene: 'the fish (plural)', fiskenes: "(wrong: the fishes')", hat: 'hat', gammel: 'old', gamle: 'old (-e form)', lillat: '(wrong: lilla never changes)', tæppe: 'carpet, blanket', oranget: '(wrong: orange never changes)', gråt: 'grey (et-form)', stort: 'big (et-form)', kender: 'know(s)', før: 'before', fik: 'got', vejen: 'the way',
    gruppe: 'group', siger: 'say(s)', lytter: 'listen(s)', stille: 'quiet', rede: 'nest', pukkel: 'hump', fugle: 'birds', synger: 'sing(s)', natten: 'the night (om natten = at night)', komplimenterne: 'the compliments', fugle_: '', sikke: 'what (a) …!', flotte: 'fine, handsome (-e form)', flotter: '(wrong)', store: 'big (-e form)', puklen: 'the hump', små: 'small (plural)', småe: '(wrong: små)', mange: 'many', sko: 'shoe(s)', pænt: 'nice (et-form, as adverb)', nye: 'new (-e form)', stilhed: 'silence', vild: 'wild (vild med = crazy about)', smuk: 'beautiful', synes: 'think(s) (opinion)', komplimenter: 'compliments', dråbe: 'drop', tur: 'trip', får: 'get(s)', dug: 'dew', stemt: 'voted', cirklen: 'the circle', udenfor: 'outside', sandet: 'the sand', sand: 'sand', grænser: 'boundaries', uge: 'week',
    hannerne: 'the males', dør: 'die(s)', flyvningen: 'the flight', kontrakten: 'the contract', stadig: 'still', boet: 'lived', børn: 'children', håndskrift: 'handwriting', rigtigt: 'right, correct', rigtikt: '(misspelt: rigtigt)', stave: 'spell', søger: 'look(s) for', igen: 'again', friere: 'suitors', frier: 'suitor', frierens: "the suitor's", kø: 'queue', byg: 'build!', sætning: 'sentence', gjorde: 'did', rør: 'touch!', vinger: 'wings', ti: 'ten', dansede: 'danced', dansed: '(wrong)', kørede: '(wrong past: kørte)', hele: 'all of, the whole (det hele = everything)', huskede: 'remembered', huskte: '(wrong past: huskede)', navn: 'name', højt: 'high', bære: 'carry', bærer: 'carry(-ies)', dine: 'your (plural)', sige: 'say', nej: 'no', lyserød: 'pink',
    liste: 'list', listen: 'the list', giftes: 'get married', første: 'first', døde: 'died', romantisk: 'romantic', gifte: 'marry (gifte sig)', gifter: 'marry(-ies)', skål: 'bowl', gelé: 'jelly', passe: 'look after', børnene: 'the children', gerne: 'gladly (vil gerne = would like to)', stadig_: '', brylluppet: 'the wedding', daggry: 'dawn', tidlig: 'early', fårekyllingen: 'the cricket', mindste: 'least (i det mindste = at least)', gøre: 'do',
    først: 'first', flyver: 'fly / flies', husk: 'remember!', væk: 'gone', fredag: 'Friday', fredagen: 'Friday (om fredagen = on Fridays)', arbejder: 'work(s)', dagen: 'the day', mørkt: 'dark', vingerne: 'the wings', forkert: 'wrong', hørte: 'heard', kom: 'came / come!', baglæns: 'backwards', derfor: 'therefore (det er derfor = that is why)', sent: 'late (for sent = too late)', gift: 'married', halvdelen: 'half (of it)', passer: 'fit(s) / look(s) after (passer på)',
    lide: 'like (kan godt lide = like)', lider: '(wrong: lide; lider = suffer)', jer: 'you (plural)', luften: 'the air', bo: 'live', bor: 'live(s)', lejren: 'the camp', tuen: 'the anthill', mig: 'me', havet: 'the sea', ved: 'by / know(s)',
    arbejder_: '', alle: 'all', farver: 'colours', skriver: 'write(s)', alt: 'everything (alt for = far too)', sover: 'sleep(s)', aldrig: 'never', fint: 'fine', hele_: '', det: 'it, that / the (et-word)', drikker: 'drink(s)',
    kolonien: 'the colony', repetition: 'review', datid: 'past tense',
    betyder: 'mean(s)', okay: 'OK', gruppen: 'the group', sen: '(wrong: for sent)', ud: 'out (to ud af tre = two out of three)', intet: 'no (et-form)', bryllup: 'wedding', gik: 'went, walked', hvert: 'every (et-form; i hvert fald = at least)', fald: 'case (i hvert fald = at least)', sagde_: '', havde: 'had', myrer: 'ants', over: 'over, across', deres: 'their', dråben: 'the drop', hver: 'every', spis: 'eat!',
  });
  Object.keys(K.DICT).forEach((k) => { if (!K.DICT[k]) delete K.DICT[k]; });
})(window.K = window.K || {});
