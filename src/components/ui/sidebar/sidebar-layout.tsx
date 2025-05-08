
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar()
    
    return (
      <div
        ref={ref}
        className={cn("flex h-14 items-center px-4 transition-all", open ? "" : "justify-center", className)}
        {...props}
      />
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-auto", className)}
        {...props}
      />
    )
  }
)
SidebarContent.displayName = "SidebarContent"

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => {
    const { open } = useSidebar()
    
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-4 transition-all", open ? "" : "justify-center", className)}
        {...props}
      />
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-4 px-4", className)}
        {...props}
      />
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const SidebarGroupLabel = React.forwardRef<HTMLParagraphElement, SidebarGroupLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("mb-2 text-xs font-semibold text-muted-foreground", className)}
        {...props}
      />
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarGroupContent = React.forwardRef<HTMLDivElement, SidebarGroupContentProps>(
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
SidebarGroupContent.displayName = "SidebarGroupContent"

interface SidebarSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const SidebarSeparator = React.forwardRef<HTMLDivElement, SidebarSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("my-4 h-px bg-border", className)}
        {...props}
      />
    )
  }
)
SidebarSeparator.displayName = "SidebarSeparator"

export {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator
}
