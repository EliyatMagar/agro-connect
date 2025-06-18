import React from 'react';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const MAX_VISIBLE_PAGES = 5; // Maximum pages to show in the pagination bar

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    let startPage, endPage;

    if (totalPages <= MAX_VISIBLE_PAGES) {
      // Show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages
      const maxPagesBeforeCurrent = Math.floor(MAX_VISIBLE_PAGES / 2);
      const maxPagesAfterCurrent = Math.ceil(MAX_VISIBLE_PAGES / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        // Near the beginning
        startPage = 1;
        endPage = MAX_VISIBLE_PAGES;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        // Near the end
        startPage = totalPages - MAX_VISIBLE_PAGES + 1;
        endPage = totalPages;
      } else {
        // Somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 rounded-md ${1 === currentPage ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
        >
          1
        </button>
      );

      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 py-1">
            <FaEllipsisH className="text-gray-500" />
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${i === currentPage ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 py-1">
            <FaEllipsisH className="text-gray-500" />
          </span>
        );
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-md ${totalPages === currentPage ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between sm:justify-center space-x-1">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
      >
        <FaChevronLeft />
      </button>

      <div className="hidden sm:flex items-center space-x-1">
        {renderPageNumbers()}
      </div>

      <div className="sm:hidden text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;