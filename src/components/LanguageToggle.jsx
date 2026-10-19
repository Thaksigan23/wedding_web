import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle({ className = '', compact = false }) {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-maroon-deep/55 font-sans text-[0.7rem] tracking-[0.12em] text-ivory backdrop-blur-md transition hover:border-gold/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
      } ${className}`}
      aria-label={lang === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்று'}
    >
      <span className={lang === 'ta' ? 'font-tamil text-gold' : 'opacity-40'}>தமிழ்</span>
      <span className="text-ivory/35" aria-hidden="true">
        /
      </span>
      <span className={lang === 'en' ? 'text-gold' : 'opacity-40'}>EN</span>
    </button>
  )
}
