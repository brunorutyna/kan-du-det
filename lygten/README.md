# Lygten

A short roguelike walk across the dunes for practising Danish vocabulary from *Danish to Go 2*, chapter 3, sections 2 and 3 (clothes, colours, patterns, adjective endings, furniture, the definite form).

**Play:** https://brunorutyna.github.io/kan-du-det/lygten/ (also from the *Kan du det?!* start screen). Made for a phone, works in any browser.

- Pick your path one spot at a time. Every step costs water.
- Name the things you dig up correctly and they go into your bag; some of them make the walk cheaper.
- A lantern offers water at night, for a word. Read every sign carefully.
- No dice, no timer. About 20–25 minutes a run, four endings.
- Tap any Danish word to see what it means.

Prototype art (shapes and emoji). Built on [dansk-kit](https://github.com/brunorutyna/dansk-kit).

## For development
- `node tools/lint.js`: glosses, content checks (lies are really wrong, riddles, signs), religion/timer word block.
- `node tools/playtest.js --runs 2`: plays the whole game on a phone-sized screen. `node tools/trace.js . right|wrong` prints each screen and the run state.
- `sh tools/bump.sh` before every push.
