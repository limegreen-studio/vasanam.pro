import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Github } from "lucide-react"
import { HoverWord } from "@/components/HoverWord"
import { FilmFrame } from "@/components/FilmFrame"
import { ReelStrip } from "@/components/ReelStrip"
import { DialogueText } from "@/components/DialogueText"
import { ResultsCard } from "@/components/ResultsCard"
import { HistoryPanel } from "@/components/HistoryPanel"
import { TextureButton } from "@/components/ui/texture-button"
import { useTypingTest, type DialogueEntry } from "@/hooks/useTypingTest"

// Principle 5: split content into chunks and stagger their entrance.
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 260, damping: 26, delay },
})

function App() {
  const [dialogues, setDialogues] = useState<DialogueEntry[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/dialogues.json")
      .then((r) => r.json())
      .then(setDialogues)
      .catch(() => setDialogues([]))
  }, [])

  const { target, highlights, typed, elapsedDisplay, liveWpm, result, dialogueIndex, total, handleChar, handleBackspace, newScene } =
    useTypingTest(dialogues)

  const focusInput = () => inputRef.current?.focus({ preventScroll: true })

  useEffect(() => {
    focusInput()
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      newScene()
      return
    }
    if (e.key === "Escape") {
      e.preventDefault()
      focusInput()
      return
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return
    if (e.key === "Backspace") {
      e.preventDefault()
      handleBackspace()
      return
    }
    if (e.key.length === 1) {
      e.preventDefault()
      handleChar(e.key)
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="grain" />

      <div className="relative z-10 mx-auto w-full ">
        <ReelStrip>
          <header className="flex items-center justify-between px-4 pt-6 md:px-8">
            <div className="font-display text-2xl tracking-wide">
              VASANAM<span className="text-rust">.PRO</span>
            </div>
            <div className="flex items-center gap-2">
              <TextureButton variant="secondary" size="sm" onClick={() => setHistoryOpen(true)}>
                History
              </TextureButton>
              <TextureButton
                variant="secondary"
                size="sm"
                onClick={() => window.open("https://github.com/limegreen-studio/vasanam.pro", "_blank", "noreferrer")}
              >
                <Github size={14} />
                Contribute
              </TextureButton>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 pb-14 pt-16 md:px-8">
            <motion.section className="text-center" {...enter(0)}>
               
              <h1 className="font-display mt-8 text-4xl leading-tight md:text-6xl">
                <HoverWord image="https://podu.pics/WROvGlTk-5" caption="Ennada Vasanameh Puriyala">
                  Ennadaaa <span className="text-gold">Vasanameh</span> Puriyala
                </HoverWord>
              </h1>
              <p className="mt-4 text-ink-dim">
                <HoverWord image="https://podu.pics/KN0Wh5ytSB" caption="Adichu thooku saami">
                  Adichu thooku saami
                </HoverWord>{" "}
                
              </p>
            </motion.section>

            <motion.section className="mt-10" {...enter(0.1)}>
              {/* The result replaces the scene in place: the frame blurs up and
                  out, the results card rises in from a blur. */}
              <div className="relative">
                <AnimatePresence mode="wait" initial={false}>
                  {!result ? (
                    <motion.div
                      key="scene"
                      exit={{ opacity: 0, y: -22, filter: "blur(10px)" }}
                      transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
                    >
                      <FilmFrame sceneLabel={`Scene ${String(dialogueIndex + 1).padStart(2, "0")} / ${total || 25}`}>
                        <div className="flex items-center justify-between px-4 py-2.5 md:px-8 md:py-3.5">
                          <div className="text-center">
                            <div className="font-mono text-xl text-gold md:text-3xl">{elapsedDisplay}</div>
                            <div className="text-[10px] uppercase tracking-widest text-ink-faint">sec</div>
                          </div>
                          <div className="h-6 w-px bg-border md:h-8" />
                          <div className="text-center">
                            <div className="font-mono text-xl text-gold md:text-3xl">{liveWpm}</div>
                            <div className="text-[10px] uppercase tracking-widest text-ink-faint">wpm</div>
                          </div>
                        </div>

                        <div className="cursor-text px-4 py-12 md:px-12 md:py-24" onClick={focusInput}>
                          {target && <DialogueText target={target} typed={typed} highlights={highlights} />}
                        </div>

                        <div className="border-t border-border-soft px-4 py-2.5 text-center font-mono text-[11px] text-ink-faint md:px-8 md:text-xs">
                          <kbd>tab</kbd> new scene &nbsp;&middot;&nbsp; <kbd>esc</kbd> refocus &nbsp;&middot;&nbsp; just start typing
                        </div>
                      </FilmFrame>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    >
                      <ResultsCard result={result} target={target} onAgain={newScene} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* kept mounted so tab/esc keep working on the results screen too */}
              <input
                ref={inputRef}
                type="text"
                aria-hidden="true"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="absolute h-px w-px overflow-hidden opacity-0"
                onKeyDown={onKeyDown}
              />
            </motion.section>

            <motion.section className="mt-20 text-left" {...enter(0.2)}>
              <h2 className="font-display text-2xl">What's the plot?</h2>
              <p className="mt-3 text-ink-dim">
                VASANAM.PRO is a typing test built for the tanglish typers of namma ooru. <br></br>
                <HoverWord image="https://podu.pics/placeholder/about-tanglish.jpg" caption="half Tamil, half English">
                  {" "} Adichu thooku thookudurai,  
                </HoverWord>
                 nee adikurathu dhaan dha.
              </p>
              <p className="mt-2 text-sm text-ink-faint">Built using TanglishCaptions technology</p>
            </motion.section>
          </main>

          <footer className="border-t border-border-soft px-4 py-6 text-center text-xs text-ink-faint md:px-8">
            <span>VASANAM &copy; 2026 &middot; </span>
            <a
              href="https://limegreen.studio"
              target="_blank"
              rel="noreferrer"
              className="text-ink-dim underline decoration-dotted transition-colors duration-150 hover:text-gold-bright"
            >
              Lime Green Studios
            </a>
          </footer>
        </ReelStrip>
      </div>

      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  )
}

export default App
