
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-fluida-blue text-white hover:bg-fluida-blueDark active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        outline:
          "border border-fluida-blue/30 bg-background text-fluida-blue hover:bg-fluida-blue/10 hover:text-fluida-blueDark active:scale-[0.98]",
        secondary:
          "bg-contourline-darkBlue text-white hover:bg-contourline-darkBlue/80 active:scale-[0.98]",
        ghost: "hover:bg-fluida-blue/10 hover:text-fluida-blue text-contourline-darkBlue active:scale-[0.98]",
        link: "text-fluida-blue underline-offset-4 hover:underline",
        action: "bg-white shadow-md border border-gray-100 text-contourline-darkBlue hover:bg-contourline-lightBlue/10 hover:border-contourline-lightBlue/30 active:scale-[0.98]",
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]",
        accent: "bg-fluida-pink text-white hover:bg-fluida-pink/90 active:scale-[0.98]",
        gradient: "bg-gradient-to-r from-fluida-blue to-fluida-pink text-white hover:opacity-90 active:scale-[0.98]",
        "gradient-outline": "border border-fluida-blue/50 bg-transparent text-fluida-blue hover:bg-gradient-to-r hover:from-fluida-blue/10 hover:to-fluida-pink/10 active:scale-[0.98]",
        "glass": "bg-white/80 backdrop-blur-sm border border-white/20 text-contourline-darkBlue hover:bg-white/90 active:scale-[0.98] shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        circle: "h-12 w-12 rounded-full",
        "floating": "h-14 w-14 rounded-full shadow-lg",
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
  asChild?: boolean;
  ripple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ripple = true, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple) return;
      
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const circle = document.createElement("span");
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add("ripple-effect");
      
      const rippleElement = button.querySelector(".ripple-effect");
      if (rippleElement) {
        rippleElement.remove();
      }
      
      button.appendChild(circle);
      
      setTimeout(() => {
        if (circle) {
          circle.remove();
        }
      }, 600);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          handleRipple(e);
          props.onClick?.(e);
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

