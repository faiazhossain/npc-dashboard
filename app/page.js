"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
        ) : (
          <motion.div
            key='dashboard'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
