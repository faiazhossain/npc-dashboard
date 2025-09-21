"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

export default function SeatDistribution() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    constituency: "",
  });
  const [analysisFilters, setAnalysisFilters] = useState({
    party: "",
    constituency: "",
    district: "",
  });
  const [showAnalysisFilters, setShowAnalysisFilters] = useState(false);
  const [filteredAnalysisData, setFilteredAnalysisData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API endpoint - can be easily changed to real API
  const API_ENDPOINT = "/json/seat-distribution.json";

  useEffect(() => {
    // Load data from JSON file (this can be replaced with API call)
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
        setFilteredAnalysisData(jsonData.analysisData);
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
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnalysisFilterChange = (key, value) => {
    setAnalysisFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = () => {
    console.log("Filters applied:", filters);
    // Apply filters logic here
  };

  const handleReset = () => {
    setFilters({
      division: "",
      district: "",
      constituency: "",
    });
  };

  const handleAnalysisSearch = () => {
    if (!data) return;

    let filtered = data.analysisData;

    if (analysisFilters.party) {
      filtered = filtered.filter(
        (item) => item.party === analysisFilters.party
      );
    }
    if (analysisFilters.district) {
      filtered = filtered.filter(
        (item) => item.district === analysisFilters.district
      );
    }
    if (analysisFilters.constituency) {
      filtered = filtered.filter(
        (item) => item.constituency === analysisFilters.constituency
      );
    }

    setFilteredAnalysisData(filtered);
    setCurrentPage(1);
  };

  const handleAnalysisReset = () => {
    setAnalysisFilters({
      party: "",
      constituency: "",
      district: "",
    });
    setFilteredAnalysisData(data?.analysisData || []);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAnalysisData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAnalysisData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg' style={{ fontFamily: "Tiro Bangla, serif" }}>
          ডেটা লোড করা হচ্ছে...
        </div>
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

  const COLORS = [
    "#06C584",
    "#8C5CF0",
    "#EC489B",
    "#0EA7EC",
    "#F39E0B",
    "#1ddb16",
    "#003b36",
    "#59114d",
    "#FF6B35",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
  ];

  // Prepare bar chart data
  const barChartData = data.seatDistribution.map((item, index) => ({
    party: item.party,
    seats: item.seats,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className='space-y-8'>
      {/* Section 1: Filters */}
      <motion.div
        className='bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md border border-gray-100 mx-auto'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2
          className='text-xl font-semibold text-gray-800 mb-4'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ফিল্টার
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4'>
          {Object.entries(data.filters).map(([key, label]) => (
            <div key={key} className='flex flex-col'>
              <label
                className='block text-xs font-medium text-gray-600 mb-1'
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                {label}
              </label>
              <motion.select
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                style={{ fontFamily: "Tiro Bangla, serif" }}
                whileHover={{ scale: 1.02 }}
              >
                <option value=''>নির্বাচন করুন</option>
                <option value='option1'>বিকল্প ১</option>
                <option value='option2'>বিকল্প ২</option>
              </motion.select>
            </div>
          ))}
        </div>
        <div className='flex justify-end space-x-2'>
          <motion.button
            onClick={handleReset}
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
            onClick={handleView}
            className='bg-[#006747] text-white px-4 py-2 rounded-md hover:bg-[#005536] transition-colors duration-200 text-sm'
            style={{ fontFamily: "Tiro Bangla, serif" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 2px 8px rgba(0, 103, 71, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            দেখুন
          </motion.button>
        </div>
      </motion.div>

      {/* Section 2: Seat Distribution Bar Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className='shadow-sm rounded-2xl p-6 bg-white'
      >
        <h2
          className='text-2xl font-semibold text-gray-800 mb-6'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          আসন বণ্টন
        </h2>
        <div className='h-96'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='party'
                angle={-45}
                textAnchor='end'
                height={100}
                style={{ fontFamily: "Tiro Bangla, serif" }}
              />
              <YAxis
                label={{
                  value: "আসন সংখ্যা",
                  angle: -90,
                  position: "insideLeft",
                }}
                style={{ fontFamily: "Tiro Bangla, serif" }}
              />
              {/* <Tooltip
                formatter={(value, name) => [value, "আসন সংখ্যা"]}
                labelStyle={{ fontFamily: "Tiro Bangla, serif" }}
                contentStyle={{ fontFamily: "Tiro Bangla, serif" }}
              /> */}
              <Bar
                dataKey='seats'
                fill='#8884d8'
                radius={[4, 4, 0, 0]}
                barSize={100}
              >
                {barChartData.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey='seats'
                  position='top'
                  style={{
                    fontFamily: "Tiro Bangla, serif",
                    fill: "#333",
                    fontSize: 12,
                  }}
                  formatter={(value) => `${value}`} // Optional: Customize label format
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Section 3: Seat Distribution Analysis */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className='shadow-sm rounded-2xl p-6 bg-white'
      >
        <div className='flex justify-between items-center mb-6'>
          <h2
            className='text-2xl font-semibold text-gray-800'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            আসন বণ্টন বিশ্লেষণ
          </h2>
          <motion.button
            onClick={() => setShowAnalysisFilters(!showAnalysisFilters)}
            className='bg-[#006747] text-white px-4 py-2 rounded-md hover:bg-[#005536] transition-colors duration-200 text-sm'
            style={{ fontFamily: "Tiro Bangla, serif" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 2px 8px rgba(0, 103, 71, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            ফিল্টার {showAnalysisFilters ? "লুকান" : "দেখান"}
          </motion.button>
        </div>

        {/* Analysis Filters */}
        {showAnalysisFilters && (
          <motion.div
            className='bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4'>
              <div className='flex flex-col'>
                <label
                  className='block text-xs font-medium text-gray-600 mb-1'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {data.analysisFilters.party}
                </label>
                <motion.select
                  value={analysisFilters.party}
                  onChange={(e) =>
                    handleAnalysisFilterChange("party", e.target.value)
                  }
                  className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <option value=''>সব দল</option>
                  {data.partyOptions.map((party) => (
                    <option key={party} value={party}>
                      {party}
                    </option>
                  ))}
                </motion.select>
              </div>
              <div className='flex flex-col'>
                <label
                  className='block text-xs font-medium text-gray-600 mb-1'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {data.analysisFilters.district}
                </label>
                <motion.select
                  value={analysisFilters.district}
                  onChange={(e) =>
                    handleAnalysisFilterChange("district", e.target.value)
                  }
                  className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <option value=''>সব জেলা</option>
                  {data.districtOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </motion.select>
              </div>
              <div className='flex flex-col'>
                <label
                  className='block text-xs font-medium text-gray-600 mb-1'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {data.analysisFilters.constituency}
                </label>
                <motion.select
                  value={analysisFilters.constituency}
                  onChange={(e) =>
                    handleAnalysisFilterChange("constituency", e.target.value)
                  }
                  className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                  whileHover={{ scale: 1.02 }}
                >
                  <option value=''>সব আসন</option>
                  {data.constituencyOptions.map((constituency) => (
                    <option key={constituency} value={constituency}>
                      {constituency}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>
            <div className='flex justify-end space-x-2'>
              <motion.button
                onClick={handleAnalysisReset}
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
                onClick={handleAnalysisSearch}
                className='bg-[#006747] text-white px-4 py-2 rounded-md hover:bg-[#005536] transition-colors duration-200 text-sm'
                style={{ fontFamily: "Tiro Bangla, serif" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 2px 8px rgba(0, 103, 71, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                সার্চ করুন
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Results Table */}
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  বিভাগ
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  জেলা
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  আসন
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  দল
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {currentData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  className='hover:bg-gray-50 transition-colors duration-200'
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <td
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {item.division}
                  </td>
                  <td
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {item.district}
                  </td>
                  <td
                    className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {item.constituency}
                  </td>
                  <td
                    className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    <span
                      className='px-2 py-1 rounded-full text-xs'
                      style={{
                        backgroundColor:
                          COLORS[
                            data.partyOptions.indexOf(item.party) %
                              COLORS.length
                          ] + "20",
                        color:
                          COLORS[
                            data.partyOptions.indexOf(item.party) %
                              COLORS.length
                          ],
                      }}
                    >
                      {item.party}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-between items-center mt-6'>
            <div
              className='text-sm text-gray-700'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {startIndex + 1} থেকে{" "}
              {Math.min(endIndex, filteredAnalysisData.length)} দেখানো হচ্ছে,
              মোট {filteredAnalysisData.length} টির মধ্যে
            </div>
            <div className='flex space-x-1'>
              <motion.button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                style={{ fontFamily: "Tiro Bangla, serif" }}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              >
                পূর্ববর্তী
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    onClick={() => handlePageChange(page)}
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
                )
              )}
              <motion.button
                onClick={() => handlePageChange(currentPage + 1)}
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
        )}
      </motion.div>
    </div>
  );
}
