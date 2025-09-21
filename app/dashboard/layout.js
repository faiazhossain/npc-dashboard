"use client";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  return (
    <div className='dashboard-container'>
      <Dashboard onLogout={handleLogout}>{children}</Dashboard>
    </div>
  );
}
