import { create } from 'zustand'
import type { Lang, ZoneId } from '../data/cv'
import { track } from '../analytics'

interface GameState {
  lang: Lang
  screen: 'intro' | 'world'
  sheetOpen: boolean
  cvOpen: boolean
  nearZone: ZoneId | null
  activeZone: ZoneId | null
  visited: ZoneId[]
  isTouch: boolean
  setLang: (lang: Lang) => void
  enterWorld: () => void
  setSheetOpen: (open: boolean) => void
  setCvOpen: (open: boolean) => void
  setNearZone: (id: ZoneId | null) => void
  openZone: (id: ZoneId) => void
  closeZone: () => void
}

export const useGame = create<GameState>((set) => ({
  lang: 'nl',
  screen: 'intro',
  sheetOpen: false,
  cvOpen: false,
  nearZone: null,
  activeZone: null,
  visited: [],
  isTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  setLang: (lang) => set({ lang }),
  enterWorld: () => {
    track('enter-world')
    set({ screen: 'world', sheetOpen: false, cvOpen: false })
  },
  setSheetOpen: (sheetOpen) => {
    if (sheetOpen) track('open-character-sheet')
    set({ sheetOpen })
  },
  setCvOpen: (cvOpen) => {
    if (cvOpen) track('open-plain-cv')
    set({ cvOpen })
  },
  setNearZone: (nearZone) => set({ nearZone }),
  openZone: (id) => {
    track(`zone-${id}`)
    set((s) => ({
      activeZone: id,
      visited: s.visited.includes(id) ? s.visited : [...s.visited, id],
    }))
  },
  closeZone: () => set({ activeZone: null }),
}))

if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__game = useGame
}
