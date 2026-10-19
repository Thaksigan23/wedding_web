import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/** Kolam that draws itself via stroke-dashoffset */
export function Kolam({ className = '', animate = true }) {
  const reduced = usePrefersReducedMotion()
  const shouldAnimate = animate && !reduced

  const pathProps = (length, delay = 0) =>
    shouldAnimate
      ? {
          initial: { pathLength: 0, opacity: 0.3 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 1.8, delay, ease: 'easeInOut' },
        }
      : { pathLength: 1, opacity: 1 }

  return (
    <svg
      viewBox="0 0 200 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central diamond lattice */}
      <motion.path
        d="M100 8 L130 30 L100 52 L70 30 Z"
        stroke="currentColor"
        strokeWidth="1"
        {...pathProps(120, 0)}
      />
      <motion.path
        d="M100 16 L118 30 L100 44 L82 30 Z"
        stroke="currentColor"
        strokeWidth="0.9"
        {...pathProps(80, 0.3)}
      />
      {/* Side loops */}
      <motion.path
        d="M70 30 Q45 10 20 30 Q45 50 70 30"
        stroke="currentColor"
        strokeWidth="0.9"
        {...pathProps(100, 0.5)}
      />
      <motion.path
        d="M130 30 Q155 10 180 30 Q155 50 130 30"
        stroke="currentColor"
        strokeWidth="0.9"
        {...pathProps(100, 0.5)}
      />
      {/* Dots */}
      {[100, 70, 130, 45, 155, 20, 180].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={30}
          r={2}
          fill="currentColor"
          initial={shouldAnimate ? { opacity: 0, scale: 0 } : undefined}
          whileInView={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: 1 + i * 0.08 }}
        />
      ))}
    </svg>
  )
}
