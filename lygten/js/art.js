// SIMPLE ART (prototype). Every visual goes through ART.*; promotion replaces this file only.
// Rules: shapes and type only; things are drawn in exactly the colour and pattern their Danish names.
(function (K) {
  'use strict';
  const el = K.el;
  const PAT = {
    dots: (c, id) => `<pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill="${c}"/></pattern>`,
    stripes: (c, id) => `<pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="5" height="12" fill="${c}"/></pattern>`,
    checks: (c, id) => `<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${c}"/><rect x="8" y="8" width="8" height="8" fill="${c}"/></pattern>`,
  };
  let uid = 0;
  const ART = {
    // Scene backdrop: a two-colour gradient, plus a sun or moon if the scene has a time of day.
    scene(id, state) {
      const sc = (K.SCENES && K.SCENES[id]) || { from: '#2b3040', to: '#14161c' };
      const d = el('div', 'scene');
      d.style.background = `linear-gradient(180deg, ${sc.from}, ${sc.to})`;
      if (sc.sky) d.appendChild(el('div', 'orb ' + (state && state.night ? 'moon' : 'sun')));
      if (sc.label) d.appendChild(el('div', 'scene-label', K.esc(sc.label)));
      return d;
    },
    // A character token: rounded shape in its colour, blinking eyes, mouth by mood, name label. It bobs.
    actor(id, mood) {
      const c = (K.CAST && K.CAST[id]) || { name: id, color: '#8a8fa3' };
      const mouth = { happy: 'M38 62 Q50 72 62 62', sad: 'M38 68 Q50 58 62 68', shock: 'M46 62 a4 5 0 1 0 8 0 a4 5 0 1 0 -8 0' }[mood] || 'M40 65 L60 65';
      const d = el('div', 'actor bob');
      d.dataset.actor = id;
      d.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="12" y="10" width="76" height="80" rx="34" fill="${c.color}" stroke="#0008" stroke-width="3"/>
        <g class="eyes"><circle cx="38" cy="44" r="5" fill="#111"/><circle cx="62" cy="44" r="5" fill="#111"/></g>
        <path d="${mouth}" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/></svg><div class="name">${K.esc(c.name)}</div>`;
      return d;
    },
    // A thing card in the exact colour + pattern. colour/pattern are keys of K.COLORS / K.PATTERNS.
    thing(label, colour, pattern) {
      const col = (K.COLORS[colour] || {}).hex || '#d9d9d9';
      const ink = (K.COLORS[colour] || {}).dark ? '#fff' : '#111';
      const p = pattern && K.PATTERNS[pattern];
      const pid = 'pat' + (++uid);
      const defs = p ? PAT[p](ink, pid) : '';
      const fillPat = p ? `<rect x="6" y="6" width="88" height="88" rx="14" fill="url(#${pid})" opacity=".55"/>` : '';
      const d = el('div', 'thing');
      d.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs>${defs}</defs><rect x="6" y="6" width="88" height="88" rx="14" fill="${col}" stroke="#0009" stroke-width="3"/>${fillPat}</svg>` +
        (label ? `<div class="tlabel">${K.da(label)}</div>` : '');
      return d;
    },
    // Simple stroke icons. Add more as needed; no two icons in one set may look alike.
    icon(name) {
      const P = { star: 'M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z', heart: 'M12 21s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z', coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4v10', key: 'M8 14a4 4 0 1 1 3-3l9 0v3h-2v2h-3v-2h-4' };
      return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[name] || P.star}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
    },
    // Small juice helpers (CSS classes in kit.css)
    pop(node) { node.classList.remove('pop'); void node.offsetWidth; node.classList.add('pop'); },
    shake(node) { node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake'); },
    burst(x, y, color) {
      for (let i = 0; i < 10; i++) {
        const p = el('div', 'spark'); p.style.left = x + 'px'; p.style.top = y + 'px'; p.style.background = color || 'var(--good)';
        const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 40;
        p.style.setProperty('--dx', Math.cos(a) * r + 'px'); p.style.setProperty('--dy', Math.sin(a) * r + 'px');
        document.body.appendChild(p); setTimeout(() => p.remove(), 600);
      }
    },
  };
  K.ART = ART;
})(window.K = window.K || {});
