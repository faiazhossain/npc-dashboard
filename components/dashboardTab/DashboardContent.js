"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import GeneralQuestions from "./GeneralQuestions";
import Candidates from "./Candidates";
import SeatDistribution from "./SeatDistribution";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "সাধারণ প্রশ্নাবলি" },
    { id: "candidates", label: "প্রার্থী" },
    { id: "seats", label: "আসন বিন্যাস" },
  ];

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      {/* Tabs */}
      <motion.div
        className='mb-2'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8'>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2 px-2 border-b-2 font-medium text-sm transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-[#006747] text-white border-[#006747] rounded-t-2xl"
                      : "border-transparent text-gray-500 hover:text-gray-700 rounded-t-2xl hover:border-gray-300"
                  }
                `}
                style={{ fontFamily: "Tiro Bangla, serif" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {activeTab === "general" && <GeneralQuestions />}
        {activeTab === "candidates" && <Candidates />}
        {activeTab === "seats" && <SeatDistribution />}
      </motion.div>
    </div>
  );
}
