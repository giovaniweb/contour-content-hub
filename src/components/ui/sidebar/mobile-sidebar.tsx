"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function MobileSidebar({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useSidebar()
  const isMobile = useIsMobile()

  // Fechar sidebar ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && isMobile) {
        const target = event.target as HTMLElement
        if (!target.closest(".sidebar-mobile") && !target.closest(".sidebar-trigger")) {
          setOpen(false)
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen, isMobile])
  
  // Controle de gesto de swipe
  React.useEffect(() => {
    if (!isMobile) return
    
    // Detectar swipe para abrir sidebar
    let touchStartX: number
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX
      }
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX) return
      
      const touchEndX = e.changedTouches[0].clientX
      const diffX = touchEndX - touchStartX
      
      // Se o swipe começou perto da borda esquerda e moveu para direita
      if (touchStartX < 30 && diffX > 70 && !open) {
        setOpen(true)
      }
      
      // Se o swipe começou do lado direito da sidebar e moveu para esquerda
      if (open && diffX < -50) {
        setOpen(false)
      }
      
      touchStartX = 0
    }
    
    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchend", handleTouchEnd)
    
    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isMobile, open, setOpen])

  // Se não for mobile, não renderiza este componente
  if (!isMobile) {
    return null
  }
  
  return (
    <>
      {/* Overlay para desfocar o fundo quando o sidebar está aberto */}
      <div className={cn(
        "sidebar-overlay",
        open && "open"
      )}/>
      
      {/* Área de swipe para detectar o gesto */}
      <div className="sidebar-swipe-area" />
      
      {/* Sidebar mobile */}
      <div
        className={cn(
          "sidebar-mobile bg-aurora-deep-navy border-r border-aurora-neon-blue/20 w-72 overflow-auto shadow-xl",
          open && "open",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  )
}