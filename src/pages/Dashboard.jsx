import React, { useState, useEffect } from 'react';
import '../App.css';
import CardsTotal from '../components/dahboard/CardsTotal';
import StatistikTotal from '../components/dahboard/StatistikTotal';
import RecentTransaction from '../components/dahboard/RecentTransaction';
import MonthlyBalanceChart from '../components/dahboard/MonthlyBalanceCart';

const Dashboard = ({ darkMode }) => {
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const maxVisibleTransactions = 6;
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const [totalSaldo, setTotalSaldo] = useState(0);
    const [totalPemasukan, setTotalPemasukan] = useState(0);
    const [totalPengeluaran, setTotalPengeluaran] = useState(0);

    useEffect(() => {
        const savedIncomes = JSON.parse(localStorage.getItem('incomes')) || [];
        const totalIncome = savedIncomes.reduce((sum, income) => sum + income.amount, 0);
        setTotalPemasukan(totalIncome);

        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const totalExpense = savedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalPengeluaran(totalExpense);

        setTotalSaldo(totalIncome - totalExpense);

        const allTransactions = [
            ...savedIncomes.map(income => ({
                ...income,
                type: 'income',
                formattedAmount: `+Rp.${income.amount.toLocaleString()}`
            })),
            ...savedExpenses.map(expense => ({
                ...expense,
                type: 'expense',
                formattedAmount: `-Rp.${expense.amount.toLocaleString()}`
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(allTransactions);
        setFilteredTransactions(allTransactions); // Initially set to all transactions
    }, []);

    useEffect(() => {
        if (transactionFilter === 'all') {
            setFilteredTransactions(transactions);
        } else {
            setFilteredTransactions(transactions.filter(t => t.type === transactionFilter));
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
            case 'all': return 'Semua';
            case 'income': return 'Pemasukan';
            case 'expense': return 'Pengeluaran';
            default: return 'Semua';
        }
    };

    return (
        <div className="w-full h-screen p-3 overflow-y-auto">
            <h1 className={`text-2xl font-bold mb-6 text-center md:text-start ${darkMode ? 'text-white' : 'text-black'}`}>Dashboard</h1>

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
                <MonthlyBalanceChart darkMode={darkMode} />
            </div>
        </div>
    );
};

export default Dashboard;