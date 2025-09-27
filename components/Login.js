'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  fadeInUp,
  fadeIn,
  scale,
  slideInLeft,
  slideInRight,
  hoverScale,
  tapScale,
} from '../utils/animations';

export default function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://npsbd.xyz/api/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: email,
          password: password,
          scope: '',
          client_id: 'string',
          client_secret: '********',
        }).toString(),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Check if user_type is one of the allowed types
        const allowedUserTypes = ['mpuser', 'admin', 'super_admin'];
        if (allowedUserTypes.includes(data.user_type)) {
          // Store token and proceed with login
          localStorage.setItem('access_token', data.access_token);
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          // Set error if user_type is not allowed
          setError('আপনার লগইন করার অনুমতি নেই।');
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex lg:flex-row'>
      {/* Left half - Banner Image */}
      <motion.div
        className='hidden lg:block w-full lg:w-1/2 h-64 lg:h-screen relative'
        variants={slideInLeft}
        initial='initial'
        animate='animate'
      >
        <Image
          src='/Images/left-banner.png'
          alt='Left Banner'
          fill
          className='object-cover'
          priority
        />
        <motion.div
          className='absolute inset-x-0 flex items-center justify-center'
          variants={scale}
          initial='initial'
          animate='animate'
          transition={{ delay: 0.3 }}
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
        <motion.div
          className='absolute bottom-4 lg:bottom-8 left-4 lg:left-8 right-4 lg:right-8'
          variants={fadeInUp}
          initial='initial'
          animate='animate'
          transition={{ delay: 0.6 }}
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
        variants={slideInRight}
        initial='initial'
        animate='animate'
      >
        <motion.div
          className='w-full max-w-md space-y-6 lg:space-y-8'
          variants={fadeInUp}
          initial='initial'
          animate='animate'
          transition={{ delay: 0.2 }}
        >
          {/* NPS Logo */}
          <motion.div
            className='flex justify-center'
            variants={scale}
            initial='initial'
            animate='animate'
            transition={{ delay: 0.4 }}
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
            variants={fadeInUp}
            initial='initial'
            animate='animate'
            transition={{ delay: 0.5 }}
          >
            <motion.h1
              className='text-2xl lg:text-32px font-normal text-shadow-lg text-gray-900 leading-[130%] tracking-[-0.02em] px-2'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              variants={fadeInUp}
              initial='initial'
              animate='animate'
              transition={{ delay: 0.6 }}
            >
              আপনার একাউন্টে লগইন করুন
            </motion.h1>
            <motion.p
              className='text-sm lg:text-base text-gray-600 pb-4'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
              variants={fadeInUp}
              initial='initial'
              animate='animate'
              transition={{ delay: 0.7 }}
            >
              ইমেইল ও পাসওয়ার্ড ব্যবহার করে আপনার একাউন্টে প্রবেশ করুন
            </motion.p>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className='text-red-500 text-sm'
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

            {/* Login Form */}
            <motion.form
              className='space-y-4 lg:space-y-6 mt-6 lg:mt-8'
              variants={fadeInUp}
              initial='initial'
              animate='animate'
              transition={{ delay: 0.8 }}
              onSubmit={handleSubmit}
            >
              {/* Email Field */}
              <motion.div
                className='text-left'
                variants={slideInLeft}
                whileHover={hoverScale}
                whileTap={tapScale}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                variants={slideInLeft}
                whileHover={hoverScale}
                whileTap={tapScale}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                variants={slideInLeft}
                whileHover={hoverScale}
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
                disabled={isLoading}
                className={`w-full py-3 lg:py-4 px-4 bg-[#006747] text-white font-medium rounded-md hover:bg-[#005536] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006747] transition duration-200 text-sm lg:text-base ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                style={{ fontFamily: 'Tiro Bangla, serif' }}
                variants={fadeInUp}
                whileHover={isLoading ? {} : hoverScale}
                whileTap={isLoading ? {} : tapScale}
              >
                {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
