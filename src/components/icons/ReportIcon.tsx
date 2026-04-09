import { IconProps } from "./type"

export default function ReportIcon({
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
      <path d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
      <path d="M9 7h6" />
      <path d="M12 12h3" />
      <path d="M12 16h3" />
      <path d="M10 3v4h4V3h-4Z" />
      <path d="M9 12h.01" />
      <path d="M9 16h.01" />
    </svg>
  )
}