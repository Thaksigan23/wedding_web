export function GoldDivider({ className = '', small = false }) {
  return (
    <div
      className={`gold-divider ${small ? 'gold-divider-sm' : ''} ${className}`}
      aria-hidden="true"
    >
      <span />
      <LotusGlyph className={small ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span />
    </div>
  )
}

export function LotusGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3c-2.3 2.4-3.5 4.6-3.5 6.6 0 1.6 1.3 2.8 3.5 3.3 2.2-.5 3.5-1.7 3.5-3.3C15.5 7.6 14.3 5.4 12 3ZM5 8c-.4 3.2.4 5.3 2.3 6.4 1.1.6 2.3.7 3.6.3C9 11.8 7 9.6 5 8Zm14 0c-2 1.6-4 3.8-5.9 6.7 1.3.4 2.5.3 3.6-.3C18.6 13.3 19.4 11.2 19 8ZM3 14c2 4.4 5 6.6 9 6.6s7-2.2 9-6.6c-2.4 1.6-5.4 2.4-9 2.4S5.4 15.6 3 14Z" />
    </svg>
  )
}

export function FloralCorners({ variant = 'hero' }) {
  return null
}

export function SiteFloralHeader() {
  return (
    <div className="site-floral-header" aria-hidden="true">
      <img src="/images/floral-corner-top.png" alt="" />
      <img src="/images/floral-corner-top.png" alt="" />
    </div>
  )
}

/** Ornamental gold page frame used on inner invitation sections. */
export function InviteFrame({ children, className = '', padded = true }) {
  return (
    <div className={`invite-page ${padded ? 'invite-page-pad' : ''} ${className}`}>
      <div className="invite-page-body">{children}</div>
    </div>
  )
}

export function PageCorners() {
  const corners = [
    'left-0 top-0',
    'right-0 top-0 scale-x-[-1]',
    'left-0 bottom-0 scale-y-[-1]',
    'right-0 bottom-0 scale-[-1]',
  ]
  return (
    <div className="invite-page-corners">
      {corners.map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 72 72"
          className={`absolute h-9 w-9 text-gold/75 sm:h-11 sm:w-11 ${pos}`}
          fill="none"
        >
          <path
            d="M4 68V16Q4 4 16 4h52M8 48V18Q8 8 18 8h30"
            stroke="currentColor"
            strokeWidth="1.15"
          />
          <path d="M12 16c5-1 9-5 10-10" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      ))}
    </div>
  )
}

export function JewelGlyph({ className = '' }) {
  return (
    <svg
      viewBox="0 0 18 18"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 1.4 15.4 9 9 16.6 2.6 9Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
      <circle cx="9" cy="9" r="1.35" fill="currentColor" />
    </svg>
  )
}

export function OrnamentRule({ className = '' }) {
  return (
    <div className={`invite-letter-ornament ${className}`} aria-hidden="true">
      <span />
      <i />
      <LotusGlyph className="h-3.5 w-3.5" />
      <i />
      <span />
    </div>
  )
}

/** Triple-line corner flourish for the inner invitation letter. */
export function LetterCorners() {
  const corners = [
    'left-0 top-0',
    'right-0 top-0 scale-x-[-1]',
    'left-0 bottom-0 scale-y-[-1]',
    'right-0 bottom-0 scale-[-1]',
  ]
  return (
    <div className="invite-letter-corners">
      {corners.map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 92 92"
          className={`absolute h-11 w-11 text-[#C9A052]/80 sm:h-[4.1rem] sm:w-[4.1rem] ${pos}`}
          fill="none"
        >
          <path
            d="M4 88V20Q4 4 20 4h68M8 61V22Q8 8 22 8h39M12 39V24Q12 12 24 12h15"
            stroke="currentColor"
            strokeWidth="1.15"
          />
          <path
            d="M13 20q9-2 9-11m-8 17q12-2 12-14m-2 17q10-2 11-12"
            stroke="currentColor"
            strokeWidth=".75"
          />
          <path d="M6 18c6-1 11-6 12-12" stroke="currentColor" strokeWidth=".8" />
        </svg>
      ))}
    </div>
  )
}

/** Soft lotus mandala behind the couple names. */
export function LetterEmblem({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`invite-letter-emblem ${className}`}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="0.45" />
      <circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" strokeWidth="0.4" />
      <circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" strokeWidth="0.55" />
      <circle cx="100" cy="100" r="12" fill="none" stroke="currentColor" strokeWidth="0.7" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
        const x = 100 + Math.cos(a) * 54
        const y = 100 + Math.sin(a) * 54
        const deg = (a * 180) / Math.PI + 90
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="8"
            ry="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.45"
            transform={`rotate(${deg} ${x} ${y})`}
          />
        )
      })}
    </svg>
  )
}

export function MandalaWatermark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute top-1/2 left-1/2 z-0 h-[min(72vw,28rem)] w-[min(72vw,28rem)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.07] ${className}`}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="28" fill="none" stroke="currentColor" strokeWidth="0.7" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2
        const x = 100 + Math.cos(a) * 48
        const y = 100 + Math.sin(a) * 48
        const deg = (a * 180) / Math.PI + 90
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="10"
            ry="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.55"
            transform={`rotate(${deg} ${x} ${y})`}
          />
        )
      })}
    </svg>
  )
}
