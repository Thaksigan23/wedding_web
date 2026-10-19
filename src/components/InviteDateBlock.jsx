import { wedding } from '../data/wedding'

const MONTHS = [
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
]

const WEEKDAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

function parseMuhurtham(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})T/)
  if (!m) {
    const d = new Date(iso)
    return {
      year: String(d.getFullYear()),
      month: MONTHS[d.getMonth()],
      day: String(d.getDate()),
      weekday: WEEKDAYS[d.getDay()],
    }
  }
  const year = m[1]
  const monthIndex = Number(m[2]) - 1
  const day = String(Number(m[3]))
  const utc = new Date(Date.UTC(Number(year), monthIndex, Number(m[3]), 12))
  return {
    year,
    month: MONTHS[monthIndex],
    day,
    weekday: WEEKDAYS[utc.getUTCDay()],
  }
}

/**
 * Formal invite date: MONTH — framed DAY — WEEKDAY with year under the day.
 */
export function InviteDateBlock({ className = '', light = true }) {
  const { month, day, weekday, year } = parseMuhurtham(wedding.muhurtham.datetime)
  const label = light ? 'text-gold/85' : 'text-maroon/70'
  const dayTone = light ? 'text-gold' : 'text-maroon'
  const yearTone = light ? 'text-gold/70' : 'text-maroon/55'

  return (
    <div
      className={`mx-auto flex max-w-lg items-center justify-center gap-2 sm:gap-4 ${className}`}
      role="group"
      aria-label={`${weekday} ${month} ${day}, ${year}`}
    >
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span className={`font-sans text-[0.62rem] font-medium tracking-[0.28em] uppercase sm:text-[0.72rem] ${label}`}>
          {month}
        </span>
        <DiamondRule />
      </div>

      <div className="relative flex flex-col items-center px-3 sm:px-4">
        <div
          className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center sm:h-[5.25rem] sm:w-[5.25rem]"
          style={{
            border: '1px solid color-mix(in srgb, var(--color-gold) 55%, transparent)',
            boxShadow: 'inset 0 0 0 4px color-mix(in srgb, var(--color-maroon) 40%, transparent)',
          }}
        >
          <span
            className={`font-display font-light leading-none tabular-nums ${dayTone}`}
            style={{ fontSize: 'clamp(2.35rem, 1.9rem + 2vw, 3.35rem)' }}
          >
            {day}
          </span>
        </div>
        <span className={`mt-2 font-sans text-[0.58rem] tracking-[0.32em] ${yearTone}`}>
          {year}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-start gap-2">
        <DiamondRule />
        <span className={`font-sans text-[0.62rem] font-medium tracking-[0.28em] uppercase sm:text-[0.72rem] ${label}`}>
          {weekday}
        </span>
      </div>
    </div>
  )
}

function DiamondRule() {
  return (
    <span className="hidden items-center gap-1.5 text-gold/50 sm:inline-flex" aria-hidden="true">
      <span className="h-px w-6 bg-current sm:w-10" />
      <span className="inline-block h-1.5 w-1.5 rotate-45 border border-current" />
    </span>
  )
}
