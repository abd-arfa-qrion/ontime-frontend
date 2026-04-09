import { IconProps } from "./type"

export default function BookrakIcon({
  fontSize = 20,
  strokeWidth = 1.5,
  className = "",
}: IconProps) {
  return (
  <svg
      width={fontSize}
      height={fontSize}
      viewBox="0 0 25 25"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Buku kiri (lebih pendek) */}
      <rect x="3" y="7" width="5" height="13" rx="1.5" />

      {/* Buku tengah */}
      <rect x="9.5" y="4" width="5.5" height="16" rx="1.5" />

      {/* Buku kanan (bersandar ke kiri) */}
      <rect
        x="16"
        y="5"
        width="5.5"
        height="16"
        rx="1.5"
        transform="rotate(-12 16 5)"
      />
    </svg>
  )
}