"use client";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      id: "general",
      label: "সাধারণ প্রশ্নাবলি",
      path: "/dashboard/general-questions",
    },
    { id: "candidates", label: "প্রার্থী", path: "/dashboard/candidates" },
    { id: "seats", label: "আসন বিন্যাস", path: "/dashboard/seat-distribution" },
  ];

  const currentTab = tabs.find((tab) => pathname === tab.path)?.id || "general";

  return (
    <div>
      {/* Tabs */}
      <motion.div
        className='mb-2 bg-white'
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <div className='border-b border-gray-200'>
          <nav className='-mb-px flex space-x-8 px-4 pt-6'>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`
                  py-2 px-2 border-b-2 font-medium text-sm transition-colors duration-200
                  ${
                    currentTab === tab.id
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
    </div>
  );
}
