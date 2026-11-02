// TØRLAGT · DEL 5: FÆTTER. SPOILERS. Chapters 25–29: a review of the book's chapter 2 (describing people, jobs,
// calling in sick, appointments) and 3.1 (rooms, movement, den/det/dem, egen), told as one enormous trip with the
// dealer. One playthrough, set-up → swerve. Design: claude/toerlagt-del5.md (§14–15 are final).
(function (K) {
  'use strict';
  const L = (w, da, en) => ({ w, da, en });
  const lesson = (o) => Object.assign({ screen: 'lesson', replay: true }, o);
  const sc = (st, id) => ((st.tally || {})[id] || { ok: 0, n: 0 });
  const f = (st) => st.flags || {};
  const bond = (st) => Math.max(-3, Math.min(3, f(st).bond | 0));
  const PIECES = ['stemme', 'tanker', 'droemme', 'minder', 'appetit', 'skam', 'navn'];
  const lostOf = (st) => PIECES.filter((p) => f(st)['lost_' + p]);

  Object.assign(K.CAST, {
    oejet: { name: 'Øjet', e: '👁️', color: '#d9e2f2', pitch: 0.7 },
    del: { name: 'En del af dig', e: '🧩', color: '#f2d24b', pitch: 1.2 },
  });
  Object.assign(K.SCENES, {
    huset: { from: '#2c2438', to: '#0d0a12', label: 'Huset, der er dig', trip: true },
    spejl: { from: '#f0c27a', to: '#8a3c1c', label: 'Luftspejlinger', trip: true },
    kosmos: { from: '#0b0f2e', to: '#000005', label: 'Udenfor', trip: true },
    daggry: { from: '#f2a07a', to: '#3a2a3c', label: 'Daggry' },
  });
  K.CHAPTERS.push(
    { title: 'Fætter', topic: 'repetition: beskrive nogen, der, sin/hans/hendes, synes' },
    { title: 'Indeni', topic: 'repetition: rum, ind/inde, den/det/dem, egen' },
    { title: 'Luftspejlinger', topic: 'repetition: job, i/på, i gang med, kunne godt tænke sig' },
    { title: 'Stjernerne', topic: 'repetition: afbud, flytte, datoer, klokken, tror' },
    { title: 'Nedturen', topic: 'repetition: alt fra kapitel 2 og 3.1' },
  );
  // the lint samples these too (they are not set by a choice)
  K.LINT_FLAGS = (K.LINT_FLAGS || []).concat(PIECES.map((p) => 'lost_' + p), ['spurgte']);

  // ---------- 25 · Samtalen (talk): bond +1 = closer to her, −1 = further away; one wrong reply each
  const r = (da, bondV, reply, en, extra) => Object.assign({ da, ok: true, bond: bondV, reply, en }, extra || {});
  const w = (da, fix, reply, en, why) => ({ da, ok: false, fix, reply, en, why });
  const SAMTALEN = [
    { says: 'Kan du mærke det, fætter?', en: 'Can you feel it, cousin?', replies: [
      r('Ja. Det er dig, der er inde i mig.', 1, 'Ja. Jeg er lige her, inde i dig.', 'Yes. I am right here, inside you.'),
      r('Ja. Og jeg synes ikke, det er sjovt.', -1, 'Nej. Det er det heller ikke. Ikke endnu.', 'No. It is not. Not yet.'),
      w('Ja. Det er dig, der er altid inde i mig.', 'Ja. Det er dig, der altid er inde i mig.', 'Altid? Åh, fætter. Det er det sødeste, du har sagt.', 'Always? Oh, cousin. That is the sweetest thing you have said.', 'In a der-clause the adverb comes before the verb: der altid er.'),
    ] },
    { says: 'Er du sur på mig?', en: 'Are you angry with me?', replies: [
      r('Du spurgte ikke, om jeg ville.', -1, 'Nej. Det gør jeg aldrig. Undskyld.', 'No. I never do. Sorry.', { set: { spurgte: true } }),
      r('Nej. Jeg er bare lidt forvirret.', 1, 'Forvirret er godt. Forvirret er begyndelsen.', 'Confused is good. Confused is the beginning.'),
      w('Nej. Jeg er bare lidt forvirrede.', 'Nej. Jeg er bare lidt forvirret.', 'Forvirrede? Er I flere nu? Hej, alle sammen.', 'Confused (plural)? Are there several of you now? Hi, everybody.', 'One person: forvirret. The -e form is for plural.'),
    ] },
    { says: 'Hvad synes du om mig, fætter?', en: 'What do you think of me, cousin?', replies: [
      r('Jeg synes faktisk, du er sød.', 1, 'Sød! Det har ingen sagt til mig før.', 'Sweet! Nobody has said that to me before.'),
      r('Jeg synes, du er lidt for rød.', -1, 'Rød er min farve. Den er ikke for meget.', 'Red is my colour. It is not too much.'),
      w('Jeg faktisk synes, du er sød.', 'Jeg synes faktisk, du er sød.', 'Sød? Sød! Åh.', '(She only heard "sød". She blushes so hard she drops a spore.)', 'faktisk goes right after synes: Jeg synes faktisk, …'),
    ] },
    { says: 'Det er dig, der altid kommer tilbage til mig. Ikke omvendt.', en: 'It is you who always comes back to me. Not the other way round.', replies: [
      r('Nej, det er dig, der altid kommer.', -1, 'Hm. Ja. Jeg kommer altid. Det er mit job.', 'Hm. Yes. I always come. It is my job.'),
      r('Ja. Det er mig.', 1, 'Det vidste jeg godt.', 'I knew that.'),
      w('Nej, det er dig, der kommer altid.', 'Nej, det er dig, der altid kommer.', 'Kommer altid? Hvorhen? Skal vi gå?', 'Comes always? Where to? Shall we go?', 'der altid kommer: in a der-clause the adverb comes before the verb.'),
    ] },
    { says: 'Hvis dug var det, jeg tog?', en: 'Whose dew was it that I took?', replies: [
      r('Det var din egen dug.', 1, 'Ja. Min egen. Og nu er den også din.', 'Yes. My own. And now it is yours too.'),
      r('Det var Gribbens dug. Du tog hans dug.', -1, 'Hans? … Ja. Måske. Sig det ikke til ham.', "His? … Yes. Maybe. Don't tell him."),
      w('Det var Gribbens dug. Du tog sin dug.', 'Det var Gribbens dug. Du tog hans dug.', 'Min egen? Nå, så er alt i orden.', 'My own? Well, then everything is fine.', 'Not her own (it is Gribben’s): hans. sin is only for the subject’s own.'),
    ] },
    { says: 'Hvordan ser jeg ud lige nu?', en: 'What do I look like right now?', replies: [
      r('Du er stor. Du er meget, meget stor.', 1, 'Nej. Det er dig, der er lille.', 'No. It is you who is small.'),
      r('Du ser lidt nervøs ud.', -1, 'Nervøs? Mig? … Ja. Lidt.', 'Nervous? Me? … Yes. A bit.'),
      w('Du ser lidt nervøst ud.', 'Du ser lidt nervøs ud.', 'Nervøst? Er jeg et et-ord nu? Fedt.', 'Nervous (-t)? Am I an et-word now? Cool.', 'About a person (en): nervøs, without -t.'),
    ] },
    { says: (st) => (bond(st) >= 1 ? 'Du kan godt lide mig. Det kan jeg se.' : bond(st) <= -1 ? 'Du kigger hele tiden væk.' : 'Du er svær at læse, fætter.'),
      en: 'You like me / You keep looking away / You are hard to read, cousin.', replies: [
      r('Jeg synes, du er mærkelig. Men sød.', 1, 'Mærkelig og sød. Det skriver jeg på min hat.', 'Strange and sweet. I will write that on my cap.'),
      r('Jeg kan godt lide mig selv. Det er nyt.', -1, 'Dig selv? Det har du aldrig sagt før.', 'Yourself? You have never said that before.'),
      w('Jeg kan godt lide mig selv. Det er ny.', 'Jeg kan godt lide mig selv. Det er nyt.', 'Ny? Er jeg ny? Tak, fætter.', 'New? Am I new? Thanks, cousin.', 'When det means "this / that situation", the adjective takes -t: Det er nyt.'),
    ] },
  ];

  // ---------- 26 · Indeni (board map): the house of the self; one piece calls at a time; the house rearranges
  const ROOMS = [
    { id: 'loft', e: '🪜', label: 'loftet', level: 'oppe' },
    { id: 'sove', e: '🛏️', label: 'soveværelset', level: 'inde' },
    { id: 'stue', e: '🛋️', label: 'stuen', level: 'inde' },
    { id: 'koekken', e: '🍳', label: 'køkkenet', level: 'ude' },
    { id: 'gang', e: '🚪', label: 'gangen', level: 'ude', start: true },
    { id: 'kaelder', e: '🕸️', label: 'kælderen', level: 'nede' },
    { id: 'bad', e: '🛁', label: 'badeværelset', level: 'ude' },
    { id: 'oerken', e: '🏜️', label: 'Ørkenen', lock: 'aldrig' },
  ];
  const LAYOUTS = [
    ['loft', 'oerken', 'sove', 'stue', 'gang', 'koekken', 'kaelder', 'bad'],
    ['sove', 'loft', 'oerken', 'koekken', 'stue', 'gang', 'bad', 'kaelder'],
    ['oerken', 'sove', 'loft', 'gang', 'koekken', 'stue', 'kaelder', 'bad'],
    ['loft', 'gang', 'oerken', 'bad', 'sove', 'koekken', 'stue', 'kaelder'],
    ['koekken', 'loft', 'sove', 'oerken', 'bad', 'gang', 'kaelder', 'stue'],
    ['loft', 'sove', 'gang', 'stue', 'oerken', 'koekken', 'bad', 'kaelder'],
    ['gang', 'oerken', 'loft', 'koekken', 'bad', 'sove', 'kaelder', 'stue'],
  ];
  const step = (q, right, wrong, why) => ({ q, right, wrong, why });
  const PIECE = [
    { id: 'stemme', who: 'del', e: '🗣️', item: 'stemme', room: 'stue', clue: 'Jeg er din stemme. Jeg ligger inde i stuen.', steps: [
      step('Hvad siger du?', 'Jeg går ind og henter den.', ['Jeg går inde og henter den.', 'Jeg går ind og henter dem.'], 'Movement: ind. en stemme: den.'),
      step('Stemmen: Er jeg din?', 'Ja, du er min egen stemme.', ['Ja, du er mit egen stemme.', 'Ja, du er min eget stemme.'], 'en stemme: min egen.'),
    ] },
    { id: 'tanker', who: 'del', e: '💭', item: 'tanker', room: 'loft', clue: 'Vi er dine tanker. Vi er oppe på loftet.', steps: [
      step('Hvad siger du?', 'Jeg går op og henter dem.', ['Jeg går oppe og henter dem.', 'Jeg går op og henter den.'], 'Movement: op. tanker (plural): dem.'),
      step('Tankerne: Er vi dine egne?', 'Ja, det er mine egne tanker.', ['Ja, det er mine egen tanker.', 'Ja, det er min egne tanker.'], 'Plural: mine egne.'),
    ] },
    { id: 'droemme', who: 'del', e: '🌙', item: 'drømme', room: 'sove', clue: 'Vi er dine drømme. Vi ligger inde i soveværelset.', steps: [
      step('Hvad siger du?', 'Jeg går ind og henter dem.', ['Jeg går ind og henter den.', 'Jeg går inde og henter dem.'], 'Movement: ind. drømme (plural): dem.'),
      step('Drømmene: Hvem drømmer om os?', 'Det gør jeg. Det er mine egne drømme.', ['Det gør jeg. Det er mine eget drømme.', 'Det gør jeg. Det er min egne drømme.'], 'Plural: mine egne.'),
    ] },
    { id: 'minder', who: 'del', e: '📦', item: 'minder', room: 'kaelder', clue: 'Vi er dine minder. Vi ligger nede i kælderen.', steps: [
      step('Hvad siger du?', 'Jeg går ned og henter dem.', ['Jeg går nede og henter dem.', 'Jeg går ned og henter det.'], 'Movement: ned. minder (plural): dem.'),
      step('Minderne: Kan du huske os?', 'Ja, det er mine minder.', ['Ja, det er min minder.', 'Ja, det er mit minder.'], 'Plural: mine.'),
    ] },
    { id: 'appetit', who: 'del', e: '🍽️', item: 'appetit', room: 'koekken', clue: 'Jeg er din appetit. Jeg står ude i køkkenet.', steps: [
      step('Hvad siger du?', 'Jeg går ud og henter den.', ['Jeg går ude og henter den.', 'Jeg går ud og henter det.'], 'Movement: ud. en appetit: den.'),
      step('Appetitten: Er du sulten?', 'Ja. Jeg har min egen appetit igen.', ['Ja. Jeg har mit egen appetit igen.', 'Ja. Jeg har min eget appetit igen.'], 'en appetit: min egen.'),
    ] },
    { id: 'skam', who: 'del', e: '🫣', item: 'skam', room: 'bad', clue: 'Jeg er din skam. Jeg gemmer mig ude på badeværelset.', steps: [
      step('Hvad siger du?', 'Jeg går ud og henter den.', ['Jeg går ude og henter den.', 'Jeg går ud og henter dem.'], 'Movement: ud. en skam: den.'),
      step('Skammen: Vil du ikke hellere glemme mig?', 'Nej. Du er min. Du skal med.', ['Nej. Du er mit. Du skal med.', 'Nej. Du er mine. Du skal med.'], 'en skam: min.'),
    ] },
    { id: 'navn', who: 'del', e: '🏷️', item: 'navn', room: 'gang', clue: 'Jeg er dit navn. Jeg ligger ude i gangen. Fluesvampen står på mig.', steps: [
      step('Hvad siger du?', 'Jeg går ud og henter det.', ['Jeg går ude og henter det.', 'Jeg går ud og henter den.'], 'Movement: ud. et navn: det.'),
      step('Fluesvampen: Er det dit? Jeg har passet på det i mange år.', 'Ja, det er mit eget navn.', ['Ja, det er min eget navn.', 'Ja, det er mit egen navn.'], 'et navn: mit eget.'),
    ] },
  ];

  // ---------- 27 · Luftspejlinger (mirage): {shown|right|other}; the first mark lies, the second only if she holds you
  const SPEJL = [
    { text: 'Før var jeg kok {som|på|af} et hotel. Jeg havde alt for {meget|mange|mere} gæster.', why: 'på et hotel. gæster can be counted: mange.' },
    { text: 'Jeg var lærer på en {skolen|skole|skoler}. Jeg var altid {ved|i|til} gang med en ny opgave.', why: 'en skole (no -n after en). i gang med.' },
    { text: 'Jeg arbejdede {til|i|om} en bank. Jeg havde alt for {mange|meget|mere} arbejde.', why: 'i en bank. arbejde cannot be counted: meget.' },
    { text: 'Jeg kunne godt tænke {dig|mig|jeg} at være programmør. Jeg ville arbejde i et {firmaet|firma|firmaer}.', why: 'Jeg kunne godt tænke mig … (mig follows jeg). et firma.' },
    { text: 'Fluesvampen tager {hendes|sin|sine} egen dug. Hun tager aldrig {sin|hans|hendes} dug, for den er Gribbens.', why: 'Her own: sin egen. Gribben’s: hans.' },
    { text: 'Jeg var tjener på en restaurant. Jeg havde alt for {meget|mange|mere} borde. Jeg kunne godt tænke mig at {har|have|haft} min egen.', why: 'borde can be counted: mange. tænke mig at + infinitive: have.' },
    { text: 'Hun er {ved|i|til} gang med en drøm. Hun er ved at {glemmer|glemme|glemt} sit navn.', why: 'i gang med. ved at + infinitive: glemme.' },
    { text: 'Jeg var journalist {om|på|til} en avis. Jeg skrev om alt for {meget|mange|mere} ting.', why: 'på en avis. ting can be counted: mange.' },
  ];

  // ---------- 28 · Stjernerne (build, pre-built wrong): tap the wrong tiles out and rebuild the line
  const star = (ask, en, answers, start, traps, why, end) => ({ ask, en, answers, start, traps, why, end: end || '.' });
  const STJERNER = [
    star('⭐ Tandlægen, tirsdag:', 'Unfortunately I can’t come.', ['Jeg kan desværre ikke komme', 'Desværre kan jeg ikke komme'], ['jeg', 'kan', 'ikke', 'desværre', 'komme'], ['kommer'], 'desværre ikke comes right after the verb (kan).'),
    star('⭐ Din fødselsdag:', 'Can we move my birthday to the third of May?', ['Kan vi flytte min fødselsdag til den tredje maj'], ['kan', 'flytte', 'vi', 'min', 'fødselsdag', 'til', 'den', 'tredje', 'maj'], ['tre'], 'A yes/no question starts with the verb: Kan vi …? Dates: den tredje.', '?'),
    star('⭐ Dansk, torsdag:', 'I can’t come on Thursday at half past nine (9.30).', ['Jeg kan ikke komme på torsdag klokken halv ti', 'På torsdag klokken halv ti kan jeg ikke komme', 'Jeg kan ikke komme klokken halv ti på torsdag', 'Klokken halv ti på torsdag kan jeg ikke komme', 'På torsdag kan jeg ikke komme klokken halv ti', 'Klokken halv ti kan jeg ikke komme på torsdag'], ['på', 'torsdag', 'klokken', 'halv', 'ti', 'jeg', 'kan', 'ikke', 'komme'], ['ni'], 'After a time at the front: the verb, then the subject (kan jeg). halv ti = 9.30.'),
    star('⭐ Dig selv:', 'I think I am ill. (You think it is a fact.)', ['Jeg tror, jeg er syg', 'Jeg er syg, tror jeg'], ['jeg', 'tror', 'er', 'jeg', 'syg'], ['synes'], 'tror = you think it is a fact. After tror: normal order (jeg er).'),
    star('⭐ Gribbens fest, lørdag:', 'I have sent my apologies.', ['Jeg har meldt afbud'], ['jeg', 'meldt', 'har', 'afbud'], ['melder'], 'har + meldt: Jeg har meldt afbud.'),
    star('⭐ Tirsdag:', 'Won’t you cancel Tuesday?', ['Vil du ikke aflyse tirsdag'], ['vil', 'du', 'aflyse', 'ikke', 'tirsdag'], ['aflyser'], 'Vil du ikke + infinitive: ikke before aflyse.', '?'),
    star('⭐ Din krop:', 'I have a fever and a cold.', ['Jeg har feber og er forkølet', 'Jeg er forkølet og har feber'], ['jeg', 'er', 'feber', 'og', 'har', 'forkølet'], ['febre'], 'have feber, være forkølet.'),
    star('⭐ Fluesvampen, i morgen:', 'Can we move it to tomorrow?', ['Kan vi flytte det til i morgen'], ['kan', 'vi', 'det', 'flytte', 'til', 'i', 'morgen'], ['flytter'], 'Kan vi + infinitive + object: flytte det.', '?'),
    star('⭐ Alt:', 'I have cancelled everything.', ['Jeg har aflyst alt', 'Alt har jeg aflyst'], ['jeg', 'aflyst', 'har', 'alt'], ['aflyser'], 'har + aflyst: Jeg har aflyst alt.'),
  ];

  // ---------- 29 · Samtalen II: she still talks about herself as "hun"; your lost pieces grey out replies
  const SAMTALEN2 = [
    { says: (st) => (f(st).holdt ? 'Hun falder fra hinanden, fætter. Det er hendes nedtur nu, ikke din.' : 'Du ryster, fætter. Hun bliver her. Det har hun aldrig gjort før.'),
      en: 'She is falling apart, cousin. It is her comedown now, not yours. / You are shaking, cousin. She is staying. She has never done that before.', replies: [
      r('Jeg holder fast i dig nu.', 1, 'Hun … tak.', 'She … thanks.'),
      r('Jeg synes, du skal trække vejret.', -1, 'Hun trækker vejret. Det hjælper lidt.', 'She breathes. It helps a little.', { needs: 'stemme' }),
      w('Jeg holder fast i du nu.', 'Jeg holder fast i dig nu.', 'Du? Hun er ikke du. Hun er hun.', 'You? She is not you. She is she.', 'After i (a preposition): the object form dig.'),
    ] },
    { says: 'Hvad er det nu, du laver … uden hende?', en: 'What is it you do again … without her?', replies: [
      r('Jeg er i gang med at være mig selv.', -1, 'Det lyder svært. Og godt.', 'That sounds hard. And good.'),
      r('Jeg drømmer om dig. Det er det, jeg laver.', 1, 'Om hende? Ingen har drømt om hende før.', 'About her? Nobody has dreamt about her before.', { needs: 'droemme' }),
      w('Jeg er i gang med være mig selv.', 'Jeg er i gang med at være mig selv.', 'Med … være? Hun forstår det ikke. Men hun nikker.', 'With … be? She does not understand. But she nods.', 'i gang med at + infinitive: do not drop at.'),
    ] },
    { says: 'Er hun en dårlig svamp?', en: 'Is she a bad mushroom?', replies: [
      r('Nej. Du er bare en svamp.', -1, 'Bare en svamp. Det kan hun godt lide.', 'Just a mushroom. She likes that.'),
      r('Ja. Og jeg er også en dårlig svamp.', 1, 'Så er vi to.', 'Then there are two of us.', { needs: 'skam' }),
      w('Nej. Du er bare et svamp.', 'Nej. Du er bare en svamp.', 'Et svamp? Er hun et svamp nu? Det er værre.', 'An et-mushroom? Is she an et-word now? That is worse.', 'svamp is an en-word: en svamp.'),
    ] },
    { says: 'Er det hende, der altid kommer tilbage? Eller dig?', en: 'Is it her who always comes back? Or you?', replies: [
      r('Det er mig, der altid kommer tilbage.', 1, 'Det vidste hun godt.', 'She knew that.'),
      r('Det er os begge to. Det er det, der er problemet.', -1, 'Problemet. Ja. Hun har tænkt det samme.', 'The problem. Yes. She has thought the same.', { needs: 'tanker' }),
      w('Det er mig, der kommer altid tilbage.', 'Det er mig, der altid kommer tilbage.', 'Tilbage? Okay. Hun går et skridt tilbage.', 'Back? Okay. She takes a step back.', 'der altid kommer: the adverb before the verb in a der-clause.'),
    ] },
    { says: 'Skal hun passe på dit navn? Så ved du altid, hvor det er.', en: 'Shall she look after your name? Then you always know where it is.', replies: [
      r('Ja. Pas på det for mig.', 1, 'Det skal hun nok.', 'She will.'),
      r('Nej. Jeg vil have mit eget navn.', -1, 'Dit eget. Selvfølgelig.', 'Your own. Of course.', { needs: 'navn' }),
      w('Ja. Pas på den for mig.', 'Ja. Pas på det for mig.', 'Den? Hun har ingen den. Hun tager det hele.', 'It (den)? She has no den. She takes all of it.', 'et navn: det.'),
    ] },
    { says: (st) => (f(st).spurgte ? 'Du sagde, at hun ikke spurgte. Det er rigtigt. Så nu spørger hun: Vil du ikke blive?' : 'Hun spørger én gang til: Vil du ikke blive?'),
      en: 'You said she did not ask. That is true. So now she asks: Won’t you stay? / She asks once more: Won’t you stay?', replies: [
      r('Jo, det vil jeg gerne.', 1, 'Hun er glad. Hun kan ikke sige det på en anden måde.', 'She is happy. She cannot say it any other way.'),
      r('Nej. Jeg går nu. Men jeg synes, du er sød.', -1, 'Hun … Jeg … er her.', 'She … I … am here.'),
      w('Ja, det vil jeg gerne.', 'Jo, det vil jeg gerne.', 'Ja? Ja til hvad? Hun hørte et nej.', 'Yes? Yes to what? She heard a no.', 'Yes to a negative question (Vil du ikke …?): jo.'),
    ] },
  ];

  // ---------- outcome of part 5 (open)
  K.outcome5 = (st) => (bond(st) >= 2 ? 'Hendes' : bond(st) <= -2 ? 'Fri' : 'Sammen');
  const LOSTLINE = {
    stemme: 'Somewhere out in the sand, your voice is still singing, slightly out of tune.',
    tanker: 'A few of your thoughts are still up in an attic that no longer exists, thinking about nothing.',
    droemme: 'Your dreams stayed in a bedroom in the desert. Some nights you can hear them.',
    minder: 'A box of your memories is still in a basement under the dunes. You do not remember what is in it.',
    appetit: 'Your appetite is still out in a kitchen in the sand, eating very slowly.',
    skam: 'Your shame stayed hiding in a bathroom out there. You feel oddly light, and a little rude.',
    navn: 'Your name is still lying in a hallway in the desert. People call you "du", and that is all.',
  };
  const outcomeLines = (st) => {
    const o = K.outcome5(st), out = [];
    if (o === 'Fri') out.push({ n: 'She pulls her roots out of your holes, one by one. It hurts both of you.' }, { n: 'You are lighter now, and full of empty holes that whistle when the wind blows.' }, L('flue', 'Det lyder smukt.', 'That sounds beautiful.'), { n: 'And she goes. Overhead, a vulture.' }, L('grib', 'Sidste stop?', 'Last stop?'), { n: 'Nobody answers.' });
    else if (o === 'Sammen') out.push({ n: 'Neither of you lets go. By noon you are one creature: a sponge with a red mushroom growing out of the top. Symbiotic, ridiculous, content.' }, { n: 'You never trip alone again. You never sleep alone again. When you speak Danish now, it comes out with her accent.' }, L('flue', 'Vi er to. Vi er én. Det er lidt for meget.', 'We are two. We are one. It is a bit too much.'));
    else out.push({ n: 'You give her your own name to keep. She keeps it carefully, in her cap, where the drop used to be.' }, L('flue', 'Hun passer på det. Det lover hun.', 'She will look after it. She promises.'), { n: 'Nobody calls you anything any more. It is very quiet. The desert sleeps.' });
    lostOf(st).forEach((p) => out.push({ n: LOSTLINE[p] }));
    return out;
  };
  const prevEnd = K.CONFIG.endNote;
  K.CONFIG.endNote = (st) => (st.part === 5 ? K.outcome5(st) : prevEnd ? prevEnd(st) : '');

  // ---------- the flow of part 5
  const P5 = [
    // ===== 25 · Fætter (come-up)
    { screen: 'card', ch: 25, part5: true, title: 'Del 5', sub: 'Fætter', music: 'calm' },
    { screen: 'panel', scene: 'nat', cast: ['svampen', 'flue'], lines: [
      { n: 'The desert has gone very quiet. No wind, no vultures. Even the sand is holding its breath.' },
      { n: 'A knock. There is no door in the desert. The knock comes anyway.' },
      L('flue', 'Hej, fætter. Jeg har været tør i tre uger. Igen.', 'Hi, cousin. I have been dry for three weeks. Again.'),
      { n: 'She is red again, with white dots. On her cap sits a single drop that shines like a small moon.' },
      L('flue', 'Det er den sidste dug. Den har jeg aldrig solgt til nogen.', 'This is the last dew. I have never sold it to anyone.'),
      L('flue', 'Jeg tager den i aften. Ikke dig. Mig.', 'I am taking it tonight. Not you. Me.'),
      { n: 'Before you can say anything, the drop sinks into her cap. It is gone.' },
      { n: 'Then you feel it. In your holes. Since your first night in the camp she has been growing little spores in you. What she takes, you feel.' },
      { th: 'Oh no. Oh. Here it comes.' },
      L('flue', 'Undskyld. Jeg glemte sporerne. … Måske glemte jeg dem ikke helt.', 'Sorry. I forgot about the spores. … Maybe I did not forget them completely.'),
    ] },
    lesson({ who: 'flue', scene: 'nat', title: 'Repetition: at beskrive nogen', say: { da: 'Hvad synes du om mig, fætter? Det er mig, der altid kommer tilbage.', en: 'What do you think of me, cousin? I am the one who always comes back.' },
      rule: 'Describing someone: Du er sød / mærkelig / nervøs / forvirret (one person: no -e). An opinion: Jeg synes (faktisk), du er … (faktisk right after synes). A der-clause: Det er dig, der altid … (the adverb before the verb). sin / sit / sine: the subject’s own; hans / hendes: someone else’s. After a preposition: mig, dig, ham, hende.',
      ex: ['Jeg synes [faktisk], du er sød.', 'Det er dig, der [altid] kommer tilbage.', 'Hun tager [sin] egen dug.', 'Du tog [hans] dug.'],
      try: { q: 'Fluesvampen elsker ___ egen hat.', right: 'sin', wrong: ['hendes', 'sit'], why: 'Her own (the subject, Fluesvampen, owns it): sin. en hat.' } }),
    { screen: 'talk', replay: true, id: 'Samtalen', who: 'flue', title: 'Samtalen', sub: 'Svar hende. Se på hendes ansigt.', exchanges: SAMTALEN },
    { screen: 'choice', scene: 'nat', cast: ['flue'], who: 'svampen', prompt: 'Fluesvampen: Det bliver stort. Må jeg holde fast i dig?', options: [
      { da: 'Ja. Hold fast i mig.', set: { holdt: true } },
      { da: 'Ja. Hold fast i jeg.', set: { holdt: true, misJeg: true } },
      { da: 'Nej. Jeg vil gøre det selv.', set: { holdt: false } },
      { en: '(EN) No. I want to do it myself.', set: { holdt: false }, after: [L('flue', 'Engelsk? Nå. Så gør du det selv.', 'English? Well. Then you do it yourself.')] },
    ] },
    { screen: 'panel', scene: 'nat', cast: ['flue'], lines: [
      (st) => (f(st).misJeg ? { n: '"Hold on to … I?" She holds on to herself first. Then, to be safe, to you as well.' } : []),
      (st) => (f(st).holdt ? [L('flue', 'Jeg holder fast i dig. Jeg skal ingen steder.', 'I am holding on to you. I am not going anywhere.'), { n: 'Her roots tighten in your holes. It is warm. It is a lot.' }]
        : [L('flue', 'Okay. Så går du alene. Jeg er lige bag dig.', 'Okay. Then you go alone. I am right behind you.'), { n: 'She lets go. You feel very large and very loose.' }]),
      { n: 'And then you come apart.' },
    ] },

    // ===== 26 · Indeni (onset)
    { screen: 'card', ch: 26, title: 'Indeni', sub: 'Kapitel 26 · Du er inde i dig selv.', music: 'tense' },
    { screen: 'panel', scene: 'huset', cast: ['oejet'], lines: [
      { n: 'You fall apart into the words you are made of. They drift down softly, like sand, into a house.' },
      { n: 'The house is you. Seven rooms. And an eighth door, locked, with one word on it: ØRKENEN.' },
      { n: 'Above the house hangs an enormous eye.' },
      L('oejet', 'Du er inde i dig selv. Det er ikke så stort, som du troede.', 'You are inside yourself. It is not as big as you thought.'),
      L('oejet', 'Du blinker. Øjet blinker.', 'You blink. The eye blinks.'),
      L('oejet', 'Det er tirsdag. Du er en sten.', 'It is Tuesday. You are a stone.'),
      { th: 'I am fairly sure I am a sponge.' },
      (st) => (f(st).holdt ? L('flue', 'Jeg er her, fætter. Inde i væggene.', 'I am here, cousin. Inside the walls.') : L('flue', 'Fætter? Jeg kan høre dig, men jeg kan ikke se dig.', 'Cousin? I can hear you, but I cannot see you.')),
      { n: 'Your pieces start calling, one at a time, from the rooms. And every time you pick one up, the house moves.' },
    ] },
    lesson({ who: 'oejet', scene: 'huset', title: 'Repetition: rum og ting', say: { da: 'Din stemme ligger inde i stuen. Du går ind og henter den.', en: 'Your voice is in the living room. You go in and fetch it.' },
      rule: 'Place (nothing moves): inde, ude, oppe, nede. Movement: ind, ud, op, ned. i stuen / i køkkenet / i kælderen / i soveværelset / i gangen, but på loftet / på badeværelset. What you fetch: den (en-word), det (et-word), dem (plural). min / mit / mine; egen / eget / egne.',
      ex: ['Min stemme ligger [inde] i stuen.', 'Jeg går [ind] og henter [den].', 'Mine tanker er [oppe] på loftet.', 'Her er mit [eget] navn.'],
      try: { q: 'Mine drømme ligger inde i soveværelset. Jeg går ind og henter ___.', right: 'dem', wrong: ['den', 'det'], why: 'drømme (plural), fetched: dem.' } }),
    { screen: 'board', replay: true, id: 'Indeni', mode: 'map', cols: 3, order: true, lostFlag: true, layouts: LAYOUTS, moved: 'Huset flytter sig. Rummene bytter plads.',
      title: 'Indeni', sub: 'Tryk på rummet, hvor delen ligger. Hvis du svarer forkert, bliver delen i sandet.', tiles: ROOMS, requests: PIECE },
    { screen: 'panel', scene: 'huset', cast: ['flue'], lines: [
      (st) => { const n = lostOf(st).length; return { n: n === 0 ? 'Every piece is back. You are whole again, and slightly rearranged.' : n === 1 ? 'One piece of you stays behind in the sand, muttering.' : `${n} pieces of you stay behind in the sand, muttering.` }; },
      L('flue', 'Nu er du hel igen. Nu kan vi gå hjem.', 'Now you are whole again. Now we can go home.'),
      (st) => (f(st).holdt ? { n: 'She is still holding on. You can feel her roots in every room.' } : []),
      { n: 'You open the front door. Outside, there is no desert you know.' },
    ] },

    // ===== 27 · Luftspejlinger (peak)
    { screen: 'card', ch: 27, title: 'Luftspejlinger', sub: 'Kapitel 27 · Der er intet hjem.', music: 'happy' },
    { screen: 'panel', scene: 'spejl', cast: ['oejet', 'flue'], lines: [
      { n: 'There is no home. Every horizon shimmers, and in every shimmer there is a life you did not live.' },
      { n: 'A sponge in a chef’s hat. A sponge at a blackboard. A sponge in a tiny office, typing very fast.' },
      L('oejet', 'Det er ikke dig. Det er heller ikke ikke dig.', 'It is not you. It is not not you either.'),
      { n: 'Fluesvampen walks in every mirage, always a little behind you. Then she starts talking about herself as if she were somebody else.' },
      L('flue', 'Hun er træt. Hun har sin dug. Hun går lige bag dig.', 'She is tired. She has her dew. She is walking right behind you.'),
      { th: 'Who is "she"?' },
      L('flue', 'Hun er ikke mig. Hun er bare her.', 'She is not me. She is just here.'),
    ] },
    lesson({ who: 'flue', scene: 'spejl', title: 'Repetition: job og liv', say: { da: 'Hvad er det nu, du laver? Hun er i gang med en drøm. Hun kunne godt tænke sig at være kok.', en: 'What is it you do again? She is busy with a dream. She would like to be a cook.' },
      rule: 'Workplaces: i et firma / i en bank, but på et hotel / på en skole / på en avis / på en restaurant. Busy: i gang med + a noun; i gang med at / ved at + infinitive. A wish: Jeg kunne godt tænke mig at … (mig follows jeg, sig follows han / hun). mange + what you can count (gæster), meget + what you cannot (arbejde).',
      ex: ['Jeg var kok [på] et hotel.', 'Jeg arbejdede [i] en bank.', 'Hun er [i] gang med en drøm.', 'Jeg kunne godt tænke [mig] at være lærer.'],
      try: { q: 'Jeg arbejdede ___ et hospital.', right: 'på', wrong: ['i', 'som'], why: 'på et hospital.' } }),
    { screen: 'mirage', replay: true, id: 'Luftspejlinger', doubleFlag: 'holdt', title: 'Luftspejlinger', sub: 'Ét ord lyver. Tryk på det, og find det rigtige.', rounds: SPEJL },
    { screen: 'panel', scene: 'spejl', cast: ['oejet'], lines: [
      (st) => { const t = sc(st, 'Luftspejlinger'); return { n: t.n && t.ok / t.n >= 0.7 ? 'The mirages lie down, one by one, like tired dogs.' : 'Some mirages keep shimmering behind you. One of them is still a cook.' }; },
      L('oejet', 'Bag spejlingerne er der ingenting. Bare rolig.', 'Behind the mirages there is nothing. Relax.'),
      { n: 'The eye is wrong. Behind the mirages there is everything.' },
      { n: 'The locked eighth door, the one called ØRKENEN, is standing in the middle of the sand in front of you. It is open a crack. On the other side: stars.' },
    ] },

    // ===== 28 · Stjernerne (ego death)
    { screen: 'card', ch: 28, title: 'Stjernerne', sub: 'Kapitel 28 · Klokken er halv ingenting.', music: 'calm' },
    { screen: 'panel', scene: 'kosmos', cast: ['oejet', 'flue'], lines: [
      { n: 'You step through. The locked room was the outside of you. Out here is everything, and it is full of appointments.' },
      { n: 'Every appointment of your life floats past as a small star: birthdays, the dentist, Tuesday, Danish on Thursday at half past nine.' },
      L('oejet', 'Klokken er halv ingenting.', 'It is half to nothing.'),
      { n: 'To let go, you have to cancel them. All of them. But the trip writes first: each star arrives with its sentence already written, in wrong Danish.' },
      (st) => (f(st).holdt ? L('flue', 'Hun er meget lille herude. Hun holder fast.', 'She is very small out here. She is holding on.') : L('flue', 'Hun er meget lille herude. Hvor er du?', 'She is very small out here. Where are you?')),
    ] },
    lesson({ who: 'oejet', scene: 'kosmos', title: 'Repetition: afbud og tid', say: { da: 'Jeg kan desværre ikke komme. Kan vi flytte det til fredag? Klokken halv ti.', en: "Unfortunately I can't come. Can we move it to Friday? At half past nine." },
      rule: 'Calling in sick: Jeg kan desværre ikke komme. Jeg er syg / har feber. Cancel or move: aflyse, flytte, melde afbud. After kan / vil / skal: the infinitive (komme, flytte); desværre ikke right after the verb. Dates: den + ordinal (den tredje maj). halv ti = 9.30. tror = you think it is a fact; synes = your opinion.',
      ex: ['Jeg kan [desværre ikke] komme.', 'Kan vi [flytte] det?', 'den [tredje] maj', 'Jeg [tror], jeg er syg.'],
      try: { q: 'Jeg kan ikke ___ i dag.', right: 'komme', wrong: ['kommer', 'kom'], why: 'After kan: the infinitive (komme).' } }),
    { screen: 'komplimenter', replay: true, id: 'Stjernerne', actor: 'oejet', ask: 'Ret sætningen.', askEn: 'Fix the sentence.', sayBtn: 'Sluk stjernen', n: 9, title: 'Stjernerne', sub: 'Sætningen er skrevet forkert. Tryk ordene ud, og byg den rigtigt.', rounds: STJERNER },
    { screen: 'panel', scene: 'kosmos', cast: ['oejet'], lines: [
      { n: 'The last star burns out. Only the eye is left. You blink. It blinks. It has always blinked when you blink.' },
      L('oejet', 'Jeg er dit eget øje. Du har set på dig selv udefra hele natten.', 'I am your own eye. You have been looking at yourself from outside all night.'),
      { n: 'To come down, you have to go back in. You close your eye. Behind you, the door called ØRKENEN closes from the other side.' },
    ] },

    // ===== 29 · Nedturen (comedown): straight into the conversation
    { screen: 'card', ch: 29, title: 'Nedturen', sub: 'Kapitel 29 · Daggry', music: 'calm' },
    { screen: 'talk', replay: true, id: 'Samtalen II', who: 'flue', title: 'Samtalen II', sub: 'Daggry. Det, du har mistet, kan du ikke sige.', exchanges: SAMTALEN2 },
    { screen: 'panel', scene: 'daggry', cast: ['flue', 'svampen'], music: 'happy', lines: [(st) => outcomeLines(st)] },
    { screen: 'card', title: 'Fortsættes …', sub: 'Del 6 kommer', ms: 1600 },
    { screen: 'act', do: 'ranks' },
    { screen: 'end' },
  ];
  K.FLOW.push(...P5);

  const NEW = {
    fætter: 'cousin', tør: 'dry', uger: 'weeks', igen: 'again', sidste: 'last', dug: 'dew', aldrig: 'never', solgt: 'sold', nogen: 'anyone, someone', aften: 'evening (i aften = tonight)', ikke: 'not',
    undskyld: 'sorry', glemte: 'forgot', sporerne: 'the spores', måske: 'maybe', helt: 'completely', mærke: 'feel', inde: 'in, inside (place)', lige: 'just, right', sjovt: 'fun (-t form)', heller: 'either (heller ikke = not … either)', endnu: 'yet',
    altid: 'always', sødeste: 'sweetest', sagt: 'said', sur: 'angry, grumpy', spurgte: 'asked', om: 'whether / about', ville: 'wanted (to), would', gør: 'do(es)', bare: 'just', lidt: 'a little', forvirret: 'confused', forvirrede: 'confused (plural / -e form)', begyndelsen: 'the beginning', flere: 'more, several', alle: 'all (alle sammen = everybody)', sammen: 'together',
    synes: 'think (opinion)', faktisk: 'actually', sød: 'sweet', rød: 'red', farve: 'colour', før: 'before', tilbage: 'back', omvendt: 'the other way round', kommer: 'come(s)', vidste: 'knew', hvorhen: 'where to', skal: 'shall, must', hvis: 'whose / if', tog: 'took', egen: 'own', gribbens: "the vulture's", hans: 'his', sig: 'say! / oneself', orden: 'order (i orden = fine)', alt: 'everything', nå: 'well',
    hvordan: 'how', ser: 'look(s), see(s) (se … ud = look)', stor: 'big', nervøs: 'nervous', nervøst: 'nervous (-t form; wrong for a person)', lille: 'small', et: 'a (et-word)', ord: 'word', fedt: 'cool', kan: 'can (kan lide = like)', lide: 'like (kan lide)', læse: 'read', svær: 'hard, difficult', tiden: 'the time (hele tiden = all the time)', kigger: 'look(s)', mærkelig: 'strange', skriver: 'write(s)', hat: 'cap, hat', selv: 'self, yourself', nyt: 'new (et-word form)', ny: 'new',
    bliver: 'become(s), stay(s)', holde: 'hold', fast: 'firm (holde fast i = hold on to)', hold: 'hold!', gøre: 'do', holder: 'hold(s)', ingen: 'no, none', steder: 'places (ingen steder = nowhere)', alene: 'alone', bag: 'behind', engelsk: 'English',
    indeni: 'inside', blinker: 'blink(s)', øjet: 'the eye', tirsdag: 'Tuesday', sten: 'stone', troede: 'thought, believed', væggene: 'the walls', høre: 'hear', stemme: 'voice', stemmen: 'the voice', tanker: 'thoughts', tankerne: 'the thoughts', drømme: 'dreams / dream', drømmene: 'the dreams', drømmer: 'dream(s)', os: 'us', minder: 'memories', minderne: 'the memories', huske: 'remember', appetit: 'appetite', appetitten: 'the appetite', sulten: 'hungry', skam: 'shame', skammen: 'the shame', gemmer: 'hide(s)', hellere: 'rather', glemme: 'forget', navn: 'name', passet: 'looked after (har passet på)', år: 'year(s)', mange: 'many', står: 'stand(s)', mig: 'me', huset: 'the house', flytter: 'move(s)', rummene: 'the rooms', bytter: 'swap(s)', plads: 'place', rummet: 'the room', delen: 'the piece', sandet: 'the sand', forkert: 'wrong', hel: 'whole', hjem: 'home', ørkenen: 'the desert',
    luftspejlinger: 'mirages', spejlingerne: 'the mirages', intet: 'no, nothing', træt: 'tired', hun: 'she', hende: 'her', hendes: 'her (someone else’s)', sin: 'his/her own', sine: 'his/her own (plural)', sit: 'his/her own (et-word)', kok: 'cook', som: 'as, like', af: 'of, off', hotel: 'hotel', gæster: 'guests', meget: 'much, very', mere: 'more', lærer: 'teacher', skole: 'school', skolen: 'the school', skoler: 'schools', gang: 'way (i gang med = busy with) / hallway', opgave: 'task', arbejdede: 'worked', bank: 'bank', arbejde: 'work', tænke: 'think (kunne godt tænke sig = would like)', programmør: 'programmer', firma: 'firm, company', firmaet: 'the firm', firmaer: 'firms', tager: 'take(s)', tjener: 'waiter', restaurant: 'restaurant', borde: 'tables', have: 'have (infinitive)', har: 'have, has', haft: 'had', drøm: 'dream', glemmer: 'forget(s)', glemt: 'forgotten', journalist: 'journalist', avis: 'newspaper', skrev: 'wrote', ting: 'thing(s)', liv: 'life', hospital: 'hospital', ét: 'one (stressed)', lyver: 'lie(s)', tryk: 'tap!, press!', find: 'find!', rigtige: 'right (-e form)', ved: 'at, by (ved at = in the middle of)', til: 'to', kunne: 'could',
    stjernerne: 'the stars', klokken: 'the clock (klokken halv ti = at 9.30)', halv: 'half (halv ti = 9.30)', ingenting: 'nothing', desværre: 'unfortunately', komme: 'come', flytte: 'move', fredag: 'Friday', tredje: 'third', maj: 'May', tror: 'think, believe (fact)', syg: 'ill', kom: 'came / come!', dag: 'day (i dag = today)', ret: 'correct!, fix!', sætningen: 'the sentence', sluk: 'put out!, switch off!', stjernen: 'the star', skrevet: 'written', ordene: 'the words', ud: 'out (movement)', byg: 'build!', rigtigt: 'correctly', tandlægen: 'the dentist', fødselsdag: 'birthday', vi: 'we', min: 'my', den: 'the / it (en-word)', torsdag: 'Thursday', ti: 'ten', ni: 'nine', på: 'on, at', tre: 'three', fest: 'party', lørdag: 'Saturday', meldt: 'sent (meldt afbud)', afbud: 'apologies (melde afbud)', melder: 'send(s) (melde afbud)', vil: 'will, want(s)', aflyse: 'cancel', aflyser: 'cancel(s)', aflyst: 'cancelled', krop: 'body', feber: 'fever', febre: '(plural of feber; wrong here)', forkølet: 'having a cold', morgen: 'morning (i morgen = tomorrow)', hele: 'whole (det hele = all of it)', dit: 'your (et-word)', eget: 'own (et-word)', egne: 'own (plural)', udefra: 'from outside', natten: 'the night', set: 'seen',
    nedturen: 'the comedown', nedtur: 'comedown', daggry: 'dawn', falder: 'fall(s)', hinanden: 'each other (fra hinanden = apart)', ryster: 'shake(s)', gjort: 'done', trække: 'pull, draw (trække vejret = breathe)', vejret: 'the breath (trække vejret = breathe)', trækker: 'pull(s) (trækker vejret = breathes)', hjælper: 'help(s)', uden: 'without', svært: 'hard (-t form)', godt: 'good, well', drømt: 'dreamt', forstår: 'understand(s)', nikker: 'nod(s)', være: 'be', dårlig: 'bad', svamp: 'sponge, mushroom', værre: 'worse', begge: 'both', problemet: 'the problem', tænkt: 'thought (har tænkt)', samme: 'same', okay: 'okay', skridt: 'step', passe: 'look after (passe på)', pas: 'look after! (pas på)', selvfølgelig: 'of course', nok: 'surely (skal nok = will, promise)', spørger: 'ask(s)', én: 'one (stressed)', blive: 'stay', jo: 'yes (to a negative question)', glad: 'happy', anden: 'other', måde: 'way', går: 'go(es), walk(s)', hørte: 'heard', mistet: 'lost', smukt: 'beautiful (-t form)', stop: 'stop', lover: 'promise(s)', ansigt: 'face', svar: 'answer!', at: 'to / that', ingens: "nobody's", gerne: 'gladly (vil gerne = would like to)', rykker: 'move(s) (rykke tættere på = move closer)', tættere: 'closer', åh: 'oh', hm: 'hm', gå: 'go, walk', 'et-ord': 'et-word', rolig: 'calm (bare rolig = relax)', herude: 'out here', øje: 'eye', eller: 'or', lyder: 'sound(s)', elsker: 'love(s)',
  };
  Object.entries(NEW).forEach(([k, v]) => { if (v && !(k in K.DICT)) K.DICT[k] = v; });
})(window.K = window.K || {});
