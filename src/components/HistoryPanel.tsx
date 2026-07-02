import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { loadHistory, timeAgo, type HistoryEntry } from "@/lib/history"
import { TextureButton } from "@/components/ui/texture-button"

export function HistoryPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [history, setHistory] = useState<HistoryEntry[]>([])

  useEffect(() => {
    if (open) setHistory(loadHistory())
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-dim">Past takes</p>
              <TextureButton variant="icon" size="icon" aria-label="Close" onClick={onClose}>
                <X className="h-4 w-4" />
              </TextureButton>
            </div>

            {history.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-faint">No takes yet. Type a scene first.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map((entry, i) => (
                  // Principle 5: stagger the rows in as the panel opens.
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.2 }}
                    className="rounded-md border border-border-soft bg-bg-soft p-3"
                  >
                    <div className="flex items-center justify-between tabular-nums">
                      <span className="font-mono text-lg text-gold-bright">{entry.wpm} wpm</span>
                      <span className="font-mono text-xs text-ink-dim">
                        {entry.accuracy}% · {timeAgo(entry.date)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-ink-dim">"{entry.dialogue}"</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
