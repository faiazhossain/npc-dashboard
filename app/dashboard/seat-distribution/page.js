"use client";
import DashboardContent from "@/components/dashboardTab/DashboardContent";
import SeatDistribution from "@/components/dashboardTab/SeatDistribution";

export default function SeatDistributionPage() {
  return (
    <>
      <DashboardContent />
      <div className='bg-gray-50'>
        <SeatDistribution />
      </div>
    </>
  );
}
