'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdEdit } from 'react-icons/md';
import Image from 'next/image';

export default function Surveyors() {
  const [surveyors, setSurveyors] = useState([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSurveyor, setSelectedSurveyor] = useState(null);
  const [newSurveyor, setNewSurveyor] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const pageSize = 10;

  // Fetch surveyors from API
  useEffect(() => {
    const fetchSurveyors = async () => {
      try {
        const response = await fetch(
          `https://npsbd.xyz/api/users/?user_type=surveyer&page=${currentPage}&page_size=${pageSize}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlcmFkbWluQGV4YW1wbGUuY29tIiwiZXhwIjoxNzYwMTUzMjk0fQ.QdT_7rCvOt2BqbxerRQHB2y5OcHeshDCfq9prGaOon4',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch surveyors');
        }

        const data = await response.json();
        // Map API response to component's expected structure
        const mappedSurveyors = data.map((surveyor) => ({
          id: surveyor.id,
          name: surveyor.name,
          mobile: surveyor.phone,
          email: surveyor.email,
          // Mock missing fields (replace with actual data if available from another API)
          totalForms: 0,
          approvedForms: 0,
          rejectedForms: 0,
          pendingForms: 0,
          imageUrl: '/default-profile.png', // Replace with actual image URL if available
        }));

        setSurveyors(mappedSurveyors);
        // Disable "Next" button if fewer than pageSize surveyors are returned
        setHasNextPage(data.length === pageSize);
      } catch (error) {
        console.error('Error fetching surveyors:', error);
        // Optionally, set an error state to display to the user
      }
    };

    fetchSurveyors();
  }, [currentPage]);

  const handleViewDetails = (surveyor) => {
    setSelectedSurveyor(surveyor);
    setIsDetailsDrawerOpen(true);
    setIsEditMode(false);
  };

  const handleDelete = (id) => {
    setSurveyors(surveyors.filter((s) => s.id !== id));
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      {/* Header with buttons */}
      <div className='flex justify-between items-center mb-6'>
        <h2
          className='text-xl font-semibold'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          সার্ভেয়ার তালিকা
        </h2>
        <div className='flex gap-3'>
          <button
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            ফিল্টার
          </button>
          <button
            onClick={() => setIsAddDrawerOpen(true)}
            className='px-4 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            নতুন সার্ভেয়ার যুক্ত করুন
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              {[
                'নাম',
                'মোবাইল',
                'মোট ফর্ম',
                'অনুমোদিত ফর্ম',
                'বাতিল ফর্ম',
                'অ্যাকশন',
              ].map((header) => (
                <th
                  key={header}
                  className='px-6 py-4 text-left text-sm font-medium text-gray-500'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {surveyors.map((surveyor) => (
              <tr key={surveyor.id}>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {surveyor.name}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {surveyor.mobile}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {surveyor.totalForms}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {surveyor.approvedForms}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {surveyor.rejectedForms}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => handleViewDetails(surveyor)}
                      className='px-3 py-1 text-sm bg-[#006747] text-white rounded hover:bg-[#005536] transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      বিস্তারিত
                    </button>
                    <button
                      onClick={() => handleDelete(surveyor.id)}
                      className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      ডিলিট
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='mt-4 flex justify-end'>
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-lg ${
            hasNextPage
              ? 'bg-[#006747] text-white hover:bg-[#005536]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition-colors`}
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          পরবর্তী
        </button>
      </div>

      {/* Add Surveyor Drawer */}
      <AnimatePresence>
        {isAddDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black z-40'
              onClick={() => setIsAddDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className='fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 z-50'
            >
              <div className='flex justify-between items-center mb-6'>
                <h3
                  className='text-xl font-semibold'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  নতুন সার্ভেয়ার
                </h3>
                <button
                  onClick={() => setIsAddDrawerOpen(false)}
                  className='p-2 hover:bg-gray-100 rounded-full'
                >
                  <MdClose className='w-6 h-6' />
                </button>
              </div>

              <form className='space-y-4'>
                {Object.entries(newSurveyor).map(([key, value]) => (
                  <div key={key}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {key === 'name'
                        ? 'নাম'
                        : key === 'mobile'
                        ? 'মোবাইল'
                        : key === 'email'
                        ? 'ইমেইল'
                        : 'পাসওয়ার্ড'}
                    </label>
                    <input
                      type={key === 'password' ? 'password' : 'text'}
                      value={value}
                      onChange={(e) =>
                        setNewSurveyor({
                          ...newSurveyor,
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
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    সার্ভেয়ার যুক্ত করুন
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsAddDrawerOpen(false)}
                    className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    বাতিল করুন
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Details/Edit Drawer */}
      <AnimatePresence>
        {isDetailsDrawerOpen && selectedSurveyor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black z-40'
              onClick={() => {
                setIsDetailsDrawerOpen(false);
                setIsEditMode(false);
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className='fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 z-50'
            >
              <div className='flex justify-between items-center mb-6'>
                <h3
                  className='text-xl font-semibold'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  {isEditMode ? 'সম্পাদনা করুন' : 'বিস্তারিত তথ্য'}
                </h3>
                <button
                  onClick={() => {
                    setIsDetailsDrawerOpen(false);
                    setIsEditMode(false);
                  }}
                  className='p-2 hover:bg-gray-100 rounded-full'
                >
                  <MdClose className='w-6 h-6' />
                </button>
              </div>

              {!isEditMode ? (
                <div className='space-y-6'>
                  {/* Profile Info */}
                  <div className='text-center'>
                    <div className='mb-4'>
                      <Image
                        src={selectedSurveyor.imageUrl}
                        alt={selectedSurveyor.name}
                        width={80}
                        height={80}
                        className='mx-auto rounded-full'
                      />
                    </div>
                    <h4
                      className='text-xl font-medium'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {selectedSurveyor.name}
                    </h4>
                    <p
                      className='text-gray-600'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {selectedSurveyor.mobile}
                    </p>
                    <p
                      className='text-gray-600'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {selectedSurveyor.email}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <p
                        className='text-sm text-gray-600 mb-1'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        মোট সার্ভে
                      </p>
                      <p
                        className='text-2xl font-semibold text-[#006747]'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {selectedSurveyor.totalForms}
                      </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <p
                        className='text-sm text-gray-600 mb-1'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        অনুমোদিত সার্ভে
                      </p>
                      <p
                        className='text-2xl font-semibold text-[#006747]'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {selectedSurveyor.approvedForms}
                      </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <p
                        className='text-sm text-gray-600 mb-1'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        বাতিল সার্ভে
                      </p>
                      <p
                        className='text-2xl font-semibold text-red-500'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {selectedSurveyor.rejectedForms}
                      </p>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <p
                        className='text-sm text-gray-600 mb-1'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        অপেক্ষামান সার্ভে
                      </p>
                      <p
                        className='text-2xl font-semibold text-yellow-500'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {selectedSurveyor.pendingForms}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-3'>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className='flex-1 px-4 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      এডিট করুন
                    </button>
                    <button
                      onClick={() => setIsDetailsDrawerOpen(false)}
                      className='flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              ) : (
                <form className='space-y-4'>
                  <div>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      নতুন ছবি দিন
                    </label>
                    <input
                      type='file'
                      className='w-full p-2 border border-gray-300 rounded-lg'
                    />
                  </div>
                  <div>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      নাম
                    </label>
                    <input
                      type='text'
                      defaultValue={selectedSurveyor.name}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                    />
                  </div>
                  <div>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      ইমেইল
                    </label>
                    <input
                      type='email'
                      defaultValue={selectedSurveyor.email}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                    />
                  </div>
                  <div>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      মোবাইল
                    </label>
                    <input
                      type='text'
                      defaultValue={selectedSurveyor.mobile}
                      className='w-full p-2 border border-gray-300 rounded-lg'
                    />
                  </div>

                  <div className='flex gap-3 mt-6'>
                    <button
                      type='submit'
                      className='flex-1 px-4 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      প্রোফাইল আপডেট করুন
                    </button>
                    <button
                      type='button'
                      onClick={() => setIsEditMode(false)}
                      className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      বাতিল করুন
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
