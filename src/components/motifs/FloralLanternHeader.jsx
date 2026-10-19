import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Floral toran + lanterns — soft-edged, no hard box or circular overlays.
 * @param {'soft'|'plain'} variant - soft uses multiply+feather for light pages; plain for dark doors
 */
export function FloralLanternHeader({ className = '', variant = 'soft' }) {
  const reduced = usePrefersReducedMotion()
  const soft = variant === 'soft'

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
        className="mx-auto block h-auto w-[115%] max-w-none -translate-x-[7.5%] scale-[1.02] object-cover object-top sm:w-full sm:max-w-3xl sm:translate-x-0 sm:object-contain"
        style={
          soft
            ? {
                WebkitMaskImage: `
                  linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%),
                  linear-gradient(180deg, transparent 0%, #000 12%, #000 58%, transparent 100%)
                `,
                maskImage: `
                  linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%),
                  linear-gradient(180deg, transparent 0%, #000 12%, #000 58%, transparent 100%)
                `,
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                mixBlendMode: 'multiply',
              }
            : {
                WebkitMaskImage: `
                  linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%),
                  linear-gradient(180deg, transparent 0%, #000 10%, #000 55%, transparent 100%)
                `,
                maskImage: `
                  linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%),
                  linear-gradient(180deg, transparent 0%, #000 10%, #000 55%, transparent 100%)
                `,
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                mixBlendMode: 'screen',
              }
        }
        draggable={false}
        animate={reduced ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
