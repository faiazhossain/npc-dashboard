'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import Image from 'next/image';

export default function GeneralQuestions() {
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    division: '',
    district: '',
    constituency: '',
    thana: '',
    ward: '',
    union: '',
    gender: '',
    profession: '',
    age: '',
  });

  // State for API-fetched options
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [unions, setUnions] = useState([]);

  // Static options for gender and profession
  const genderOptions = ['নারী', 'পুরুষ', 'তৃতীয় লিঙ্গ'];
  const professionOptions = [
    'শিক্ষার্থী (কলেজ)',
    'শিক্ষার্থী (বিশ্ববিদ্যালয়)',
    'কৃষক',
    'শিক্ষক/শিক্ষিকা',
    'চিকিৎসক/নার্স',
    'ইঞ্জিনিয়ার',
    'ব্যবসায়ী',
    'সরকারি চাকরিজীবী',
    'ব্যাংক কর্মকর্তা',
    'মার্কেটিং/বিক্রয় প্রতিনিধি',
    'আইটি পেশাজীবী',
    'মিডিয়া কর্মী',
    'কর্মচারী',
    'নির্মাণ/মিস্ত্রি',
    'গৃহকর্মী',
    'ফ্রিল্যান্সার',
    'অ্যাডভোকেট/আইনজীবী',
    'সামাজিক কাজ/NGO কর্মী',
    'শিল্পী',
    'বিপণন/বিক্রয় বিশেষজ্ঞ',
    'খুচরা ব্যবসায়ী',
    'অন্যান্য',
  ];

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

  // Fetch divisions on component mount
  useEffect(() => {
    fetch('https://npsbd.xyz/api/divisions', {
      method: 'GET',
      headers: { accept: 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => setDivisions(data))
      .catch((error) => console.error('Error fetching divisions:', error));

    // Load static JSON data (for charts and voter statistics)
    fetch('/json/general-questions.json')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (filters.division) {
      fetch(`https://npsbd.xyz/api/divisions/${filters.division}/districts`, {
        method: 'GET',
        headers: { accept: 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          setDistricts(data);
          setThanas([]); // Reset thanas
          setConstituencies([]); // Reset constituencies
          setUnions([]); // Reset unions
          setFilters((prev) => ({
            ...prev,
            district: '',
            thana: '',
            constituency: '',
            union: '',
          }));
        })
        .catch((error) => console.error('Error fetching districts:', error));
    } else {
      setDistricts([]);
      setThanas([]);
      setConstituencies([]);
      setUnions([]);
      setFilters((prev) => ({
        ...prev,
        district: '',
        thana: '',
        constituency: '',
        union: '',
      }));
    }
  }, [filters.division]);

  // Fetch constituencies and thanas when district changes
  useEffect(() => {
    if (filters.district) {
      // Fetch constituencies
      fetch(`https://npsbd.xyz/api/districts/${filters.district}/seats`, {
        method: 'GET',
        headers: { accept: 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          setConstituencies(data);
          setFilters((prev) => ({ ...prev, constituency: '' }));
        })
        .catch((error) =>
          console.error('Error fetching constituencies:', error)
        );

      // Fetch thanas
      fetch(`https://npsbd.xyz/api/districts/${filters.district}/thanas`, {
        method: 'GET',
        headers: { accept: 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          setThanas(data);
          setUnions([]); // Reset unions
          setFilters((prev) => ({ ...prev, thana: '', union: '' }));
        })
        .catch((error) => console.error('Error fetching thanas:', error));
    } else {
      setConstituencies([]);
      setThanas([]);
      setUnions([]);
      setFilters((prev) => ({
        ...prev,
        thana: '',
        constituency: '',
        union: '',
      }));
    }
  }, [filters.district]);

  // Fetch unions when thana changes
  useEffect(() => {
    if (filters.thana) {
      fetch(`https://npsbd.xyz/api/thanas/${filters.thana}/unions`, {
        method: 'GET',
        headers: { accept: 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          setUnions([
            ...data,
            { id: 'custom', name: 'Custom Input', bn_name: 'কাস্টম ইনপুট' },
          ]); // Allow custom union input
          setFilters((prev) => ({ ...prev, union: '' }));
        })
        .catch((error) => console.error('Error fetching unions:', error));
    } else {
      setUnions([]);
      setFilters((prev) => ({ ...prev, union: '' }));
    }
  }, [filters.thana]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = () => {
    console.log('Filters applied:', filters);
    // Apply filters logic here (e.g., filter chart data based on selections)
  };

  const handleReset = () => {
    setFilters({
      division: '',
      district: '',
      constituency: '',
      thana: '',
      ward: '',
      union: '',
      gender: '',
      profession: '',
      age: '',
    });
    setDistricts([]);
    setConstituencies([]);
    setThanas([]);
    setUnions([]);
  };

  if (!data) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-gray-600 bg-white p-8 rounded-xl shadow-sm border border-gray-100'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          ডেটা লোড করা হচ্ছে...
        </motion.div>
      </div>
    );
  }

  // Function to process chart data dynamically
  const processChartData = (responses) => {
    return responses.map((item) => ({
      name: item.label,
      value: parseFloat(
        convertBengaliToEnglish(item.percentage.replace('%', ''))
      ),
      displayValue: item.percentage,
    }));
  };

  // Component for rendering individual charts (Pie or Bar)
  const ChartComponent = ({ chart, index }) => {
    const chartData = processChartData(chart.responses);
    const isPartyPreference = chart.id === 'partyPreference';

    return (
      <motion.div
        className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.4 + index * 0.1,
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
        <div
          className='flex'
          style={{ height: isPartyPreference ? '600px' : '320px' }}
        >
          <div className='w-1/2 flex flex-col justify-center space-y-2 pr-4 overflow-y-auto'>
            {chartData.map((entry, entryIndex) => (
              <div key={entry.name} className='flex items-center'>
                <div
                  className='w-4 h-4 rounded mr-2'
                  style={{
                    backgroundColor: COLORS[entryIndex % COLORS.length],
                  }}
                ></div>
                <span
                  className='text-sm font-medium truncate'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  {entry.name}: {entry.displayValue}
                </span>
              </div>
            ))}
          </div>
          <div className='w-1/2'>
            <ResponsiveContainer width='100%' height='100%'>
              {isPartyPreference ? (
                <BarChart
                  data={chartData}
                  layout='vertical'
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    type='number'
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type='category'
                    dataKey='name'
                    width={100}
                    tick={{ fontSize: 12, fontFamily: 'Tiro Bangla, serif' }}
                  />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`]} />
                  <Bar dataKey='value' fill='#8884d8'>
                    {chartData.map((entry, entryIndex) => (
                      <Cell
                        key={`cell-${entryIndex}`}
                        fill={COLORS[entryIndex % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
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
              )}
            </ResponsiveContainer>
          </div>
        </div>
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
    '#FF6F61',
    '#6B7280',
    '#10B981',
    '#FBBF24',
    '#3B82F6',
    '#D1D5DB',
    '#EF4444',
    '#8B5CF6',
    '#F97316',
    '#4B5563',
  ];

  return (
    <div className='p-4 lg:p-8 space-y-8'>
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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4'>
          {/* Division Dropdown */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              বিভাগ
            </label>
            <motion.select
              value={filters.division}
              onChange={(e) => handleFilterChange('division', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.bn_name}
                </option>
              ))}
            </motion.select>
          </div>

          {/* District Dropdown */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              জেলা
            </label>
            <motion.select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.bn_name}
                </option>
              ))}
            </motion.select>
          </div>

          {/* Constituency Dropdown */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              আসন
            </label>
            <motion.select
              value={filters.constituency}
              onChange={(e) =>
                handleFilterChange('constituency', e.target.value)
              }
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              {constituencies.map((constituency) => (
                <option key={constituency.id} value={constituency.id}>
                  {constituency.bn_name}
                </option>
              ))}
            </motion.select>
          </div>

          {/* Thana Dropdown */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              থানা
            </label>
            <motion.select
              value={filters.thana}
              onChange={(e) => handleFilterChange('thana', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              {thanas.map((thana) => (
                <option key={thana.id} value={thana.id}>
                  {thana.bn_name}
                </option>
              ))}
            </motion.select>
          </div>

          {/* Ward Text Input */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              ওয়ার্ড
            </label>
            <motion.input
              type='text'
              value={filters.ward}
              onChange={(e) => handleFilterChange('ward', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              placeholder='ওয়ার্ড লিখুন'
              whileHover={{ scale: 1.02 }}
            />
          </div>

          {/* Union Dropdown or Text Input */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              ইউনিয়ন
            </label>
            {unions.length > 0 ? (
              <motion.select
                value={filters.union}
                onChange={(e) => handleFilterChange('union', e.target.value)}
                className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
                whileHover={{ scale: 1.02 }}
              >
                <option value=''>নির্বাচন করুন</option>
                {unions.map((union) => (
                  <option
                    key={union.id}
                    value={union.id === 'custom' ? '' : union.id}
                  >
                    {union.id === 'custom' ? 'কাস্টম ইনপুট' : union.bn_name}
                  </option>
                ))}
              </motion.select>
            ) : (
              <motion.input
                type='text'
                value={filters.union}
                onChange={(e) => handleFilterChange('union', e.target.value)}
                className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
                placeholder='ইউনিয়ন লিখুন'
                whileHover={{ scale: 1.02 }}
              />
            )}
          </div>

          {/* Gender Dropdown */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              লিঙ্গ
            </label>
            <motion.select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </motion.select>
          </div>

          {/* Profession Dropdown */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              পেশা
            </label>
            <motion.select
              value={filters.profession}
              onChange={(e) => handleFilterChange('profession', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              {professionOptions.map((profession) => (
                <option key={profession} value={profession}>
                  {profession}
                </option>
              ))}
            </motion.select>
          </div>

          {/* Age Dropdown */}
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              বয়স
            </label>
            <motion.select
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              whileHover={{ scale: 1.02 }}
            >
              <option value=''>নির্বাচন করুন</option>
              <option value='18-25'>১৮-২৫</option>
              <option value='26-35'>২৬-৩৫</option>
              <option value='36-45'>৩৬-৪৫</option>
              <option value='46+'>৪৬+</option>
            </motion.select>
          </div>
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
            রিসেট করুন
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

      {/* Section 2: Voter Statistics Cards */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        {Object.entries(data.voterStatistics).map(([key, value], index) => {
          const titles = {
            totalVoters: 'মোট ভোটার',
            maleVoters: 'পুরুষ ভোটার',
            femaleVoters: 'নারী ভোটার',
            thirdGenderVoters: 'তৃতীয় লিঙ্গের ভোটার',
          };
          const colors = {
            totalVoters:
              'bg-gradient-to-br from-[#e0edeb] to-[#e0e7eb] text-gray-800',
            maleVoters:
              'bg-gradient-to-br from-[#e0ecf8] to-[#e0ecf0] text-gray-800',
            femaleVoters:
              'bg-gradient-to-br from-[#e5e5ff] to-[#e5e0ff] text-gray-800',
            thirdGenderVoters:
              'bg-gradient-to-br from-[#ffe5e0] to-[#f0e5e0] text-gray-800',
          };
          const icons = {
            totalVoters: 'profile.svg',
            maleVoters: 'man.svg',
            femaleVoters: 'woman.svg',
            thirdGenderVoters: 'aquarius.svg',
          };

          return (
            <motion.div
              key={key}
              className={`${colors[key]} p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center transition-all duration-300`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + index * 0.08,
                ease: 'easeOut',
              }}
            >
              <Image
                src={`/Images/gender/${icons[key]}`}
                alt={`${titles[key]} icon`}
                width={32}
                height={32}
                className='mb-2 rounded-full'
              />
              <h3
                className='text-xs font-medium text-center'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                {titles[key]}
              </h3>
              <p
                className='text-xl font-bold'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                {value}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Dynamic Charts Grid */}
      <motion.div
        className='grid grid-cols-1 lg:grid-cols-2 gap-6'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      >
        {data.charts?.map((chart, index) => (
          <ChartComponent key={chart.id} chart={chart} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
