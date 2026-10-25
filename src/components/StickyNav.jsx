import { useEffect, useMemo, useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'

const LINKS = [
  { id: 'story', key: 'story' },
  { id: 'venue', key: 'venue' },
  { id: 'gallery', key: 'gallery' },
  { id: 'rsvp', key: 'rsvp' },
]

function coupleInitials() {
  const letter = (name) => {
    const cleaned = String(name || '')
      .replace(/[[\]]/g, '')
      .trim()
    return cleaned.charAt(0).toUpperCase() || '·'
  }
  return `${letter(wedding.bride.name.en)} · ${letter(wedding.groom.name.en)}`
}

/**
 * Minimal sticky bar — appears after the hero scrolls out of view.
 */
export function StickyNav() {
  const { t, lang } = useLanguage()
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const initials = useMemo(() => coupleInitials(), [])

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) {
      setVisible(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.12 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean)
    if (sections.length === 0) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visibleEntries[0]?.target?.id) {
          setActive(visibleEntries[0].target.id)
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.5] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const go = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-full opacity-0'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div
        className="border-b border-gold/20 bg-maroon-deep/92 backdrop-blur-xl"
        style={{ boxShadow: visible ? 'var(--shadow-nav)' : 'none' }}
      >
        <div className="site-shell flex h-14 items-center justify-between gap-2 md:h-16 md:gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              go('hero')
            }}
            className="shrink-0 font-display text-lg tracking-[0.08em] text-gold md:text-xl"
            aria-label={t(wedding.invitationTitle)}
          >
            {initials}
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Section">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(link.id)
                }}
                className={`rounded-full px-3.5 py-1.5 font-sans text-[0.68rem] tracking-[0.18em] uppercase transition duration-300 ${
                  active === link.id
                    ? 'text-gold shadow-[inset_0_-1px_0_0_currentColor]'
                    : 'text-ivory/55 hover:text-gold-ink'
                }`}
              >
                {t(wedding.nav[link.key])}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center md:hidden">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-ivory"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? t(wedding.nav.close) : t(wedding.nav.menu)}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        <div
          id="mobile-nav-menu"
          hidden={!menuOpen}
          className="border-t border-gold/15 md:hidden"
        >
          <nav className="site-shell flex flex-col gap-1 py-3" aria-label="Mobile section">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(link.id)
                }}
                className={`rounded-[var(--radius-md)] px-3 py-2.5 font-sans text-sm tracking-wide ${
                  lang === 'ta' ? 'font-tamil' : ''
                } ${
                  active === link.id
                    ? 'bg-gold/15 text-gold'
                    : 'text-ivory/70 hover:bg-ivory/8'
                }`}
              >
                {t(wedding.nav[link.key])}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function MenuIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <path d="M5 8h14M5 12h14M5 16h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  )
}
