import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle({ className = '', compact = false }) {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-ivory/80 font-sans text-[0.7rem] tracking-[0.12em] text-maroon backdrop-blur-md transition hover:border-gold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
        compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
      } ${className}`}
      aria-label={lang === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாற்று'}
    >
      <span className={lang === 'ta' ? 'font-tamil text-gold-ink' : 'opacity-45'}>தமிழ்</span>
      <span className="text-gold/40" aria-hidden="true">
        /
      </span>
      <span className={lang === 'en' ? 'text-gold-ink' : 'opacity-45'}>EN</span>
    </button>
  )
}
