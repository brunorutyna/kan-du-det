// node tools/lint.js: static checks on the game's data. Exit 1 on any error.
// Add game-specific checks at the bottom (and to the mini-game's own lint()).
const fs = require('fs'), path = require('path');
const K = require('./load')();
const ROOT = path.join(__dirname, '..');
const err = [], warn = [];
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

// 1. flow: every step's screen exists; mini-games pass their own lint; collect Danish texts
const texts = new Map(); // text -> where
const add = (t, where) => { if (typeof t === 'string' && t.trim()) texts.set(t, where); };
const lineTexts = (lines, where, st) => (lines || []).forEach((l) => {
  const ls = [].concat(typeof l === 'function' ? l(st) : l).filter(Boolean);
  ls.forEach((x) => { if (x.da) add(x.da, where); if (x.w && !(K.CAST || {})[x.w]) err.push(`${where}: unknown speaker "${x.w}"`); });
});
const sample = K.newRun();
if (!K.CONFIG || !K.CONFIG.id) err.push('K.CONFIG.id missing (save key)');
if (!Array.isArray(K.FLOW) || !K.FLOW.length) err.push('K.FLOW is empty');
(K.FLOW || []).forEach((step, i) => {
  const where = `FLOW[${i}] ${step.screen}`;
  if (!K.SCREENS[step.screen]) { err.push(`${where}: unknown screen`); return; }
  if (step.scene && !(K.SCENES || {})[step.scene]) err.push(`${where}: unknown scene "${step.scene}"`);
  (step.cast || []).forEach((c) => { if (!(K.CAST || {})[c]) err.push(`${where}: unknown cast "${c}"`); });
  lineTexts(step.lines, where, sample);
  if (step.screen === 'choice') {
    const opts = typeof step.options === 'function' ? step.options(sample) : step.options;
    if (!opts || !opts.length) err.push(`${where}: no options`);
    (opts || []).forEach((o) => { add(o.da, where); lineTexts(o.after, where, sample); });
    if (!(opts || []).some((o) => o.en && !o.da)) warn.push(`${where}: no English option (English should always be possible, at a cost)`);
  }
  const g = K.GAMES[step.screen];
  if (g) {
    try { (g.lint ? g.lint(step) : []).forEach((e) => err.push(`${where}: ${e}`)); } catch (e) { err.push(`${where}: lint crashed: ${e.message}`); }
    try { (g.texts ? g.texts(step) : []).forEach((t) => add(t, where)); } catch (e) { err.push(`${where}: texts crashed: ${e.message}`); }
  }
  if (step.music !== undefined && step.music !== null && typeof step.music !== 'string') err.push(`${where}: music must be a mood name or null`);
});

// 1b. TØRLAGT: lessons, branch lines with every flag combination, endings
(K.FLOW || []).forEach((step, i) => {
  if (step.screen === 'lesson') {
    const where = `FLOW[${i}] lesson`;
    if (!(K.CAST || {})[step.who]) err.push(`${where}: unknown teacher ${step.who}`);
    add(step.say.da, where); step.ex.forEach((x) => add(x.replace(/[[\]]/g, ''), where));
    add(step.try.q, where); add(step.try.right, where);
    if (step.try.wrong.includes(step.try.right)) err.push(`${where}: try has the right answer among the wrong`);
  }
});
// every flag any choice can set, in every combination (capped), each with low and high mini-game scores
const flagNames = new Set();
(K.FLOW || []).forEach((step) => { if (step.screen !== 'choice') return; const o = typeof step.options === 'function' ? [].concat(step.options(Object.assign(K.newRun(), { tally: {} })), step.options(Object.assign(K.newRun(), { tally: new Proxy({}, { get: () => ({ ok: 99, n: 99 }) }) }))) : step.options; o.forEach((x) => Object.keys(x.set || {}).forEach((k) => flagNames.add(k))); });
const names = [...flagNames].slice(0, 12);
const combos = [];
for (let m = 0; m < (1 << names.length); m += Math.max(1, (1 << names.length) >> 9)) { const f = {}; names.forEach((k, i) => { f[k] = !!(m & (1 << i)); }); combos.push(f); }
const tallies = [{}, new Proxy({}, { get: () => ({ ok: 99, n: 99 }) })];
combos.forEach((f) => tallies.forEach((tl) => {
  const st = Object.assign(K.newRun(), { flags: f, tally: tl });
  (K.FLOW || []).forEach((step, i) => (step.lines || []).forEach((l) => { const ls = [].concat(typeof l === 'function' ? l(st) : l).flat(); ls.forEach((x) => { if (!x) return; if (x.da) add(x.da, `FLOW[${i}] (flags)`); if (x.w && !(K.CAST || {})[x.w]) err.push(`FLOW[${i}]: unknown speaker ${x.w}`); }); }));
  if (K.epilogue) K.epilogue(st).forEach((x) => { if (x.da) add(x.da, 'epilogue'); });
  (K.FLOW || []).forEach((step, i) => { if (step.screen === 'choice' && typeof step.options === 'function') step.options(st).forEach((o) => { if (o.da) add(o.da, `FLOW[${i}] choice`); (o.after || []).forEach((x) => { if (x.da) add(x.da, `FLOW[${i}] after`); }); }); if (step.screen === 'choice' && step.prompt) add(step.prompt, `FLOW[${i}] prompt`); });
}));
Object.entries(K.CAST || {}).forEach(([id, c]) => { if (!c.e) err.push(`cast ${id}: no creature emoji (no humans allowed)`); });
// blocklist of religious words (whole words only), and no countdown wording
const RELIGION = ['gud', 'guder', 'djævel', 'djævelen', 'satan', 'lucifer', 'fristeren', 'fristelse', 'kirke', 'engel', 'engle', 'bøn', 'tilbede', 'himmel', 'helvede', 'synd', 'profet', 'jesus', 'faste', 'dæmon', 'tempel', 'præst', 'kors', 'frelse', 'jul', 'julen', 'påske', 'påsken', 'devil', 'angel', 'heaven', 'hell', 'pray', 'prayer', 'church', 'temptation', 'tempter', 'forty', 'fyrre', 'sekunder', 'nedtælling', 'københavn', 'aarhus', 'århus', 'odense', 'aalborg', 'ærø', 'esbjerg', 'roskilde', 'danmark', 'denmark', 'copenhagen', 'menneske', 'mennesker', 'human', 'humans'];
K.__files.forEach((f) => {
  const txt = fs.readFileSync(path.join(ROOT, f), 'utf8').toLowerCase();
  const words = new Set(txt.match(/[a-zæøå]+/g) || []);
  RELIGION.forEach((r) => { if (words.has(r)) err.push(`${f}: blocked word "${r}" (no religion, no timer)`); });
});

// 2. every Danish word has a gloss
const missing = new Map();
texts.forEach((where, t) => (t.match(/[A-Za-zÆØÅæøåÉé'-]+/g) || []).forEach((w) => { if (!K.glossOf(w)) missing.set(w.toLowerCase(), `${where}: "${t}"`); }));
missing.forEach((where, w) => err.push(`no gloss for "${w}" (${where})`));

// 3. no "undefined" in generated text
texts.forEach((where, t) => { if (/undefined|NaN|\[object/.test(t)) err.push(`${where}: bad text "${t}"`); });

// 4. version stamp
const v = read('version.txt').trim();
const html = read('index.html');
if (!/^\d{14}$/.test(v)) err.push('version.txt must be a 14-digit stamp (run tools/bump.sh)');
if (!html.includes(`VERSION: '${v}'`)) err.push('index.html VERSION does not match version.txt (run tools/bump.sh)');
[...html.matchAll(/\?v=(\d+)/g)].forEach((m) => { if (m[1] !== v) err.push(`index.html has a stale ?v=${m[1]}`); });

// 5. source checks: real people, double class attributes, \b near Danish letters, direct timers in games
const src = K.__files.map((f) => [f, read(f)]);
const block = fs.existsSync(path.join(__dirname, 'blocklist.txt')) ? read('tools/blocklist.txt').split('\n').map((s) => s.trim()).filter(Boolean) : [];
src.forEach(([f, s]) => {
  block.forEach((b) => { if (s.includes(b)) err.push(`${f}: blocklisted real name "${b}"`); });
  if (/class="[^"]*"[^<>]*class="/.test(s)) err.push(`${f}: an element with two class attributes`);
  if (/\\b/.test(s) && /[æøåÆØÅ]/.test(s) && !/core\.js$/.test(f)) warn.push(`${f}: uses \\b in a regex; JavaScript \\b does not treat æ/ø/å as letters. Test with æøå samples.`);
  if (/games\//.test(f) && /\b(setTimeout|setInterval|requestAnimationFrame|addEventListener)\(/.test(s)) err.push(`${f}: use s.timer / s.every / s.loop / s.on (they die with the screen), not raw timers or listeners`);
  if (/games\//.test(f) && /getElementById|querySelector\(['"]#/.test(s)) err.push(`${f}: look elements up inside your own root, never by global id`);
  if (/games\//.test(f) && !/s\.bot\s*=/.test(s)) err.push(`${f}: mini-game must set s.bot for the playtest`);
});

warn.forEach((w) => console.log('warn:', w));
err.forEach((e) => console.log('ERROR:', e));
console.log(`lint: ${err.length} errors, ${warn.length} warnings, ${texts.size} Danish texts checked`);
process.exit(err.length ? 1 : 0);
