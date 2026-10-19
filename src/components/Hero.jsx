import { motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { LanguageToggle } from './LanguageToggle'
import { AudioToggle } from './AudioToggle'
import { MandapScene } from './motifs/MandapScene'
import { InviteDateBlock } from './InviteDateBlock'
import { Kolam } from './motifs/Kolam'

const EASE = [0.16, 1, 0.3, 1]

function displayEn(name) {
  return String(name || '').replace(/^\[|\]$/g, '') || name
}

export function Hero({ audioUnlocked }) {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()

  const venue = (wedding.venues || []).find((v) => v.enabled !== false)

  const fade = (delay = 0, y = 16) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        }

  const brideEn = displayEn(wedding.bride.name.en)
  const groomEn = displayEn(wedding.groom.name.en)

  return (
    <section
      id="hero"
      className="invite-wash relative flex min-h-[100svh] flex-col overflow-hidden text-ivory"
    >
      <div className="relative z-20 flex items-start justify-between gap-2 px-[var(--section-pad-x)] pt-5 md:pt-6">
        <LanguageToggle className="!border-gold/40 !bg-maroon-deep/50 !text-ivory" />
        <AudioToggle
          unlocked={audioUnlocked}
          className="!border-gold/40 !bg-maroon-deep/50 !text-ivory"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-8 pt-1 text-center sm:px-8">
        <motion.div className="mb-5 flex justify-center text-gold/75 md:mb-7" {...fade(0.05, 8)}>
          <Kolam className="h-8 w-44 md:h-9 md:w-52" />
        </motion.div>

        <motion.div {...fade(0.15)}>
          {lang === 'ta' ? (
            <h1 className="heading-tamil text-[clamp(1.65rem,1.3rem+1.5vw,2.4rem)] text-ivory">
              {wedding.ceremonyLabel.ta}
            </h1>
          ) : (
            <h1
              className="font-script text-ivory"
              style={{ fontSize: 'clamp(2.4rem, 1.6rem + 3vw, 3.75rem)' }}
            >
              {wedding.ceremonyLabel.en}
            </h1>
          )}
        </motion.div>

        <motion.p
          className={`mx-auto mt-4 max-w-md ${
            lang === 'ta'
              ? 'font-tamil text-sm leading-[1.75] text-ivory/75'
              : 'invite-lead'
          }`}
          {...fade(0.25)}
        >
          {t(wedding.inviteLead)}
        </motion.p>

        <motion.div className="mt-6 md:mt-8" {...fade(0.35)}>
          {lang === 'ta' ? (
            <p className="font-tamil text-[clamp(1.45rem,1.15rem+1.4vw,2.15rem)] leading-[1.65] text-gold">
              {wedding.bride.name.ta}
              <span className="mx-2 font-script text-[1.15em] text-gold/85">&</span>
              {wedding.groom.name.ta}
            </p>
          ) : (
            <p
              className="font-script leading-[1.1] text-gold"
              style={{ fontSize: 'clamp(2.8rem, 1.7rem + 4.5vw, 5rem)' }}
            >
              {brideEn}
              <span className="mx-2 inline-block text-[0.85em]">&</span>
              {groomEn}
            </p>
          )}
          <p
            className={`mt-2 text-ivory/45 ${
              lang === 'ta'
                ? 'font-script text-[clamp(1.35rem,1.1rem+1vw,1.85rem)]'
                : 'font-tamil text-sm leading-[1.7]'
            }`}
          >
            {lang === 'ta'
              ? `${brideEn} & ${groomEn}`
              : `${wedding.bride.name.ta} · ${wedding.groom.name.ta}`}
          </p>
        </motion.div>

        <motion.div className="mt-8 md:mt-10" {...fade(0.48)}>
          <InviteDateBlock light />
        </motion.div>

        <motion.p
          className={`mt-5 font-sans text-[0.72rem] tracking-[0.2em] text-ivory/65 uppercase ${
            lang === 'ta' ? '!font-tamil !normal-case !tracking-normal !text-sm leading-[1.7]' : ''
          }`}
          {...fade(0.55)}
        >
          {t(wedding.muhurtham.nallaNeram)}
        </motion.p>

        {venue && (
          <motion.div className="mt-4" {...fade(0.62)}>
            <p className="font-sans text-[0.58rem] tracking-[0.28em] text-gold/80 uppercase">
              :: {lang === 'ta' ? 'நிகழ்விடம்' : 'Venue'} ::
            </p>
            <p
              className={`mt-1.5 text-sm text-ivory/80 ${
                lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-display text-base tracking-wide'
              }`}
            >
              {t(venue.name)}
            </p>
            <p
              className={`mt-0.5 text-xs text-ivory/50 ${
                lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans tracking-wide'
              }`}
            >
              {t(venue.address)}
            </p>
          </motion.div>
        )}

        <motion.div className="relative mt-auto pt-8 md:pt-10" {...fade(0.7, 24)}>
          <MandapScene className="mx-auto h-auto w-full max-w-lg drop-shadow-sm" />
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
        {...fade(0.9)}
        aria-hidden="true"
      >
        <span className="font-sans text-[0.5rem] tracking-[0.28em] text-ivory/40 uppercase">
          Scroll
        </span>
        <motion.span
          className="block h-7 w-px origin-top bg-gradient-to-b from-gold/50 to-transparent"
          animate={reduced ? undefined : { scaleY: [0.55, 1, 0.55], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
