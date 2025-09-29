"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

export default function Candidates() {
  const [data, setData] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    constituency: "",
  });

  // API endpoint for chart data
  const API_ENDPOINT = "/json/candidates.json"; // Local JSON file for charts, candidate cards, and qualities

  // Replace with your actual token (e.g., from context, localStorage, or environment variable)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Function to convert Bengali numerals to English numerals
  const convertBengaliToEnglish = (bengaliNumber) => {
    const bengaliDigits = {
      "০": "0",
      "১": "1",
      "২": "2",
      "৩": "3",
      "৪": "4",
      "৫": "5",
      "৬": "6",
      "৭": "7",
      "৮": "8",
      "৯": "9",
    };
    return bengaliNumber.replace(/[০-৯]/g, (match) => bengaliDigits[match]);
  };

  // Fetch divisions and initial chart data on component mount
  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing");
      setLoading(false);
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch divisions from API
        const divisionsResponse = await fetch(
          "https://npsbd.xyz/api/divisions",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!divisionsResponse.ok) {
          throw new Error(`HTTP error! status: ${divisionsResponse.status}`);
        }
        const divisionsData = await divisionsResponse.json();
        setDivisions(divisionsData);

        // Fetch chart data from JSON file
        const chartResponse = await fetch(API_ENDPOINT);
        if (!chartResponse.ok) {
          throw new Error(`HTTP error! status: ${chartResponse.status}`);
        }
        const chartData = await chartResponse.json();
        setData(chartData);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [token]);

  // Fetch districts when division changes
  useEffect(() => {
    if (!token || !filters.division) {
      setDistricts([]);
      setConstituencies([]);
      setFilters((prev) => ({
        ...prev,
        district: "",
        constituency: "",
      }));
      return;
    }

    const loadDistricts = async () => {
      try {
        // Find the division ID corresponding to the selected bn_name
        const selectedDivision = divisions.find(
          (div) => div.bn_name === filters.division
        );
        if (!selectedDivision) {
          throw new Error("Selected division not found");
        }

        const response = await fetch(
          `https://npsbd.xyz/api/divisions/${selectedDivision.id}/districts`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDistricts(data);
        setConstituencies([]);
        setFilters((prev) => ({
          ...prev,
          district: "",
          constituency: "",
        }));
      } catch (error) {
        console.error("Error fetching districts:", error);
        setError(error.message);
      }
    };

    loadDistricts();
  }, [filters.division, token, divisions]);

  // Fetch constituencies when district changes
  useEffect(() => {
    if (!token || !filters.district) {
      setConstituencies([]);
      setFilters((prev) => ({
        ...prev,
        constituency: "",
      }));
      return;
    }

    const loadConstituencies = async () => {
      try {
        // Find the district ID corresponding to the selected bn_name
        const selectedDistrict = districts.find(
          (dist) => dist.bn_name === filters.district
        );
        if (!selectedDistrict) {
          throw new Error("Selected district not found");
        }

        const response = await fetch(
          `https://npsbd.xyz/api/districts/${selectedDistrict.id}/seats`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConstituencies(data);
        setFilters((prev) => ({
          ...prev,
          constituency: "",
        }));
      } catch (error) {
        console.error("Error fetching constituencies:", error);
        setError(error.message);
      }
    };

    loadConstituencies();
  }, [filters.district, token, districts]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = () => {
    console.log("Filters applied:", filters);
    // Add logic to fetch filtered chart data using bn_name as params in future
  };

  const handleReset = () => {
    setFilters({
      division: "",
      district: "",
      constituency: "",
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-gray-600 bg-white p-8 rounded-xl shadow-sm border border-gray-100'
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

  // Function to process radial chart data
  const processRadialChartData = (responses) => {
    return responses.map((item, index) => ({
      name: item.label,
      uv: parseFloat(convertBengaliToEnglish(item.percentage.replace("%", ""))),
      displayValue: item.percentage,
      fill: COLORS[index % COLORS.length],
    }));
  };

  // Component for rendering radial bar charts
  const RadialBarChartComponent = ({ chart, index }) => {
    const chartData = processRadialChartData(chart.responses);

    const legendStyle = {
      top: "50%",
      right: 0,
      transform: "translate(0, -50%)",
      lineHeight: "20px",
      fontSize: "12px",
    };

    return (
      <motion.div
        className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.6 + index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.01,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className='text-xl font-medium text-gray-900 mb-6'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {chart.question}
        </h2>
        <div className='h-96'>
          <ResponsiveContainer width='100%' height='100%'>
            <RadialBarChart
              cx='50%'
              cy='50%'
              innerRadius='10%'
              outerRadius='80%'
              barSize={10}
              data={chartData}
            >
              <RadialBar
                minAngle={15}
                label={{ position: "insideStart", fill: "#fff", fontSize: 10 }}
                background
                clockWise
                dataKey='uv'
              />
              <Legend
                iconSize={8}
                layout='vertical'
                verticalAlign='middle'
                wrapperStyle={{
                  ...legendStyle,
                  fontFamily: "Tiro Bangla, serif",
                }}
                formatter={(value, entry) =>
                  `${value}: ${entry.payload.displayValue}`
                }
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  // Function to process chart data dynamically
  const processChartData = (responses) => {
    return responses.map((item) => ({
      name: item.label,
      value: parseFloat(
        convertBengaliToEnglish(item.percentage.replace("%", ""))
      ),
      displayValue: item.percentage,
    }));
  };

  // Component for rendering individual pie charts
  const PieChartComponent = ({ chart, index }) => {
    const chartData = processChartData(chart.responses);

    return (
      <motion.div
        className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.6 + index * 0.1,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.01,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          className='text-xl font-medium text-gray-900 mb-6'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {chart.question}
        </h2>
        <div className='h-80 flex'>
          <div className='w-1/2 flex flex-col justify-center space-y-2 pr-4'>
            {chartData.map((entry, entryIndex) => (
              <div key={entry.name} className='flex items-center'>
                <div
                  className='w-4 h-4 rounded mr-2'
                  style={{
                    backgroundColor: COLORS[entryIndex % COLORS.length],
                  }}
                ></div>
                <span
                  className='text-sm font-medium'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {entry.name}: {entry.displayValue}
                </span>
              </div>
            ))}
          </div>
          <div className='w-1/2'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={chartData}
                  cx='50%'
                  cy='50%'
                  innerRadius={chart.hasInnerRadius ? 40 : 0}
                  outerRadius={80}
                  fill='#8884d8'
                  paddingAngle={1}
                  dataKey='value'
                >
                  {chartData.map((entry, entryIndex) => (
                    <Cell
                      key={`cell-${entryIndex}`}
                      fill={COLORS[entryIndex % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  // Component for rendering candidate cards
  const CandidateCard = ({ candidateCard, index }) => {
    return (
      <motion.div
        className='relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/50 
                 hover:shadow-xl transition-shadow duration-300 overflow-hidden'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.3 },
        }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-[#006747]/10 to-transparent opacity-20' />
        <h3
          className='text-xl font-bold px-4 py-2 bg-gray-200 text-gray-900 mb-5 relative z-10'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {candidateCard.title}
        </h3>
        <ul className='space-y-3 px-4 py-2'>
          {candidateCard.candidates.map((candidate, candidateIndex) => (
            <motion.li
              key={candidateIndex}
              className='flex items-center text-gray-700 text-sm'
              style={{ fontFamily: "Tiro Bangla, serif" }}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: index * 0.15 + candidateIndex * 0.05,
                ease: "easeOut",
              }}
            >
              <div className='w-3 h-3 bg-[#006747] rounded-full mr-3 flex-shrink-0' />
              <span className='leading-relaxed'>{candidate}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  };

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

  return (
    <div className='p-4 lg:p-8 space-y-8'>
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
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              বিভাগ
            </label>
            <motion.select
              value={filters.division}
              onChange={(e) => handleFilterChange("division", e.target.value)}
              className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.bn_name}>
                  {division.bn_name}
                </option>
              ))}
            </motion.select>
          </div>
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              জেলা
            </label>
            <motion.select
              value={filters.district}
              onChange={(e) => handleFilterChange("district", e.target.value)}
              className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!filters.division}
            >
              <option value=''>নির্বাচন করুন</option>
              {districts.map((district) => (
                <option key={district.id} value={district.bn_name}>
                  {district.bn_name}
                </option>
              ))}
            </motion.select>
          </div>
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              নির্বাচনী এলাকা
            </label>
            <motion.select
              value={filters.constituency}
              onChange={(e) =>
                handleFilterChange("constituency", e.target.value)
              }
              className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!filters.district}
            >
              <option value=''>নির্বাচন করুন</option>
              {constituencies.map((constituency) => (
                <option key={constituency.id} value={constituency.bn_name}>
                  {constituency.bn_name}
                </option>
              ))}
            </motion.select>
          </div>
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

      {/* Section 2: Main Candidate Cards Header */}
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
          আপনার এলাকার সম্ভাব্য প্রার্থীদের নামসমূহ?
        </h2>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {data.candidateCards?.map((candidateCard, index) => (
            <CandidateCard
              key={candidateCard.id}
              candidateCard={candidateCard}
              index={index}
            />
          ))}
        </motion.div>
      </motion.div>

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
          আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিত বলে আপনি মনে করেন?
        </h2>
        <motion.div
          className='grid grid-cols-1 lg:grid-cols-2 gap-6'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          {data.charts?.map((chart, index) => {
            const shouldUseRadialChart =
              chart.id === "candidate-qualifications" ||
              chart.chartType === "radial" ||
              (chart.responses && chart.responses.length > 8);

            if (shouldUseRadialChart) {
              return (
                <RadialBarChartComponent
                  key={chart.id}
                  chart={chart}
                  index={index}
                />
              );
            }

            return (
              <PieChartComponent key={chart.id} chart={chart} index={index} />
            );
          })}
        </motion.div>
      </motion.div>

      {/* Section 5: Dynamic Charts Grid */}
      <motion.div
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        {data.qualities?.map((chart, index) => {
          const shouldUseRadialChart =
            chart.id === "candidate-qualifications" ||
            chart.chartType === "radial" ||
            (chart.responses && chart.responses.length > 8);

          if (shouldUseRadialChart) {
            return (
              <RadialBarChartComponent
                key={chart.id}
                chart={chart}
                index={index}
              />
            );
          }

          return (
            <PieChartComponent key={chart.id} chart={chart} index={index} />
          );
        })}
      </motion.div>
    </div>
  );
}
