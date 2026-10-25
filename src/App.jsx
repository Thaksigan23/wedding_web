import { Analytics } from '@vercel/analytics/react'
import { lazy, Suspense, useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LanguageProvider } from './context/LanguageContext'
import { AudioProvider } from './context/AudioContext'
import { OpeningDoor } from './components/OpeningDoor'
import { Hero } from './components/Hero'
import { Countdown } from './components/Countdown'
import { StickyNav } from './components/StickyNav'
import { InviteControlsDock } from './components/InviteControlsDock'
import { SiteFloralHeader } from './components/GoldDivider'
import { trackPageView } from './analytics'

const BlessingNote = lazy(() =>
  import('./components/BlessingNote').then((m) => ({ default: m.BlessingNote })),
)
const BrideGroom = lazy(() =>
  import('./components/BrideGroom').then((m) => ({ default: m.BrideGroom })),
)
const Venue = lazy(() => import('./components/Venue').then((m) => ({ default: m.Venue })))
const Gallery = lazy(() =>
  import('./components/Gallery').then((m) => ({ default: m.Gallery })),
)
const SecretKeysGame = lazy(() =>
  import('./components/SecretKeysGame').then((m) => ({ default: m.SecretKeysGame })),
)
const ShareActions = lazy(() =>
  import('./components/ShareActions').then((m) => ({ default: m.ShareActions })),
)
const Footer = lazy(() => import('./components/Footer').then((m) => ({ default: m.Footer })))
const FloatingWhatsApp = lazy(() =>
  import('./components/ShareActions').then((m) => ({ default: m.FloatingWhatsApp })),
)

function SectionFallback() {
  return (
    <div
      className="mx-auto max-w-lg px-4 py-16 text-center font-sans text-sm text-ivory/30"
      aria-hidden="true"
    >
      …
    </div>
  )
}

export default function App() {
  const [doorOpen, setDoorOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [revealOrigin, setRevealOrigin] = useState(null)
  const mainRef = useRef(null)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  const handleOpen = useCallback((origin) => {
    setRevealOrigin(origin)
    setDoorOpen(true)
    setRevealed(!origin)
    setAudioUnlocked(true)
    trackPageView('/invite')
  }, [])

  const finishReveal = useCallback(() => {
    setRevealed(true)
  }, [])

  useEffect(() => {
    if (revealed) mainRef.current?.focus({ preventScroll: true })
  }, [revealed])

  return (
    <LanguageProvider>
      <AudioProvider>
        <Analytics />
        <div className="min-h-dvh bg-maroon text-ivory antialiased">
        <OpeningDoor open={revealed} onOpen={handleOpen} />
        {doorOpen && (
          <motion.div
            className="invitation-reveal"
            inert={!revealed}
            initial={revealOrigin ? {
              x: revealOrigin.left,
              y: revealOrigin.top,
              scaleX: revealOrigin.width / revealOrigin.viewportWidth,
              scaleY: revealOrigin.height / revealOrigin.viewportHeight,
              borderRadius: 12,
            } : false}
            animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0 }}
            transition={{ duration: revealOrigin ? 1.2 : 0, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={finishReveal}
            transformTemplate={revealed ? () => 'none' : undefined}
            style={{
              position: revealed ? 'relative' : 'fixed',
              inset: revealed ? undefined : 0,
              height: revealed ? undefined : '100dvh',
              overflow: revealed ? undefined : 'hidden',
              zIndex: 60,
              transformOrigin: '0 0',
              background: 'var(--color-maroon)',
              willChange: revealed ? 'auto' : 'transform',
            }}
          >
            <SiteFloralHeader />
            <StickyNav audioUnlocked={audioUnlocked} />
            <main ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
              <Hero />
              <Suspense fallback={<SectionFallback />}>
                <BlessingNote />
                <BrideGroom />
                <Countdown />
                <Venue />
                <Gallery />
                <SecretKeysGame />
                <ShareActions />
              </Suspense>
            </main>
            <InviteControlsDock audioUnlocked={audioUnlocked} />
            <Suspense fallback={null}>
              <Footer />
              <FloatingWhatsApp />
            </Suspense>
          </motion.div>
        )}
      </div>
      </AudioProvider>
    </LanguageProvider>
  )
}
