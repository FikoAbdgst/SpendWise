import React from "react";
import { AiOutlinePieChart } from "react-icons/ai";
import { IoPieChartSharp } from "react-icons/io5";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const StatistikTotal = ({ darkMode, totalSaldo, totalPemasukan, totalPengeluaran }) => {
  const chartData = [
    { name: "Saldo", value: Math.abs(totalSaldo), color: "#8B5CF6" }, // Purple color
    { name: "Pengeluaran", value: Math.abs(totalPengeluaran), color: "#EF4444" }, // Red color
    { name: "Pemasukan", value: Math.abs(totalPemasukan), color: "#10B981" }, // Orange color
  ];

  const filteredChartData = chartData.filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-black"
          } p-2 md:p-3 shadow-md rounded-md border text-xs md:text-sm`}
        >
          <p className="font-semibold" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            Jumlah:{" "}
            <span className="font-bold tracking-tight">Rp{data.value.toLocaleString("id-ID")}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div className="w-full flex flex-wrap justify-center items-center gap-3 md:gap-5 px-1 mt-3">
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ backgroundColor: `${entry.color}20` }}
          >
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span
              className={`${
                darkMode ? "text-white" : "text-gray-800"
              } font-medium text-xs md:text-sm whitespace-normal`}
            >
              {entry.payload.name}:{" "}
              <span className="font-bold">
                Rp{Math.abs(entry.payload.value).toLocaleString("id-ID")}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full lg:w-3/5">
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } w-full h-full p-3 md:p-5 rounded-xl shadow transition-colors duration-200 flex flex-col`}
      >
        <div
          className={`flex items-center gap-2  mb-2 md:mb-3 ${darkMode ? "text-white" : "text-black"}`}
        >
          <span
            className={`p-2 rounded-lg ${
              darkMode ? "bg-gray-700 text-purple-400" : "bg-purple-100 text-blue-600"
            }`}
          >
            <AiOutlinePieChart className=" w-6 h-6" />
          </span>
          <h2 className={`text-base md:text-xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
            Statistik Keuangan
          </h2>
        </div>
        <div className="w-full flex items-center justify-center flex-1">
          {/* desktop mode */}
          <ResponsiveContainer width="100%" height={380} className="mt-2 hidden md:block ">
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
                y="30%"
                textAnchor="middle"
                dominantBaseline="middle"
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } text-xs md:text-sm font-medium`}
                fill={darkMode ? "#D1D5DB" : "#6B7280"}
              >
                Sisa Saldo
              </text>
              <text
                x="50%"
                y="38%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-base md:text-xl font-bold"
                fill={darkMode ? "#FFFFFF" : "#000000"}
              >
                Rp{Math.abs(totalSaldo).toLocaleString("id-ID")}
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
          {/* mobile mode */}
          <ResponsiveContainer width="100%" height={380} className="mt-2 block md:hidden ">
            <PieChart>
              <Pie
                data={filteredChartData}
                cx="50%"
                cy="45%"
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
                y="27%"
                textAnchor="middle"
                dominantBaseline="middle"
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-500"
                } text-xs md:text-sm font-medium`}
                fill={darkMode ? "#D1D5DB" : "#6B7280"}
              >
                Sisa Saldo
              </text>
              <text
                x="50%"
                y="34%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-base md:text-xl font-bold"
                fill={darkMode ? "#FFFFFF" : "#000000"}
              >
                Rp{Math.abs(totalSaldo).toLocaleString("id-ID")}
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
