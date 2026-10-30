// Kan du det?! — vocabulary, inflection and glossary (no spoilers in this file).
(function (K) {
  'use strict';

  // Nouns. g: 'c' = en-word, 'n' = et-word, 'p' = plural only. art = object card file.
  const N = {
    kjole: { da: 'kjole', g: 'c', pl: 'kjoler', en: 'dress', art: 'kjole' },
    nederdel: { da: 'nederdel', g: 'c', pl: 'nederdele', en: 'skirt', art: 'nederdel' },
    skjorte: { da: 'skjorte', g: 'c', pl: 'skjorter', en: 'shirt', art: 'skjorte' },
    bluse: { da: 'bluse', g: 'c', pl: 'bluser', en: 'blouse', art: 'bluse' },
    troeje: { da: 'trøje', g: 'c', pl: 'trøjer', en: 'jumper', art: 'troeje' },
    haettetroeje: { da: 'hættetrøje', g: 'c', pl: 'hættetrøjer', en: 'hoodie', art: 'haettetroeje' },
    jakke: { da: 'jakke', g: 'c', pl: 'jakker', en: 'jacket', art: 'jakke' },
    frakke: { da: 'frakke', g: 'c', pl: 'frakker', en: 'coat', art: 'frakke' },
    jakkesaet: { da: 'jakkesæt', g: 'n', pl: 'jakkesæt', en: 'suit', art: 'jakkesaet' },
    bukser: { da: 'bukser', g: 'p', pl: 'bukser', en: 'trousers', art: 'bukser' },
    sokker: { da: 'sokker', g: 'p', pl: 'sokker', en: 'socks', art: 'sokker' },
    sok: { da: 'sok', g: 'c', pl: 'sokker', en: 'sock', art: 'sokker' },
    slips: { da: 'slips', g: 'n', pl: 'slips', en: 'tie', art: 'slips' },
    baelte: { da: 'bælte', g: 'n', pl: 'bælter', en: 'belt', art: 'baelte' },
    toerklaede: { da: 'tørklæde', g: 'n', pl: 'tørklæder', en: 'scarf', art: 'toerklaede' },
    hue: { da: 'hue', g: 'c', pl: 'huer', en: 'beanie', art: 'hue' },
    kasket: { da: 'kasket', g: 'c', pl: 'kasketter', en: 'cap', art: 'kasket' },
    handsker: { da: 'handsker', g: 'p', pl: 'handsker', en: 'gloves', art: 'handsker' },
    sko: { da: 'sko', g: 'p', pl: 'sko', en: 'shoes', art: 'sko' },
    stoevler: { da: 'støvler', g: 'p', pl: 'støvler', en: 'boots', art: 'stoevler' },
    gummistoevler: { da: 'gummistøvler', g: 'p', pl: 'gummistøvler', en: 'wellies', art: 'gummistoevler' },
    taske: { da: 'taske', g: 'c', pl: 'tasker', en: 'bag', art: 'taske' },
    rygsaek: { da: 'rygsæk', g: 'c', pl: 'rygsække', en: 'backpack', art: 'rygsaek' },
    sofa: { da: 'sofa', g: 'c', pl: 'sofaer', en: 'sofa', art: 'sofa' },
    laenestol: { da: 'lænestol', g: 'c', pl: 'lænestole', en: 'armchair', art: 'laenestol' },
    stol: { da: 'stol', g: 'c', pl: 'stole', en: 'chair', art: 'stol' },
    stole: { da: 'stole', g: 'p', pl: 'stole', en: 'chairs', art: 'stol' },
    bord: { da: 'bord', g: 'n', pl: 'borde', en: 'table', art: 'bord' },
    skab: { da: 'skab', g: 'n', pl: 'skabe', en: 'cupboard', art: 'skab' },
    kommode: { da: 'kommode', g: 'c', pl: 'kommoder', en: 'chest of drawers', art: 'kommode' },
    reol: { da: 'reol', g: 'c', pl: 'reoler', en: 'bookcase', art: 'reol' },
    hylde: { da: 'hylde', g: 'c', pl: 'hylder', en: 'shelf', art: 'hylde' },
    hylder: { da: 'hylder', g: 'p', pl: 'hylder', en: 'shelves', art: 'hylde' },
    seng: { da: 'seng', g: 'c', pl: 'senge', en: 'bed', art: 'seng' },
    taeppe: { da: 'tæppe', g: 'n', pl: 'tæpper', en: 'rug', art: 'taeppe' },
    gardin: { da: 'gardin', g: 'n', pl: 'gardiner', en: 'curtain', art: 'gardin' },
    gardiner: { da: 'gardiner', g: 'p', pl: 'gardiner', en: 'curtains', art: 'gardin' },
    pude: { da: 'pude', g: 'c', pl: 'puder', en: 'cushion', art: 'pude' },
    puder: { da: 'puder', g: 'p', pl: 'puder', en: 'cushions', art: 'pude' },
    lampe: { da: 'lampe', g: 'c', pl: 'lamper', en: 'lamp', art: 'lampe' },
    maerkepistol: { da: 'mærkepistol', g: 'c', pl: 'mærkepistoler', en: 'tag gun', art: null },
  };

  // Adjectives. base = en-word indefinite, t = et-word indefinite, pl = plural, def = definite singular.
  // col = colour for tinting object cards, pat = pattern overlay.
  const A = {
    roed: { base: 'rød', t: 'rødt', pl: 'røde', def: 'røde', en: 'red', col: '#e3242b' },
    hvid: { base: 'hvid', t: 'hvidt', pl: 'hvide', def: 'hvide', en: 'white', col: '#fbfaf3' },
    groen: { base: 'grøn', t: 'grønt', pl: 'grønne', def: 'grønne', en: 'green', col: '#16a34a' },
    gul: { base: 'gul', t: 'gult', pl: 'gule', def: 'gule', en: 'yellow', col: '#ffd60a' },
    brun: { base: 'brun', t: 'brunt', pl: 'brune', def: 'brune', en: 'brown', col: '#8b5a2b' },
    sort: { base: 'sort', t: 'sort', pl: 'sorte', def: 'sorte', en: 'black', col: '#2a2a2e' },
    blaa: { base: 'blå', t: 'blåt', pl: 'blå', def: 'blå', en: 'blue', col: '#1d4ed8' },
    graa: { base: 'grå', t: 'gråt', pl: 'grå', def: 'grå', en: 'grey', col: '#8d9098' },
    orange: { base: 'orange', t: 'orange', pl: 'orange', def: 'orange', en: 'orange', col: '#ff7a00' },
    lilla: { base: 'lilla', t: 'lilla', pl: 'lilla', def: 'lilla', en: 'purple', col: '#9b4fd8' },
    beige: { base: 'beige', t: 'beige', pl: 'beige', def: 'beige', en: 'beige', col: '#d8c39a' },
    lyseroed: { base: 'lyserød', t: 'lyserødt', pl: 'lyserøde', def: 'lyserøde', en: 'pink', col: '#ff8cc6' },
    lyseblaa: { base: 'lyseblå', t: 'lyseblåt', pl: 'lyseblå', def: 'lyseblå', en: 'light blue', col: '#8fd3ff' },
    prikket: { base: 'prikket', t: 'prikket', pl: 'prikkede', def: 'prikkede', en: 'dotted', pat: 'dots' },
    stribet: { base: 'stribet', t: 'stribet', pl: 'stribede', def: 'stribede', en: 'striped', pat: 'stripes' },
    ternet: { base: 'ternet', t: 'ternet', pl: 'ternede', def: 'ternede', en: 'checked', pat: 'checks' },
    paen: { base: 'pæn', t: 'pænt', pl: 'pæne', def: 'pæne', en: 'nice' },
    smuk: { base: 'smuk', t: 'smukt', pl: 'smukke', def: 'smukke', en: 'beautiful' },
    flot: { base: 'flot', t: 'flot', pl: 'flotte', def: 'flotte', en: 'handsome, smart' },
    smart: { base: 'smart', t: 'smart', pl: 'smarte', def: 'smarte', en: 'stylish' },
    laekker: { base: 'lækker', t: 'lækkert', pl: 'lækre', def: 'lækre', en: 'gorgeous, lovely' },
    ny: { base: 'ny', t: 'nyt', pl: 'nye', def: 'nye', en: 'new' },
    gammel: { base: 'gammel', t: 'gammelt', pl: 'gamle', def: 'gamle', en: 'old' },
    lille: { base: 'lille', t: 'lille', pl: 'små', def: 'lille', en: 'small' },
    stor: { base: 'stor', t: 'stort', pl: 'store', def: 'store', en: 'big' },
    dyr: { base: 'dyr', t: 'dyrt', pl: 'dyre', def: 'dyre', en: 'expensive' },
    billig: { base: 'billig', t: 'billigt', pl: 'billige', def: 'billige', en: 'cheap' },
    grim: { base: 'grim', t: 'grimt', pl: 'grimme', def: 'grimme', en: 'ugly' },
    kedelig: { base: 'kedelig', t: 'kedeligt', pl: 'kedelige', def: 'kedelige', en: 'boring' },
    maerkelig: { base: 'mærkelig', t: 'mærkeligt', pl: 'mærkelige', def: 'mærkelige', en: 'strange' },
    slidt: { base: 'slidt', t: 'slidt', pl: 'slidte', def: 'slidte', en: 'worn' },
  };

  const COLOURS = ['roed', 'hvid', 'groen', 'gul', 'brun', 'sort', 'blaa', 'graa', 'orange', 'lilla', 'beige', 'lyseroed', 'lyseblaa'];
  const PATTERNS = ['prikket', 'stribet', 'ternet'];
  const INVARIABLE = ['orange', 'lilla', 'beige'];

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Correct adjective form for a noun in a given frame.
  // frame: 'indef' (en/et/nogle), 'def' (den/det/de, min/mit/mine, genitive), 'pred' (after er)
  function adjForm(adj, noun, frame) {
    const a = A[adj], n = N[noun];
    if (n.g === 'p') return a.pl;
    if (frame === 'def') return a.def;
    return n.g === 'n' ? a.t : a.base;
  }
  const ART = {
    indef: { c: 'en', n: 'et', p: 'nogle' },
    def: { c: 'den', n: 'det', p: 'de' },
    min: { c: 'min', n: 'mit', p: 'mine' },
    din: { c: 'din', n: 'dit', p: 'dine' },
    pron: { c: 'den', n: 'det', p: 'de' },
  };
  function nounForm(noun) { const n = N[noun]; return n.g === 'p' ? n.pl : n.da; }

  // Build a noun phrase. det: 'indef' | 'def' | 'min' | 'din' | a genitive like 'Holgers' | 'sikke'
  function np(det, adjs, noun) {
    const n = N[noun];
    const frame = (det === 'indef' || det === 'sikke') ? 'indef' : 'def';
    const words = [];
    if (det === 'sikke') words.push('Sikke', ART.indef[n.g]);
    else if (ART[det]) words.push(ART[det][n.g]);
    else words.push(det);
    (adjs || []).forEach((a) => words.push(adjForm(a, noun, frame)));
    words.push(nounForm(noun));
    return words.join(' ');
  }

  // Wrong variants of the same phrase (one ending changed), for choices and for Holger's "fingerprint".
  const ENDINGS = { c: (a) => a.base, n: (a) => a.t, p: (a) => a.pl, d: (a) => a.def };
  function adjVariants(adj) {
    const a = A[adj], set = new Set([a.base, a.t, a.pl, a.def]);
    // learner forms: add -t / -e to forms that do not take them
    if (!a.base.endsWith('t')) set.add(a.base + 't');
    if (!/[eå]$/.test(a.base)) set.add(a.base + 'e');
    if (adj === 'gammel') { set.add('gammele'); }
    if (adj === 'laekker') { set.add('lækkre'); }
    if (adj === 'lille') { set.add('lillet'); set.add('lillee'); }
    return [...set];
  }
  // Phrase with the adjective form replaced (to make a wrong option).
  function npWith(det, adj, noun, form) {
    const n = N[noun];
    const right = np(det, [adj], noun);
    const frame = (det === 'indef' || det === 'sikke') ? 'indef' : 'def';
    return right.replace(new RegExp('(^|\\s)' + adjForm(adj, noun, frame) + '(\\s)'), '$1' + form + '$2');
  }
  function wrongForms(det, adj, noun, k) {
    const right = np(det, [adj], noun);
    const out = [];
    adjVariants(adj).forEach((f) => { const w = npWith(det, adj, noun, f); if (w !== right && !out.includes(w)) out.push(w); });
    // wrong article as well
    const n = N[noun];
    if (det === 'indef' || det === 'def') {
      const other = n.g === 'c' ? 'n' : 'c';
      if (n.g !== 'p') {
        const swapped = right.replace(/^(en|et|den|det) /, ART[det][other] + ' ');
        if (!out.includes(swapped)) out.push(swapped);
      }
    }
    return shuffle(out).slice(0, k || 2);
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // Why a form is right, in one line.
  function why(det, adj, noun) {
    const n = N[noun], a = A[adj];
    const frame = (det === 'indef' || det === 'sikke') ? 'indef' : 'def';
    const f = adjForm(adj, noun, frame);
    if (INVARIABLE.includes(adj)) return `${a.base} never changes: ${f}.`;
    if (n.g === 'p') {
      if (adj === 'lille') return 'lille has its own plural: små.';
      if (adj === 'blaa' || adj === 'graa') return `${a.base} takes no -e: de/nogle ${a.base}.`;
      if (A[adj].pat) return `-et becomes -ede in the plural: ${f}.`;
      if (adj === 'gammel' || adj === 'laekker') return `Plural: -e, and the e before the last letter drops: ${f}.`;
      return `Plural: the adjective takes -e (${f}).`;
    }
    if (frame === 'def') {
      if (adj === 'lille') return 'After den/det/min: lille stays lille.';
      if (adj === 'blaa' || adj === 'graa') return `After den/det/min: ${a.base} stays ${a.base}.`;
      if (adj === 'gammel') return 'After den/det/min: gammel → gamle.';
      if (adj === 'laekker') return 'After den/det/min: lækker → lækre.';
      if (A[adj].pat) return `After den/det/min: -et → -ede (${f}).`;
      return `After den/det/de, min/mit or a genitive, the adjective takes -e: ${f}.`;
    }
    if (n.g === 'n') {
      if (f === a.base) return a.base.endsWith('t') ? `${a.base} ends in -t already, so ${f} stays.` : `${a.base} takes no -t: et ${f} …`;
      return `et-word: the adjective takes -t (${f}).`;
    }
    return `en-word: no ending (${f}).`;
  }

  // Glossary: every Danish word that appears in the game. Lowercase keys.
  const DICT = {
    // articles, pronouns, small words
    en: 'a', et: 'a', nogle: 'some', den: 'the / it', det: 'the / it / that', de: 'the / they', der: 'there / who',
    min: 'my', mit: 'my', mine: 'my', din: 'your', dit: 'your', dine: 'your', hans: 'his', hendes: 'her',
    sin: 'his/her own', sit: 'his/her own', sine: 'his/her own', vores: 'our', jeres: 'your (pl.)', deres: 'their',
    jeg: 'I', du: 'you', han: 'he', hun: 'she', vi: 'we', mig: 'me', dig: 'you', ham: 'him', hende: 'her', os: 'us', dem: 'them',
    er: 'is / am / are', var: 'was', kan: 'can', kunne: 'could', vil: 'will / want to', skal: 'shall / must', har: 'have / has', have: 'have',
    ikke: 'not', også: 'also, too', heller: 'either (heller ikke = not either)', godt: 'well / (kan godt lide = like)', lide: '(kan lide) like',
    så: 'so / then', vild: 'wild (vild med = crazy about)', med: 'with', af: 'of', til: 'to', for: 'too / for', lidt: 'a bit', alt: 'everything / (alt for = far too)',
    bare: 'just', jo: 'yes (after a negative question) / you know', ja: 'yes', nej: 'no', nå: 'oh', hvad: 'what', hvor: 'where / how', hvem: 'who',
    hvorfor: 'why', sikke: 'what a …!', synes: 'think (opinion)', tror: 'believe', gør: 'do / does', rigtig: 'really / right', virkelig: 'really',
    meget: 'very / much', mange: 'many', tak: 'thanks', og: 'and', men: 'but', eller: 'or', at: 'to / that', om: 'about', på: 'on / at', i: 'in',
    fra: 'from', ved: 'by / at', siden: 'side (ved siden af = next to)', overfor: 'opposite', hjørnet: 'the corner', lige: 'just / right',
    nu: 'now', her: 'here', der_: '', klokken: 'the time / at (o\'clock)', otte: 'eight', tolv: 'twelve', lørdag: 'Saturday', søndag: 'Sunday',
    kr: 'kroner', kroner: 'kroner', hundrede: 'hundred', fire: 'four', fem: 'five', tusind: 'thousand', to: 'two', tre: 'three', seks: 'six', ti: 'ten', halvtreds: 'fifty',
    ét: 'one', én: 'one', ingen: 'nobody / no', alle: 'all', alting: 'everything', noget: 'something', nogen: 'someone / anyone', hver: 'every',
    hva: 'eh? (tag)', hold: 'hold (hold da op = wow)', da: '(hold da op = wow) / then', op: 'up',
    // verbs
    hedder: 'is called', kostede: 'cost', koster: 'costs', købe: 'buy', købt: 'bought', købte: 'bought', solgt: 'sold', sælge: 'sell',
    se: 'see / look', ser: 'sees / looks', ud: 'out', tage: 'take', tag: 'take!', giv: 'give!', gå: 'go', går: 'goes', kom: 'come!', kommer: 'comes',
    smid: 'throw!', smide: 'throw', behold: 'keep!', beholde: 'keep', vent: 'wait!', stop: 'stop!', siger: 'says', sige: 'say', sagde: 'said',
    hører: 'hear(s)', ved_: '', mener: 'mean(s)', finder: 'find(s)', finde: 'find', fundet: 'found', mistet: 'lost', glemt: 'forgotten', kender: 'know(s)',
    lugter: 'smells', passer: 'fits / suits', elsker: 'love(s)', hader: 'hate(s)', bud: 'bid', byder: 'bid(s)', første: 'first', anden: 'second', tredje: 'third',
    // nouns used in lines
    genbrugsstationen: 'the recycling station', genbrugsstation: 'recycling station', loppemarked: 'flea market', loppemarkedet: 'the flea market',
    mærkepistol: 'tag gun', mærkepistolen: 'the tag gun', mærke: 'tag / label', mærker: 'tags', mærket: 'the tag', kasse: 'crate', kassen: 'the crate',
    pris: 'price', prisen: 'the price', penge: 'money', tilbud: 'offer', butik: 'shop', navn: 'name', navnet: 'the name', mand: 'man', manden: 'the man',
    kvinde: 'woman', sok: 'sock', sokken: 'the sock', sokkerne: 'the socks', ting: 'thing(s)', tingene: 'the things', farve: 'colour', farven: 'the colour',
    lot: 'lot (at auction)', hammeren: 'the hammer', kunde: 'customer', gang: 'time / once', minutter: 'minutes', morgen: 'morning', godmorgen: 'good morning',
    ven: 'friend', ex: 'ex', kæreste: 'partner', lejlighed: 'flat', lejligheden: 'the flat', hjem: 'home', værsgo: 'here you are',
    // reactions
    flot: 'smart, handsome', flotte: 'smart (pl./def.)', lækkert: 'lovely (et)', lækre: 'lovely (pl./def.)',
  };
  Object.assign(DICT, {
    hej: 'hi', igen: 'again', tøj: 'clothes', ændrer: 'changes', sig: 'oneself (ændrer sig = changes)', aldrig: 'never', forkert: 'wrong', skriver: 'write(s)',
    ekskærestes: "ex-partner's", porten: 'the gate', lukker: 'closes', holger: 'Holger (a name)', holgers: "Holger's", bytte: 'swap', okay: 'okay', stykker: 'pieces (i stykker = broken)',
    nogensinde: 'ever', sagt: 'said', rigtigt: 'right, correct', mærkede: 'tagged', unikt: 'unique (et)', unik: 'unique', man: 'one, you (general)', altid: 'always',
    findes: 'exists', blev: 'became', bliver: 'becomes / stays', kun: 'only', bange: 'afraid', rustning: 'armour', tager: 'take(s)', rette: 'correct, fix', nummer: 'number',
    damen: 'the lady', stiger: 'rises', falder: 'falls', tilbage: 'back', næste: 'next', knapper: 'buttons', perfekt: 'perfectly', sidste: 'last', chance: 'chance',
    folk: 'people', 'åh': 'oh', stemme: 'voice', står: 'stands (hvad står der = what does it say)', huske: 'remember', endelig: 'finally', hvordan: 'how',
    rigtige: 'right, correct', endelse: 'ending', svarer: 'answers', ting: 'thing(s)', jakkesættet: 'the suit', tæppet: 'the curtain (stage) / the rug', hundredvis: 'hundreds', bag: 'behind', vælg: 'choose!', adjektiv: 'adjective', laver: 'makes', samme: 'same', slags: 'kind', fejl: 'mistake', tryk: 'tap!', høre: 'hear', vælge: 'choose', stil: 'style', hvilken: 'which', farve: 'colour', gule: 'yellow (def./pl.)', går: 'goes', kunne: 'could',
  });
  // learner forms of adjectives: same meaning, so tapping never gives the answer away
  Object.keys(A).forEach((k) => adjVariants(k).forEach((f) => { DICT[f] = DICT[f] || A[k].en; }));
  // add every noun and adjective form to the glossary automatically
  Object.values(N).forEach((n) => { DICT[n.da] = DICT[n.da] || n.en; DICT[n.pl] = DICT[n.pl] || n.en + ' (pl.)'; });
  Object.values(A).forEach((a) => { [a.base, a.t, a.pl, a.def].forEach((f) => { DICT[f] = DICT[f] || a.en; }); });
  // definite noun forms that appear in lines
  Object.assign(DICT, {
    tørklædet: 'the scarf', jakken: 'the jacket', lampen: 'the lamp', kommoden: 'the chest of drawers', jakkesættet: 'the suit', stolen: 'the chair',
    sofaen: 'the sofa', slipset: 'the tie', skjorten: 'the shirt', huen: 'the beanie', støvlerne: 'the boots', skoene: 'the shoes', tasken: 'the bag',
  });

  K.N = N; K.A = A; K.COLOURS = COLOURS; K.PATTERNS = PATTERNS; K.INVARIABLE = INVARIABLE;
  K.np = np; K.adjForm = adjForm; K.nounForm = nounForm; K.wrongForms = wrongForms; K.npWith = npWith; K.adjVariants = adjVariants;
  K.why = why; K.DICT = DICT; K.shuffle = shuffle; K.pick = pick; K.cap = cap; K.ART = ART;
})(window.K = window.K || {});
