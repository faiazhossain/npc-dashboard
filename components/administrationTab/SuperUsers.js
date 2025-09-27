'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import administrationData from '@/public/json/administration.json';

export default function SuperUsers() {
  const [superUsers, setSuperUsers] = useState([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

  useEffect(() => {
    setSuperUsers(administrationData.superUsers);
  }, []);

  return (
    <div>
      {/* Header with button */}
      <div className='flex justify-between items-center mb-6'>
        <h2
          className='text-xl font-semibold'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          সুপার ইউজার তালিকা
        </h2>
        <button
          onClick={() => setIsAddDrawerOpen(true)}
          className='px-4 py-2 bg-[#006747] text-white rounded-lg hover:bg-[#005536] transition-colors'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          নতুন সুপার ইউজার যুক্ত করুন
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
            {superUsers.map((user) => (
              <tr key={user.id}>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {user.name}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                    {user.mobile}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <span>{user.email}</span>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => {}}
                      className='px-3 py-1 text-sm bg-[#006747] text-white rounded hover:bg-[#005536] transition-colors'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      সংশোধন
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

      {/* Add Super User Drawer */}
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
                  নতুন সুপার ইউজার
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
