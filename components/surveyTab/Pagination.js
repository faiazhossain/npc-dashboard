"use client";
import { motion } from "framer-motion";

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  return (
    <div className='flex justify-between items-center mt-4'>
      <div
        className='text-sm text-gray-700'
        style={{ fontFamily: "Tiro Bangla, serif" }}
      >
        {startIndex} থেকে {endIndex} দেখানো হচ্ছে, মোট {totalItems} টির মধ্যে
      </div>
      <div className='flex space-x-1'>
        <motion.button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ fontFamily: "Tiro Bangla, serif" }}
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        >
          পূর্ববর্তী
        </motion.button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <motion.button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === page
                ? "bg-[#006747] text-white"
                : "border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
            }`}
            style={{ fontFamily: "Tiro Bangla, serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        ))}
        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ fontFamily: "Tiro Bangla, serif" }}
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        >
          পরবর্তী
        </motion.button>
      </div>
    </div>
  );
}
