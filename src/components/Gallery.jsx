import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'

const BENTO = [
  'col-span-2 row-span-2 aspect-[4/5] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[280px]',
  'col-span-1 aspect-square',
  'col-span-1 aspect-square',
  'col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-[3/4]',
  'col-span-1 aspect-[3/4]',
  'col-span-1 aspect-[3/4]',
]

export function Gallery() {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const items = wedding.gallery || []
  const [broken, setBroken] = useState(() => new Set())
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const visible = items
    .map((item, i) => ({ ...item, originalIndex: i }))
    .filter((item) => item.src && !broken.has(item.originalIndex))

  const markBroken = useCallback((index) => {
    setBroken((prev) => new Set(prev).add(index))
  }, [])

  const openAt = (visibleIndex) => setLightboxIndex(visibleIndex)
  const close = () => setLightboxIndex(null)

  const go = useCallback(
    (delta) => {
      setLightboxIndex((current) => {
        if (current == null || visible.length === 0) return current
        return (current + delta + visible.length) % visible.length
      })
    },
    [visible.length],
  )

  if (items.length === 0) return null

  return (
    <section
      id="gallery"
      className="surface-maroon-soft section-pad relative"
      aria-labelledby="gallery-heading"
    >
      <div className="site-shell">
        <SectionHeader eyebrowKey="gallery" titleKey="gallery" titleId="gallery-heading" light />

        {visible.length === 0 ? (
          <p
            className={`mx-auto max-w-md text-center text-sm text-ivory/50 ${
              lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans'
            }`}
          >
            {lang === 'ta' ? 'படங்கள் விரைவில் சேர்க்கப்படும்' : 'Photos will be added soon'}
          </p>
        ) : (
          <ul className="mx-auto grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {visible.map((item, visibleIndex) => (
              <li
                key={`${item.src}-${item.originalIndex}`}
                className={BENTO[visibleIndex % BENTO.length]}
              >
                <ScrollReveal delay={Math.min(visibleIndex * 0.05, 0.3)} y={16} className="h-full">
                  <button
                    type="button"
                    onClick={() => openAt(visibleIndex)}
                    className="group relative block h-full min-h-[44px] w-full overflow-hidden rounded-2xl border border-gold/25 bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    style={{ boxShadow: 'var(--shadow-soft)' }}
                    aria-label={t(item.alt)}
                  >
                    <span className="absolute inset-0 bg-[#efe3e4]/50" aria-hidden="true" />
                    <img
                      src={item.src}
                      alt={t(item.alt)}
                      width={800}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      className={`relative z-[1] h-full w-full object-cover ${
                        reduced ? '' : 'transition duration-500 group-hover:scale-[1.04]'
                      }`}
                      onError={() => markBroken(item.originalIndex)}
                    />
                  </button>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Lightbox
        items={visible}
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
              className="max-h-[85dvh] w-auto max-w-full rounded-2xl object-contain"
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
