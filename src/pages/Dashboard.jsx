import React, { useState, useEffect } from "react";
import "../App.css";
import CardsTotal from "../components/dahboard/CardsTotal";
import StatistikTotal from "../components/dahboard/StatistikTotal";
import RecentTransaction from "../components/dahboard/RecentTransaction";
import MonthlyBalanceChart from "../components/dahboard/MonthlyBalanceCart";

const Dashboard = ({ darkMode }) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const maxVisibleTransactions = 6;
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [totalSaldo, setTotalSaldo] = useState(0);
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [monthlyData, setMonthlyData] = useState({});

  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://backend-spendwise.vercel.app'
    : 'http://localhost:3000';

  useEffect(() => {
    const fetchMonthlyBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/balance/monthly-balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        console.log("Monthly Balance API Response:", result); // Tambahkan log ini

        if (result.success) {
          setMonthlyData(result.data);
          console.log("Monthly Data State:", result.data); // Tambahkan log ini
        } else {
          console.error("Error fetching monthly balance:", result.message);
        }
      } catch (error) {
        console.error("Error fetching monthly balance:", error);
      }
    };

    fetchMonthlyBalance();
  }, []);

  // Fetch financial summary from API
  useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl}/api/balance/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          setTotalSaldo(result.data.balance);
          setTotalPemasukan(result.data.totalIncome);
          setTotalPengeluaran(result.data.totalExpenses);
        } else {
          console.error("Error fetching financial summary:", result.message);
        }
      } catch (error) {
        console.error("Error fetching financial summary:", error);
      }
    };

    fetchFinancialSummary();
  }, []);

  // Fetch recent transactions from API
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${apiUrl} / api / balance / recent - transactions ? limit = 5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          // Format the transactions from API
          const formattedTransactions = result.data.map((transaction) => ({
            ...transaction,
            formattedAmount:
              transaction.type === "income"
                ? `+Rp.${Math.round(transaction.amount).toLocaleString("id-ID")}`
                : `-Rp.${Math.round(transaction.amount).toLocaleString("id-ID")}`,
          }));

          setTransactions(formattedTransactions);
          setFilteredTransactions(formattedTransactions);
        } else {
          console.error("Error fetching recent transactions:", result.message);
        }
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
      }
    };

    fetchRecentTransactions();
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

  const toggleTransactions = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const setFilter = (filter) => {
    setTransactionFilter(filter);
    setShowFilterDropdown(false);
  };

  const getFilterLabel = () => {
    switch (transactionFilter) {
      case "all":
        return "Semua";
      case "income":
        return "Pemasukan";
      case "expense":
        return "Pengeluaran";
      default:
        return "Semua";
    }
  };

  return (
    <div className="w-full h-screen p-3 overflow-y-auto">
      <h1
        className={`text-2xl font-bold mb-6 text-center md:text-start ${darkMode ? "text-white" : "text-black"
          }`}
      >
        Dashboard
      </h1>

      <CardsTotal
        darkMode={darkMode}
        totalSaldo={totalSaldo}
        totalPemasukan={totalPemasukan}
        totalPengeluaran={totalPengeluaran}
      />

      <div className="flex flex-col lg:flex-row w-full gap-5">
        <StatistikTotal
          darkMode={darkMode}
          totalSaldo={totalSaldo}
          totalPemasukan={totalPemasukan}
          totalPengeluaran={totalPengeluaran}
        />

        <RecentTransaction
          darkMode={darkMode}
          displayedTransactions={displayedTransactions}
          showAllTransactions={showAllTransactions}
          toggleTransactions={toggleTransactions}
          toggleFilterDropdown={toggleFilterDropdown}
          showFilterDropdown={showFilterDropdown}
          filteredTransactions={filteredTransactions}
          transactionFilter={transactionFilter}
          maxVisibleTransactions={maxVisibleTransactions}
          setFilter={setFilter}
          getFilterLabel={getFilterLabel}
        />
      </div>
      <div className="w-full mb-5">
        <MonthlyBalanceChart darkMode={darkMode} monthlyData={monthlyData} />
      </div>
    </div>
  );
};

export default Dashboard;
