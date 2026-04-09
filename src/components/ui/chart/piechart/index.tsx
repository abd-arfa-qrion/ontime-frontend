import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Proptype = {
  title: string;
  width: string;
  height: number;
  data: { name: string; value: number }[];
};

// Warna-warna untuk setiap bagian pie
const COLORS = ["#FF8042", "#00C49F", "#FFBB28"];

const MyPieChart = (prop: Proptype) => {
  const { title, width, height, data } = prop;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl">
        <ResponsiveContainer width={width} height={height}>
          <PieChart margin={{ top: 20, right: 0, left: 20, bottom: 20 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%" // Posisi horizontal ditengah
              cy="50%" // Posisi vertikal ditengah
              innerRadius={40}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={5}
              label
            >
              {data.map((dt, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{
                paddingLeft: 5,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MyPieChart;
