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
  Cell,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import {
  setDivision,
  setDistrict,
  setConstituency,
  setDivisions,
  setDistricts,
  setConstituencies,
  resetFilters,
} from "@/store/slices/filterSlice";

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

export default function SeatDistribution() {
  const { userType } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [worthfulData, setWorthfulData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const dispatch = useDispatch();
  const {
    division,
    district,
    constituency,
    divisions,
    districts,
    constituencies,
  } = useSelector((state) => state.filter);

  // Load initial data (divisions) and fetch data based on pre-selected filters
  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load divisions if not already loaded
        if (divisions.length === 0) {
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
          dispatch(setDivisions(divisionsData));
        }

        // If division is pre-selected, fetch districts
        if (division && divisions.length > 0) {
          const selectedDivision = divisions.find(
            (div) => div.bn_name === division
          );
          if (selectedDivision && districts.length === 0) {
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
            dispatch(setDistricts(data));
          }
        }

        // If district is pre-selected, fetch constituencies
        if (district && districts.length > 0) {
          const selectedDistrict = districts.find(
            (dist) => dist.bn_name === district
          );
          if (selectedDistrict && constituencies.length === 0) {
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
            dispatch(setConstituencies(data));
          }
        }

        // If any filter is pre-selected, fetch party popularity and worthful data
        if (division || district || constituency) {
          await handleView();
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [
    token,
    divisions.length,
    division,
    district,
    constituencies.length,
    dispatch,
  ]);

  // Fetch districts when division changes
  useEffect(() => {
    if (!token || !division) {
      dispatch(setDistricts([]));
      dispatch(setConstituencies([]));
      dispatch(setDistrict(""));
      dispatch(setConstituency(""));
      return;
    }

    const loadDistricts = async () => {
      try {
        const selectedDivision = divisions.find(
          (div) => div.bn_name === division
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
        dispatch(setDistricts(data));
        dispatch(setConstituencies([]));
        dispatch(setConstituency(""));
      } catch (error) {
        console.error("Error fetching districts:", error);
        setError(error.message);
      }
    };

    loadDistricts();
  }, [division, token, divisions, dispatch]);

  // Fetch constituencies when district changes
  useEffect(() => {
    if (!token || !district) {
      dispatch(setConstituencies([]));
      dispatch(setConstituency(""));
      return;
    }

    const loadConstituencies = async () => {
      try {
        const selectedDistrict = districts.find(
          (dist) => dist.bn_name === district
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
        dispatch(setConstituencies(data));
      } catch (error) {
        console.error("Error fetching constituencies:", error);
        setError(error.message);
      }
    };

    loadConstituencies();
  }, [district, token, districts, dispatch]);

  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (division) queryParams.append("বিভাগ", division);
    if (district) queryParams.append("জেলা", district);
    if (constituency) queryParams.append("আসন", constituency);
    return queryParams;
  };

  const handleView = async () => {
    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // Reset to first page when filters change

      const queryParams = buildQueryParams();
      const baseUrl = "https://npsbd.xyz/api/dashboard/party/popularity";
      const url = queryParams.toString()
        ? `${baseUrl}?${queryParams.toString()}`
        : baseUrl;

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

      const worthfulBaseUrl = `https://npsbd.xyz/api/dashboard/party/worthful?page=${currentPage}&page_size=${pageSize}`;
      const worthfulUrl = queryParams.toString()
        ? `${worthfulBaseUrl}&${queryParams.toString()}`
        : worthfulBaseUrl;

      const worthfulResponse = await fetch(worthfulUrl, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!worthfulResponse.ok) {
        throw new Error(`HTTP error! status: ${worthfulResponse.status}`);
      }

      const worthfulResult = await worthfulResponse.json();
      setWorthfulData(worthfulResult.data);
      setTotalCount(worthfulResult.total_count);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch worthful data when page changes
  useEffect(() => {
    if (data) {
      const fetchWorthfulData = async () => {
        try {
          setLoading(true);
          const queryParams = buildQueryParams();
          const worthfulBaseUrl = `https://npsbd.xyz/api/dashboard/party/worthful?page=${currentPage}&page_size=${pageSize}`;
          const worthfulUrl = queryParams.toString()
            ? `${worthfulBaseUrl}&${queryParams.toString()}`
            : worthfulBaseUrl;

          const worthfulResponse = await fetch(worthfulUrl, {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!worthfulResponse.ok) {
            throw new Error(`HTTP error! status: ${worthfulResponse.status}`);
          }

          const worthfulResult = await worthfulResponse.json();
          setWorthfulData(worthfulResult.data);
          setTotalCount(worthfulResult.total_count);
        } catch (error) {
          console.error("Error fetching worthful data:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchWorthfulData();
    }
  }, [currentPage, data, token]);

  const handleReset = () => {
    dispatch(resetFilters());
    setData(null);
    setWorthfulData([]);
    setTotalCount(0);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

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
                value={division}
                onChange={(e) => dispatch(setDivision(e.target.value))}
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
                value={district}
                onChange={(e) => dispatch(setDistrict(e.target.value))}
                className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                style={{ fontFamily: "Tiro Bangla, serif" }}
                whileHover={{ scale: 1.02 }}
                disabled={!division}
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
                value={constituency}
                onChange={(e) => dispatch(setConstituency(e.target.value))}
                className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
                style={{ fontFamily: "Tiro Bangla, serif" }}
                whileHover={{ scale: 1.02 }}
                disabled={!district}
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
              value={division}
              onChange={(e) => dispatch(setDivision(e.target.value))}
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
              value={district}
              onChange={(e) => dispatch(setDistrict(e.target.value))}
              className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!division}
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
              value={constituency}
              onChange={(e) => dispatch(setConstituency(e.target.value))}
              className='w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm'
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!district}
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
                  dataKey='total'
                  label={{
                    value: "আসন সংখ্যা",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontFamily: "Tiro Bangla, serif" },
                  }}
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${props.payload.value}%`,
                    "জনপ্রিয়তা",
                  ]}
                  labelStyle={{ fontFamily: "Tiro Bangla, serif" }}
                  contentStyle={{ fontFamily: "Tiro Bangla, serif" }}
                />
                <Bar dataKey='total' radius={[4, 4, 0, 0]} barSize={80}>
                  {data.party_popularity?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <LabelList
                    dataKey='total'
                    position='top'
                    style={{
                      fontFamily: "Tiro Bangla, serif",
                      fontSize: 12,
                      fill: "#333",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {worthfulData.length > 0 && (
            <div className='mt-8'>
              <h2
                className='text-xl font-semibold text-gray-800 mb-4'
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                সবচেয়ে মূল্যবান দল
              </h2>
              <div
                className='text-lg text-gray-600 mb-4'
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                মোট ডেটা: {totalCount}
              </div>
              <div className='overflow-x-auto'>
                <table
                  className='min-w-full bg-white border border-gray-200'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='py-3 px-4 border-b text-left text-sm font-medium text-gray-700'>
                        বিভাগ
                      </th>
                      <th className='py-3 px-4 border-b text-left text-sm font-medium text-gray-700'>
                        জেলা
                      </th>
                      <th className='py-3 px-4 border-b text-left text-sm font-medium text-gray-700'>
                        নির্বাচনী এলাকা
                      </th>
                      <th className='py-3 px-4 border-b text-left text-sm font-medium text-gray-700'>
                        সবচেয়ে মূল্যবান দল
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {worthfulData.map((item, index) => (
                      <tr key={index} className='hover:bg-gray-50'>
                        <td className='py-3 px-4 border-b text-sm text-gray-600'>
                          {item.division}
                        </td>
                        <td className='py-3 px-4 border-b text-sm text-gray-600'>
                          {item.district}
                        </td>
                        <td className='py-3 px-4 border-b text-sm text-gray-600'>
                          {item.constituency}
                        </td>
                        <td className='py-3 px-4 border-b text-sm text-gray-600'>
                          {item.most_worthful_party}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='flex justify-center mt-4 space-x-2'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <motion.button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md text-sm ${
                        currentPage === page
                          ? "bg-[#006747] text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                      style={{ fontFamily: "Tiro Bangla, serif" }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
