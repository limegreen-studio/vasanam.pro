import { useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface HoverWordProps {
  /** the visible, clickable/hoverable content */
  children: ReactNode
  /** meme/preview image shown on hover — see public/dialogues.json for the
   *  same convention (podu.pics placeholder links to be swapped later) */
  image: string
  /** shown under the image, defaults to a generic caption */
  caption?: string
  className?: string
}

/**
 * Wraps a word/phrase so hovering it pops a floating meme preview above,
 * flicking in like a polaroid being slapped onto a corkboard.
 */
export function HoverWord({ children, image, caption, className }: HoverWordProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className={`relative inline-block cursor-help underline decoration-dotted decoration-ink-faint underline-offset-4 ${className ?? ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.75, rotate: -6, y: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: -2, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 4, y: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 -translate-x-1/2"
          >
            <span className="block w-40 rounded-md border border-border bg-surface p-1.5 shadow-2xl">
              <img
                src={image}
                alt={caption ?? "preview"}
                className="h-24 w-full rounded object-cover"
                loading="lazy"
                onError={(e) => {
                  // placeholder links (podu.pics) may 404 until swapped for real memes
                  ;(e.currentTarget as HTMLImageElement).style.visibility = "hidden"
                }}
              />
              {caption && (
                <span className="mt-1 block truncate text-center font-mono text-[10px] text-ink-dim">
                  {caption}
                </span>
              )}
            </span>
            <span className="mx-auto block h-2 w-2 rotate-45 border-b border-r border-border bg-surface" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
