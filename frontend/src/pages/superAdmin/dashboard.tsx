import React, { useEffect, useState } from "react";
import StatCard from "../../components/superAdmin/StatCard";
import { getDashboardStats, getUsers } from "../../services/superAdmin/authService";
import { getPayments } from "../../services/superAdmin/paymentService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from "recharts";

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const statsData = await getDashboardStats();
      setStats(statsData);

      const usersData = await getUsers();
      setUsers(usersData.users || usersData);

      const paymentsData = await getPayments();
      setPayments(paymentsData.payments || paymentsData);
    };

    fetchData();
  }, []);

  const statCards = [
    { title: "Total Members", value: stats?.totalUsers || 0 },
    { title: "Total Admins", value: stats?.totalAdmins || 0 },
    { title: "Total Coordinators", value: stats?.totalCoordinators || 0 },
    { title: "Total Payments", value: stats?.totalPayments || 0 },
      { title: "Direct Selling Users", value: stats?.totalDirectSellingUsers || 0 },
  { title: "RD Community Users", value: stats?.totalRDUsers || 0 },
  ];

  // Prepare chart data
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* Two Graphs Side by Side */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  {/* User Registration Trend */}
  <div className="bg-white p-4 rounded shadow h-[280px] sm:h-[320px] md:h-[350px]">
    <h2 className="text-base sm:text-lg font-semibold mb-2">
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
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Payment Rate */}
  <div className="bg-white p-4 rounded shadow h-[280px] sm:h-[320px] md:h-[350px]">
    <h2 className="text-base sm:text-lg font-semibold mb-2">
      Payment Rate
    </h2>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={paymentRateData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="paid" fill="#82ca9d" />
        <Bar dataKey="pending" fill="#ff6b6b" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
};

export default SuperAdminDashboard;