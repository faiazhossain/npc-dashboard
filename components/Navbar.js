'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MdDashboard, MdList, MdMenu, MdClose, MdLogout } from 'react-icons/md';
import { FaAddressCard } from 'react-icons/fa';
import {
  fadeIn,
  fadeInUp,
  slideInLeft,
  hoverScale,
  tapScale,
  staggerChildren,
} from '../utils/animations';

export default function Navbar({
  activeItem,
  onNavItemClick,
  isMobileMenuOpen,
  toggleMobileMenu,
  onLogout,
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'ড্যাশবোর্ড',
      icon: MdDashboard,
    },
    {
      id: 'survey',
      label: 'সার্ভে সমূহ',
      icon: MdList,
    },
    {
      id: 'administration',
      label: 'এডমিনিস্ট্রেশন',
      icon: FaAddressCard,
    },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <motion.button
        className='fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden'
        onClick={toggleMobileMenu}
        variants={fadeIn}
        initial='initial'
        animate='animate'
        whileHover={hoverScale}
        whileTap={tapScale}
      >
        {isMobileMenuOpen ? (
          <MdClose className='w-6 h-6 text-gray-700' />
        ) : (
          <MdMenu className='w-6 h-6 text-gray-700' />
        )}
      </motion.button>

      {/* Navbar */}
      <motion.nav
        className={`
          fixed top-0 left-0 h-full w-[271px] bg-white shadow-lg z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        variants={slideInLeft}
        initial='initial'
        animate='animate'
      >
        <div className='flex flex-col h-full'>
          {/* Logo Section */}
          <motion.div
            className='flex justify-center items-center py-6 px-4 border-b border-gray-100'
            variants={fadeInUp}
            initial='initial'
            animate='animate'
            transition={{ delay: 0.2 }}
          >
            <Image
              src='/Images/nps-logo.png'
              alt='NPS Logo'
              width={104}
              height={32}
              className='object-contain'
              priority
            />
          </motion.div>

          {/* Navigation Items */}
          <motion.div className='flex-1 py-6' variants={staggerChildren}>
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeItem === item.id;

              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  initial='initial'
                  animate='animate'
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <motion.button
                    className={`
                      w-full flex items-center px-6 py-3 text-left transition-all duration-200 cursor-pointer
                      ${
                        isActive
                          ? ' text-[#006747] border-r-4 border-[#006747] bg-green-100 hover:bg-green-200'
                          : 'text-gray-700 hover:bg-green-50'
                      }
                    `}
                    onClick={() => onNavItemClick(item.id)}
                    whileHover={hoverScale}
                    whileTap={tapScale}
                  >
                    <IconComponent
                      className={`
                        w-5 h-5 mr-3 transition-colors duration-200
                        ${isActive ? 'text-[#006747]' : 'text-gray-500'}
                      `}
                    />
                    <span
                      className={` 
                         caret-transparent text-sm font-normal transition-colors duration-200
                        ${
                          isActive
                            ? 'text-[#006747] font-medium'
                            : 'text-gray-700'
                        }
                      `}
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer or Additional Content */}
          <motion.div
            className='p-4 border-t border-gray-100 space-y-3'
            variants={fadeInUp}
            initial='initial'
            animate='animate'
            transition={{ delay: 0.6 }}
          >
            {/* Logout Button */}
            <motion.button
              onClick={onLogout}
              className='w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200'
              whileHover={hoverScale}
              whileTap={tapScale}
            >
              <MdLogout className='w-5 h-5 mr-3' />
              <span
                className='text-sm'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                লগআউট
              </span>
            </motion.button>

            <div
              className='text-xs text-gray-500 text-center'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              এনপিএস ড্যাশবোর্ড
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
