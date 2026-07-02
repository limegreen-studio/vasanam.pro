import { useCallback, useEffect, useRef, useState } from "react"
import type { Highlight } from "@/lib/dialogue-segments"
import { saveHistoryEntry } from "@/lib/history"
import { getMemeForWpm, type MemeTier } from "@/lib/memes"

export interface DialogueEntry {
  dialogue: string
  highlights: Highlight[]
}

export interface TypedChar {
  char: string
  correct: boolean
}

export interface TestResult {
  wpm: number
  accuracy: number
  elapsedSeconds: number
  chars: number
  meme: MemeTier
}

/**
 * Core typing-test state machine, ported from the original vanilla-JS
 * implementation with one fix: WPM is now derived from the *current*
 * `typed` array (recomputed live) instead of an ever-incrementing
 * "correctKeystrokes" counter. In the old version that counter never got
 * decremented on backspace, so retyping a correct character after
 * backspacing it double-counted it toward WPM — inflating results any
 * time the user corrected themselves. Accuracy still legitimately uses
 * the full lifetime keystroke history (that's a different, valid metric).
 */
export function useTypingTest(dialogues: DialogueEntry[]) {
  const [dialogueIndex, setDialogueIndex] = useState(-1);
  const [target, setTarget] = useState("")
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [typed, setTyped] = useState<TypedChar[]>([])
  const [finished, setFinished] = useState(false)
  const [elapsedDisplay, setElapsedDisplay] = useState(0)
  const [liveWpm, setLiveWpm] = useState(0)
  const [result, setResult] = useState<TestResult | null>(null)

  const startTimeRef = useRef<number | null>(null)
  const tickHandleRef = useRef<number | null>(null)
  const totalKeystrokesRef = useRef(0)
  const correctKeystrokesEverRef = useRef(0)

  const pickDialogue = useCallback(() => {
    if (dialogues.length === 0) return
    let next = dialogueIndex
    if (dialogues.length > 1) {
      while (next === dialogueIndex) {
        next = Math.floor(Math.random() * dialogues.length)
      }
    } else {
      next = 0
    }
    setDialogueIndex(next)
    setTarget(dialogues[next].dialogue)
    setHighlights(dialogues[next].highlights ?? [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogues, dialogueIndex])

  const resetState = useCallback(() => {
    setTyped([])
    setFinished(false)
    setElapsedDisplay(0)
    setLiveWpm(0)
    setResult(null)
    startTimeRef.current = null
    totalKeystrokesRef.current = 0
    correctKeystrokesEverRef.current = 0
    if (tickHandleRef.current) {
      window.clearInterval(tickHandleRef.current)
      tickHandleRef.current = null
    }
  }, [])

  const newScene = useCallback(() => {
    resetState()
    pickDialogue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetState, pickDialogue])

  // pick the first dialogue once data is loaded
  useEffect(() => {
    if (dialogues.length > 0 && dialogueIndex === -1) {
      pickDialogue()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogues])

  const finishTest = useCallback(
    (finalTyped: TypedChar[]) => {
      setFinished(true)
      if (tickHandleRef.current) {
        window.clearInterval(tickHandleRef.current)
        tickHandleRef.current = null
      }
      const elapsed = Math.max((performance.now() - (startTimeRef.current ?? performance.now())) / 1000, 0.001)
      const minutes = elapsed / 60
      const correctCharsNow = finalTyped.filter((t) => t.correct).length
      const wpm = Math.round(correctCharsNow / 5 / minutes)
      const accuracy =
        totalKeystrokesRef.current > 0
          ? Math.round((correctKeystrokesEverRef.current / totalKeystrokesRef.current) * 100)
          : 100

      const meme = getMemeForWpm(wpm)
      const res: TestResult = { wpm, accuracy, elapsedSeconds: elapsed, chars: target.length, meme }
      setResult(res)

      saveHistoryEntry({ wpm, accuracy, dialogue: target, date: new Date().toISOString() })
    },
    [target]
  )

  const tick = useCallback(() => {
    if (!startTimeRef.current || finished) return
    const elapsed = (performance.now() - startTimeRef.current) / 1000
    setElapsedDisplay(Math.floor(elapsed))
    setTyped((current) => {
      const minutes = elapsed / 60
      const correctCharsNow = current.filter((t) => t.correct).length
      const wpm = minutes > 0 ? Math.round(correctCharsNow / 5 / minutes) : 0
      setLiveWpm(wpm)
      return current
    })
  }, [finished])

  const handleChar = useCallback(
    (key: string) => {
      if (finished) return
      setTyped((current) => {
        if (current.length >= target.length) return current
        if (!startTimeRef.current) {
          startTimeRef.current = performance.now()
          tickHandleRef.current = window.setInterval(tick, 200)
        }
        const correct = key === target[current.length]
        totalKeystrokesRef.current++
        if (correct) correctKeystrokesEverRef.current++

        const next = [...current, { char: key, correct }]
        if (next.length === target.length) {
          // defer so state settles before computing final result
          queueMicrotask(() => finishTest(next))
        }
        return next
      })
    },
    [finished, target, tick, finishTest]
  )

  const handleBackspace = useCallback(() => {
    if (finished) return
    setTyped((current) => (current.length === 0 ? current : current.slice(0, -1)))
  }, [finished])

  useEffect(() => {
    return () => {
      if (tickHandleRef.current) window.clearInterval(tickHandleRef.current)
    }
  }, [])

  return {
    target,
    highlights,
    typed,
    finished,
    elapsedDisplay,
    liveWpm,
    result,
    dialogueIndex,
    total: dialogues.length,
    handleChar,
    handleBackspace,
    newScene,
  }
}
