/**
 * Photorealistic mandap / couple invitation artwork.
 */
export function MandapScene({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.25rem] ${className}`}>
      <img
        src="/images/invite-mandap.jpg"
        alt=""
        width={1200}
        height={900}
        className="mx-auto h-auto w-full max-w-lg object-cover object-center"
        style={{
          maskImage:
            'linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)',
        }}
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(94,18,28,0.45) 0%, transparent 22%, transparent 72%, rgba(31,5,9,0.75) 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
