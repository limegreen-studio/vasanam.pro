import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * TextureButton — a tactile, "grainy paper" button used throughout VASANAM.
 * Every variant gets a subtle noise texture (see .btn-texture in index.css),
 * a hard offset shadow that collapses on press, and a slight brighten on
 * hover — like pressing a physical clapperboard button.
 */

const textureButtonVariants = cva(
  [
    "btn-texture inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-mono uppercase tracking-wide",
    // Principle 1: concentric radius. Principle 14: explicit transition props,
    // never `transition: all`.
    "rounded-lg border ease-out duration-150",
    "transition-[transform,box-shadow,background-color,color,filter,border-color]",
    "select-none cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
    "disabled:pointer-events-none disabled:opacity-50",
    // Principle 12: subtle scale-on-press (0.96) plus the physical key drop.
    "active:translate-y-[2px] active:scale-[0.96] active:shadow-none",
    // Principle 16: guarantee a >=40px tall hit target regardless of size.
    "relative after:absolute after:inset-x-0 after:top-1/2 after:h-[40px] after:w-full after:-translate-y-1/2 after:content-['']",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-bg-soft border-gold-bright/50 shadow-[0_3px_0_0_var(--color-rust)] hover:brightness-105",
        accent:
          "bg-rust text-ink border-rust/40 shadow-[0_3px_0_0_rgba(0,0,0,0.5)] hover:brightness-110",
        secondary:
          "bg-surface-2 text-ink border-border shadow-[0_3px_0_0_var(--color-bg)] hover:bg-surface",
        destructive:
          "bg-[#5e1620] text-ink border-[#8e2635]/70 shadow-[0_3px_0_0_rgba(0,0,0,0.55)] hover:brightness-110",
        minimal:
          "bg-transparent text-ink-dim border-border-soft shadow-none hover:text-ink hover:bg-surface/60",
        icon:
          "bg-surface-2 text-ink-dim border-border shadow-[0_2px_0_0_var(--color-bg)] hover:text-ink",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface TextureButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof textureButtonVariants> {}

export const TextureButton = React.forwardRef<HTMLButtonElement, TextureButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(textureButtonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
TextureButton.displayName = "TextureButton"
