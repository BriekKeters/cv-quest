import { useGame } from '../state/store'

export function LangToggle() {
  const lang = useGame((s) => s.lang)
  const setLang = useGame((s) => s.setLang)
  return (
    <div className="rpg-panel flex overflow-hidden rounded-lg text-xs font-bold">
      {(['nl', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`cursor-pointer px-3 py-1.5 uppercase transition ${
            lang === l ? 'bg-gold text-ink' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
