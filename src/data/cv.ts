export type Lang = 'nl' | 'en'
export type L<T = string> = Record<Lang, T>

export type ZoneId =
  | 'howest'
  | 'ghent'
  | 'fod'
  | 'elmos'
  | 'liantis'
  | 'vives'
  | 'studio'
  | 'projects'
  | 'skills'
  | 'contact'

export type QuestKind = 'main' | 'training' | 'side'
export type CvSection = 'work' | 'education' | 'side'

export interface Quest {
  id: ZoneId
  kind: QuestKind
  section: CvSection
  title: L
  org: string
  place: string
  period: L
  bullets: L<string[]>
  flavor: L
}

export const PROFILE = {
  name: 'Briek Keters',
  initials: 'BK',
  email: 'briek.keters@gmail.com',
  phone: '+32 492 83 86 84',
  siteUrl: 'https://briekketers.github.io/cv-quest/',
  location: { nl: 'Kortrijk, België', en: 'Kortrijk, Belgium' } as L,
  role: { nl: 'Full-Stack Developer', en: 'Full-Stack Developer' } as L,
  tagline: {
    nl: 'Level 4 Full-Stack Developer — multiclassing naar Healer',
    en: 'Level 4 Full-Stack Developer — multiclassing into Healer',
  } as L,
  blurb: {
    nl: 'Front-end developer met oog voor detail en gebruikservaring. Dit is mijn CV — gebouwd als kleine open wereld. Loop rond, ontdek de quests, of spring meteen naar de feiten.',
    en: 'Front-end developer with an eye for detail and user experience. This is my CV — built as a tiny open world. Walk around, discover the quests, or skip straight to the facts.',
  } as L,
  summary: {
    nl: 'Ervaren front-end developer met oog voor detail en gebruikservaring. Ik bouw performante, schaalbare interfaces met moderne tools zoals Angular en Tailwind, en draag actief bij aan kwaliteitsvolle, onderhoudbare code.',
    en: 'Experienced front-end developer with an eye for detail and user experience. I build performant, scalable interfaces with modern tools such as Angular and Tailwind, and actively contribute to high-quality, maintainable code.',
  } as L,
}

export const QUESTS: Quest[] = [
  {
    id: 'liantis',
    kind: 'main',
    section: 'work',
    title: { nl: 'Full-stack developer', en: 'Full-stack developer' },
    org: 'Liantis IT',
    place: 'Brugge',
    period: { nl: 'April 2024 – heden', en: 'April 2024 – present' },
    bullets: {
      nl: [
        'Reactive applicaties voor mobile én desktop.',
        'Teamwork, planning en oplossingsgericht werken in complexe projecten.',
        'Ervaring in stressvolle en deadlinegerichte werkomgevingen.',
      ],
      en: [
        'Reactive applications for both mobile and desktop.',
        'Teamwork, planning and solution-oriented work in complex projects.',
        'Comfortable in high-pressure, deadline-driven environments.',
      ],
    },
    flavor: {
      nl: 'Huidige quest — de hoofdcampagne.',
      en: 'Current quest — the main campaign.',
    },
  },
  {
    id: 'elmos',
    kind: 'main',
    section: 'work',
    title: { nl: 'Full-stack developer', en: 'Full-stack developer' },
    org: 'ElmosExpert',
    place: 'Mechelen',
    period: { nl: 'Januari 2023 – april 2024', en: 'January 2023 – April 2024' },
    bullets: {
      nl: [
        'Try-for-hire consultant bij Liantis.',
        'Extra opleiding in Angular en .NET, incl. .NET Masterclass (feb 2023).',
        'Ontwikkeling en onderhoud van interne applicaties.',
      ],
      en: [
        'Try-for-hire consultant at Liantis.',
        'Additional training in Angular and .NET, incl. .NET Masterclass (Feb 2023).',
        'Development and maintenance of internal applications.',
      ],
    },
    flavor: {
      nl: 'De trainingsarc — nieuwe skills unlocked: Angular & .NET.',
      en: 'The training arc — new skills unlocked: Angular & .NET.',
    },
  },
  {
    id: 'fod',
    kind: 'main',
    section: 'work',
    title: { nl: 'Full-stack developer', en: 'Full-stack developer' },
    org: 'FOD Financiën',
    place: 'Brussel',
    period: { nl: 'Augustus 2022 – januari 2023', en: 'August 2022 – January 2023' },
    bullets: {
      nl: [
        'Agile en Scrum workflow met Jira en Confluence.',
        'Integration en unit testing.',
        'Technologie: Spring Boot, Docker, RabbitMQ.',
      ],
      en: [
        'Agile and Scrum workflow with Jira and Confluence.',
        'Integration and unit testing.',
        'Tech stack: Spring Boot, Docker, RabbitMQ.',
      ],
    },
    flavor: {
      nl: 'De overheidsdungeon — Spring Boot, Docker & RabbitMQ overleefd.',
      en: 'The government dungeon — survived Spring Boot, Docker & RabbitMQ.',
    },
  },
  {
    id: 'studio',
    kind: 'side',
    section: 'side',
    title: {
      nl: 'Foto- & videograaf · App-developer',
      en: 'Photo & videographer · App developer',
    },
    org: '',
    place: '',
    period: { nl: 'Doorlopend', en: 'Ongoing' },
    bullets: {
      nl: [
        'Foto- en videografie met Adobe, DaVinci Resolve en OBS — portfolio op briekketers.com.',
        'WebAR in 8th Wall, o.a. voor de campagne ‘Zie Ons Doen’ van de Vlaamse overheid.',
        'Bouwt eigen apps waar beide werelden samenkomen, zoals Cull: AI-fotoculling voor Mac & iPad.',
        'Creativiteit en techniek, één skill tree.',
      ],
      en: [
        'Photography and videography with Adobe, DaVinci Resolve and OBS — portfolio at briekketers.com.',
        'WebAR in 8th Wall, including the Flemish government’s ‘Zie Ons Doen’ campaign.',
        'Builds apps where both worlds meet, like Cull: AI photo culling for Mac & iPad.',
        'Creativity and engineering, one skill tree.',
      ],
    },
    flavor: {
      nl: 'De studio — waar de camera en de code elkaar ontmoeten.',
      en: 'The studio — where the camera meets the code.',
    },
  },
  {
    id: 'vives',
    kind: 'side',
    section: 'education',
    title: {
      nl: 'Bachelor Verpleegkunde (afstandsonderwijs)',
      en: 'Bachelor of Nursing (distance learning)',
    },
    org: 'Vives',
    place: 'Kortrijk',
    period: { nl: 'September 2025 – heden', en: 'September 2025 – present' },
    bullets: {
      nl: [
        'Opleiding naast een fulltime job als developer.',
        'Bewijst discipline, planning en leergierigheid.',
        'Multiclass build: developer overdag, healer in opleiding.',
      ],
      en: [
        'Studying alongside a full-time developer job.',
        'Proof of discipline, planning and eagerness to learn.',
        'Multiclass build: developer by day, healer in training.',
      ],
    },
    flavor: {
      nl: 'Side quest — multiclass naar Healer.',
      en: 'Side quest — multiclassing into Healer.',
    },
  },
  {
    id: 'ghent',
    kind: 'training',
    section: 'education',
    title: {
      nl: 'Industrieel ingenieur informatica',
      en: 'Industrial engineering: informatics',
    },
    org: 'UGent',
    place: 'Gent',
    period: { nl: 'September 2021 – juni 2022', en: 'September 2021 – June 2022' },
    bullets: {
      nl: [
        'Een jaar industrieel ingenieur, richting informatica.',
        'Verdieping in wiskunde, elektronica en software-engineering.',
        'Bevestigde de keuze voor hands-on development.',
      ],
      en: [
        'One year of industrial engineering, informatics track.',
        'Deeper foundations in mathematics, electronics and software engineering.',
        'Confirmed the choice for hands-on development.',
      ],
    },
    flavor: {
      nl: 'Zijpad op de kaart — extra engineering-fundamenten verzameld.',
      en: 'A detour on the map — extra engineering foundations collected.',
    },
  },
  {
    id: 'howest',
    kind: 'training',
    section: 'education',
    title: {
      nl: 'Bachelor Digital Arts & Entertainment',
      en: 'Bachelor Digital Arts & Entertainment',
    },
    org: 'Howest',
    place: 'Kortrijk',
    period: { nl: 'September 2018 – juni 2021', en: 'September 2018 – June 2021' },
    bullets: {
      nl: [
        'Opleiding rond game development, 3D en interactieve media.',
        'Hands-on met Unreal Engine (C++ & Blueprints), Unity en Blender.',
        'Waar de liefde voor interactieve ervaringen begon — zoals deze website.',
      ],
      en: [
        'Degree programme in game development, 3D and interactive media.',
        'Hands-on with Unreal Engine (C++ & Blueprints), Unity and Blender.',
        'Where the love for interactive experiences began — including this website.',
      ],
    },
    flavor: {
      nl: 'Startgebied — hier werd de developer-klasse gekozen.',
      en: 'Starting zone — where the developer class was chosen.',
    },
  },
]

export interface Project {
  name: string
  url?: string
  linkLabel?: L
  desc: L
  tags: string[]
  status?: L
}

export const PROJECTS: Project[] = [
  {
    name: 'Interactive CV',
    url: 'https://github.com/BriekKeters/cv-quest',
    linkLabel: { nl: 'Broncode', en: 'Source code' },
    desc: {
      nl: 'Deze website zelf — een open-wereld-CV gebouwd met React, TypeScript en Three.js (React Three Fiber). Je speelt hem nu.',
      en: 'This very website — an open-world CV built with React, TypeScript and Three.js (React Three Fiber). You are playing it right now.',
    },
    tags: ['React', 'Three.js', 'TypeScript'],
  },
  {
    name: 'Zie Ons Doen — WebAR',
    url: 'https://www.bridgeneers.be/werk/vlamingen-laten-europa-schitteren',
    desc: {
      nl: 'WebAR voor de Vlaamse overheid, in de campagne rond het Belgisch EU-voorzitterschap 2024. Straatstickers met QR-code in 13 centrumsteden lieten een animatie boven het voetpad zweven — rechtstreeks in de browser, zonder app. Ik schreef de code, in 8th Wall.',
      en: 'WebAR for the Flemish government’s campaign around Belgium’s 2024 EU Council presidency. QR-coded street stickers across 13 cities made an animation float above the pavement, straight in the browser with no app. I wrote the code, in 8th Wall.',
    },
    tags: ['8th Wall', 'WebAR', 'Vlaamse overheid', '13 centrumsteden'],
  },
  {
    name: 'Cull',
    url: 'https://briekketers.github.io/cull-landing/',
    desc: {
      nl: 'AI-fotoculling voor Mac & iPad — lokale AI scoort en groepeert je foto’s, met XMP-export naar Lightroom. “Cull faster. Ship more.”',
      en: 'AI photo culling for Mac & iPad — on-device AI scores and groups your shots, with XMP export to Lightroom. “Cull faster. Ship more.”',
    },
    tags: ['Electron', 'Apple Vision AI', 'macOS & iPadOS'],
  },
  {
    name: 'FirstTakes',
    url: 'https://briekketers.github.io/firsttakes-web/',
    desc: {
      nl: 'Social-media-app om video’s van 5 seconden te delen met vrienden.',
      en: 'A social media app for sharing 5-second videos with friends.',
    },
    tags: ['Social app', 'TypeScript'],
    status: { nl: 'In ontwikkeling', en: 'In development' },
  },
  {
    name: 'briekketers.com',
    url: 'https://briekketers.com/',
    desc: {
      nl: 'Foto- en videografieportfolio — met recent werk op Instagram en YouTube.',
      en: 'Photography & videography portfolio — with recent work on Instagram and YouTube.',
    },
    tags: ['React', 'Tailwind'],
  },
]

export const SKILLS: { name: string; level: number }[] = [
  { name: 'Angular', level: 92 },
  { name: 'HTML & CSS', level: 90 },
  { name: 'JavaScript / TypeScript', level: 88 },
  { name: 'Tailwind', level: 86 },
  { name: 'Git', level: 82 },
  { name: 'React & Three.js', level: 80 },
]

export const SECONDARY_SKILLS = [
  'Unreal Engine (C++ & Blueprints)',
  'Unity / Godot',
  'Blender',
  'WebAR (8th Wall)',
  '.NET / C#',
  'Spring Boot',
  'Docker',
  'RabbitMQ',
  'Adobe Premiere & Photoshop',
  'DaVinci Resolve',
  'OBS',
  'Scrum & Agile',
  'Jira / Confluence',
]

export const TRAITS: L<string>[] = [
  { nl: 'Stressbestendig', en: 'Stress-resistant' },
  { nl: 'Verantwoordelijk', en: 'Responsible' },
  { nl: 'Leiderschap', en: 'Leadership' },
  { nl: 'Teamwork', en: 'Teamwork' },
  { nl: 'Probleemoplossend', en: 'Problem-solver' },
  { nl: 'Leergierig', en: 'Eager to learn' },
]

export const LANGUAGES: { name: L; level: L; pips: number }[] = [
  { name: { nl: 'Nederlands', en: 'Dutch' }, level: { nl: 'Moedertaal', en: 'Native' }, pips: 3 },
  { name: { nl: 'Engels', en: 'English' }, level: { nl: 'Vloeiend', en: 'Fluent' }, pips: 3 },
  { name: { nl: 'Frans', en: 'French' }, level: { nl: 'Basis', en: 'Basic' }, pips: 1 },
]

export const ZONE_LABELS: Record<ZoneId, { name: string; sub: L }> = {
  howest: { name: 'Howest — DAE', sub: { nl: '2018 – 2021', en: '2018 – 2021' } },
  ghent: { name: 'UGent', sub: { nl: '2021 – 2022', en: '2021 – 2022' } },
  fod: { name: 'FOD Financiën', sub: { nl: '2022 – 2023', en: '2022 – 2023' } },
  elmos: { name: 'ElmosExpert', sub: { nl: '2023 – 2024', en: '2023 – 2024' } },
  liantis: { name: 'Liantis IT', sub: { nl: '2024 – nu', en: '2024 – now' } },
  vives: { name: 'Vives', sub: { nl: 'Side quest', en: 'Side quest' } },
  studio: { name: 'Studio', sub: { nl: 'Side hustle', en: 'Side hustle' } },
  projects: { name: 'Projects', sub: { nl: 'Atelier', en: 'Workshop' } },
  skills: { name: 'Skill Tree', sub: { nl: 'Skills', en: 'Skills' } },
  contact: { name: 'Contact', sub: { nl: 'Stuur een bericht', en: 'Say hello' } },
}

export const UI = {
  enterWorld: { nl: 'Verken de wereld', en: 'Explore the world' },
  characterSheet: { nl: 'Character sheet', en: 'Character sheet' },
  plainCv: { nl: 'Gewone CV', en: 'Plain CV' },
  inspect: { nl: 'Bekijken', en: 'Inspect' },
  pressKey: { nl: 'Druk op', en: 'Press' },
  questsFound: { nl: 'quests ontdekt', en: 'quests discovered' },
  close: { nl: 'Sluiten', en: 'Close' },
  print: { nl: 'Print / PDF', en: 'Print / PDF' },
  back: { nl: 'Terug', en: 'Back' },
  controlsHint: {
    nl: 'WASD / pijltjes om te rondlopen · E om te bekijken · C voor character sheet',
    en: 'WASD / arrows to walk around · E to inspect · C for character sheet',
  },
  mobileHint: {
    nl: 'Gebruik de joystick om rond te lopen',
    en: 'Use the joystick to walk around',
  },
  questLog: { nl: 'Quest log', en: 'Quest log' },
  stats: { nl: 'Stats', en: 'Stats' },
  traits: { nl: 'Traits', en: 'Traits' },
  languages: { nl: 'Talen', en: 'Languages' },
  experience: { nl: 'Ervaring', en: 'Experience' },
  education: { nl: 'Opleiding', en: 'Education' },
  sideHustle: { nl: 'Side hustle', en: 'Side hustle' },
  skills: { nl: 'Skills', en: 'Skills' },
  projects: { nl: 'Projecten', en: 'Projects' },
  visit: { nl: 'Bekijk', en: 'Visit' },
  youAreHere: { nl: 'Je bent hier', en: 'You are here' },
  interactiveVersion: { nl: 'Interactieve versie', en: 'Interactive version' },
  alsoWieldedOnQuests: { nl: 'Ook gebruikt op quests', en: 'Also wielded on quests' },
  contactTitle: { nl: 'Contact', en: 'Contact' },
  contactFlavor: {
    nl: 'Stuur een raaf — of gewoon een mailtje.',
    en: 'Send a raven — or just an email.',
  },
  skillsFlavor: {
    nl: 'De skill tree — geleveld door quests, niet door grinden.',
    en: 'The skill tree — levelled through quests, not grinding.',
  },
  projectsFlavor: {
    nl: 'Het atelier — dingen die ik bouw als de werkdag erop zit.',
    en: 'The workshop — things I build after hours.',
  },
  questKind: {
    main: { nl: 'Hoofdquest', en: 'Main quest' },
    training: { nl: 'Opleiding', en: 'Training' },
    side: { nl: 'Side quest', en: 'Side quest' },
  } as Record<QuestKind, L>,
  visitedBadge: { nl: 'Quest ontdekt', en: 'Quest discovered' },
  allFound: { nl: 'Alle quests ontdekt — 100% completion!', en: 'All quests discovered — 100% completion!' },
  madeWith: {
    nl: 'Gebouwd met React Three Fiber · door Briek Keters',
    en: 'Built with React Three Fiber · by Briek Keters',
  },
} as const
