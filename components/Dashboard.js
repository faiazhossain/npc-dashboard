'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Image from 'next/image';
import { fadeIn, fadeInUp, slideInLeft } from '../utils/animations';

export default function Dashboard({ onLogout, children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'মাহমুদ হাসান তবীব',
    email: '',
    user_type: 'এডমিন',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const getActiveItem = (path) => {
    if (path.includes('/dashboard/general-questions')) return 'dashboard';
    if (path.includes('/dashboard/surveys')) return 'survey';
    if (path.includes('/dashboard/administration')) return 'administration';
    if (path.includes('/dashboard/candidates')) return 'candidates';
    if (path.includes('/dashboard/seat-distribution')) return 'seats';
    return 'dashboard';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (item) => {
    setIsMobileMenuOpen(false);
    switch (item) {
      case 'dashboard':
        router.push('/dashboard/general-questions');
        break;
      case 'survey':
        router.push('/dashboard/surveys');
        break;
      case 'administration':
        router.push('/dashboard/administration');
        break;
      case 'candidates':
        router.push('/dashboard/candidates');
        break;
      case 'seats':
        router.push('/dashboard/seat-distribution');
        break;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please log in again.');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('https://npsbd.xyz/api/me', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser({
            name: data.name,
            email: data.email,
            user_type:
              data.user_type === 'super_admin' ? 'সুপার এডমিন' : 'এডমিন',
          });
        } else {
          setError('Failed to fetch user data. Please log in again.');
          localStorage.removeItem('access_token');
          router.push('/login');
        }
      } catch (err) {
        setError('An error occurred while fetching user data.');
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
            variants={fadeIn}
            initial='initial'
            animate='animate'
            exit='exit'
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Left Navbar */}
      <Navbar
        activeItem={getActiveItem(pathname)}
        onNavItemClick={handleNavItemClick}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        onLogout={onLogout}
      />

      {/* Right Content Panel */}
      <motion.main
        className='flex-1 lg:ml-[271px] min-h-screen transition-all duration-300 ease-in-out'
        variants={slideInLeft}
        initial='initial'
        animate='animate'
      >
        <motion.div
          variants={fadeInUp}
          initial='initial'
          animate='animate'
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Navbar */}
          <nav className='flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-10'>
            <button
              className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition'
              onClick={() => router.back()}
            >
              Prev
            </button>

            <div className='flex items-center space-x-10'>
              <div className='flex items-center space-x-2'>
                <div className='w-[48px] h-[48px] rounded-full bg-gray-300 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-gray-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 4a4 4 0 100 8 4 4 0 000-8zm0 10c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z'
                    />
                  </svg>
                </div>
                <div className='flex flex-col'>
                  <span
                    className='text-[12px] text-gray-800'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {user.user_type}
                  </span>
                  <span
                    className='text-[16px] font-bold text-gray-600'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {user.name}
                  </span>
                </div>
              </div>
              <button
                className='bg-[#FFEAEA] text-[#DB0000] px-5 py-3 rounded-2xl hover:bg-red-200 hover:text-red-600 transition flex items-center space-x-2 cursor-pointer'
                onClick={() => {
                  localStorage.removeItem('access_token');
                  onLogout();
                }}
              >
                <Image
                  src='/Images/Logout.svg'
                  alt='Logout Icon'
                  width={20}
                  height={20}
                />
                <span style={{ fontFamily: 'Tiro Bangla, serif' }}>লগ আউট</span>
              </button>
            </div>
          </nav>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className='text-red-500 text-sm p-4 text-center'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className='bg-gray-50'>{children}</div>
        </motion.div>
      </motion.main>
    </div>
  );
}
