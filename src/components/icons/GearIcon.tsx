import { IconProps } from "./type"

export default function GearIcon({
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
      <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
      <path d="M20.42 13.4l-.51-.29c.05-.37.08-.74.08-1.11s-.03-.74-.08-1.11l.51-.29a2 2 0 0 0 .73-2.73l-1-1.73a2 2 0 0 0-2.73-.73l-.53.31a8.3 8.3 0 0 0-1.9-1.11v-.6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v.6a8.3 8.3 0 0 0-1.9 1.11l-.53-.31a2 2 0 0 0-2.73.73l-1 1.73a2 2 0 0 0 .73 2.73l.51.29a8 8 0 0 0 0 2.22l-.51.29a2 2 0 0 0-.73 2.73l1 1.73a2 2 0 0 0 2.73.73l.53-.31a8.3 8.3 0 0 0 1.9 1.11v.6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-.6a8.3 8.3 0 0 0 1.9-1.11l.53.31a2 2 0 0 0 2.73-.73l1-1.73a2 2 0 0 0-.73-2.73z" />
    </svg>
  )
}