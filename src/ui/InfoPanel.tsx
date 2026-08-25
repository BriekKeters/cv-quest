import {
  PROFILE,
  PROJECTS,
  QUESTS,
  SECONDARY_SKILLS,
  SKILLS,
  UI,
  type QuestKind,
} from '../data/cv'
import { ZONES } from '../game/zones'
import { useGame } from '../state/store'

const KIND_STYLES: Record<QuestKind, string> = {
  main: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
  training: 'bg-sky-400/15 text-sky-300 border-sky-400/40',
  side: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40',
}

function SkillBars() {
  return (
    <div className="space-y-3">
      {SKILLS.map((s) => (
        <div key={s.name}>
          <div className="mb-1 flex items-baseline justify-between text-sm">
            <span className="font-semibold text-slate-100">{s.name}</span>
            <span className="text-xs font-bold text-gold">{s.level}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-amber-500 to-gold-soft"
              style={{ width: `${s.level}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function InfoPanel() {
  const lang = useGame((s) => s.lang)
  const activeZone = useGame((s) => s.activeZone)
  const closeZone = useGame((s) => s.closeZone)
  const visited = useGame((s) => s.visited)

  if (!activeZone) return null
  const quest = QUESTS.find((q) => q.id === activeZone)
  const allFound = visited.length >= ZONES.length

  return (
    <div
      className="animate-fade-in fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={closeZone}
    >
      <div
        className="rpg-panel animate-rise-in w-full max-w-lg rounded-2xl p-6 text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {quest ? (
          <>
            <div className="mb-3 flex items-start justify-between gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${KIND_STYLES[quest.kind]}`}
              >
                {UI.questKind[quest.kind][lang]}
              </span>
              <button
                onClick={closeZone}
                aria-label={UI.close[lang]}
                className="cursor-pointer rounded-lg px-2 py-0.5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{quest.title[lang]}</h2>
            {(quest.org || quest.place) && (
              <p className="mt-1 text-sm font-semibold text-gold">
                {[quest.org, quest.place].filter(Boolean).join(' · ')}
              </p>
            )}
            <p className="text-xs text-slate-400">{quest.period[lang]}</p>
            <p className="mt-3 text-sm text-gold-soft/90 italic">“{quest.flavor[lang]}”</p>
            <ul className="mt-4 space-y-2">
              {quest.bullets[lang].map((b) => (
                <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-slate-200">
                  <span className="mt-0.5 text-gold">◆</span>
                  {b}
                </li>
              ))}
            </ul>
          </>
        ) : activeZone === 'projects' ? (
          <>
            <div className="mb-3 flex items-start justify-between gap-3">
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-bold tracking-wide text-amber-300 uppercase">
                {UI.projects[lang]}
              </span>
              <button
                onClick={closeZone}
                aria-label={UI.close[lang]}
                className="cursor-pointer rounded-lg px-2 py-0.5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{UI.projects[lang]}</h2>
            <p className="mt-2 mb-4 text-sm text-gold-soft/90 italic">
              “{UI.projectsFlavor[lang]}”
            </p>
            <div className="space-y-3">
              {PROJECTS.map((p) => {
                const content = (
                  <>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="flex flex-wrap items-baseline gap-2">
                        <h3 className="text-base font-bold text-white">{p.name}</h3>
                        {p.status && (
                          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-300 uppercase">
                            {p.status[lang]}
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-semibold whitespace-nowrap text-gold">
                        {p.url
                          ? `${(p.linkLabel ?? UI.visit)[lang]} ↗`
                          : `📍 ${UI.youAreHere[lang]}`}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{p.desc[lang]}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                )
                const cardClass =
                  'block rounded-xl border border-white/10 bg-white/5 p-4 transition'
                return p.url ? (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cardClass} hover:border-gold/40 hover:bg-white/10`}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={p.name} className={cardClass}>
                    {content}
                  </div>
                )
              })}
            </div>
          </>
        ) : activeZone === 'skills' ? (
          <>
            <div className="mb-3 flex items-start justify-between gap-3">
              <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold tracking-wide text-gold uppercase">
                Skill tree
              </span>
              <button
                onClick={closeZone}
                aria-label={UI.close[lang]}
                className="cursor-pointer rounded-lg px-2 py-0.5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{UI.skills[lang]}</h2>
            <p className="mt-2 mb-4 text-sm text-gold-soft/90 italic">“{UI.skillsFlavor[lang]}”</p>
            <SkillBars />
            <p className="mt-5 mb-2 text-xs font-bold tracking-wide text-slate-400 uppercase">
              {UI.alsoWieldedOnQuests[lang]}
            </p>
            <div className="flex flex-wrap gap-2">
              {SECONDARY_SKILLS.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-3 flex items-start justify-between gap-3">
              <span className="rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1 text-[11px] font-bold tracking-wide text-orange-300 uppercase">
                {UI.contactTitle[lang]}
              </span>
              <button
                onClick={closeZone}
                aria-label={UI.close[lang]}
                className="cursor-pointer rounded-lg px-2 py-0.5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">{PROFILE.name}</h2>
            <p className="mt-2 text-sm text-gold-soft/90 italic">“{UI.contactFlavor[lang]}”</p>
            <div className="mt-4 space-y-2.5 text-sm">
              <a
                href={`mailto:${PROFILE.email}`}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 transition hover:border-gold/40 hover:bg-white/10"
              >
                ✉️ {PROFILE.email}
              </a>
              <a
                href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 transition hover:border-gold/40 hover:bg-white/10"
              >
                📞 {PROFILE.phone}
              </a>
              <p className="flex items-center gap-3 px-4 py-1 text-slate-300">
                📍 {PROFILE.location[lang]}
              </p>
            </div>
          </>
        )}

        {allFound && (
          <p className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-center text-xs font-bold text-emerald-300">
            🏆 {UI.allFound[lang]}
          </p>
        )}
      </div>
    </div>
  )
}
