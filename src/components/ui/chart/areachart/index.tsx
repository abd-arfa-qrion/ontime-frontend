import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Proptype = {
  title: string;
};
// Data contoh untuk Pendapatan dan Beban
const data = [
  { month: "September", Pendapatan: 3000, Beban: 2000 },
  { month: "Oktober", Pendapatan: 4000, Beban: 2400 },
];

const MyAreaChart = (prop: Proptype) => {
  const { title } = prop;
  return (
    <div>
      {/* Judul Chart */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Pendapatan"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="monotone"
            dataKey="Beban"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MyAreaChart;
