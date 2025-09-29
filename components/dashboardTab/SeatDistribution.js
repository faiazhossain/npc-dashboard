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
  LabelList,
} from "recharts";

export default function SeatDistribution() {
  const [data, setData] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    constituency: "",
  });

  // Replace with your actual token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Fetch divisions on component mount
  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

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
      } catch (error) {
        console.error("Error loading divisions:", error);
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

  // Fetch party popularity data when "দেখুন" button is clicked
  const handleView = async () => {
    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const queryParams = buildQueryParams();
      const url = `https://npsbd.xyz/api/dashboard/party/popularity${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const popularityData = await response.json();
      setData(popularityData);
    } catch (error) {
      console.error("Error fetching party popularity:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (filters.division) queryParams.append("বিভাগ", filters.division);
    if (filters.district) queryParams.append("জেলা", filters.district);
    if (filters.constituency) queryParams.append("আসন", filters.constituency);
    return queryParams;
  };

  const handleReset = () => {
    setFilters({
      division: "",
      district: "",
      constituency: "",
    });
    setData(null);
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
      <div className='p-4 lg:p-8 space-y-8'>
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

        <div className='flex justify-center items-center h-64'>
          <div
            className='text-lg text-red-600'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            ডেটা লোড করতে সমস্যা হয়েছে: {error}
          </div>
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

  return (
    <div className='p-4 lg:p-8 space-y-8'>
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

      {!data ? (
        <div className='flex justify-center items-center h-64'>
          <div
            className='text-lg text-gray-600'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            ফিল্টার নির্বাচন করে &quot;দেখুন&quot; বাটনে ক্লিক করুন
          </div>
        </div>
      ) : (
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
            দলের জনপ্রিয়তা
          </h2>
          <div
            className='text-lg text-gray-600 mb-4'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            মোট প্রতিক্রিয়া: {data.total_responses}
          </div>
          <div className='h-96'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={
                  data.party_popularity?.map((item, index) => ({
                    label: item.label,
                    value: item.value,
                    total: item.total,
                    fill: COLORS[index % COLORS.length],
                  })) || []
                }
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='label'
                  angle={-45}
                  textAnchor='end'
                  height={100}
                  style={{ fontFamily: "Tiro Bangla, serif", fontSize: 12 }}
                />
                <YAxis
                  label={{
                    value: "জনপ্রিয়তা (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontFamily: "Tiro Bangla, serif" },
                  }}
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value}% (মোট: ${props.payload.total})`,
                    "জনপ্রিয়তা",
                  ]}
                  labelStyle={{ fontFamily: "Tiro Bangla, serif" }}
                  contentStyle={{ fontFamily: "Tiro Bangla, serif" }}
                />
                <Bar dataKey='value' radius={[4, 4, 0, 0]} barSize={80}>
                  {data.party_popularity?.map((entry, index) => (
                    <Bar
                      key={`bar-${index}`}
                      dataKey='value'
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <LabelList
                    dataKey='total'
                    position='top'
                    style={{
                      fontFamily: "Tiro Bangla, serif",
                      fill: "#333",
                      fontSize: 12,
                    }}
                    formatter={(value) => `${value}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
