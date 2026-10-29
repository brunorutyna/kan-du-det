// List every voiced line: node tools/speech.js  → tools/lines.json ; --check fails if a clip is missing.
const fs = require('fs'), path = require('path');
const K = require('./load')();
const out = new Map();
const add = (w, da) => { if (!w || !da || w === 'cap') return; da = da.trim(); const id = K.audio.clipId(w, da); if (!out.has(id)) out.set(id, { id, who: w, voice: K.VOICE_OF[w], text: da }); };
const addLine = (l) => { if (l && l.w && l.da) add(l.w, l.da); };
// sample states for lines that depend on the run
const states = [];
for (const scarf of ['groen', 'roed', 'generic', 'sock']) for (const jacket of ['gen', 'min', 'generic', 'sock']) for (const gunMine of [true, false]) for (const namedBack of [true, false]) {
  const st = K.newRun(); Object.assign(st, { scarf, jacket, gunMine, namedBack, scarfViaGun: scarf === 'roed', follower: 'stol' });
  st.mistakes = [{ day: 'holger' }]; st.tags = [{ text: 'en grønt sofa', ok: false }, { text: 'et rød bord', ok: false }];
  states.push(st);
}
K.sock = () => {}; K.mistake = () => {};
const lineVariants = (l) => { if (typeof l === 'function') return states.map((s) => l(s)).flat(); return [l]; };
K.STORY.forEach((s) => {
  (s.lines || []).forEach((l) => lineVariants(l).forEach(addLine));
  if (s.panel) (s.panel.lines || []).forEach((l) => lineVariants(l).forEach(addLine));
  if (s.t === 'choice') { const opts = typeof s.options === 'function' ? s.options(states[0]) : s.options; opts.forEach((o) => { if (o.da && s.who) add(s.who, o.da); (o.after || []).forEach(addLine); }); }
});
for (const e of Object.keys(K.ENDINGS)) states.forEach((st) => { st.ending = e; K.endingPanels(st).lines.forEach((l) => lineVariants(l).forEach(addLine)); });
Object.values(K.G).forEach((g) => (g.lines ? g.lines() : []).forEach(addLine));
// Holger's fingerprint: every form he could have said, in three mouths
const P = [];
Object.values(K.G).forEach((g) => { if (g.phrases) g.phrases().forEach((p) => P.push(p)); });
K.G.containerne.phrases().forEach(([d, a, n]) => P.push([d === 'def' ? 'indef' : 'def', a, n]));
P.push(['min', 'gul', 'jakke'], ['def', 'groen', 'toerklaede']);
const seen = new Set();
P.forEach(([d, a, n]) => {
  const key = d + a + n; if (seen.has(key)) return; seen.add(key);
  const forms = K.allForms(d, a, n), right = K.np(d, [a], n);
  forms.forEach((f) => { add('manden', K.cap(f) + '.'); add('seller', K.cap(f) + '.'); });
  add('impostor', K.cap(right) + '.');
});
const list = [...out.values()];
const dest = path.join(__dirname, 'lines.json');
fs.writeFileSync(dest, JSON.stringify(list, null, 1));
const byWho = {}; list.forEach((l) => (byWho[l.who] = (byWho[l.who] || 0) + 1));
console.log(list.length, 'lines', JSON.stringify(byWho));
if (process.argv.includes('--check')) {
  const missing = list.filter((l) => !fs.existsSync(path.join(__dirname, '..', 'audio', 'v', l.id + '.mp3')));
  if (missing.length) { console.log('MISSING', missing.length, missing.slice(0, 10)); process.exit(1); }
  console.log('all clips present');
}
