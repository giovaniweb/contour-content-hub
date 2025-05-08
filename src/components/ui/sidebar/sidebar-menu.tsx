"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"

// Export sidebar menu component
export interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <ul className={cn("flex flex-col gap-1", className)} {...props} />
  )
}

// Export sidebar menu item component
export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li className={cn("", className)} {...props} />
  )
}

// Export sidebar menu button props
export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
  collapsible?: boolean;
}

// Export SidebarMenuButton component
export function SidebarMenuButton({
  className,
  asChild = false,
  active = false,
  collapsible = false,
  ...props
}: SidebarMenuButtonProps) {
  const { open } = useSidebar();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50",
        active && "bg-accent/50 font-medium text-foreground",
        !active && "text-muted-foreground hover:text-foreground",
        !open && collapsible && "justify-center px-2",
        className
      )}
      {...props}
    />
  );
}
