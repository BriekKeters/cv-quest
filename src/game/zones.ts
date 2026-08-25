import type { ZoneId } from '../data/cv'

export interface ZoneDef {
  id: ZoneId
  x: number
  z: number
  color: string
}

export const ISLAND_RADIUS = 48
export const WALK_RADIUS = 43
export const INTERACT_RADIUS = 6.5

// Zones arranged roughly chronologically along a loop:
// Howest (start) -> Ghent -> FOD -> Elmos -> Liantis (current), with side areas.
export const ZONES: ZoneDef[] = [
  { id: 'howest', x: -30, z: 6, color: '#22d3ee' },
  { id: 'ghent', x: -32, z: -12, color: '#818cf8' },
  { id: 'fod', x: -16, z: -26, color: '#94a3b8' },
  { id: 'elmos', x: 10, z: -30, color: '#a78bfa' },
  { id: 'liantis', x: 30, z: -8, color: '#38bdf8' },
  { id: 'vives', x: 22, z: 20, color: '#f87171' },
  { id: 'studio', x: 2, z: -8, color: '#f472b6' },
  { id: 'projects', x: -22, z: 24, color: '#fbbf24' },
  { id: 'skills', x: -4, z: 28, color: '#4ade80' },
  { id: 'contact', x: 9, z: 3, color: '#fb923c' },
]

export const SPAWN = { x: 0, z: 14 }

export interface Collider {
  x: number
  z: number
  r: number
}

// Deterministic PRNG so the decorative layout is stable between reloads.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)

function farFromZones(x: number, z: number, minDist: number) {
  if (Math.hypot(x - SPAWN.x, z - SPAWN.z) < minDist) return false
  return ZONES.every((zone) => Math.hypot(x - zone.x, z - zone.z) >= minDist)
}

function scatter(count: number, minDist: number, maxR: number) {
  const out: { x: number; z: number; s: number; v: number }[] = []
  let guard = 0
  while (out.length < count && guard < 1000) {
    guard++
    const angle = rand() * Math.PI * 2
    const radius = 8 + rand() * (maxR - 8)
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    if (!farFromZones(x, z, minDist)) continue
    if (out.some((o) => Math.hypot(o.x - x, o.z - z) < 4)) continue
    out.push({ x, z, s: 0.8 + rand() * 0.7, v: rand() })
  }
  return out
}

export const TREES = scatter(22, 8.5, WALK_RADIUS - 2)
export const ROCKS = scatter(10, 8, WALK_RADIUS - 1)

// Stepping-stone paths: the chronological career route plus side spurs.
const SEGMENTS: [[number, number], [number, number]][] = [
  [[SPAWN.x, SPAWN.z], [-30, 6]], // spawn -> howest
  [[-30, 6], [-32, -12]], // howest -> ghent
  [[-32, -12], [-16, -26]], // ghent -> fod
  [[-16, -26], [10, -30]], // fod -> elmos
  [[10, -30], [30, -8]], // elmos -> liantis
  [[30, -8], [22, 20]], // liantis -> vives
  [[22, 20], [-4, 28]], // vives -> skills
  [[-4, 28], [SPAWN.x, SPAWN.z]], // skills -> spawn
  [[-4, 28], [-22, 24]], // skills -> projects
  [[SPAWN.x, SPAWN.z], [2, -8]], // spawn -> studio
]

export const PATH_DOTS: { x: number; z: number; s: number }[] = []
for (let i = 0; i < SEGMENTS.length; i++) {
  const [[ax, az], [bx, bz]] = SEGMENTS[i]
  const dist = Math.hypot(bx - ax, bz - az)
  const steps = Math.floor(dist / 2.4)
  for (let s = 1; s < steps; s++) {
    const t = s / steps
    const x = ax + (bx - ax) * t + (rand() - 0.5) * 0.9
    const z = az + (bz - az) * t + (rand() - 0.5) * 0.9
    if (farFromZones(x, z, 5.4)) PATH_DOTS.push({ x, z, s: 0.5 + rand() * 0.35 })
  }
}

export const COLLIDERS: Collider[] = [
  // zone buildings (player can approach but not walk through)
  ...ZONES.filter((z) => z.id !== 'contact').map((z) => ({ x: z.x, z: z.z, r: 3.0 })),
  { x: 9, z: 3, r: 0.9 }, // mailbox
  ...TREES.map((t) => ({ x: t.x, z: t.z, r: 1.1 * t.s })),
  ...ROCKS.map((r) => ({ x: r.x, z: r.z, r: 0.9 * r.s })),
]
