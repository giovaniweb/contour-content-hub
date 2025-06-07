
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Layout components for sidebar structure
export function SidebarHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-3 border-b border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-auto py-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto border-t border-white/10 px-4 py-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroup({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2 py-1 text-xs font-medium text-white/60 uppercase tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({
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

export function SidebarSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-4 my-2 h-px bg-white/10", className)}
      {...props}
    />
  )
}
