import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'
import { ArchFrame } from './ArchFrame'
import { FloralCorners, GoldDivider, LotusGlyph } from './GoldDivider'

export function BrideGroom() {
  return (
    <section
      id="story"
      className="surface-maroon section-pad relative overflow-hidden"
      aria-labelledby="couple-heading"
    >
      <FloralCorners variant="couple" />
      <div className="site-shell relative z-10">
        <SectionHeader
          titleKey="couple"
          titleId="couple-heading"
          className="!mb-10 md:!mb-14"
        />

        <div className="mx-auto flex max-w-4xl flex-col items-stretch gap-8 md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-8 lg:gap-12">
          <PersonCard
            person={wedding.bride}
            role={{ ta: 'மணமகள்', en: 'Bride' }}
            delay={0.05}
            parallaxSign={-1}
          />

          <div className="flex items-center justify-center py-1 md:pt-28" aria-hidden="true">
            <span className="font-display text-3xl text-gold md:hidden">&</span>
            <span className="hidden md:block">
              <KolamKnot />
            </span>
          </div>

          <PersonCard
            person={wedding.groom}
            role={{ ta: 'மணமகன்', en: 'Groom' }}
            delay={0.12}
            parallaxSign={1}
          />
        </div>
      </div>
    </section>
  )
}

function PersonCard({ person, role, delay, parallaxSign }) {
  const { t, lang } = useLanguage()
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [10 * parallaxSign, -10 * parallaxSign],
  )

  return (
    <ScrollReveal delay={delay} className="h-full">
      <motion.article
        ref={ref}
        className="flex h-full min-h-[44px] flex-col items-center px-2 py-2 text-center md:px-3"
      >
        <motion.div style={{ y }}>
          <ArchFrame src={person.photo} alt={t(person.name)} label={t(role)} />
        </motion.div>

        <p className="mt-6 font-sans text-[0.62rem] tracking-[0.24em] text-gold/85 uppercase">
          {t(role)}
        </p>

        <h3
          className={`mt-2 font-light text-gold-ink ${
            lang === 'ta' ? 'font-tamil leading-[1.5]' : 'font-display'
          }`}
          style={{
            fontSize:
              lang === 'ta'
                ? 'clamp(1.5rem, 1.2rem + 1vw, 2.1rem)'
                : 'clamp(1.65rem, 1.3rem + 1.1vw, 2.35rem)',
          }}
        >
          {t(person.name)}
        </h3>

        <GoldDivider small className="mt-4 mb-4 !w-40" />

        <p
          className={`max-w-[18rem] text-[0.92rem] leading-relaxed text-ivory/72 ${
            lang === 'ta' ? 'font-tamil leading-[1.75]' : 'font-sans'
          }`}
        >
          {t(person.parents)}
        </p>

        <p className="mt-3 inline-flex items-center gap-2 font-sans text-[0.62rem] tracking-[0.2em] text-gold/75 uppercase">
          <LotusGlyph className="h-3 w-3" />
          {t(person.hometown)}
        </p>
      </motion.article>
    </ScrollReveal>
  )
}

function KolamKnot() {
  return (
    <svg
      width="36"
      height="88"
      viewBox="0 0 36 88"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <path d="M18 4v80" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
      <path
        d="M18 28 L26 40 L18 50 L10 40 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="18" cy="40" r="1.6" fill="currentColor" />
      <text
        x="18"
        y="72"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Cormorant Garamond, serif"
        fontSize="18"
      >
        &
      </text>
    </svg>
  )
}
