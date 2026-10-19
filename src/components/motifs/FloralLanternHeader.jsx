import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Floral toran + lanterns — heavily feathered so cream photo edges never show as a hard box.
 * On maroon pages, a matching vignette washes residual light background into the field.
 */
export function FloralLanternHeader({ className = '', variant = 'soft' }) {
  const reduced = usePrefersReducedMotion()
  const onDark = variant === 'plain' || variant === 'dark'

  return (
    <div
      className={`pointer-events-none relative mx-auto w-full max-w-3xl overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.img
        src="/images/floral-lantern-header.jpg"
        alt=""
        width={1200}
        height={675}
        className="mx-auto block h-auto w-[118%] max-w-none -translate-x-[7.5%] scale-[1.04] object-cover object-top sm:w-full sm:max-w-3xl sm:translate-x-0 sm:object-contain"
        style={{
          WebkitMaskImage: `
            linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%),
            linear-gradient(180deg, transparent 0%, #000 16%, #000 48%, transparent 78%)
          `,
          maskImage: `
            linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%),
            linear-gradient(180deg, transparent 0%, #000 16%, #000 48%, transparent 78%)
          `,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
          mixBlendMode: onDark ? 'lighten' : 'multiply',
          filter: onDark ? 'saturate(1.05) contrast(1.05)' : 'none',
        }}
        draggable={false}
        animate={reduced ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Kill leftover photo plate on maroon fields */}
      {onDark && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 28%, transparent 0%, rgba(94,18,28,0.55) 62%, rgba(31,5,9,0.92) 100%),
              linear-gradient(180deg, rgba(31,5,9,0.15) 0%, transparent 35%, rgba(31,5,9,0.75) 100%)
            `,
          }}
        />
      )}
    </div>
  )
}
