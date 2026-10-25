import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { ScrollReveal } from './ScrollReveal'
import { FloralCorners, GoldDivider, InviteFrame, MandalaWatermark } from './GoldDivider'

export function BlessingNote() {
  const { lang } = useLanguage()

  return (
    <section
      id="blessing"
      className="surface-maroon-soft section-pad relative overflow-hidden"
      aria-labelledby="blessing-heading"
    >
      <FloralCorners variant="blessing" />
      <div className="site-shell relative z-10">
        <ScrollReveal className="mx-auto max-w-3xl">
          <InviteFrame className="overflow-hidden">
            <MandalaWatermark />
            <div className="relative z-10 mx-auto max-w-xl text-center">
              <h2 id="blessing-heading" className="sr-only">
                {lang === 'ta' ? wedding.blessingNote.title.ta : wedding.blessingNote.title.en}
              </h2>

              {lang === 'en' ? (
                <p className="font-script text-[clamp(2rem,1.4rem+2vw,3rem)] leading-[1.25] text-gold-ink">
                  {wedding.blessingNote.title.en}
                </p>
              ) : (
                <p className="heading-tamil text-[clamp(1.4rem,1.15rem+1vw,1.95rem)] text-gold-ink">
                  {wedding.blessingNote.title.ta}
                </p>
              )}

              <GoldDivider small className="mt-5" />

              {lang === 'ta' ? (
                <blockquote
                  className="mx-auto mt-7 max-w-prose font-tamil text-[clamp(1.12rem,1rem+0.55vw,1.45rem)] leading-[1.9] text-ivory/90"
                  lang="ta"
                >
                  “{wedding.blessingNote.body.ta}”
                </blockquote>
              ) : (
                <blockquote
                  className="mx-auto mt-7 max-w-lg font-display text-[clamp(1.02rem,0.94rem+0.35vw,1.22rem)] font-light leading-[1.75] text-ivory/80"
                  lang="en"
                >
                  “{wedding.blessingNote.body.en}”
                </blockquote>
              )}
            </div>
          </InviteFrame>
        </ScrollReveal>
      </div>
    </section>
  )
}
