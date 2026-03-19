import React, { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
import { getAdminDashboardStats, getUserBasedOnDistrict, getPaymentsBasedOnDistrict } from "../../services/admin/adminService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const statsData = await getAdminDashboardStats();
      setStats(statsData);

      const usersData = await getUserBasedOnDistrict();
      setUsers(usersData.users);

      const paymentsData = await getPaymentsBasedOnDistrict();
      setPayments(paymentsData.payments || paymentsData);
    };

    fetchData();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0 },
    { title: "Total Coordinators", value: stats?.totalCoordinators || 0 },
    { title: "Total Payments", value: stats?.totalPayments || 0 },
    { title: "Pending Payments", value: stats?.failedPayments || 0 },
   { title: "Direct Selling Users", value: stats?.totalDirectSellingUsers || 0 },
  { title: "RD Community Users", value: stats?.totalRDUsers || 0 },
  ];

  // Prepare data for charts
  const userRegistrationData = users.reduce((acc: any, user) => {
    const month = new Date(user.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
    const existing = acc.find((item: any) => item.month === month);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, []);

  const paymentRateData = payments.reduce((acc: any, payment) => {
    const month = payment.month;
    const existing = acc.find((item: any) => item.month === month);
    if (existing) {
      payment.status === "paid" ? existing.paid += 1 : existing.pending += 1;
    } else {
      acc.push({ month, paid: payment.status === "paid" ? 1 : 0, pending: payment.status !== "paid" ? 1 : 0 });
    }
    return acc;
  }, []);

  return (
   <div className="space-y-6 px-2 md:px-0">

  {/* Stats Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {statCards.map((stat, index) => (
      <StatCard key={index} title={stat.title} value={stat.value} />
    ))}
  </div>

  {/* Charts */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

    {/* User Registration Trend */}
    <div className="bg-white p-4 md:p-5 rounded shadow h-[280px] sm:h-[320px] md:h-[350px]">
      <h2 className="text-base md:text-lg font-semibold mb-2">
        User Registration Trend
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={userRegistrationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Payment Rate */}
    <div className="bg-white p-4 md:p-5 rounded shadow h-[280px] sm:h-[320px] md:h-[350px]">
      <h2 className="text-base md:text-lg font-semibold mb-2">
        Payment Rate
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={paymentRateData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="paid" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pending" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
</div>
  );
};

export default Dashboard;