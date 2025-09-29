"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import SurveyBreadcrumb from "./SurveyBreadcrumb";
import SurveyFilters from "./SurveyFilters";
import SurveyTable from "./SurveyTable";
import Pagination from "./Pagination";

export default function SurveyContent() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // Initialize currentFilters with default questions
  const [currentFilters, setCurrentFilters] = useState({
    "প্রশ্ন ১": [
      "আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?",
    ],
    "প্রশ্ন ২": [
      "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?",
    ],
  });
  const [selectedSurveys, setSelectedSurveys] = useState([]);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 30; // API page_size

  // State for API-fetched filter options
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  // Static filter options for questions (common set for Q1 and Q2)
  const commonQuestionOptions = [
    "আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?",
    "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?",
    "এদের মধ্যে কাকে বেশী যোগ্য বলে মনে হয়?",
    "আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে জনপ্রিয়?",
  ];

  // Initialize question selections with default values
  const [question1Selected, setQuestion1Selected] = useState([
    "আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?",
  ]);
  const [question2Selected, setQuestion2Selected] = useState([
    "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?",
  ]);

  // Computed dynamic options
  const question1Options = commonQuestionOptions.filter(
    (option) => !question2Selected.includes(option)
  );
  const question2Options = commonQuestionOptions.filter(
    (option) => !question1Selected.includes(option)
  );

  const statusOptions = [
    { value: "pending", label: "অপেক্ষামান" },
    { value: "accepted", label: "অনুমোদিত" },
    { value: "rejected", label: "বাতিল" },
  ];

  const breadcrumbItems = [
    { label: "ড্যাশবোর্ড", path: "/dashboard" },
    { label: "সার্ভে তালিকা", path: "/dashboard/surveys" },
  ];

  // Function to fetch total count from API with filters (excluding questions)
  const fetchSurveyCount = useCallback(async (filters = {}) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      // Build query parameters excluding question filters
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        // Exclude question filters from count API call
        if (
          key !== "প্রশ্ন ১" &&
          key !== "প্রশ্ন ২" &&
          value &&
          value.length > 0
        ) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(","));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await fetch(
        `https://npsbd.xyz/api/surveys/count?${queryParams.toString()}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const countData = await response.json();
      console.log("🚀 ~ fetchSurveyCount ~ countData:", countData);

      // Return the count value (adjust based on actual API response structure)
      return countData.count || countData.total || countData || 0;
    } catch (error) {
      console.error("Error fetching survey count:", error);
      return 0;
    }
  }, []);

  // Function to fetch surveys from API with pagination and filters
  const loadSurveys = useCallback(
    async (page = 1, filters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found. Please log in again.");
        }

        console.log(
          `Loading surveys: Page ${page}, Items per page: ${itemsPerPage}`,
          "Filters:",
          filters
        );

        // Fetch total count with filters (excluding questions)
        const totalCount = await fetchSurveyCount(filters);

        // Build query parameters
        const queryParams = new URLSearchParams({
          page: page.toString(),
          page_size: itemsPerPage.toString(),
        });

        // Add filter parameters directly with Bangla keys (as API expects)
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value.length > 0) {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(","));
            } else {
              queryParams.append(key, value);
            }
          }
        });

        const response = await fetch(
          `https://npsbd.xyz/api/surveys/?${queryParams.toString()}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log("🚀 ~ loadSurveys ~ jsonData:", jsonData);

        // Handle different response formats
        let surveysArray = [];
        let total = totalCount; // Use the count from the count API
        let pages = Math.ceil(totalCount / itemsPerPage);

        if (Array.isArray(jsonData)) {
          surveysArray = jsonData.filter((survey) => {
            const politicalParty =
              survey.candidate_work_details?.[
                "আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে জনপ্রিয়?"
              ];
            return politicalParty && politicalParty !== "N/A";
          });

          if (surveysArray.length < jsonData.length) {
            console.log(
              `Filtered out ${
                jsonData.length - surveysArray.length
              } surveys with missing or N/A political party data`
            );
          }
        } else if (jsonData.data && Array.isArray(jsonData.data)) {
          surveysArray = jsonData.data.filter((survey) => {
            const politicalParty =
              survey.candidate_work_details?.[
                "আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে জনপ্রিয়?"
              ];
            return politicalParty && politicalParty !== "N/A";
          });

          if (surveysArray.length < jsonData.data.length) {
            console.log(
              `Filtered out ${
                jsonData.data.length - surveysArray.length
              } surveys with missing or N/A political party data`
            );
          }
        } else {
          throw new Error("Invalid response format");
        }

        // Helper function to get answers based on the selected question
        const getAnswersForQuestion = (survey, questionText) => {
          console.log("Received questionText:", JSON.stringify(questionText));

          const questionToFieldMap = {
            "আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?":
              {
                field: "worthful_party_name",
                type: "direct",
              },
            "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?": {
              field: "candidate_details",
              type: "object",
            },
            "এদের মধ্যে কাকে বেশী যোগ্য বলে মনে হয়?": {
              field:
                "selected_candidate_details.এদের মধ্যে কাকে বেশী যোগ্য বলে মনে হয়?",
              type: "direct",
            },
            "আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে জনপ্রিয়?":
              {
                field:
                  "candidate_work_details.আপনার মতে, রাজনৈতিক দল হিসেবে কোন দল আপনার এলাকায় সবচেয়ে জনপ্রিয়?",
                type: "direct",
              },
            "বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি কি?":
              {
                field:
                  "demand_details.বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি কি?",
                type: "multiselect",
              },
            "এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?": {
              field:
                "selected_candidate_details.এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?",
              type: "multiselect",
            },
          };

          const mapping = questionToFieldMap[questionText];
          console.log(
            "Available questionToFieldMap keys:",
            Object.keys(questionToFieldMap)
          );
          if (!mapping) return ["N/A"];

          if (mapping.type === "direct") {
            const fieldParts = mapping.field.split(".");
            let value = survey;

            if (mapping.field === "worthful_party_name") {
              console.log("Worthful party name:", survey.worthful_party_name);
              return survey.worthful_party_name
                ? [survey.worthful_party_name]
                : ["N/A"];
            }

            for (const part of fieldParts) {
              value = value?.[part];
              if (value === undefined || value === null) {
                console.log(`Field part ${part} is undefined or null`);
                return ["N/A"];
              }
            }

            console.log(`Found value for ${mapping.field}:`, value);
            return value ? [value] : ["N/A"];
          } else if (mapping.type === "multiselect") {
            const fieldParts = mapping.field.split(".");
            let obj = survey;

            for (const part of fieldParts) {
              obj = obj?.[part];
              if (obj === undefined) return ["N/A"];
            }

            return Object.entries(obj || {})
              .filter(([_, value]) => value === 1)
              .map(([key]) => key);
          } else if (mapping.type === "object") {
            if (
              questionText ===
              "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?"
            ) {
              console.log(
                "Checking candidate details:",
                JSON.stringify(survey.candidate_details)
              );

              if (
                !survey.candidate_details?.দল ||
                !Array.isArray(survey.candidate_details.দল)
              ) {
                console.log("No valid candidate details found");
                return ["N/A"];
              }

              const results = survey.candidate_details.দল.map((item) => {
                const partyName = Object.keys(item)[0];
                const candidate = item[partyName];
                return `${partyName}: ${candidate}`;
              });

              console.log("Processed candidate details:", results);
              return results;
            }

            return ["N/A"];
          }

          return ["N/A"];
        };

        const mappedSurveys = surveysArray.map((survey) => {
          let answer1 = [];
          let answer2 = [];

          console.log("Processing survey:", survey.survey_id);
          console.log("Question 1 selected:", question1Selected);
          console.log("Question 2 selected:", question2Selected);

          if (question1Selected.length > 0) {
            answer1 = [];
            question1Selected.forEach((q) => {
              const qAnswers = getAnswersForQuestion(survey, q);
              console.log(`Answers for "${q}":`, qAnswers);
              if (qAnswers && qAnswers.length > 0 && qAnswers[0] !== "N/A") {
                answer1.push(...qAnswers);
              }
            });

            if (answer1.length === 0) {
              answer1 = ["N/A"];
            }
          } else {
            answer1 = Object.entries(
              survey.demand_details?.[
                "বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি কি?"
              ] || {}
            )
              .filter(([_, value]) => value === 1)
              .map(([key]) => key);

            if (answer1.length === 0) {
              answer1 = ["N/A"];
            }
          }

          if (question2Selected.length > 0) {
            answer2 = [];
            question2Selected.forEach((q) => {
              const qAnswers = getAnswersForQuestion(survey, q);
              console.log(`Answers for "${q}":`, qAnswers);
              if (qAnswers && qAnswers.length > 0 && qAnswers[0] !== "N/A") {
                answer2.push(...qAnswers);
              }
            });

            if (answer2.length === 0) {
              answer2 = ["N/A"];
            }
          } else {
            answer2 = Object.entries(
              survey.selected_candidate_details?.[
                "এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?"
              ] || {}
            )
              .filter(([_, value]) => value === 1)
              .map(([key]) => key);

            if (answer2.length === 0) {
              answer2 = ["N/A"];
            }
          }

          return {
            id: survey.survey_id,
            date: new Date(survey.created_at).toLocaleDateString("bn-BD"),
            area: survey.location_details?.আসন || "N/A",
            answer1,
            answer2,
            status:
              survey.status === "pending"
                ? "অপেক্ষামান"
                : survey.status === "accepted"
                ? "অনুমোদিত"
                : "বাতিল",
          };
        });

        console.log(
          "Final mapped surveys:",
          mappedSurveys.map((s) => ({
            id: s.id,
            answer1: s.answer1,
            answer2: s.answer2,
          }))
        );

        setSurveys(mappedSurveys);
        setTotalItems(total);
        setTotalPages(pages);
      } catch (error) {
        console.error("Error loading surveys:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [question1Selected, question2Selected, fetchSurveyCount]
  );

  // Fetch filter options on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch("https://npsbd.xyz/api/divisions", {
          method: "GET",
          headers: { accept: "application/json" },
        });
        const data = await response.json();
        setDivisions(data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (currentFilters.বিভাগ) {
      const selectedDivision = divisions.find(
        (div) => div.bn_name === currentFilters.বিভাগ
      );
      if (selectedDivision) {
        fetch(
          `https://npsbd.xyz/api/divisions/${selectedDivision.id}/districts`,
          {
            method: "GET",
            headers: { accept: "application/json" },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            setDistricts(data);
            setConstituencies([]);
            setCurrentFilters((prev) => ({
              ...prev,
              জেলা: "",
              আসন: "",
            }));
          })
          .catch((error) => console.error("Error fetching districts:", error));
      }
    } else {
      setDistricts([]);
      setConstituencies([]);
      setCurrentFilters((prev) => ({
        ...prev,
        জেলা: "",
        আসন: "",
      }));
    }
  }, [currentFilters.বিভাগ, divisions]);

  // Fetch constituencies when district changes
  useEffect(() => {
    if (currentFilters.জেলা) {
      const selectedDistrict = districts.find(
        (dist) => dist.bn_name === currentFilters.জেলা
      );
      if (selectedDistrict) {
        fetch(`https://npsbd.xyz/api/districts/${selectedDistrict.id}/seats`, {
          method: "GET",
          headers: { accept: "application/json" },
        })
          .then((response) => response.json())
          .then((data) => {
            setConstituencies(data);
            setCurrentFilters((prev) => ({ ...prev, আসন: "" }));
          })
          .catch((error) =>
            console.error("Error fetching constituencies:", error)
          );
      }
    } else {
      setConstituencies([]);
      setCurrentFilters((prev) => ({ ...prev, আসন: "" }));
    }
  }, [currentFilters.জেলা, districts]);

  useEffect(() => {
    loadSurveys(currentPage, currentFilters);
  }, [currentPage, loadSurveys]); // Removed currentFilters from dependencies

  const handleFilterChange = (key, value) => {
    setCurrentFilters((prev) => ({ ...prev, [key]: value }));

    // Handle multi-select for questions
    if (key === "প্রশ্ন ১") {
      setQuestion1Selected(
        Array.isArray(value) ? value : [value].filter(Boolean)
      );
    } else if (key === "প্রশ্ন ২") {
      setQuestion2Selected(
        Array.isArray(value) ? value : [value].filter(Boolean)
      );
    }
  };

  const handleSearch = () => {
    console.log("Applying filters:", currentFilters);
    setCurrentPage(1); // Reset to first page
    setSelectedSurveys([]); // Clear selected surveys
    loadSurveys(1, currentFilters); // Load surveys with current filters
  };

  useEffect(() => {
    // Load surveys with initial filters on component mount
    loadSurveys(1, currentFilters);
  }, [loadSurveys]); // Only run on mount or when loadSurveys changes

  const handleReset = () => {
    setCurrentFilters({
      "প্রশ্ন ১": [
        "আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?",
      ],
      "প্রশ্ন ২": [
        "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?",
      ],
    });
    setQuestion1Selected([
      "আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?",
    ]);
    setQuestion2Selected([
      "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?",
    ]);
    setCurrentPage(1);
    setSelectedSurveys([]);
    setDistricts([]);
    setConstituencies([]);
    loadSurveys(1, {
      "প্রশ্ন ১": [
        "আগামীর বাংলাদেশ পরিচালনায় আপনি কোন রাজনৈতিক দলকে যোগ্য মনে করেন?",
      ],
      "প্রশ্ন ২": [
        "আপনার এলাকায় কোন দলের কাকে প্রার্থী করা উচিৎ বলে আপনি মনে করেন?",
      ],
    });
  };

  const flattenArray = (arr) => {
    return arr.reduce((flat, current) => {
      return flat.concat(
        Array.isArray(current) ? flattenArray(current) : current
      );
    }, []);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all surveys across all pages
      const newSelections = surveys.map((survey) => survey.id);
      const updatedSelections = [
        ...new Set([...selectedSurveys, ...newSelections]),
      ];
      setSelectedSurveys(updatedSelections);
      console.log("After Select All (checked):", updatedSelections);
    } else {
      // Deselect all surveys on the current page
      const currentPageIds = surveys.map((survey) => survey.id);
      const updatedSelections = selectedSurveys.filter(
        (id) => !currentPageIds.includes(id)
      );
      setSelectedSurveys(updatedSelections);
      console.log("After Select All (unchecked):", updatedSelections);
    }
  };

  const handleSelectSurvey = (id) => {
    setSelectedSurveys((prev) => {
      const updatedSelections = prev.includes(id)
        ? prev.filter((surveyId) => surveyId !== id)
        : [...prev, id];
      console.log("After Select Survey:", updatedSelections);
      return updatedSelections;
    });
  };

  const handleApproveAll = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      const flatSurveyIds = flattenArray(selectedSurveys);
      console.log("Sending approval request to API:", flatSurveyIds);

      const response = await fetch(
        "https://npsbd.xyz/api/surveys/bulk/approve",
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            survey_ids: flatSurveyIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to approve surveys: ${response.status}`);
      }

      setSurveys((prev) =>
        prev.map((survey) =>
          flatSurveyIds.includes(survey.id)
            ? { ...survey, status: "অনুমোদিত" }
            : survey
        )
      );
      setSelectedSurveys([]);
      console.log("Surveys approved successfully, selection cleared");
    } catch (error) {
      console.error("Error approving surveys:", error);
      setError("সার্ভে অনুমোদন করতে ব্যর্থ: " + error.message);
    }
  };

  const handleRejectAll = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      const flatSurveyIds = flattenArray(selectedSurveys);
      console.log("Sending rejection request to API:", flatSurveyIds);

      const response = await fetch(
        "https://npsbd.xyz/api/surveys/bulk/reject",
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            survey_ids: flatSurveyIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to reject surveys: ${response.status}`);
      }

      setSurveys((prev) =>
        prev.map((survey) =>
          flatSurveyIds.includes(survey.id)
            ? { ...survey, status: "বাতিল" }
            : survey
        )
      );
      setSelectedSurveys([]);
      console.log("Surveys rejected successfully, selection cleared");
    } catch (error) {
      console.error("Error rejecting surveys:", error);
      setError("সার্ভে বাতিল করতে ব্যর্থ: " + error.message);
    }
  };

  const isAllSelected =
    surveys.length > 0 &&
    surveys.every((survey) => selectedSurveys.includes(survey.id));

  const handlePageChange = (newPage) => {
    console.log(`Changing from page ${currentPage} to page ${newPage}`);
    setCurrentPage(newPage);
    setSelectedSurveys([]);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-gray-600 bg-white p-8 rounded-xl shadow-sm'
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

  if (!surveys && !loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg' style={{ fontFamily: "Tiro Bangla, serif" }}>
          কোন ডেটা পাওয়া যায়নি
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      <SurveyBreadcrumb items={breadcrumbItems} />
      <SurveyFilters
        filters={{
          বিভাগ: "বিভাগ",
          জেলা: "জেলা",
          আসন: "আসন",
          status: "স্ট্যাটাস",
          "প্রশ্ন ১": "প্রশ্ন ১",
          "প্রশ্ন ২": "প্রশ্ন ২",
        }}
        filterOptions={{
          বিভাগOptions: divisions.map((div) => div.bn_name),
          জেলাOptions: districts.map((dist) => dist.bn_name),
          আসনOptions: constituencies.map(
            (constituency) => constituency.bn_name
          ),
          statusOptions: statusOptions,
          "প্রশ্ন ১Options": question1Options,
          "প্রশ্ন ২Options": question2Options,
        }}
        currentFilters={currentFilters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
        multiSelectKeys={["প্রশ্ন ১", "প্রশ্ন ২"]}
      />
      <div className='flex items-center justify-between mb-4'>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={isAllSelected}
            onChange={handleSelectAll}
            className='h-5 w-5'
          />
          <span style={{ fontFamily: "Tiro Bangla, serif" }}>
            সব নির্বাচন করুন
          </span>
        </label>
        {selectedSurveys.length > 0 && (
          <div className='flex gap-3'>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleApproveAll}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
              সব অনুমোদন করুন ({selectedSurveys.length})
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={handleRejectAll}
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
              সব বাতিল করুন ({selectedSurveys.length})
            </motion.button>
          </div>
        )}
      </div>
      <SurveyTable
        data={surveys}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        selectedSurveys={selectedSurveys}
        onSelectSurvey={handleSelectSurvey}
        isAllSelected={isAllSelected}
        onSelectAll={handleSelectAll}
      />
      {surveys.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          // totalCount={totalCount}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {surveys.length === 0 && !loading && (
        <motion.div
          className='text-center py-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p
            className='text-gray-500 mb-4'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            কোন সার্ভে পাওয়া যায়নি
          </p>
        </motion.div>
      )}
    </div>
  );
}
