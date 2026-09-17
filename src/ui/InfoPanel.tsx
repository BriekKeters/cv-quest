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
import { track, trackProject } from '../analytics'

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

  let badge: { label: string; className: string }
  let body: React.ReactNode

  if (quest) {
    badge = { label: UI.questKind[quest.kind][lang], className: KIND_STYLES[quest.kind] }
    body = (
      <>
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
    )
  } else if (activeZone === 'projects') {
    badge = {
      label: UI.projects[lang],
      className: 'bg-amber-400/10 text-amber-300 border-amber-400/40',
    }
    body = (
      <>
        <h2 className="font-display text-2xl font-bold text-white">{UI.projects[lang]}</h2>
        <p className="mt-2 mb-4 text-sm text-gold-soft/90 italic">“{UI.projectsFlavor[lang]}”</p>
        <div className="space-y-2.5">
          {PROJECTS.map((p) => {
            const content = (
              <>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    {p.status && (
                      <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-300 uppercase">
                        {p.status[lang]}
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-semibold whitespace-nowrap text-gold">
                    {p.url ? `${(p.linkLabel ?? UI.visit)[lang]} ↗` : `📍 ${UI.youAreHere[lang]}`}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{p.desc[lang]}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
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
            const cardClass = 'block rounded-xl border border-white/10 bg-white/5 p-3.5 transition'
            return p.url ? (
              <a
                key={p.name}
                href={p.url}
                onClick={() => trackProject(p.name)}
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
    )
  } else if (activeZone === 'skills') {
    badge = { label: 'Skill tree', className: 'bg-gold/10 text-gold border-gold/40' }
    body = (
      <>
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
    )
  } else {
    badge = {
      label: UI.contactTitle[lang],
      className: 'bg-orange-400/10 text-orange-300 border-orange-400/40',
    }
    body = (
      <>
        <h2 className="font-display text-2xl font-bold text-white">{PROFILE.name}</h2>
        <p className="mt-2 text-sm text-gold-soft/90 italic">“{UI.contactFlavor[lang]}”</p>
        <div className="mt-4 space-y-2.5 text-sm">
          <a
            href={`mailto:${PROFILE.email}`}
            onClick={() => track('contact-email')}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 transition hover:border-gold/40 hover:bg-white/10"
          >
            ✉️ {PROFILE.email}
          </a>
          <a
            href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}
            onClick={() => track('contact-phone')}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 transition hover:border-gold/40 hover:bg-white/10"
          >
            📞 {PROFILE.phone}
          </a>
          <p className="flex items-center gap-3 px-4 py-1 text-slate-300">
            📍 {PROFILE.location[lang]}
          </p>
        </div>
      </>
    )
  }

  return (
    <div
      className="animate-fade-in fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-3 sm:items-center sm:p-4"
      onClick={closeZone}
    >
      <div
        className="rpg-panel animate-rise-in flex w-full max-w-lg flex-col overflow-hidden rounded-2xl text-slate-100 shadow-2xl max-h-[88vh] supports-[height:100dvh]:max-h-[88dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header stays put so the close button is always reachable */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 py-3.5 sm:px-6">
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${badge.className}`}
          >
            {badge.label}
          </span>
          <button
            onClick={closeZone}
            aria-label={UI.close[lang]}
            className="-my-2 -mr-2.5 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-lg leading-none text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
          {body}
          {allFound && (
            <p className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-center text-xs font-bold text-emerald-300">
              🏆 {UI.allFound[lang]}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
