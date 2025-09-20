'use client';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export default function SeatDistribution() {
  const seatDistributionData = [
    { name: 'আওয়ামী লীগ', seats: 152, color: '#006747' },
    { name: 'বিএনপি', seats: 86, color: '#00A86B' },
    { name: 'জাতীয় পার্টি', seats: 45, color: '#2ECC71' },
    { name: 'জামায়াতে ইসলামী', seats: 28, color: '#58D68D' },
    { name: 'স্বতন্ত্র', seats: 35, color: '#82E0AA' },
    { name: 'অন্যান্য', seats: 4, color: '#A9DFBF' },
  ];

  const divisionWiseSeats = [
    { division: 'ঢাকা', awami: 25, bnp: 15, jp: 8, jamat: 5, independent: 7 },
    {
      division: 'চট্টগ্রাম',
      awami: 20,
      bnp: 18,
      jp: 6,
      jamat: 4,
      independent: 2,
    },
    {
      division: 'রাজশাহী',
      awami: 22,
      bnp: 12,
      jp: 8,
      jamat: 6,
      independent: 2,
    },
    { division: 'খুলনা', awami: 18, bnp: 8, jp: 5, jamat: 3, independent: 6 },
    { division: 'বরিশাল', awami: 15, bnp: 10, jp: 4, jamat: 2, independent: 3 },
    { division: 'সিলেট', awami: 12, bnp: 8, jp: 6, jamat: 4, independent: 4 },
    { division: 'রংপুর', awami: 20, bnp: 9, jp: 5, jamat: 2, independent: 8 },
    {
      division: 'ময়মনসিংহ',
      awami: 20,
      bnp: 6,
      jp: 3,
      jamat: 2,
      independent: 3,
    },
  ];

  const totalSeats = 350;
  const majoritySeats = 176;

  const COLORS = [
    '#006747',
    '#00A86B',
    '#2ECC71',
    '#58D68D',
    '#82E0AA',
    '#A9DFBF',
  ];

  const pieData = seatDistributionData.map((item) => ({
    name: item.name,
    value: item.seats,
    color: item.color,
  }));

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
          আসন বিন্যাস
        </h2>
        <p
          className='text-gray-600'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          জাতীয় সংসদে দলীয় আসন বিতরণ
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-3 gap-6'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        <motion.div
          className='bg-blue-50 text-blue-600 p-6 rounded-xl shadow-sm border border-gray-100'
          whileHover={{ scale: 1.02 }}
        >
          <h3
            className='text-sm mb-2'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            মোট আসন
          </h3>
          <p
            className='text-2xl font-bold'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            {totalSeats.toLocaleString('bn-BD')}
          </p>
        </motion.div>

        <motion.div
          className='bg-green-50 text-green-600 p-6 rounded-xl shadow-sm border border-gray-100'
          whileHover={{ scale: 1.02 }}
        >
          <h3
            className='text-sm mb-2'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            সংখ্যাগরিষ্ঠতার জন্য প্রয়োজন
          </h3>
          <p
            className='text-2xl font-bold'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            {majoritySeats.toLocaleString('bn-BD')}
          </p>
        </motion.div>

        <motion.div
          className='bg-purple-50 text-purple-600 p-6 rounded-xl shadow-sm border border-gray-100'
          whileHover={{ scale: 1.02 }}
        >
          <h3
            className='text-sm mb-2'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            বিজয়ী দল
          </h3>
          <p
            className='text-2xl font-bold'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            আওয়ামী লীগ
          </p>
        </motion.div>
      </motion.div>

      {/* Seat Distribution Pie Chart */}
      <motion.div
        className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      >
        <h3
          className='text-lg font-medium text-gray-900 mb-6'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          দলীয় আসন বিতরণ
        </h3>
        <div className='h-96'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${percent.toFixed(1)}%)`
                }
                outerRadius={120}
                fill='#8884d8'
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} আসন`, 'আসন সংখ্যা']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Detailed Seat List */}
      <motion.div
        className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
      >
        <div className='px-6 py-4 border-b border-gray-100'>
          <h3
            className='text-lg font-medium text-gray-900'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            বিস্তারিত আসন তালিকা
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
                  দলের নাম
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  আসন সংখ্যা
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
                  অবস্থান
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {seatDistributionData
                .sort((a, b) => b.seats - a.seats)
                .map((party, index) => (
                  <motion.tr
                    key={party.name}
                    className='hover:bg-gray-50 transition-colors duration-200'
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.6 + index * 0.1,
                      ease: 'easeOut',
                    }}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div
                          className='w-4 h-4 rounded mr-3'
                          style={{ backgroundColor: party.color }}
                        ></div>
                        <div
                          className='text-sm font-medium text-gray-900'
                          style={{ fontFamily: 'Tiro Bangla, serif' }}
                        >
                          {party.name}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className='text-sm text-gray-900 font-medium'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {party.seats.toLocaleString('bn-BD')}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className='text-sm text-gray-900'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {((party.seats / totalSeats) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          index === 0
                            ? 'bg-green-100 text-green-800'
                            : party.seats >= majoritySeats
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {index === 0
                          ? 'সরকার গঠনকারী'
                          : party.seats >= majoritySeats
                          ? 'সংখ্যাগরিষ্ঠ'
                          : 'বিরোধী'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Division-wise Distribution */}
      <motion.div
        className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
      >
        <h3
          className='text-lg font-medium text-gray-900 mb-6'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          বিভাগ অনুযায়ী আসন বিতরণ
        </h3>
        <div className='h-96'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={divisionWiseSeats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='division' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='awami'
                stackId='a'
                fill='#006747'
                name='আওয়ামী লীগ'
              />
              <Bar dataKey='bnp' stackId='a' fill='#00A86B' name='বিএনপি' />
              <Bar
                dataKey='jp'
                stackId='a'
                fill='#2ECC71'
                name='জাতীয় পার্টি'
              />
              <Bar dataKey='jamat' stackId='a' fill='#58D68D' name='জামায়াত' />
              <Bar
                dataKey='independent'
                stackId='a'
                fill='#82E0AA'
                name='স্বতন্ত্র'
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
