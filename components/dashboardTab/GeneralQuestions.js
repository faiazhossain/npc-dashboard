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
import { useAuth } from '@/hooks/useAuth';

export default function GeneralQuestions() {
  const [data, setData] = useState(null);
  const [filteredChartData, setFilteredChartData] = useState(null);
  const { userData, userType } = useAuth(); // Using userData and userType from useAuth
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
    status: '',
  });

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [unions, setUnions] = useState([]);
  const [wards, setWards] = useState([]);

  // Retrieve token from localStorage (adjust key if different)
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  // If token is in Redux, uncomment and use this instead:
  // const { token } = useAuth();

  const genderOptions = ['নারী', 'পুরুষ', 'তৃতীয় লিঙ্গ'];
  const professionOptions = [
    'শিক্ষার্থী (কলেজ)',
    'শিক্ষার্থী (বিশ্ববিদ্যালয়)',
    'কৃষক',
    'শিক্ষক/শিক্ষিকা',
    'চিকিৎসক/নার্স',
    'ইঞ্জিনিয়ার',
    'ব্যবসায়ী',
    'সরকারি চাকরিজীবী',
    'ব্যাংক কর্মকর্তা',
    'মার্কেটিং/বিক্রয় প্রতিনিধি',
    'আইটি পেশাজীবী',
    'মিডিয়া কর্মী',
    'গৃহিণী',
    'কর্মচারী',
    'নির্মাণ/মিস্ত্রি',
    'গৃহকর্মী',
    'ফ্রিল্যান্সার',
    'অ্যাডভোকেট/আইনজীবী',
    'সামাজিক কাজ/NGO কর্মী',
    'শিল্পী',
    'বিপণন/বিক্রয় বিশেষজ্ঞ',
    'খুচরা ব্যবসায়ী',
    'অন্যান্য',
  ];

  const statusOptions = [
    { value: 'pending', label: 'অপেক্ষামান' },
    { value: 'accepted', label: 'অনুমোদিত' },
    { value: 'rejected', label: 'বাতিল' },
  ];

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
    if (!token) {
      console.error('No token available for API requests');
      return;
    }

    // Fetch divisions
    fetch('https://npsbd.xyz/api/divisions', {
      method: 'GET',
      headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setDivisions(data))
      .catch((error) => console.error('Error fetching divisions:', error));

    // Fetch initial chart data
    fetch('https://npsbd.xyz/api/dashboard/questions/stats', {
      method: 'GET',
      headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedData = {
          voterStatistics: {
            totalVoters: '0', // Placeholder, update if API provides this
            maleVoters: '0',
            femaleVoters: '0',
            thirdGenderVoters: '0',
          },
          charts: data.map((item) => ({
            id: item.question,
            question: item.question,
            responses: item.stats.map((stat) => ({
              label: stat.label,
              percentage: `${stat.value}%`,
            })),
            hasInnerRadius: item.question.includes('প্রধান চাওয়া'),
          })),
        };
        setData(formattedData);
        setFilteredChartData(formattedData);
      })
      .catch((error) => console.error('Error loading initial data:', error));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    if (filters.division) {
      fetch(`https://npsbd.xyz/api/divisions/${filters.division}/districts`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setDistricts(data);
          setConstituencies([]);
          setThanas([]);
          setUnions([]);
          setWards([]);
          setFilters((prev) => ({
            ...prev,
            district: '',
            constituency: '',
            thana: '',
            union: '',
            ward: '',
          }));
        })
        .catch((error) => console.error('Error fetching districts:', error));
    } else {
      setDistricts([]);
      setConstituencies([]);
      setThanas([]);
      setUnions([]);
      setWards([]);
      setFilters((prev) => ({
        ...prev,
        district: '',
        constituency: '',
        thana: '',
        union: '',
        ward: '',
      }));
    }
  }, [filters.division, token]);

  useEffect(() => {
    if (!token) return;

    if (filters.district) {
      fetch(`https://npsbd.xyz/api/districts/${filters.district}/seats`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setConstituencies(data);
          setThanas([]);
          setUnions([]);
          setWards([]);
          setFilters((prev) => ({
            ...prev,
            constituency: '',
            thana: '',
            union: '',
            ward: '',
          }));
        })
        .catch((error) =>
          console.error('Error fetching constituencies:', error)
        );
    } else {
      setConstituencies([]);
      setThanas([]);
      setUnions([]);
      setWards([]);
      setFilters((prev) => ({
        ...prev,
        constituency: '',
        thana: '',
        union: '',
        ward: '',
      }));
    }
  }, [filters.district, token]);

  useEffect(() => {
    if (!token) return;

    if (filters.constituency) {
      fetch(`https://npsbd.xyz/api/seats/${filters.constituency}/thanas`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setThanas(data);
          setUnions([]);
          setWards([]);
          setFilters((prev) => ({ ...prev, thana: '', union: '', ward: '' }));
        })
        .catch((error) => console.error('Error fetching thanas:', error));
    } else {
      setThanas([]);
      setUnions([]);
      setWards([]);
      setFilters((prev) => ({ ...prev, thana: '', union: '', ward: '' }));
    }
  }, [filters.constituency, token]);

  useEffect(() => {
    if (!token) return;

    if (filters.district && filters.thana) {
      const selectedDistrict = districts.find((d) => d.id == filters.district);
      const selectedThana = thanas.find((t) => t.id == filters.thana);

      if (selectedDistrict && selectedThana) {
        const districtBnName = encodeURIComponent(selectedDistrict.bn_name);
        const thanaBnName = encodeURIComponent(selectedThana.bn_name);
        const wardApiUrl = `https://npsbd.xyz/api/users/${districtBnName}/${thanaBnName}/unions_wards`;

        fetch(wardApiUrl, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const wardsData = Array.isArray(data.wards)
              ? data.wards.map((ward, index) => ({
                  id: index + 1,
                  bn_name: ward,
                }))
              : [];

            const unionsData = Array.isArray(data.unions)
              ? data.unions.map((union, index) => ({
                  id: index + 1,
                  bn_name: union,
                }))
              : [];

            setWards(wardsData);
            setUnions(unionsData);
            setFilters((prev) => ({
              ...prev,
              ward: '',
              union: '',
            }));
          })
          .catch((error) => {
            console.error('Error fetching wards/unions:', error);
            setWards([]);
            setUnions([]);
            setFilters((prev) => ({
              ...prev,
              ward: '',
              union: '',
            }));
          });
      } else {
        setWards([]);
        setUnions([]);
        setFilters((prev) => ({
          ...prev,
          ward: '',
          union: '',
        }));
      }
    } else {
      setWards([]);
      setUnions([]);
      setFilters((prev) => ({
        ...prev,
        ward: '',
        union: '',
      }));
    }
  }, [filters.district, filters.thana, districts, thanas, token]);

  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = () => {
    if (!token) {
      console.error('No token available for API request');
      return;
    }

    console.log('Filters applied:', filters);
    const queryParams = new URLSearchParams();

    // Map filters to Bengali parameter names
    if (filters.age) {
      // Map age range to a single value if needed (adjust based on API requirements)
      const ageMap = {
        '18-25': '25',
        '26-35': '35',
        '36-45': '45',
        '46+': '60',
      };
      queryParams.append('বয়স', ageMap[filters.age] || filters.age);
    }
    if (filters.gender) queryParams.append('লিঙ্গ', filters.gender);
    if (filters.constituency) {
      const constituency = constituencies.find(
        (c) => c.id == filters.constituency
      );
      if (constituency && constituency.bn_name) {
        queryParams.append('আসন', constituency.bn_name.trim());
      }
    }

    if (filters.district) {
      const district = districts.find((d) => d.id == filters.district);
      if (district && district.bn_name) {
        // Trim and append directly
        queryParams.append('জেলা', district.bn_name.trim());
      }
    }

    if (filters.thana) {
      const thana = thanas.find((t) => t.id == filters.thana);
      if (thana && thana.bn_name) {
        queryParams.append('থানা', thana.bn_name.trim());
      }
    }

    if (filters.division) {
      const division = divisions.find((d) => d.id == filters.division);
      if (division && division.bn_name) {
        // Trim and append directly; URLSearchParams handles encoding
        queryParams.append('বিভাগ', division.bn_name.trim());
      }
    }

    if (filters.union) {
      const union = unions.find((u) => u.id == filters.union);
      if (union)
        queryParams.append('ইউনিয়ন', encodeURIComponent(union.bn_name));
    }
    if (filters.ward) {
      const ward = wards.find((w) => w.id == filters.ward);
      if (ward) queryParams.append('ওয়ার্ড', encodeURIComponent(ward.bn_name));
    }
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.profession && filters.profession.trim()) {
      queryParams.append('পেশা', filters.profession.trim());
    }
    // Updated line

    const apiUrl = `https://npsbd.xyz/api/dashboard/questions/stats?${queryParams.toString()}`;

    fetch(apiUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((apiData) => {
        const formattedData = {
          voterStatistics: {
            totalVoters: '234', // Placeholder, update if API provides this
            maleVoters: '122',
            femaleVoters: '100',
            thirdGenderVoters: '12',
          },
          charts: apiData.map((item) => ({
            id: item.question,
            question: item.question,
            responses: item.stats.map((stat) => ({
              label: stat.label,
              percentage: `${stat.value}%`,
            })),
            hasInnerRadius: item.question.includes('প্রধান চাওয়া'),
          })),
        };
        setFilteredChartData(formattedData);
      })
      .catch((error) => console.error('Error fetching filtered data:', error));
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
      status: '',
    });
    setDistricts([]);
    setConstituencies([]);
    setThanas([]);
    setUnions([]);
    setWards([]);
    setFilteredChartData(data);
  };

  if (!filteredChartData) {
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

  const processChartData = (responses) => {
    return responses.map((item) => ({
      name: item.label,
      value: parseFloat(
        convertBengaliToEnglish(item.percentage.replace('%', ''))
      ),
      displayValue: item.percentage,
    }));
  };

  const ChartComponent = ({ chart, index }) => {
    const chartData = processChartData(chart.responses);

    return (
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
        <h2
          className='text-xl font-medium text-gray-900 mb-6'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {chart.question}
        </h2>
        <div className='flex' style={{ height: '320px' }}>
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
      </div>
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
      <div className='bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md border border-gray-100 mx-auto'>
        <h2
          className='text-xl font-semibold text-gray-800 mb-4'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          ফিল্টার
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4'>
          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              বিভাগ
            </label>
            <select
              value={filters.division}
              onChange={(e) => handleFilterChange('division', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <option value=''>নির্বাচন করুন</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.bn_name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              জেলা
            </label>
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <option value=''>নির্বাচন করুন</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.bn_name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              আসন
            </label>
            <select
              value={filters.constituency}
              onChange={(e) =>
                handleFilterChange('constituency', e.target.value)
              }
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <option value=''>নির্বাচন করুন</option>
              {constituencies.map((constituency) => (
                <option key={constituency.id} value={constituency.id}>
                  {constituency.bn_name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              থানা
            </label>
            <select
              value={filters.thana}
              onChange={(e) => handleFilterChange('thana', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <option value=''>নির্বাচন করুন</option>
              {thanas.map((thana) => (
                <option key={thana.id} value={thana.id}>
                  {thana.bn_name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              ওয়ার্ড
            </label>
            <select
              value={filters.ward}
              onChange={(e) => handleFilterChange('ward', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              {filters.district && filters.thana && wards.length === 0 ? (
                <option className='text-sm text-red-600' value=''>
                  ওয়ার্ড পাওয়া যায়নি
                </option>
              ) : (
                <option value=''>নির্বাচন করুন</option>
              )}
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.bn_name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              ইউনিয়ন
            </label>
            <select
              value={filters.union}
              onChange={(e) => handleFilterChange('union', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              {filters.district && filters.thana && unions.length === 0 ? (
                <option className='text-sm text-red-600' value=''>
                  ইউনিয়ন পাওয়া যায়নি
                </option>
              ) : (
                <option value=''>নির্বাচন করুন</option>
              )}
              {unions.map((union) => (
                <option key={union.id} value={union.id}>
                  {union.bn_name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              লিঙ্গ
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <option value=''>নির্বাচন করুন</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              পেশা
            </label>
            <select
              value={filters.profession}
              onChange={(e) => handleFilterChange('profession', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <option value=''>নির্বাচন করুন</option>
              {professionOptions.map((profession) => (
                <option key={profession} value={profession}>
                  {profession}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col'>
            <label
              className='block text-xs font-medium text-gray-600 mb-1'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              বয়স
            </label>
            <select
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <option value=''>নির্বাচন করুন</option>
              <option value='18-34'>১৮-৩৪</option>
              <option value='35-45'>৩৫-৪৫</option>
              <option value='46-60'>৪৬-৬০</option>
              <option value='60+'>৬০+</option>
            </select>
          </div>
          {(userType === 'super_admin' || userType === 'admin') && (
            <div className='flex flex-col'>
              <label
                className='block text-xs font-medium text-gray-600 mb-1'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                স্ট্যাটাস
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className='w-full px-3 py-2 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm hover:scale-[1.02]'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                <option value=''>নির্বাচন করুন</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className='flex justify-end space-x-2'>
          <button
            onClick={handleReset}
            className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm hover:scale-105 hover:shadow-md active:scale-95'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            রিসেট করুন
          </button>
          <button
            onClick={handleView}
            className='bg-[#006747] text-white px-4 py-2 rounded-md hover:bg-[#005536] transition-colors duration-200 text-sm hover:scale-105 hover:shadow-md active:scale-95'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            দেখুন
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {Object.entries(filteredChartData.voterStatistics).map(
          ([key, value], index) => {
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
              <div
                key={key}
                className={`${colors[key]} p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center transition-all duration-300`}
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
              </div>
            );
          }
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredChartData.charts?.map((chart, index) => (
          <ChartComponent key={chart.id} chart={chart} index={index} />
        ))}
      </div>
    </div>
  );
}
