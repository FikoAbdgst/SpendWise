import React, { useState, useEffect } from 'react';
import { BiWallet } from 'react-icons/bi';
import { LuWalletMinimal } from 'react-icons/lu';
import { GrMoney } from 'react-icons/gr';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import '../App.css';
import { FiTrendingDown, FiTrendingUp, FiChevronDown } from 'react-icons/fi';



const Dashboard = ({ darkMode }) => {
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const maxVisibleTransactions = 6;
    const [transactionFilter, setTransactionFilter] = useState('all'); // 'all', 'income', 'expense'
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // State for financial data
    const [totalSaldo, setTotalSaldo] = useState(0);
    const [totalPemasukan, setTotalPemasukan] = useState(0);
    const [totalPengeluaran, setTotalPengeluaran] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    // Load data from localStorage on component mount
    useEffect(() => {
        // Get incomes from localStorage
        const savedIncomes = JSON.parse(localStorage.getItem('incomes')) || [];
        const totalIncome = savedIncomes.reduce((sum, income) => sum + income.amount, 0);
        setTotalPemasukan(totalIncome);

        // Get expenses from localStorage
        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const totalExpense = savedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalPengeluaran(totalExpense);

        // Calculate balance
        setTotalSaldo(totalIncome - totalExpense);

        // Combine and sort transactions by date (newest first)
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

    // Apply filter when transactionFilter changes
    useEffect(() => {
        if (transactionFilter === 'all') {
            setFilteredTransactions(transactions);
        } else {
            setFilteredTransactions(transactions.filter(t => t.type === transactionFilter));
        }
    }, [transactionFilter, transactions]);

    // Mendapatkan transaksi yang akan ditampilkan berdasarkan status showAllTransactions
    const displayedTransactions = showAllTransactions
        ? filteredTransactions
        : filteredTransactions.slice(0, maxVisibleTransactions);

    // Toggle fungsi untuk Show More/Less
    const toggleTransactions = () => {
        setShowAllTransactions(!showAllTransactions);
    };

    // Toggle dropdown filter
    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    };

    // Set filter
    const setFilter = (filter) => {
        setTransactionFilter(filter);
        setShowFilterDropdown(false);
    };

    // Data untuk grafik donut
    const chartData = [
        { name: 'Total Saldo', value: totalSaldo, color: '#8B5CF6' }, // Warna ungu
        { name: 'Total Pengeluaran', value: totalPengeluaran, color: '#EF4444' }, // Warna merah
        { name: 'Total Pemasukan', value: totalPemasukan, color: '#F97316' }, // Warna oranye
    ];

    // Format date as "Today, HH:MM" or "DD/MM/YYYY"
    const formatDate = (dateString) => {
        const transactionDate = new Date(dateString);

        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return transactionDate.toLocaleDateString('id-ID', options);
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-black'} p-3 shadow-md rounded-md border`}>
                    <p className="font-semibold text-sm" style={{ color: data.color }}>{data.name}</p>
                    <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} text-sm`}>
                        Amount: <span className='font-bold tracking-tight'>Rp.{data.value.toLocaleString()}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = (props) => {
        const { payload } = props;
        return (
            <ul className="flex justify-center items-center gap-8 mt-4">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className={`${darkMode ? 'text-white' : 'text-black'} font-medium text-sm`}>
                            {entry.value}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    // Filter label
    const getFilterLabel = () => {
        switch (transactionFilter) {
            case 'all': return 'Semua';
            case 'income': return 'Pemasukan';
            case 'expense': return 'Pengeluaran';
            default: return 'Semua';
        }
    };

    return (
        <div className="w-full h-screen p-3">
            <h1 className={`text-2xl font-bold mb-6 text-center md:text-start ${darkMode ? 'text-white' : 'text-black'}`}>Dashboard</h1>

            {/* Full width cards section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} flex items-center gap-3 p-4 rounded-xl shadow transition-colors duration-200`}>
                    <div className='bg-purple-500 p-3 rounded-full text-white shadow-lg'>
                        <BiWallet size={20} />
                    </div>
                    <div className='flex justify-center flex-col'>
                        <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Saldo</p>
                        <p className={`${darkMode ? 'text-white' : 'text-black'} font-semibold`}>Rp.{totalSaldo.toLocaleString()}</p>
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} flex items-center gap-3 p-4 rounded-xl shadow transition-colors duration-200`}>
                    <div className='bg-orange-500 p-3 rounded-full text-white shadow-lg'>
                        <LuWalletMinimal size={20} />
                    </div>
                    <div className='flex justify-center flex-col'>
                        <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Pemasukan</p>
                        <p className={`${darkMode ? 'text-white' : 'text-black'} font-semibold`}>Rp.{totalPemasukan.toLocaleString()}</p>
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} flex items-center gap-3 p-4 rounded-xl shadow transition-colors duration-200`}>
                    <div className='bg-red-500 p-3 rounded-full text-white shadow-lg'>
                        <GrMoney size={20} className={darkMode ? "text-white" : ""} />
                    </div>
                    <div className='flex justify-center flex-col'>
                        <p className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Pengeluaran</p>
                        <p className={`${darkMode ? 'text-white' : 'text-black'} font-semibold`}>Rp.{totalPengeluaran.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row w-full gap-5 h-[calc(100%-200px)]">
                <div className="w-full lg:w-[60%]">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full h-full p-5 rounded-xl shadow transition-colors duration-200`}>
                        <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-black'}`}>Statistik Keuangan</h2>
                        <div className="w-full h-[calc(100%-40px)] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={300}>

                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <text
                                        x="50%"
                                        y="40%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} text-sm font-medium`}
                                        fill={darkMode ? "#D1D5DB" : "#6B7280"}
                                    >
                                        Total Saldo
                                    </text>
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-xl font-bold"
                                        fill={darkMode ? "#FFFFFF" : "#000000"}
                                    >
                                        Rp{totalSaldo.toLocaleString()}
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

                <div className="w-full lg:w-[40%]">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full h-full p-5 rounded-xl shadow overflow-hidden transition-colors duration-200`}>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Transaksi Terbaru</h2>

                            {/* Dropdown filter */}
                            <div className="relative">
                                <button
                                    onClick={toggleFilterDropdown}
                                    className={`flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'} px-3 py-1.5 rounded-lg transition-colors`}
                                >
                                    {getFilterLabel()}
                                    <FiChevronDown size={14} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown menu */}
                                {showFilterDropdown && (
                                    <div className={`absolute right-0 mt-1 w-40 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} shadow-lg rounded-lg py-1 z-10 border`}>
                                        <button
                                            onClick={() => setFilter('all')}
                                            className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                                        >
                                            Semua
                                        </button>
                                        <button
                                            onClick={() => setFilter('income')}
                                            className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                                        >
                                            Pemasukan
                                        </button>
                                        <button
                                            onClick={() => setFilter('expense')}
                                            className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-100 text-gray-700'} transition-colors`}
                                        >
                                            Pengeluaran
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`${showAllTransactions ? 'custom-scrollbar overflow-y-auto h-[calc(100%-80px)]' : 'overflow-hidden'}`}>
                            {filteredTransactions.length > 0 ? (
                                displayedTransactions.map((item) => (
                                    <div key={item.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} py-3`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-1.5 py-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                    <span className="text-lg">{item.emoji}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                                                    <p className={`text-xs font-semibold ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatDate(item.date)}</p>
                                                </div>
                                            </div>
                                            <div className={`flex justify-center items-center gap-2 text-xs font-semibold p-2 rounded-lg ${item.type === 'income'
                                                ? (darkMode ? 'text-green-300 bg-green-900' : 'text-green-600 bg-green-100')
                                                : (darkMode ? 'text-red-300 bg-red-900' : 'text-red-600 bg-red-100')
                                                }`}>
                                                {item.formattedAmount}
                                                {item.type === 'income' ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {transactionFilter === 'all' ? 'Belum ada transaksi' :
                                        transactionFilter === 'income' ? 'Belum ada pemasukan' : 'Belum ada pengeluaran'}
                                </div>
                            )}
                        </div>

                        {/* Show More/Less button in Indonesian */}
                        {filteredTransactions.length > maxVisibleTransactions && (
                            <button
                                onClick={toggleTransactions}
                                className={`mt-3 ${darkMode
                                    ? 'text-purple-400 hover:text-purple-300 border-purple-700 hover:bg-purple-900'
                                    : 'text-purple-600 hover:text-purple-800 border-purple-200 hover:bg-purple-50'
                                    } font-medium text-sm w-full py-2 text-center border rounded-lg transition-colors`}
                            >
                                {showAllTransactions ? 'Lihat Lebih Sedikit' : 'Lihat Semua'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;