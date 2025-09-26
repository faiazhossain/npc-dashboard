'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdEdit } from 'react-icons/md';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Adjust the path to where your useAuth hook is defined

export default function Surveyors() {
  const { userId } = useAuth(); // Get userId from useAuth hook
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
  const [error, setError] = useState(null); // State for error handling
  const pageSize = 10;

  // Fetch surveyors from API
  useEffect(() => {
    const fetchSurveyors = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found. Please log in again.');
        }

        const response = await fetch(
          `https://npsbd.xyz/api/users/?user_type=surveyer&page=${currentPage}&page_size=${pageSize}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch surveyors');
        }

        const data = await response.json();

        const mappedSurveyors = data.map((surveyor) => ({
          id: surveyor.id,
          name: surveyor.name,
          mobile: surveyor.phone,
          email: surveyor.email,
          totalForms: surveyor.total_surveys,
          approvedForms: surveyor.accepted_surveys,
          rejectedForms: surveyor.rejected_surveys,
          pendingForms: surveyor.pending_surveys,
          imageUrl: '/default-profile.png',
        }));

        setSurveyors(mappedSurveyors);
        setHasNextPage(data.length === pageSize);
      } catch (error) {
        console.error('Error fetching surveyors:', error);
        setError('Failed to fetch surveyors. Please try again.');
      }
    };

    fetchSurveyors();
  }, [currentPage]);

  // Handle form submission to create a new surveyor
  const handleAddSurveyor = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await fetch('https://npsbd.xyz/api/users/surveyer', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newSurveyor.email,
          name: newSurveyor.name,
          password: newSurveyor.password,
          phone: newSurveyor.mobile,
          user_type: 'surveyer',
          authorized_by: userId || 0, // Use userId from useAuth, fallback to 0 if undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create surveyor');
      }

      const createdSurveyor = await response.json();
      // Add the new surveyor to the state
      setSurveyors([
        ...surveyors,
        {
          id: createdSurveyor.id,
          name: createdSurveyor.name,
          mobile: createdSurveyor.phone,
          email: createdSurveyor.email,
          totalForms: createdSurveyor.total_surveys,
          approvedForms: createdSurveyor.accepted_surveys,
          rejectedForms: createdSurveyor.rejected_surveys,
          pendingForms: createdSurveyor.pending_surveys,
          imageUrl: '/default-profile.png',
        },
      ]);

      // Reset form and close drawer
      setNewSurveyor({ name: '', mobile: '', email: '', password: '' });
      setIsAddDrawerOpen(false);
    } catch (error) {
      console.error('Error creating surveyor:', error);
      setError('Failed to create surveyor. Please try again.');
    }
  };

  const handleViewDetails = (surveyor) => {
    setSelectedSurveyor(surveyor);
    setIsDetailsDrawerOpen(true);
    setIsEditMode(false);
  };

  const handleDeleteSurveyor = (id) => {
    // Show confirmation toast with Yes/No buttons
    toast(
      <div style={{ fontFamily: 'Tiro Bangla, serif' }}>
        <p>আপনি কি নিশ্চিতভাবে এই সার্ভেয়ারকে ডিলিট করতে চান?</p>
        <div className='flex gap-3 mt-3'>
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                  throw new Error(
                    'No access token found. Please log in again.'
                  );
                }

                const response = await fetch(
                  `https://npsbd.xyz/api/users/${id}`,
                  {
                    method: 'DELETE',
                    headers: {
                      accept: '*/*',
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (!response.ok) {
                  throw new Error('Failed to delete surveyor');
                }

                setSurveyors(
                  surveyors.filter((surveyor) => surveyor.id !== id)
                );
                toast.dismiss(); // Dismiss the confirmation toast first
                toast.success('সার্ভেয়ার সফলভাবে ডিলিট করা হয়েছে', {
                  style: { fontFamily: 'Tiro Bangla, serif' },
                  autoClose: 3000, // Auto close after 3 seconds
                });
              } catch (error) {
                console.error('Error deleting surveyor:', error);
                setError('Failed to delete surveyor. Please try again.');
              }
            }}
            className='px-3 py-1 bg-[#006747] text-white rounded hover:bg-[#005536]'
          >
            হ্যাঁ
          </button>
          <button
            onClick={() => toast.dismiss()}
            className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
          >
            না
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        style: { fontFamily: 'Tiro Bangla, serif' },
      }
    );
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div>
      <ToastContainer position='top-center' limit={1} newestOnTop={true} />
      {/* Error Message */}
      {error && (
        <div
          className='mb-4 p-4 bg-red-100 text-red-700 rounded-lg'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {error}
        </div>
      )}

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
                      onClick={() => handleDeleteSurveyor(surveyor.id)}
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

              <form className='space-y-4' onSubmit={handleAddSurveyor}>
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
