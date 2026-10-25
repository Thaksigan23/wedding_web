/**
 * Calendar helpers — Google Calendar link and countdown.
 * Datetimes should be ISO 8601 with offset (e.g. 2026-12-15T09:30:00+05:30).
 */

/** Format a Date as UTC compact stamp: 20261215T040000Z */
function toUtcStamp(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

/** Google Calendar template URL (dates in UTC compact form) */
export function buildGoogleCalendarUrl({ title, description, location, startIso, endIso }) {
  const start = toUtcStamp(new Date(startIso)).replace(/Z$/, '')
  const end = toUtcStamp(new Date(endIso || startIso)).replace(/Z$/, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    location,
    dates: `${start}/${end}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function getRemaining(targetIso, now = Date.now()) {
  const target = new Date(targetIso).getTime()
  const diff = target - now

  if (Number.isNaN(target) || diff <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, arrived: true }
  }

  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)

  return { total: diff, days, hours, minutes, seconds, arrived: false }
}

/** True if "today" in Sri Lanka (Asia/Colombo) matches the muhurtham calendar day */
export function isMuhurthamDay(targetIso, now = new Date()) {
  const fmt = (d) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Colombo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d)

  return fmt(now) === fmt(new Date(targetIso))
}

export function buildWhatsAppShareUrl(message, url) {
  const text = `${message} ${url}`.trim()
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
