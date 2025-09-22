
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxVisiblePages = 5
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }
  
  // Calculate visible page range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if end page is at maximum
  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  // Generate page numbers to display
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
  
  return (
    <div className="flex items-center justify-center space-x-1 my-6">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Show ellipsis if not starting from page 1 */}
      {startPage > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
            className={currentPage === 1 
              ? "bg-aurora-cyan text-slate-900 font-medium shadow-sm" 
              : "bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white"
            }
          >
            1
          </Button>
          {startPage > 2 && (
            <span className="px-2 text-white/60">...</span>
          )}
        </>
      )}
      
      {/* Page numbers */}
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(pageNumber)}
          className={pageNumber === currentPage 
            ? "bg-aurora-cyan text-slate-900 font-medium shadow-sm" 
            : "bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white"
          }
        >
          {pageNumber}
        </Button>
      ))}
      
      {/* Show ellipsis if not ending at last page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-white/60">...</span>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className={currentPage === totalPages 
              ? "bg-aurora-cyan text-slate-900 font-medium shadow-sm" 
              : "bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white"
            }
          >
            {totalPages}
          </Button>
        </>
      )}
      
      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-slate-800/50 border-white/15 text-white hover:bg-slate-700 hover:text-white disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
