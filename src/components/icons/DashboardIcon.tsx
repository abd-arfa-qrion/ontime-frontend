import { IconProps } from "./type"

export default function DashboardIcon({
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
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}