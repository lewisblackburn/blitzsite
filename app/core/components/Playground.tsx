import React from "react"

export function Playground({
  children,
  description,
}: {
  children: React.ReactNode
  description?: string
}) {
  return (
    <div className="mb-6 md:-mx-10 py-5">
      {/* bg-black/20 */}
      <div className="flex items-center justify-center rounded-xl border border-black/40 bg-dots px-6 py-12 md:px-10 md:py-20">
        {children}
      </div>
      {description ? <div className="mt-3 text-sm text-white/60">{description}</div> : null}
    </div>
  )
}
