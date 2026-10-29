# Kan du det?!

A bizarre, loud vocabulary game for learning Danish, built on *Danish to Go 2*, chapter 3, sections 2 and 3 (clothes, colours, prices, adjective endings, the definite form, reactions).

**Play:** https://brunorutyna.github.io/kan-du-det/ (made for a phone, works in any browser)

- About an hour per run, about ten mini-games with short comic panels in between, four endings.
- Tap any Danish word to see what it means. Long-press a word inside a button to do the same.
- Sound, music and the Danish voice are on by default; switch them in *Indstillinger*.
- Mini-games you have met can be replayed alone from *Mini-spil* for a better rank.

## For development
- `node tools/speech.js` lists every voiced line; `GOOGLE_TTS_KEYFILE=… python3 tools/voices.py` renders the missing ones (Google Chirp 3 HD, da-DK). The key is never committed.
- `node tools/lint.js` checks glosses, references, grammar samples and the version stamp.
- `node tools/playtest.js --runs 2 [--shots dir]` plays the whole game on a phone-sized screen.
- `tools/bump.sh` before every push.

Art: original characters made with Google Gemini image generation. Music: composed in code (WebAudio).
