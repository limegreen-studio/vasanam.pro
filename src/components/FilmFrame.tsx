import type { ReactNode } from "react"

/**
 * FilmFrame — a single exposed frame of the strip that holds the typing
 * stage. The perforations now live on the outer ReelStrip, so this reads as
 * the lit frame in the middle of the film: a slate label on top, the image
 * area with concentric radius + layered shadow depth (no hard border), and a
 * status strip beneath.
 */
export function FilmFrame({
  sceneLabel,
  children,
}: {
  sceneLabel: string
  children: ReactNode
}) {
  return (
    // Principle 1: outer radius (16px) = inner radius (12px) + padding (~4px).
    // Principle 3: depth from layered box-shadow instead of a hard border.
    <div className="relative rounded-2xl bg-surface-2/80 p-1.5 shadow-[0_1px_0_rgba(255,255,255,0.04),0_2px_6px_rgba(0,0,0,0.5),0_24px_50px_-24px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="grain rounded-2xl" />

      <div className="flex items-center justify-between px-4 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint md:px-5">
        <span className="text-gold/80">● {sceneLabel}</span>
        <span>vasanam · 35mm</span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-bg-soft shadow-[inset_0_1px_2px_rgba(0,0,0,0.6),inset_0_0_60px_rgba(0,0,0,0.4)]">
        {children}
      </div>
    </div>
  )
}
