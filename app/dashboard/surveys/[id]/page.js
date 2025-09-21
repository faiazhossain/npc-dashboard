"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import surveyData from "@/public/json/surveys.json";
import { MdEdit, MdClose } from "react-icons/md";

export default function SurveyDetails({ params }) {
  const [survey, setSurvey] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => {
    const found = surveyData.surveys.find((s) => s.id === params.id);
    setSurvey(found);
    setEditingData(found?.details);
  }, [params.id]);

  if (!survey) return null;

  const detailsCards = [
    { label: "নামঃ", value: survey.details.name },
    { label: "বয়সঃ", value: survey.details.age },
    { label: "লিঙ্গঃ", value: survey.details.gender },
    { label: "পেশাঃ", value: survey.details.occupation },
    { label: "শিক্ষাগত যোগ্যতাঃ", value: survey.details.education },
    { label: "ঠিকানাঃ", value: survey.details.address },
    { label: "ফোনঃ", value: survey.details.phone },
    { label: "ইমেইলঃ", value: survey.details.email },
  ];

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

      {/* Details Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {detailsCards.map((detail, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className='bg-white rounded-xl shadow-sm p-6 relative'
          >
            <p
              className='text-gray-600 mb-2'
              style={{ fontFamily: "Tiro Bangla, serif" }}
            >
              {detail.label}
            </p>
            <p className='text-xl' style={{ fontFamily: "Tiro Bangla, serif" }}>
              {detail.value}
            </p>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className='absolute bottom-4 right-4 p-2 text-[#006747] hover:text-[#005536] transition-colors'
            >
              <MdEdit className='w-5 h-5' />
            </button>
          </motion.div>
        ))}
      </div>

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
