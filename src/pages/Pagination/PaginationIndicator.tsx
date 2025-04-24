import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type PaginationIndicatorProps = {
  /**
   * The current page number (1-based)
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * The starting item number of the current page
   */
  startItem: number;
  /**
   * The ending item number of the current page
   */
  endItem: number;
  /**
   * Total number of items
   */
  totalItems: number;
  /**
   * Callback when a page is selected
   */
  onPageChange: (page: number) => void;
  /**
   * Optional CSS class name for custom styling
   */
  className?: string;
};

/**
 * Pagination indicator component for tables
 * Shows current page status and navigation buttons
 */
const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  currentPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
  onPageChange,
  className = '',
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'pagination' });

  // Generate page numbers to display
  const getPageNumbers = () => {
    // Always show first page, last page, current page, and one page before and after current
    const pages: (number | string)[] = [];
    
    // Always add page 1
    pages.push(1);
    
    // If current page is more than 3, add ellipsis after page 1
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Add page before current if it exists and isn't already included
    if (currentPage > 2 && currentPage - 1 !== 1) {
      pages.push(currentPage - 1);
    }
    
    // Add current page if it's not already included
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }
    
    // Add page after current if it exists and isn't already included
    if (currentPage < totalPages - 1 && currentPage + 1 !== totalPages) {
      pages.push(currentPage + 1);
    }
    
    // If current page is less than totalPages - 2, add ellipsis before last page
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always add last page if it's not page 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className={`flex flex-wrap justify-between items-center px-4 py-2 ${className}`}>
      {/* Left side - showing items information */}
      <div className="text-sm text-gray-500">
        {t('showing', { startItem, endItem, totalItems })}
      </div>
      
      {/* Right side - pagination controls */}
      <div className="join">
        {/* Previous page button */}
        <button 
          className="join-item btn btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ) : (
            <button key={index} className="join-item btn btn-sm btn-disabled">
              {page}
            </button>
          )
        ))}
        
        {/* Next page button */}
        <button 
          className="join-item btn btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationIndicator;
