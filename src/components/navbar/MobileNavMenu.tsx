
import React from "react";
import { Link } from "react-router-dom";
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X, Film, Home, FileText, CheckCircle, BookOpen, ListTodo, CalendarDays } from "lucide-react";

interface MobileNavMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAuthenticated: boolean;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ 
  isOpen, 
  setIsOpen, 
  isAuthenticated
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="text-left">
        <DrawerHeader className="border-b pb-3">
          <DrawerTitle className="flex items-center">
            <Film className="h-5 w-5 text-contourline-mediumBlue mr-2" aria-hidden="true" />
            Menu Fluida
          </DrawerTitle>
          <DrawerDescription>Navegue pelo aplicativo</DrawerDescription>
        </DrawerHeader>
        
        <div className="space-y-1 px-2 py-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><Home className="h-5 w-5" /></span>
                Inicio
              </Link>
              <Link 
                to="/custom-gpt" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><FileText className="h-5 w-5" /></span>
                Roteiros Fluida
              </Link>
              <Link 
                to="/validate-script" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><CheckCircle className="h-5 w-5" /></span>
                Validador de Roteiros
              </Link>
              <Link 
                to="/documents" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><BookOpen className="h-5 w-5" /></span>
                Artigos Científicos
              </Link>
              <Link 
                to="/media" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><Film className="h-5 w-5" /></span>
                Mídia
              </Link>
              <Link 
                to="/content-strategy" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><ListTodo className="h-5 w-5" /></span>
                Estratégia de Conteúdo
                <span className="ml-1.5 px-1.5 py-0.5 text-[0.6rem] font-medium bg-blue-100 text-blue-800 rounded-full">Novo</span>
              </Link>
              <Link 
                to="/admin/equipments" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><CalendarDays className="h-5 w-5" /></span>
                Equipamentos
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><Home className="h-5 w-5" /></span>
                Início
              </Link>
              <Link 
                to="/register" 
                className="group flex w-full items-center rounded-md border px-3 py-3 text-base outline-none transition-colors hover:bg-secondary hover:text-accent-foreground"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3 text-contourline-mediumBlue"><FileText className="h-5 w-5" /></span>
                Criar conta
              </Link>
            </>
          )}
        </div>
        
        <DrawerFooter className="pt-2 border-t">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-2" aria-hidden="true" />
              Fechar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
