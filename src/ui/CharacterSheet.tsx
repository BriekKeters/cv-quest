import {
  LANGUAGES,
  PROFILE,
  PROJECTS,
  QUESTS,
  SECONDARY_SKILLS,
  SKILLS,
  TRAITS,
  UI,
  type QuestKind,
} from '../data/cv'
import { useGame } from '../state/store'
import { trackProject } from '../analytics'

const KIND_DOT: Record<QuestKind, string> = {
  main: 'bg-amber-400',
  training: 'bg-sky-400',
  side: 'bg-emerald-400',
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display mb-3 flex items-center gap-2 text-sm font-bold tracking-widest text-gold uppercase">
      <span className="h-px w-5 bg-gold/50" />
      {children}
    </h3>
  )
}

export function CharacterSheet() {
  const lang = useGame((s) => s.lang)
  const setSheetOpen = useGame((s) => s.setSheetOpen)
  const setCvOpen = useGame((s) => s.setCvOpen)

  return (
    <div
      className="animate-fade-in fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-8"
      onClick={() => setSheetOpen(false)}
    >
      <div
        className="rpg-panel animate-rise-in flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl text-slate-100 supports-[height:100dvh]:max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header stays put so the close button is always reachable */}
        <div className="flex shrink-0 items-center gap-4 border-b border-white/10 px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/15 font-display text-xl font-bold text-gold sm:h-16 sm:w-16 sm:text-2xl">
            {PROFILE.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-white sm:text-3xl">
              {PROFILE.name}
            </h2>
            <p className="text-xs font-semibold text-gold sm:text-sm">{PROFILE.tagline[lang]}</p>
          </div>
          <button
            onClick={() => setSheetOpen(false)}
            aria-label={UI.close[lang]}
            className="-mr-2.5 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center self-start rounded-lg text-lg leading-none text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain px-5 py-5 sm:px-8">
          <p className="text-xs text-slate-400">
            {PROFILE.email} · {PROFILE.phone} · {PROFILE.location[lang]}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{PROFILE.summary[lang]}</p>

          <div className="mt-7 grid gap-8 md:grid-cols-5">
          {/* left column */}
          <div className="space-y-8 md:col-span-2">
            <section>
              <SectionTitle>{UI.stats[lang]}</SectionTitle>
              <div className="space-y-3">
                {SKILLS.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-slate-100">{s.name}</span>
                      <span className="text-xs font-bold text-gold">{s.level}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-amber-500 to-gold-soft"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {SECONDARY_SKILLS.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>{UI.traits[lang]}</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {TRAITS.map((t) => (
                  <span
                    key={t.en}
                    className="rounded-lg border border-gold/25 bg-gold/8 px-3 py-1.5 text-xs font-semibold text-gold-soft"
                  >
                    {t[lang]}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>{UI.languages[lang]}</SectionTitle>
              <div className="space-y-2.5">
                {LANGUAGES.map((l) => (
                  <div key={l.name.en} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-100">{l.name[lang]}</span>
                    <span className="flex items-center gap-2 text-xs text-slate-400">
                      {l.level[lang]}
                      <span className="flex gap-1">
                        {[1, 2, 3].map((p) => (
                          <span
                            key={p}
                            className={`h-2 w-2 rounded-full ${
                              p <= l.pips ? 'bg-gold' : 'bg-white/15'
                            }`}
                          />
                        ))}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* right column: quest log + projects */}
          <div className="md:col-span-3">
            <SectionTitle>{UI.questLog[lang]}</SectionTitle>
            <div className="relative space-y-5 border-l border-white/10 pl-5">
              {QUESTS.map((q) => (
                <article key={q.id} className="relative">
                  <span
                    className={`absolute top-1.5 -left-[26.5px] h-3 w-3 rounded-full ring-4 ring-panel ${KIND_DOT[q.kind]}`}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h4 className="text-sm font-bold text-white">{q.title[lang]}</h4>
                    {(q.org || q.place) && (
                      <span className="text-xs font-semibold text-gold">
                        {[q.org, q.place].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {q.period[lang]} · {UI.questKind[q.kind][lang]}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {q.bullets[lang].map((b) => (
                      <li key={b} className="text-xs leading-relaxed text-slate-300">
                        · {b}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-8">
              <SectionTitle>{UI.projects[lang]}</SectionTitle>
              <div className="space-y-2.5">
                {PROJECTS.map((p) => {
                  const content = (
                    <>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="flex flex-wrap items-baseline gap-2">
                          <h4 className="text-sm font-bold text-white">{p.name}</h4>
                          {p.status && (
                            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-300 uppercase">
                              {p.status[lang]}
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] font-semibold whitespace-nowrap text-gold">
                          {p.url
                            ? `${(p.linkLabel ?? UI.visit)[lang]} ↗`
                            : `📍 ${UI.youAreHere[lang]}`}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-300">
                        {p.desc[lang]}
                      </p>
                    </>
                  )
                  const cardClass =
                    'block rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition'
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
            </div>
          </div>
        </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button
              onClick={() => {
                setSheetOpen(false)
                setCvOpen(true)
              }}
              className="cursor-pointer rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold text-gold transition hover:bg-gold/20"
            >
              {UI.plainCv[lang]} / {UI.print[lang]}
            </button>
            <p className="text-[11px] text-slate-500">{UI.madeWith[lang]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
