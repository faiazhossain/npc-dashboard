'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchAdmins = async (page) => {
    try {
      const response = await fetch(
        `https://npsbd.xyz/api/users/?user_type=admin&page=${page}&page_size=${pageSize}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlcmFkbWluQGV4YW1wbGUuY29tIiwiZXhwIjoxNzYwMTUzMjk0fQ.QdT_7rCvOt2BqbxerRQHB2y5OcHeshDCfq9prGaOon4',
          },
        }
      );
      const data = await response.json();
      setAdmins(data);
      // Disable next button if fewer than pageSize items are returned
      setHasNextPage(data.length === pageSize);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      {/* Header with button */}
      <div className='flex justify-between items-center mb-6'>
        <h2
          className='text-xl font-semibold'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          এডমিন তালিকা
        </h2>
        <button
          onClick={() => setIsAddDrawerOpen(true)}
          className='px-4 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          নতুন এডমিন যুক্ত করুন
        </button>
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              {['নাম', 'মোবাইল', 'ইমেইল', 'অ্যাকশন'].map((header) => (
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
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {admin.name}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {admin.phone}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span>{admin.email}</span>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => {}}
                      className='px-3 py-1 text-sm bg-[#006747] text-white rounded hover:bg-[#005536] transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      সম্পাদনা
                    </button>
                    <button
                      onClick={() => {}}
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

      {/* Pagination Controls */}
      <div className='flex justify-between items-center mt-4'>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#006747] text-white hover:bg-[#005536]'
          }`}
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          পূর্ববর্তী
        </button>
        <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
          পৃষ্ঠা {currentPage}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-lg ${
            !hasNextPage
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#006747] text-white hover:bg-[#005536]'
          }`}
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          পরবর্তী
        </button>
      </div>

      {/* Add Admin Drawer */}
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
                  নতুন এডমিন
                </h3>
                <button
                  onClick={() => setIsAddDrawerOpen(false)}
                  className='p-2 hover:bg-gray-100 rounded-full'
                >
                  <MdClose className='w-6 h-6' />
                </button>
              </div>

              <form className='space-y-4'>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    নাম
                  </label>
                  <input
                    type='text'
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
                    className='w-full p-2 border border-gray-300 rounded-lg'
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    পাসওয়ার্ড
                  </label>
                  <input
                    type='password'
                    className='w-full p-2 border border-gray-300 rounded-lg'
                  />
                </div>

                <div className='flex gap-3 mt-6'>
                  <button
                    type='submit'
                    className='flex-1 px-4 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    যুক্ত করুন
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
    </div>
  );
}
