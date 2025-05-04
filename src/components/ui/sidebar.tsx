
"use client"

import * as React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Contexto do sidebar
const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: true,
  setOpen: () => {},
})

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ 
  children, 
  defaultOpen = true 
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Componente Sidebar principal
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

// Componentes para partes do Sidebar
export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-auto py-2", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useSidebar()
  
  if (!open) return null
  
  return (
    <div
      className={cn(
        "px-4 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
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
      className={cn("mx-4 my-2 h-px bg-border", className)}
      {...props}
    />
  )
}

// Menu components
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
  const Comp = asChild ? React.Fragment : "button"
  
  return (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"
