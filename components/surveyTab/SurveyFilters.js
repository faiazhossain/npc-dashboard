"use client";
import { motion } from "framer-motion";

export default function SurveyFilters({
  filters,
  filterOptions,
  currentFilters,
  onFilterChange,
  onSearch,
  onReset,
}) {
  return (
    <motion.div
      className='bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md border border-gray-100 mb-6'
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4'>
        {Object.entries(filters).map(([key, label]) => (
          <div key={key} className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {label}
            </label>
            <motion.select
              value={currentFilters[key] || ""}
              onChange={(e) => onFilterChange(key, e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>সব</option>
              {filterOptions[`${key}Options`]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </motion.select>
          </div>
        ))}
      </div>
      <div className='flex justify-end space-x-2'>
        <motion.button
          onClick={onReset}
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm'
          style={{ fontFamily: "Tiro Bangla, serif" }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          রিসেট করুন
        </motion.button>
        <motion.button
          onClick={onSearch}
          className='bg-[#006747] text-white px-4 py-2 rounded-md hover:bg-[#005536] transition-colors duration-200 text-sm'
          style={{ fontFamily: "Tiro Bangla, serif" }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 2px 8px rgba(0, 103, 71, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          খুঁজুন
        </motion.button>
      </div>
    </motion.div>
  );
}
