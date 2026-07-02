export interface Highlight {
  textToHighlight: string
  image: string
}

export type Segment =
  | { type: "char"; index: number }
  | { type: "highlight"; start: number; end: number; image: string; word: string }

/**
 * Splits a dialogue string into render segments: plain single characters,
 * plus wrapped ranges for any highlight word found in it (first match only,
 * case-sensitive — the dialogue bank is hand-written so this keeps it simple).
 */
export function buildSegments(target: string, highlights: Highlight[] = []): Segment[] {
  const ranges: { start: number; end: number; image: string; word: string }[] = []

  for (const h of highlights) {
    if (!h.textToHighlight) continue
    const start = target.indexOf(h.textToHighlight)
    if (start === -1) continue
    ranges.push({ start, end: start + h.textToHighlight.length, image: h.image, word: h.textToHighlight })
  }
  ranges.sort((a, b) => a.start - b.start)

  const segments: Segment[] = []
  let i = 0
  for (const r of ranges) {
    if (r.start < i) continue // overlapping, skip
    while (i < r.start) {
      segments.push({ type: "char", index: i })
      i++
    }
    segments.push({ type: "highlight", start: r.start, end: r.end, image: r.image, word: r.word })
    i = r.end
  }
  while (i < target.length) {
    segments.push({ type: "char", index: i })
    i++
  }
  return segments
}
