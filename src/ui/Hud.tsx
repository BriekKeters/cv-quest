import { useRef, useState } from 'react'
import { PROFILE, UI, ZONE_LABELS } from '../data/cv'
import { ZONES } from '../game/zones'
import { input } from '../game/input'
import { useGame } from '../state/store'
import { LangToggle } from './LangToggle'

function Joystick() {
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const activeId = useRef<number | null>(null)

  const update = (clientX: number, clientY: number) => {
    const el = base.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = clientX - cx
    let dy = clientY - cy
    const max = rect.width / 2 - 18
    const len = Math.hypot(dx, dy)
    if (len > max) {
      dx = (dx / len) * max
      dy = (dy / len) * max
    }
    setKnob({ x: dx, y: dy })
    input.joyX = dx / max
    input.joyZ = dy / max
  }

  const release = () => {
    activeId.current = null
    setKnob({ x: 0, y: 0 })
    input.joyX = 0
    input.joyZ = 0
  }

  return (
    <div
      ref={base}
      className="pointer-events-auto relative h-32 w-32 touch-none rounded-full border-2 border-white/25 bg-black/25 backdrop-blur-sm"
      onPointerDown={(e) => {
        activeId.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => {
        if (activeId.current === e.pointerId) update(e.clientX, e.clientY)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      <div
        className="absolute top-1/2 left-1/2 h-14 w-14 rounded-full border border-white/40 bg-white/30"
        style={{
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  )
}

export function Hud() {
  const lang = useGame((s) => s.lang)
  const nearZone = useGame((s) => s.nearZone)
  const activeZone = useGame((s) => s.activeZone)
  const visited = useGame((s) => s.visited)
  const isTouch = useGame((s) => s.isTouch)
  const openZone = useGame((s) => s.openZone)
  const setSheetOpen = useGame((s) => s.setSheetOpen)
  const setCvOpen = useGame((s) => s.setCvOpen)

  const total = ZONES.length
  const found = visited.length
  const showPrompt = nearZone !== null && activeZone === null

  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {/* vignette */}
      <div className="vignette absolute inset-0" />

      {/* top bar: player chip + actions (wraps on narrow screens) */}
      <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:p-4">
        <div className="rpg-panel pointer-events-auto flex items-center gap-3 rounded-xl px-3.5 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 font-display text-sm font-bold text-gold">
            {PROFILE.initials}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white">{PROFILE.name}</p>
            <p className="text-[11px] text-slate-300">
              Lv. 4 {PROFILE.role[lang]} ·{' '}
              <span className={found === total ? 'font-semibold text-emerald-400' : 'text-gold'}>
                🗺 {found}/{total} {UI.questsFound[lang]}
              </span>
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setSheetOpen(true)}
            className="rpg-panel cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold text-slate-100 transition hover:bg-white/10"
          >
            {UI.characterSheet[lang]}
            {!isTouch && (
              <span className="ml-1.5 rounded bg-white/15 px-1.5 py-0.5 text-[10px]">C</span>
            )}
          </button>
          <button
            onClick={() => setCvOpen(true)}
            className="rpg-panel cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
          >
            {UI.plainCv[lang]}
          </button>
          <LangToggle />
        </div>
      </div>

      {/* interact prompt */}
      {showPrompt && nearZone && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 sm:bottom-10">
          {isTouch ? (
            <button
              onClick={() => openZone(nearZone)}
              className="rpg-panel animate-rise-in pointer-events-auto cursor-pointer rounded-xl border-gold/60 px-6 py-3 text-sm font-bold text-gold"
            >
              ✦ {ZONE_LABELS[nearZone].name} — {UI.inspect[lang]}
            </button>
          ) : (
            <div className="rpg-panel animate-rise-in rounded-xl px-5 py-3 text-sm font-semibold text-slate-100">
              ✦ {ZONE_LABELS[nearZone].name} ·{' '}
              <span className="text-slate-300">{UI.pressKey[lang]}</span>{' '}
              <span className="mx-0.5 rounded-md bg-gold px-2 py-0.5 font-bold text-ink">E</span>
            </div>
          )}
        </div>
      )}

      {/* bottom-left: joystick on touch devices */}
      {isTouch && (
        <div className="absolute bottom-6 left-6">
          <Joystick />
        </div>
      )}

      {/* bottom hint (desktop) */}
      {!isTouch && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-white/45">
          {UI.controlsHint[lang]}
        </p>
      )}
    </div>
  )
}
