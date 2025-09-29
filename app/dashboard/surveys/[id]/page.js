"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdEdit,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdSave,
} from "react-icons/md";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

export default function SurveyDetails({ params }) {
  const searchParams = useSearchParams();
  const shouldOpenEdit = searchParams.get("edit") === "true";

  const [survey, setSurvey] = useState(null);
  const [userName, setUserName] = useState(""); // State for user name
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userData } = useAuth();

  // Helper function to clean and prepare survey data for editing
  const prepareDataForEditing = (surveyData) => {
    const cleanData = JSON.parse(JSON.stringify(surveyData));
    if (!cleanData.person_details) cleanData.person_details = {};
    if (!cleanData.location_details) cleanData.location_details = {};
    if (!cleanData.demand_details) cleanData.demand_details = {};
    if (!cleanData.avail_party_details)
      cleanData.avail_party_details = { দল: [] };
    if (!cleanData.candidate_details) cleanData.candidate_details = { দল: [] };
    if (!cleanData.selected_candidate_details)
      cleanData.selected_candidate_details = {};
    if (!cleanData.candidate_work_details)
      cleanData.candidate_work_details = {};
    return cleanData;
  };

  // Fetch user name by user_id
  const fetchUserName = async (userId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`https://npsbd.xyz/api/users/${userId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.name || "N/A");
      } else {
        console.error("Failed to fetch user name:", await response.text());
        setUserName("N/A");
      }
    } catch (err) {
      console.error("Error fetching user name:", err);
      setUserName("N/A");
    }
  };

  // Handle Edit button click
  const handleEdit = () => {
    const preparedData = prepareDataForEditing(survey);
    setEditingData(preparedData);
    setIsDrawerOpen(true);
  };

  // Handle Save button click
  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    try {
      const personDetails = { ...editingData.person_details };
      if (personDetails.বয়স) {
        personDetails.বয়স = parseInt(personDetails.বয়স) || 0;
      }

      const locationDetails = { ...editingData.location_details };
      if (locationDetails.ওয়ার্ড) {
        locationDetails.ওয়ার্ড = String(locationDetails.ওয়ার্ড);
      }

      const formattedData = {
        person_details: personDetails,
        location_details: locationDetails,
        demand_details: editingData.demand_details,
        worthful_party_name: editingData.worthful_party_name,
        avail_party_details: editingData.avail_party_details,
        candidate_details: editingData.candidate_details,
        selected_candidate_details: editingData.selected_candidate_details,
        candidate_work_details: editingData.candidate_work_details,
      };

      const surveyId = params.id; // Use params.id directly
      const apiUrl = `https://npsbd.xyz/api/surveys/${surveyId}`;
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const updatedSurvey = await response.json();
        setSurvey(updatedSurvey);
        setIsDrawerOpen(false);
        alert("সার্ভে সফলভাবে আপডেট করা হয়েছে!");
      } else {
        const errorText = await response.text();
        let errorMessage = "Failed to update survey.";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        if (response.status === 422) {
          errorMessage = "অবৈধ ডেটা ফরম্যাট। দয়া করে আবার চেষ্টা করুন।";
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error updating survey:", err);
      setError("An error occurred while updating the survey.");
    }
  };

  // Handle Approve button click
  const handleApprove = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `https://npsbd.xyz/api/survey/${params.id}/approve`, // Use params.id directly
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSurvey((prev) => ({ ...prev, status: "approved" }));
        console.log("Survey approved successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to approve survey.");
      }
    } catch (err) {
      console.error("Error approving survey:", err);
      setError("An error occurred while approving the survey.");
    }
  };

  // Handle Reject button click
  const handleReject = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No access token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `https://npsbd.xyz/api/survey/${params.id}/reject`, // Use params.id directly
        {
          method: "PATCH",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSurvey((prev) => ({ ...prev, status: "rejected" }));
        console.log("Survey rejected successfully");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reject survey.");
      }
    } catch (err) {
      console.error("Error rejecting survey:", err);
      setError("An error occurred while rejecting the survey.");
    }
  };

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No access token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://npsbd.xyz/api/survey/${params.id}`, // Use params.id directly
          {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSurvey(data);
          fetchUserName(data.user_id); // Fetch user name
          if (
            shouldOpenEdit &&
            (userData?.user_type === "super_admin" ||
              userData?.user_type === "admin" ||
              userData?.id === data.user_id)
          ) {
            const preparedData = prepareDataForEditing(data);
            setEditingData(preparedData);
            setIsDrawerOpen(true);
          }
        } else {
          setError("Failed to fetch survey details.");
        }
      } catch (err) {
        console.error("Error fetching survey details:", err);
        setError("An error occurred while fetching survey details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyDetails();
  }, [params.id, userData?.id, userData?.user_type, shouldOpenEdit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-gray-600"
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ডেটা লোড করা হচ্ছে...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-red-600 bg-red-50 p-4 rounded-lg"
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  if (!survey) return null;

  // Helper function to format status
  const getStatusInBangla = (status) => {
    switch (status) {
      case "pending":
        return "অপেক্ষামান";
      case "approved":
        return "অনুমোদিত";
      case "rejected":
        return "বাতিল";
      default:
        return status;
    }
  };

  // Helper function to render key-value pairs
  const renderKeyValuePairs = (obj, title, sectionKey) => {
    if (!obj || typeof obj !== "object") return null;

    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2"
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                {key}:
              </p>
              {isDrawerOpen ? (
                <input
                  type="text"
                  value={editingData[sectionKey]?.[key] || ""}
                  onChange={(e) => {
                    setEditingData((prev) => ({
                      ...prev,
                      [sectionKey]: {
                        ...prev[sectionKey],
                        [key]: e.target.value,
                      },
                    }));
                  }}
                  className="w-full p-2 border rounded-lg"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                />
              ) : (
                <p
                  className="text-gray-900"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : value || "N/A"}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render demand details
  const renderDemandDetails = (demandDetails) => {
    if (!demandDetails || typeof demandDetails !== "object") return null;

    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2"
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          চাহিদার বিবরণ
        </h3>
        {Object.entries(demandDetails).map(([question, answers]) => (
          <div key={question} className="mb-6">
            <h4
              className="text-lg font-medium mb-3 text-gray-700"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {question}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(answers).map(([option, value]) => (
                <div
                  key={option}
                  className={`p-3 rounded-lg border-2 ${
                    value === 1
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ fontFamily: "Tiro Bangla, serif" }}
                    >
                      {option}
                    </span>
                    {isDrawerOpen ? (
                      <input
                        type="checkbox"
                        checked={
                          editingData.demand_details?.[question]?.[option] === 1
                        }
                        onChange={(e) => {
                          setEditingData((prev) => ({
                            ...prev,
                            demand_details: {
                              ...prev.demand_details,
                              [question]: {
                                ...prev.demand_details[question],
                                [option]: e.target.checked ? 1 : 0,
                              },
                            },
                          }));
                        }}
                      />
                    ) : value === 1 ? (
                      <MdCheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to render party details
  const renderPartyDetails = (partyDetails, title, sectionKey) => {
    if (!partyDetails?.দল || !Array.isArray(partyDetails.দল)) return null;

    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2"
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {title}
        </h3>
        <div className="space-y-4">
          {partyDetails.দল.map((party, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              {Object.entries(party).map(([partyName, candidates]) => (
                <div key={partyName}>
                  <h4
                    className="font-semibold text-gray-800 mb-2"
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {partyName}
                  </h4>
                  {isDrawerOpen ? (
                    <div className="space-y-2">
                      {Array.isArray(candidates) ? (
                        candidates.map((candidate, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={
                              editingData[sectionKey]?.দল?.[index]?.[
                                partyName
                              ]?.[idx] || ""
                            }
                            onChange={(e) => {
                              const newCandidates = [
                                ...(editingData[sectionKey]?.দল?.[index]?.[
                                  partyName
                                ] || []),
                              ];
                              newCandidates[idx] = e.target.value;
                              setEditingData((prev) => ({
                                ...prev,
                                [sectionKey]: {
                                  ...prev[sectionKey],
                                  দল: [
                                    ...prev[sectionKey].দল.slice(0, index),
                                    { [partyName]: newCandidates },
                                    ...prev[sectionKey].দল.slice(index + 1),
                                  ],
                                },
                              }));
                            }}
                            className="w-full p-2 border rounded-lg"
                            style={{ fontFamily: "Tiro Bangla, serif" }}
                          />
                        ))
                      ) : (
                        <input
                          type="text"
                          value={
                            editingData[sectionKey]?.দল?.[index]?.[partyName] ||
                            ""
                          }
                          onChange={(e) => {
                            setEditingData((prev) => ({
                              ...prev,
                              [sectionKey]: {
                                ...prev[sectionKey],
                                দল: [
                                  ...prev[sectionKey].দল.slice(0, index),
                                  { [partyName]: e.target.value },
                                  ...prev[sectionKey].দল.slice(index + 1),
                                ],
                              },
                            }));
                          }}
                          className="w-full p-2 border rounded-lg"
                          style={{ fontFamily: "Tiro Bangla, serif" }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {Array.isArray(candidates) ? (
                        candidates.map((candidate, idx) => (
                          <p
                            key={idx}
                            className="text-gray-600 ml-4"
                            style={{ fontFamily: "Tiro Bangla, serif" }}
                          >
                            • {candidate}
                          </p>
                        ))
                      ) : (
                        <p
                          className="text-gray-600 ml-4"
                          style={{ fontFamily: "Tiro Bangla, serif" }}
                        >
                          • {candidates}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render selected candidate details
  const renderSelectedCandidateDetails = (selectedDetails) => {
    if (!selectedDetails) return null;

    return (
      <div className="mb-8">
        <h3
          className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2"
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          নির্বাচিত প্রার্থীর বিবরণ
        </h3>
        <div className="space-y-6">
          {Object.entries(selectedDetails).map(([key, value]) => (
            <div key={key}>
              <h4
                className="font-semibold text-gray-700 mb-3"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                {key}
              </h4>
              {typeof value === "object" && value !== null ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(value).map(([option, val]) => (
                    <div
                      key={option}
                      className={`p-3 rounded-lg border-2 ${
                        val === 1
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm"
                          style={{ fontFamily: "Tiro Bangla, serif" }}
                        >
                          {option}
                        </span>
                        {isDrawerOpen ? (
                          <input
                            type="checkbox"
                            checked={
                              editingData.selected_candidate_details?.[key]?.[
                                option
                              ] === 1
                            }
                            onChange={(e) => {
                              setEditingData((prev) => ({
                                ...prev,
                                selected_candidate_details: {
                                  ...prev.selected_candidate_details,
                                  [key]: {
                                    ...prev.selected_candidate_details[key],
                                    [option]: e.target.checked ? 1 : 0,
                                  },
                                },
                              }));
                            }}
                          />
                        ) : val === 1 ? (
                          <MdCheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : isDrawerOpen ? (
                <input
                  type="text"
                  value={editingData.selected_candidate_details?.[key] || ""}
                  onChange={(e) => {
                    setEditingData((prev) => ({
                      ...prev,
                      selected_candidate_details: {
                        ...prev.selected_candidate_details,
                        [key]: e.target.value,
                      },
                    }));
                  }}
                  className="w-full p-2 border rounded-lg"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                />
              ) : (
                <p
                  className="text-gray-700 bg-gray-50 p-3 rounded-lg"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 relative">
      {/* Top Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="mb-2" style={{ fontFamily: "Tiro Bangla, serif" }}>
              <p className="text-gray-600">সার্ভে আইডি:</p>
              <p className="text-xl font-semibold">#{survey.survey_id}</p>
            </div>
            <div className="mb-2" style={{ fontFamily: "Tiro Bangla, serif" }}>
              <p className="text-gray-600">ব্যবহারকারী আইডি:</p>
              <p className="text-lg font-medium">#{survey.user_id}</p>
            </div>
            <div className="mb-2" style={{ fontFamily: "Tiro Bangla, serif" }}>
              <p className="text-gray-600">সার্ভেয়ারের নাম:</p>
              <p className="text-lg font-medium">
                {userName || "লোড হচ্ছে..."}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                getStatusInBangla(survey.status) === "অনুমোদিত"
                  ? "bg-green-100 text-green-800"
                  : getStatusInBangla(survey.status) === "বাতিল"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {getStatusInBangla(survey.status)}
            </span>
            <p
              className="mt-2 text-gray-600"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              তৈরি: {new Date(survey.created_at).toLocaleDateString("bn-BD")}
            </p>
            <p
              className="mt-1 text-gray-600"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              আপডেট: {new Date(survey.updated_at).toLocaleDateString("bn-BD")}
            </p>
            {survey.location_details?.আসন && (
              <p className="mt-1" style={{ fontFamily: "Tiro Bangla, serif" }}>
                <span className="text-gray-600">আসন:</span>{" "}
                {survey.location_details.আসন}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {(userData?.user_type === "super_admin" ||
              userData?.user_type === "admin" ||
              userData?.id === survey.user_id) && (
              <>
                <motion.button
                  onClick={handleEdit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  <MdEdit className="w-5 h-5" />
                  সংশোধন করুন
                </motion.button>
                {survey.status === "pending" && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      style={{ fontFamily: "Tiro Bangla, serif" }}
                    >
                      <MdCheckCircle className="w-4 h-4" />
                      অনুমোদন দিন
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                      style={{ fontFamily: "Tiro Bangla, serif" }}
                    >
                      <MdCancel className="w-4 h-4" />
                      বাতিল করুন
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Drawer for Editing */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white shadow-xl z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                সার্ভে সংশোধন
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {renderKeyValuePairs(
              editingData.person_details,
              "ব্যক্তিগত তথ্য",
              "person_details"
            )}
            {renderKeyValuePairs(
              editingData.location_details,
              "অবস্থানের তথ্য",
              "location_details"
            )}
            {renderDemandDetails(editingData.demand_details)}
            <div className="mb-8">
              <h3
                className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                যোগ্য দল
              </h3>
              <input
                type="text"
                value={editingData.worthful_party_name || ""}
                onChange={(e) => {
                  setEditingData((prev) => ({
                    ...prev,
                    worthful_party_name: e.target.value,
                  }));
                }}
                className="w-full p-2 border rounded-lg"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              />
            </div>
            {renderPartyDetails(
              editingData.avail_party_details,
              "উপলব্ধ দলের তথ্য",
              "avail_party_details"
            )}
            {renderPartyDetails(
              editingData.candidate_details,
              "প্রার্থীর তথ্য",
              "candidate_details"
            )}
            {renderSelectedCandidateDetails(
              editingData.selected_candidate_details
            )}
            {renderKeyValuePairs(
              editingData.candidate_work_details,
              "প্রার্থীর কার্যক্রমের তথ্য",
              "candidate_work_details"
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                <MdSave className="w-4 h-4" />
                সংরক্ষণ করুন
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                <MdCancel className="w-4 h-4" />
                বাতিল করুন
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Survey Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderKeyValuePairs(
            survey.person_details,
            "ব্যক্তিগত তথ্য",
            "person_details"
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderKeyValuePairs(
            survey.location_details,
            "অবস্থানের তথ্য",
            "location_details"
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderDemandDetails(survey.demand_details)}
        </div>
        {survey.worthful_party_name && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3
              className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              যোগ্য দল
            </h3>
            <p
              className="text-lg text-gray-700"
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {survey.worthful_party_name}
            </p>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderPartyDetails(
            survey.avail_party_details,
            "উপলব্ধ দলের তথ্য",
            "avail_party_details"
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderPartyDetails(
            survey.candidate_details,
            "প্রার্থীর তথ্য",
            "candidate_details"
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderSelectedCandidateDetails(survey.selected_candidate_details)}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderKeyValuePairs(
            survey.candidate_work_details,
            "প্রার্থীর কার্যক্রমের তথ্য",
            "candidate_work_details"
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3
            className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2"
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            অনুমোদনের তথ্য
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                অনুমোদনকারী:
              </p>
              <p
                className="text-gray-900"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                {survey.approved_by || "এখনো অনুমোদিত হয়নি"}
              </p>
            </div>
            <div className="space-y-1">
              <p
                className="text-gray-600 text-sm"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                স্ট্যাটাস:
              </p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm ${
                  getStatusInBangla(survey.status) === "অনুমোদিত"
                    ? "bg-green-100 text-green-800"
                    : getStatusInBangla(survey.status) === "বাতিল"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                {getStatusInBangla(survey.status)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
