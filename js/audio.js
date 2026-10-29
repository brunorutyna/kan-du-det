// Kan du det?! — voices, Italo-disco music (WebAudio, composed in code) and effects.
(function (K) {
  'use strict';
  const S = () => K.settings;
  let ctx = null, master = null, musicBus = null, sfxBus = null;
  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(master);
      musicBus = ctx.createGain(); musicBus.connect(comp);
      sfxBus = ctx.createGain(); sfxBus.connect(comp);
      applyVolumes();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function applyVolumes() {
    if (!ctx) return;
    musicBus.gain.value = S().music ? 0.42 : 0;
    sfxBus.gain.value = S().sfx ? 0.7 : 0;
  }

  // ---------- voices ----------
  // clip id: fnv1a hash of "who|text"; the manifest K.VOICES lists the clips that exist.
  function hash(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); }
  function clipId(who, text) { return hash(who + '|' + text.trim()); }
  let cur = null, curDone = null;
  function stopVoice() { if (cur) { try { cur.pause(); } catch (e) {} cur = null; } if (curDone) { const d = curDone; curDone = null; d(); } }
  // Returns a promise that resolves when the clip ends (or at once if voice is off / missing).
  // Lines are queued, never cut: a new line waits for the one still playing (the ▶ button cuts on purpose).
  let chain = Promise.resolve();
  function say(who, text, cut) {
    const id = clipId(who, text);
    if (!S().voice || !K.VOICES || !K.VOICES[id]) return Promise.resolve(false);
    if (cut) { stopVoice(); chain = Promise.resolve(); }
    const p = chain.then(() => new Promise((res) => {
      const a = new Audio('audio/v/' + id + '.mp3');
      a.volume = 1; cur = a; curDone = () => res(true);
      let fin = false;
      const end = () => { if (fin) return; fin = true; if (cur === a) { cur = null; curDone = null; } duck(false); res(true); };
      a.onended = end; a.onerror = end;
      // never wait forever (blocked autoplay, a stalled download)
      setTimeout(end, Math.min(12000, 1800 + text.length * 95));
      if (K.fast) setTimeout(end, 20);
      duck(true);
      a.play().catch(end);
    }));
    chain = p;
    return p;
  }
  let duckN = 0;
  function duck(on) {
    if (!ctx) return; duckN += on ? 1 : -1; if (duckN < 0) duckN = 0;
    const v = S().music ? (duckN ? 0.18 : 0.42) : 0;
    musicBus.gain.setTargetAtTime(v, ctx.currentTime, 0.12);
  }

  // ---------- synth helpers ----------
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  let reverb = null;
  function verb() {
    if (reverb) return reverb;
    const c = ac(), len = c.sampleRate * 2.2, b = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    reverb = c.createConvolver(); reverb.buffer = b; const g = c.createGain(); g.gain.value = 0.25; reverb.connect(g); g.connect(musicBus);
    return reverb;
  }
  function voiceOsc(f, t, d, type, g, opts) {
    const c = ac(), o = c.createOscillator(), a = c.createGain(), fl = c.createBiquadFilter();
    o.type = type; o.frequency.value = f; if (opts && opts.detune) o.detune.value = opts.detune;
    fl.type = 'lowpass'; fl.frequency.setValueAtTime((opts && opts.cut) || 3000, t);
    if (opts && opts.env) { fl.frequency.setValueAtTime(opts.env, t); fl.frequency.exponentialRampToValueAtTime((opts.cut || 600), t + d); }
    a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(g, t + ((opts && opts.att) || 0.005)); a.gain.exponentialRampToValueAtTime(0.0008, t + d);
    o.connect(fl); fl.connect(a); a.connect(musicBus); if (opts && opts.wet) a.connect(verb());
    o.start(t); o.stop(t + d + 0.05);
  }
  function kick(t, g) { const c = ac(), o = c.createOscillator(), a = c.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.11); a.gain.setValueAtTime(g || 1, t); a.gain.exponentialRampToValueAtTime(0.001, t + 0.3); o.connect(a); a.connect(musicBus); o.start(t); o.stop(t + 0.32); }
  let noiseBuf = null;
  function noise(t, d, g, hp, bus) {
    const c = ac();
    if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const x = noiseBuf.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; }
    const s = c.createBufferSource(); s.buffer = noiseBuf; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; const a = c.createGain();
    a.gain.setValueAtTime(g, t); a.gain.exponentialRampToValueAtTime(0.001, t + d);
    s.connect(f); f.connect(a); a.connect(bus || musicBus); s.start(t); s.stop(t + d + 0.02);
  }
  function clap(t, g) { noise(t, 0.12, g, 1200); noise(t + 0.012, 0.1, g * 0.7, 1500); noise(t, 0.4, g * 0.15, 900); }

  // ---------- Italo-disco tracks ----------
  // Each track: bpm, root (midi), chords (scale degrees offsets per bar), arp pattern, lead melody (16th steps), drum flags.
  const TR = {
    title: { bpm: 118, root: 45, prog: [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2]], arp: [0, 1, 2, 1, 0, 2, 1, 2], lead: [12, 0, 0, 15, 0, 17, 0, 15, 12, 0, 10, 0, 12, 0, 0, 0, 19, 0, 17, 0, 15, 0, 17, 0, 15, 0, 12, 0, 10, 0, 12, 0], drums: 2, pad: true, bassOct: true },
    morgen: { bpm: 112, root: 48, prog: [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]], arp: [0, 2, 1, 2], lead: null, drums: 1, pad: true, bassOct: true },
    duel: { bpm: 124, root: 40, prog: [[0, 3, 7], [0, 3, 7], [1, 5, 8], [-2, 2, 5]], arp: [0, 1, 2, 3 - 3 + 2, 1, 0, 2, 1], lead: [0, 0, 12, 0, 0, 0, 13, 0, 12, 0, 0, 10, 0, 0, 7, 0], drums: 2, pad: false, bassOct: true },
    stirren: { bpm: 96, root: 43, prog: [[0, 3, 7], [1, 5, 8]], arp: [0, 2], lead: null, drums: 0, pad: true, bassOct: false, sparse: true },
    lukketid: { bpm: 132, root: 41, prog: [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]], arp: [0, 1, 2, 1, 2, 1, 0, 2], lead: [12, 12, 0, 15, 0, 12, 0, 17, 0, 15, 0, 12, 10, 0, 12, 0], drums: 3, pad: false, bassOct: true },
    soendag: { bpm: 110, root: 50, prog: [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]], arp: [0, 1, 2, 1], lead: [7, 0, 9, 0, 11, 0, 12, 0, 11, 0, 9, 0, 7, 0, 4, 0], drums: 1, pad: true, bassOct: true },
    auktion: { bpm: 120, root: 46, prog: [[0, 4, 7], [2, 5, 9], [-3, 0, 4], [-1, 2, 5]], arp: [0, 2, 1, 2, 0, 2, 1, 2], lead: [12, 0, 12, 14, 0, 16, 0, 0, 14, 0, 12, 0, 11, 0, 0, 0], drums: 2, pad: false, bassOct: true },
    finale: { bpm: 104, root: 45, prog: [[0, 3, 7], [-4, 0, 3], [-7, -4, 0], [-5, -1, 2]], arp: [0, 1, 2, 3 - 1, 2, 1], lead: [12, 0, 0, 0, 15, 0, 0, 0, 14, 0, 0, 0, 10, 0, 0, 0], drums: 1, pad: true, bassOct: true, wet: true },
  };
  let seq = null;
  function playMusic(name) {
    if (seq && seq.name === name) return;
    stopMusic();
    const tr = TR[name]; if (!tr) return;
    const c = ac(); const s16 = 60 / tr.bpm / 4; let t = c.currentTime + 0.08, step = 0;
    seq = { name, timer: null };
    const me = seq;
    me.timer = setInterval(() => {
      if (seq !== me) return;
      while (t < c.currentTime + 0.25) {
        const k = step % 16, bar = Math.floor(step / 16), ch = tr.prog[bar % tr.prog.length];
        const root = tr.root + ch[0];
        // bass: octave-jumping 8ths (the Italo engine)
        if (!tr.sparse || k % 4 === 0) {
          if (k % 2 === 0) voiceOsc(hz(root - 12 + ((tr.bassOct && (k / 2) % 2 === 1) ? 12 : 0)), t, s16 * 1.6, 'sawtooth', 0.26, { cut: 380, env: 1400 });
        }
        // arp
        if (k % 2 === 0 || !tr.sparse) {
          const deg = ch[tr.arp[step % tr.arp.length] % ch.length];
          if (!tr.sparse || k % 4 === 0) voiceOsc(hz(tr.root + 12 + deg + (Math.floor(step / tr.arp.length) % 2 ? 12 : 0)), t, s16 * 0.9, 'square', 0.05, { cut: 2600, wet: true });
        }
        // pad on bar start
        if (tr.pad && k === 0) ch.forEach((d, i) => { voiceOsc(hz(tr.root + 12 + d), t, s16 * 15, 'sawtooth', 0.035, { att: 0.3, cut: 1200, detune: i * 7, wet: true }); voiceOsc(hz(tr.root + 12 + d), t, s16 * 15, 'sawtooth', 0.03, { att: 0.3, cut: 1200, detune: -9, wet: true }); });
        // lead
        if (tr.lead && bar % 4 >= 2) { const l = tr.lead[(step) % tr.lead.length]; if (l) voiceOsc(hz(tr.root + 12 + l), t, s16 * 2.2, 'square', 0.07, { cut: 3200, wet: true, att: 0.01 }); }
        // drums
        if (tr.drums >= 1 && k % 4 === 0) kick(t, 0.9);
        if (tr.drums >= 1 && (k === 4 || k === 12)) clap(t, 0.35);
        if (tr.drums >= 2 && k % 2 === 1) noise(t, 0.04, 0.12, 7000);
        if (tr.drums >= 3 && k % 4 === 2) noise(t, 0.09, 0.14, 5000);
        if (tr.sparse && k === 0 && bar % 2 === 0) voiceOsc(hz(tr.root - 24), t, s16 * 16, 'sine', 0.3, { att: 0.05, cut: 200 });
        step++; t += s16;
      }
    }, 40);
  }
  function stopMusic() { if (seq) { clearInterval(seq.timer); seq = null; } }

  // ---------- effects ----------
  function sfx(name) {
    if (!S().sfx) return;
    const c = ac(), t = c.currentTime + 0.01, out = sfxBus;
    const tone = (f, d, type, g, f2) => { const o = c.createOscillator(), a = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); a.gain.setValueAtTime(g, t); a.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(a); a.connect(out); o.start(t); o.stop(t + d + 0.02); };
    if (name === 'ok') { tone(880, 0.12, 'square', 0.12); setTimeout(() => tone(1320, 0.15, 'square', 0.1), 70); }
    else if (name === 'bad') { tone(180, 0.3, 'sawtooth', 0.18, 90); }
    else if (name === 'sock') { tone(520, 0.25, 'triangle', 0.18, 260); }
    else if (name === 'unsock') { tone(300, 0.2, 'triangle', 0.15, 900); }
    else if (name === 'tap') { tone(1200, 0.04, 'square', 0.05); }
    else if (name === 'hit') { noise(t, 0.12, 0.3, 2500, out); tone(220, 0.1, 'square', 0.12, 110); }
    else if (name === 'zoom') { tone(200, 0.5, 'sawtooth', 0.08, 1600); }
    else if (name === 'boom') { noise(t, 0.6, 0.5, 60, out); tone(90, 0.5, 'sine', 0.5, 40); }
    else if (name === 'tag') { tone(1800, 0.05, 'square', 0.06, 900); }
    else if (name === 'gavel') { noise(t, 0.08, 0.5, 400, out); tone(140, 0.15, 'square', 0.25, 80); }
  }

  K.audio = { ac, say, stopVoice, clipId, hash, playMusic, stopMusic, sfx, applyVolumes, TRACKS: Object.keys(TR) };
})(window.K = window.K || {});
