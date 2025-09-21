"use client";
import DashboardContent from "@/components/dashboardTab/DashboardContent";
import GeneralQuestions from "@/components/dashboardTab/GeneralQuestions";

export default function GeneralQuestionsPage() {
  return (
    <>
      <DashboardContent />
      <div className='bg-gray-50'>
        <GeneralQuestions />
      </div>
    </>
  );
}
