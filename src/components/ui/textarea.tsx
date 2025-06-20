
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md px-3 py-2 text-sm transition-all duration-200",
        // Aurora theme styling
        "aurora-glass-enhanced border-aurora-electric-purple/30 bg-aurora-deep-purple/20 text-slate-200",
        "placeholder:text-slate-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-electric-purple focus-visible:ring-offset-2 focus-visible:ring-offset-aurora-void-black",
        "focus-visible:border-aurora-neon-blue/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-aurora-electric-purple/50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
