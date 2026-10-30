# Tørlagt

A strange little story for practising Danish from *Danish to Go 2*, chapter 3, sections 2 and 3 (clothes, colours, adjective endings, *Sikke …!*, furniture, the definite form, reactions, *for* + adjective).

**Play:** https://brunorutyna.github.io/kan-du-det/ (made for a phone, works in any browser)

You are a sponge, delivered to a rehab camp in the middle of a desert to dry out. Every chapter starts with a short lesson from one of the creatures, then the story uses it and a mini-game drills it. Six chapters, three offers, four endings. No dice, no timer. Tap any Danish word to see what it means. Chapters can be replayed from *Kapitler* for a better rank.

Prototype art (shapes and emoji). Built on [dansk-kit](https://github.com/brunorutyna/dansk-kit).

**Kan du det?!** (the earlier game in this repo) is now at https://brunorutyna.github.io/kan-du-det/kandudet/ .

## For development
- `node tools/lint.js`: glosses, lessons, every branch line with every flag combination, blocked words (religion, real places, timers), creatures only.
- `node tools/playtest.js --runs 2`: plays the whole game on a phone-sized screen. `node tools/trace.js right|wrong|yes` prints each screen and the flags.
- `sh tools/bump.sh` before every push.
