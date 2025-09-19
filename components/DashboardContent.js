'use client';
import { motion } from 'framer-motion';
import {
  MdTrendingUp,
  MdPeople,
  MdAssessment,
  MdNotifications,
} from 'react-icons/md';

export default function DashboardContent() {
  const stats = [
    {
      title: 'মোট সার্ভে',
      value: '২৪',
      icon: MdAssessment,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'সক্রিয় ব্যবহারকারী',
      value: '১,২৫৪',
      icon: MdPeople,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'সম্পূর্ণ জরিপ',
      value: '১৮',
      icon: MdTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'নতুন বিজ্ঞপ্তি',
      value: '৭',
      icon: MdNotifications,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const recentActivities = [
    {
      title: 'নতুন জরিপ তৈরি হয়েছে',
      description: 'গ্রাহক সন্তুষ্টি জরিপ ২০২৫',
      time: '২ ঘন্টা আগে',
      type: 'success',
    },
    {
      title: 'জরিপ সম্পন্ন হয়েছে',
      description: 'কর্মচারী মতামত জরিপ',
      time: '৫ ঘন্টা আগে',
      type: 'info',
    },
    {
      title: 'নতুন ব্যবহারকারী নিবন্ধিত',
      description: '১৫ জন নতুন ব্যবহারকারী যোগ দিয়েছেন',
      time: '১ দিন আগে',
      type: 'warning',
    },
  ];

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      {/* Header */}
      <motion.div
        className='mb-8'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1
          className='text-2xl lg:text-3xl font-normal text-gray-900 mb-2'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          ড্যাশবোর্ড
        </h1>
        <p
          className='text-gray-600'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          আপনার এনপিএস কার্যক্রমের সংক্ষিপ্ত বিবরণ
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              className={`${stat.bgColor} p-6 rounded-xl shadow-sm border border-gray-100`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.3 + index * 0.1,
                ease: 'easeOut',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p
                    className={`text-sm ${stat.textColor} mb-1`}
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold ${stat.textColor}`}
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className='w-6 h-6 text-white' />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
        {/* Recent Activities */}
        <motion.div
          className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <h2
            className='text-lg font-medium text-gray-900 mb-4'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            সাম্প্রতিক কার্যক্রম
          </h2>
          <div className='space-y-4'>
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                className='flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.5 + index * 0.1,
                  ease: 'easeOut',
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div
                  className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${
                    activity.type === 'success'
                      ? 'bg-green-500'
                      : activity.type === 'info'
                      ? 'bg-blue-500'
                      : 'bg-orange-500'
                  }
                `}
                />
                <div className='flex-1'>
                  <p
                    className='text-sm font-medium text-gray-900'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {activity.title}
                  </p>
                  <p
                    className='text-xs text-gray-600 mt-1'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {activity.description}
                  </p>
                  <p
                    className='text-xs text-gray-500 mt-1'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        >
          <h2
            className='text-lg font-medium text-gray-900 mb-4'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            দ্রুত কার্যক্রম
          </h2>
          <div className='space-y-3'>
            {[
              'নতুন জরিপ তৈরি করুন',
              'জরিপের ফলাফল দেখুন',
              'ব্যবহারকারী পরিচালনা',
              'রিপোর্ট ডাউনলোড করুন',
            ].map((action, index) => (
              <motion.button
                key={index}
                className='w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#006747] hover:bg-green-50 transition-all duration-200'
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.6 + index * 0.1,
                  ease: 'easeOut',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span
                  className='text-sm text-gray-700 hover:text-[#006747]'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  {action}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
