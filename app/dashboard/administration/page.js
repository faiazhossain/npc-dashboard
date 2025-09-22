"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Surveyors from "@/components/administrationTab/Surveyors";
import SuperUsers from "@/components/administrationTab/SuperUsers";
import Admins from "@/components/administrationTab/Admins";

export default function Administration() {
  const [activeTab, setActiveTab] = useState("surveyors");

  const tabs = [
    { id: "surveyors", label: "সার্ভেয়ার" },
    { id: "superusers", label: "সুপার ইউজার" },
    { id: "admins", label: "এডমিন" },
  ];

  return (
    <div className='container mx-auto p-6'>
      {/* Breadcrumb */}
      <div className='mb-6'>
        <h1
          className='text-gray-600 text-sm'
          style={{ fontFamily: "Tiro Bangla, serif" }}
        >
          ড্যাশবোর্ড/এডমিনিস্ট্রেশন
        </h1>
      </div>

      {/* Tabs */}
      <div className='mb-8'>
        <div className='border-b border-gray-200'>
          <nav className='flex gap-8'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 relative ${
                  activeTab === tab.id
                    ? "text-[#006747]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span
                  className='text-sm font-medium'
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#006747]'
                    layoutId='activeTab'
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "surveyors" && <Surveyors />}
          {activeTab === "superusers" && <SuperUsers />}
          {activeTab === "admins" && <Admins />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
