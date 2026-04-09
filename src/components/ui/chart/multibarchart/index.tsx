import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

//type
type Proptype = {
  title: string;
};
// Data contoh untuk Multi Bar Chart
const data = [
  {
    name: "April",
    pendapatan: 4000,
    beban: 2400,
  },
  {
    name: "Mei",
    pendapatan: 3000,
    beban: 1398,
  },
  {
    name: "Juni",
    pendapatan: 12000,
    beban: 8800,
  },
  {
    name: "Juli",
    pendapatan: 6080,
    beban: 3908,
  },
  {
    name: "Agustus",
    pendapatan: 7090,
    beban: 4800,
  },
  {
    name: "September",
    pendapatan: 6390,
    beban: 3800,
  },
  {
    name: "Oktober",
    pendapatan: 8490,
    beban: 4300,
  },
];

const MultiBarChart = (prop: Proptype) => {
  const { title } = prop;
  return (
    <>
      <h2 className="text-center font-bold font-mono">{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pendapatan" fill="#82ca9d" />
          <Bar dataKey="beban" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default MultiBarChart;
