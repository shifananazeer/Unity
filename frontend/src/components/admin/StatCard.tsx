import React from "react";

interface Props {
  title: string;
  value: number;
}

const StatCard: React.FC<Props> = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800 mt-2">{value}</h2>
    </div>
  );
};

export default StatCard;