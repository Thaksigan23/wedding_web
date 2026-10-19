import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { ScrollReveal } from './ScrollReveal'
import { Kolam } from './motifs/Kolam'

export function BlessingNote() {
  const { lang } = useLanguage()

  return (
    <section
      id="blessing"
      className="section-pad relative bg-blush"
      aria-labelledby="blessing-heading"
    >
      <div className="site-shell">
        <ScrollReveal className="mx-auto max-w-xl text-center md:max-w-2xl" blur>
          <p className="eyebrow mb-6">
            <span lang="en">{wedding.sectionEyebrows.blessing.en}</span>
            <span className="mx-2 text-gold/45">/</span>
            <span lang="ta" className="font-tamil normal-case tracking-normal">
              {wedding.sectionEyebrows.blessing.ta}
            </span>
          </p>

          <h2 id="blessing-heading" className="sr-only">
            {lang === 'ta' ? wedding.blessingNote.title.ta : wedding.blessingNote.title.en}
          </h2>

          {lang === 'en' ? (
            <p className="font-script text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.25] text-maroon">
              {wedding.blessingNote.title.en}
            </p>
          ) : (
            <p className="heading-tamil text-[clamp(1.35rem,1.1rem+1vw,1.85rem)] text-maroon">
              {wedding.blessingNote.title.ta}
            </p>
          )}

          <blockquote
            className="mx-auto mt-7 max-w-prose font-tamil text-[clamp(1.15rem,1rem+0.7vw,1.55rem)] leading-[1.8] text-maroon/85"
            lang="ta"
          >
            “{wedding.blessingNote.body.ta}”
          </blockquote>

          <p
            className="mx-auto mt-5 max-w-lg font-display text-[clamp(1.05rem,0.95rem+0.4vw,1.3rem)] font-light leading-[1.7] text-maroon/50"
            lang="en"
          >
            {wedding.blessingNote.body.en}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mt-12 flex justify-center md:mt-14">
          <div role="separator" aria-hidden="true" className="flex items-center gap-3">
            <img
              src="/images/icon-lantern.jpg"
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-1 ring-gold/40"
              width={36}
              height={36}
            />
            <Kolam className="h-8 w-40 text-gold md:h-9 md:w-52" />
            <img
              src="/images/icon-rings.jpg"
              alt=""
              className="h-9 w-9 rounded-full object-cover ring-1 ring-gold/40"
              width={36}
              height={36}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
