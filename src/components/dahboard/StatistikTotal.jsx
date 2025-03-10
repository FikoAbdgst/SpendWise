import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const StatistikTotal = ({ darkMode, totalSaldo, totalPemasukan, totalPengeluaran }) => {
  const chartData = [
    { name: "Saldo", value: Math.abs(totalSaldo), color: "#8B5CF6" }, // Warna ungu
    { name: "Pengeluaran", value: Math.abs(totalPengeluaran), color: "#EF4444" }, // Warna merah
    { name: "Pemasukan", value: Math.abs(totalPemasukan), color: "#F97316" }, // Warna oranye
  ];

  const filteredChartData = chartData.filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"
            } p-3 shadow-md rounded-md border`}
        >
          <p className="font-semibold text-sm" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className={`${darkMode ? "text-gray-200" : "text-gray-800"} text-sm`}>
            Amount: <span className="font-bold tracking-tight">Rp.{data.value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center items-center flex-col md:flex-row gap-1 md:gap-8  ">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center   gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className={`${darkMode ? "text-white" : "text-black"} font-medium text-xs md:text-sm`}>
              {entry.payload.name}: Rp{Math.abs(entry.payload.value).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Debugging untuk melihat nilai-nilai
  console.log("Chart Data:", chartData);
  console.log("Filtered Chart Data:", filteredChartData);

  return (
    <div className="w-full lg:w-[60%] ">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"
          } w-full h-full p-5 rounded-xl shadow transition-colors duration-200`}
      >
        <h2 className={`text-lg font-semibold mb-3 ${darkMode ? "text-white" : "text-black"}`}>
          Statistik Keuangan
        </h2>
        <div className="w-full h-[calc(100%-40px)] flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredChartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                dataKey="value"
                stroke="none"
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {filteredChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text
                x="50%"
                y="37%"
                textAnchor="middle"
                dominantBaseline="middle"
                className={`${darkMode ? "text-gray-300" : "text-gray-500"} text-sm font-medium`}
                fill={darkMode ? "#D1D5DB" : "#6B7280"}
              >
                Sisa Saldo
              </text>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold"
                fill={darkMode ? "#FFFFFF" : "#000000"}
              >
                Rp{Math.abs(totalSaldo).toLocaleString()}
              </text>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={<CustomLegend />}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatistikTotal;
