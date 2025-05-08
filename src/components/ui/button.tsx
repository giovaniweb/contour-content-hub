
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-fluida-blue text-white hover:bg-fluida-blueDark",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-fluida-blue/30 bg-background text-fluida-blue hover:bg-fluida-blue/10 hover:text-fluida-blueDark",
        secondary:
          "bg-contourline-darkBlue text-white hover:bg-contourline-darkBlue/80",
        ghost: "hover:bg-fluida-blue/10 hover:text-fluida-blue text-contourline-darkBlue",
        link: "text-fluida-blue underline-offset-4 hover:underline",
        action: "bg-white shadow-md border border-gray-100 text-contourline-darkBlue hover:bg-contourline-lightBlue/10 hover:border-contourline-lightBlue/30",
        warning: "bg-amber-500 text-white hover:bg-amber-600",
        accent: "bg-fluida-pink text-white hover:bg-fluida-pink/90",
        gradient: "bg-gradient-to-r from-fluida-blue to-fluida-pink text-white hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        circle: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
