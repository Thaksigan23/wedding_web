import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'
import { FloralCorners, GoldDivider, LotusGlyph } from './GoldDivider'

export function Gallery() {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const items = wedding.gallery || []
  const [broken, setBroken] = useState(() => new Set())
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const photos = items
    .map((item, i) => ({ ...item, originalIndex: i }))
    .filter((item) => item.src && !item.comingSoon && !broken.has(item.originalIndex))

  const featured = photos[0]

  const markBroken = useCallback((index) => {
    setBroken((prev) => new Set(prev).add(index))
  }, [])

  const openFeatured = () => {
    if (featured) setLightboxIndex(0)
  }
  const close = () => setLightboxIndex(null)

  const go = useCallback(
    (delta) => {
      setLightboxIndex((current) => {
        if (current == null || photos.length === 0) return current
        return (current + delta + photos.length) % photos.length
      })
    },
    [photos.length],
  )

  return (
    <section
      id="gallery"
      className="surface-maroon-soft section-pad relative overflow-hidden"
      aria-labelledby="gallery-heading"
    >
      <FloralCorners variant="gallery" />
      <div className="site-shell relative z-10">
        <SectionHeader titleKey="gallery" titleId="gallery-heading" />

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-center md:gap-14 lg:gap-20">
          {featured && (
            <ScrollReveal y={16} className="w-full max-w-[17.5rem] sm:max-w-[19rem]">
              <button
                type="button"
                onClick={openFeatured}
                className="album-frame group relative block aspect-[3/4] w-full min-h-[44px] overflow-hidden p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                aria-label={t(featured.alt)}
              >
                <img
                  src={featured.src}
                  alt={t(featured.alt)}
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover ${
                    reduced ? '' : 'transition duration-500 group-hover:scale-[1.03]'
                  }`}
                  onError={() => markBroken(featured.originalIndex)}
                />
              </button>
            </ScrollReveal>
          )}

          <ComingSoonCopy t={t} lang={lang} />
        </div>
      </div>

      <Lightbox
        items={photos}
        index={lightboxIndex}
        onClose={close}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        t={t}
        reduced={reduced}
      />
    </section>
  )
}

function ComingSoonCopy({ t, lang }) {
  const copy = wedding.galleryComingSoon || {}

  return (
    <ScrollReveal delay={0.12} y={12} className="max-w-xs text-center md:text-left">
      <LotusGlyph className="mx-auto h-4 w-4 text-gold md:mx-0" />
      <p
        className={`mt-4 text-gold-ink ${
          lang === 'ta'
            ? 'font-tamil text-[1.35rem] leading-snug'
            : 'font-script text-[2.15rem] leading-tight'
        }`}
      >
        {t(copy.kicker)}
      </p>
      <GoldDivider small className="mt-4 mb-4 !w-36 md:!mx-0" />
      <p
        className={`text-ivory/72 ${
          lang === 'ta'
            ? 'font-tamil text-[0.92rem] leading-[1.85]'
            : 'font-sans text-[0.78rem] tracking-[0.06em] leading-relaxed'
        }`}
      >
        {t(copy.message)}
      </p>
    </ScrollReveal>
  )
}

function Lightbox({ items, index, onClose, onPrev, onNext, t, reduced }) {
  const open = index != null && items[index]
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const touchStart = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const list = [...focusable]
        if (list.length === 0) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, onPrev, onNext])

  const onTouchStart = (e) => {
    touchStart.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e) => {
    if (touchStart.current == null) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStart.current
    touchStart.current = null
    if (Math.abs(dx) < 50) return
    if (dx > 0) onPrev()
    else onNext()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-maroon-deep/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <p id={titleId} className="sr-only">
            {t(items[index].alt)} ({index + 1} / {items.length})
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-maroon/80 text-ivory"
            aria-label={t({ ta: 'மூடு', en: 'Close' })}
          >
            <CloseIcon />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onPrev()
                }}
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-maroon/70 text-ivory md:left-6"
                aria-label={t({ ta: 'முந்தைய படம்', en: 'Previous photo' })}
              >
                <ChevronIcon dir="left" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-maroon/70 text-ivory md:right-6"
                aria-label={t({ ta: 'அடுத்த படம்', en: 'Next photo' })}
              >
                <ChevronIcon dir="right" />
              </button>
            </>
          )}

          <motion.figure
            className="relative max-h-[85dvh] max-w-3xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            key={items[index].src}
          >
            <img
              src={items[index].src}
              alt={t(items[index].alt)}
              className="album-frame max-h-[85dvh] w-auto max-w-full object-contain p-1.5"
            />
            <figcaption className="mt-3 text-center font-sans text-sm text-ivory/70">
              {index + 1} / {items.length}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon({ dir }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
