/** Photorealistic ceremonial icons for the timeline */

const ICON_SRC = {
  ring: '/images/icon-rings.jpg',
  turmeric: '/images/icon-turmeric.jpg',
  procession: '/images/icon-procession.jpg',
  kumbam: '/images/icon-kumbam.jpg',
  thaali: '/images/icon-thaali.jpg',
  swing: '/images/icon-swing.jpg',
  blessing: '/images/icon-blessing.jpg',
  feast: '/images/icon-feast.jpg',
  lantern: '/images/icon-lantern.jpg',
}

export function TimelineIcon({ name, className = '' }) {
  const src = ICON_SRC[name] ?? ICON_SRC.blessing

  return (
    <img
      src={src}
      alt=""
      width={44}
      height={44}
      className={`object-cover ${className}`}
      draggable={false}
      aria-hidden="true"
    />
  )
}

export function CeremonialIcon({ name = 'lantern', className = '' }) {
  return <TimelineIcon name={name} className={className} />
}
