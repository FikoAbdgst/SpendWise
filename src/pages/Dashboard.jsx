import React, { useState, useEffect } from "react";
import "../App.css";
import CardsTotal from "../components/dahboard/CardsTotal";
import StatistikTotal from "../components/dahboard/StatistikTotal";
import RecentTransaction from "../components/dahboard/RecentTransaction";
import MonthlyBalanceChart from "../components/dahboard/MonthlyBalanceCart";

const Dashboard = ({ darkMode }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const maxVisibleTransactions = 6;
  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

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
          const formattedTransactions = result.data.recentTransactions.map((transaction) => ({
            ...transaction,
            formattedAmount:
              transaction.type === "income"
                ? `+Rp.${Math.round(transaction.amount).toLocaleString("id-ID")}`
                : `-Rp.${Math.round(transaction.amount).toLocaleString("id-ID")}`,
          }));
          setTransactions(formattedTransactions);
          setFilteredTransactions(formattedTransactions);
        } else {
          console.error("Error fetching dashboard data:", result.message);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (transactionFilter === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter((t) => t.type === transactionFilter));
    }
  }, [transactionFilter, transactions]);

  const displayedTransactions = showAllTransactions
    ? filteredTransactions
    : filteredTransactions.slice(0, maxVisibleTransactions);

  return (
    <div className="w-full h-screen p-3 overflow-y-auto">
      <h1
        className={`text-2xl font-bold mb-6 text-center md:text-start ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Dashboard
      </h1>

      {dashboardData && (
        <>
          <CardsTotal
            darkMode={darkMode}
            totalSaldo={dashboardData.balance}
            totalPemasukan={dashboardData.totalIncome}
            totalPengeluaran={dashboardData.totalExpenses}
          />

          <div className="flex flex-col lg:flex-row w-full gap-5">
            <StatistikTotal
              darkMode={darkMode}
              totalSaldo={dashboardData.balance}
              totalPemasukan={dashboardData.totalIncome}
              totalPengeluaran={dashboardData.totalExpenses}
            />

            <RecentTransaction
              darkMode={darkMode}
              displayedTransactions={displayedTransactions}
              showAllTransactions={showAllTransactions}
              toggleTransactions={() => setShowAllTransactions(!showAllTransactions)}
              toggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
              showFilterDropdown={showFilterDropdown}
              filteredTransactions={filteredTransactions}
              transactionFilter={transactionFilter}
              maxVisibleTransactions={maxVisibleTransactions}
              setFilter={setTransactionFilter}
              getFilterLabel={() =>
                transactionFilter === "all"
                  ? "Semua"
                  : transactionFilter === "income"
                  ? "Pemasukan"
                  : "Pengeluaran"
              }
            />
          </div>
          <div className="w-full mb-5">
            <MonthlyBalanceChart darkMode={darkMode} monthlyData={dashboardData.monthlyData} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
