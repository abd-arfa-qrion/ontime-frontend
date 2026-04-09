import { IconProps } from "./type"

export default function AnnounceIcon({
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
      {/* pencil body */}
      <path d="M4 10h3v4H4z" />

      {/* pencil tip */}
      <path d="M20 18.55 9 14.32V9.68l11-4.23z" />

      {/* shading / accent lines */}
      <path d="M13.39 19l-3.14-1.26.44-1.32 3.15 1.21-.45 1.36z" />
    </svg>
  )
}