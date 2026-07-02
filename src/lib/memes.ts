export interface MemeTier {
  max: number
  img: string
  caption: string
}

export const MEME_TIERS: MemeTier[] = [
  { max: 5, img: "/assets/memes/slow.jpg", caption: "Semma slow bro... nadandhu poyiruvom vegama!" },
  { max: 15, img: "/assets/memes/medium.jpg", caption: "Sari sari, aana innum konjam speed venum." },
  { max: 35, img: "/assets/memes/good.jpg", caption: "Ithu dhaan bro nalla vibe!" },
  { max: 40, img: "/assets/memes/fast.jpg", caption: "Adhu thaan mass entry!" },
  { max: 60, img: "/assets/memes/god.jpg", caption: "Thalaivar level speed. Vera level!" },
]

export function getMemeForWpm(wpm: number): MemeTier {
  return MEME_TIERS.find((t) => wpm <= t.max) ?? MEME_TIERS[MEME_TIERS.length - 1]
}
