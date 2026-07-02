# VASANAM

Oru small typing test, but Tanglish vibe la. 25 original dialogue lines (mostly mass punch dialogues), you type, we time you, WPM kudukurom, and konjam meme um kudukurom based on how fast/slow you typed. Login venam, leaderboard drama venam. Type pannu, results paaru, next scene ku po.

## Enna irukku indha app-la

- Typing test with live timer + WPM
- Ovvoru dialogue-layum konjam highlight words irukku — andha word mela hover pannina oru meme preview varum (`web/public/dialogues.json` la irukku andha data)
- History panel — munnadi eppadi type pannirukka nu paakalam (browser-la localStorage la save aagum, backend edhuvum illa)
- Old-school film-reel look, sprocket holes um grain effect um sethu vachurukom
- `web/` folder la irukkura andha app dhaan latest one — React + Vite + Tailwind vechu build panniruken

## Two versions irukku indha repo la

- `frontend/` — original vanilla HTML/CSS/JS version, build step edhuvum venam, `index.html`-a open pannina podhum
- `web/` — puthu React + Tailwind + shadcn-style version, hover previews, texture buttons, film-reel UI ellam idhula dhaan

## Eppadi run pannuradhu (`web/`)

```bash
cd web
npm install
npm run dev
```

Adhu terminal la kaatura localhost link-a open pannunga, browser la app varum.

Production build venumna:

```bash
npm run build
npm run preview
```

## Konjam TODO items (yaaru venaalum help pannalam)

- `web/public/dialogues.json` la irukkura `podu.pics/placeholder/...` image links ellam placeholder dhaan — real meme links vecha nalla irukum
- `web/index.html` la Umami Analytics script placeholder-a vachurukom — ungaloda `data-website-id` and script `src` update pannunga
- WPM calculation ippo correct-a irukku (correct characters / 5, divided by minutes — typing test industry standard), aana backspace pannina double-count aagura oru old bug fix pannirukom already

## License

GNU GPL v3.0 — `LICENSE` file paarunga. Free software, thaaraala maathunga, share pannunga, credit kudunga podhum.

## Contributing

`CONTRIBUTING.md` paarunga, simple steps thaan. Upcoming features and planned work — `PIPELINE.md` paarunga.

## Content Disclaimer

All dialogues, audio, and associated media featured in VASANAM.PRO are the intellectual property of their respective producers, studios, and creative artists. This project is a non-commercial fan tribute and makes no claim of ownership over any of the source material.

---

Built for TanglishCaptions' anniversary. Vera reels vera naal varum.
