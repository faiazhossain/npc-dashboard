"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SurveyBreadcrumb from "./SurveyBreadcrumb";
import SurveyFilters from "./SurveyFilters";
import SurveyTable from "./SurveyTable";
import Pagination from "./Pagination";

export default function SurveyContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 10;

  const breadcrumbItems = [
    { label: "ড্যাশবোর্ড", path: "/dashboard" },
    { label: "সার্ভে তালিকা", path: "/dashboard/surveys" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/json/surveys.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setFilteredData(jsonData.surveys);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterChange = (key, value) => {
    setCurrentFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (!data) return;

    let filtered = data.surveys;

    // Apply filters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => {
          if (key === "question1") {
            return item.answer1.includes(value);
          }
          if (key === "question2") {
            return item.answer2.includes(value);
          }
          return item[key] === value;
        });
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setCurrentFilters({});
    setFilteredData(data?.surveys || []);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-gray-600 bg-white p-8 rounded-xl shadow-sm'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ডেটা লোড করা হচ্ছে...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div
          className='text-lg text-red-600'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ডেটা লোড করতে সমস্যা হয়েছে: {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg' style={{ fontFamily: "Tiro Bangla, serif" }}>
          কোন ডেটা পাওয়া যায়নি
        </div>
      </div>
    );
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      {/* Breadcrumb */}
      <SurveyBreadcrumb items={breadcrumbItems} />

      {/* Filters */}
      <SurveyFilters
        filters={data.filters}
        filterOptions={data.filterOptions}
        currentFilters={currentFilters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Survey Table */}
      <SurveyTable
        data={currentData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Pagination */}
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <motion.div
          className='text-center py-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p
            className='text-gray-500 mb-4'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            কোন সার্ভে পাওয়া যায়নি
          </p>
        </motion.div>
      )}
    </div>
  );
}
