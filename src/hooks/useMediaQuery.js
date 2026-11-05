import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const onChange = (e) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True below Tailwind `md` (768px) — used to lighten particle effects */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)')
}

/** Desktop/tablet uses a centered phone shell, so invite chrome stays mobile-style. */
export function usePhoneShell() {
  return useMediaQuery('(min-width: 768px)')
}

/** Compact invite chrome: real phones, or the desktop phone shell. */
export function useCompactChrome() {
  const isMobile = useIsMobile()
  const phoneShell = usePhoneShell()
  return isMobile || phoneShell
}
