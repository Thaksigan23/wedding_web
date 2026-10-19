import { lazy, Suspense, useState, useCallback } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import { OpeningDoor } from './components/OpeningDoor'
import { Hero } from './components/Hero'
import { StickyNav } from './components/StickyNav'

const BlessingNote = lazy(() =>
  import('./components/BlessingNote').then((m) => ({ default: m.BlessingNote })),
)
const BrideGroom = lazy(() =>
  import('./components/BrideGroom').then((m) => ({ default: m.BrideGroom })),
)
const Timeline = lazy(() =>
  import('./components/Timeline').then((m) => ({ default: m.Timeline })),
)
const Countdown = lazy(() =>
  import('./components/Countdown').then((m) => ({ default: m.Countdown })),
)
const Venue = lazy(() => import('./components/Venue').then((m) => ({ default: m.Venue })))
const Gallery = lazy(() =>
  import('./components/Gallery').then((m) => ({ default: m.Gallery })),
)
const SecretKeysGame = lazy(() =>
  import('./components/SecretKeysGame').then((m) => ({ default: m.SecretKeysGame })),
)
const RSVP = lazy(() => import('./components/RSVP').then((m) => ({ default: m.RSVP })))
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
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  const handleOpen = useCallback(() => {
    setDoorOpen(true)
    setAudioUnlocked(true)
  }, [])

  return (
    <LanguageProvider>
      <div className="min-h-dvh bg-maroon-deep text-ivory antialiased">
        <OpeningDoor open={doorOpen} onOpen={handleOpen} />
        {doorOpen && (
          <>
            <StickyNav audioUnlocked={audioUnlocked} />
            <main>
              <Hero audioUnlocked={audioUnlocked} />
              <Suspense fallback={<SectionFallback />}>
                <BlessingNote />
                <BrideGroom />
                <Timeline />
                <Countdown />
                <Venue />
                <Gallery />
                <SecretKeysGame />
                <RSVP />
                <ShareActions />
              </Suspense>
            </main>
            <Suspense fallback={null}>
              <Footer />
              <FloatingWhatsApp />
            </Suspense>
          </>
        )}
      </div>
    </LanguageProvider>
  )
}
