"use client";
import { useState, useEffect, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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

// Memoized CandidateCard component
const CandidateCard = memo(({ candidateCard, index }) => {
  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#006747]/10 to-transparent opacity-20 pointer-events-none" />
      <h3
        className="text-xl font-bold px-4 py-2 bg-gray-200 text-gray-900 mb-5 relative z-10"
        style={{ fontFamily: "Tiro Bangla, serif" }}
      >
        {candidateCard.title}
      </h3>
      <ul
        className="space-y-3 px-4 py-2 h-64 overflow-y-auto custom-scrollbar"
        style={{
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "#d1d5db #f3f4f6", // thumb and track colors for Firefox
        }}
      >
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
          }
        `}</style>
        {candidateCard.candidates.map((candidate, candidateIndex) => (
          <motion.li
            key={candidateIndex}
            className="flex items-center text-gray-700 text-sm"
            style={{ fontFamily: "Tiro Bangla, serif" }}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.15 + candidateIndex * 0.05,
              ease: "easeOut",
            }}
          >
            <div className="w-3 h-3 bg-[#006747] rounded-full mr-3 flex-shrink-0" />
            <span className="leading-relaxed">{candidate}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
});
CandidateCard.displayName = "CandidateCard";

// Memoized PieChartComponent
const PieChartComponent = memo(({ chart, index, userType }) => {
  const chartData = chart.responses.map((item, idx) => ({
    name: item.label,
    value: parseFloat(item.percentage.replace("%", "")),
    displayValue: item.percentage,
    total: item.total || 0,
    fill: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2
        className="text-xl font-medium text-gray-900 mb-6"
        style={{ fontFamily: "Tiro Bangla, serif" }}
      >
        {chart.question}
      </h2>
      <div className="h-80 flex">
        <div className="w-1/2 flex flex-col justify-start space-y-2 pr-4 h-full overflow-y-auto custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #a1a1a1;
            }
          `}</style>
          {chartData.map((entry, entryIndex) => (
            <div key={entry.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{
                  backgroundColor: COLORS[entryIndex % COLORS.length],
                }}
              ></div>
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                {entry.name}: {entry.displayValue}{" "}
                {userType !== "duser" ? `(Total: ${entry.total})` : ""}
              </span>
            </div>
          ))}
        </div>
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={chart.hasInnerRadius ? 40 : 0}
                outerRadius={80}
                fill="#8884d8"
                // paddingAngle={1}
                dataKey="value"
              >
                {chartData.map((entry, entryIndex) => (
                  <Cell
                    key={`cell-${entryIndex}`}
                    fill={COLORS[entryIndex % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  if (userType === "duser") {
                    return [`${value.toFixed(1)}%`, name];
                  }
                  return [`Total: ${props.payload.total || 0}`, name];
                }}
                labelStyle={{ fontFamily: "Tiro Bangla, serif" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});
PieChartComponent.displayName = "PieChartComponent";

export default function Candidates() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [additionalLoading, setAdditionalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldAnimateCharts, setShouldAnimateCharts] = useState(false);
  const [qualifiedCandidates, setQualifiedCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [additionalData, setAdditionalData] = useState(null);
  const { userType } = useAuth();

  const dispatch = useDispatch();
  const {
    division,
    district,
    constituency,
    divisions,
    districts,
    constituencies,
  } = useSelector((state) => state.filter);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Load initial dropdown data on mount (divisions, and conditionally districts/constituencies if pre-selected)
  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch divisions if not already loaded
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
        if (division && divisions.length > 0 && districts.length === 0) {
          const selectedDivision = divisions.find(
            (div) => div.bn_name === division
          );
          if (selectedDivision) {
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
        if (district && districts.length > 0 && constituencies.length === 0) {
          const selectedDistrict = districts.find(
            (dist) => dist.bn_name === district
          );
          if (selectedDistrict) {
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

        // Optionally auto-fetch data if filters are pre-selected (only on mount)
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
  }, []); // Empty dependencies: run only once on mount

  // Clear data when any filter changes (to avoid showing stale data)
  useEffect(() => {
    setData(null);
    setAdditionalData(null);
    setQualifiedCandidates([]);
    setSelectedCandidate("");
    setShouldAnimateCharts(false);
  }, [division, district, constituency]);

  // Special effect to load constituency data if we have district and constituencies but no constituency selected
  useEffect(() => {
    if (district && constituencies.length > 0 && !constituency) {
      const savedConstituency = localStorage.getItem("savedConstituency");
      if (savedConstituency) {
        dispatch(setConstituency(savedConstituency));
      }
    }
    // When constituency is set, save it for future restoration
    if (constituency) {
      localStorage.setItem("savedConstituency", constituency);
    }
  }, [district, constituencies.length, constituency, dispatch]);

  // Fetch districts when division changes
  useEffect(() => {
    if (!token || !division) {
      dispatch(setDistricts([]));
      dispatch(setConstituencies([]));
      dispatch(setDistrict(""));
      // Only clear constituency if division was actively changed, not on initial mount
      if (division === "" && localStorage.getItem("previousDivision")) {
        dispatch(setConstituency(""));
      }
      return;
    }

    // Check if division has changed from previous value
    const previousDivision = localStorage.getItem("previousDivision");
    if (previousDivision && previousDivision !== division) {
      // Division has changed, clear saved constituency
      localStorage.removeItem("savedConstituency");
      dispatch(setConstituency(""));
    }

    // Store current division for future reference
    localStorage.setItem("previousDivision", division);

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
      // Only clear constituency if district was actively changed, not on initial mount
      if (district === "" && localStorage.getItem("previousDistrict")) {
        dispatch(setConstituency(""));
      }
      return;
    }

    // Check if district has changed from previous value
    const previousDistrict = localStorage.getItem("previousDistrict");
    if (previousDistrict && previousDistrict !== district) {
      // District has changed, clear saved constituency
      localStorage.removeItem("savedConstituency");
      dispatch(setConstituency(""));
    }

    // Store current district for future reference
    localStorage.setItem("previousDistrict", district);

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
        dispatch(setConstituency(""));
      } catch (error) {
        console.error("Error fetching constituencies:", error);
        setError(error.message);
      }
    };

    loadConstituencies();
  }, [district, token, districts, dispatch]);

  const handleFilterChange = (key, value) => {
    if (key === "division") {
      dispatch(setDivision(value));
    } else if (key === "district") {
      dispatch(setDistrict(value));
    } else if (key === "constituency") {
      dispatch(setConstituency(value));
      // Save constituency in localStorage only when explicitly selected by user
      if (value) {
        localStorage.setItem("savedConstituency", value);
      } else {
        localStorage.removeItem("savedConstituency");
      }
    }
  };

  const buildQueryParams = useCallback(() => {
    const queryParams = new URLSearchParams();
    if (division) queryParams.append("বিভাগ", division.trim());
    if (district) queryParams.append("জেলা", district.trim());
    if (constituency) queryParams.append("আসন", constituency.trim());
    // For duser type, always set status to "accepted"
    if (userType === "duser") {
      queryParams.append("status", "accepted");
    }
    return queryParams;
  }, [division, district, constituency, userType]);

  const handleView = async () => {
    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShouldAnimateCharts(true);
      setAdditionalData(null);
      setSelectedCandidate("");
      setQualifiedCandidates([]);

      const queryParams = buildQueryParams();

      const response = await fetch(
        `https://npsbd.xyz/api/dashboard/candidates/q1_q3?${queryParams}`,
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
      const apiData = await response.json();

      const transformedData = {
        candidateCards: Object.entries(apiData.q1_parties_candidates)
          .map(([party, candidates], index) => ({
            id: `card-${index}`,
            title: party,
            // Filter out empty strings from candidates array
            candidates: candidates.filter(
              (candidate) => candidate.trim() !== ""
            ),
          }))
          .filter((card) => card.candidates.length > 0), // Optionally filter out parties with no valid candidates
        charts: Object.entries(apiData.q2_best_candidate_percent_by_party).map(
          ([party, candidates], index) => ({
            id: `chart-${index}`,
            question: `প্রার্থী সমর্থন (${party})`,
            responses: Object.entries(candidates).map(([name, percentage]) => ({
              label: name,
              percentage: `${percentage}%`,
              total: apiData.q2_total_counts[name] || 0,
            })),
            chartType: "pie",
          })
        ),
        qualities: [
          {
            id: "qualities-1",
            question: "এদের মধ্যে কাকে বেশি যোগ্য মনে হয়?",
            responses: Object.entries(
              apiData.q3_most_qualified_candidate_percent
            ).map(([name, percentage]) => ({
              label: name,
              percentage: `${percentage}%`,
              total: apiData.q3_total_counts[name] || 0,
            })),
            chartType: "pie",
          },
        ],
      };

      setData(transformedData);

      if (
        transformedData.qualities &&
        transformedData.qualities[0] &&
        transformedData.qualities[0].responses
      ) {
        const candidates = transformedData.qualities[0].responses.map(
          (r) => r.label
        );
        setQualifiedCandidates(candidates);
        if (candidates.length > 0) {
          setSelectedCandidate(candidates[0]);
          await fetchAdditionalData(candidates[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalData = useCallback(
    async (candidate) => {
      if (!token || !candidate) {
        return;
      }
      try {
        setAdditionalLoading(true);
        const queryParams = buildQueryParams();
        queryParams.append("প্রার্থী", candidate);

        const response = await fetch(
          `https://npsbd.xyz/api/dashboard/candidates/q4_q7?${queryParams}`,
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

        const apiData = await response.json();

        const totalCountKeyMap = {
          q4_how_recognize_candidate: "q4_total_counts",
          q5_candidate_qualities: "q5_total_counts",
          q6_candidate_contributions: "q6_total_counts",
          q7_candidate_flaws: "q7_total_counts",
        };

        let transformedAdditional = Object.entries(apiData)
          .filter(([key, value]) => Object.keys(value).length > 0)
          .filter(([key]) => key !== "q7_candidate_flaws")
          .slice(0, 3)
          .map(([key, value], index) => {
            let question;
            switch (key) {
              case "q5_candidate_qualities":
                question = "প্রার্থীর যোগ্যতার মাপকাঠি কি কি?";
                break;
              case "q4_how_recognize_candidate":
                question = "আপনি কিভাবে এই প্রার্থীকে চিনেন?";
                break;
              case "q6_candidate_contributions":
                question = "সাধারণ মানুষের জন্য এই ব্যাক্তি কি কি করেছেন?";
                break;
              default:
                question = key;
            }
            return {
              id: `additional-chart-${index}`,
              question,
              responses: Object.entries(value).map(([label, perc]) => ({
                label,
                percentage: `${perc}%`,
                total: apiData[totalCountKeyMap[key]]?.[label] || 0,
              })),
              chartType: "pie",
            };
          });

        if (
          apiData.q7_candidate_flaws &&
          Object.keys(apiData.q7_candidate_flaws).length > 0
        ) {
          transformedAdditional.push({
            id: `additional-chart-3`,
            question: "প্রার্থীর ত্রুটি",
            responses: Object.entries(apiData.q7_candidate_flaws).map(
              ([label, perc]) => ({
                label,
                percentage: `${perc}%`,
                total: apiData.q7_total_counts?.[label] || 0,
              })
            ),
            chartType: "pie",
          });
        } else {
          transformedAdditional.push({
            id: `additional-chart-3`,
            question: "প্রার্থীর ত্রুটি",
            responses: [
              {
                label: "কোনো ত্রুটি নেই",
                percentage: "100%",
                total: 1,
              },
            ],
            chartType: "pie",
          });
        }

        setAdditionalData({ charts: transformedAdditional });
      } catch (error) {
        console.error("Error fetching additional data:", error);
      } finally {
        setAdditionalLoading(false);
      }
    },
    [token, buildQueryParams]
  );

  const handleReset = () => {
    dispatch(resetFilters());
    setData(null);
    setAdditionalData(null);
    setQualifiedCandidates([]);
    setSelectedCandidate("");
    setShouldAnimateCharts(false);
  };

  useEffect(() => {
    if (selectedCandidate) {
      fetchAdditionalData(selectedCandidate);
    }
  }, [selectedCandidate, fetchAdditionalData]);

  return (
    <div className="p-4 lg:p-8 space-y-8">
      <motion.div
        className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-md border border-gray-100 mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2
          className="text-xl font-semibold text-gray-800 mb-4"
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ফিল্টার
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              বিভাগ
            </label>
            <motion.select
              value={division}
              onChange={(e) => handleFilterChange("division", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
            >
              <option value="">নির্বাচন করুন</option>
              {divisions.map((divisionItem) => (
                <option key={divisionItem.id} value={divisionItem.bn_name}>
                  {divisionItem.bn_name}
                </option>
              ))}
            </motion.select>
          </div>
          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              জেলা
            </label>
            <motion.select
              value={district}
              onChange={(e) => handleFilterChange("district", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!division}
            >
              <option value="">নির্বাচন করুন</option>
              {districts.map((districtItem) => (
                <option key={districtItem.id} value={districtItem.bn_name}>
                  {districtItem.bn_name}
                </option>
              ))}
            </motion.select>
          </div>
          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              নির্বাচনী এলাকা
            </label>
            <motion.select
              value={constituency}
              onChange={(e) =>
                handleFilterChange("constituency", e.target.value)
              }
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!district}
            >
              <option value="">নির্বাচন করুন</option>
              {constituencies.map((constituencyItem) => (
                <option
                  key={constituencyItem.id}
                  value={constituencyItem.bn_name}
                >
                  {constituencyItem.bn_name}
                </option>
              ))}
            </motion.select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <motion.button
            onClick={handleReset}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
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
            className="bg-[#006747] text-white px-4 py-2 rounded-md hover:bg-[#005536] transition-colors duration-200 text-sm"
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

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-gray-600 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            ডেটা লোড করা হচ্ছে...
          </motion.div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div
            className="text-lg text-red-600"
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            ডেটা লোড করতে সমস্যা হয়েছে: {error}
          </div>
        </div>
      ) : !data ||
        (data.candidateCards?.length === 0 &&
          data.charts?.length === 0 &&
          (!data.qualities ||
            data.qualities.every(
              (quality) => !quality.responses || quality.responses.length === 0
            ))) ? (
        <div className="flex justify-center items-center h-64">
          <div
            className="text-lg text-gray-600"
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            ফিল্টার নির্বাচন করে &quot;দেখুন&quot; বাটনে ক্লিক করুন
          </div>
        </div>
      ) : (
        <>
          {data.candidateCards?.length > 0 && (
            <motion.div
              initial={shouldAnimateCharts ? { y: 20, opacity: 0 } : false}
              animate={shouldAnimateCharts ? { y: 0, opacity: 1 } : {}}
              transition={
                shouldAnimateCharts
                  ? { duration: 0.6, delay: 0.2, ease: "easeOut" }
                  : {}
              }
              className="shadow-sm rounded-2xl p-6 bg-white"
            >
              <h2
                className="text-2xl font-semibold text-gray-800 mb-6"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                আপনার এলাকার সম্ভাব্য প্রার্থীদের নামসমূহ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.candidateCards.map((candidateCard, index) => (
                  <CandidateCard
                    key={candidateCard.id}
                    candidateCard={candidateCard}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {data.charts?.length > 0 && (
            <motion.div
              initial={shouldAnimateCharts ? { y: 20, opacity: 0 } : false}
              animate={shouldAnimateCharts ? { y: 0, opacity: 1 } : {}}
              transition={
                shouldAnimateCharts
                  ? { duration: 0.6, delay: 0.2, ease: "easeOut" }
                  : {}
              }
              className="shadow-sm rounded-2xl p-6 bg-white"
            >
              <h2
                className="text-2xl font-semibold text-gray-800 mb-6"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিত বলে আপনি মনে করেন?
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.charts.map((chart, index) => (
                  <PieChartComponent
                    key={chart.id}
                    chart={chart}
                    index={index}
                    userType={userType}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {data.qualities?.some((quality) => quality.responses?.length > 0) && (
            <motion.div
              initial={shouldAnimateCharts ? { y: 20, opacity: 0 } : false}
              animate={shouldAnimateCharts ? { y: 0, opacity: 1 } : {}}
              transition={
                shouldAnimateCharts
                  ? { duration: 0.6, delay: 0.5, ease: "easeOut" }
                  : {}
              }
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {data.qualities.map((chart, index) => {
                if (!chart.responses || chart.responses.length === 0)
                  return null;
                return (
                  <PieChartComponent
                    key={chart.id}
                    chart={chart}
                    index={index}
                    userType={userType}
                  />
                );
              })}
            </motion.div>
          )}

          {qualifiedCandidates.length > 0 && (
            <motion.div
              initial={shouldAnimateCharts ? { y: 20, opacity: 0 } : false}
              animate={shouldAnimateCharts ? { y: 0, opacity: 1 } : {}}
              transition={
                shouldAnimateCharts
                  ? { duration: 0.6, delay: 0.8, ease: "easeOut" }
                  : {}
              }
              className="shadow-sm rounded-2xl p-6 bg-white"
            >
              <h2
                className="text-2xl font-semibold text-gray-800 mb-6"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                প্রার্থী বিস্তারিত
              </h2>
              <div className="flex flex-col mb-6">
                <label
                  className="block text-xs font-medium text-gray-600 mb-1"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  প্রার্থী নির্বাচন করুন
                </label>
                <motion.select
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                  whileHover={{ scale: 1.02 }}
                  disabled={additionalLoading}
                >
                  {qualifiedCandidates.map((candidate) => (
                    <option key={candidate} value={candidate}>
                      {candidate}
                    </option>
                  ))}
                </motion.select>
              </div>

              {additionalLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                  <div
                    className="text-lg text-gray-600"
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    প্রার্থীর তথ্য লোড করা হচ্ছে...
                  </div>
                </div>
              ) : (
                additionalData &&
                additionalData.charts?.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {additionalData.charts.map((chart, index) => {
                      if (!chart.responses || chart.responses.length === 0)
                        return null;
                      return (
                        <PieChartComponent
                          key={chart.id}
                          chart={chart}
                          index={index}
                          userType={userType}
                        />
                      );
                    })}
                  </div>
                )
              )}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
