import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { ScrollReveal } from './ScrollReveal'

/**
 * Consistent bilingual eyebrow + section heading.
 * eyebrowKey: key on wedding.sectionEyebrows
 * titleKey: key on wedding.sectionTitles
 */
export function SectionHeader({
  eyebrowKey,
  titleKey,
  titleId,
  light = false,
  className = '',
}) {
  const { t, lang } = useLanguage()
  const eyebrow = wedding.sectionEyebrows[eyebrowKey]
  const title = wedding.sectionTitles[titleKey]

  return (
    <ScrollReveal className={`mb-10 text-center md:mb-14 ${className}`} blur>
      {eyebrow && (
        <p className={`eyebrow mb-4 ${light ? '!text-gold !opacity-100' : ''}`}>
          <span lang="en">{eyebrow.en}</span>
          <span className={`mx-2 ${light ? 'text-gold/40' : 'text-maroon/30'}`}>/</span>
          <span lang="ta" className="font-tamil normal-case tracking-normal">
            {eyebrow.ta}
          </span>
        </p>
      )}
      <h2
        id={titleId}
        className={`${
          lang === 'ta'
            ? 'heading-tamil text-[clamp(1.65rem,1.3rem+1.4vw,2.5rem)]'
            : 'font-script text-[clamp(2.35rem,1.6rem+2.8vw,3.65rem)] leading-[1.2]'
        } ${light ? '!text-ivory' : 'text-maroon'}`}
      >
        {t(title)}
      </h2>
    </ScrollReveal>
  )
}
