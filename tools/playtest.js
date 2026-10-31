// node tools/playtest.js [--runs N] [--real] [--shots dir] [--mode right|wrong]
// Plays the game title → end on a 393×851 touch screen with real taps, using each screen's s.bot.
// Odd runs answer right, even runs make many mistakes (and use English). Fails on: JS errors or the error box,
// a stuck screen, "undefined"/"NaN"/"[object Object]" on screen, images that fail, a mini-game that does not
// cover the screen, buttons smaller than 44 px. --real plays at real speed (no ?fast) and reports the time.
// --shots saves one screenshot per screen and a single contact sheet (contact.png) to look at once.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const PART2 = !!opt('--part2', false), RUNS = +opt('--runs', 2), REAL = !!opt('--real', false), SHOTS = opt('--shots', null), MODE = opt('--mode', null);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.txt': 'text/plain', '.json': 'application/json' };
const serve = () => new Promise((res) => {
  const srv = http.createServer((req, rsp) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
    fs.readFile(p, (e, d) => { if (e) { rsp.writeHead(404); rsp.end(); return; } rsp.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); rsp.end(d); });
  }).listen(0, () => res(srv));
});

(async () => {
  const srv = await serve(); const port = srv.address().port;
  const browser = await chromium.launch();
  const shots = [];
  let failed = 0;
  for (let run = 1; run <= RUNS; run++) {
    const mode = MODE || (run % 2 ? 'right' : 'wrong');
    const page = await browser.newPage({ viewport: { width: 393, height: 851 }, hasTouch: true });
    const problems = [], small = new Set();
    // a fake Danish voice that speaks for a realistic time and reports any line cut mid-word
    await page.addInitScript(() => {
      const v = { lang: 'da-DK', name: 'fake-da', default: true };
      let cur = null; const q = []; window.__voiceCuts = []; window.__voiceLines = 0;
      const next = () => { cur = q.shift() || null; if (!cur) return; window.__voiceLines++; cur.t0 = Date.now(); cur.h = setTimeout(() => { const u = cur; cur = null; if (u.onend) u.onend(); next(); }, 300 + u0len(cur) * 55); };
      const u0len = (u) => String(u.text).length;
      window.SpeechSynthesisUtterance = function (text) { this.text = text; };
      const fake = {
        getVoices: () => [v], speaking: false,
        speak(u) { q.push(u); if (!cur) next(); },
        cancel() {
          const replay = window.__voiceReplay && Date.now() - window.__voiceReplay < 50;
          if (cur && !replay && Date.now() - cur.t0 > 30) window.__voiceCuts.push(String(cur.text).slice(0, 50));
          if (cur) clearTimeout(cur.h); cur = null; q.length = 0;
        },
        onvoiceschanged: null,
      };
      Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
    });
    page.on('pageerror', (e) => problems.push('page error: ' + e));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problems.push('console: ' + m.text().slice(0, 300)); });
    page.on('response', (r) => { if (r.status() >= 400 && !/version\.txt/.test(r.url())) problems.push('missing file: ' + r.url().replace(/^.*?\/\/[^/]+/, '')); });
    await page.goto(`http://localhost:${port}/?debug${REAL ? '' : '&fast'}${PART2 ? '&part2' : ''}`);
    await page.evaluate((p2) => { try { localStorage.clear(); if (p2) localStorage.setItem('dk.toerlagt', JSON.stringify({ v: 1, stats: { runs: 1, done: 1, reached: 6, ranks: {}, endings: { 'Tørlagt': 1 }, missed: {}, lastEnding: 'Tørlagt' }, run: null })); } catch (e) { /* */ } }, PART2);
    await page.reload();
    const t0 = Date.now(); let ticks = 0, idle = 0, lastSig = '', same = 0, lastScreen = '', screens = new Set(), done = false;
    while (Date.now() - t0 < 10 * 60 * 1000) {
      await page.waitForTimeout(REAL ? 450 : 60);
      const r = await page.evaluate((mode) => {
        const res = window.K && window.K.botTick ? window.K.botTick(mode) : { idle: true };
        const scr = document.querySelector('#screen');
        const text = scr ? scr.innerText.slice(0, 3000) : '';
        const game = document.querySelector('.game');
        const gr = game && game.getBoundingClientRect();
        const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
        const tiny = [...document.querySelectorAll('button')].filter((b) => b.offsetParent && !b.closest('.mbox .toggle')).map((b) => [b.getBoundingClientRect(), b.textContent.trim().slice(0, 20)]).filter(([q]) => q.height < 43.5 || q.width < 43.5).map(([, t]) => t);
        return Object.assign(res, { text, sig: (window.K.cur && window.K.cur.token) + '|' + text.slice(-200), screen: res.screen || (window.K.cur && window.K.cur.id), cover: gr ? (gr.width * gr.height) / (innerWidth * innerHeight) : 1, imgs, tiny, err: res.err || (document.querySelector('.errbox') ? [document.querySelector('.errbox').innerText] : null) });
      }, mode);
      ticks++;
      // leave mid-story and come back: Fortsæt must land on the same step (Bruno lost his place once)
      if (ticks === 90 && run === 1) {
        const was = await page.evaluate(() => window.K.save.run && window.K.save.run.step);
        if (was > 0) {
          await page.reload(); await page.waitForTimeout(400);
          const c = await page.$('[data-bot="continue"]');
          if (!c) { problems.push('after leaving mid-story the title has no Fortsæt'); break; }
          await c.click(); await page.waitForTimeout(300);
          const now = await page.evaluate(() => window.K.st && window.K.st.step);
          if (now !== was) { problems.push(`Fortsæt resumed at step ${now}, not ${was}`); break; }
        }
      }
      if (r.err) { problems.push(...r.err.map((e) => 'game error: ' + String(e).slice(0, 400))); break; }
      if (r.done) { done = true; break; }
      if (/\bundefined\b|NaN|\[object Object\]/.test(r.text)) { problems.push('bad text on screen: ' + r.text.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,40}/)[0]); break; }
      if (r.imgs.length) { problems.push('image failed: ' + r.imgs[0]); break; }
      if (r.cover < 0.9) { problems.push(`mini-game on "${r.screen}" covers only ${Math.round(r.cover * 100)}% of the screen`); break; }
      r.tiny.forEach((t) => small.add(`${r.screen}: "${t}"`));
      if (r.screen) screens.add(r.screen);
      if (SHOTS && r.screen + r.sig.split('|')[0] !== lastScreen) {
        lastScreen = r.screen + r.sig.split('|')[0];
        fs.mkdirSync(SHOTS, { recursive: true });
        const f = path.join(SHOTS, `r${run}-${String(shots.length + 1).padStart(3, '0')}-${r.screen}.png`);
        await page.screenshot({ path: f }); shots.push(f);
      }
      idle = r.idle ? idle + 1 : 0;
      same = r.sig === lastSig ? same + 1 : 0; lastSig = r.sig;
      if (idle > (REAL ? 40 : 200) || same > (REAL ? 80 : 400)) { problems.push(`stuck on "${r.screen}": ${r.text.slice(-160).replace(/\s+/g, ' ')}`); break; }
    }
    if (!done && !problems.length) problems.push('did not reach the end in 10 minutes');
    const vc = await page.evaluate(() => ({ cuts: window.__voiceCuts || [], lines: window.__voiceLines || 0 }));
    vc.cuts.slice(0, 5).forEach((t) => problems.push('voice cut mid-line: "' + t + '"'));
    if (!vc.lines) problems.push('the voice never spoke (fake voice not picked up)');
    small.forEach((t) => problems.push('button under 44 px: ' + t));
    const secs = Math.round((Date.now() - t0) / 1000);
    console.log(`run ${run} (${mode}): ${problems.length ? 'FAIL' : 'ok'} · ${ticks} ticks · ${secs}s · screens: ${[...screens].join(', ')}`);
    problems.forEach((p) => console.log('  ✗ ' + p));
    if (problems.length) failed++;
    await page.close();
  }
  if (SHOTS && shots.length) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
    const cells = shots.map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}"><figcaption>${path.basename(f)}</figcaption></figure>`).join('');
    await page.setContent(`<style>body{margin:0;background:#222;display:grid;grid-template-columns:repeat(8,1fr);gap:6px;padding:6px;font:11px sans-serif;color:#ccc}img{width:100%;display:block}figure{margin:0}</style>${cells}`);
    await page.screenshot({ path: path.join(SHOTS, 'contact.png'), fullPage: true });
    console.log('contact sheet: ' + path.join(SHOTS, 'contact.png'));
  }
  await browser.close(); srv.close();
  console.log(failed ? `playtest: ${failed} run(s) FAILED` : 'playtest: all runs ok');
  process.exit(failed ? 1 : 0);
})();
