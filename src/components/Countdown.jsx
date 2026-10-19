import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { getRemaining, isMuhurthamDay } from '../utils/calendar'
import { ScrollReveal } from './ScrollReveal'

function pad(n) {
  return String(n).padStart(2, '0')
}

export function Countdown() {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const target = wedding.muhurtham.datetime

  const [remaining, setRemaining] = useState(() => getRemaining(target))
  const [isToday, setIsToday] = useState(() => isMuhurthamDay(target))

  useEffect(() => {
    const tick = () => {
      setRemaining(getRemaining(target))
      setIsToday(isMuhurthamDay(target))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const units = [
    { key: 'days', value: remaining.days, label: wedding.countdown.days },
    { key: 'hours', value: remaining.hours, label: wedding.countdown.hours },
    { key: 'minutes', value: remaining.minutes, label: wedding.countdown.minutes },
    { key: 'seconds', value: remaining.seconds, label: wedding.countdown.seconds },
  ]

  const showToday = remaining.arrived || isToday

  return (
    <section
      className="band-maroon section-pad relative overflow-hidden"
      aria-labelledby="countdown-heading"
    >
      <KolamFaint />

      <div className="site-shell relative z-10">
        <ScrollReveal className="mb-10 text-center md:mb-12" blur>
          <p className="eyebrow mb-4 !text-gold">
            <span lang="en">{wedding.sectionEyebrows.countdown.en}</span>
            <span className="mx-2 text-gold/40">/</span>
            <span lang="ta" className="font-tamil normal-case tracking-normal">
              {wedding.sectionEyebrows.countdown.ta}
            </span>
          </p>
          <h2
            id="countdown-heading"
            className={`font-light text-ivory ${
              lang === 'ta'
                ? 'font-tamil text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-[1.7]'
                : 'font-script text-[clamp(2.4rem,1.6rem+2.8vw,3.5rem)] leading-[1.2]'
            }`}
          >
            {t(wedding.sectionTitles.countdown)}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <AnimatePresence mode="wait">
            {showToday ? (
              <motion.p
                key="today"
                className="text-center font-display text-[clamp(1.5rem,1.2rem+1.5vw,2.5rem)] font-light leading-snug text-gold"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.45 }}
                role="status"
              >
                <span lang="ta" className="font-tamil">
                  {wedding.countdown.todayMessage.ta}
                </span>
                <span className="mx-3 text-gold/40">/</span>
                <span lang="en">{wedding.countdown.todayMessage.en}</span>
              </motion.p>
            ) : (
              <motion.div
                key="timer"
                className="mx-auto grid max-w-2xl grid-cols-4 gap-2 sm:gap-4"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
              >
                {units.map((u) => (
                  <div
                    key={u.key}
                    className="rounded-[18px] border border-gold/30 px-2 py-4 text-center backdrop-blur-md sm:px-3 sm:py-6"
                    style={{
                      background: 'color-mix(in srgb, var(--color-ivory) 14%, transparent)',
                      minHeight: 92,
                      boxShadow: 'inset 0 1px 0 rgba(196,160,74,0.12)',
                    }}
                  >
                    <Digit value={pad(u.value)} reduced={reduced} />
                    <p className="mt-2 font-sans text-[0.55rem] tracking-[0.16em] text-gold/90 uppercase sm:text-[0.6rem]">
                      <span lang="en">{u.label.en}</span>
                      <span className="mx-1 opacity-40">/</span>
                      <span lang="ta" className="font-tamil normal-case tracking-normal">
                        {u.label.ta}
                      </span>
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center font-sans text-sm text-ivory/70">
            <span className="tracking-[0.14em] text-gold uppercase">
              {lang === 'ta' ? 'திருமணப் பதிவு' : 'Registration'}
            </span>
            <span className="mx-2 text-gold/40">·</span>
            <span className={lang === 'ta' ? 'font-tamil leading-[1.7]' : ''}>
              {t(wedding.muhurtham.dateDisplay)}
            </span>
            <span className="mx-2 text-gold/40">·</span>
            <span className={lang === 'ta' ? 'font-tamil' : ''}>
              {t(wedding.muhurtham.nallaNeram)}
            </span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Digit({ value, reduced }) {
  if (reduced) {
    return (
      <span className="font-display text-[clamp(1.75rem,1.4rem+2vw,3rem)] font-light tabular-nums text-ivory">
        {value}
      </span>
    )
  }

  return (
    <div className="relative flex h-10 items-center justify-center overflow-hidden sm:h-12 md:h-14">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute font-display text-[clamp(1.75rem,1.4rem+2vw,3rem)] font-light tabular-nums text-ivory"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function KolamFaint() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-gold opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="countdown-kolam" width="72" height="72" patternUnits="userSpaceOnUse">
          <path
            d="M36 8 L50 36 L36 64 L22 36 Z M36 20 L44 36 L36 52 L28 36 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#countdown-kolam)" />
    </svg>
  )
}
