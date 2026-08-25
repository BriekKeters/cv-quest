import { PROFILE, UI } from '../data/cv'
import { useGame } from '../state/store'
import { LangToggle } from './LangToggle'

export function Intro() {
  const lang = useGame((s) => s.lang)
  const enterWorld = useGame((s) => s.enterWorld)
  const setSheetOpen = useGame((s) => s.setSheetOpen)
  const setCvOpen = useGame((s) => s.setCvOpen)
  const isTouch = useGame((s) => s.isTouch)

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-[radial-gradient(ellipse_at_50%_35%,#1b2947_0%,#0b1020_70%)] px-6 py-10 text-slate-100">
      <div className="absolute top-4 right-4">
        <LangToggle />
      </div>

      <div className="animate-rise-in flex max-w-xl flex-col items-center text-center">
        {/* crest */}
        <div className="animate-float mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-gold/40 bg-panel shadow-[0_0_40px_rgba(224,180,88,0.25)]">
          <span className="font-display text-3xl font-bold text-gold">BK</span>
        </div>

        <p className="mb-2 text-xs font-semibold tracking-[0.35em] text-gold-soft/80 uppercase">
          {lang === 'nl' ? 'Interactieve CV' : 'Interactive CV'}
        </p>
        <h1 className="font-display text-4xl font-black tracking-wide text-white sm:text-6xl">
          {PROFILE.name}
        </h1>
        <p className="mt-3 text-base font-semibold text-gold sm:text-lg">
          {PROFILE.tagline[lang]}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          {PROFILE.blurb[lang]}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={enterWorld}
            className="cursor-pointer rounded-xl bg-gold px-8 py-3.5 text-base font-bold text-ink shadow-[0_10px_30px_rgba(224,180,88,0.35)] transition hover:scale-105 hover:bg-gold-soft active:scale-95"
          >
            ▶ {UI.enterWorld[lang]}
          </button>
          <button
            onClick={() => setSheetOpen(true)}
            className="cursor-pointer rounded-xl border border-gold/40 bg-white/5 px-6 py-3.5 text-base font-semibold text-slate-100 transition hover:bg-white/10 active:scale-95"
          >
            {UI.characterSheet[lang]}
          </button>
          <button
            onClick={() => setCvOpen(true)}
            className="cursor-pointer rounded-xl border border-white/15 bg-transparent px-6 py-3.5 text-base font-semibold text-slate-300 transition hover:bg-white/5 active:scale-95"
          >
            {UI.plainCv[lang]}
          </button>
        </div>

        <p className="mt-10 text-xs text-slate-400">
          {isTouch ? UI.mobileHint[lang] : UI.controlsHint[lang]}
        </p>
        <p className="mt-2 text-[11px] text-slate-500">{UI.madeWith[lang]}</p>
      </div>
    </div>
  )
}
