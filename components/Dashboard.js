'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import DashboardContent from './DashboardContent';
import SurveyContent from './SurveyContent';

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
        <AnimatePresence mode='wait'>
          {activeItem === 'dashboard' && (
            <motion.div
              key='dashboard'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
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
