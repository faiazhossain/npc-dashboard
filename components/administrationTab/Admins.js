'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Admins() {
  const token = localStorage.getItem('access_token');
  const { userId } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });

  const fetchAdmins = useCallback(
    async (page) => {
      try {
        const response = await fetch(
          `https://npsbd.xyz/api/users/?user_type=admin&page=${page}&page_size=${pageSize}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch admins');
        }
        const data = await response.json();
        setAdmins(data);
        setHasNextPage(data.length === pageSize);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to fetch admins. Please try again.');
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage, fetchAdmins]);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      const response = await fetch('https://npsbd.xyz/api/users/', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newAdmin.email,
          name: newAdmin.name,
          password: newAdmin.password,
          phone: newAdmin.phone,
          user_type: 'admin',
          authorized_by: userId || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      const createdAdmin = await response.json();
      setAdmins([
        ...admins,
        {
          id: createdAdmin.id,
          name: createdAdmin.name,
          phone: createdAdmin.phone,
          email: createdAdmin.email,
        },
      ]);

      setNewAdmin({ name: '', phone: '', email: '', password: '' });
      setIsAddDrawerOpen(false);
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('Failed to create admin. Please try again.');
    }
  };

  const handleDeleteAdmin = (id) => {
    // Show confirmation toast with Yes/No buttons
    toast(
      <div style={{ fontFamily: 'Tiro Bangla, serif' }}>
        <p>আপনি কি নিশ্চিতভাবে এই এডমিনকে ডিলিট করতে চান?</p>
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
                  throw new Error('Failed to delete admin');
                }

                setAdmins(admins.filter((admin) => admin.id !== id));
                toast.success('এডমিন সফলভাবে ডিলিট করা হয়েছে', {
                  style: { fontFamily: 'Tiro Bangla, serif' },
                });
              } catch (error) {
                console.error('Error deleting admin:', error);
                setError('Failed to delete admin. Please try again.');
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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <ToastContainer position='top-center' />
      {error && (
        <div
          className='mb-4 p-4 bg-red-100 text-red-700 rounded-lg'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {error}
        </div>
      )}

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
                      onClick={() => handleDeleteAdmin(admin.id)}
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

              <form className='space-y-4' onSubmit={handleAddAdmin}>
                {Object.entries(newAdmin).map(([key, value]) => (
                  <div key={key}>
                    <label
                      className='block text-sm font-medium text-gray-700 mb-1'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {key === 'name'
                        ? 'নাম'
                        : key === 'phone'
                        ? 'মোবাইল'
                        : key === 'email'
                        ? 'ইমেইল'
                        : 'পাসওয়ার্ড'}
                    </label>
                    <input
                      type={
                        key === 'password'
                          ? 'password'
                          : key === 'email'
                          ? 'email'
                          : 'text'
                      }
                      value={value}
                      onChange={(e) =>
                        setNewAdmin({
                          ...newAdmin,
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
