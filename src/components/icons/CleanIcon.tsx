import { IconProps } from "./type"

export default function CleanIcon({
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
      {/* outline main pencil shape */}
      <path d="M20.29 2.29l-5.27 5.27-2.12-2.12c-.76-.76-2.07-.76-2.83 0l-.62.62-6.97 4.18c-.26.16-.44.43-.48.74s.07.61.29.83l9.9 9.9c.19.19.44.29.71.29h.12c.31-.04.58-.21.74-.48l4.18-6.97.62-.62c.78-.78.78-2.05 0-2.83l-2.12-2.12 5.27-5.27z" />

      {/* inner detail line */}
      <path d="M12.7 19.38 4.61 11.3l5.3-3.18 2.98 2.98 2.98 2.98-3.18 5.3z" />
    </svg>
  )
}