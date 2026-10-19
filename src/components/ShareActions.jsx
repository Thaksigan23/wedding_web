import { useEffect, useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import {
  buildGoogleCalendarUrl,
  buildIcs,
  buildWhatsAppShareUrl,
  downloadIcs,
} from '../utils/calendar'

function getPrimaryVenueLocation(t) {
  const venues = (wedding.venues || []).filter((v) => v.enabled !== false)
  const primary = venues[0]
  if (!primary) return ''
  return `${t(primary.name)}, ${t(primary.address)}`
}

function getSiteUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    const { origin, pathname } = window.location
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return wedding.meta.siteUrl || origin + pathname
    }
  }
  return wedding.meta.siteUrl || ''
}

export function useShareLinks() {
  const { t } = useLanguage()

  const title = t(wedding.muhurtham.calendarTitle)
  const description = t(wedding.muhurtham.calendarDescription)
  const location = getPrimaryVenueLocation(t)
  const startIso = wedding.muhurtham.datetime
  const endIso = wedding.muhurtham.endDatetime || wedding.muhurtham.datetime

  const ics = () => {
    const content = buildIcs({ title, description, location, startIso, endIso })
    downloadIcs('muhurtham.ics', content)
  }

  const googleUrl = buildGoogleCalendarUrl({
    title,
    description,
    location,
    startIso,
    endIso,
  })

  const siteUrl = getSiteUrl()
  const whatsappUrl = buildWhatsAppShareUrl(t(wedding.share.whatsappMessage), siteUrl)

  return { ics, googleUrl, whatsappUrl, siteUrl }
}

/** Desktop WhatsApp share strip (calendar lives on Venue) */
export function ShareActions() {
  const { t } = useLanguage()
  const { whatsappUrl } = useShareLinks()

  return (
    <section
      className="section-pad relative hidden bg-blush py-10 md:block"
      aria-label={t(wedding.share.shareWhatsApp)}
    >
      <div className="site-shell flex justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill inline-flex min-h-[44px] items-center gap-2 border border-[#25D366]/40 bg-[#25D366]/12 text-maroon hover:bg-[#25D366]/2"
        >
          <WhatsAppIcon />
          {t(wedding.share.shareWhatsApp)}
        </a>
      </div>
    </section>
  )
}

/** Floating WhatsApp — hidden while RSVP is in view so it never covers the form */
export function FloatingWhatsApp() {
  const { t } = useLanguage()
  const { whatsappUrl } = useShareLinks()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const section = document.getElementById('rsvp')
    if (!section) return undefined
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-4 bottom-5 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#128C7E] px-4 py-2.5 text-sm text-white transition-all duration-300 md:hidden ${
        hidden
          ? 'pointer-events-none translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
      style={{ boxShadow: '0 4px 20px rgba(18,140,126,0.35)' }}
      aria-label={t(wedding.share.shareWhatsApp)}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      <WhatsAppIcon className="text-white" />
      <span className="font-sans text-xs tracking-wide">{t(wedding.share.shareWhatsApp)}</span>
    </a>
  )
}

function WhatsAppIcon({ className = '' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.1-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.5-1-.9-1.5-1.9-1.7-2.2-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.1.7 2.9.6.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.6-.3z" />
      <path d="M12 2a10 10 0 00-8.6 15L2 22l5.1-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1111.6 3.8 8.1 8.1 0 01-4.6 0z" />
    </svg>
  )
}
