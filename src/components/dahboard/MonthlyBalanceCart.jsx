import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MonthlyBalanceChart = ({ darkMode }) => {
    const [chartData, setChartData] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const [timeFrame, setTimeFrame] = useState('yearly'); // 'yearly', 'monthly', 'weekly', 'daily'
    const [dataType, setDataType] = useState('all'); // 'all', 'income', 'expense', 'balance'
    const [showFilterModal, setShowFilterModal] = useState(false);

    // More specific filters
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());

    // Helper function to get week number from date
    const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    // Helper function to get week range by number
    const getWeekRangeByNumber = (year, weekNumber) => {
        const firstDayOfYear = new Date(year, 0, 1);
        const daysOffset = (weekNumber - 1) * 7 - (firstDayOfYear.getDay() || 7) + 1;
        const startDate = new Date(year, 0, daysOffset);
        const endDate = new Date(year, 0, daysOffset + 6);
        return { startDate, endDate };
    };

    // Helper function to get weeks in a month
    const getWeeksInMonth = (year, month) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const weeksInMonth = [];
        let currentWeek = getWeekNumber(firstDayOfMonth);
        const lastWeek = getWeekNumber(lastDayOfMonth);

        // Handle cases where weeks can cross years
        if (currentWeek > lastWeek) {
            // This happens at December/January boundary
            while (currentWeek <= 52) {
                weeksInMonth.push({
                    weekNumber: currentWeek,
                    weekLabel: `Minggu ${currentWeek}`
                });
                currentWeek++;
            }
            currentWeek = 1;
        }

        while (currentWeek <= lastWeek) {
            weeksInMonth.push({
                weekNumber: currentWeek,
                weekLabel: `Minggu ${currentWeek}`
            });
            currentWeek++;
        }

        return weeksInMonth;
    };

    // Helper function to get days in a month
    const getDaysInMonth = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(year, month, i);
            days.push({
                date: day,
                dayName: day.toLocaleString('id-ID', { weekday: 'short' }),
                dayNumber: i,
                weekNumber: getWeekNumber(day)
            });
        }

        return days;
    };

    // Helper function to get days in specific week of month
    const getDaysInWeekOfMonth = (year, month, weekNumber) => {
        const allDays = getDaysInMonth(year, month);
        return allDays.filter(day => getWeekNumber(day.date) === weekNumber);
    };

    // Helper function to get month name
    const getMonthName = (month) => {
        return new Date(2000, month, 1).toLocaleString('id-ID', { month: 'long' });
    };

    // Set selected week when month changes
    useEffect(() => {
        if (timeFrame === 'weekly' || timeFrame === 'daily') {
            const weeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);
            if (weeksInMonth.length > 0 && (!selectedWeek || !weeksInMonth.some(w => w.weekNumber === selectedWeek))) {
                setSelectedWeek(weeksInMonth[0].weekNumber);
            }
        }
    }, [selectedMonth, selectedYear, timeFrame]);

    // Main hook to get and process data
    useEffect(() => {
        // Get transaction data from localStorage
        const savedIncomes = JSON.parse(localStorage.getItem('incomes')) || [];
        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

        let data = [];

        if (timeFrame === 'yearly') {
            // Data per month in a year
            for (let month = 0; month < 12; month++) {
                const monthName = getMonthName(month).substring(0, 3);
                data.push({
                    name: monthName,
                    income: 0,
                    expense: 0,
                    balance: 0,
                    period: month
                });
            }

            // Calculate total income and expenses per month
            savedIncomes.forEach(income => {
                const date = new Date(income.date);
                if (date.getFullYear() === selectedYear) {
                    const month = date.getMonth();
                    data[month].income += income.amount;
                }
            });

            savedExpenses.forEach(expense => {
                const date = new Date(expense.date);
                if (date.getFullYear() === selectedYear) {
                    const month = date.getMonth();
                    data[month].expense += expense.amount;
                }
            });
        } else if (timeFrame === 'monthly') {
            // Data per week in a month
            const weeksInMonth = getWeeksInMonth(selectedYear, selectedMonth);

            // Create data for weeks in a month
            weeksInMonth.forEach((week) => {
                const { startDate, endDate } = getWeekRangeByNumber(selectedYear, week.weekNumber);
                const formattedStartDate = startDate.toLocaleDateString('id-ID', { day: 'numeric' });
                const formattedEndDate = endDate.toLocaleDateString('id-ID', { day: 'numeric' });

                data.push({
                    name: `${week.weekLabel} (${formattedStartDate}-${formattedEndDate})`,
                    income: 0,
                    expense: 0,
                    balance: 0,
                    period: week.weekNumber,
                    startDate,
                    endDate
                });
            });

            // Calculate total income and expenses per week
            savedIncomes.forEach(income => {
                const incomeDate = new Date(income.date);
                // Only consider income in selected year and month
                if (incomeDate.getFullYear() === selectedYear && incomeDate.getMonth() === selectedMonth) {
                    const incomeWeek = getWeekNumber(incomeDate);
                    const index = data.findIndex(item => item.period === incomeWeek);
                    if (index !== -1) {
                        data[index].income += income.amount;
                    }
                }
            });

            savedExpenses.forEach(expense => {
                const expenseDate = new Date(expense.date);
                // Only consider expenses in selected year and month
                if (expenseDate.getFullYear() === selectedYear && expenseDate.getMonth() === selectedMonth) {
                    const expenseWeek = getWeekNumber(expenseDate);
                    const index = data.findIndex(item => item.period === expenseWeek);
                    if (index !== -1) {
                        data[index].expense += expense.amount;
                    }
                }
            });
        } else if (timeFrame === 'weekly') {
            // Data per day in a week
            if (selectedWeek) {
                const daysInWeekOfMonth = getDaysInWeekOfMonth(selectedYear, selectedMonth, selectedWeek);

                // Create data for days in a week
                daysInWeekOfMonth.forEach(day => {
                    data.push({
                        name: `${day.dayName} ${day.dayNumber}`,
                        income: 0,
                        expense: 0,
                        balance: 0,
                        date: day.date,
                        dayNumber: day.dayNumber
                    });
                });

                // Calculate total income and expenses per day
                savedIncomes.forEach(income => {
                    const incomeDate = new Date(income.date);
                    // Only consider income in selected year, month, and week
                    if (incomeDate.getFullYear() === selectedYear &&
                        incomeDate.getMonth() === selectedMonth &&
                        getWeekNumber(incomeDate) === selectedWeek) {

                        const index = data.findIndex(item => item.dayNumber === incomeDate.getDate());
                        if (index !== -1) {
                            data[index].income += income.amount;
                        }
                    }
                });

                savedExpenses.forEach(expense => {
                    const expenseDate = new Date(expense.date);
                    // Only consider expenses in selected year, month, and week
                    if (expenseDate.getFullYear() === selectedYear &&
                        expenseDate.getMonth() === selectedMonth &&
                        getWeekNumber(expenseDate) === selectedWeek) {

                        const index = data.findIndex(item => item.dayNumber === expenseDate.getDate());
                        if (index !== -1) {
                            data[index].expense += expense.amount;
                        }
                    }
                });
            }
        } else if (timeFrame === 'daily') {
            // This is a view that shows hours in a day - automatically use current date
            const hours = Array.from({ length: 24 }, (_, i) => i);

            // Create data for hours in a day
            hours.forEach(hour => {
                data.push({
                    name: `${hour}:00`,
                    income: 0,
                    expense: 0,
                    balance: 0,
                    hour: hour
                });
            });

            // Calculate income and expenses per hour - automatically use current date values
            savedIncomes.forEach(income => {
                const incomeDate = new Date(income.date);
                if (incomeDate.getFullYear() === selectedYear &&
                    incomeDate.getMonth() === selectedMonth &&
                    incomeDate.getDate() === selectedDay) {

                    const hour = incomeDate.getHours();
                    data[hour].income += income.amount;
                }
            });

            savedExpenses.forEach(expense => {
                const expenseDate = new Date(expense.date);
                if (expenseDate.getFullYear() === selectedYear &&
                    expenseDate.getMonth() === selectedMonth &&
                    expenseDate.getDate() === selectedDay) {

                    const hour = expenseDate.getHours();
                    data[hour].expense += expense.amount;
                }
            });
        }

        // Calculate balance (income - expense)
        data.forEach(item => {
            item.balance = item.income - item.expense;
        });

        setChartData(data);
    }, [selectedYear, selectedMonth, selectedWeek, selectedDay, timeFrame]);

    const formatCurrency = (value) => {
        return `Rp${value.toLocaleString('id-ID')}`;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className={`p-3 rounded-md text-sm ${darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white border border-gray-200 shadow-md'}`}>
                    {/* Show income only when all or income is selected */}
                    {(dataType === 'income' || dataType === 'all') && (
                        <p className="text-green-500">Pemasukan: {formatCurrency(data.income)}</p>
                    )}

                    {/* Show expense only when all or expense is selected */}
                    {(dataType === 'expense' || dataType === 'all') && (
                        <p className="text-red-500">Pengeluaran: {formatCurrency(data.expense)}</p>
                    )}

                    {/* Show balance only when all or balance is selected */}
                    {(dataType === 'balance' || dataType === 'all') && (
                        <p className={`font-semibold ${data.balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                            Balance: {formatCurrency(data.balance)}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    // Custom ticks for X-axis with different colors when hovered
    const CustomXAxisTick = (props) => {
        const { x, y, payload } = props;
        const isActive = activeItem === payload.value;

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill={isActive ? '#3B82F6' : (darkMode ? '#D1D5DB' : '#374151')}
                    fontWeight={isActive ? 'bold' : 'normal'}
                    fontSize={12}
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    const handleMouseMove = (data) => {
        if (data && data.activeLabel) {
            setActiveItem(data.activeLabel);
        }
    };

    const handleMouseLeave = () => {
        setActiveItem(null);
    };

    const toggleFilterModal = () => {
        setShowFilterModal(!showFilterModal);
    };

    // Toggle data type
    const handleDataTypeChange = (type) => {
        setDataType(type);
    };

    // Get array of years (last 5 years)
    const getYearOptions = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, i) => currentYear - i);
    };

    // Get array of months
    const getMonthOptions = () => {
        return Array.from({ length: 12 }, (_, i) => ({
            value: i,
            label: getMonthName(i)
        }));
    };

    // Get array of weeks in selected month
    const getWeekOptions = () => {
        if (selectedMonth !== null && selectedYear !== null) {
            return getWeeksInMonth(selectedYear, selectedMonth);
        }
        return [];
    };

    // Determine whether to show the time filter button
    const shouldShowTimeFilter = timeFrame === 'yearly' || timeFrame === 'monthly' ||
        (timeFrame === 'weekly' && showFilterModal);

    return (
        <div className={`w-full p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <h2 className="text-xl font-semibold">Data Grafik Keuangan</h2>

                {/* Filter controls */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                    {/* Data Type Filter */}
                    <div className="relative">
                        <select
                            className={`w-full sm:w-auto px-3 py-2 rounded-md text-sm font-medium focus:outline-none ${darkMode
                                ? 'bg-gray-700 text-white border border-gray-600'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}
                            value={dataType}
                            onChange={(e) => handleDataTypeChange(e.target.value)}
                        >
                            <option value="all">Semua Data</option>
                            <option value="income">Pemasukan</option>
                            <option value="expense">Pengeluaran</option>
                            <option value="balance">Balance</option>
                        </select>
                    </div>

                    {/* Time Frame Filter */}
                    <div className="relative">
                        <select
                            className={`w-full sm:w-auto px-3 py-2 rounded-md text-sm font-medium focus:outline-none ${darkMode
                                ? 'bg-gray-700 text-white border border-gray-600'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                        >
                            <option value="yearly">Bulanan</option>
                            <option value="monthly">Mingguan</option>
                            <option value="weekly">Harian</option>
                            <option value="daily">Per Jam</option>
                        </select>
                    </div>

                    {/* Time Filter Button - only show for yearly and monthly views */}
                    {shouldShowTimeFilter && (
                        <button
                            onClick={toggleFilterModal}
                            className={`w-full sm:w-auto px-3 py-2 rounded-md text-sm font-medium transition-colors ${darkMode
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            Filter Waktu
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full h-64 sm:h-72 md:h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 20, left: 10, bottom: 15 }}
                        barSize={dataType === 'all' ? 8 : 25}
                        barGap={0}
                        barCategoryGap={dataType === 'all' ? 8 : 15}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        <XAxis
                            dataKey="name"
                            axisLine={true}
                            tickLine={false}
                            tick={<CustomXAxisTick />}
                            height={30}
                            interval={window.innerWidth < 768 ? 'preserveStartEnd' : 0}
                            angle={window.innerWidth < 768 ? -45 : 0}
                            textAnchor={window.innerWidth < 768 ? 'end' : 'middle'}
                            fontSize={window.innerWidth < 768 ? 10 : 12}
                        />
                        <YAxis
                            tickFormatter={(value) => {
                                if (window.innerWidth < 768) {
                                    // Simplified for mobile
                                    return `${(value / 1000).toFixed(0)}K`;
                                }
                                return formatCurrency(value);
                            }}
                            width={window.innerWidth < 768 ? 50 : 80}
                            axisLine={true}
                            tickLine={false}
                            tick={{ fontSize: window.innerWidth < 768 ? 10 : 11 }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={false}
                            allowEscapeViewBox={{ x: true, y: true }}
                            wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
                        />

                        {(dataType === 'all' || dataType === 'income') && (
                            <Bar
                                dataKey="income"
                                fill="#10B981" // Green color for income
                                name="Pemasukan"
                                radius={[4, 4, 0, 0]}
                                activeBar={{ fill: '#059669', stroke: '#047857', strokeWidth: 2 }}
                            />
                        )}

                        {(dataType === 'all' || dataType === 'expense') && (
                            <Bar
                                dataKey="expense"
                                fill="#EF4444" // Red color for expense
                                name="Pengeluaran"
                                radius={[4, 4, 0, 0]}
                                activeBar={{ fill: '#DC2626', stroke: '#B91C1C', strokeWidth: 2 }}
                            />
                        )}

                        {(dataType === 'all' || dataType === 'balance') && (
                            <Bar
                                dataKey="balance"
                                fill="#3B82F6" // Blue color for balance
                                name="Balance"
                                radius={[4, 4, 0, 0]}
                                activeBar={{ fill: '#2563EB', stroke: '#1D4ED8', strokeWidth: 2 }}
                            />
                        )}

                        <Legend
                            wrapperStyle={{
                                position: 'relative',
                                marginTop: '10px',
                                color: darkMode ? 'white' : 'black'
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-sm text-center">
                <p className="text-xs sm:text-sm">
                    {timeFrame === 'yearly'
                        ? `Data Bulanan Tahun ${selectedYear}`
                        : timeFrame === 'monthly'
                            ? `Data Mingguan Bulan ${getMonthName(selectedMonth)} ${selectedYear}`
                            : timeFrame === 'weekly'
                                ? `Data Harian Minggu ${selectedWeek} Bulan ${getMonthName(selectedMonth)}, ${selectedYear}`
                                : `Data Per Jam Tanggal ${selectedDay} ${getMonthName(selectedMonth)} ${selectedYear}`}
                </p>
            </div>

            {/* Filter Modal - only for yearly and monthly views */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className={`w-full max-w-md p-4 sm:p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Filter Data</h3>
                            <button
                                onClick={toggleFilterModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Year Selection - Always show */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Tahun</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className={`w-full p-2 rounded-md ${darkMode
                                        ? 'bg-gray-700 text-white border border-gray-600'
                                        : 'bg-white text-gray-800 border border-gray-300'
                                        }`}
                                >
                                    {getYearOptions().map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Month Selection - Show if timeFrame is monthly or weekly */}
                            {(timeFrame === 'monthly' || timeFrame === 'weekly') && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bulan</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                        className={`w-full p-2 rounded-md ${darkMode
                                            ? 'bg-gray-700 text-white border border-gray-600'
                                            : 'bg-white text-gray-800 border border-gray-300'
                                            }`}
                                    >
                                        {getMonthOptions().map((month) => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Week Selection - Show only if timeFrame is weekly */}
                            {timeFrame === 'weekly' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Minggu</label>
                                    <select
                                        value={selectedWeek || ''}
                                        onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                                        className={`w-full p-2 rounded-md ${darkMode
                                            ? 'bg-gray-700 text-white border border-gray-600'
                                            : 'bg-white text-gray-800 border border-gray-300'
                                            }`}
                                    >
                                        {getWeekOptions().map((week) => (
                                            <option key={week.weekNumber} value={week.weekNumber}>{week.weekLabel}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={toggleFilterModal}
                                className={`mr-2 px-4 py-2 rounded-md text-sm font-medium ${darkMode
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Batal
                            </button>
                            <button
                                onClick={toggleFilterModal}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${darkMode
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                Terapkan Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlyBalanceChart;