
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// Sidebar Menu components
export function SidebarMenu({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function SidebarMenuButton({
  children,
  className,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      className={cn(
        "w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
