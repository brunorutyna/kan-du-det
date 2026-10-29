// node tools/lint.js — static checks. Exit 1 on errors.
const fs = require('fs'), path = require('path');
const K = require('./load')();
const ROOT = path.join(__dirname, '..');
const err = [], warn = [];
// 1. every Danish word has a gloss
const texts = new Set();
try { JSON.parse(fs.readFileSync(path.join(__dirname, 'lines.json'))).forEach((l) => texts.add(l.text)); } catch (e) { err.push('run tools/speech.js first'); }
K.STORY.forEach((s) => { if (s.t === 'choice') (typeof s.options === 'function' ? [] : s.options).forEach((o) => o.da && texts.add(o.da)); });
Object.values(K.G).forEach((g) => g.phrases && g.phrases().forEach(([d, a, n]) => K.allForms(d, a, n).forEach((f) => texts.add(f))));
['min', 'def', 'indef'].forEach((d) => Object.keys(K.N).forEach((n) => ['groen', 'gammel', 'lille', 'prikket'].forEach((a) => texts.add(K.np(d, [a], n)))));
['Din, dit eller dine?', 'En ting i dit hjem:', 'Hvilken farve?', 'Bag tæppet:', 'Min, mit, mine', 'Med den rigtige endelse:', 'Holger svarer:', 'Mærket siger:', 'Det er rigtigt.', 'Mærket:', 'Der er kun én.', 'Der er hundredvis af dem.'].forEach((t) => texts.add(t));
const missing = new Map();
texts.forEach((t) => (t.match(/[A-Za-zÆØÅæøåÉé'-]+/g) || []).forEach((w) => { if (!K.glossOf(w)) missing.set(w.toLowerCase(), t); }));
missing.forEach((t, w) => err.push(`no gloss: "${w}"  (in: ${t})`));
// 2. story references
K.STORY.forEach((s, i) => {
  if (s.t === 'game' && !K.G[s.id]) err.push(`step ${i}: unknown game ${s.id}`);
  const img = s.img || (s.panel && s.panel.img);
  if (img && !fs.existsSync(path.join(ROOT, 'img', img + '.webp'))) warn.push(`step ${i}: missing img/${img}.webp`);
  if (s.music && !K.audio.TRACKS.includes(s.music)) err.push(`step ${i}: unknown music ${s.music}`);
});
Object.values(K.ENDINGS).forEach((e) => { if (!fs.existsSync(path.join(ROOT, 'img', e.img + '.webp'))) warn.push('missing ending img ' + e.img); });
['donor1', 'donor2', 'donor3', 'lilla', 'ellen_sat', 'holger', 'auction', 'gun', 'manden', 'impostor', 'seller', 'flat', 'crate', 'title'].forEach((k) => { if (!fs.existsSync(path.join(ROOT, 'img', k + '.webp'))) warn.push('missing img/' + k + '.webp'); });
Object.values(K.N).forEach((n) => { if (n.art && !fs.existsSync(path.join(ROOT, 'img', 'o', n.art + '.webp'))) warn.push('missing object card ' + n.art); });
// 3. Stirren igen: every Saturday reaction has ≥1 producing and ≥2 non-producing Ellen lines
K.stirrenTable().forEach((r) => { if (r.yes < 1 || r.no < 2) err.push(`stirren table: ${r.item} "${r.said}" yes=${r.yes} no=${r.no}`); });
// 4. phrase builder sanity
Object.keys(K.N).forEach((n) => Object.keys(K.A).forEach((a) => ['indef', 'def', 'min'].forEach((d) => { const p = K.np(d, [a], n); if (/undefined|NaN/.test(p)) err.push('bad phrase ' + p); })));
// known forms (a few must-be-right checks)
const must = { 'et grønt tørklæde': K.np('indef', ['groen'], 'toerklaede'), 'det grønne tørklæde': K.np('def', ['groen'], 'toerklaede'), 'de blå bukser': K.np('def', ['blaa'], 'bukser'),
  'et blåt slips': K.np('indef', ['blaa'], 'slips'), 'den lille seng': K.np('def', ['lille'], 'seng'), 'de små stole': K.np('def', ['lille'], 'stole'), 'et gammelt bord': K.np('indef', ['gammel'], 'bord'),
  'den gamle kommode': K.np('def', ['gammel'], 'kommode'), 'et lækkert jakkesæt': K.np('indef', ['laekker'], 'jakkesaet'), 'de lækre puder': K.np('def', ['laekker'], 'puder'), 'mine prikkede puder': K.np('min', ['prikket'], 'puder'),
  'et sort slips': K.np('indef', ['sort'], 'slips'), 'et flot skab': K.np('indef', ['flot'], 'skab'), 'nogle lilla sokker': K.np('indef', ['lilla'], 'sokker'), 'mit orange gardin': K.np('min', ['orange'], 'gardin') };
Object.entries(must).forEach(([want, got]) => { if (want !== got) err.push(`grammar: want "${want}" got "${got}"`); });
// wrong options must never equal the right answer
Object.keys(K.N).forEach((n) => ['groen', 'flot', 'lille', 'blaa'].forEach((a) => ['indef', 'def'].forEach((d) => { const r = K.np(d, [a], n); K.wrongForms(d, a, n, 5).forEach((w) => { if (w === r) err.push('wrong option equals right ' + w); }); })));
// 5. version stamp
const v = fs.readFileSync(path.join(ROOT, 'version.txt'), 'utf8').trim();
if (!/^\d{14}$/.test(v)) err.push('version.txt must be a 14-digit stamp');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
if (!html.includes(`VERSION: '${v}'`)) err.push('index.html VERSION does not match version.txt (run tools/bump.sh)');
// 6. no real people
const block = fs.existsSync(path.join(__dirname, 'blocklist.txt')) ? fs.readFileSync(path.join(__dirname, 'blocklist.txt'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean) : [];
const src = ['story.js', 'games1.js', 'games2.js'].map((f) => fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')).join('\n');
block.forEach((b) => { if (src.includes(b)) err.push('blocklisted name: ' + b); });
warn.forEach((w) => console.log('warn:', w)); err.forEach((e) => console.log('ERROR:', e));
console.log(`${err.length} errors, ${warn.length} warnings`);
process.exit(err.length ? 1 : 0);
