import type { TestResult } from "@/hooks/useTypingTest"
import { TextureButton } from "@/components/ui/texture-button"

// The blur-up entrance is handled by the AnimatePresence wrapper in App, so
// this is a plain section — no competing internal animation.
export function ResultsCard({
  result,
  target,
  onAgain,
}: {
  result: TestResult
  target: string
  onAgain: () => void
}) {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_0_rgba(255,255,255,0.04),0_30px_60px_-30px_rgba(0,0,0,0.85)] md:p-8">

      {/* Principle 1: outer rounded-lg, inner rounded-md with p-1.5 padding */}
      <div className="mx-auto mt-4 w-40 rounded-lg border border-border bg-bg-soft p-1.5">
        <img
          src={result.meme.img}
          alt={result.meme.caption}
          className="h-48 w-full rounded-md object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.visibility = "hidden"
          }}
        />
        <p className="mt-1 text-center text-xs text-ink-dim">{result.meme.caption}</p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 text-center tabular-nums">
        <div>
          <div className="font-mono text-2xl text-gold-bright">{result.wpm}</div>
          <div className="text-[11px] uppercase tracking-widest text-ink-faint">wpm</div>
        </div>
        <div>
          <div className="font-mono text-2xl text-gold-bright">{result.accuracy}%</div>
          <div className="text-[11px] uppercase tracking-widest text-ink-faint">accuracy</div>
        </div>
        <div>
          <div className="font-mono text-2xl text-gold-bright">{result.elapsedSeconds.toFixed(1)}s</div>
          <div className="text-[11px] uppercase tracking-widest text-ink-faint">time</div>
        </div>
        <div>
          <div className="font-mono text-2xl text-gold-bright">{result.chars}</div>
          <div className="text-[11px] uppercase tracking-widest text-ink-faint">chars</div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm italic text-ink-dim">&ldquo;{target}&rdquo;</p>

      <div className="mt-5 flex justify-center">
        <TextureButton variant="primary" onClick={onAgain}>
          Roll next scene <kbd className="ml-1">tab</kbd>
        </TextureButton>
      </div>
    </section>
  )
}
