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
  // Parse as calendar date in +05:30 without shifting weekday
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
  // Weekday for Y-M-D at noon UTC avoids DST edge cases
  const utc = new Date(Date.UTC(Number(year), monthIndex, Number(m[3]), 12))
  return {
    year,
    month: MONTHS[monthIndex],
    day,
    weekday: WEEKDAYS[utc.getUTCDay()],
  }
}

/**
 * Invitation-card date: MONTH | DAY | WEEKDAY with year under the day.
 */
export function InviteDateBlock({ className = '' }) {
  const { month, day, weekday, year } = parseMuhurtham(wedding.muhurtham.datetime)

  return (
    <div
      className={`mx-auto flex max-w-md items-center justify-center gap-3 sm:gap-5 ${className}`}
      role="group"
      aria-label={`${weekday} ${month} ${day}, ${year}`}
    >
      <p className="min-w-0 flex-1 text-right font-sans text-[0.62rem] font-medium tracking-[0.22em] text-maroon/70 uppercase sm:text-[0.7rem]">
        {month}
      </p>

      <div className="h-10 w-px bg-gold/55 sm:h-12" aria-hidden="true" />

      <div className="flex flex-col items-center px-1">
        <span
          className="font-display font-light leading-none text-maroon tabular-nums"
          style={{ fontSize: 'clamp(2.5rem, 2rem + 2.5vw, 3.75rem)' }}
        >
          {day}
        </span>
        <span className="mt-0.5 font-sans text-[0.58rem] tracking-[0.28em] text-maroon/55">
          {year}
        </span>
      </div>

      <div className="h-10 w-px bg-gold/55 sm:h-12" aria-hidden="true" />

      <p className="min-w-0 flex-1 text-left font-sans text-[0.62rem] font-medium tracking-[0.22em] text-maroon/70 uppercase sm:text-[0.7rem]">
        {weekday}
      </p>
    </div>
  )
}
