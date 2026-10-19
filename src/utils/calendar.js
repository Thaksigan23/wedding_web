/**
 * Calendar helpers — ICS download + Google Calendar link.
 * Datetimes should be ISO 8601 with offset (e.g. 2026-12-15T09:30:00+05:30).
 */

/** Format a Date as UTC ICS stamp: 20261215T040000Z */
function toIcsUtc(date) {
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

function escapeIcs(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export function buildIcs({ title, description, location, startIso, endIso }) {
  const start = new Date(startIso)
  const end = new Date(endIso || startIso)
  const stamp = toIcsUtc(new Date())
  const uid = `muhurtham-${start.getTime()}@wedding-invite`

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(filename, icsContent) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Google Calendar template URL (dates in UTC compact form) */
export function buildGoogleCalendarUrl({ title, description, location, startIso, endIso }) {
  const start = toIcsUtc(new Date(startIso)).replace(/Z$/, '')
  const end = toIcsUtc(new Date(endIso || startIso)).replace(/Z$/, '')
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
