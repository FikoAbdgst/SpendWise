import React, { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  // Fetch data based on selected period
  useEffect(() => {
    const fetchPeriodData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        let endpoint = "";

        // Determine API endpoint based on selected period
        switch (period) {
          case "daily":
            endpoint = "/api/dashboard/daily";
            break;
          case "weekly":
            endpoint = "/api/dashboard/weekly";
            break;
          case "monthly":
            endpoint = "/api/dashboard/monthly";
            break;
          default:
            endpoint = "/api/dashboard/monthly";
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
      } finally {
        setIsLoading(false);
      }
    };

    // Use monthlyData if period is monthly and data is already available
    if (period === "monthly" && monthlyData && monthlyData.length > 0) {
      setChartData(formatChartData(monthlyData, period));
    } else {
      fetchPeriodData();
    }
  }, [period, monthlyData]);

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
          className={`p-4 border rounded-lg shadow-lg ${
            darkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-gray-800 border-gray-200"
          }`}
        >
          <p className="font-semibold text-lg mb-2">{label}</p>
          {(dataType === "all" || dataType === "income") && (
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <p className="text-green-500">
                Pemasukan: Rp.
                {Math.round(payload.find((p) => p.dataKey === "income")?.value || 0).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          )}
          {(dataType === "all" || dataType === "expenses") && (
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <p className="text-red-500">
                Pengeluaran: Rp.
                {Math.round(payload.find((p) => p.dataKey === "expenses")?.value || 0).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          )}
          {(dataType === "all" || dataType === "balance") && (
            <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <p
                className={`font-semibold ${
                  (payload.find((p) => p.dataKey === "balance")?.value || 0) >= 0
                    ? "text-blue-500"
                    : "text-orange-500"
                }`}
              >
                Saldo: Rp.
                {Math.round(payload.find((p) => p.dataKey === "balance")?.value || 0).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Format label to show in rupiah
  const formatRupiah = (value) => {
    return `Rp.${Math.round(value / 1000)}K`;
  };

  return (
    <div
      className={`w-full rounded-xl ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl`}
    >
      {/* Gradient header */}
      <div className={`px-6 py-5 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            {/* Chart icon */}
            <div
              className={`mr-3 p-2 rounded-lg ${
                darkMode ? "bg-gray-700 text-purple-400" : "bg-purple-100 text-blue-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Grafik Keuangan</h2>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {getPeriodLabel()} • {getDataTypeLabel()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Period Filter Dropdown */}
            <div className="relative">
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                } shadow-sm`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{getPeriodLabel()}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
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
                  className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-10 transform transition-all duration-200 scale-100 opacity-100 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                  } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
                >
                  <div className="py-1">
                    <button
                      className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${
                        period === "daily"
                          ? `font-bold ${darkMode ? "bg-gray-600" : "bg-gray-100"}`
                          : ""
                      }`}
                      onClick={() => {
                        setPeriod("daily");
                        setDropdownOpen(false);
                      }}
                    >
                      {period === "daily" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={period === "daily" ? "" : "pl-6"}>Harian</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${
                        period === "weekly"
                          ? `font-bold ${darkMode ? "bg-gray-600" : "bg-gray-100"}`
                          : ""
                      }`}
                      onClick={() => {
                        setPeriod("weekly");
                        setDropdownOpen(false);
                      }}
                    >
                      {period === "weekly" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={period === "weekly" ? "" : "pl-6"}>Mingguan</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${
                        period === "monthly"
                          ? `font-bold ${darkMode ? "bg-gray-600" : "bg-gray-100"}`
                          : ""
                      }`}
                      onClick={() => {
                        setPeriod("monthly");
                        setDropdownOpen(false);
                      }}
                    >
                      {period === "monthly" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={period === "monthly" ? "" : "pl-6"}>Bulanan</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Data Type Filter Dropdown */}
            <div className="relative">
              <button
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 border ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                    : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                } shadow-sm`}
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>{getDataTypeLabel()}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    typeDropdownOpen ? "rotate-180" : ""
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
                  className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-10 transform transition-all duration-200 scale-100 opacity-100 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                  } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
                >
                  <div className="py-1">
                    <button
                      className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${
                        dataType === "all"
                          ? `font-bold ${darkMode ? "bg-gray-600" : "bg-gray-100"}`
                          : ""
                      }`}
                      onClick={() => {
                        setDataType("all");
                        setTypeDropdownOpen(false);
                      }}
                    >
                      {dataType === "all" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={dataType === "all" ? "" : "pl-6"}>Semua</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${
                        dataType === "income"
                          ? `font-bold ${darkMode ? "bg-gray-600" : "bg-gray-100"}`
                          : ""
                      }`}
                      onClick={() => {
                        setDataType("income");
                        setTypeDropdownOpen(false);
                      }}
                    >
                      {dataType === "income" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={dataType === "income" ? "" : "pl-6"}>Pemasukan</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${
                        dataType === "expenses"
                          ? `font-bold ${darkMode ? "bg-gray-600" : "bg-gray-100"}`
                          : ""
                      }`}
                      onClick={() => {
                        setDataType("expenses");
                        setTypeDropdownOpen(false);
                      }}
                    >
                      {dataType === "expenses" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={dataType === "expenses" ? "" : "pl-6"}>Pengeluaran</span>
                    </button>
                    <button
                      className={`flex items-center space-x-2 w-full text-left px-4 py-2 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } ${
                        dataType === "balance"
                          ? `font-bold ${darkMode ? "bg-gray-600" : "bg-gray-100"}`
                          : ""
                      }`}
                      onClick={() => {
                        setDataType("balance");
                        setTypeDropdownOpen(false);
                      }}
                    >
                      {dataType === "balance" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={dataType === "balance" ? "" : "pl-6"}>Saldo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart container with improved spacing and loading state */}
      <div className="p-4 md:p-6">
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full border-t-2 border-b-2 ${
                  darkMode ? "border-blue-400" : "border-blue-600"
                } animate-spin`}
              ></div>
              <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Memuat data...</p>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-10 w-10 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p
                className={`mt-4 text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Tidak ada data untuk ditampilkan
              </p>
              <p className={`mt-2 max-w-md ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Belum ada data keuangan yang tersedia untuk periode ini.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-80 md:h-96 transition-all duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={darkMode ? "#4b5563" : "#e5e7eb"}
                  opacity={0.6}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: darkMode ? "#e5e7eb" : "#4b5563" }}
                  axisLine={{ stroke: darkMode ? "#4b5563" : "#e5e7eb" }}
                  tickLine={{ stroke: darkMode ? "#4b5563" : "#e5e7eb" }}
                />
                <YAxis
                  tickFormatter={(value) => formatRupiah(value)}
                  tick={{ fill: darkMode ? "#e5e7eb" : "#4b5563" }}
                  axisLine={{ stroke: darkMode ? "#4b5563" : "#e5e7eb" }}
                  tickLine={{ stroke: darkMode ? "#4b5563" : "#e5e7eb" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: darkMode ? "#e5e7eb" : "#4b5563",
                  }}
                  iconType="circle"
                  iconSize={10}
                />

                {(dataType === "all" || dataType === "income") && (
                  <Bar
                    dataKey="income"
                    name="Pemasukan"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    barSize={dataType === "all" ? 24 : 30}
                  />
                )}

                {(dataType === "all" || dataType === "expenses") && (
                  <Bar
                    dataKey="expenses"
                    name="Pengeluaran"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                    barSize={dataType === "all" ? 24 : 30}
                  />
                )}

                {(dataType === "all" || dataType === "balance") && (
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Saldo"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#3B82F6",
                      strokeWidth: 2,
                      stroke: darkMode ? "#1F2937" : "#FFFFFF",
                    }}
                    activeDot={{ r: 6, stroke: darkMode ? "#1F2937" : "#FFFFFF", strokeWidth: 2 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyBalanceChart;
