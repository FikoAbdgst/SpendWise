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
  const [monthlyData, setMonthlyData] = useState([]);

  const maxVisibleTransactions = 6;
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

          // Tambahan: Fetch recent transactions
          const transactionsResponse = await fetch(`${apiUrl}/api/dashboard/transactions/recent`, {
            headers: { Authorization: `Bearer ${token}` },
          });

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
            setFilteredTransactions(formattedTransactions);
          }

          const monthlyResponse = await fetch(`${apiUrl}/api/transactions/monthly`, {
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
        className={`text-2xl font-bold mb-6 text-center md:text-start ${darkMode ? "text-white" : "text-black"
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

          <div className="flex flex-col lg:flex-row w-full gap-5 mb-5">
            <StatistikTotal
              darkMode={darkMode}
              totalSaldo={dashboardData.balance}
              totalPemasukan={dashboardData.totalIncome}
              totalPengeluaran={dashboardData.totalExpenses}
              expenseCategories={dashboardData.expenseCategories}
              incomeSources={dashboardData.incomeSources}
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

          <MonthlyBalanceChart darkMode={darkMode} monthlyData={monthlyData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;