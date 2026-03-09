import React, { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import { getDashboardStats } from "../../services/superAdmin/authService";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0 },
    { title: "Total Admins", value: stats?.totalAdmins || 0 },
    { title: "Total Coordinators", value: stats?.totalCoordinators || 0 },
    { title: "Total Payments", value: stats?.totalPayments || 0 },
    { title: "Pending Payments", value: stats?.pendingPayments || 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

export default SuperAdminDashboard;