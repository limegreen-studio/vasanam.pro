import type { ReactNode } from "react"

/**
 * A single perforated rail. Renders a tall run of sprocket holes at a fixed
 * pitch; the rail clips overflow so the perforations always fill the strip
 * edge-to-edge no matter how tall the content is (just like real film — the
 * holes keep going). Every eighth hole carries a faint maroon frame marker,
 * echoing the edge-print numbers on a 35mm strip.
 */
function Rail({ side }: { side: "left" | "right" }) {
  const HOLES = 60
  return (
    <div className={`reel-rail reel-rail--${side}`} aria-hidden="true">
      {Array.from({ length: HOLES }).map((_, i) => {
        const showMark = side === "right" && i > 0 && i % 8 === 0
        return showMark ? (
          <span key={i} className="reel-frame-mark">
            {String(Math.floor(i / 8) * 12).padStart(2, "0")}A
          </span>
        ) : (
          <span key={i} className="sprocket" />
        )
      })}
    </div>
  )
}

/**
 * ReelStrip — wraps the entire site so it reads as one continuous strip of
 * 35mm film: textured emulsion, edge shading, and prominent perforations
 * running down both sides. Content sits in the exposed frame area between
 * the rails.
 */
export function ReelStrip({ children }: { children: ReactNode }) {
  return (
    <div className="reel">
      <Rail side="left" />
      <div className="relative z-[3]">{children}</div>
      <Rail side="right" />
    </div>
  )
}
