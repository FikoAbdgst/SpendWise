import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

const MonthlyBalanceChart = ({ darkMode, monthlyData }) => {
  const [period, setPeriod] = useState("monthly");
  const [dataType, setDataType] = useState("all");
  const [chartData, setChartData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Refs for dropdown menus to handle clickOutside
  const periodDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch data based on selected period
  useEffect(() => {
    const fetchPeriodData = async () => {
      try {
        const token = localStorage.getItem("token");
        let endpoint = "";

        // Determine API endpoint based on selected period
        switch (period) {
          case "daily":
            endpoint = "/api/transactions/daily";
            break;
          case "weekly":
            endpoint = "/api/transactions/weekly";
            break;
          case "monthly":
            endpoint = "/api/transactions/monthly";
            break;
          default:
            endpoint = "/api/transactions/monthly";
        }

        const response = await fetch(`${apiUrl}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.success) {
          setChartData(formatChartData(result.data, period));
        } else {
          console.error(`Error fetching ${period} data:`, result.message);
          // Provide fallback data if API call fails
          setChartData(formatChartData(getDummyData(period), period));
        }
      } catch (error) {
        console.error(`Error fetching ${period} data:`, error);
        // Provide fallback data if API call fails
        setChartData(formatChartData(getDummyData(period), period));
      }
    };

    // Use monthlyData if period is monthly and data is already available
    if (period === "monthly" && monthlyData && monthlyData.length > 0) {
      setChartData(formatChartData(monthlyData, period));
    } else {
      fetchPeriodData();
    }
  }, [period, monthlyData]);

  // Handle clicks outside the dropdown menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format data based on period type
  const formatChartData = (data, periodType) => {
    if (!data || data.length === 0) return [];

    switch (periodType) {
      case "daily":
        return data.map((item) => ({
          name: new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
          income: item.income,
          expenses: item.expenses,
          balance: item.balance,
        }));
      case "weekly":
        return data.map((item, index) => ({
          name: `Minggu ${index + 1}`,
          income: item.income,
          expenses: item.expenses,
          balance: item.balance,
        }));
      case "monthly":
        return data.map((item) => ({
          name: new Date(item.month).toLocaleDateString("id-ID", { month: "short" }),
          income: item.income,
          expenses: item.expenses,
          balance: item.balance,
        }));
      default:
        return data;
    }
  };

  // Generate dummy data for fallback
  const getDummyData = (periodType) => {
    const today = new Date();
    const dummyData = [];

    switch (periodType) {
      case "daily":
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dummyData.push({
            date,
            income: Math.round(Math.random() * 1000000),
            expenses: Math.round(Math.random() * 800000),
            balance: 0, // Will be calculated below
          });
        }
        break;
      case "weekly":
        // Last 4 weeks
        for (let i = 0; i < 4; i++) {
          dummyData.push({
            week: i + 1,
            income: Math.round(Math.random() * 3000000),
            expenses: Math.round(Math.random() * 2500000),
            balance: 0, // Will be calculated below
          });
        }
        break;
      case "monthly":
      default:
        // Last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          dummyData.push({
            month: date,
            income: Math.round(Math.random() * 10000000),
            expenses: Math.round(Math.random() * 8000000),
            balance: 0, // Will be calculated below
          });
        }
    }

    // Calculate balance for each period
    return dummyData.map((item) => ({
      ...item,
      balance: item.income - item.expenses,
    }));
  };

  // Get period label
  const getPeriodLabel = () => {
    switch (period) {
      case "daily":
        return "Harian";
      case "weekly":
        return "Mingguan";
      case "monthly":
        return "Bulanan";
      default:
        return "Bulanan";
    }
  };

  // Get data type label
  const getDataTypeLabel = () => {
    switch (dataType) {
      case "income":
        return "Pemasukan";
      case "expenses":
        return "Pengeluaran";
      case "balance":
        return "Saldo";
      case "all":
      default:
        return "Semua";
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-2 sm:p-4 border rounded shadow-lg text-xs sm:text-sm ${darkMode
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-gray-800 border-gray-200"
            }`}
        >
          <p className="font-semibold">{label}</p>
          {(dataType === "all" || dataType === "income") && (
            <p className="text-green-500">
              Pemasukan: Rp.
              {Math.round(payload.find((p) => p.dataKey === "income")?.value || 0).toLocaleString(
                "id-ID"
              )}
            </p>
          )}
          {(dataType === "all" || dataType === "expenses") && (
            <p className="text-red-500">
              Pengeluaran: Rp.
              {Math.round(payload.find((p) => p.dataKey === "expenses")?.value || 0).toLocaleString(
                "id-ID"
              )}
            </p>
          )}
          {(dataType === "all" || dataType === "balance") && (
            <p
              className={`font-semibold ${(payload.find((p) => p.dataKey === "balance")?.value || 0) >= 0
                ? "text-blue-500"
                : "text-orange-500"
                }`}
            >
              Saldo: Rp.
              {Math.round(payload.find((p) => p.dataKey === "balance")?.value || 0).toLocaleString(
                "id-ID"
              )}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Format label to show in rupiah
  const formatRupiah = (value) => {
    // For small screens, use a more compact format
    return windowWidth < 640
      ? `Rp${Math.round(value / 1000)}K`
      : `Rp.${Math.round(value / 1000)}K`;
  };

  // Calculate optimal bar size based on screen width and number of data points
  const getBarSize = () => {
    const baseSize = windowWidth < 640 ? 20 : 30;
    // If we have many data points, make bars thinner
    if (chartData.length > 8) {
      return windowWidth < 640 ? 10 : 20;
    }
    return baseSize;
  };

  return (
    <div
      className={`w-full rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow p-3 sm:p-5`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-bold">Grafik Keuangan</h2>

        <div className="flex flex-wrap gap-2">
          {/* Period Filter Dropdown */}
          <div className="relative" ref={periodDropdownRef}>
            <button
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Toggle period filter"
              aria-expanded={dropdownOpen}
            >
              <span>Periode: {getPeriodLabel()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                  }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-1 sm:mt-2 w-32 sm:w-40 rounded-md shadow-lg z-10 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                  }`}
              >
                <div className="py-1">
                  <button
                    className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${period === "daily" ? "font-bold" : ""}`}
                    onClick={() => {
                      setPeriod("daily");
                      setDropdownOpen(false);
                    }}
                  >
                    Harian
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${period === "weekly" ? "font-bold" : ""}`}
                    onClick={() => {
                      setPeriod("weekly");
                      setDropdownOpen(false);
                    }}
                  >
                    Mingguan
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${period === "monthly" ? "font-bold" : ""}`}
                    onClick={() => {
                      setPeriod("monthly");
                      setDropdownOpen(false);
                    }}
                  >
                    Bulanan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Data Type Filter Dropdown */}
          <div className="relative" ref={typeDropdownRef}>
            <button
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              aria-label="Toggle data type filter"
              aria-expanded={typeDropdownOpen}
            >
              <span>Data: {getDataTypeLabel()}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${typeDropdownOpen ? "rotate-180" : ""
                  }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {typeDropdownOpen && (
              <div
                className={`absolute right-0 mt-1 sm:mt-2 w-32 sm:w-40 rounded-md shadow-lg z-10 ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                  }`}
              >
                <div className="py-1">
                  <button
                    className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${dataType === "all" ? "font-bold" : ""}`}
                    onClick={() => {
                      setDataType("all");
                      setTypeDropdownOpen(false);
                    }}
                  >
                    Semua
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${dataType === "income" ? "font-bold" : ""}`}
                    onClick={() => {
                      setDataType("income");
                      setTypeDropdownOpen(false);
                    }}
                  >
                    Pemasukan
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${dataType === "expenses" ? "font-bold" : ""}`}
                    onClick={() => {
                      setDataType("expenses");
                      setTypeDropdownOpen(false);
                    }}
                  >
                    Pengeluaran
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${dataType === "balance" ? "font-bold" : ""}`}
                    onClick={() => {
                      setDataType("balance");
                      setTypeDropdownOpen(false);
                    }}
                  >
                    Saldo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive chart height: shorter on mobile, taller on desktop */}
      <div className="h-64 sm:h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 10,
                right: windowWidth < 640 ? 5 : 10,
                left: windowWidth < 640 ? -15 : 0,
                bottom: 10
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={darkMode ? "#4b5563" : "#e5e7eb"}
              />
              <XAxis
                dataKey="name"
                tick={{
                  fill: darkMode ? "#e5e7eb" : "#4b5563",
                  fontSize: windowWidth < 640 ? 10 : 12
                }}
                tickMargin={5}
                angle={windowWidth < 480 ? -15 : 0}
                textAnchor={windowWidth < 480 ? "end" : "middle"}
                height={windowWidth < 480 ? 50 : 30}
              />
              <YAxis
                tickFormatter={(value) => formatRupiah(value)}
                tick={{
                  fill: darkMode ? "#e5e7eb" : "#4b5563",
                  fontSize: windowWidth < 640 ? 10 : 12
                }}
                width={windowWidth < 640 ? 40 : 60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "10px",
                  color: darkMode ? "#e5e7eb" : "#4b5563",
                  fontSize: windowWidth < 640 ? 10 : 12
                }}
              />

              {/* Render chart elements based on dataType */}
              {(dataType === "all" || dataType === "income") && (
                <Bar
                  dataKey="income"
                  name="Pemasukan"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={getBarSize()}
                />
              )}

              {(dataType === "all" || dataType === "expenses") && (
                <Bar
                  dataKey="expenses"
                  name="Pengeluaran"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  barSize={getBarSize()}
                />
              )}

              {(dataType === "all" || dataType === "balance") && (
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Saldo"
                  stroke="#3B82F6"
                  strokeWidth={windowWidth < 640 ? 1.5 : 2}
                  dot={{ r: windowWidth < 640 ? 3 : 4, fill: "#3B82F6" }}
                  activeDot={{ r: windowWidth < 640 ? 5 : 6 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className={`text-center text-sm sm:text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Tidak ada data untuk ditampilkan
            </p>
          </div>
        )}
      </div>


    </div>
  );
};

export default MonthlyBalanceChart;