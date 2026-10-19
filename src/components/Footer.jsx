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

        {/* Made with love — Techloom credit */}
        <div className="mt-12 border-t border-gold/20 pt-8">
          <div className="mb-5 flex justify-center text-gold/55" aria-hidden="true">
            <DiamondDivider className="h-4 w-40 md:w-48" />
          </div>

          <a
            href={creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-col items-center gap-3 rounded-xl px-4 py-2 transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`${t(wedding.footer.madeWithLove)} ${creditName}`}
          >
            <span
              className={`text-[0.72rem] tracking-[0.06em] text-ivory/55 ${
                lang === 'ta' ? 'font-tamil' : 'font-sans'
              }`}
            >
              {t(wedding.footer.madeWithLove)}
            </span>

            <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/25 bg-maroon-deep/40 px-4 py-2 shadow-[inset_0_1px_0_rgba(201,162,74,0.12)] transition group-hover:border-gold/45">
              <img
                src={creditLogo}
                alt=""
                width={36}
                height={36}
                className="h-8 w-8 object-contain md:h-9 md:w-9"
                loading="lazy"
                decoding="async"
              />
              <span className="font-sans text-[0.85rem] font-semibold tracking-[0.02em] text-[#FCEE21]">
                {creditName}
              </span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}

/** Gold diamond / leaf divider matching invite footer style */
function DiamondDivider({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12 C40 12 55 12 78 12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M122 12 C145 12 160 12 192 12"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M28 12 L40 8 L52 12 L40 16 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M148 12 L160 8 L172 12 L160 16 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M100 2 L112 12 L100 22 L88 12 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M100 6 L108 12 L100 18 L92 12 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.85"
      />
      <circle cx="100" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}
