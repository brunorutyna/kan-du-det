// AUDIO. Every sound goes through SFX / VOICE / MUSIC.
// Music is composed in code (WebAudio): a desert band of pads, plucked arpeggios through a delay, a ney-like lead,
// sub bass and soft hand percussion, with a convolution reverb. Four moods: calm (camp), tense (night),
// trip (psychedelic: phaser and swirl), happy (ending). Volumes for music, effects and voice come from settings.
// Voice never blocks the game: every say() resolves by itself after the line's natural length.
(function (K) {
  'use strict';
  let ac = null, master = null, musicBus = null, sfxBus = null;
  const vol = (k, d) => { const v = K.settings && K.settings[k + 'Vol']; return v == null ? d : v; };
  function ctx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      try { ac = new AC({ latencyHint: 'balanced' }); } catch (e) { try { ac = new AC(); } catch (e2) { ac = null; } }
      if (ac) ac.onstatechange = () => { if (ac.state === 'running') nextT = 0; };
      if (ac) build();
    }
    if (ac && ac.state === 'suspended') ac.resume();
    return ac;
  }

  // ---------- mixer: instruments → (phaser for the trip) → music bus; delay + reverb sends
  let inst, phWet, delayIn, revIn, lfo, lfoGain, noiseBuf;
  function impulse(sec, decay) {
    const len = Math.floor(ac.sampleRate * sec), b = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
    return b;
  }
  function build() {
    master = ac.createGain(); master.gain.value = 0.9;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
    master.connect(comp).connect(ac.destination);
    musicBus = ac.createGain(); musicBus.connect(master);
    sfxBus = ac.createGain(); sfxBus.connect(master);
    // reverb
    const rev = ac.createConvolver(); rev.buffer = impulse(1.9, 2.4);
    revIn = ac.createGain(); revIn.gain.value = 0.9; revIn.connect(rev); const revOut = ac.createGain(); revOut.gain.value = 0.55; rev.connect(revOut).connect(musicBus);
    // dotted-eighth delay with a darkened feedback loop
    delayIn = ac.createGain();
    const dl = ac.createDelay(2); dl.delayTime.value = 0.5; const fb = ac.createGain(); fb.gain.value = 0.38; const dlf = ac.createBiquadFilter(); dlf.type = 'lowpass'; dlf.frequency.value = 2400;
    delayIn.connect(dl); dl.connect(dlf).connect(fb).connect(dl); const dOut = ac.createGain(); dOut.gain.value = 0.45; dlf.connect(dOut); dOut.connect(musicBus); dOut.connect(revIn);
    K.__delay = dl;
    // instrument bus: dry + phaser (wet only in the trip)
    inst = ac.createGain(); inst.connect(musicBus);
    let node = inst; const aps = [];
    for (let i = 0; i < 4; i++) { const ap = ac.createBiquadFilter(); ap.type = 'allpass'; ap.frequency.value = 600 + i * 400; ap.Q.value = 0.7; node.connect(ap); node = ap; aps.push(ap); }
    phWet = ac.createGain(); phWet.gain.value = 0; node.connect(phWet).connect(musicBus);
    lfo = ac.createOscillator(); lfo.frequency.value = 0.18; lfoGain = ac.createGain(); lfoGain.gain.value = 500; lfo.connect(lfoGain); aps.forEach((ap) => lfoGain.connect(ap.frequency)); lfo.start();
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    applyVolumes();
  }
  function applyVolumes() {
    if (!ac) return;
    const t = ac.currentTime;
    const m = K.settings && K.settings.music === false ? 0 : vol('music', 0.7);
    const s = K.settings && K.settings.sfx === false ? 0 : vol('sfx', 0.8);
    musicBus.gain.setTargetAtTime(m * m * 1.6, t, 0.15);
    sfxBus.gain.setTargetAtTime(s * s, t, 0.05);
  }

  // ---------- sound effects
  function tone(freq, dur, type, v, when) {
    const a = ctx(); if (!a) return;
    const t = a.currentTime + (when || 0);
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(v || 0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(sfxBus); o.start(t); o.stop(t + dur + 0.02);
  }
  const SOUNDS = {
    tap: () => tone(660, 0.05, 'triangle', 0.05),
    ok: () => { tone(660, 0.08, 'triangle', 0.09); tone(990, 0.14, 'triangle', 0.09, 0.07); },
    bad: () => { tone(220, 0.16, 'sawtooth', 0.05); tone(160, 0.2, 'sawtooth', 0.04, 0.1); },
    up: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.12, 'triangle', 0.07, i * 0.07)),
    win: () => [523, 659, 784, 659, 1046].forEach((f, i) => tone(f, 0.16, 'triangle', 0.08, i * 0.1)),
    lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.22, 'triangle', 0.08, i * 0.14)),
  };
  K.SFX = { play(id) { if (!K.settings || K.settings.sfx === false || !vol('sfx', 0.8)) return; try { ctx(); (SOUNDS[id] || SOUNDS.tap)(); } catch (e) { /* no audio */ } } };

  // ---------- voice: the browser's Danish voice (da-DK) if the phone has one
  let daVoice = null;
  const synth = typeof speechSynthesis !== 'undefined' ? speechSynthesis : null;
  function findVoice() { if (!synth) return null; daVoice = synth.getVoices().find((v) => /^da/i.test(v.lang)) || null; return daVoice; }
  if (synth) { findVoice(); synth.onvoiceschanged = findVoice; }
  let queue = Promise.resolve(), gen = 0;
  K.VOICE = {
    available: () => !!(daVoice || findVoice()),
    // say(text, who, mode). A line being spoken is NEVER cut mid-word, except when the player taps ▶ (mode 'replay').
    // mode truthy (a new round, an answer): lines not yet started are dropped, the new one follows the current line.
    // mode falsy: the line queues behind everything (story panels).
    say(text, who, mode) {
      const est = Math.min(9000, 700 + String(text).length * 75);
      let my = 0;
      const speak = () => new Promise((res) => {
        if (my !== gen) return res(); // dropped by a screen change before it started
        const v = K.settings && K.settings.voice === false ? 0 : vol('voice', 1);
        if (!v || !synth || !K.VOICE.available()) return res();
        try {
          const u = new SpeechSynthesisUtterance(text); u.voice = daVoice; u.lang = 'da-DK'; u.volume = v;
          const c = K.CAST && who && K.CAST[who]; if (c && c.pitch) u.pitch = c.pitch;
          u.rate = 0.95; u.onend = res; u.onerror = res; synth.speak(u);
        } catch (e) { res(); }
      });
      if (mode === 'replay') { K.VOICE.stop(); queue = Promise.resolve(); }
      else if (mode) { gen++; } // drop what has not started; the current line finishes
      my = gen;
      const p = queue.then(() => K.timeout(speak(), est));
      queue = p;
      return K.timeout(p, est * 2);
    },
    // a screen change: lines that have not started are dropped; the line being spoken finishes (never cut mid-line)
    settle() { gen++; },
    // hard stop: only for the player's own ▶ replay and the settings test (lint enforces this)
    stop() { try { if (synth) { window.__voiceReplay = Date.now(); synth.cancel(); } } catch (e) { /* ignore */ } queue = Promise.resolve(); },
  };

  // ---------- the instruments (all scheduled at time t)
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  let live = 0; // sounding sources; decoration is skipped when the phone is busy
  const track = (src) => { live++; src.onended = () => { live--; }; };
  const busy = () => live > 26;
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function pluck(t, m, v, bright) {
    const o1 = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o1.type = 'triangle'; o2.type = 'sawtooth'; o1.frequency.value = mtof(m); o2.frequency.value = mtof(m); o2.detune.value = 7;
    const g2 = ac.createGain(); g2.gain.value = 0.25;
    f.type = 'lowpass'; f.Q.value = 3; f.frequency.setValueAtTime(bright || 3200, t); f.frequency.exponentialRampToValueAtTime(500, t + 0.35);
    o1.connect(f); o2.connect(g2).connect(f); f.connect(g); env(g, t, 0.004, 0.16 * v, 0.7);
    g.connect(inst); const s1 = ac.createGain(); s1.gain.value = 0.5; g.connect(s1).connect(delayIn); const s2 = ac.createGain(); s2.gain.value = 0.35; g.connect(s2).connect(revIn);
    [o1, o2].forEach((o) => { o.start(t); o.stop(t + 0.8); }); track(o1);
  }
  function pad(t, notes, dur, v) {
    notes.forEach((m, k) => [k % 2 ? -7 : 7].forEach((det) => {
      const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
      o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det;
      f.type = 'lowpass'; f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1300, t + dur * 0.5); f.frequency.linearRampToValueAtTime(600, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03 * v, t + 1.2); g.gain.setValueAtTime(0.03 * v, t + dur - 0.2); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.9);
      o.connect(f).connect(g); g.connect(inst); const s = ac.createGain(); s.gain.value = 0.8; g.connect(s).connect(revIn);
      o.start(t); o.stop(t + dur + 1.0); track(o);
    }));
  }
  function bass(t, m, dur, v) {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = mtof(m); o2.frequency.value = mtof(m - 12);
    f.type = 'lowpass'; f.frequency.value = 420;
    o.connect(f); o2.connect(f); f.connect(g); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.2 * v, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(musicBus); [o, o2].forEach((x) => { x.start(t); x.stop(t + dur + 0.05); });
  }
  function lead(t, m, dur, v) {
    const o = ac.createOscillator(), o2 = ac.createOscillator(), vib = ac.createOscillator(), vg = ac.createGain(), g = ac.createGain(), f = ac.createBiquadFilter();
    o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = mtof(m); o2.frequency.value = mtof(m);
    vib.frequency.value = 5.2; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(7, t + 0.35); vib.connect(vg); vg.connect(o.detune); vg.connect(o2.detune);
    f.type = 'lowpass'; f.frequency.value = 2600;
    const g2 = ac.createGain(); g2.gain.value = 0.35; o.connect(f); o2.connect(g2).connect(f); f.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.07 * v, t + 0.09); g.gain.setValueAtTime(0.07 * v, t + dur * 0.8); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.25);
    g.connect(inst); const s = ac.createGain(); s.gain.value = 0.6; g.connect(s).connect(revIn); const s2 = ac.createGain(); s2.gain.value = 0.3; g.connect(s2).connect(delayIn);
    [o, o2, vib].forEach((x) => { x.start(t); x.stop(t + dur + 0.3); }); track(o);
  }
  function kick(t, v) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    env(g, t, 0.002, 0.55 * v, 0.32); o.connect(g).connect(musicBus); o.start(t); o.stop(t + 0.4);
  }
  function hit(t, v, freq, q, dur, rev) {
    const n = ac.createBufferSource(); n.buffer = noiseBuf; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; const g = ac.createGain();
    env(g, t, 0.001, v, dur); n.connect(f).connect(g).connect(musicBus); if (rev) { const s = ac.createGain(); s.gain.value = rev; g.connect(s).connect(revIn); }
    n.start(t, Math.random()); n.stop(t + dur + 0.05); track(n);
  }
  const shaker = (t, v) => hit(t, 0.05 * v, 7500, 0.8, 0.05);
  const darbuka = (t, v, hi) => { hit(t, 0.22 * v, hi ? 900 : 380, hi ? 6 : 3, hi ? 0.08 : 0.16, 0.15); };
  function swell(t, dur, v) { // a rising noise sweep (trip fills)
    const n = ac.createBufferSource(); n.buffer = noiseBuf; n.loop = true; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 4;
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(5000, t + dur); const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05 * v, t + dur * 0.9); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    n.connect(f).connect(g).connect(inst); const s = ac.createGain(); s.gain.value = 0.8; g.connect(s).connect(revIn); n.start(t); n.stop(t + dur + 0.05);
  }

  // ---------- the moods. Notes are MIDI numbers. 16 steps per bar.
  // calm: D phrygian-dominant warmth (D Eb F# G A Bb C); tense: D minor, sparse, heartbeat; trip: D lydian with phaser; happy: D major.
  const MOODS = {
    calm: { bpm: 88, chords: [[50, 54, 57], [51, 55, 58], [48, 51, 55], [50, 54, 57]], scale: [62, 63, 66, 67, 69, 70, 72, 74],
      arp: [0, -1, 2, 1, -1, 3, 2, -1, 4, -1, 2, 3, -1, 1, 0, -1], drums: 'calm', lead: [[0, 69, 4], [4, 70, 2], [6, 69, 2], [8, 66, 6], [16, 67, 4], [20, 66, 2], [22, 63, 2], [24, 62, 8]] },
    tense: { bpm: 72, chords: [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]], scale: [62, 63, 65, 67, 69, 70, 72],
      arp: [0, -1, -1, -1, 2, -1, -1, 1, -1, -1, 3, -1, -1, -1, 1, -1], drums: 'heart', lead: [[0, 74, 6], [8, 75, 4], [12, 74, 4], [16, 70, 8], [28, 69, 4]] },
    trip: { bpm: 84, chords: [[50, 54, 57, 61], [52, 56, 59, 62], [50, 54, 57, 61], [49, 52, 56, 59]], scale: [62, 64, 66, 68, 69, 71, 73, 74, 76],
      arp: [0, 2, 4, 6, 1, 3, 5, 7, 2, 4, 6, 8, 3, 5, 7, 4], drums: 'trip', lead: [[0, 76, 3], [3, 73, 3], [6, 74, 2], [8, 68, 8], [16, 71, 3], [19, 69, 3], [22, 66, 2], [24, 64, 8]] },
    happy: { bpm: 96, chords: [[50, 54, 57], [45, 49, 52], [47, 50, 54], [43, 47, 50]], scale: [62, 64, 66, 67, 69, 71, 73, 74],
      arp: [0, 2, 1, 3, 2, 4, 3, 5, 4, -1, 3, 2, 1, -1, 0, 2], drums: 'calm', lead: [[0, 74, 2], [2, 73, 2], [4, 71, 4], [8, 69, 4], [12, 71, 4], [16, 73, 2], [18, 71, 2], [20, 69, 4], [24, 66, 8]] },
  };
  MOODS.title = MOODS.calm;
  let mood = null, cur = null, step = 0, nextT = 0, timer = null;
  function schedule(st, t) {
    const M = cur, bar = Math.floor(st / 16), s = st % 16, sd = 60 / M.bpm / 4;
    const chord = M.chords[bar % M.chords.length];
    const section = Math.floor(bar / 8) % 2; // A (sparser) / B (fuller): the track grows and breathes
    if (s === 0) { pad(t, chord.map((n) => n + 12), sd * 16, (section ? 1 : 0.8) * (M === MOODS.tense ? 1.9 : 1)); bass(t, chord[0] - 12, sd * 6, 1); }
    if (s === 10 && M !== MOODS.tense) bass(t, chord[0] - 12 + (bar % 2 ? 7 : 0), sd * 4, 0.7);
    // arpeggio over the scale, nudged towards the chord
    const a = M.arp[s];
    if (a >= 0 && (section || s % 2 === 0 || M === MOODS.trip) && !(busy() && s % 2)) {
      const sc = M.scale, idx = (a + (bar % 4 === 3 ? 2 : 0)) % sc.length;
      pluck(t, sc[idx] + (bar % 8 >= 6 && s > 8 ? 12 : 0), s % 4 === 0 ? 1 : 0.65, M === MOODS.trip ? 4500 : 3000);
    }
    // lead phrase in every second 4-bar block
    if (Math.floor(bar / 4) % 2 === 1) {
      const pos = (bar % 2) * 16 + s;
      M.lead.forEach(([p, n, len]) => { if (p === pos) lead(t, n, sd * len, M === MOODS.tense ? 1.5 : 1); });
    }
    // percussion
    const d = M.drums;
    if (d === 'calm') {
      if (s === 0 || s === 8) kick(t, 1);
      if (s === 6 || s === 14) darbuka(t, 0.9, false);
      if (s === 3 || s === 11 || (section && (s === 7 || s === 15))) darbuka(t, 0.6, true);
      if ((section || s % 2 === 0) && !busy()) shaker(t, s % 4 === 2 ? 1 : 0.55);
      if (bar % 8 === 7 && s >= 12) darbuka(t, 0.5 + (s - 12) * 0.12, true);
    } else if (d === 'heart') {
      if (s === 0 || s === 3) kick(t, s ? 0.6 : 0.9);
      if (bar % 4 === 3 && s === 12) darbuka(t, 0.5, false);
    } else if (d === 'trip') {
      if (s === 0 || s === 10) kick(t, 0.8);
      if (s % 4 === 2) shaker(t, 0.8);
      if (s === 4 || s === 12) darbuka(t, 0.7, true);
      if (bar % 4 === 3 && s === 0) swell(t, sd * 16, 1);
    }
  }
  function tick() {
    if (!ac || !cur) return;
    if (ac.state !== 'running') { if (Date.now() - lastTry > 2000) { lastTry = Date.now(); try { ac.resume(); } catch (e) { /* needs a tap */ } } return; }
    if (nextT < ac.currentTime + 0.02) nextT = ac.currentTime + 0.08; // fell behind (busy screen, hidden tab): restart cleanly, never in the past
    while (nextT < ac.currentTime + 0.4) {
      schedule(step, nextT);
      nextT += 60 / cur.bpm / 4; step++;
      if (step % 16 === 0 && pending !== undefined) { cur = pending ? MOODS[pending] : null; step = 0; pending = undefined; setMoodFx(); if (!cur) break; }
    }
  }
  let pending, lastTry = 0;
  function setMoodFx() {
    if (!ac) return;
    const t = ac.currentTime, trip = cur === MOODS.trip;
    phWet.gain.setTargetAtTime(trip ? 0.8 : 0, t, 0.5);
    lfo.frequency.setTargetAtTime(trip ? 0.35 : 0.18, t, 0.5);
    if (cur) K.__delay.delayTime.setTargetAtTime((60 / cur.bpm) * 0.75, t, 0.2);
  }
  function start() {
    if (!timer) timer = setInterval(tick, 50);
  }
  // the browser may pause audio (another sound, a call, the screen off): any tap or coming back resumes it
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('pointerdown', () => { if (ac && ac.state !== 'running') { try { ac.resume(); } catch (e) { /* ignore */ } } }, true);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && ac) { try { ac.resume(); } catch (e) { /* ignore */ } nextT = 0; } });
  }
  K.MUSIC = {
    set(m) {
      if (m === mood) return;
      mood = m;
      if (!cur) { cur = m ? MOODS[m] || MOODS.calm : null; step = 0; nextT = 0; setMoodFx(); }
      else pending = m ? (MOODS[m] ? m : 'calm') : null; // change at the next bar line, so the music never stumbles
      start();
    },
    refresh() { ctx(); applyVolumes(); },
    unlock() { ctx(); start(); },
  };
})(window.K = window.K || {});
