"use client";
import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import surveyData from "@/public/json/surveys.json";
import { MdEdit, MdClose } from "react-icons/md";

export default function SurveyDetails({ params }) {
  const resolvedParams = use(params);
  const [survey, setSurvey] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = surveyData.surveys.find((s) => s.id === resolvedParams.id);
    setSurvey(found);
    setEditingData(found?.details);
    setLoading(false);
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-gray-600'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ডেটা লোড করা হচ্ছে...
        </motion.div>
      </div>
    );
  }

  if (!survey) return null;

  return (
    <div className='container mx-auto p-6 relative'>
      {/* Top Card */}
      <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
        <div className='flex justify-between items-start'>
          <div>
            <div className='mb-2' style={{ fontFamily: "Tiro Bangla, serif" }}>
              <p className='text-gray-600'>সার্ভে আইডিঃ</p>
              <p className='text-xl font-semibold'>#{survey.id}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                survey.status === "অনুমোদিত"
                  ? "bg-green-100 text-green-800"
                  : survey.status === "বাতিল"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {survey.status}
            </span>
            <p
              className='mt-2 text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {survey.date}
            </p>
            <p className='mt-1' style={{ fontFamily: "Tiro Bangla, serif" }}>
              <span className='text-gray-600'>এরিয়াঃ</span> {survey.area}
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              অনুমোদন দিন
            </button>
            <button
              className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              বাতিল করুন
            </button>
          </div>
        </div>
      </div>

      {/* Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-white rounded-xl shadow-sm p-8 relative'
      >
        <div className='absolute top-6 right-6'>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className='p-3 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors flex items-center gap-2'
          >
            <MdEdit className='w-5 h-5' />
            <span style={{ fontFamily: "Tiro Bangla, serif" }}>
              সম্পাদনা করুন
            </span>
          </button>
        </div>

        <h2
          className='text-2xl mb-6 pb-4 border-b border-gray-200'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ব্যক্তিগত তথ্য
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6'>
          <div className='space-y-1'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              নামঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.name}
            </p>
          </div>

          <div className='space-y-1'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              বয়সঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.age}
            </p>
          </div>

          <div className='space-y-1'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              লিঙ্গঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.gender}
            </p>
          </div>

          <div className='space-y-1'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              পেশাঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.occupation}
            </p>
          </div>

          <div className='space-y-1'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              শিক্ষাগত যোগ্যতাঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.education}
            </p>
          </div>

          <div className='space-y-1'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              ফোনঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.phone}
            </p>
          </div>

          <div className='space-y-1'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              ইমেইলঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.email}
            </p>
          </div>

          <div className='space-y-1 md:col-span-2'>
            <p
              className='text-gray-600'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              ঠিকানাঃ
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {survey.details.address}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Edit Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black'
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className='fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto'
            >
              <div className='flex justify-between items-center mb-6'>
                <h2
                  className='text-xl font-semibold'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  সার্ভে তথ্য সম্পাদনা
                </h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className='p-2 hover:bg-gray-100 rounded-full'
                >
                  <MdClose className='w-6 h-6' />
                </button>
              </div>

              <form className='space-y-4'>
                {Object.entries(editingData || {}).map(([key, value]) => (
                  <div key={key}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: "Tiro Bangla, serif" }}
                    >
                      {key}
                    </label>
                    <input
                      type='text'
                      value={value}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          [key]: e.target.value,
                        })
                      }
                      className='w-full p-2 border border-gray-300 rounded-lg'
                    />
                  </div>
                ))}

                <div className='flex gap-3 mt-6'>
                  <button
                    type='submit'
                    className='flex-1 px-4 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    সার্ভে আপডেট করুন
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsDrawerOpen(false)}
                    className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    বাতিল করুন
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
