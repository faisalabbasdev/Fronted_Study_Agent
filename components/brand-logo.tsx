import type { HTMLAttributes } from "react"

type BrandLogoProps = HTMLAttributes<HTMLSpanElement> & { priority?: boolean }

export default function BrandLogo({ className = "", priority: _priority, ...props }: BrandLogoProps) {
  return (
    <span className={`tayyar-brand-lockup ${className}`.trim()} {...props}>
      <span className="tayyar-brand-mark" aria-hidden="true">T</span>
      <span className="tayyar-brand-type">
        <strong>Tayyar</strong>
        <small>AI EXAM PREPARATION</small>
      </span>
    </span>
  )
}
