
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"

// Menu components
export function SidebarMenu({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  )
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  icon?: React.ReactNode;
}

export function SidebarMenuButton({
  children,
  className,
  isActive = false,
  icon,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const content = (
    <>
      {icon && (
        <span className={cn(
          "flex-shrink-0 w-5 h-5",
          isActive && "text-aurora-lavender"
        )}>
          {icon}
        </span>
      )}
      <span className="flex-1 text-left">{children}</span>
    </>
  );

  if (asChild) {
    return (
      <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
        <Slot
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "text-white/80 hover:text-white hover:bg-white/10",
            "focus:outline-none focus:ring-2 focus:ring-aurora-lavender/50",
            isActive && "bg-white/15 text-white shadow-lg shadow-aurora-lavender/20",
            className
          )}
        >
          {React.cloneElement(children as React.ReactElement, {}, content)}
        </Slot>
      </motion.div>
    );
  }
  
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
      <button
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          "text-white/80 hover:text-white hover:bg-white/10",
          "focus:outline-none focus:ring-2 focus:ring-aurora-lavender/50",
          isActive && "bg-white/15 text-white shadow-lg shadow-aurora-lavender/20",
          className
        )}
        {...props}
      >
        {content}
      </button>
    </motion.div>
  )
}
