import { IconProps } from "./type"

export default function SearchMenuIcon({
  fontSize = 20,
  strokeWidth = 1.5,
  className = "",
}: IconProps) {
  return (
    <svg
      width={fontSize}
      height={fontSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* search/magnify circle */}
      <path d="M16.5 13.5a4.5 4.5 0 1 0-6.36 0 4.5 4.5 0 0 0 6.36 0z" />

      {/* handle of magnifying glass */}
      <path d="M19.9 16.9l2.41 2.41-1.41 1.41-2.41-2.41" />

      {/* list lines */}
      <path d="M3 5h18" />
      <path d="M3 11h6" />
      <path d="M3 17h6" />
    </svg>
  )
}