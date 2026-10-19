import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Modern scroll reveal — fade + lift (+ optional blur).
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 24,
  blur = false,
  as = 'div',
  once = true,
  amount = 0.22,
}) {
  const reduced = usePrefersReducedMotion()
  const Component = motion[as] ?? motion.div

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <Component
      className={className}
      initial={{
        opacity: 0,
        y,
        filter: blur ? 'blur(6px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </Component>
  )
}
