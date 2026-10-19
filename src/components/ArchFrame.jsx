import { useState } from 'react'

/**
 * Arch-shaped photo frame with thin gold rim.
 * Falls back to a silhouette if the image is missing or fails to load.
 */
export function ArchFrame({ src, alt, label, className = '', parallaxY = 0 }) {
  const [failed, setFailed] = useState(!src)

  return (
    <div className={`relative mx-auto w-36 md:w-44 ${className}`}>
      <div
        className="arch-frame relative overflow-hidden bg-blush"
        style={{
          aspectRatio: '3 / 4',
          border: '1px solid color-mix(in srgb, var(--color-gold) 55%, transparent)',
          boxShadow: 'inset 0 0 0 3px var(--color-ivory)',
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
      className="flex h-full w-full flex-col items-end justify-end bg-gradient-to-b from-ivory to-blush"
      role="img"
      aria-label={label || 'Photo placeholder'}
    >
      <svg
        viewBox="0 0 120 160"
        className="h-full w-full text-maroon/20"
        aria-hidden="true"
      >
        <circle cx="60" cy="52" r="28" fill="currentColor" />
        <ellipse cx="60" cy="130" rx="42" ry="48" fill="currentColor" />
      </svg>
    </div>
  )
}
