import React from 'react';
import { Pagination } from 'flowbite-react';

interface PaginationComponentProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  totalPages: propTotalPages,
}) => {
  const totalPages = propTotalPages || Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const showingText = totalItems > 0 
    ? `Showing ${startIndex} to ${endIndex} of ${totalItems} items`
    : 'No items to display';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 sm:px-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
  <span className="text-sm text-gray-700 dark:text-gray-400 font-semibold text-center sm:text-left">
    {showingText}
  </span>

  <div className="flex justify-center">
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  </div>
</div>

  );
};

export default PaginationComponent;