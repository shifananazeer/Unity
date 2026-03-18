import React, { useEffect, useState } from "react";
import StatCard from "../../components/superAdmin/StatCard";
import { getCoordinatorDashboardStats } from "../../services/coordinator/CoordinatorService";
const CoordinatorDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getCoordinatorDashboardStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0 },
    { title: "Total Payments", value: stats?.totalPayments || 0 },
    { title: "Direct Selling Community Joiners", value: stats?.directSellingCommunityJoiners || 0 },
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

export default CoordinatorDashboard;