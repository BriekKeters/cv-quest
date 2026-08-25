import { lazy, Suspense, useEffect } from 'react'
import { bindKeyboard } from './game/input'
import { useGame } from './state/store'
import { Intro } from './ui/Intro'
import { Hud } from './ui/Hud'
import { InfoPanel } from './ui/InfoPanel'
import { CharacterSheet } from './ui/CharacterSheet'
import { PlainCV } from './ui/PlainCV'

const WorldCanvas = lazy(() => import('./game/WorldCanvas'))

export default function App() {
  const screen = useGame((s) => s.screen)
  const sheetOpen = useGame((s) => s.sheetOpen)
  const cvOpen = useGame((s) => s.cvOpen)
  const activeZone = useGame((s) => s.activeZone)

  useEffect(() => {
    // fetch the 3D chunk in the background while the intro is showing
    import('./game/WorldCanvas')
    const unbind = bindKeyboard()
    const onKey = (e: KeyboardEvent) => {
      const s = useGame.getState()
      if (e.code === 'Escape') {
        if (s.cvOpen) s.setCvOpen(false)
        else if (s.sheetOpen) s.setSheetOpen(false)
        else if (s.activeZone) s.closeZone()
        return
      }
      if (s.cvOpen) return
      if (e.code === 'KeyC' && s.screen === 'world') {
        s.setSheetOpen(!s.sheetOpen)
        return
      }
      if (
        (e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') &&
        s.screen === 'world' &&
        !s.sheetOpen
      ) {
        if (s.activeZone) s.closeZone()
        else if (s.nearZone) s.openZone(s.nearZone)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      unbind()
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
      {screen === 'world' && (
        <div className="animate-fade-in fixed inset-0 bg-ink">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <p className="animate-pulse text-sm font-semibold text-gold">
                  ⚔️ Loading…
                </p>
              </div>
            }
          >
            <WorldCanvas />
          </Suspense>
        </div>
      )}
      {screen === 'world' && <Hud />}
      {activeZone && <InfoPanel />}
      {sheetOpen && <CharacterSheet />}
      {screen === 'intro' && <Intro />}
      {cvOpen && <PlainCV />}
    </>
  )
}
