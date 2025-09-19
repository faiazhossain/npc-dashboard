import Image from 'next/image';

export default function Login() {
  return (
    <div className='min-h-screen flex lg:flex-row'>
      {/* Left half - Banner Image */}
      <div className='hidden lg:block w-full lg:w-1/2 h-64 lg:h-screen relative'>
        {/* Background Banner Image */}
        <Image
          src='/Images/left-banner.png'
          alt='Left Banner'
          fill
          className='object-cover'
          priority
        />

        {/* Bangladesh Map Overlay - Center */}
        <div className='absolute inset-x-0 flex items-center justify-center'>
          <div className='relative w-32 h-32 lg:w-[380px] lg:h-[580px] opacity-90'>
            <Image
              src='/Images/Bangladesh.png'
              alt='Bangladesh Map'
              fill
              className='object-contain filter brightness-110'
            />
          </div>
        </div>

        {/* Quote Text - Bottom */}
        <div className='absolute bottom-4 lg:bottom-8 left-4 lg:left-8 right-4 lg:right-8'>
          <p
            className='text-white text-center text-sm lg:text-lg xl:text-[36px] font-normal leading-relaxed drop-shadow-lg'
            style={{
              fontFamily: 'Tiro Bangla, serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}
          >
            &ldquo;দেশ গড়ে ওঠে মানুষের কথায়, মানুষের চাওয়ায়&rdquo;
          </p>
        </div>
      </div>

      {/* Right half - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-white'>
        <div className='w-full max-w-md space-y-6 lg:space-y-8'>
          {/* NPS Logo */}
          <div className='flex justify-center'>
            <Image
              src='/Images/nps-logo.png'
              alt='NPS Logo'
              width={150}
              height={60}
              className='object-contain lg:w-[200px] lg:h-[80px]'
            />
          </div>

          {/* Login Form Content */}
          <div className='text-center space-y-4 lg:space-y-6'>
            {/* Main Heading */}
            <h1
              className='text-2xl lg:text-3xl xl:text-4xl font-normal text-shadow-lg text-gray-900 leading-[130%] tracking-[-0.02em] px-2'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              আপনার একাউন্টে লগইন করুন
            </h1>

            {/* Subtitle */}
            <p
              className='text-sm lg:text-base text-gray-600 px-2'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              ইমেইল ও পাসওয়ার্ড ব্যবহার করে আপনার একাউন্টে প্রবেশ করুন
            </p>

            {/* Login Form */}
            <form className='space-y-4 lg:space-y-6 mt-6 lg:mt-8'>
              {/* Email Field */}
              <div className='text-left'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  ইমেইল
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] text-sm lg:text-base'
                  placeholder='আপনার ইমেইল প্রবেশ করুন'
                />
              </div>

              {/* Password Field */}
              <div className='text-left'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-2'
                  style={{ fontFamily: 'Tiro Bangla, serif' }}
                >
                  পাসওয়ার্ড
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='w-full px-3 py-2 lg:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006747] focus:border-[#006747] text-sm lg:text-base'
                  placeholder='আপনার পাসওয়ার্ড প্রবেশ করুন'
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className='flex items-center text-left'>
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
              </div>

              {/* Login Button */}
              <button
                type='submit'
                className='w-full py-3 lg:py-4 px-4 bg-[#006747] text-white font-medium rounded-md hover:bg-[#005536] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006747] transition duration-200 text-sm lg:text-base'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                লগইন করুন
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
