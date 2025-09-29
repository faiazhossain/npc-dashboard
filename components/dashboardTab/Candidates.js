"use client";
import { useState, useEffect, memo } from "react";
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
import { useAuth } from "@/hooks/useAuth";

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
      <div className="absolute inset-0 bg-gradient-to-r from-[#006747]/10 to-transparent opacity-20" />
      <h3
        className="text-xl font-bold px-4 py-2 bg-gray-200 text-gray-900 mb-5 relative z-10"
        style={{ fontFamily: "Tiro Bangla, serif" }}
      >
        {candidateCard.title}
      </h3>
      <ul className="space-y-3 px-4 py-2">
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

// Memoized RadialBarChartComponent
const RadialBarChartComponent = memo(({ chart, index, userType }) => {
  const chartData = chart.responses.map((item, idx) => ({
    name: item.label,
    uv: parseFloat(item.percentage.replace("%", "")),
    displayValue: item.percentage,
    total: item.total || 0,
    fill: COLORS[idx % COLORS.length],
  }));

  const legendStyle = {
    top: "50%",
    right: 0,
    transform: "translate(0, -50%)",
    lineHeight: "20px",
    fontSize: "12px",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2
        className="text-xl font-medium text-gray-900 mb-6"
        style={{ fontFamily: "Tiro Bangla, serif" }}
      >
        {chart.question}
      </h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="80%"
            barSize={10}
            data={chartData}
          >
            <RadialBar
              minAngle={15}
              label={{ position: "insideStart", fill: "#fff", fontSize: 10 }}
              background
              clockWise
              dataKey="uv"
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={{
                ...legendStyle,
                fontFamily: "Tiro Bangla, serif",
              }}
              formatter={(value, entry) =>
                `${value}: ${entry.payload.displayValue} ${
                  userType !== "duser" ? `(Total: ${entry.payload.total})` : ""
                }`
              }
            />
            <Tooltip
              formatter={(value, name, props) => {
                if (userType === "duser") {
                  return [`${value.toFixed(1)}%`, name];
                }
                return [`Total: ${props.payload.total || 0}`, name];
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
RadialBarChartComponent.displayName = "RadialBarChartComponent";

// Memoized PieChartComponent
const PieChartComponent = memo(({ chart, index, userType }) => {
  const chartData = chart.responses.map((item) => ({
    name: item.label,
    value: parseFloat(item.percentage.replace("%", "")),
    displayValue: item.percentage,
    total: item.total || 0,
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
        <div className="w-1/2 flex flex-col justify-center space-y-2 pr-4">
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
                paddingAngle={1}
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
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [additionalLoading, setAdditionalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    division: "",
    district: "",
    constituency: "",
  });
  const [shouldAnimateCharts, setShouldAnimateCharts] = useState(false);
  const [qualifiedCandidates, setQualifiedCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [additionalData, setAdditionalData] = useState(null);
  const { userType } = useAuth();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

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
      console.log("API Response (q1_q3):", apiData);

      const transformedData = {
        candidateCards: Object.entries(apiData.q1_parties_candidates).map(
          ([party, candidates], index) => ({
            id: `card-${index}`,
            title: party,
            candidates,
          })
        ),
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

      console.log("Transformed Data:", transformedData);
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

  const fetchAdditionalData = async (candidate) => {
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

      // Mapping of chart keys to their total count keys
      const totalCountKeyMap = {
        q4_how_recognize_candidate: "q4_total_counts",
        q5_candidate_qualities: "q5_total_counts",
        q6_candidate_contributions: "q6_total_counts",
        q7_candidate_flaws: "q7_total_counts",
      };

      const transformedAdditional = Object.entries(apiData)
        .filter(([key, value]) => Object.keys(value).length > 0)
        .slice(0, 3) // Only keep first 3 items
        .map(([key, value], index) => {
          let question;
          switch (key) {
            case "q5_candidate_qualities":
              question = "প্রার্থীর যোগ্যতার মাপকাঠি কি কি?";
              break;
            case "q4_how_recognize_candidate":
              question = "আপনি কিভাবে এই প্রার্থীকে চিনেন? ";
              break;
            case "q6_candidate_contributions":
              question = "সাধারণ মানুষের জন্য এই ব্যাক্তি কি কি করেছেন? ";
              break;
            case "q7_candidate_flaws":
              question = "প্রার্থীর ত্রুটি";
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
              total: apiData[totalCountKeyMap[key]]?.[label] || 0, // Use the mapped total count key
            })),
            chartType: "pie",
          };
        });

      setAdditionalData({ charts: transformedAdditional });
    } catch (error) {
      console.error("Error fetching additional data:", error);
    } finally {
      setAdditionalLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      division: "",
      district: "",
      constituency: "",
    });
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
  }, [selectedCandidate]);

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
              value={filters.division}
              onChange={(e) => handleFilterChange("division", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
            >
              <option value="">নির্বাচন করুন</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.bn_name}>
                  {division.bn_name}
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
              value={filters.district}
              onChange={(e) => handleFilterChange("district", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!filters.division}
            >
              <option value="">নির্বাচন করুন</option>
              {districts.map((district) => (
                <option key={district.id} value={district.bn_name}>
                  {district.bn_name}
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
              value={filters.constituency}
              onChange={(e) =>
                handleFilterChange("constituency", e.target.value)
              }
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!filters.district}
            >
              <option value="">নির্বাচন করুন</option>
              {constituencies.map((constituency) => (
                <option key={constituency.id} value={constituency.bn_name}>
                  {constituency.bn_name}
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
                {data.charts.map((chart, index) => {
                  const shouldUseRadialChart =
                    chart.id === "candidate-qualifications" ||
                    chart.chartType === "radial" ||
                    (chart.responses && chart.responses.length > 8);

                  return shouldUseRadialChart ? (
                    <RadialBarChartComponent
                      key={chart.id}
                      chart={chart}
                      index={index}
                      userType={userType}
                    />
                  ) : (
                    <PieChartComponent
                      key={chart.id}
                      chart={chart}
                      index={index}
                      userType={userType}
                    />
                  );
                })}
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

                const shouldUseRadialChart =
                  chart.id === "candidate-qualifications" ||
                  chart.chartType === "radial" ||
                  (chart.responses && chart.responses.length > 8);

                return shouldUseRadialChart ? (
                  <RadialBarChartComponent
                    key={chart.id}
                    chart={chart}
                    index={index}
                    userType={userType}
                  />
                ) : (
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

                      const shouldUseRadialChart =
                        chart.chartType === "radial" ||
                        (chart.responses && chart.responses.length > 8);

                      return shouldUseRadialChart ? (
                        <RadialBarChartComponent
                          key={chart.id}
                          chart={chart}
                          index={index}
                          userType={userType}
                        />
                      ) : (
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
