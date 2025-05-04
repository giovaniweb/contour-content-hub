
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("space-y-1 px-2", className)}
      {...props}
    >
      {children}
    </ul>
  )
}

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  active?: boolean;
}

export function SidebarMenuItem({
  className,
  children,
  active,
  ...props
}: SidebarMenuItemProps) {
  return (
    <li
      className={cn(
        "relative",
        active && "before:absolute before:left-0 before:top-1 before:h-[calc(100%-0.5rem)] before:w-1 before:rounded-r before:bg-primary",
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
}

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "",
        active: "bg-accent text-accent-foreground font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, variant, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"
