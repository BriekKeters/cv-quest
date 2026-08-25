# cv-quest — Briek Keters' Interactive CV

**Play it live: [briekketers.github.io/cv-quest](https://briekketers.github.io/cv-quest/)**

My CV as a tiny open-world game: a low-poly island you walk around in, where every
zone is a chapter of my career. Built to show — not just tell — what a front-end
developer with a game-dev background (Howest DAE) can do.

## The world

- **Howest — DAE arcade** · where the developer class was chosen (2018–2021)
- **Ghent tower** · a year of industrial engineering in informatics (2021–2022)
- **FOD Financiën** · the government dungeon, with Docker crates and a RabbitMQ rabbit (2022–2023)
- **ElmosExpert** · the training arc: Angular & .NET (2023–2024)
- **Liantis IT** · the current main quest (2024–now)
- **Vives tent** · side quest: multiclassing into Healer (nursing, 2025–now)
- **Studio** · the photo/video + app-dev side hustle
- **Projects workshop** · Cull, FirstTakes (social 5-second video app, in development) and briekketers.com, with links
- **Skill Tree** · stats and skills
- **Mailbox** · contact

Plus an RPG **character sheet** overlay and a printable **plain CV** for recruiters
who just want the facts. Fully bilingual (NL/EN).

## Controls

- **Walk**: WASD / arrow keys (ZQSD works on AZERTY) · touch joystick on mobile
- **Inspect**: E (or tap the prompt)
- **Character sheet**: C
- **Close**: Esc

## Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev)
- [Three.js](https://threejs.org) via [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei)
- [Tailwind CSS 4](https://tailwindcss.com) · [zustand](https://github.com/pmndrs/zustand)
- All 3D is procedural primitives — no external models, no asset pipeline

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The three.js world is code-split: the intro screen ships ~70 kB gzipped and the 3D
chunk streams in behind it.
