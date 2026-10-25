import { useEffect, useMemo, useState } from 'react'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { AudioToggle } from './AudioToggle'
import { useIsMobile } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'


const LINKS = [
  { id: 'story', key: 'story' },
  { id: 'countdown', key: 'events' },
  { id: 'venue', key: 'venue' },
  { id: 'gallery', key: 'gallery' },
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
export function StickyNav({ audioUnlocked = false }) {
  const { t, lang } = useLanguage()
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('hero')
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
    const ids = ['hero', ...LINKS.map((link) => link.id)]
    const observed = new Set()
    const visibleSections = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio)
          else visibleSections.delete(entry.target.id)
        })
        const current = [...visibleSections].sort((a, b) => b[1] - a[1])[0]
        if (current) setActive(current[0])
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.5] },
    )
    // Suspense sections may mount after the navigation's first effect.
    const attach = () => {
      ids.forEach((id) => {
        const section = document.getElementById(id)
        if (section && !observed.has(section)) {
          observed.add(section)
          io.observe(section)
        }
      })
    }
    const mutations = new MutationObserver(attach)
    mutations.observe(document.getElementById('root'), { childList: true, subtree: true })
    attach()
    return () => {
      io.disconnect()
      mutations.disconnect()
    }
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
    const section = document.getElementById(id)
    if (!section) return
    setActive(id)
    section.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' })
  }

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 hidden transition-all duration-500 md:block ${
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
    <nav className="mobile-bottom-nav" aria-label={lang === 'ta' ? 'முதன்மை வழிசெலுத்தல்' : 'Main navigation'}>
      <MobileNavLink id="hero" label={lang === 'ta' ? 'முகப்பு' : 'Home'} active={active === 'hero'} onNavigate={go}><HomeIcon /></MobileNavLink>
      <MobileNavLink id="story" label={t(wedding.nav.story)} active={active === 'story'} onNavigate={go}><HeartIcon /></MobileNavLink>
      <MobileNavLink id="countdown" label={t(wedding.sectionTitles.countdown)} active={active === 'countdown'} onNavigate={go}><CalendarIcon /></MobileNavLink>
      <MobileNavLink id="gallery" label={t(wedding.nav.gallery)} active={active === 'gallery'} onNavigate={go}><PhotoIcon /></MobileNavLink>
      <MobileNavLink id="venue" label={t(wedding.nav.venue)} active={active === 'venue'} onNavigate={go}><PinIcon /></MobileNavLink>
      {isMobile && <AudioToggle unlocked={audioUnlocked} className="mobile-bottom-nav-control mobile-bottom-nav-audio" />}
    </nav>
    </>
  )
}

function MobileNavLink({ id, label, active, onNavigate, children }) {
  return <a href={`#${id}`} aria-label={label} aria-current={active ? 'page' : undefined} title={label} onClick={(event) => { event.preventDefault(); onNavigate(id) }} className={`mobile-bottom-nav-link${active ? ' is-active' : ''}`}>{children}</a>
}

function HomeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7M5.5 9v11h5v-6h3v6h5V9" /></svg> }
function HeartIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 8.6c0 5.1-8.5 11-8.5 11s-8.5-5.9-8.5-11a4.2 4.2 0 0 1 8.5-.3 4.2 4.2 0 0 1 8.5.3Z" /></svg> }
function CalendarIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="1.5"/><path d="M8 3v4m8-4v4M4 9h16m-11 4h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" /></svg> }
function PhotoIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="1.5"/><circle cx="9" cy="9" r="1.5"/><path d="m5 18 5-5 3 3 2-2 4 4" /></svg> }
function PinIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5.2-7 11-7 11S5 15.2 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3" /></svg> }

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
