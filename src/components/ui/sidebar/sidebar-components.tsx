
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { Menu } from "lucide-react"

// SidebarInset component
interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarInset({
  children,
  className,
  ...props
}: SidebarInsetProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col min-h-screen",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// SidebarTrigger component
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({
  className,
  ...props
}: SidebarTriggerProps) {
  const { open, setOpen } = useSidebar()
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <Menu className="h-4 w-4" />
    </button>
  )
}
