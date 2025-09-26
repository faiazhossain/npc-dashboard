'use client';
import { motion } from 'framer-motion';

export default function Pagination({
  currentPage,
  totalItems,
  totalPages: propTotalPages,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages =
    propTotalPages || Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  // If we don't have complete pagination info, show basic controls
  const hasCompletePagination = propTotalPages > 0 && totalItems > 0;

  // Generate visible page numbers (show max 5 pages at a time)
  const getVisiblePages = () => {
    const delta = 2; // Show 2 pages before and after current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter(
      (item, index, array) => array.indexOf(item) === index
    );
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [1];

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center mt-6 gap-4'>
      <div
        className='text-sm text-gray-700'
        style={{ fontFamily: 'Tiro Bangla, serif' }}
      >
        {hasCompletePagination
          ? `পৃষ্ঠা ${currentPage} এর ${totalPages} টি, মোট ${totalItems} টি আইটেম`
          : `পৃষ্ঠা ${currentPage}, প্রতি পৃষ্ঠায় ${itemsPerPage} টি আইটেম`}
      </div>
      <div className='flex items-center space-x-1'>
        {/* First page button */}
        <motion.button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className='px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        >
          প্রথম
        </motion.button>
        {/* Previous button */}
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        >
          পূর্ববর্তী
        </motion.button>
        {/* Page numbers */}
        {visiblePages.map((page, index) =>
          page === '...' ? (
            <span key={`dots-${index}`} className='px-2 py-1 text-gray-500'>
              ...
            </span>
          ) : (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-sm font-medium min-w-[40px] ${
                currentPage === page
                  ? 'bg-[#006747] text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              }`}
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {page}
            </motion.button>
          )
        )}

        {/* Next button */}
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={hasCompletePagination && currentPage === totalPages}
          className='px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
          whileHover={{
            scale:
              hasCompletePagination && currentPage === totalPages ? 1 : 1.05,
          }}
          whileTap={{
            scale:
              hasCompletePagination && currentPage === totalPages ? 1 : 0.95,
          }}
        >
          পরবর্তী
        </motion.button>
        {/* Last page button - only show if we have complete pagination info */}
        {hasCompletePagination && totalPages > 1 && (
          <motion.button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className='px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
          >
            শেষ
          </motion.button>
        )}
      </div>
    </div>
  );
}
