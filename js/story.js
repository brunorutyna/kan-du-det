// Kan du det?! — the story. *** SPOILERS ***  Not for Bruno's eyes before he plays.
(function (K) {
  'use strict';
  const T = (st, n) => st.tags.filter((t) => !t.ok)[n];
  const ENDINGS = {
    groenne: { title: 'Det grønne tørklæde', img: 'end1' },
    pistolen: { title: 'Pistolen', img: 'end2' },
    groent: { title: 'Et grønt tørklæde', img: 'end3' },
    sokken: { title: 'Den beige sok', img: 'end4' },
  };
  K.ENDINGS = ENDINGS;
  function endingOf(st) {
    if (st.scarf === 'sock') return 'sokken';
    if (st.scarf === 'generic') return 'groent';
    if (st.scarfViaGun) return 'pistolen';
    return 'groenne';
  }
  K.endingOf = endingOf;

  K.STORY = [
    { t: 'card', title: 'LØRDAG', sub: '08:00 · Genbrugsstationen', clock: '08:00', music: 'morgen', who: 'holger' },
    { t: 'panel', img: 'gate', fx: 'push', sfx: 'KNIRK…', lines: [
      { w: 'gun', da: 'Lørdag. Klokken otte.', en: 'Saturday. Eight o\'clock.' },
      { cap: 'The gate opens. A chest of drawers rolls off a trailer, lands on one corner and holds the pose.' },
      { w: 'kommode', da: 'Sikke en flot kommode, hva\'?!', en: 'What a fine chest of drawers, eh?!' },
      { th: 'Holger has worked here for eleven years. The furniture has never posed before.' },
    ] },
    { t: 'choice', panel: { img: 'holger', lines: [
      { cap: 'The tag gun lies on the counter, still warm, as if someone has just put it down.' },
      { th: 'He picks it up. It is polite to say good morning.' },
    ] }, who: 'holger', prompt: 'Holger siger:', options: [
      { da: 'Godmorgen, min mærkepistol.', fn: (st) => { st.gunMine = true; } },
      { da: 'Godmorgen, mærkepistol.' },
      { en: 'Morning, gun. (English: +1 sock)', fn: (st) => { st.english++; K.sock(1, 'engelsk'); } },
    ] },
    { t: 'game', id: 'containerne', clock: '08:12', music: 'duel' },
    { t: 'panel', img: 'crate', fx: 'push dark', sfx: 'DUN… DUN…', music: 'stirren', lines: [
      { cap: 'Last off the trailer: a crate. No donor. No note.' },
      { w: 'gun', da: 'Fire hundrede beige sokker.', en: 'Four hundred beige socks.' },
      { th: 'Holger aims the gun at the crate. "De beige sokker." The tag prints, sticks, and slides off. Again. It slides off again.' },
      { w: 'gun', da: 'Ingen kan sige de om dem.', en: 'Nobody can say "the" (de) about them.' },
      { cap: 'Top right of your screen: the crate. That number is your score. Lower is better.' },
    ] },
    { t: 'panel', if: (st) => st.follower, img: 'chairs', lines: [
      { w: 'stol', da: 'Hej igen!', en: 'Hello again!' },
      { th: 'One grey chair, out of a hundred identical grey chairs, has decided it belongs to Holger now. It will follow him for the rest of the day.' },
    ] },
    { t: 'card', title: '09:30', sub: 'Køen', clock: '09:30', music: 'morgen' },
    { t: 'panel', img: 'donor1', fx: 'push', lines: [
      { cap: 'By half past nine there is a queue. Everyone is proud of what they are throwing away.' },
      { w: 'donor1', da: 'Sikke et flot jakkesæt! Mit!', en: 'What a fine suit! Mine!' },
      { th: 'They shout. He has to shout back, in time, with the right ending. Every tag he prints carries exactly what he says.' },
    ] },
    { t: 'game', id: 'sikke', music: 'duel' },
    { t: 'panel', img: 'lilla', fx: 'push', sfx: 'GO GO GO GO', clock: '10:40', music: 'duel', lines: [
      { cap: 'Then she arrives. Lilac coat. Orange boots. Beige gloves. A shadow that reaches the skips.' },
      { w: 'lilla', da: 'Mit tøj ændrer sig aldrig. Kan du det?!', en: 'My clothes never change. Can you?!' },
      { th: 'Some colours never take an ending. That is her armour. Some words almost never do. Those are her traps.' },
    ] },
    { t: 'game', id: 'lilla' },
    // Twist 1: the crate grows by his own mistakes
    { t: 'panel', img: 'crate', fx: 'push dark', sfx: 'DUN', clock: '11:20', music: 'stirren', lines: [
      (st) => ({ cap: `The crate. The counter says ${st.socks}. This morning it said 400.` }),
      (st) => {
        const n = st.mistakes.filter((m) => m.day === 'holger').length;
        if (n > 0) return { th: `${n} more ${n === 1 ? 'sock' : 'socks'}. Exactly the number of times his own Danish slipped this morning. He counts twice.` };
        K.sock(1);
        return { th: 'Still 400. Then a man drops off "en eller anden stol", some chair or other, without looking at it. Click. 401.' };
      },
      { w: 'gun', da: 'Hver gang nogen siger noget forkert, kommer der en sok.', en: 'Every time someone says something wrong, a sock arrives.' },
    ] },
    // the narrator is the gun
    { t: 'panel', img: 'gun', fx: 'zoom', sfx: 'BANK… BANK…', lines: [
      { th: 'Holger looks down. The voice that has been describing his morning is coming from his hand.' },
      { w: 'gun', da: 'Ja. Det er mig.', en: 'Yes. It is me.' },
      { w: 'gun', da: 'Jeg skriver alt, du siger. Alt.', en: 'I write everything you say. Everything.' },
    ] },
    { t: 'card', title: '11:50', sub: 'Ti minutter før lukketid', clock: '11:50', music: 'stirren' },
    { t: 'panel', img: 'ellen_sat', fx: 'push', lines: [
      { cap: 'Ten to twelve. A woman puts a bag of a man\'s clothes on the counter as if it were evidence.' },
      { w: 'ellen', da: 'Min ekskærestes ting.', en: 'My ex\'s things.' },
      { th: 'She is going to tell him what she thinks of each one. He has a few seconds to answer every time.' },
    ] },
    { t: 'game', id: 'stirren' },
    { t: 'choice', panel: { img: 'ellen_sat', fx: 'zoom', lines: [
      { cap: 'At the bottom of the bag: a green scarf. She does not see it slide onto the counter.' },
      { w: 'gun', da: 'Et rødt tørklæde.', en: 'A red scarf.' },
      { th: 'It is green. Holger can see that it is green. The gun has said "rød" about everything green all morning.' },
    ] }, who: 'holger', prompt: 'Holger mærker tørklædet:', options: [
      { da: 'det grønne tørklæde', fn: (st) => { st.scarf = 'groen'; } },
      { da: 'det røde tørklæde', fn: (st) => { st.scarf = 'roed'; } },
      { da: 'et grønt tørklæde', fn: (st) => { st.scarf = 'generic'; } },
      { da: 'det grønt tørklæde', fn: (st) => { st.scarf = 'sock'; K.sock(1, 'det grønne'); K.mistake({ said: 'det grønt tørklæde', right: 'det grønne tørklæde', noun: 'toerklaede', adj: 'groen', det: 'def', day: 'holger' }); } },
    ] },
    { t: 'card', title: '12:00', sub: 'Lukketid', clock: '12:00', music: 'lukketid' },
    { t: 'panel', img: 'stampede', fx: 'shake', sfx: 'DOOOON!', lines: [
      { w: 'gun', da: 'Klokken er tolv. Porten lukker.', en: 'It is twelve o\'clock. The gate is closing.' },
      { cap: 'Everything still unsorted wants to leave at once. Drag Holger with one finger. The gun tags whatever is closest. Only tag what the gun\'s display says.' },
    ] },
    { t: 'game', id: 'lukketid' },
    { t: 'panel', img: 'gunlost', fx: 'shake', sfx: 'KLONK!', music: 'stirren', lines: [
      { cap: 'Something hits his hand.' },
      (st) => st.gunMine
        ? { th: 'The gun spins away. He catches it in the air. "Min mærkepistol." It stays with him.' }
        : { th: 'The gun spins away and lands on the lorry with everything else. It was only ever "a" tag gun. Nobody\'s.' },
      (st) => st.jacket === 'gen'
        ? { th: 'His yellow jacket is on the lorry too. On its tag, in his own words: "Holgers gule jakke".' }
        : st.jacket === 'min' ? { th: 'His jacket is back on his shoulders. "Min gule jakke." Nobody else\'s.' } : { th: 'His jacket is gone with the rest.' },
      { cap: 'The lorry leaves. The gate shuts. Holger sits down on the crate of socks.' },
    ] },
    // ---- SUNDAY ----
    { t: 'card', title: 'SØNDAG', sub: '10:00 · Loppemarkedet', cls: 'sunday', clock: '10:00', music: 'soendag', who: 'ellen' },
    { t: 'panel', img: 'ellen_sun', fx: 'push', lines: [
      { cap: 'Sunday. You are Ellen now.' },
      { th: 'She has not slept. Somewhere between the bag and the counter yesterday, her own green scarf went with her ex\'s things.' },
      { w: 'ellen', da: 'Mit grønne tørklæde.', en: 'My green scarf.' },
      { th: 'She replays ten to twelve again and again. His answers she remembers exactly. Her own words, not so well.' },
    ] },
    { t: 'game', id: 'stirrenIgen', music: 'stirren' },
    // Twist 2: Saturday wrote Sunday
    { t: 'panel', img: 'sondag', fx: 'push', music: 'soendag', lines: [
      { cap: 'The flea market. Every stall is full of things she saw yesterday at the recycling station.' },
      { th: 'And every thing wears a tag. All in one man\'s handwriting.' },
      (st) => { const t = T(st, 0); return t ? { cap: `One tag says: "${t.text}". Another says "${(T(st, 1) || t).text}".` } : { cap: 'Every tag is perfect. Every one. Except one.' }; },
      { th: 'Yesterday was not sorting. Yesterday was writing today.' },
    ] },
    { t: 'game', id: 'rettelser' },
    { t: 'panel', img: 'impostor', fx: 'push', clock: '11:30', lines: [
      { cap: 'Across the square: a man in a yellow work jacket.' },
      { w: 'ellen', da: 'Holger?', en: 'Holger?' },
      { w: 'impostor', da: 'Ja? Det er mig.', en: 'Yes? That is me.' },
      (st) => st.jacket === 'gen' ? { th: 'He answers to the name as if he had worn it all his life. The jacket fits him badly.' } : { th: 'He answers to the name a little too fast. Holger is a common name.' },
      { th: 'Then the crowd closes and he is gone.' },
    ] },
    { t: 'panel', img: 'auction', fx: 'push', clock: '12:00', music: 'auktion', lines: [
      { cap: 'A stage. A red curtain. Behind the curtain: the corner of something green.' },
      { th: 'Ellen has a thousand kroner. The auctioneer has a smile that has been practised.' },
    ] },
    { t: 'game', id: 'auktion' },
    // won the auction: the longer way back
    { t: 'panel', if: (st) => st.auction === 'won', img: 'sondag', lines: [
      { cap: 'Ellen owns a checked suit. Her purse is empty. Behind the curtain the green corner has gone, sold while she was praising buttons.' },
      { w: 'seller', da: 'Tørklædet? Det er mit nu.', en: 'The scarf? It\'s mine now.' },
    ] },
    { t: 'choice', if: (st) => st.auction === 'won', who: 'ellen', prompt: 'Ellen tilbyder et bytte:', options: [
      { da: 'Jakkesættet er alt for stort til mig. Vil du bytte?', fn: (st) => { st.suit = false; } , after: [{ w: 'seller', da: 'Et ternet jakkesæt for et tørklæde? Okay.', en: 'A checked suit for a scarf? Okay.' }] },
      { da: 'Jakkesættet er alt for stor til mig. Vil du bytte?', fn: (st) => { st.suit = false; K.sock(2, 'et jakkesæt → stort'); }, after: [{ w: 'seller', da: 'Stor? Nå. Okay, okay.', en: 'Big? Well. Okay, okay.' }] },
    ] },
    // the gun changes hands
    { t: 'panel', if: (st) => !st.gunMine, img: 'gun', fx: 'zoom', lines: [
      { w: 'auctioneer', da: 'Og den her? Den er i stykker. Den siger rød om alt, der er grønt. Halvtreds kroner.', en: 'And this one? It\'s broken. It says red about everything green. Fifty kroner.' },
      { th: 'Ellen has heard that voice before. At ten to twelve yesterday, it said "Et rødt tørklæde". She pays.' },
      { w: 'gun', da: 'Ingen har nogensinde sagt grøn til mig. Ikke rigtigt.', en: 'Nobody has ever said green to me. Not properly.' },
    ] },
    { t: 'game', if: (st) => !st.gunMine, id: 'farven' },
    { t: 'panel', img: 'sondag', clock: '13:00', music: 'soendag', lines: [
      { cap: 'Near the coffee stall: three men. One of them wrote the tags.' },
      { th: 'The writer would make the same mistakes as the tags. Nobody copies someone else\'s mistakes on purpose.' },
    ] },
    { t: 'game', id: 'hvem' },
    { t: 'panel', img: 'manden', fx: 'push', lines: [
      (st) => st.jacket === 'gen'
        ? (st.namedBack ? { th: 'The man without a jacket hears his own name in her mouth and sits up straight. "Holger." It is his again.' } : { th: 'The man without a jacket does not seem to know his own name. He will have to wait for someone to say it properly.' })
        : { th: 'Holger. The real one. He looks as if he has not slept either.' },
      { w: 'manden', da: 'Tørklædet? Det, jeg mærkede i går?', en: 'The scarf? The one I tagged yesterday?' },
      (st) => st.scarf === 'groen' ? { w: 'manden', da: 'Det grønne tørklæde. Det er unikt. Det kan man altid finde.', en: 'The green scarf. It is unique. You can always find it.' }
        : st.scarf === 'roed' ? { w: 'manden', da: 'Det røde tørklæde. Men det findes ikke.', en: 'The red scarf. But it does not exist.' }
          : st.scarf === 'generic' ? { w: 'manden', da: 'Et grønt tørklæde. Bare et af mange.', en: 'A green scarf. Just one of many.' }
            : { w: 'manden', da: 'Jeg sagde det forkert. Det blev en sok.', en: 'I said it wrong. It became a sock.' },
    ] },
    { t: 'panel', if: (st) => st.gunMine, img: 'gun', fx: 'zoom', lines: [
      { w: 'manden', da: 'Tag den. Den siger rød om alt, der er grønt.', en: 'Take it. It says red about everything green.' },
      { w: 'gun', da: 'Ingen har nogensinde sagt grøn til mig. Ikke rigtigt.', en: 'Nobody has ever said green to me. Not properly.' },
    ] },
    { t: 'game', if: (st) => st.gunMine, id: 'farven' },
    { t: 'card', title: 'SØNDAG AFTEN', sub: 'Lejligheden', cls: 'sunday', clock: '19:00', music: 'finale' },
    { t: 'panel', img: 'flat', fx: 'push', lines: [
      { cap: 'Ellen\'s new flat is small. Very small. The market followed her home.' },
      { th: 'Some things are already "the" things: Holger bound them yesterday. The rest are just things. She can only keep what she claims properly.' },
    ] },
    { t: 'game', id: 'mine' },
    { t: 'panel', img: 'sock', fx: 'zoom', sfx: 'DUN', lines: [
      { cap: 'On the floor, by the door: one beige sock. Nobody carried it in.' },
      { w: 'sok', da: 'Jeg er den beige sok.', en: 'I am the beige sock.' },
      { th: 'Not "a" sock. "The" sock. The only one of four hundred that has ever said "den" about itself.' },
      { cap: 'Now it is your turn. Not Holger\'s, not Ellen\'s: yours. Think of your own home.' },
    ] },
    { t: 'game', id: 'sokkerne' },
    { t: 'do', fn: (st) => { st.ending = endingOf(st); } },
    { t: 'ending' },
  ];

  // ending scene, written as panels
  K.endingPanels = function (st) {
    const e = st.ending;
    const holger = st.jacket === 'gen'
      ? (st.namedBack ? { th: 'Across town, a man in a polka-dot shirt answers to "Holger" again, and the man in the yellow jacket is just a man in a yellow jacket.' } : { th: 'Across town, a man in a yellow jacket answers to "Holger". The real one is still waiting for someone to say it properly.' })
      : { th: 'Across town, Holger puts on his own yellow jacket and goes home. Nobody else\'s.' };
    const base = {
      groenne: [{ cap: 'Det grønne tørklæde. Unikt. Hers. Found, because one man said "det" on a Saturday.' }, { w: 'ellen', da: 'Mit grønne tørklæde.', en: 'My green scarf.' }],
      pistolen: [{ cap: 'The red scarf that never existed turned green the moment someone said so. Ellen keeps the scarf. And the narrator.' }, { w: 'gun', da: 'Hvad skal vi mærke nu?', en: 'What shall we tag now?' }],
      groent: [{ cap: 'Et grønt tørklæde. Not hers. Just one of many green scarves. Too big. She wears it anyway.' }, { w: 'ellen', da: 'Det er lidt for stort. Men det er mit.', en: 'It is a bit too big. But it is mine.' }],
      sokken: [{ cap: 'Her scarf became a sock on Saturday. So she wears the sock.' }, { w: 'ellen', da: 'Den beige sok. Min beige sok.', en: 'The beige sock. My beige sock.' }],
    }[e];
    return { img: ENDINGS[e].img, fx: 'push', lines: base.concat([holger, (s) => ({ cap: `The crate: ${s.socks} socks.` })]) };
  };
})(window.K = window.K || {});
