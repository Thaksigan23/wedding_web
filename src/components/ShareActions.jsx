import { useEffect, useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import {
  buildGoogleCalendarUrl,
  buildWhatsAppShareUrl,
} from '../utils/calendar'

function getPrimaryVenueLocation(t) {
  const venues = (wedding.venues || []).filter((v) => v.enabled !== false)
  const primary = venues[0]
  if (!primary) return ''
  return `${t(primary.name)}, ${t(primary.address)}`
}

function getSiteUrl() {
  const base = wedding.meta.siteUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  const cleanBase = base.replace(/\/+$/, '')
  return cleanBase ? `${cleanBase}/?invitation=pv` : ''
}

export function useShareLinks() {
  const { t } = useLanguage()

  const title = t(wedding.muhurtham.calendarTitle)
  const description = t(wedding.muhurtham.calendarDescription)
  const location = getPrimaryVenueLocation(t)
  const startIso = wedding.muhurtham.datetime
  const endIso = wedding.muhurtham.endDatetime || wedding.muhurtham.datetime

  const googleUrl = buildGoogleCalendarUrl({
    title,
    description,
    location,
    startIso,
    endIso,
  })

  const siteUrl = getSiteUrl()
  const whatsappUrl = buildWhatsAppShareUrl(t(wedding.share.whatsappMessage), siteUrl)

  return { googleUrl, whatsappUrl, siteUrl }
}

/** Desktop WhatsApp share strip (calendar lives on Venue) */
export function ShareActions() {
  const { t } = useLanguage()
  const { whatsappUrl } = useShareLinks()

  return (
    <section
      className="band-maroon-deep relative hidden py-8 md:block"
      aria-label={t(wedding.share.shareWhatsApp)}
    >
      <div className="site-shell flex justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-pill-outline inline-flex min-h-[44px] items-center gap-2"
        >
          <WhatsAppIcon />
          {t(wedding.share.shareWhatsApp)}
        </a>
      </div>
    </section>
  )
}

/** Floating WhatsApp stays on the right, above the mobile navigation. */
export function FloatingWhatsApp() {
  const bridePhone = wedding.contacts.find((contact) => contact.id === 'bride')?.phone
  const whatsappUrl = `https://wa.me/${(bridePhone || '').replace(/\D/g, '')}`
  const label = 'Message the bride on WhatsApp'
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const ids = ['rsvp', 'game']
    const visible = new Set()
    let io
    let cancelled = false

    const attach = () => {
      const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
      if (!nodes.length) return false
      io?.disconnect()
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.add(entry.target.id)
            else visible.delete(entry.target.id)
          })
          setHidden(visible.size > 0)
        },
        { threshold: 0.12, rootMargin: '0px 0px -12% 0px' },
      )
      nodes.forEach((node) => io.observe(node))
      return nodes.length === ids.length
    }

    if (attach()) {
      return () => {
        cancelled = true
        io?.disconnect()
      }
    }

    const mo = new MutationObserver(() => {
      if (!cancelled && attach()) mo.disconnect()
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelled = true
      mo.disconnect()
      io?.disconnect()
    }
  }, [])

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/45 bg-maroon-deep/92 text-gold-ink backdrop-blur-md transition-all duration-300 md:hidden ${
        hidden
          ? 'pointer-events-none translate-y-4 opacity-0'
          : 'translate-y-0 opacity-100'
      }`}
      style={{
        right: 'max(1rem, env(safe-area-inset-right))',
        left: 'auto',
        bottom: 'calc(5.75rem + env(safe-area-inset-bottom))',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
      aria-label={label}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      <WhatsAppIcon className="text-gold" />
      <span className="sr-only">{label}</span>
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
