
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    elevation?: 'flat' | 'low' | 'medium' | 'high';
    glass?: boolean; 
    gradient?: boolean;
    interactive?: boolean;
    auroraBorder?: boolean;
  }
>(({ className, elevation = 'low', glass = true, gradient = false, interactive = false, auroraBorder = true, ...props }, ref) => {
  const elevationClasses = {
    flat: "shadow-none",
    low: "shadow-sm",
    medium: "shadow",
    high: "shadow-md"
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-200",
        // Force Aurora theme
        "aurora-glass-enhanced border-aurora-electric-purple/30 text-slate-200",
        elevationClasses[elevation],
        glass && "backdrop-blur-xl",
        gradient && "bg-gradient-to-br from-aurora-deep-purple/20 to-aurora-void-black/20",
        interactive && "hover:shadow-lg hover:shadow-aurora-electric-purple/20 cursor-pointer hover:-translate-y-1 hover:border-aurora-neon-blue/40",
        auroraBorder && "aurora-border-enhanced",
        className
      )}
      {...props}
    />
  );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 text-slate-200", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-slate-100",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
