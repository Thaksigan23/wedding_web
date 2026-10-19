import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ScrollReveal } from './ScrollReveal'
import { SectionHeader } from './SectionHeader'
import { ArchFrame } from './ArchFrame'

export function BrideGroom() {
  const { t } = useLanguage()

  return (
    <section
      id="story"
      className="section-pad relative bg-ivory"
      aria-labelledby="couple-heading"
    >
      <div className="site-shell">
        <SectionHeader
          eyebrowKey="couple"
          titleKey="couple"
          titleId="couple-heading"
          className="!mb-12 md:!mb-16"
        />

        <div className="mx-auto flex max-w-4xl flex-col items-stretch gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 lg:gap-10">
          <PersonCard
            person={wedding.bride}
            role={{ ta: 'மணமகள்', en: 'Bride' }}
            delay={0.05}
            parallaxSign={-1}
          />

          <div className="flex items-center justify-center py-1 md:py-0" aria-hidden="true">
            <span className="font-display text-2xl text-gold md:hidden">&</span>
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
  const { t } = useLanguage()
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
        className="group flex h-full min-h-[44px] flex-col items-center rounded-[20px] border border-maroon/20 bg-ivory px-5 py-8 text-center transition duration-300 md:px-6 md:py-10"
        style={{ boxShadow: 'var(--shadow-soft)' }}
        whileHover={
          reduced
            ? undefined
            : { y: -5, boxShadow: 'var(--shadow-lift)', borderColor: 'rgba(196,160,74,0.55)' }
        }
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div style={{ y }}>
          <ArchFrame src={person.photo} alt={t(person.name)} label={t(role)} />
        </motion.div>

        <p className="mt-5 font-sans text-[0.65rem] tracking-[0.22em] text-gold-ink uppercase">
          {t(role)}
        </p>

        <h3
          className="mt-2 font-display font-light text-maroon"
          style={{ fontSize: 'clamp(1.5rem, 1.25rem + 1vw, 2.15rem)' }}
        >
          {person.name.en}
        </h3>
        <p className="mt-1 font-tamil text-base leading-[1.7] text-maroon/70">
          {person.name.ta}
        </p>

        <p className="mt-4 max-w-[16rem] font-sans text-sm leading-relaxed text-maroon/65">
          {t(person.parents)}
        </p>

        <p className="mt-3 font-sans text-[0.65rem] tracking-[0.2em] text-gold-ink uppercase">
          {t(person.hometown)}
        </p>
      </motion.article>
    </ScrollReveal>
  )
}

function KolamKnot() {
  return (
    <svg
      width="40"
      height="64"
      viewBox="0 0 40 64"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <path
        d="M20 6 L28 18 L20 28 L12 18 Z M20 12 L24 18 L20 22 L16 18 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="20" cy="18" r="1.8" fill="currentColor" />
      <text
        x="20"
        y="52"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Cormorant Garamond, serif"
        fontSize="20"
      >
        &
      </text>
    </svg>
  )
}
