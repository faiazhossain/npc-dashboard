'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login process
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };
  return (
    <div className='min-h-screen flex lg:flex-row'>
      {/* Left half - Banner Image */}
      <motion.div
        className='hidden lg:block w-full lg:w-1/2 h-64 lg:h-screen relative'
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Background Banner Image */}
        <Image
          src='/Images/left-banner.png'
          alt='Left Banner'
          fill
          className='object-cover'
          priority
        />

        {/* Bangladesh Map Overlay - Center */}
        <motion.div
          className='absolute inset-x-0 flex items-center justify-center'
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        >
          <div className='relative w-32 h-32 lg:w-[380px] lg:h-[580px] opacity-90'>
            <Image
              src='/Images/Bangladesh.png'
              alt='Bangladesh Map'
              fill
              className='object-contain filter brightness-110'
            />
          </div>
        </motion.div>

        {/* Quote Text - Bottom */}
        <motion.div
          className='absolute bottom-4 lg:bottom-8 left-4 lg:left-8 right-4 lg:right-8'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <p
            className='text-white text-center text-sm lg:text-lg xl:text-[36px] font-normal leading-relaxed drop-shadow-lg'
            style={{
              fontFamily: 'Tiro Bangla, serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}
          >
            &ldquo;দেশ গড়ে ওঠে মানুষের কথায়, মানুষের চাওয়ায়&rdquo;
          </p>
        </motion.div>
      </motion.div>

      {/* Right half - Login Form */}
      <motion.div
        className='w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-white'
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className='w-full max-w-md space-y-6 lg:space-y-8'
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {/* NPS Logo */}
          <motion.div
            className='flex justify-center'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          >
            <Image
              src='/Images/nps-logo.png'
              alt='NPS Logo'
              width={150}
              height={60}
              className='object-contain lg:w-[200px] lg:h-[80px]'
            />
          </motion.div>

          {/* Login Form Content */}
          <motion.div
            className='text-center space-y-4 lg:space-y-6'
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          >
            {/* Main Heading */}
            <motion.h1
              className='text-2xl lg:text-32px font-normal text-shadow-lg text-gray-900 leading-[130%] tracking-[-0.02em] px-2'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
            >
              আপনার একাউন্টে লগইন করুন
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className='text-sm lg:text-base text-gray-600 pb-4'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
            >
              ইমেইল ও পাসওয়ার্ড ব্যবহার করে আপনার একাউন্টে প্রবেশ করুন
            </motion.p>

            {/* Login Form */}
            <motion.form
              className='space-y-4 lg:space-y-6 mt-6 lg:mt-8'
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
              onSubmit={handleSubmit}
            >
              {/* Email Field */}
              <motion.div
                className='text-left'
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  ইমেইল
                </label>
                <motion.input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] text-sm lg:text-base transition-all duration-200'
                  placeholder='আপনার ইমেইল প্রবেশ করুন'
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: '0 0 0 3px rgba(0, 103, 71, 0.1)',
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                className='text-left'
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-2'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  পাসওয়ার্ড
                </label>
                <div className='relative'>
                  <motion.input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    className='w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] text-sm lg:text-base transition-all duration-200'
                    placeholder='আপনার পাসওয়ার্ড প্রবেশ করুন'
                    whileFocus={{
                      scale: 1.02,
                      boxShadow: '0 0 0 3px rgba(0, 103, 71, 0.1)',
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <button
                    type='button'
                    onClick={togglePasswordVisibility}
                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? (
                      <FaEye className='h-5 w-5' aria-hidden='true' />
                    ) : (
                      <FaEyeSlash className='h-5 w-5' aria-hidden='true' />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Remember Me Checkbox */}
              <motion.div
                className='flex items-center text-left'
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1, ease: 'easeOut' }}
                whileHover={{ scale: 1.02 }}
              >
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-[#006747] focus:ring-[#006747] border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-700'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  লগইন মনে রাখুন
                </label>
              </motion.div>

              {/* Login Button */}
              <motion.button
                type='submit'
                className='w-full py-3 lg:py-4 px-4 bg-[#006747] text-white font-medium rounded-md hover:bg-[#005536] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006747] transition duration-200 text-sm lg:text-base'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 4px 12px rgba(0, 103, 71, 0.15)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                লগইন করুন
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
