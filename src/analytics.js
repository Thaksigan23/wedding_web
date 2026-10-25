/**
 * Google Analytics 4 — inspect visitor counts at analytics.google.com
 * (not shown on the invitation).
 *
 * 1. Create a GA4 property and copy the Measurement ID (G-XXXXXXXX).
 * 2. Paste it into `.env` as VITE_GA_MEASUREMENT_ID=G-XXXXXXXX
 * 3. Restart Vite.
 * 4. View Realtime + Reports in analytics.google.com.
 *
 * Missing ID → this module is a no-op; the site still works.
 */

const MEASUREMENT_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim()
const ENABLED = MEASUREMENT_ID.length > 0

let started = false
let lastPath = ''

function gtag() {
  window.dataLayer.push(arguments)
}

function currentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}` || '/'
}

export function trackPageView(path) {
  if (!ENABLED || typeof window === 'undefined') return
  const pagePath = path || currentPath()
  if (pagePath === lastPath) return
  lastPath = pagePath
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
  })
}

export function initAnalytics() {
  if (!ENABLED || started || typeof window === 'undefined') return
  started = true

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || gtag

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

  trackPageView(currentPath())
  window.addEventListener('hashchange', () => trackPageView())
}
