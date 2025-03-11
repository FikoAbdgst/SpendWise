import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const StatistikTotal = ({ darkMode, totalSaldo, totalPemasukan, totalPengeluaran, expenseCategories, incomeSources }) => {
  const chartData = [
    { name: "Saldo", value: Math.abs(totalSaldo), color: "#8B5CF6" }, // Purple color
    { name: "Pengeluaran", value: Math.abs(totalPengeluaran), color: "#EF4444" }, // Red color
    { name: "Pemasukan", value: Math.abs(totalPemasukan), color: "#F97316" }, // Orange color
  ];

  const filteredChartData = chartData.filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"
            } p-2 md:p-3 shadow-md rounded-md border text-xs md:text-sm`}
        >
          <p className="font-semibold" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>
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
      <div className="w-full flex flex-wrap justify-center items-center gap-2 md:gap-4 px-1 mt-2 md:mt-4">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-1 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className={`${darkMode ? "text-white" : "text-black"} font-medium text-xs truncate max-w-40`}>
              {entry.payload.name}: Rp{Math.abs(entry.payload.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full lg:w-3/5">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"
          } w-full h-full p-3 md:p-5 rounded-xl shadow transition-colors duration-200 flex flex-col`}
      >
        <h2 className={`text-base md:text-lg font-semibold mb-2 md:mb-3 ${darkMode ? "text-white" : "text-black"}`}>
          Statistik Keuangan
        </h2>
        <div className="w-full flex items-center justify-center flex-1">
          <ResponsiveContainer width="100%" height={380} className="mt-2">
            <PieChart>
              <Pie
                data={filteredChartData}
                cx="50%"
                cy="45%"
                innerRadius={90}
                outerRadius={120}
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
                className={`${darkMode ? "text-gray-300" : "text-gray-500"} text-xs md:text-sm font-medium`}
                fill={darkMode ? "#D1D5DB" : "#6B7280"}
              >
                Sisa Saldo
              </text>
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-base md:text-xl font-bold"
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