import React, { useState, useEffect } from "react";
import "../App.css";
import CardsTotal from "../components/dahboard/CardsTotal";
import StatistikTotal from "../components/dahboard/StatistikTotal";
import RecentTransaction from "../components/dahboard/RecentTransaction";
import MonthlyBalanceChart from "../components/dahboard/MonthlyBalanceCart";

const Dashboard = ({ darkMode, isLoggedIn, toggleMobileMenu }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const maxVisibleTransactions = 5;
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  const getLast6MonthsData = () => {
    const data = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      data.push({
        month: date,
        income: 0,
        expenses: 0,
        balance: 0,
      });
    }

    return data;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);

          // Fetch monthly data
          const monthlyResponse = await fetch(`${apiUrl}/api/dashboard/monthly`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const monthlyResult = await monthlyResponse.json();
          if (monthlyResult.success) {
            setMonthlyData(monthlyResult.data);
          } else {
            setMonthlyData(getLast6MonthsData());
          }
        } else {
          console.error("Error fetching dashboard data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setMonthlyData(getLast6MonthsData());
      }
    };

    fetchDashboardData();
    fetchTransactions(transactionFilter);
  }, []);

  // Fetch transactions with current filter
  const fetchTransactions = async (filter) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Clear existing transactions first to prevent any mixing issues
      setTransactions([]);

      // Use the filter parameter in the API call
      const transactionsResponse = await fetch(
        `${apiUrl}/api/dashboard/transactions/recent?filter=${filter}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const transactionsResult = await transactionsResponse.json();
      if (transactionsResult.success) {
        const formattedTransactions = transactionsResult.data.map((transaction) => ({
          ...transaction,
          formattedAmount:
            transaction.type === "income"
              ? `+Rp.${Math.round(transaction.amount).toLocaleString("id-ID")}`
              : `-Rp.${Math.round(transaction.amount).toLocaleString("id-ID")}`,
        }));

        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Change handler for transaction filter
  const handleFilterChange = (filter) => {
    setTransactionFilter(filter);
    setShowFilterDropdown(false);

    // Fetch new data with the selected filter
    fetchTransactions(filter);
  };

  // Get displayed transactions limited by maxVisibleTransactions
  const getDisplayedTransactions = () => {
    return transactions.slice(0, maxVisibleTransactions);
  };

  // Function untuk mendapatkan label filter
  const getFilterLabel = () =>
    transactionFilter === "all"
      ? "Semua"
      : transactionFilter === "income"
      ? "Pemasukan"
      : "Pengeluaran";

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterDropdown && !event.target.closest(".filter-dropdown-container")) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  return (
    // Changed from h-screen to min-h-screen to prevent content cutoff on smaller screens
    <div className="w-full min-h-screen p-2 sm:p-5">
      {/* Improved header section with better spacing on mobile */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 relative">
        {isLoggedIn && (
          <button
            className={`md:hidden p-2 rounded-md bg-transparent border ${
              darkMode ? "text-600 border-gray-700" : "text-gray-500 border-gray-300"
            } transition-colors duration-200`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        <h1
          className={`text-xl sm:text-2xl font-bold text-center flex-1 md:text-start ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Dashboard
        </h1>
      </div>

      {dashboardData ? (
        <div className="space-y-4 sm:space-y-5">
          <CardsTotal
            darkMode={darkMode}
            totalSaldo={dashboardData.balance}
            totalPemasukan={dashboardData.totalIncome}
            totalPengeluaran={dashboardData.totalExpenses}
          />

          {/* Changed fixed height to more flexible responsive layout */}
          <div className="flex flex-col lg:flex-row w-full gap-3 sm:gap-5 mb-4 sm:mb-5 relative">
            <StatistikTotal
              darkMode={darkMode}
              totalSaldo={dashboardData.balance}
              totalPemasukan={dashboardData.totalIncome}
              totalPengeluaran={dashboardData.totalExpenses}
              expenseCategories={dashboardData.expenseCategories}
              incomeSources={dashboardData.incomeSources}
            />

            {/* Filter dropdown container with className for event handling */}
            <div className="filter-dropdown-container relative lg:w-2/5 w-full h-full">
              <RecentTransaction
                darkMode={darkMode}
                displayedTransactions={getDisplayedTransactions()}
                showAllTransactions={showAllTransactions}
                toggleTransactions={() => setShowAllTransactions(!showAllTransactions)}
                toggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
                showFilterDropdown={showFilterDropdown}
                filteredTransactions={transactions}
                transactionFilter={transactionFilter}
                maxVisibleTransactions={maxVisibleTransactions}
                setFilter={handleFilterChange}
                getFilterLabel={getFilterLabel}
                isLoading={isLoading}
              />

              {/* Improved dropdown positioning */}
              {showFilterDropdown && (
                <div
                  className={`absolute right-2 sm:right-5 top-14 w-40 ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-100"
                  } shadow-lg rounded-lg py-1 z-50 border`}
                >
                  <button
                    onClick={() => handleFilterChange("all")}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      darkMode ? "hover:bg-gray-600 text-white" : "hover:bg-gray-100 text-gray-700"
                    } transition-colors`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => handleFilterChange("income")}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      darkMode ? "hover:bg-gray-600 text-white" : "hover:bg-gray-100 text-gray-700"
                    } transition-colors`}
                  >
                    Pemasukan
                  </button>
                  <button
                    onClick={() => handleFilterChange("expense")}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      darkMode ? "hover:bg-gray-600 text-white" : "hover:bg-gray-100 text-gray-700"
                    } transition-colors`}
                  >
                    Pengeluaran
                  </button>
                </div>
              )}
            </div>
          </div>

          <MonthlyBalanceChart darkMode={darkMode} monthlyData={monthlyData} />
        </div>
      ) : (
        // Added loading state
        <div className="flex justify-center items-center h-64">
          <div className={`text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                darkMode ? "border-purple-500" : "border-blue-500"
              } mx-auto mb-4`}
            ></div>
            <p>Memuat data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
