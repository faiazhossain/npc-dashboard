'use client';
import { motion } from 'framer-motion';
import { MdPerson, MdLocationOn, MdGroup } from 'react-icons/md';

export default function Candidates() {
  const candidates = [
    {
      id: 1,
      name: 'আবদুল করিম',
      party: 'আওয়ামী লীগ',
      constituency: 'কুমিল্লা-২',
      votes: '৪৫,২৩৫',
      percentage: '৪২.৫%',
      status: 'নির্বাচিত',
    },
    {
      id: 2,
      name: 'মোহাম্মদ রহিম',
      party: 'বিএনপি',
      constituency: 'কুমিল্লা-২',
      votes: '৩৮,৭৬৫',
      percentage: '৩৬.৪%',
      status: 'পরাজিত',
    },
    {
      id: 3,
      name: 'ফাতেমা খাতুন',
      party: 'জাতীয় পার্টি',
      constituency: 'কুমিল্লা-২',
      votes: '১৫,৪৩২',
      percentage: '১৪.৫%',
      status: 'পরাজিত',
    },
    {
      id: 4,
      name: 'আহমদ আলী',
      party: 'জামায়াতে ইসলামী',
      constituency: 'কুমিল্লা-২',
      votes: '৭,২১৮',
      percentage: '৬.৮%',
      status: 'পরাজিত',
    },
  ];

  const stats = [
    {
      title: 'মোট প্রার্থী',
      value: '১২',
      icon: MdPerson,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'নির্বাচিত প্রার্থী',
      value: '১',
      icon: MdGroup,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'মোট ভোট',
      value: '১,০৬,৬৫০',
      icon: MdLocationOn,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const getStatusColor = (status) => {
    return status === 'নির্বাচিত'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2
          className='text-xl font-medium text-gray-900 mb-2'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          প্রার্থী তথ্য
        </h2>
        <p
          className='text-gray-600'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          কুমিল্লা-২ আসনের প্রার্থীদের বিস্তারিত তথ্য
        </p>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        {stats.map((stat, index) => {
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
                    className='text-sm mb-2'
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

      {/* Candidates List */}
      <motion.div
        className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      >
        <div className='px-6 py-4 border-b border-gray-100'>
          <h3
            className='text-lg font-medium text-gray-900'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            প্রার্থী তালিকা
          </h3>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  প্রার্থীর নাম
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  দল
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  আসন
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  ভোট
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  শতাংশ
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  অবস্থা
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {candidates.map((candidate, index) => (
                <motion.tr
                  key={candidate.id}
                  className='hover:bg-gray-50 transition-colors duration-200'
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + index * 0.1,
                    ease: 'easeOut',
                  }}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
                          <MdPerson className='w-6 h-6 text-gray-600' />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div
                          className='text-sm font-medium text-gray-900'
                          style={{ fontFamily: 'Tiro Bangla, serif' }}
                        >
                          {candidate.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div
                      className='text-sm text-gray-900'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {candidate.party}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div
                      className='text-sm text-gray-900'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {candidate.constituency}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div
                      className='text-sm text-gray-900'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {candidate.votes}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div
                      className='text-sm text-gray-900'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {candidate.percentage}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        candidate.status
                      )}`}
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {candidate.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
