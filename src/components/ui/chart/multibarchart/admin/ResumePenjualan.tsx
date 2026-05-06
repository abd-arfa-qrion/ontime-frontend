import { Resume7Hari } from "@/type/Dashboard.type";
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

type Proptype = {
  title: string;
  data: Resume7Hari[];
};

const CustomAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const [hari, tanggal] = payload.value.split("|");

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="end"
        fill="#6b7280"
        transform="rotate(-45)"
        fontSize={11}
      >
        {hari}
      </text>
      <text
        x={0}
        y={15}
        dy={10}
        textAnchor="end"
        fill="#9ca3af"
        transform="rotate(-45)"
        fontSize={10}
      >
        {tanggal}
      </text>
    </g>
  );
};

const ResumePenjualan = ({ title, data }: Proptype) => {
  const formattedData = data.map((item) => ({
    ...item,
    label: `${item.hari}|${item.tanggal}`,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const [hari, tanggal] = label.split("|");

    const hadir = payload.find((p: any) => p.dataKey === "hadir")?.value || 0;
    const tidakHadir =
      payload.find((p: any) => p.dataKey === "tidak_hadir")?.value || 0;

    const total = hadir + tidakHadir;
    const persen = total > 0 ? Math.round((hadir / total) * 100) : 0;

    return (
      <div className="bg-white rounded-xl shadow-lg px-4 py-3 min-w-[160px] border border-gray-100">
        {/* Header */}
        <p className="text-xs text-gray-400">{hari}</p>
        <p className="text-sm font-semibold text-gray-700 mb-2">{tanggal}</p>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-2" />

        {/* Hadir */}
        <div className="flex justify-between items-center mb-1">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Hadir
          </span>
          <span className="font-semibold text-gray-800">{hadir}</span>
        </div>

        {/* Tidak Hadir */}
        <div className="flex justify-between items-center mb-2">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            Tidak Hadir
          </span>
          <span className="font-semibold text-gray-800">{tidakHadir}</span>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg px-2 py-1 text-xs text-gray-600 flex justify-between">
          <span>Total</span>
          <span>{total}</span>
        </div>

        <div className="text-xs text-right text-emerald-600 font-medium mt-1">
          {persen}% hadir
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <p className="text-center font-semibold text-gray-700 mb-2">{title}</p>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
        >
          {/* ✨ Gradient definitions */}
          <defs>
            <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
            </linearGradient>

            <linearGradient id="colorTidakHadir" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={<CustomAxisTick />}
            interval={0}
            height={80}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
          />

          <Legend />

          {/* ✅ Rounded + Gradient */}
          <Bar
            dataKey="hadir"
            fill="url(#colorHadir)"
            radius={[8, 8, 0, 0]}
            barSize={28}
          />

          <Bar
            dataKey="tidak_hadir"
            fill="url(#colorTidakHadir)"
            radius={[8, 8, 0, 0]}
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResumePenjualan;
