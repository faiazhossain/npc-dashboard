'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Set auth cookie
    document.cookie = 'auth=true; path=/';
    setIsLoggedIn(true);
    // Redirect to general questions page
    router.push('/dashboard/general-questions');
  };

  const handleLogout = () => {
    // Remove auth cookie
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <main>
      <AnimatePresence mode='wait'>
        {!isLoggedIn ? (
          <motion.div
            key='login'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Login onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
