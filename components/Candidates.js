'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Candidates() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    division: '',
    district: '',
    constituency: '',
  });

  // Function to convert Bengali numerals to English numerals
  const convertBengaliToEnglish = (bengaliNumber) => {
    const bengaliDigits = {
      '০': '0',
      '১': '1',
      '২': '2',
      '৩': '3',
      '৪': '4',
      '৫': '5',
      '৬': '6',
      '৭': '7',
      '৮': '8',
      '৯': '9',
    };

    return bengaliNumber.replace(/[০-৯]/g, (match) => bengaliDigits[match]);
  };

  useEffect(() => {
    // Load data from JSON file
    fetch('/json/candidates.json')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = () => {
    console.log('Filters applied:', filters);
    // Apply filters logic here
  };

  const handleReset = () => {
    setFilters({
      division: '',
      district: '',
      constituency: '',
    });
  };

  if (!data) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg' style={{ fontFamily: 'Tiro Bangla, serif' }}>
          ডেটা লোড করা হচ্ছে...
        </div>
      </div>
    );
  }

  // Function to process chart data dynamically
  const processChartData = (responses) => {
    return responses.map((item) => ({
      name: item.label, // Keep Bengali label as is
      value: parseFloat(
        convertBengaliToEnglish(item.percentage.replace('%', ''))
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
          ease: 'easeOut',
        }}
        whileHover={{
          scale: 1.01,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          className='text-xl font-medium text-gray-900 mb-6'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
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
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
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
        className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 0.4 + index * 0.1,
          ease: 'easeOut',
        }}
        whileHover={{
          scale: 1.01,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          className='text-lg font-semibold text-gray-900 mb-4'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {candidateCard.title}
        </h3>
        <ul className='space-y-2'>
          {candidateCard.candidates.map((candidate, candidateIndex) => (
            <li
              key={candidateIndex}
              className='flex items-center text-gray-700'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <div className='w-2 h-2 bg-[#006747] rounded-full mr-3'></div>
              {candidate}
            </li>
          ))}
        </ul>
      </motion.div>
    );
  };

  const COLORS = [
    '#06C584',
    '#8C5CF0',
    '#EC489B',
    '#0EA7EC',
    '#F39E0B',
    '#f5ffc6',
    '#003b36',
    '#59114d',
    '#FF6B35',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
  ];

  return (
    <div className='space-y-8'>
      {/* Section 1: Filters */}
      <motion.div
        className='bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md border border-gray-100 mx-auto'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2
          className='text-xl font-semibold text-gray-800 mb-4'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          ফিল্টার
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4'>
          {Object.entries(data.filters).map(([key, label]) => (
            <div key={key} className='flex flex-col'>
              <label
                className='block text-xs font-medium text-gray-600 mb-1'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                {label}
              </label>
              <motion.select
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
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
            style={{ fontFamily: 'Tiro Bangla, serif' }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            ফিল্টার করুন
          </motion.button>
          <motion.button
            onClick={handleView}
            className='bg-[#006747] text-white px-4 py-2 rounded-md hover:bg-[#005536] transition-colors duration-200 text-sm'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 2px 8px rgba(0, 103, 71, 0.2)',
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
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        <h2
          className='text-2xl font-semibold text-gray-800 mb-6'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          আপনার এলাকার সম্ভাব্য প্রার্থীদের নামসমূহ?
        </h2>
      </motion.div>

      {/* Section 3: Candidate Cards Grid */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      >
        {data.candidateCards?.map((candidateCard, index) => (
          <CandidateCard
            key={candidateCard.id}
            candidateCard={candidateCard}
            index={index}
          />
        ))}
      </motion.div>

      {/* Section 4: Dynamic Charts Grid */}
      <motion.div
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
      >
        {data.charts?.map((chart, index) => (
          <PieChartComponent key={chart.id} chart={chart} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
