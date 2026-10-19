import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useLanguage } from '../context/LanguageContext'
import { FloralLanternHeader } from './motifs/FloralLanternHeader'

const DOOR_MS = 1.15
const EASE_OUT = [0.16, 1, 0.3, 1]

export function OpeningDoor({ open, onOpen }) {
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()

  const doorTransition = reduced
    ? { duration: 0.01 }
    : { duration: DOOR_MS, ease: EASE_OUT }

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, #f7e4dc 0%, #fffbf5 55%, #f0cfc4 100%)',
          }}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpen()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={lang === 'ta' ? 'அழைப்பிதழைத் திறக்க தட்டவும்' : 'Tap to open the invitation'}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.35 } }
              : { opacity: 0, transition: { delay: DOOR_MS * 0.75, duration: 0.4 } }
          }
        >
          {/* Soft twin panels (blush doors) */}
          <div className="absolute inset-0 flex">
            <motion.div
              className="relative h-full w-1/2"
              style={{
                background:
                  'linear-gradient(90deg, #f0cfc4 0%, #f7e4dc 70%, #f5ddd4 100%)',
                boxShadow: 'inset -1px 0 0 rgba(201,162,74,0.35)',
              }}
              initial={false}
              exit={reduced ? { opacity: 0 } : { x: '-100%' }}
              transition={doorTransition}
            />
            <motion.div
              className="relative h-full w-1/2"
              style={{
                background:
                  'linear-gradient(270deg, #f0cfc4 0%, #f7e4dc 70%, #f5ddd4 100%)',
                boxShadow: 'inset 1px 0 0 rgba(201,162,74,0.35)',
              }}
              initial={false}
              exit={reduced ? { opacity: 0 } : { x: '100%' }}
              transition={doorTransition}
            />
          </div>

          <motion.div
            className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
          >
            <FloralLanternHeader className="mb-4 w-full" />

            <motion.img
              src="/images/icon-lantern.jpg"
              alt=""
              width={72}
              height={72}
              className="mb-5 h-16 w-16 rounded-full object-cover shadow-lg ring-2 ring-gold/40"
              draggable={false}
              animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            <p className="font-script text-[clamp(2rem,1.5rem+2vw,2.85rem)] text-maroon">
              {lang === 'ta' ? 'வரவேற்கிறோம்' : 'Welcome'}
            </p>

            <p className="mt-3 font-sans text-[0.68rem] tracking-[0.28em] text-maroon/70 uppercase">
              Tap to open
            </p>
            <p className="mt-2 font-tamil text-[0.95rem] leading-[1.7] text-gold-ink">
              திறக்க தொடவும்
            </p>

            <motion.div
              className="mt-8 h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent"
              animate={reduced ? undefined : { opacity: [0.35, 1, 0.35], scaleX: [0.7, 1, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
