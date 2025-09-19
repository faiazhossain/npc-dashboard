'use client';
import { motion } from 'framer-motion';
import {
  MdAdd,
  MdMoreVert,
  MdPeople,
  MdCalendarToday,
  MdTrendingUp,
} from 'react-icons/md';

export default function SurveyContent() {
  const surveys = [
    {
      id: 1,
      title: 'গ্রাহক সন্তুষ্টি জরিপ ২০২৫',
      description: 'আমাদের সেবার মান উন্নয়নের জন্য গ্রাহকদের মতামত নিন',
      participants: 1254,
      status: 'active',
      createdDate: '১৫ জানুয়ারি, ২০২৫',
      responseRate: '৭৮%',
    },
    {
      id: 2,
      title: 'কর্মচারী মতামত জরিপ',
      description: 'কর্মক্ষেত্রের পরিবেশ এবং কর্মচারী সন্তুষ্টি মূল্যায়ন',
      participants: 456,
      status: 'completed',
      createdDate: '১০ জানুয়ারি, ২০২৫',
      responseRate: '৯২%',
    },
    {
      id: 3,
      title: 'পণ্যের গুণমান মূল্যায়ন',
      description: 'নতুন পণ্যের গুণমান সম্পর্কে ব্যবহারকারীদের অভিজ্ঞতা',
      participants: 789,
      status: 'draft',
      createdDate: '৮ জানুয়ারি, ২০২৫',
      responseRate: '০%',
    },
    {
      id: 4,
      title: 'সেবার মান উন্নয়ন জরিপ',
      description: 'গ্রাহক সেবার বিভিন্ন দিক সম্পর্কে বিস্তারিত মতামত',
      participants: 2103,
      status: 'active',
      createdDate: '৫ জানুয়ারি, ২০২৫',
      responseRate: '৬৫%',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'সক্রিয়';
      case 'completed':
        return 'সম্পন্ন';
      case 'draft':
        return 'খসড়া';
      default:
        return 'অজানা';
    }
  };

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      {/* Header */}
      <motion.div
        className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className='mb-4 sm:mb-0'>
          <h1
            className='text-2xl lg:text-3xl font-normal text-gray-900 mb-2'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            সার্ভে তালিকা
          </h1>
          <p
            className='text-gray-600'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            আপনার সমস্ত জরিপ পরিচালনা করুন
          </p>
        </div>
        <motion.button
          className='bg-[#006747] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#005536] transition-colors duration-200'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MdAdd className='w-5 h-5' />
          <span style={{ fontFamily: 'Tiro Bangla, serif' }}>নতুন জরিপ</span>
        </motion.button>
      </motion.div>

      {/* Survey Statistics */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        {[
          {
            title: 'মোট জরিপ',
            value: '২৪',
            color: 'bg-blue-50 text-blue-600',
            icon: MdTrendingUp,
          },
          {
            title: 'সক্রিয় জরিপ',
            value: '৮',
            color: 'bg-green-50 text-green-600',
            icon: MdCalendarToday,
          },
          {
            title: 'মোট অংশগ্রহণকারী',
            value: '৪,৬০২',
            color: 'bg-purple-50 text-purple-600',
            icon: MdPeople,
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              className={`${stat.color} p-6 rounded-xl shadow-sm border border-gray-100`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.3 + index * 0.1,
                ease: 'easeOut',
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p
                    className='text-sm mb-1'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {stat.title}
                  </p>
                  <p
                    className='text-2xl font-bold'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {stat.value}
                  </p>
                </div>
                <IconComponent className='w-8 h-8 opacity-60' />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Survey List */}
      <motion.div
        className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      >
        <div className='px-6 py-4 border-b border-gray-100'>
          <h2
            className='text-lg font-medium text-gray-900'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            সাম্প্রতিক জরিপসমূহ
          </h2>
        </div>

        <div className='divide-y divide-gray-100'>
          {surveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              className='p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer'
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.5 + index * 0.1,
                ease: 'easeOut',
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <h3
                      className='text-lg font-medium text-gray-900 truncate'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {survey.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        survey.status
                      )}`}
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {getStatusText(survey.status)}
                    </span>
                  </div>
                  <p
                    className='text-sm text-gray-600 mb-3'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {survey.description}
                  </p>
                  <div className='flex flex-wrap items-center space-x-6 text-sm text-gray-500'>
                    <div className='flex items-center space-x-1'>
                      <MdPeople className='w-4 h-4' />
                      <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                        {survey.participants.toLocaleString('bn-BD')}{' '}
                        অংশগ্রহণকারী
                      </span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <MdCalendarToday className='w-4 h-4' />
                      <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                        {survey.createdDate}
                      </span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <MdTrendingUp className='w-4 h-4' />
                      <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
                        {survey.responseRate} সাড়া
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  className='p-2 hover:bg-gray-100 rounded-lg ml-4'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdMoreVert className='w-5 h-5 text-gray-400' />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Empty State Message */}
      {surveys.length === 0 && (
        <motion.div
          className='text-center py-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p
            className='text-gray-500 mb-4'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            কোনো জরিপ পাওয়া যায়নি
          </p>
          <motion.button
            className='bg-[#006747] text-white px-6 py-2 rounded-lg hover:bg-[#005536] transition-colors duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
              প্রথম জরিপ তৈরি করুন
            </span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
