import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

/**
 * Realistic floral toran + lantern header photo.
 */
export function FloralLanternHeader({ className = '' }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className={`pointer-events-none relative w-full ${className}`} aria-hidden="true">
      <motion.img
        src="/images/floral-lantern-header.jpg"
        alt=""
        width={1200}
        height={675}
        className="mx-auto h-auto w-full max-w-3xl object-contain object-top"
        style={{
          maskImage: 'linear-gradient(180deg, #000 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 55%, transparent 100%)',
        }}
        draggable={false}
        animate={reduced ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Soft floating lantern accents */}
      <div className="absolute inset-x-0 top-[42%] mx-auto flex max-w-2xl justify-between px-[10%] sm:px-[14%]">
        {[0, 1, 2].map((i) => (
          <motion.img
            key={i}
            src="/images/icon-lantern.jpg"
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 rounded-full object-cover shadow-md ring-1 ring-gold/30 sm:h-10 sm:w-10"
            style={{ marginTop: [0, 14, 6][i] }}
            draggable={false}
            animate={reduced ? undefined : { rotate: [-3, 3, -3], y: [0, 4, 0] }}
            transition={{
              duration: 3.6 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.25,
            }}
          />
        ))}
      </div>
    </div>
  )
}
