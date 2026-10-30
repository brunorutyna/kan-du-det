// LYGTEN — game content. SPOILERS (story lines, endings). Everything here is data, checked by tools/lint.js.
(function (K) {
  'use strict';
  K.CONFIG = {
    id: 'lygten',
    title: 'Lygten',
    tagline: 'Sand, vand og ord',
    endings: 4,
    back: { label: '◂ Kan du det?!', href: '../' },
    yes: ['Ja!', 'Præcis!', 'Flot!', 'Rigtigt!'],
    no: ['Nej!', 'Av!', 'Ikke helt.'],
    run: () => ({ water: 6, day: 1, pack: [], sold: [], left: [], map: null, stretch: 0, row: 0, at: null, nights: {}, tally: {}, city: 0, usedSigns: [], usedRiddles: [], usedStones: [] }),
    ending: (st) => K.endingOf(st),
  };
  K.ENDINGS = {
    tavs: 'Tavs',
    tak: 'Tak',
    taender: 'Lygtetænderen',
    vandrer: 'Vandreren',
  };

  // ---------- things you can dig up (book 3.2 clothes and bags, 3.3 furniture). da = the true name;
  // lies = curated wrong forms (lint: never a true name). word = the bare word the lantern asks for;
  // tags = riddles that accept it; fx = effect (K.FX); sikke = the trader's praise (3.2).
  K.THINGS = [
    { id: 'kasket', e: '🧢', da: 'en kasket', word: 'kasket', lies: ['et kasket', 'en kaskett', 'en kasketter'], tags: ['sun'], fx: 'sol', sikke: 'Sikke en flot kasket!' },
    { id: 'toerklaede', e: '🧣', da: 'et tørklæde', word: 'tørklæde', lies: ['en tørklæde', 'et tørklæd', 'et tørklæder'], tags: ['neck', 'tie'], fx: 'storm', sikke: 'Sikke et flot tørklæde!' },
    { id: 'lampe', e: '🪔', da: 'en lampe', word: 'lampe', lies: ['et lampe', 'en lamp', 'en lamper'], tags: ['light'], fx: 'nat', sikke: 'Sikke en flot lampe!' },
    { id: 'rygsaek', e: '🎒', da: 'en rygsæk', word: 'rygsæk', lies: ['et rygsæk', 'en rygsæck', 'en rygsække'], tags: ['back', 'bag'], fx: 'max', sikke: 'Sikke en flot rygsæk!' },
    { id: 'taske', e: '👜', da: 'en taske', word: 'taske', lies: ['et taske', 'en task', 'en tasker'], tags: ['bag'], sikke: 'Sikke en flot taske!' },
    { id: 'handsker', e: '🧤', da: 'et par handsker', word: 'handsker', lies: ['en par handsker', 'et par handske', 'et par handskere'], tags: ['hands'], sikke: 'Sikke nogle flotte handsker!' },
    { id: 'sokker', e: '🧦', da: 'et par sokker', word: 'sokker', lies: ['en par sokker', 'et par sok', 'et par sokkere'], tags: ['feet', 'run'], sikke: 'Sikke nogle flotte sokker!' },
    { id: 'stoevler', e: '👢', da: 'et par støvler', word: 'støvler', lies: ['en par støvler', 'et par støvle', 'et par støvlere'], tags: ['feet', 'legs'], sikke: 'Sikke nogle flotte støvler!' },
    { id: 'sko', e: '👞', da: 'et par sko', word: 'sko', lies: ['en par sko', 'et par skoer', 'et par skoe'], tags: ['feet', 'run'], sikke: 'Sikke nogle flotte sko!' },
    { id: 'sandaler', e: '🩴', da: 'et par sandaler', word: 'sandaler', lies: ['en par sandaler', 'et par sandal', 'et par sandalere'], tags: ['feet'], sikke: 'Sikke nogle flotte sandaler!' },
    { id: 'loebesko', e: '👟', da: 'et par løbesko', word: 'løbesko', lies: ['en par løbesko', 'et par løbeskoer', 'et par løbsko'], tags: ['feet', 'run'], sikke: 'Sikke nogle flotte løbesko!' },
    { id: 'jakke', e: '🧥', da: 'en jakke', word: 'jakke', lies: ['et jakke', 'en jakk', 'en jakker'], tags: ['top'], sikke: 'Sikke en flot jakke!' },
    { id: 'bluse', e: '👚', da: 'en bluse', word: 'bluse', lies: ['et bluse', 'en blus', 'en bluser'], tags: ['top'], sikke: 'Sikke en flot bluse!' },
    { id: 'tshirt', e: '👕', da: 'en t-shirt', word: 't-shirt', lies: ['et t-shirt', 'en t-shirtt', 'en t-shirts'], tags: ['top'], sikke: 'Sikke en flot t-shirt!' },
    { id: 'kjole', e: '👗', da: 'en kjole', word: 'kjole', lies: ['et kjole', 'en kjol', 'en kjoler'], tags: ['top'], sikke: 'Sikke en flot kjole!' },
    { id: 'slips', e: '👔', da: 'et slips', word: 'slips', lies: ['en slips', 'et slibs', 'et slipser'], tags: ['tie'], sikke: 'Sikke et flot slips!' },
    { id: 'bukser', e: '👖', da: 'et par bukser', word: 'bukser', lies: ['en par bukser', 'et par buks', 'et par buksere'], tags: ['legs'], sikke: 'Sikke nogle flotte bukser!' },
    { id: 'shorts', e: '🩳', da: 'et par shorts', word: 'shorts', lies: ['en par shorts', 'et par short', 'et par shortser'], tags: ['legs', 'swim'], sikke: 'Sikke nogle flotte shorts!' },
    { id: 'badedragt', e: '🩱', da: 'en badedragt', word: 'badedragt', lies: ['et badedragt', 'en badedrakt', 'en badedragter'], tags: ['swim', 'top'], sikke: 'Sikke en flot badedragt!' },
    { id: 'bikini', e: '👙', da: 'en bikini', word: 'bikini', lies: ['et bikini', 'en bikinni', 'en bikinier'], tags: ['swim', 'top'], sikke: 'Sikke en flot bikini!' },
    { id: 'sofa', e: '🛋️', da: 'en sofa', word: 'sofa', lies: ['et sofa', 'en soffa', 'en sofaer'], tags: ['sit'], sikke: 'Sikke en flot sofa!' },
    { id: 'stol', e: '🪑', da: 'en stol', word: 'stol', lies: ['et stol', 'en stoll', 'en stole'], tags: ['sit'], sikke: 'Sikke en flot stol!' },
    { id: 'seng', e: '🛏️', da: 'en seng', word: 'seng', lies: ['et seng', 'en sæng', 'en senge'], tags: ['sleep', 'sit'], sikke: 'Sikke en flot seng!' },
    { id: 'skab', e: '🗄️', da: 'et skab', word: 'skab', lies: ['en skab', 'et skap', 'et skabe'], tags: ['wardrobe'], sikke: 'Sikke et flot skab!' },
  ];
  // Effects. The strongest thing (the one the lantern asks for) follows this order; then the oldest in the pack.
  K.FX = {
    max: { icon: '💧', en: 'carry 3 more water' },
    nat: { icon: '☾', en: 'night spots cost 1 less' },
    storm: { icon: '🌪', en: 'sandstorm spots cost 1 less' },
    sol: { icon: '☀', en: 'sun spots cost 1 less' },
  };
  K.FX_ORDER = ['max', 'nat', 'storm', 'sol'];

  // ---------- riddles at the caravan (accept = every thing with that tag)
  K.RIDDLES = [
    { tag: 'sun', da: 'Jeg leder efter noget, man har på hovedet, når solen skinner.' },
    { tag: 'neck', da: 'Jeg leder efter noget, man har om halsen, når det blæser.' },
    { tag: 'tie', da: 'Jeg skal bruge noget, man har om halsen sammen med en skjorte.' },
    { tag: 'light', da: 'Jeg har brug for noget, man tænder, når det bliver mørkt.' },
    { tag: 'back', da: 'Jeg har brug for noget, man bærer sine ting i på ryggen.' },
    { tag: 'bag', da: 'Jeg leder efter noget, man har sine ting i, når man går i byen.' },
    { tag: 'hands', da: 'Jeg har brug for noget, man har på hænderne, når det er koldt.' },
    { tag: 'feet', da: 'Jeg leder efter noget, man har på fødderne.' },
    { tag: 'run', da: 'Jeg skal bruge noget, man har på fødderne, når man løber.' },
    { tag: 'top', da: 'Jeg leder efter noget, man har på overkroppen.' },
    { tag: 'legs', da: 'Jeg leder efter noget, man har på benene.' },
    { tag: 'swim', da: 'Jeg har brug for noget, man har på, når man skal svømme.' },
    { tag: 'sit', da: 'Jeg leder efter noget, man sidder på.' },
    { tag: 'sleep', da: 'Jeg har brug for noget, man sover i.' },
    { tag: 'wardrobe', da: 'Jeg leder efter noget, man hænger sit tøj ind i.' },
  ];

  // ---------- price signs at the buried flea market (3.2 adjective endings, 3.3 the definite form).
  // txt has one gap "_" for the adjective ending; ans is '' (no ending), 't' or 'e'. col/pat colour the card.
  K.SIGNS = [
    { txt: 'en rød_ kjole', ans: '', col: 'roed', kr: 120, why: 'kjole is an en-word: en rød kjole.' },
    { txt: 'et gul_ slips', ans: 't', col: 'gul', kr: 89, why: 'slips is an et-word: gul → gult.' },
    { txt: 'nogle blå_ sokker', ans: '', col: 'blaa', kr: 35, why: 'blå gets no -e in the plural (the book form): blå sokker.' },
    { txt: 'et grøn_ tørklæde', ans: 't', col: 'groen', kr: 75, why: 'tørklæde is an et-word: grøn → grønt.' },
    { txt: 'nogle sort_ støvler', ans: 'e', col: 'sort', kr: 450, why: 'Plural: sort → sorte.' },
    { txt: 'en stribet_ skjorte', ans: '', col: 'hvid', pat: 'stribet', kr: 99, why: 'en-word, indefinite: no ending.' },
    { txt: 'et ternet_ jakkesæt', ans: '', col: 'graa', pat: 'ternet', kr: 900, why: 'ternet does not get an extra -t: et ternet jakkesæt.' },
    { txt: 'den hvid_ lampe', ans: 'e', col: 'hvid', kr: 150, why: 'After den/det/de the adjective gets -e: den hvide lampe.' },
    { txt: 'det brun_ bord', ans: 'e', col: 'brun', kr: 300, why: 'After det the adjective gets -e (not -t): det brune bord.' },
    { txt: 'de gul_ puder', ans: 'e', col: 'gul', kr: 60, why: 'After de: gule.' },
    { txt: 'min sort_ sofa', ans: 'e', col: 'sort', kr: 1200, why: 'After min/mit/mine the adjective gets -e: min sorte sofa.' },
    { txt: 'det grå_ skab', ans: '', col: 'graa', kr: 400, why: 'grå gets no -e (the book form): det grå skab.' },
    { txt: 'et hvid_ skab', ans: 't', col: 'hvid', kr: 350, why: 'Indefinite et-word: hvid → hvidt.' },
    { txt: 'en orange_ taske', ans: '', col: 'orange', kr: 140, why: 'orange never changes.' },
    { txt: 'de lilla_ puder', ans: '', col: 'lilla', kr: 50, why: 'lilla never changes.' },
    { txt: 'mit rød_ sengetæppe', ans: 'e', col: 'roed', kr: 220, why: 'After mit the adjective gets -e: mit røde sengetæppe.' },
    { txt: 'den gul_ kommode', ans: 'e', col: 'gul', kr: 500, why: 'After den: gule.' },
    { txt: 'en brun_ lænestol', ans: '', col: 'brun', kr: 650, why: 'en-word, indefinite: no ending.' },
    { txt: 'nogle hvid_ bluser', ans: 'e', col: 'hvid', kr: 80, why: 'Plural: hvid → hvide.' },
    { txt: 'et prikket_ gardin', ans: '', col: 'blaa', pat: 'prikket', kr: 110, why: 'prikket does not get an extra -t: et prikket gardin.' },
  ];
  // The lantern's city: one wrong letter in the adjective (always the ending), same length.
  K.CITY = [
    { txt: 'den rødt sofa', bad: 'rødt', good: 'røde', col: 'roed' },
    { txt: 'et hvide bord', bad: 'hvide', good: 'hvidt', col: 'hvid' },
    { txt: 'de gult gardiner', bad: 'gult', good: 'gule', col: 'gul' },
    { txt: 'det brunt skab', bad: 'brunt', good: 'brune', col: 'brun' },
    { txt: 'et store tæppe', bad: 'store', good: 'stort', col: 'lilla' },
    { txt: 'min pænt kjole', bad: 'pænt', good: 'pæne', col: 'groen' },
    { txt: 'de hvidt puder', bad: 'hvidt', good: 'hvide', col: 'hvid' },
    { txt: 'et røde slips', bad: 'røde', good: 'rødt', col: 'roed' },
  ];
  K.HAND = { txt: 'gå mod væst', bad: 'væst', good: 'vest', col: 'hvid' };
  K.COLORS = {
    roed: { hex: '#d8352a' }, groen: { hex: '#2f9e44' }, blaa: { hex: '#2f6fd8' }, gul: { hex: '#f2c230' },
    sort: { hex: '#1b1b1b', dark: true }, hvid: { hex: '#f4f1ea' }, brun: { hex: '#7a4a24', dark: true }, graa: { hex: '#8d8d8d' },
    orange: { hex: '#f08a24' }, lilla: { hex: '#8e44ad', dark: true },
  };
  K.PATTERNS = { stribet: 'stripes', prikket: 'dots', ternet: 'checks' };

  // ---------- stepping stones: the true phrase and the lantern's lie
  K.STONES = [
    ['en rød sofa', 'en rødt sofa'], ['et grønt skab', 'et grøn skab'], ['den hvide lampe', 'den hvid lampe'], ['de blå puder', 'de blåt puder'],
    ['et gult bord', 'et gule bord'], ['min gamle kommode', 'min gammel kommode'], ['nogle sorte sko', 'nogle sort sko'], ['det lille bord', 'det lillet bord'],
    ['de små stole', 'de lille stole'], ['en stor reol', 'en store reol'], ['et stort tæppe', 'et stor tæppe'], ['den lækre sofa', 'den lækker sofa'],
  ];

  // ---------- the map. Node types: grav, karavane, skilt, oase, mirage (as oase|karavane), circle. w = weather. d = days.
  K.SPOT = {
    grav: { e: '🏜️', da: 'en klit', hint: 'Grav noget op' },
    karavane: { e: '🐪', da: 'en karavane', hint: 'Byt ting for vand' },
    skilt: { e: '🏷️', da: 'et loppemarked', hint: 'Skilte og vand' },
    oase: { e: '🌴', da: 'en oase', hint: 'Fyld vand på' },
    circle: { e: '🏜️', da: 'Dag 1', hint: '?' },
  };
  K.MIRAGE = { oase: ['et oase', 'en oaser', 'en ose'], karavane: ['et karavane', 'en karavanne', 'en karavaner'] };
  K.WEATHER = { sol: { e: '☀', da: 'sol' }, storm: { e: '🌪', da: 'sandstorm' }, nat: { e: '☾', da: 'nat' } };
  const n = (t, w, d, as) => ({ t, w: w || null, d, as });
  K.LAYOUTS = {
    1: [
      [[n('grav', 'sol', 3), n('karavane', null, 2)], [n('skilt', null, 3), n('mirage', 'sol', 2, 'oase')], [n('grav', 'storm', 3), n('oase', 'sol', 3)], [n('grav', null, 2), n('skilt', 'sol', 3)]],
      [[n('karavane', 'sol', 2), n('grav', null, 3)], [n('mirage', null, 2, 'karavane'), n('oase', 'sol', 3)], [n('skilt', 'storm', 3), n('grav', 'sol', 2)], [n('skilt', null, 3), n('grav', 'storm', 2)]],
    ],
    2: [
      [[n('grav', 'nat', 3), n('skilt', null, 2)], [n('mirage', 'nat', 2, 'oase'), n('oase', null, 3)], [n('circle', null, 2)], [n('karavane', 'storm', 3), n('grav', 'nat', 2)]],
      [[n('skilt', 'nat', 2), n('karavane', null, 3)], [n('oase', 'nat', 3), n('mirage', null, 2, 'karavane')], [n('circle', null, 2)], [n('grav', 'storm', 2), n('skilt', 'nat', 3)]],
    ],
    3: [
      [[n('grav', 'sol', 2), n('karavane', 'nat', 3)], [n('skilt', 'nat', 2), n('mirage', 'sol', 2, 'oase')], [n('oase', null, 2), n('grav', 'sol', 3)]],
      [[n('karavane', 'sol', 3), n('skilt', null, 2)], [n('grav', 'nat', 2), n('mirage', 'nat', 2, 'karavane')], [n('grav', null, 3), n('oase', 'sol', 2)]],
    ],
  };
  K.NIGHT_AFTER_ROW = 2; // the night offer comes after the 2nd spot of each stretch

  // ---------- glossary
  K.DICT = {
    // core
    en: 'a (en-word)', et: 'a (et-word)', par: 'pair (et par = a pair)', og: 'and', ja: 'yes', nej: 'no', tak: 'thanks', 'nej tak': 'no thanks',
    jeg: 'I', du: 'you', dig: 'you (object)', det: 'it / that', den: 'it (en-word) / the (before an adjective)', dem: 'them', man: 'one, you (people in general)', mig: 'me', her: 'here', der: 'there / that (who)', sådan: 'like that, so',
    er: 'is / are', har: 'have / has', kan: 'can', skal: 'must / shall', vil: 'will / want to', var: 'was', bare: 'just, only', kun: 'only', ikke: 'not', for: 'for', så: 'then / so', når: 'when', hvad: 'what', hvor: 'where', med: 'with', på: 'on', i: 'in', til: 'to', af: 'of / off', om: 'around / about', ud: 'out', ned: 'down', ad: 'along (ned ad = down along)', op: 'up', mod: 'towards', fra: 'from', herfra: 'from here',
    noget: 'something', ingenting: 'nothing', eneste: 'only (det eneste = the only thing)', slags: 'kind (den slags = that kind)', alle: 'all', mine: 'my (plural)', dine: 'your (plural)', din: 'your', sine: "one's own (plural)", sidste: 'last', selv: 'myself / yourself',
    // verbs
    leder: 'look (leder efter = look for)', efter: 'after / for', brug: 'use (have brug for = need)', bruge: 'use', bruger: 'use(s)', giv: 'give!', giver: 'give(s)', få: 'get', får: 'get(s)', tag: 'take!', tager: 'take(s)', tage: 'take', gå: 'go, walk', går: 'go(es), walk(s)', grav: 'dig!', grave: 'dig', finder: 'find(s)', laver: 'make(s)', læs: 'read!', læse: 'read', staver: 'spell(s)', stave: 'spell', lære: 'learn', køber: 'buy(s)', købe: 'buy', koster: 'cost(s)', mangler: 'lack(s), is missing', glid: 'slide!', stikker: 'stick(s) (stikker op = sticks up)', skinner: 'shine(s)', blæser: 'blow(s) (det blæser = it is windy)', tænder: 'switch(es) on / teeth', bliver: 'become(s)', regner: 'rain(s)', vide: 'know', åbner: 'open(s)', ringe: 'call (phone)', børster: 'brush(es)', bærer: 'carry, carries', sover: 'sleep(s)', sove: 'sleep', sidder: 'sit(s)', spise: 'eat', svømme: 'swim', vaske: 'wash', låne: 'borrow', sende: 'send', se: 'see', rejser: 'travel(s)', drikker: 'drink(s)', huske: 'remember', træd: 'step!', faldet: 'fallen (er faldet om = has collapsed)', vælg: 'choose!', ret: 'correct!', find: 'find!', stod: 'stood (hvad stod der = what did it say)', byt: 'swap, trade!', fyld: 'fill!', sulten: 'hungry', tørstig: 'thirsty', farvel: 'goodbye',
    // desert
    sand: 'sand', sandet: 'the sand', sten: 'stone(s)', klit: 'dune', klitten: 'the dune', vand: 'water', slurk: 'sip', slurke: 'sips', brønd: 'well (for water)', sol: 'sun', solen: 'the sun', sandstorm: 'sandstorm', nat: 'night', kamel: 'camel', oase: 'oasis', karavane: 'caravan', sti: 'path', skilt: 'sign', skiltet: 'the sign', skilte: 'signs', lygten: 'the lantern', lygte: 'lantern', lygtens: "the lantern's", glas: 'glass', vej: 'way, road', vejen: 'the way', korte: 'short (den korte vej = the short way)', ord: 'word(s)', ordet: 'the word', ordene: 'the words', by: 'town, city', byen: 'the town', dag: 'day', vest: 'west', væst: '(misspelled: vest = west)', ægte: 'real, true', fejlen: 'the mistake', fuld: 'full', tasken: 'the bag',
    // things
    hat: 'hat', kasket: 'cap', tørklæde: 'scarf', lampe: 'lamp', flaske: 'bottle', flasken: 'the bottle', nøgle: 'key', paraply: 'umbrella', ur: 'watch, clock', bog: 'book', tandbørste: 'toothbrush', mobil: 'mobile phone', kamera: 'camera', briller: 'glasses', solbriller: 'sunglasses', taske: 'bag', pung: 'purse, wallet', rygsæk: 'backpack', handsker: 'gloves', sokker: 'socks', støvler: 'boots', jakke: 'jacket', skjorte: 'shirt', kjole: 'dress', bukser: 'trousers', stol: 'chair', seng: 'bed', sofa: 'sofa', brød: 'bread', æble: 'apple',
    // riddle words
    hovedet: 'the head', halsen: 'the neck', mørkt: 'dark', dør: 'door', klokken: 'the clock (hvad klokken er = what time it is)', billeder: 'pictures', næsen: 'the nose', stærk: 'strong', penge: 'money', ting: 'thing(s)', ryggen: 'the back', hænderne: 'the hands', koldt: 'cold', fødderne: 'the feet', overkroppen: 'the upper body', benene: 'the legs', aldrig: 'never', samler: 'collect(s)',
    // book 3.2 / 3.3
    badedragt: 'swimsuit', bikini: 'bikini', bluse: 'blouse', bluser: 'blouses', bord: 'table', 'lænestol': 'armchair', kommode: 'chest of drawers', reol: 'bookcase', 'tæppe': 'rug, blanket', sengetæppe: 'bedspread', gardin: 'curtain', gardiner: 'curtains', puder: 'cushions', pude: 'cushion', skab: 'cupboard, wardrobe', slips: 'tie', shorts: 'shorts', 't-shirt': 'T-shirt', sandaler: 'sandals', 'løbesko': 'running shoes', 'jakkesæt': 'suit',
    'rød': 'red', 'rødt': 'red (et-form)', 'røde': 'red (definite/plural)', 'grøn': 'green', 'grønt': 'green (et-form)', 'grønne': 'green (definite/plural)', gul: 'yellow', gult: 'yellow (et-form)', gule: 'yellow (definite/plural)', 'blå': 'blue (never -e)', brun: 'brown', brunt: 'brown (et-form)', brune: 'brown (definite/plural)', sort: 'black (et-form also sort)', sorte: 'black (definite/plural)', hvid: 'white', hvidt: 'white (et-form)', hvide: 'white (definite/plural)', 'grå': 'grey (never -e)', orange: 'orange (never changes)', lilla: 'purple (never changes)', stribet: 'striped', ternet: 'checked', prikket: 'dotted',
    stor: 'big', stort: 'big (et-form)', store: 'big (definite/plural)', lille: 'small', 'små': 'small (plural)', gammel: 'old', 'lækker': 'lovely', 'lækre': 'lovely (definite/plural)', 'pæn': 'nice, pretty', 'pænt': 'nice (et-form)', 'pæne': 'nice (definite/plural)', flotte: 'nice (plural)', sikke: 'what a …!',
    de: 'the (plural, before an adjective) / they', min: 'my (en-word)', mit: 'my (et-word)', nogle: 'some', hvilken: 'which', endelse: 'ending', loppemarked: 'flea market', loppemarkedet: 'the flea market', hen: '(direction: hvor … hen = where to)', skrive: 'write', kr: 'kroner', 'næste': 'next', morgen: 'morning', lejren: 'the camp', 'nå': 'oh well', 'svar': 'answer', 'hånd': 'hand', hendes: 'her', handelskonen: 'the trader (woman)', 'mistet': 'lost', skiltene: 'the signs', halvt: 'half', begravet: 'buried',
    ved: 'know(s) (jeg ved det ikke = I don\'t know)', 'løber': 'run(s)', 'hænger': 'hang(s)', ind: 'in (direction)', sammen: 'together (sammen med = with)', oasen: 'the oasis', stenene: 'the stones',
    // places
    sted: 'place', bager: 'baker', slagter: 'butcher', apotek: 'pharmacy', kiosk: 'kiosk', bibliotek: 'library', svømmehal: 'swimming pool (indoor)', vaskeri: 'launderette', biograf: 'cinema', hotel: 'hotel', museum: 'museum', posthus: 'post office', station: 'station', skobutik: 'shoe shop', tøjbutik: 'clothes shop', blomsterhandler: 'florist', kød: 'meat', medicin: 'medicine', slik: 'sweets', aviser: 'newspapers', bøger: 'books', tøj: 'clothes', film: 'film', kunst: 'art', gamle: 'old', brev: 'letter', toget: 'the train', sko: 'shoes', blomster: 'flowers',
    // misc
    hvert: 'every (et-word)', skridt: 'step', ha: 'ha!', aftale: 'deal, agreement', rigtigt: 'right, correct', præcis: 'exactly', flot: 'nice, well done', av: 'ouch', helt: 'completely (ikke helt = not quite)', ét: 'one (stressed)', to: 'two', tre: 'three', nu: 'now', igen: 'again', hej: 'hi', test: 'test', stemmen: 'the voice', høre: 'hear',
    videre: 'onwards, next', fortsæt: 'continue', begynd: 'begin', forfra: 'from the start', indstillinger: 'settings',
  };
  K.NAMES = [];

  K.CAST = {
    lygten: { name: 'Lygten', color: '#ffcf5a', pitch: 1.3 },
    konen: { name: 'Handelskonen', color: '#c98a5a', pitch: 0.9 },
    haand: { name: 'Din hånd', color: '#e8d2b8' },
  };
  K.SCENES = {
    title: { from: '#2a1f3d', to: '#0f0c14' },
    dune: { from: '#e3b46b', to: '#7a4a24', label: 'Sandet' },
    night: { from: '#141a33', to: '#06070d', label: 'Natten' },
    camp: { from: '#3b2a4a', to: '#120d12', label: 'Lejren' },
    city: { from: '#4a3a6b', to: '#160f22', label: 'Byen' },
    out: { from: '#9fd3e8', to: '#e9d9a8', label: 'Ude' },
  };

  // ---------- endings
  K.endingOf = (st) => {
    if (st.flags.gaveAll || st.flags.collapsedEmpty) return K.ENDINGS.tavs;
    if (st.city >= 5 && !st.flags.everSold) return K.ENDINGS.tak;
    if (st.city >= 5) return K.ENDINGS.taender;
    return K.ENDINGS.vandrer;
  };

  // ---------- the flow
  const L = (w, da, en) => ({ w, da, en });
  K.FLOW = [
    { screen: 'graven', day1: true, music: 'calm' },
    { screen: 'panel', scene: 'dune', cast: ['haand'], lines: [
      { n: 'Ink on the back of your hand:' },
      L('haand', 'GÅ MOD VÆST', 'Walk west'),
      { th: 'Somebody wrote on my hand. I hope it was me.' },
    ] },
    { screen: 'map', stretch: 1 },
    { screen: 'panel', scene: 'night', cast: ['lygten'], music: 'tense', lines: [
      { n: 'Twelve days. The water is low. The lantern comes closer than usual.' },
      L('lygten', 'Du er tørstig. Giv mig to ord, så finder jeg vand til dig.', 'You are thirsty. Give me two words, and I will find water for you.'),
    ] },
    { screen: 'choice', scene: 'night', cast: ['lygten'], who: 'lygten', prompt: 'Svar:', options: (st) => [
      { da: 'Nej tak. Sand er sand.', set: { accept1: false } },
      { da: 'Ja tak.', set: { accept1: true } },
      { en: '(EN) No.', set: { accept1: false } },
    ] },
    { screen: 'act', do: 'sell2', if: (st) => st.flags.accept1 },
    { screen: 'panel', scene: 'night', cast: ['lygten'], if: (st) => st.flags.accept1, lines: [
      (st) => ({ n: `Your ${st.lastSold || 'things'} turn to sand. Under them, wet sand. Then water.` }),
      L('lygten', 'Tak for ordene.', 'Thanks for the words.'),
    ] },
    { screen: 'stenene', if: (st) => !st.flags.accept1 },
    { screen: 'act', do: 'nextStretch' },
    { screen: 'card', title: 'Lejren', sub: 'Næste morgen' },
    { screen: 'panel', scene: 'camp', cast: ['konen'], music: 'calm', lines: [
      { n: 'At dawn the trader is sitting by your fire, as if she had always been there. She takes your hand to look at your things, and stops.' },
      L('konen', 'VÆST? Sådan staver man ikke vest.', "VÆST? That's not how you spell vest (west)."),
      { th: "Not my handwriting, then. One wrong letter. Like the lantern's signs." },
    ] },
    { screen: 'skiltet', fix: 'hand', title: 'Din hånd', sub: 'Find fejlen.' },
    { screen: 'panel', scene: 'camp', cast: ['konen'], lines: [
      { th: 'Twelve days of walking towards a word the lantern wrote.' },
    ] },
    { screen: 'map', stretch: 2 },
    { screen: 'panel', scene: 'dune', cast: ['lygten'], music: 'tense', lines: [
      { n: 'The highest dune so far. On the far side, a long slope of loose sand.' },
      L('lygten', 'Glid ned ad klitten. Det er den korte vej. Det koster kun ét ord.', 'Slide down the dune. It is the short way. It only costs one word.'),
    ] },
    { screen: 'choice', scene: 'dune', cast: ['lygten'], who: 'lygten', prompt: 'Svar:', options: (st) => [
      { da: 'Nej tak. Jeg går.', set: { accept2: false } },
      { da: 'Ja tak.', set: { accept2: true } },
      { en: '(EN) No.', set: { accept2: false } },
    ] },
    { screen: 'act', do: 'sell1', if: (st) => st.flags.accept2 },
    { screen: 'panel', scene: 'night', cast: ['lygten'], lines: [
      { n: 'From the top of the dune you see it: a city on the horizon. Every sign on it is one letter wrong.' },
      L('lygten', 'Jeg køber ord. Jeg kan ikke lære dem.', 'I buy words. I cannot learn them.'),
    ] },
    { screen: 'act', do: 'nextStretch' },
    { screen: 'map', stretch: 3, if: (st) => !st.flags.accept2 },
    { screen: 'act', do: 'toCity' },
    { screen: 'card', title: 'Byen', sub: 'Lygtens by' },
    { screen: 'skiltet', fix: 'city', title: 'Byen', sub: 'Ret lygtens skilte. Find fejlen.', music: 'calm' },
    { screen: 'panel', scene: 'city', cast: ['lygten'], music: 'tense', lines: [
      (st) => ({ n: st.city >= 5 ? 'Brick by brick, the streets you corrected stand solid.' : 'Most of the city still shimmers like heat.' }),
      L('lygten', 'Byen mangler ord. Giv mig dine sidste ord, så går du ud herfra i dag.', 'The city lacks words. Give me your last words, and you walk out of here today.'),
    ] },
    { screen: 'choice', scene: 'city', cast: ['lygten'], who: 'lygten', prompt: 'Svar:', options: (st) => [
      { da: 'Nej tak. Jeg går selv.', set: { gaveAll: false } },
      { da: 'Ja, tag dem.', set: { gaveAll: true } },
      { en: '(EN) No, thanks.', set: { gaveAll: false } },
    ] },
    { screen: 'act', do: 'finale' },
    { screen: 'panel', scene: 'out', cast: ['lygten'], music: 'happy', lines: [(st) => K.epilogue(st)] },
  ];

  K.epilogue = (st) => {
    const e = K.endingOf(st);
    if (e === K.ENDINGS.tavs) return [
      { n: 'One step, and the sand is gone. You stand on a road with nothing in your hands.' },
      { th: 'There is a word for the thing I am standing on. I sold it.' },
      { n: 'Behind you the city stands, every sign spelled perfectly. In your words.' },
      L('lygten', 'Tak for ordene.', 'Thanks for the words.'),
    ];
    if (e === K.ENDINGS.tak) return [
      { n: 'You walk out through streets you spelled yourself. You kept every word you found.' },
      { n: 'At the last gate the lantern drifts down to your hand and writes, slowly, in ink. No mistakes, for the first time.' },
      L('lygten', 'TAK', 'THANKS'),
    ];
    if (e === K.ENDINGS.taender) return [
      { n: 'The corrected streets stay. The lantern hangs itself on a pole at the first corner and stays too.' },
      L('lygten', 'Den røde sofa. Det hvide bord. Nu kan jeg skrive dem selv.', 'The red sofa. The white table. Now I can write them myself.'),
      { n: 'You walk out through a real town.' },
    ];
    return [
      { n: 'The city fades behind you like heat. The lantern stays with it.' },
      { th: 'West. Spelled right this time.' },
      { n: 'You walk out of the sand with what you kept.' },
    ];
  };
})(window.K = window.K || {});
