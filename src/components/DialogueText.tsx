import { buildSegments, type Highlight } from "@/lib/dialogue-segments"

interface TypedChar {
  char: string
  correct: boolean
}

interface DialogueTextProps {
  target: string
  typed: TypedChar[]
  highlights?: Highlight[]
}

function charClass(i: number, typed: TypedChar[]) {
  if (i < typed.length) return typed[i].correct ? "text-gold-bright" : "text-error bg-error/10"
  if (i === typed.length) return "text-ink bg-ink/10 animate-pulse"
  return "text-ink-faint"
}

/**
 * Renders the scene's dialogue character-by-character for the typing test,
 * while wrapping any highlighted word (from dialogues.json) in a hover
 * trigger that pops a meme preview above it — pure CSS transitions here
 * since this re-renders on every keystroke and framer-motion would be
 * overkill for a per-character hot path.
 */
export function DialogueText({ target, typed, highlights = [] }: DialogueTextProps) {
  const segments = buildSegments(target, highlights)

  return (
    <p className="subtitle-text select-none whitespace-pre-wrap font-mono text-2xl leading-relaxed md:text-4xl md:leading-relaxed">
      {segments.map((seg, idx) => {
        if (seg.type === "char") {
          return (
            <span key={idx} className={`ch transition-colors duration-100 ${charClass(seg.index, typed)}`}>
              {target[seg.index]}
            </span>
          )
        }

        return (
          <span key={idx} className="group relative inline-block">
            <span className="border-b border-dotted border-gold/60">
              {Array.from({ length: seg.end - seg.start }).map((_, k) => {
                const i = seg.start + k
                return (
                  <span key={i} className={`ch transition-colors duration-100 ${charClass(i, typed)}`}>
                    {target[i]}
                  </span>
                )
              })}
            </span>

            <span
              className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-40 -translate-x-1/2 translate-y-2
                         scale-75 rounded-md border border-border bg-surface p-1.5 opacity-0 shadow-2xl
                         transition-all duration-200 ease-out
                         group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
            >
              <img
                src={seg.image}
                alt={seg.word}
                loading="lazy"
                className="h-24 w-full rounded object-cover"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.visibility = "hidden"
                }}
              />
              <span className="mt-1 block truncate text-center font-mono text-[10px] text-ink-dim">{seg.word}</span>
              <span className="mx-auto -mt-1 block h-2 w-2 rotate-45 border-b border-r border-border bg-surface" />
            </span>
          </span>
        )
      })}
    </p>
  )
}
