"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Image from "next/image";
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

export default function GeneralQuestions() {
  const [data, setData] = useState(null);
  const [filteredChartData, setFilteredChartData] = useState(null);
  const { userData, userType } = useAuth();
  const dispatch = useDispatch();

  // Get shared filters from Redux
  const {
    division,
    district,
    constituency,
    divisions,
    districts,
    constituencies,
  } = useSelector((state) => state.filter);

  const [localFilters, setLocalFilters] = useState({
    thana: "",
    ward: "",
    union: "",
    gender: "",
    profession: "",
    age: "",
    status: "",
  });

  const [thanas, setThanas] = useState([]);
  const [unions, setUnions] = useState([]);
  const [wards, setWards] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const genderOptions = ["নারী", "পুরুষ", "তৃতীয় লিঙ্গ"];
  const professionOptions = [
    "শিক্ষার্থী (কলেজ)",
    "শিক্ষার্থী (বিশ্ববিদ্যালয়)",
    "কৃষক",
    "শিক্ষক/শিক্ষিকা",
    "চিকিৎসক/নার্স",
    "ইঞ্জিনিয়ার",
    "ব্যবসায়ী",
    "সরকারি চাকরিজীবী",
    "ব্যাংক কর্মকর্তা",
    "মার্কেটিং/বিক্রয় প্রতিনিধি",
    "আইটি পেশাজীবী",
    "মিডিয়া কর্মী",
    "গৃহিণী",
    "কর্মচারী",
    "নির্মাণ/মিস্ত্রি",
    "গৃহকর্মী",
    "ফ্রিল্যান্সার",
    "অ্যাডভোকেট/আইনজীবী",
    "সামাজিক কাজ/NGO কর্মী",
    "শিল্পী",
    "বিপণন/বিক্রয় বিশেষজ্ঞ",
    "খুচরা ব্যবসায়ী",
    "অন্যান্য",
  ];

  const statusOptions = [
    { value: "pending", label: "অপেক্ষামান" },
    { value: "accepted", label: "অনুমোদিত" },
    { value: "rejected", label: "বাতিল" },
  ];

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
    if (!token) {
      console.error("No token available for API requests");
      return;
    }

    // Load divisions only if not already loaded
    if (divisions.length === 0) {
      fetch("https://npsbd.xyz/api/divisions", {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => dispatch(setDivisions(data)))
        .catch((error) => console.error("Error fetching divisions:", error));
    }

    fetch("https://npsbd.xyz/api/dashboard/questions/stats", {
      method: "GET",
      headers: { accept: "application/json", Authorization: `Bearer ${token}` },
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
            totalVoters: "0",
            maleVoters: "0",
            femaleVoters: "0",
            thirdGenderVoters: "0",
          },
          charts: data.map((item) => ({
            id: item.question,
            question: item.question,
            responses: item.stats.map((stat) => ({
              label: stat.label,
              percentage: `${stat.value}%`,
              total: stat.total || 0,
            })),
            hasInnerRadius: item.question.includes("প্রধান চাওয়া"),
          })),
        };
        setData(formattedData);
        setFilteredChartData(formattedData);
      })
      .catch((error) => console.error("Error loading initial data:", error));
  }, [token, divisions.length, dispatch]);

  useEffect(() => {
    if (!token) return;

    // Check if division has changed from previous value
    const previousDivision = localStorage.getItem("previousDivision");
    if (previousDivision && previousDivision !== division) {
      // Division has changed, clear saved constituency
      localStorage.removeItem("savedConstituency");
      dispatch(setConstituency(""));
    }

    // Store current division for future reference
    if (division) {
      localStorage.setItem("previousDivision", division);
    }

    if (division) {
      const selectedDivision = divisions.find((d) => d.bn_name === division);
      if (selectedDivision) {
        fetch(
          `https://npsbd.xyz/api/divisions/${selectedDivision.id}/districts`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            dispatch(setDistricts(data));
            setThanas([]);
            setUnions([]);
            setWards([]);
            setLocalFilters((prev) => ({
              ...prev,
              thana: "",
              union: "",
              ward: "",
            }));
          })
          .catch((error) => console.error("Error fetching districts:", error));
      }
    } else {
      dispatch(setDistricts([]));
      setThanas([]);
      setUnions([]);
      setWards([]);
      setLocalFilters((prev) => ({
        ...prev,
        thana: "",
        union: "",
        ward: "",
      }));
    }
  }, [division, token, divisions, dispatch]);

  useEffect(() => {
    if (!token) return;

    // Check if district has changed from previous value
    const previousDistrict = localStorage.getItem("previousDistrict");
    if (previousDistrict && previousDistrict !== district) {
      // District has changed, clear saved constituency
      localStorage.removeItem("savedConstituency");
      dispatch(setConstituency(""));
    }

    // Store current district for future reference
    if (district) {
      localStorage.setItem("previousDistrict", district);
    }

    if (district) {
      const selectedDistrict = districts.find((d) => d.bn_name === district);
      if (selectedDistrict) {
        fetch(`https://npsbd.xyz/api/districts/${selectedDistrict.id}/seats`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(setConstituencies(data));
            setThanas([]);
            setUnions([]);
            setWards([]);
            setLocalFilters((prev) => ({
              ...prev,
              thana: "",
              union: "",
              ward: "",
            }));
          })
          .catch((error) =>
            console.error("Error fetching constituencies:", error)
          );
      }
    } else {
      dispatch(setConstituencies([]));
      setThanas([]);
      setUnions([]);
      setWards([]);
      setLocalFilters((prev) => ({
        ...prev,
        thana: "",
        union: "",
        ward: "",
      }));
    }
  }, [district, token, districts, dispatch]);

  useEffect(() => {
    if (!token) return;

    if (constituency) {
      const selectedConstituency = constituencies.find(
        (c) => c.bn_name === constituency
      );
      if (selectedConstituency) {
        fetch(`https://npsbd.xyz/api/seats/${selectedConstituency.id}/thanas`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setThanas(data);
            setUnions([]);
            setWards([]);
            setLocalFilters((prev) => ({
              ...prev,
              thana: "",
              union: "",
              ward: "",
            }));
          })
          .catch((error) => console.error("Error fetching thanas:", error));
      }
    } else {
      setThanas([]);
      setUnions([]);
      setWards([]);
      setLocalFilters((prev) => ({ ...prev, thana: "", union: "", ward: "" }));
    }
  }, [constituency, token, constituencies]);

  useEffect(() => {
    if (!token) return;

    if (district && localFilters.thana) {
      const selectedDistrict = districts.find((d) => d.bn_name === district);
      const selectedThana = thanas.find((t) => t.id == localFilters.thana);

      if (selectedDistrict && selectedThana) {
        const districtBnName = encodeURIComponent(selectedDistrict.bn_name);
        const thanaBnName = encodeURIComponent(selectedThana.bn_name);
        const wardApiUrl = `https://npsbd.xyz/api/users/${districtBnName}/${thanaBnName}/unions_wards`;

        fetch(wardApiUrl, {
          method: "GET",
          headers: {
            accept: "application/json",
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
            setLocalFilters((prev) => ({
              ...prev,
              ward: "",
              union: "",
            }));
          })
          .catch((error) => {
            console.error("Error fetching wards/unions:", error);
            setWards([]);
            setUnions([]);
            setLocalFilters((prev) => ({
              ...prev,
              ward: "",
              union: "",
            }));
          });
      } else {
        setWards([]);
        setUnions([]);
        setLocalFilters((prev) => ({
          ...prev,
          ward: "",
          union: "",
        }));
      }
    } else {
      setWards([]);
      setUnions([]);
      setLocalFilters((prev) => ({
        ...prev,
        ward: "",
        union: "",
      }));
    }
  }, [district, localFilters.thana, districts, thanas, token]);

  const handleSharedFilterChange = (key, value) => {
    console.log(`Shared filter changed: ${key} = ${value}`);
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

  const handleLocalFilterChange = (key, value) => {
    console.log(`Local filter changed: ${key} = ${value}`);
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = () => {
    if (!token) {
      console.error("No token available for API request");
      return;
    }

    console.log("Filters applied:", {
      division,
      district,
      constituency,
      ...localFilters,
    });
    const queryParams = new URLSearchParams();

    if (localFilters.age) {
      const ageMap = {
        "18-25": "25",
        "26-35": "35",
        "36-45": "45",
        "46+": "60",
      };
      queryParams.append("বয়স", ageMap[localFilters.age] || localFilters.age);
    }
    if (localFilters.gender) queryParams.append("লিঙ্গ", localFilters.gender);
    if (constituency) {
      queryParams.append("আসন", constituency.trim());
    }

    if (district) {
      queryParams.append("জেলা", district.trim());
    }

    if (localFilters.thana) {
      const thana = thanas.find((t) => t.id == localFilters.thana);
      if (thana && thana.bn_name) {
        queryParams.append("থানা", thana.bn_name.trim());
      }
    }

    if (division) {
      queryParams.append("বিভাগ", division.trim());
    }

    if (localFilters.union) {
      const union = unions.find((u) => u.id == localFilters.union);
      if (union)
        queryParams.append("ইউনিয়ন", encodeURIComponent(union.bn_name));
    }
    if (localFilters.ward) {
      const ward = wards.find((w) => w.id == localFilters.ward);
      if (ward) queryParams.append("ওয়ার্ড", encodeURIComponent(ward.bn_name));
    }
    if (localFilters.status) queryParams.append("status", localFilters.status);
    if (localFilters.profession && localFilters.profession.trim()) {
      queryParams.append("পেশা", localFilters.profession.trim());
    }

    const apiUrl = `https://npsbd.xyz/api/dashboard/questions/stats?${queryParams.toString()}`;

    fetch(apiUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
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
        console.log("Filtered API Response:", apiData);
        const formattedData = {
          voterStatistics: {
            totalVoters: "234",
            maleVoters: "122",
            femaleVoters: "100",
            thirdGenderVoters: "12",
          },
          charts: apiData.map((item) => ({
            id: item.question,
            question: item.question,
            responses: item.stats.map((stat) => ({
              label: stat.label,
              percentage: `${stat.value}%`,
              total: stat.total || 0,
            })),
            hasInnerRadius: item.question.includes("প্রধান চাওয়া"),
          })),
        };
        console.log("Formatted Filtered Data:", formattedData);
        setFilteredChartData(formattedData);
      })
      .catch((error) => console.error("Error fetching filtered data:", error));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalFilters({
      thana: "",
      ward: "",
      union: "",
      gender: "",
      profession: "",
      age: "",
      status: "",
    });
    setThanas([]);
    setUnions([]);
    setWards([]);
    setFilteredChartData(data);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {/* Shared Filters */}
          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              বিভাগ
            </label>
            <motion.select
              value={division}
              onChange={(e) =>
                handleSharedFilterChange("division", e.target.value)
              }
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
              onChange={(e) =>
                handleSharedFilterChange("district", e.target.value)
              }
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
                handleSharedFilterChange("constituency", e.target.value)
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

          {/* Local Filters */}
          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              থানা
            </label>
            <motion.select
              value={localFilters.thana}
              onChange={(e) => handleLocalFilterChange("thana", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!constituency}
            >
              <option value="">নির্বাচন করুন</option>
              {thanas.map((thana) => (
                <option key={thana.id} value={thana.id}>
                  {thana.bn_name}
                </option>
              ))}
            </motion.select>
          </div>

          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              ইউনিয়ন
            </label>
            <motion.select
              value={localFilters.union}
              onChange={(e) => handleLocalFilterChange("union", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!localFilters.thana}
            >
              <option value="">নির্বাচন করুন</option>
              {unions.map((union) => (
                <option key={union.id} value={union.id}>
                  {union.bn_name}
                </option>
              ))}
            </motion.select>
          </div>

          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              ওয়ার্ড
            </label>
            <motion.select
              value={localFilters.ward}
              onChange={(e) => handleLocalFilterChange("ward", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
              disabled={!localFilters.thana}
            >
              <option value="">নির্বাচন করুন</option>
              {wards.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.bn_name}
                </option>
              ))}
            </motion.select>
          </div>

          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              লিঙ্গ
            </label>
            <motion.select
              value={localFilters.gender}
              onChange={(e) =>
                handleLocalFilterChange("gender", e.target.value)
              }
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
            >
              <option value="">নির্বাচন করুন</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </motion.select>
          </div>

          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              পেশা
            </label>
            <motion.select
              value={localFilters.profession}
              onChange={(e) =>
                handleLocalFilterChange("profession", e.target.value)
              }
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
            >
              <option value="">নির্বাচন করুন</option>
              {professionOptions.map((profession) => (
                <option key={profession} value={profession}>
                  {profession}
                </option>
              ))}
            </motion.select>
          </div>

          <div className="flex flex-col">
            <label
              className="block text-xs font-medium text-gray-600 mb-1"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              বয়স
            </label>
            <motion.select
              value={localFilters.age}
              onChange={(e) => handleLocalFilterChange("age", e.target.value)}
              className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
              style={{ fontFamily: "Tiro Bangla, serif" }}
              whileHover={{ scale: 1.02 }}
            >
              <option value="">নির্বাচন করুন</option>
              <option value="18-25">১৮-২৫</option>
              <option value="26-35">২৬-৩৫</option>
              <option value="36-45">৩৬-৪৫</option>
              <option value="46+">৪৬+</option>
            </motion.select>
          </div>

          {userType === "admin" && (
            <div className="flex flex-col">
              <label
                className="block text-xs font-medium text-gray-600 mb-1"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                অবস্থা
              </label>
              <motion.select
                value={localFilters.status}
                onChange={(e) =>
                  handleLocalFilterChange("status", e.target.value)
                }
                className="w-full px-3 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] transition-all duration-200 text-sm"
                style={{ fontFamily: "Tiro Bangla, serif" }}
                whileHover={{ scale: 1.02 }}
              >
                <option value="">নির্বাচন করুন</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </motion.select>
            </div>
          )}
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

      {filteredChartData ? (
        <>
          {/* Voter Statistics */}
          <motion.div
            className="p-6 rounded-xl shadow-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Voters */}
              <motion.div
                className="bg-green-50 p-4 rounded-lg shadow-sm text-center transition-all duration-300 border border-transparent hover:border-green-200 hover:shadow-md"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex justify-center mb-2">
                  <Image
                    src="/Images/gender/profile.svg"
                    alt="Total Voters"
                    width={26}
                    height={26}
                  />
                </div>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  মোট ভোটার
                </p>
                <h3
                  className="text-2xl font-bold text-green-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {convertBengaliToEnglish(
                    filteredChartData.voterStatistics.totalVoters
                  )}
                </h3>
              </motion.div>

              {/* Male Voters */}
              <motion.div
                className="bg-cyan-50 p-4 rounded-lg shadow-sm text-center transition-all duration-300 border border-transparent hover:border-cyan-200 hover:shadow-md"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex justify-center mb-2">
                  <Image
                    src="/Images/gender/man.svg"
                    alt="Male Voters"
                    width={26}
                    height={26}
                  />
                </div>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  পুরুষ ভোটার
                </p>
                <h3
                  className="text-2xl font-bold text-cyan-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {convertBengaliToEnglish(
                    filteredChartData.voterStatistics.maleVoters
                  )}
                </h3>
              </motion.div>

              {/* Female Voters */}
              <motion.div
                className="bg-blue-50 p-4 rounded-lg shadow-sm text-center transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-md"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex justify-center mb-2">
                  <Image
                    src="/Images/gender/woman.svg"
                    alt="Female Voters"
                    width={26}
                    height={26}
                  />
                </div>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  নারী ভোটার
                </p>
                <h3
                  className="text-2xl font-bold text-blue-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {convertBengaliToEnglish(
                    filteredChartData.voterStatistics.femaleVoters
                  )}
                </h3>
              </motion.div>

              {/* Third Gender Voters */}
              <motion.div
                className="bg-purple-50 p-4 rounded-lg shadow-sm text-center transition-all duration-300 border border-transparent hover:border-purple-200 hover:shadow-md"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="flex justify-center mb-2">
                  <Image
                    src="/Images/gender/aquarius.svg"
                    alt="Third Gender Voters"
                    width={26}
                    height={26}
                  />
                </div>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  তৃতীয় লিঙ্গের ভোটার
                </p>
                <h3
                  className="text-2xl font-bold text-red-600"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {convertBengaliToEnglish(
                    filteredChartData.voterStatistics.thirdGenderVoters
                  )}
                </h3>
              </motion.div>
            </div>
          </motion.div>

          {/* Charts */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            {filteredChartData.charts.map((chart, index) => (
              <div
                key={chart.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px] flex flex-col"
              >
                <h2
                  className="text-xl font-medium text-gray-900 mb-4"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {chart.question}
                </h2>
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-1/2 flex flex-col pr-4 h-full overflow-y-auto custom-scrollbar">
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
                    <div className="space-y-2 pb-2 flex-grow">
                      {chart.responses.map((response, responseIndex) => (
                        <div key={response.label} className="flex items-center">
                          <div
                            className="w-4 h-4 rounded mr-2"
                            style={{
                              backgroundColor:
                                COLORS[responseIndex % COLORS.length],
                            }}
                          ></div>
                          <span
                            className="text-sm font-medium"
                            style={{ fontFamily: "Tiro Bangla, serif" }}
                          >
                            {response.label}: {response.percentage}{" "}
                            {userType !== "duser"
                              ? `(মোট: ${response.total})`
                              : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chart.responses.map((item) => ({
                            name: item.label,
                            value: parseFloat(item.percentage.replace("%", "")),
                            displayValue: item.percentage,
                            total: item.total,
                          }))}
                          cx="50%"
                          cy="50%"
                          innerRadius={chart.hasInnerRadius ? 40 : 0}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chart.responses.map((entry, entryIndex) => (
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
                            return [`মোট: ${props.payload.total || 0}`, name];
                          }}
                          contentStyle={{ fontFamily: "Tiro Bangla, serif" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div
            className="text-lg text-gray-600"
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            ডেটা লোড হচ্ছে...
          </div>
        </div>
      )}
    </div>
  );
}
