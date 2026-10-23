import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle({ className = '', compact = false, vertical = false }) {
  const { lang, toggleLang } = useLanguage()

  const pillClass = vertical
    ? 'language-toggle-vertical'
    : `inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-maroon-deep/55 font-sans text-[0.7rem] tracking-[0.12em] text-ivory backdrop-blur-md transition hover:border-gold/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
      }`

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        toggleLang()
      }}
      onPointerDown={(event) => event.stopPropagation()}
      className={`${pillClass} ${className}`}
      aria-label={lang === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்று'}
    >
      {vertical ? (
        <span className="language-toggle-vertical-label">
          <span className={lang === 'ta' ? 'font-tamil text-gold' : 'opacity-40'}>தமிழ்</span>
          <span className="text-ivory/35" aria-hidden="true">
            /
          </span>
          <span className={lang === 'en' ? 'text-gold' : 'opacity-40'}>EN</span>
        </span>
      ) : (
        <>
          <span className={lang === 'ta' ? 'font-tamil text-gold' : 'opacity-40'}>தமிழ்</span>
          <span className="text-ivory/35" aria-hidden="true">
            /
          </span>
          <span className={lang === 'en' ? 'text-gold' : 'opacity-40'}>EN</span>
        </>
      )}
    </button>
  )
}
