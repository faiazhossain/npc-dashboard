"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SurveyBreadcrumb from "./SurveyBreadcrumb";

export default function SurveyDetails({ surveyId }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditDrawer, setShowEditDrawer] = useState(false);

  const breadcrumbItems = [
    { label: "ড্যাশবোর্ড", path: "/" },
    { label: "সার্ভে তালিকা", path: "/dashboard/surveys" },
    { label: "সার্ভে বিস্তারিত" },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/json/surveys.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        const survey = jsonData.surveys.find((s) => s.id === surveyId);
        if (!survey) {
          throw new Error("Survey not found");
        }
        setData(survey);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [surveyId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "অনুমোদিত":
        return "bg-green-100 text-green-800";
      case "বাতিল":
        return "bg-red-100 text-red-800";
      case "অপেক্ষামান":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg' style={{ fontFamily: "Tiro Bangla, serif" }}>
          ডেটা লোড করা হচ্ছে...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div
          className='text-lg text-red-600'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {error || "সার্ভে পাওয়া যায়নি"}
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      {/* Breadcrumb */}
      <SurveyBreadcrumb items={breadcrumbItems} />

      {/* Survey Info Card */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* Left Side - Survey Info */}
        <motion.div
          className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className='space-y-4'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-gray-600'>সার্ভে আইডিঃ</p>
                <p className='text-lg font-medium'>#{data.id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  data.status
                )}`}
              >
                {data.status}
              </span>
            </div>
            <div>
              <p className='text-sm text-gray-600'>তারিখঃ</p>
              <p className='text-base'>{data.date}</p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>এরিয়াঃ</p>
              <p className='text-base'>{data.area}</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Action Buttons */}
        <motion.div
          className='flex flex-col sm:flex-row gap-4 justify-end items-start md:items-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={() => {
              // Handle approve action
            }}
            className='px-6 py-2 bg-[#006747] text-white rounded-md hover:bg-[#005536] transition-colors duration-200'
            style={{ fontFamily: "Tiro Bangla, serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            অনুমোদন দিন
          </motion.button>
          <motion.button
            onClick={() => {
              // Handle reject action
            }}
            className='px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200'
            style={{ fontFamily: "Tiro Bangla, serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            বাতিল করুন
          </motion.button>
        </motion.div>
      </div>

      {/* Survey Details Card */}
      <motion.div
        className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className='flex justify-between items-center mb-6'>
          <h2
            className='text-xl font-semibold text-gray-800'
            style={{ fontFamily: "Tiro Bangla, serif" }}
          >
            সার্ভে বিস্তারিত
          </h2>
          <motion.button
            onClick={() => setShowEditDrawer(true)}
            className='px-4 py-2 bg-[#006747] text-white rounded-md hover:bg-[#005536] transition-colors duration-200'
            style={{ fontFamily: "Tiro Bangla, serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            এডিট করুন
          </motion.button>
        </div>

        <div
          className='grid grid-cols-1 md:grid-cols-2 gap-6'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          {Object.entries(data.details).map(([key, value]) => (
            <div key={key} className='space-y-1'>
              <p className='text-sm text-gray-600'>{key}:</p>
              <p className='text-base'>{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Edit Drawer */}
      {showEditDrawer && (
        <motion.div
          className='fixed inset-0 bg-black bg-opacity-50 z-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className='absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg'
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h3
                  className='text-lg font-semibold'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  সার্ভে এডিট করুন
                </h3>
                <button
                  onClick={() => setShowEditDrawer(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  ✕
                </button>
              </div>

              {/* Edit Form */}
              <form className='space-y-4'>
                {Object.entries(data.details).map(([key, value]) => (
                  <div key={key}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: "Tiro Bangla, serif" }}
                    >
                      {key}
                    </label>
                    <input
                      type='text'
                      defaultValue={value}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747]'
                    />
                  </div>
                ))}

                <div className='flex justify-end space-x-3 mt-6'>
                  <motion.button
                    type='button'
                    onClick={() => setShowEditDrawer(false)}
                    className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    বাতিল
                  </motion.button>
                  <motion.button
                    type='submit'
                    className='px-4 py-2 bg-[#006747] text-white rounded-md hover:bg-[#005536]'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    সংরক্ষণ করুন
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
