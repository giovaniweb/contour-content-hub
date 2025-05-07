
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Gerar os números de página a serem exibidos
  const getPageNumbers = () => {
    const pages = [];
    
    // Se tivermos menos de 8 páginas, mostrar tudo
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Sempre mostrar a primeira página
    pages.push(1);
    
    // Se a página atual está próxima do início
    if (currentPage < 5) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } 
    // Se a página atual está próxima do final
    else if (currentPage > totalPages - 4) {
      pages.push("ellipsis");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } 
    // Se a página atual está no meio
    else {
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Anterior</span>
      </Button>
      
      {getPageNumbers().map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span key={`ellipsis-${index}`} className="flex items-center justify-center">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </span>
          );
        }
        
        return (
          <Button 
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page as number)}
            className="w-8 h-8"
          >
            {page}
          </Button>
        );
      })}
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Próximo</span>
      </Button>
    </div>
  );
};
