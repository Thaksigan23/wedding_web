import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'
import { FloralCorners, GoldDivider, InviteFrame } from './GoldDivider'

function telHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, '')}`
}

function formatInviteDate(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ''
  return `${Number(m[3])} · ${m[2]} · ${m[1]}`
}

export function Footer() {
  const { t, lang } = useLanguage()
  const creditUrl = wedding.footer.creditUrl || 'https://techloom.ai'
  const creditName = wedding.footer.creditName || 'techloom.ai'
  const creditLogo = wedding.footer.creditLogo || '/images/techloom-mark.svg'

  return (
    <footer className="band-maroon-deep relative overflow-hidden border-t border-gold/25 px-[var(--section-pad-x)] pb-24 pt-14 md:pb-16 md:pt-16">
      <FloralCorners variant="footer" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <InviteFrame className="text-center">
        <GoldDivider className="mb-6" />

        <div className="mx-auto my-3 flex justify-center" aria-hidden="true">
          <img
            src="/images/envelope-monogram.png"
            alt="Vickneshwaran & Pradeepa Monogram"
            className="h-20 w-auto object-contain md:h-24"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 14px rgba(226, 189, 120, 0.3))',
            }}
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className="mt-2 font-display text-sm tracking-[0.32em] text-gold/80">
          {formatInviteDate(wedding.muhurtham.datetime)}
        </p>

        <p
          className={`mt-8 text-gold ${
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
                className="inline-flex min-h-[44px] flex-col items-center justify-center rounded-full border border-gold/35 px-5 py-2 transition hover:border-gold/70 hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
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

        <div className="mt-12 border-t border-gold/15 pt-7">
          <a
            href={creditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-ivory/45 transition hover:text-gold/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label={`${t(wedding.footer.madeWithLove)} ${creditName}`}
          >
            <span
              className={`text-[13px] leading-none tracking-normal ${
                lang === 'ta' ? 'font-tamil' : 'font-sans font-normal'
              }`}
            >
              {t(wedding.footer.madeWithLove)}
            </span>
            <img
              src={creditLogo}
              alt={creditName}
              width={22}
              height={22}
              className="h-[22px] w-[22px] shrink-0 object-contain opacity-80"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
        </InviteFrame>
      </div>
    </footer>
  )
}
