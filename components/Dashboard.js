'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import DashboardContent from './DashboardContent';
import SurveyContent from './SurveyContent';
import Image from 'next/image';

export default function Dashboard({ onLogout }) {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (item) => {
    setActiveItem(item);
    setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
  };

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Left Navbar */}
      <Navbar
        activeItem={activeItem}
        onNavItemClick={handleNavItemClick}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        onLogout={onLogout}
      />

      {/* Right Content Panel */}
      <motion.main
        className='flex-1 lg:ml-[271px] transition-all duration-300 ease-in-out'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Navbar */}
        <nav className='flex items-center justify-between bg-white p-4 shadow-md sticky top-0 z-10'>
          {/* Left: Prev Button */}
          <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition'>
            Prev
          </button>

          {/* Right: Profile Section and Logout Button */}
          <div className='flex items-center space-x-10'>
            {/* Profile Card */}
            <div className='flex items-center space-x-2'>
              {/* Profile Icon */}
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
              {/* Profile Text */}
              <div className='flex flex-col'>
                <span className='text-[12px] text-gray-800'>এডমিন</span>
                <span className='text-[16px] font-bold text-gray-600'>
                  মাহমুদ হাসান তবীব
                </span>
              </div>
            </div>
            {/* Logout Button */}
            <button
              className='bg-[#FFEAEA] text-[#DB0000] px-5 py-3 rounded-2xl hover:bg-red-200 hover:text-red-600 transition flex items-center space-x-2 cursor-pointer'
              onClick={onLogout}
            >
              <Image
                src='/Images/Logout.svg'
                alt='Logout Icon'
                width={20}
                height={20}
              />
              <span>লগ আউট</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <AnimatePresence mode='wait'>
          {activeItem === 'dashboard' && (
            <motion.div
              key='dashboard'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className='bg-gray-100'
            >
              <DashboardContent />
            </motion.div>
          )}
          {activeItem === 'survey' && (
            <motion.div
              key='survey'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <SurveyContent />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
