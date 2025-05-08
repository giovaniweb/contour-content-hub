
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

// Main Sidebar component
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean | "icon";
}

export function Sidebar({
  children,
  className,
  collapsible = false,
  ...props
}: SidebarProps) {
  const { open } = useSidebar()
  
  return (
    <div
      className={cn(
        "border-r bg-background flex flex-col transition-all duration-300",
        open ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
