import { useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'
import { useShareLinks } from './ShareActions'

export function Venue() {
  const { t, lang } = useLanguage()
  const venues = (wedding.venues || []).filter((v) => v.enabled !== false)
  const [activeId, setActiveId] = useState(venues[0]?.id)
  const { ics, googleUrl } = useShareLinks()

  if (venues.length === 0) return null

  const active = venues.find((v) => v.id === activeId) || venues[0]
  const useTabs = venues.length > 1

  return (
    <section
      id="venue"
      className="section-pad relative bg-ivory"
      aria-labelledby="venue-heading"
    >
      <div className="site-shell">
        <SectionHeader eyebrowKey="venue" titleKey="venue" titleId="venue-heading" />

        {useTabs && (
          <div
            className="mb-8 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label={t(wedding.sectionTitles.venue)}
          >
            {venues.map((v) => (
              <button
                key={v.id}
                type="button"
                role="tab"
                id={`venue-tab-${v.id}`}
                aria-controls={`venue-panel-${v.id}`}
                aria-selected={active.id === v.id}
                onClick={() => setActiveId(v.id)}
                className={`min-h-[44px] rounded-full px-5 font-sans text-[0.7rem] tracking-[0.16em] uppercase transition ${
                  active.id === v.id
                    ? 'bg-maroon text-ivory'
                    : 'border border-gold/35 text-maroon/70 hover:border-gold/60'
                }`}
              >
                {t(v.label)}
              </button>
            ))}
          </div>
        )}

        <ScrollReveal>
          <div
            role={useTabs ? 'tabpanel' : undefined}
            id={useTabs ? `venue-panel-${active.id}` : undefined}
            aria-labelledby={useTabs ? `venue-tab-${active.id}` : undefined}
          >
            <VenueSplit
              venue={active}
              t={t}
              lang={lang}
              onIcs={ics}
              googleUrl={googleUrl}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function VenueSplit({ venue, t, lang, onIcs, googleUrl }) {
  return (
    <div
      className="grid items-stretch gap-0 overflow-hidden rounded-[20px] border border-maroon/18 bg-ivory md:grid-cols-2"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      <div className="flex flex-col justify-center px-6 py-8 md:px-10 md:py-12">
        {venue.label && (
          <p className="font-sans text-[0.65rem] tracking-[0.2em] text-maroon/60 uppercase">
            {t(venue.label)}
          </p>
        )}
        <h3
          className={`mt-2 text-maroon ${
            lang === 'ta'
              ? 'font-tamil text-xl leading-[1.7] md:text-2xl'
              : 'font-display text-2xl md:text-3xl'
          }`}
        >
          {t(venue.name)}
        </h3>
        <p
          className={`mt-3 text-sm leading-relaxed text-maroon/70 md:text-base ${
            lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
          }`}
        >
          {t(venue.address)}
        </p>
        {venue.travelNotes && (
          <p
            className={`mt-3 text-sm text-maroon/55 ${
              lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
            }`}
          >
            {t(venue.travelNotes)}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={venue.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-gold min-h-[44px]"
          >
            {t(wedding.share.getDirections)}
          </a>
          <button type="button" onClick={onIcs} className="btn-pill btn-pill-outline min-h-[44px]">
            {t(wedding.share.downloadIcs)}
          </button>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-outline min-h-[44px]"
          >
            {t(wedding.share.googleCalendar)}
          </a>
        </div>
      </div>

      {venue.mapsEmbedUrl && (
        <div className="min-h-[220px] overflow-hidden border-t border-gold/20 bg-blush md:min-h-full md:border-t-0 md:border-l">
          <iframe
            title={`${t(venue.name)} map`}
            src={venue.mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[220px] w-full border-0 md:min-h-[320px]"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}
