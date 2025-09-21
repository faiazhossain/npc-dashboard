"use client";
import DashboardContent from "@/components/dashboardTab/DashboardContent";
import Candidates from "@/components/dashboardTab/Candidates";

export default function CandidatesPage() {
  return (
    <>
      <DashboardContent />
      <div className='bg-gray-50'>
        <Candidates />
      </div>
    </>
  );
}
