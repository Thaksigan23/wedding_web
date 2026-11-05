import { wedding } from '../data/wedding'
import { useLanguage } from '../context/LanguageContext'

const MONTHS = {
  en: [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ],
  ta: [
    'ஜனவரி',
    'பிப்ரவரி',
    'மார்ச்',
    'ஏப்ரல்',
    'மே',
    'ஜூன்',
    'ஜூலை',
    'ஆகஸ்ட்',
    'செப்டம்பர்',
    'அக்டோபர்',
    'நவம்பர்',
    'டிசம்பர்',
  ],
}

const WEEKDAYS = {
  en: [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ],
  ta: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
}

function parseMuhurtham(iso, lang = 'en') {
  const months = MONTHS[lang] || MONTHS.en
  const weekdays = WEEKDAYS[lang] || WEEKDAYS.en
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})T/)
  if (!m) {
    const d = new Date(iso)
    return {
      year: String(d.getFullYear()),
      month: months[d.getMonth()],
      day: String(d.getDate()),
      weekday: weekdays[d.getDay()],
    }
  }
  const year = m[1]
  const monthIndex = Number(m[2]) - 1
  const day = String(Number(m[3]))
  const utc = new Date(Date.UTC(Number(year), monthIndex, Number(m[3]), 12))
  return {
    year,
    month: months[monthIndex],
    day,
    weekday: weekdays[utc.getUTCDay()],
  }
}

/**
 * Formal invite date: MONTH — framed DAY — WEEKDAY with year under the day.
 */
export function InviteDateBlock({ className = '', light = true }) {
  const { lang } = useLanguage()
  const { month, day, weekday, year } = parseMuhurtham(wedding.muhurtham.datetime, lang)
  const label = light ? 'text-gold/85' : 'text-maroon/70'
  const dayTone = light ? 'text-gold' : 'text-maroon'
  const yearTone = light ? 'text-gold/70' : 'text-maroon/55'

  return (
    <div
      className={`invite-date ${className}`}
      role="group"
      aria-label={`${weekday} ${month} ${day}, ${year}`}
    >
      <div className="invite-date-side is-start">
        <span className={`invite-date-caption ${lang === 'ta' ? 'is-ta' : ''} ${label}`}>
          {month}
        </span>
        <DiamondRule />
      </div>

      <div className="invite-date-center">
        <div
          className="invite-date-day"
          style={{
            border: '1px solid color-mix(in srgb, var(--color-gold) 55%, transparent)',
            boxShadow: 'inset 0 0 0 4px color-mix(in srgb, var(--color-maroon) 40%, transparent)',
          }}
        >
          <span className={`invite-date-numeral font-display font-light leading-none tabular-nums ${dayTone}`}>
            {day}
          </span>
        </div>
        <span className={`invite-date-year ${yearTone}`}>{year}</span>
      </div>

      <div className="invite-date-side is-end">
        <DiamondRule />
        <span className={`invite-date-caption ${lang === 'ta' ? 'is-ta' : ''} ${label}`}>
          {weekday}
        </span>
      </div>
    </div>
  )
}

function DiamondRule() {
  return (
    <span className="invite-date-rule" aria-hidden="true">
      <span className="invite-date-rule-line" />
      <span className="invite-date-rule-diamond" />
    </span>
  )
}
