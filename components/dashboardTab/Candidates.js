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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    constituency: "",
  });

  // API endpoint - can be easily changed to real API
  const API_ENDPOINT = "/json/candidates.json"; // Change this to your API endpoint

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
      name: item.label, // Keep Bengali label as is
      value: parseFloat(
        convertBengaliToEnglish(item.percentage.replace("%", ""))
      ),
      displayValue: item.percentage, // Keep original Bengali percentage for display
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
          {/* Custom Legend */}
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
          {/* Pie Chart */}
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
        {/* Subtle background accent */}
        <div className='absolute inset-0 bg-gradient-to-r from-[#006747]/10 to-transparent opacity-20' />

        {/* Card Content */}
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
        {/* Section 3: Candidate Cards Grid */}
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
        {" "}
        <h2
          className='text-2xl font-semibold text-gray-800 mb-6'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিত বলে আপনি মনে করেন?
        </h2>
        {/* Section 4: Dynamic Charts Grid */}
        <motion.div
          className='grid grid-cols-1 lg:grid-cols-2 gap-6'
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          {data.charts?.map((chart, index) => {
            // Determine chart type based on chart properties
            const shouldUseRadialChart =
              chart.id === "candidate-qualifications" ||
              chart.chartType === "radial" ||
              (chart.responses && chart.responses.length > 8); // Use radial for complex data with many options

            if (shouldUseRadialChart) {
              return (
                <RadialBarChartComponent
                  key={chart.id}
                  chart={chart}
                  index={index}
                />
              );
            }

            // Use PieChart for all other questions
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
          // Determine chart type based on chart properties
          const shouldUseRadialChart =
            chart.id === "candidate-qualifications" ||
            chart.chartType === "radial" ||
            (chart.responses && chart.responses.length > 8); // Use radial for complex data with many options

          if (shouldUseRadialChart) {
            return (
              <RadialBarChartComponent
                key={chart.id}
                chart={chart}
                index={index}
              />
            );
          }

          // Use PieChart for all other questions
          return (
            <PieChartComponent key={chart.id} chart={chart} index={index} />
          );
        })}
      </motion.div>
    </div>
  );
}
