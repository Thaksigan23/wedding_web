import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'
import { CoverCountdown } from './Countdown'
import { wedding } from '../data/wedding'

const OPEN_DELAY = 1100

function EnvelopeFold({ side, points, colors }) {
  return (
    <svg className={`screen-envelope-fold screen-envelope-${side}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`envelope-${side}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={colors[0]} />
          <stop offset="1" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <polygon points={points} fill={`url(#envelope-${side})`} stroke="#c69c52" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function OpeningDoor({ open, onOpen }) {
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const [opening, setOpening] = useState(false)
  const coverRef = useRef(null)
  const letterRef = useRef(null)
  const openingRef = useRef(false)
  const openTimer = useRef(null)

  useEffect(() => {
    if (open) return undefined
    const html = document.documentElement
    const body = document.body
    const previousHtml = html.style.overflow
    const previousBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = previousHtml
      body.style.overflow = previousBody
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(openTimer.current), [])

  const handleOpen = useCallback(() => {
    if (openingRef.current) return
    openingRef.current = true
    setOpening(true)
    openTimer.current = window.setTimeout(() => {
      const rect = letterRef.current?.getBoundingClientRect()
      onOpen(!reduced && rect ? {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: window.innerHeight,
      } : null)
    }, reduced ? 0 : OPEN_DELAY)
  }, [onOpen, reduced])

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          ref={coverRef}
          className={`screen-envelope ${opening ? 'is-opening' : ''}`}
          aria-busy={opening}
          exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.25 } }}
        >
          <div className="screen-envelope-interior" aria-hidden="true" />
          <div ref={letterRef} className="screen-envelope-paper" aria-hidden="true">
            <span>♡</span>
          </div>
          <EnvelopeFold side="left" points="0,0 54,50 0,100" colors={['#641b28', '#33050d']} />
          <EnvelopeFold side="right" points="100,0 46,50 100,100" colors={['#58101e', '#27050b']} />
          <EnvelopeFold side="bottom" points="0,100 50,46 100,100" colors={['#732331', '#3b0812']} />
          <EnvelopeFold side="top" points="0,0 100,0 50,53" colors={['#7a2734', '#400813']} />
          <div className="screen-envelope-grain" aria-hidden="true" />
          <div className="screen-envelope-countdown">
            <CoverCountdown />
            <a className="screen-envelope-credit" href={wedding.footer.creditUrl} target="_blank" rel="noopener noreferrer">
              Powered by Techloom.ai
            </a>
          </div>
          <button
            type="button"
            className="screen-envelope-seal"
            onClick={handleOpen}
            disabled={opening}
            aria-label={lang === 'ta' ? 'அழைப்பிதழைத் திறக்க' : 'Open wedding invitation'}
          >
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M32 53 10 32C-5 17 16 1 32 17 48 1 69 17 54 32Z" />
            </svg>
          </button>
          <p className="screen-envelope-prompt">
            {lang === 'ta' ? 'இதயத்தைத் தொட்டு அழைப்பிதழைத் திறக்கவும்' : 'Touch the heart to open your invitation'}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
