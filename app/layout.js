import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReduxProvider from '../store/ReduxProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'NPS Dashboard',
  description: 'National Policy Studies Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='h-full'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gray-50`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
