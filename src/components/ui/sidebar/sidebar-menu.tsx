
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenu = React.forwardRef<HTMLDivElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-1", className)}
        {...props}
      />
    )
  }
)
SidebarMenu.displayName = "SidebarMenu"

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarMenuItem = React.forwardRef<HTMLDivElement, SidebarMenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(className)}
        {...props}
      />
    )
  }
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  active?: boolean
  collapsible?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, asChild = false, active = false, collapsible = false, ...props }, ref) => {
    const { open } = useSidebar()
    const Comp = asChild ? Slot : "button"
    
    if (collapsible && !open) {
      return (
        <Comp
          ref={ref}
          className={cn(
            "group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent px-0 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            active && "bg-secondary text-foreground",
            className
          )}
          {...props}
        />
      )
    }
    
    return (
      <Comp
        ref={ref}
        className={cn(
          "group inline-flex h-9 w-full items-center rounded-md bg-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          active && "bg-secondary text-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export { SidebarMenu, SidebarMenuItem, SidebarMenuButton }
