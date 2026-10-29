// node tools/playtest.js [--runs N] [--shots dir] [--slow] [--solo]
// Plays the whole game on a phone-sized screen with real taps. Fails on JS errors, stuck screens,
// or "undefined" / "NaN" / "[object Object]" on screen.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const RUNS = +opt('--runs', 2), SHOTS = opt('--shots', null), SLOW = !!opt('--slow', false), SOLO = !!opt('--solo', false);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.txt': 'text/plain', '.json': 'application/json' };
function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
      fs.readFile(p, (e, d) => { if (e) { rsp.writeHead(404); rsp.end(); return; } rsp.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); rsp.end(d); });
    }).listen(0, () => res(srv));
  });
}
const BUILD = [['Det', 'er', 'ikke', 'rødt'], ['Det', 'er', 'grønt'], ['den', 'beige', 'sok']];
(async () => {
  const srv = await serve(); const port = srv.address().port;
  const browser = await chromium.launch();
  let failed = 0;
  for (let run = 1; run <= RUNS; run++) {
    const page = await browser.newPage({ viewport: { width: 393, height: 851 }, deviceScaleFactor: 1, hasTouch: true });
    const errors = [], missing = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
    page.on('response', (r) => { if (r.status() === 404 && !/fonts\.g/.test(r.url())) missing.push(r.url().replace(/^.*?\/\/[^/]+/, '')); });
    await page.goto(`http://localhost:${port}/?${SLOW ? '' : 'fast&'}debug`);
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await page.reload();
    const acts = []; const t0 = Date.now(); let last = '', same = 0, shot = 0, done = false, lastCls = '';
    const seenGames = new Set();
    while (Date.now() - t0 < 14 * 60 * 1000) {
      await page.waitForTimeout(SLOW ? 500 : 120);
      const state = await page.evaluate(() => {
        const s = document.querySelector('#screen');
        return { cls: s.className, text: s.innerText.slice(0, 4000), title: (document.querySelector('.gt') || {}).textContent || '', errs: window.__kddErrors || [] };
      });
      if (state.errs.length) { errors.push(...state.errs); break; }
      if (/\bundefined\b|NaN|\[object Object\]/.test(state.text)) { errors.push('bad text on screen: ' + state.text.match(/.{0,40}(undefined|NaN|\[object Object\]).{0,40}/)[0]); break; }
      if (state.title) seenGames.add(state.title);
      if (SHOTS && (state.cls + state.title) !== lastCls) { lastCls = state.cls + state.title; fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, `r${run}-${String(++shot).padStart(3, '0')}.png`) }); }
      if (/\bend\b/.test(state.cls) && /SLUT/.test(state.text)) { done = true; break; }
      const sig = state.cls + state.text.slice(-300);
      same = sig === last ? same + 1 : 0; last = sig;
      if (same > (SLOW ? 120 : 250) && !/Lukketid/.test(state.title)) { errors.push('stuck on: ' + state.cls + ' | ' + state.text.slice(-200)); break; }
      // act
      const acted = await page.evaluate((BUILD) => {
        const vis = (e) => e && e.offsetParent !== null && !e.disabled;
        const click = (e) => { e.click(); return (e.className + ':' + e.textContent).slice(0, 40); };
        const q = (s) => [...document.querySelectorAll(s)].filter(vis);
        const one = (s) => q(s)[0];
        const rnd = (a) => a[Math.floor(Math.random() * a.length)];
        let e;
        if ((e = one('.stamp .next'))) return click(e);
        if ((e = one('.modal .opt'))) return click(rnd(q('.modal .opt')));
        const pool = q('.builder .tile');
        if (pool.length) {
          const words = pool.map((b) => b.textContent);
          const target = BUILD.find((t) => t.every((w) => words.includes(w) || document.querySelector('.built').textContent.includes(w)));
          const built = document.querySelector('.built').textContent.replace('…', '').trim().split(/\s+/).filter(Boolean);
          if (target) { const nextW = target[built.length]; const b = pool.find((x) => x.textContent === nextW); if (b) return click(b); }
          return click(rnd(pool));
        }
        if ((e = q('.tiles .tile')).length) return click(rnd(e));
        const men = q('.man'); if (men.length) { const h = document.querySelector('.man.heard'); return click(h || rnd(men)); }
        const tags = q('.tagcell:not(.judged)'); if (tags.length) return click(rnd(tags));
        if ((e = q('.opt')).length) return click(rnd(e));
        if ((e = one('.next.pulse')) || (e = one('.gbody > .next'))) return click(e);
        if ((e = one('.choice .opt'))) return click(e);
        if ((e = one('.bar .next')) || (e = one('.card .next')) || (e = one('.next'))) return click(e);
        if ((e = one('.mbtn.main'))) return click(e);
        return false;
      }, BUILD);
      acts.push(acted); if (acts.length > 12) acts.shift();
      // Lukketid: wiggle a finger around the arena
      if (!acted) {
        const cv = await page.$('.arena-cv');
        if (cv) { const b = await cv.boundingBox(); const x = b.x + b.width * (0.3 + Math.random() * 0.4), y = b.y + b.height * (0.4 + Math.random() * 0.4); await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 30, y - 20, { steps: 3 }); await page.mouse.up(); }
      }
    }
    const st = await page.evaluate(() => { const s = window.K && window.K.save; return s ? { stats: s.stats } : null; });
    if (!done) { errors.push('timeout; last actions: ' + JSON.stringify(acts)); errors.push('screen: ' + (await page.evaluate(() => document.querySelector('#screen').innerHTML.slice(-900)))); }
    const ok = done && !errors.length;
    if (!ok) failed++;
    console.log(`run ${run}: ${ok ? 'OK' : 'FAIL'} in ${Math.round((Date.now() - t0) / 1000)}s · games: ${[...seenGames].join(', ')} · endings ${st ? JSON.stringify(st.stats.endings) : '-'} best socks ${st ? st.stats.best : '-'}`);
    if (missing.length) console.log('  missing files:', [...new Set(missing)].slice(0, 12).join(' '));
    errors.slice(0, 5).forEach((e) => console.log('  ERR', e.slice(0, 1200)));
    await page.close();
  }
  await browser.close(); srv.close();
  process.exit(failed ? 1 : 0);
})();
