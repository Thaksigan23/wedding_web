import { useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'
import { useShareLinks } from './ShareActions'
import { FloralCorners, InviteFrame } from './GoldDivider'

export function Venue() {
  const { t, lang } = useLanguage()
  const venues = (wedding.venues || []).filter((v) => v.enabled !== false)
  const [activeId, setActiveId] = useState(venues[0]?.id)
  const { googleUrl } = useShareLinks()

  if (venues.length === 0) return null

  const active = venues.find((v) => v.id === activeId) || venues[0]
  const useTabs = venues.length > 1

  return (
    <section
      id="venue"
      className="surface-maroon section-pad relative overflow-hidden"
      aria-labelledby="venue-heading"
    >
      <FloralCorners variant="venue" />
      <div className="site-shell relative z-10">
        <SectionHeader titleKey="venue" titleId="venue-heading" />

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
                    ? 'bg-gold text-maroon-deep'
                    : 'border border-gold/40 text-ivory/75 hover:border-gold/70 hover:text-ivory'
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
              googleUrl={googleUrl}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function VenueSplit({ venue, t, lang, googleUrl }) {
  return (
    <InviteFrame padded={false} className="overflow-hidden p-2 sm:p-3">
    <div className="grid items-stretch gap-0 md:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-8 sm:px-6 md:px-10 md:py-12">
        {venue.label && (
          <p className="font-sans text-[0.65rem] tracking-[0.2em] text-gold/80 uppercase">
            {t(venue.label)}
          </p>
        )}
        <h3
          className={`mt-2 text-gold-ink ${
            lang === 'ta'
              ? 'font-tamil text-xl leading-[1.7] md:text-2xl'
              : 'font-display text-2xl md:text-3xl'
          }`}
        >
          {t(venue.name)}
        </h3>
        <p
          className={`mt-3 text-sm leading-relaxed text-ivory/75 md:text-base ${
            lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
          }`}
        >
          {t(venue.address)}
        </p>
        {venue.travelNotes && (
          <p
            className={`mt-3 text-sm text-ivory/55 ${
              lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
            }`}
          >
            {t(venue.travelNotes)}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={venue.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-gold min-h-[44px] w-full sm:w-auto"
          >
            {t(wedding.share.getDirections)}
          </a>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-outline min-h-[44px] w-full sm:w-auto"
          >
            {t(wedding.share.googleCalendar)}
          </a>
        </div>
      </div>

      {venue.mapsEmbedUrl && (
        <div className="min-h-[220px] overflow-hidden border-t border-gold/25 bg-maroon-deep md:min-h-full md:border-t-0 md:border-l">
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
    </InviteFrame>
  )
}
