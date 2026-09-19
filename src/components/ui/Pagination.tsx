import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                        currentPage === i 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                title="Halaman Pertama"
            >
                <ChevronsLeft size={16} />
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                title="Sebelumnya"
            >
                <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1.5 mx-2">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                title="Selanjutnya"
            >
                <ChevronRight size={16} />
            </button>
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                title="Halaman Terakhir"
            >
                <ChevronsRight size={16} />
            </button>
        </div>
    );
}
