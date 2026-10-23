import { motion } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { LanguageToggle } from './LanguageToggle'
import { AudioToggle } from './AudioToggle'
import { InviteDateBlock } from './InviteDateBlock'
import {
  FloralCorners,
  JewelGlyph,
  LetterEmblem,
  LotusGlyph,
  OrnamentRule,
} from './GoldDivider'

const EASE = [0.16, 1, 0.3, 1]

function displayEn(name) {
  return String(name || '').replace(/^\[|\]$/g, '') || name
}

export function Hero({ audioUnlocked }) {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()

  const venue = (wedding.venues || []).find((v) => v.enabled !== false)

  const fade = (delay = 0, y = 14) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: EASE },
        }

  const brideEn = displayEn(wedding.bride.name.en)
  const groomEn = displayEn(wedding.groom.name.en)

  return (
    <section id="hero" className="invite-letter">
      <FloralCorners variant="hero" />

      <div className="invite-letter-bar">
        <AudioToggle className="invite-control" unlocked={audioUnlocked} />
        <LanguageToggle compact className="invite-control" />
      </div>

      <div className="invite-letter-shell">
        <article className="invite-letter-card">
          <LetterEmblem />

          <div className="invite-letter-body">
            <motion.div className="invite-letter-invocation" {...fade(0.06)}>
              <JewelGlyph className="invite-letter-jewel" />
              <p className={`invite-letter-mantra ${lang === 'en' ? 'is-en' : ''}`}>
                {lang === 'ta' ? '|| ஸ்ரீ கணபதயே நம: ||' : '|| Sri Ganapataye Namah ||'}
              </p>
              <JewelGlyph className="invite-letter-jewel" />
            </motion.div>

            <motion.p
              className={`invite-letter-blessing ${lang === 'en' ? 'is-en' : ''}`}
              {...fade(0.12)}
            >
              {t(wedding.invocation.pillaiyar)}
            </motion.p>

            <motion.div className="invite-letter-rule-wrap" {...fade(0.18)}>
              <OrnamentRule />
            </motion.div>

            <motion.div {...fade(0.24, 18)}>
              {lang === 'ta' ? (
                <h1 className="invite-letter-title">{wedding.ceremonyLabel.ta}</h1>
              ) : (
                <h1 className="invite-letter-title-en">{wedding.ceremonyLabel.en}</h1>
              )}
            </motion.div>

            <motion.p
              className={`invite-letter-lead ${lang === 'ta' ? 'is-ta' : 'is-en'}`}
              {...fade(0.32)}
            >
              {t(wedding.inviteLead)}
            </motion.p>

            <motion.div className="invite-letter-names" {...fade(0.4, 16)}>
              {lang === 'ta' ? (
                <>
                  <p className="invite-letter-name-ta">{wedding.bride.name.ta}</p>
                  <p className="invite-letter-amp" aria-hidden="true">
                    &
                  </p>
                  <p className="invite-letter-name-ta">{wedding.groom.name.ta}</p>
                </>
              ) : (
                <p className="invite-letter-name-script">
                  <span>{brideEn}</span>
                  <span className="invite-letter-amp is-inline">&</span>
                  <span>{groomEn}</span>
                </p>
              )}
            </motion.div>

            <motion.p
              className={`invite-letter-together ${lang === 'en' ? 'is-en' : ''}`}
              {...fade(0.46)}
            >
              {t(wedding.togetherWith)}
            </motion.p>

            <motion.div className="invite-letter-split" {...fade(0.52)}>
              <FamilyLine
                lang={lang}
                label={lang === 'ta' ? 'மணமகள்' : 'Bride'}
                name={lang === 'ta' ? wedding.bride.name.ta : brideEn}
                parents={t(wedding.bride.parents)}
              />
              <div className="invite-letter-split-rule" aria-hidden="true">
                <span />
                <LotusGlyph className="h-3 w-3" />
                <span />
              </div>
              <FamilyLine
                lang={lang}
                label={lang === 'ta' ? 'மணமகன்' : 'Groom'}
                name={lang === 'ta' ? wedding.groom.name.ta : groomEn}
                parents={t(wedding.groom.parents)}
              />
            </motion.div>

            <motion.div className="invite-letter-rule-wrap is-later" {...fade(0.58)}>
              <OrnamentRule />
            </motion.div>

            <motion.div {...fade(0.64)}>
              <InviteDateBlock light />
            </motion.div>

            <motion.p
              className={`invite-letter-time ${lang === 'ta' ? 'is-ta' : 'is-en'}`}
              {...fade(0.7)}
            >
              {t(wedding.muhurtham.nallaNeram)}
            </motion.p>

            {venue && (
              <motion.div className="invite-letter-venue" {...fade(0.76)}>
                <p className={`invite-letter-venue-label ${lang === 'ta' ? 'is-ta' : ''}`}>
                  :: {lang === 'ta' ? 'நிகழ்விடம்' : 'Venue'} ::
                </p>
                <p className={`invite-letter-venue-name ${lang === 'ta' ? 'is-ta' : 'is-en'}`}>
                  {t(venue.name)}
                </p>
                <p className={`invite-letter-venue-addr ${lang === 'ta' ? 'is-ta' : 'is-en'}`}>
                  {t(venue.address)}
                </p>
              </motion.div>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

function FamilyLine({ lang, label, name, parents }) {
  return (
    <div className="invite-letter-family">
      <p className={`invite-letter-family-label ${lang === 'ta' ? 'is-ta' : ''}`}>{label}</p>
      <p className={`invite-letter-family-name ${lang === 'ta' ? 'is-ta' : 'is-en'}`}>{name}</p>
      <p className={`invite-letter-family-parents ${lang === 'ta' ? 'is-ta' : 'is-en'}`}>
        {parents}
      </p>
    </div>
  )
}
