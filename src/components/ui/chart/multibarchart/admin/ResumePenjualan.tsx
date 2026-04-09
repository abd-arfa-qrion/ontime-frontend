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
  data: { tanggal: string; jumlah: number }[];
};
const CustomAxisTick = (props: any) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={5}
        y={5}
        dy={5}
        textAnchor="end"
        fill="#666"
        transform="rotate(-45)"
        fontSize={10}
      >
        {payload.value}
      </text>
    </g>
  );
};

const ResumePenjualan = (prop: Proptype) => {
  const { title, data } = prop;
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
          <XAxis
            dataKey="tanggal"
            tick={<CustomAxisTick />} // angle untuk rotasi, fontSize bisa disesuaikan
            interval={0} // tampilkan semua tanggal
            height={60} // beri ruang untuk tick yang miring
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="jumlah" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default ResumePenjualan;
