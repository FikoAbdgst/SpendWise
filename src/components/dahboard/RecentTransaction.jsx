import React from 'react'
import { FiTrendingDown, FiTrendingUp, FiChevronDown } from 'react-icons/fi';


const RecentTransaction = ({ darkMode, displayedTransactions, showAllTransactions, toggleTransactions, toggleFilterDropdown, showFilterDropdown, filteredTransactions, transactionFilter, maxVisibleTransactions, setFilter, getFilterLabel }) => {
    const formatDate = (dateString) => {
        const transactionDate = new Date(dateString);

        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return transactionDate.toLocaleDateString('id-ID', options);
    };

    return (
        <div className="w-full lg:w-[40%] ">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-full h-auto p-5 rounded-xl shadow overflow-hidden transition-colors duration-200`}>
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

                {filteredTransactions.transactionFilterlength > maxVisibleTransactions && (
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
    )
}

export default RecentTransaction