import { useState } from 'react'

/**
 * Arch-shaped photo frame with thin gold rim.
 * Falls back to a silhouette if the image is missing or fails to load.
 */
export function ArchFrame({ src, alt, label, className = '', parallaxY = 0 }) {
  const [failed, setFailed] = useState(!src)

  return (
    <div className={`relative mx-auto w-44 md:w-56 ${className}`}>
      <div
        className="arch-frame relative overflow-hidden bg-maroon-deep"
        style={{
          aspectRatio: '3 / 4',
          border: '1px solid color-mix(in srgb, var(--color-gold) 78%, transparent)',
          boxShadow:
            'inset 0 0 0 5px color-mix(in srgb, var(--color-gold) 22%, transparent), 0 14px 28px rgba(0,0,0,0.38)',
          transform: parallaxY ? `translateY(${parallaxY}px)` : undefined,
          willChange: parallaxY ? 'transform' : undefined,
        }}
      >
        {!failed ? (
          <img
            src={src}
            alt={alt}
            width={480}
            height={640}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <PlaceholderSilhouette label={label} />
        )}
      </div>
    </div>
  )
}

function PlaceholderSilhouette({ label }) {
  return (
    <div
      className="flex h-full w-full flex-col items-end justify-end bg-gradient-to-b from-[#480912] to-[#240309]"
      role="img"
      aria-label={label || 'Photo placeholder'}
    >
      <svg
        viewBox="0 0 120 160"
        className="h-full w-full text-gold/20"
        aria-hidden="true"
      >
        <circle cx="60" cy="52" r="28" fill="currentColor" />
        <ellipse cx="60" cy="130" rx="42" ry="48" fill="currentColor" />
      </svg>
    </div>
  )
}
