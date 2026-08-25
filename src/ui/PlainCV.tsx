import {
  LANGUAGES,
  PROFILE,
  PROJECTS,
  QUESTS,
  SECONDARY_SKILLS,
  SKILLS,
  TRAITS,
  UI,
} from '../data/cv'
import { useGame } from '../state/store'

export function PlainCV() {
  const lang = useGame((s) => s.lang)
  const setCvOpen = useGame((s) => s.setCvOpen)

  const jobs = QUESTS.filter((q) => q.section === 'work')
  const side = QUESTS.filter((q) => q.section === 'side')
  const education = QUESTS.filter((q) => q.section === 'education')

  return (
    <div className="plain-cv-root fixed inset-0 z-50 overflow-y-auto bg-slate-200">
      {/* toolbar */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-slate-300 bg-white/90 px-4 py-3 backdrop-blur">
        <button
          onClick={() => setCvOpen(false)}
          className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          ← {UI.back[lang]}
        </button>
        <button
          onClick={() => window.print()}
          className="cursor-pointer rounded-lg bg-slate-900 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          🖨 {UI.print[lang]}
        </button>
      </div>

      <div className="mx-auto my-8 max-w-3xl bg-white p-10 text-slate-800 shadow-xl print:my-0 print:max-w-none print:p-0 print:shadow-none">
        <header className="border-b-2 border-slate-800 pb-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{PROFILE.name}</h1>
          <p className="mt-1 text-lg font-semibold text-slate-600">
            {lang === 'nl' ? 'Front-end / full-stack developer' : 'Front-end / full-stack developer'}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {PROFILE.location[lang]} · {PROFILE.phone} · {PROFILE.email}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            {UI.interactiveVersion[lang]}:{' '}
            <a
              href={PROFILE.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              {PROFILE.siteUrl.replace('https://', '')}
            </a>
          </p>
        </header>

        <p className="mt-5 text-sm leading-relaxed text-slate-700">{PROFILE.summary[lang]}</p>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
            {UI.experience[lang]}
          </h2>
          {jobs.map((q) => (
            <article key={q.id} className="mb-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-base font-bold text-slate-900">
                  {q.org}, {q.place} — {q.title[lang]}
                </h3>
                <span className="text-xs font-semibold text-slate-500">{q.period[lang]}</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {q.bullets[lang].map((b) => (
                  <li key={b} className="text-sm leading-relaxed text-slate-700">
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
            {UI.sideHustle[lang]}
          </h2>
          {side.map((q) => (
            <article key={q.id} className="mb-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-base font-bold text-slate-900">{q.title[lang]}</h3>
                <span className="text-xs font-semibold text-slate-500">{q.period[lang]}</span>
              </div>
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {q.bullets[lang].map((b) => (
                  <li key={b} className="text-sm leading-relaxed text-slate-700">
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
            {UI.projects[lang]}
          </h2>
          {PROJECTS.map((p) => (
            <article key={p.name} className="mb-3">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-base font-bold text-slate-900">
                  {p.name}
                  {p.status && (
                    <span className="ml-2 text-xs font-semibold text-slate-500 italic">
                      ({p.status[lang]})
                    </span>
                  )}
                </h3>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-700 underline"
                  >
                    {p.url}
                  </a>
                )}
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-700">{p.desc[lang]}</p>
            </article>
          ))}
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
            {UI.education[lang]}
          </h2>
          {education.map((q) => (
            <article key={q.id} className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-base font-bold text-slate-900">
                  {[q.org, q.place].filter(Boolean).join(', ')} — {q.title[lang]}
                </h3>
                <span className="text-xs font-semibold text-slate-500">{q.period[lang]}</span>
              </div>
            </article>
          ))}
          <article className="mb-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-base font-bold text-slate-900">
                Elmos, Mechelen — .NET Masterclass
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {lang === 'nl' ? 'Februari 2023' : 'February 2023'}
              </span>
            </div>
          </article>
        </section>

        <div className="mt-7 grid gap-7 sm:grid-cols-3">
          <section>
            <h2 className="mb-2 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
              {UI.skills[lang]}
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {SKILLS.map((s) => s.name).join(' · ')}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              {SECONDARY_SKILLS.join(' · ')}
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
              {lang === 'nl' ? 'Karakter' : 'Character'}
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {TRAITS.map((t) => t[lang]).join(' · ')}
            </p>
          </section>
          <section>
            <h2 className="mb-2 text-sm font-extrabold tracking-widest text-slate-900 uppercase">
              {UI.languages[lang]}
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">
              {LANGUAGES.map((l) => `${l.name[lang]} — ${l.level[lang]}`).join(' · ')}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
