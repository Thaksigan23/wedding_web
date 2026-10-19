import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { Kolam } from './motifs/Kolam'

function telHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`
}

export function Footer() {
  const { t, lang } = useLanguage()
  const creditUrl = wedding.footer.creditUrl || 'https://techloom.ai'
  const creditName = wedding.footer.creditName || 'techloom.ai'
  const creditLogo = wedding.footer.creditLogo || '/images/techloom-mark.svg'

  return (
    <footer className="band-maroon-deep relative overflow-hidden px-[var(--section-pad-x)] pb-28 pt-14 md:pb-16 md:pt-16">
      <div className="relative z-10 mx-auto max-w-lg text-center">
        <div className="mb-6 flex justify-center text-gold/70" aria-hidden="true">
          <Kolam className="h-7 w-40 md:h-8 md:w-48" animate={false} />
        </div>

        <div className="mb-5 flex justify-center float-soft" aria-hidden="true">
          <img
            src="/images/icon-lantern.jpg"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover shadow-lg ring-2 ring-gold/45"
            draggable={false}
          />
        </div>

        <p
          className={`text-gold ${
            lang === 'ta'
              ? 'font-tamil text-xl leading-[1.7] md:text-2xl'
              : 'font-display text-2xl font-light tracking-wide md:text-3xl'
          }`}
        >
          {t(wedding.footer.blessing)}
        </p>

        <p
          className={`mt-4 text-ivory/75 ${
            lang === 'ta' ? 'font-tamil leading-[1.7]' : 'font-sans text-sm tracking-wide'
          }`}
        >
          {t(wedding.footer.families)}
        </p>

        <ul className="mt-8 flex list-none flex-col items-center gap-3 p-0 sm:flex-row sm:flex-wrap sm:justify-center">
          {(wedding.contacts || []).map((c) => (
            <li key={c.phone}>
              <a
                href={telHref(c.phone)}
                className="inline-flex min-h-[44px] flex-col items-center justify-center rounded-full border border-gold/30 px-5 py-2 transition hover:border-gold/60 hover:bg-maroon/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <span className="font-sans text-[0.6rem] tracking-[0.18em] text-gold/80 uppercase">
                  {t(c.label)}
                </span>
                <span
                  className={`text-sm text-ivory ${
                    lang === 'ta' ? 'font-tamil' : 'font-sans'
                  }`}
                >
                  {c.display || c.phone}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Made with love by + logo only */}
        <div className="mt-12 border-t border-white/10 pt-7">
          <a
            href={creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`${t(wedding.footer.madeWithLove)} ${creditName}`}
          >
            <span
              className={`text-[0.8rem] text-ivory/50 ${
                lang === 'ta' ? 'font-tamil' : 'font-sans'
              }`}
            >
              {t(wedding.footer.madeWithLove)}
            </span>
            <img
              src={creditLogo}
              alt={creditName}
              width={28}
              height={28}
              className="h-6 w-6 object-contain md:h-7 md:w-7"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
