/** Slim line-art mango leaf toran for the hero top edge */
export function SlimToran({ className = '' }) {
  const leaves = [24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288]

  return (
    <svg
      viewBox="0 0 312 28"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 6 Q156 18 304 6"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      {leaves.map((x) => (
        <path
          key={x}
          d={`M${x} 8 Q${x - 5} 16 ${x} 24 Q${x + 5} 16 ${x} 8`}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.65"
        />
      ))}
    </svg>
  )
}
