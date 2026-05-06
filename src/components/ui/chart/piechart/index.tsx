"use client";

import { Resume7HariTidakhadir } from "@/type/Dashboard.type";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#845EC2"];

type Props = {
  data: Resume7HariTidakhadir[];
  title: string;
  width?: string;
  height?: string;
};

const formatDataToPercent = (data: any[]) => {
  const totalAll = data.reduce((sum, item) => sum + item.total, 0);

  return data.map((item) => ({
    name: item.keterangan,
    value: item.total,
    percent: totalAll === 0 ? 0 : (item.total / totalAll) * 100,
  }));
};

// ✅ Custom Tooltip biar tidak kepotong
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-2 border rounded shadow text-xs">
        <p className="font-semibold">{data.name}</p>
        <p>Total: {data.value}</p>
        <p>{data.percent.toFixed(0)}%</p>
      </div>
    );
  }

  return null;
};

const PieTidakHadir = (props: Props) => {
  const { data, title, width, height } = props;
  const chartData = formatDataToPercent(data);

  return (
    <div className="w-full h-[320px] overflow-visible">
      <p className="mb-2 font-semibold">
        {title}{" "}
        <span className="text-xs text-gray-400 font-light">
          (7 Hari Terakhir)
        </span>
      </p>

      <ResponsiveContainer width={width || "100%"} height={height || "100%"}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label={({ name, percent }) => `${name} (${percent.toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          {/* ✅ Tooltip aman */}
          <Tooltip
            content={<CustomTooltip />}
            allowEscapeViewBox={{ x: false, y: false }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieTidakHadir;
