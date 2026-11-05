import { useState } from 'react'

/**
 * Photo frame for couple portraits.
 * Use `composed` when the image already includes its own arch + floral frame
 * so we show the full artwork instead of clipping it into another arch.
 */
export function ArchFrame({
  src,
  alt,
  label,
  className = '',
  parallaxY = 0,
  composed = false,
}) {
  const [failed, setFailed] = useState(!src)

  if (composed) {
    return (
      <div className={`relative mx-auto w-52 ${className}`}>
        <div
          className="relative overflow-hidden rounded-sm bg-maroon-deep"
          style={{
            aspectRatio: '3 / 4',
            boxShadow: '0 16px 32px rgba(0,0,0,0.42)',
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
              className="h-full w-full object-contain"
              onError={() => setFailed(true)}
            />
          ) : (
            <PlaceholderSilhouette label={label} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative mx-auto w-44 ${className}`}>
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
      className="flex h-full w-full flex-col items-end justify-end bg-[#38060D]"
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
