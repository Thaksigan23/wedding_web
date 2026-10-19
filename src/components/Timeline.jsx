import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'
import { TimelineIcon } from './motifs/TimelineIcons'

export function Timeline() {
  const { t, lang } = useLanguage()
  const events = wedding.timeline.filter((e) => e.enabled !== false)

  if (events.length === 0) return null

  return (
    <section
      id="events"
      className="surface-maroon-soft section-pad relative"
      aria-labelledby="timeline-heading"
    >
      <div className="site-shell">
        <SectionHeader
          eyebrowKey="timeline"
          titleKey="timeline"
          titleId="timeline-heading"
          light
          className="!mb-12 md:!mb-16"
        />

        <ol className="relative mx-auto list-none p-0 md:max-w-4xl">
          <div
            className="pointer-events-none absolute top-3 bottom-3 left-[1.625rem] w-px md:left-1/2 md:-translate-x-px"
            style={{
              background:
                'linear-gradient(180deg, transparent, var(--color-gold), transparent)',
            }}
            aria-hidden="true"
          />

          {events.map((event, index) => {
            const featured = event.id === 'thaali'
            const onLeft = index % 2 === 0

            return (
              <ScrollReveal
                key={event.id}
                delay={Math.min(index * 0.07, 0.35)}
                y={20}
              >
                <li className="relative pb-10 last:pb-0 md:pb-14">
                  {/* Center node — photorealistic ceremonial icon */}
                  <div
                    className={`absolute left-5 top-3 z-10 overflow-hidden rounded-full border-2 border-gold/70 shadow-md md:left-1/2 ${
                      featured ? 'ring-4 ring-gold/30' : 'ring-2 ring-maroon-deep/40'
                    }`}
                    style={{ width: 52, height: 52, transform: 'translateX(-50%)' }}
                    aria-hidden="true"
                  >
                    <TimelineIcon name={event.icon} className="h-full w-full" />
                  </div>

                  {/* Mobile: single column */}
                  <div className="ml-16 md:hidden">
                    <EventCard event={event} featured={featured} t={t} lang={lang} />
                  </div>

                  {/* Desktop: alternate columns */}
                  <div className="hidden md:grid md:grid-cols-2 md:gap-12">
                    {onLeft ? (
                      <>
                        <div className="pr-8 text-right">
                          <EventCard event={event} featured={featured} t={t} lang={lang} />
                        </div>
                        <div aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <div aria-hidden="true" />
                        <div className="pl-8 text-left">
                          <EventCard event={event} featured={featured} t={t} lang={lang} />
                        </div>
                      </>
                    )}
                  </div>
                </li>
              </ScrollReveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function EventCard({ event, featured, t, lang }) {
  const base = 'rounded-[20px] border px-5 py-5 text-left md:px-6 md:py-6'

  if (featured) {
    return (
      <article
        className={`${base} border-gold/40 bg-maroon shadow-[var(--shadow-lift)] md:scale-[1.03]`}
      >
        <p className="font-sans text-[0.65rem] font-medium tracking-[0.2em] text-gold uppercase">
          {t(event.date)}
          {event.time ? ` · ${t(event.time)}` : ''}
        </p>
        <h3
          className={`mt-2 text-ivory ${
            lang === 'ta'
              ? 'font-tamil text-lg leading-[1.7] md:text-xl'
              : 'font-display text-xl md:text-2xl'
          }`}
        >
          {t(event.title)}
        </h3>
        {event.subtitle && (
          <p
            className={`mt-1 text-sm text-gold/90 ${
              lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
            }`}
          >
            {t(event.subtitle)}
          </p>
        )}
        {event.time && (
          <p className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-gold/40 px-4 font-sans text-[0.7rem] tracking-[0.12em] text-gold">
            {t(event.time)}
          </p>
        )}
        {event.venue && (
          <p
            className={`mt-3 text-sm text-ivory/70 ${
              lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
            }`}
          >
            {t(event.venue)}
          </p>
        )}
      </article>
    )
  }

  return (
    <article
      className={`${base} panel-ivory`}
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      <p className="font-sans text-[0.65rem] font-medium tracking-[0.18em] text-[#5e121c]/65 uppercase">
        {t(event.date)}
        {event.time ? ` · ${t(event.time)}` : ''}
      </p>
      <h3
        className={`mt-2 text-[#5e121c] ${
          lang === 'ta'
            ? 'font-tamil text-base leading-[1.7] md:text-lg'
            : 'font-display text-lg md:text-xl'
        }`}
      >
        {t(event.title)}
      </h3>
      {event.subtitle && (
        <p
          className={`mt-1 text-sm text-[#5e121c]/60 ${
            lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
          }`}
        >
          {t(event.subtitle)}
        </p>
      )}
      {event.venue && (
        <p
          className={`mt-2 text-sm text-[#5e121c]/50 ${
            lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
          }`}
        >
          {t(event.venue)}
        </p>
      )}
    </article>
  )
}
