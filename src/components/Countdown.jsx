import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { getRemaining, isMuhurthamDay } from '../utils/calendar'
import { ScrollReveal } from './ScrollReveal'
import { FloralCorners, GoldDivider, InviteFrame, LotusGlyph, OrnamentRule } from './GoldDivider'

function pad(n) {
  return String(n).padStart(2, '0')
}

function useWeddingCountdown() {
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

  return {
    remaining,
    showToday: remaining.arrived || isToday,
    units: [
      { key: 'days', value: remaining.days, label: wedding.countdown.days },
      { key: 'hours', value: remaining.hours, label: wedding.countdown.hours },
      { key: 'minutes', value: remaining.minutes, label: wedding.countdown.minutes },
      { key: 'seconds', value: remaining.seconds, label: wedding.countdown.seconds },
    ],
  }
}

/** Ivory countdown band used on the opening cover. */
export function CoverCountdown() {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const { units, showToday } = useWeddingCountdown()

  return (
    <div className="cover-countdown">
      <p className={`cover-countdown-kicker ${lang === 'ta' ? 'is-ta' : ''}`}>
        {t(wedding.sectionEyebrows.countdown)}
      </p>

      <AnimatePresence mode="wait">
        {showToday ? (
          <motion.p
            key="today"
            className={`cover-countdown-today ${lang === 'ta' ? 'is-ta' : ''}`}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0 }}
            role="status"
          >
            {t(wedding.countdown.todayMessage)}
          </motion.p>
        ) : (
          <motion.div
            key="timer"
            className="cover-countdown-row"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
          >
            {units.map((u) => (
              <div key={u.key} className="cover-countdown-unit">
                <Digit value={pad(u.value)} reduced={reduced} compact />
                <p className={`cover-countdown-label ${lang === 'ta' ? 'is-ta' : ''}`}>
                  {t(u.label)}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <OrnamentRule className="cover-countdown-rule" />
    </div>
  )
}

export function Countdown() {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const { units, showToday } = useWeddingCountdown()

  return (
    <section
      id="countdown"
      className="band-maroon section-pad relative overflow-hidden"
      aria-labelledby="countdown-heading"
    >
      <FloralCorners variant="countdown" />

      <div className="site-shell relative z-10">
        <ScrollReveal className="mx-auto max-w-3xl">
          <InviteFrame>
            <div className="text-center">
              <h2
                id="countdown-heading"
                className={`font-light text-gold-ink ${
                  lang === 'ta'
                    ? 'font-tamil text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-[1.7]'
                    : 'font-script text-[clamp(2.4rem,1.6rem+2.8vw,3.5rem)] leading-[1.2]'
                }`}
              >
                {t(wedding.sectionTitles.countdown)}
              </h2>
              <GoldDivider small className="mt-5 mb-8 md:mb-10" />

              <AnimatePresence mode="wait">
                {showToday ? (
                  <motion.p
                    key="today"
                    className={`font-light leading-snug text-gold ${
                      lang === 'ta'
                        ? 'font-tamil text-[clamp(1.35rem,1.1rem+1.2vw,2.1rem)]'
                        : 'font-display text-[clamp(1.5rem,1.2rem+1.5vw,2.5rem)]'
                    }`}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    role="status"
                  >
                    {t(wedding.countdown.todayMessage)}
                  </motion.p>
                ) : (
                  <motion.div
                    key="timer"
                    className="mx-auto flex w-full max-w-2xl items-stretch justify-center"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                  >
                    {units.map((u, i) => (
                      <div key={u.key} className="flex min-w-0 flex-1 items-stretch sm:flex-none">
                        {i > 0 && (
                          <div
                            className="mx-0.5 flex flex-col items-center justify-center text-gold/50 sm:mx-3"
                            aria-hidden="true"
                          >
                            <LotusGlyph className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 px-0.5 text-center sm:min-w-[5.5rem] sm:flex-none sm:px-2">
                          <Digit value={pad(u.value)} reduced={reduced} />
                          <p
                            className={`mt-2 text-[0.5rem] text-gold/90 sm:text-[0.6rem] ${
                              lang === 'ta'
                                ? 'font-tamil normal-case tracking-normal'
                                : 'font-sans tracking-[0.1em] uppercase sm:tracking-[0.16em]'
                            }`}
                          >
                            {t(u.label)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="invite-countdown-meta">
                <span className="invite-countdown-meta-label">
                  {lang === 'ta' ? 'திருமணப் பதிவு' : 'Registration'}
                </span>
                <span className="invite-countdown-meta-dot" aria-hidden="true">
                  ·
                </span>
                <span
                  className={`invite-countdown-meta-date ${
                    lang === 'ta' ? 'font-tamil leading-[1.7]' : ''
                  }`}
                >
                  {t(wedding.muhurtham.dateDisplay)}
                </span>
                <span className="invite-countdown-meta-dot" aria-hidden="true">
                  ·
                </span>
                <span className={lang === 'ta' ? 'font-tamil' : ''}>
                  {t(wedding.muhurtham.nallaNeram)}
                </span>
              </p>
            </div>
          </InviteFrame>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Digit({ value, reduced, compact = false }) {
  if (reduced) {
    return (
      <span className={compact ? 'cover-countdown-numeral' : 'countdown-numeral'}>{value}</span>
    )
  }

  return (
    <div className={compact ? 'cover-countdown-digit' : 'relative flex h-12 items-center justify-center overflow-hidden sm:h-14'}>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className={compact ? 'cover-countdown-numeral' : 'countdown-numeral absolute'}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
