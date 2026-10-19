import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useIsMobile } from '../../hooks/useMediaQuery'

/** Max 8 slow gold particles — desktop only */
export function HeroParticles() {
  const reduced = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${10 + ((i * 11) % 80)}%`,
        top: `${20 + ((i * 13) % 55)}%`,
        size: 2 + (i % 2),
        duration: 9 + (i % 4) * 2,
        delay: i * 0.7,
      })),
    [],
  )

  if (reduced || isMobile) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: 0.35,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
