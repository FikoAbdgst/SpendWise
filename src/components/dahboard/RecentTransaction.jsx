import React from "react";
import { FiTrendingDown, FiTrendingUp, FiChevronDown, FiFilter } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

const RecentTransaction = ({
  darkMode,
  displayedTransactions,
  showAllTransactions,
  toggleTransactions,
  toggleFilterDropdown,
  showFilterDropdown,
  filteredTransactions,
  transactionFilter,
  maxVisibleTransactions,
  setFilter,
  getFilterLabel,
  isLoading = false,
}) => {
  const formatDate = (dateString) => {
    const transactionDate = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return transactionDate.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="w-full h-full">
      <div
        className={`${darkMode ? "bg-gray-800" : "bg-white"} 
          w-full h-full p-4 md:p-5 rounded-xl shadow overflow-hidden 
          transition-colors duration-200 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-2 md:mb-3 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-lg ${
                darkMode ? "bg-gray-700 text-purple-400" : "bg-purple-100 text-blue-600"
              }`}
            >
              <GrTransaction className=" w-5 h-5" />
            </span>
            <h2 className={`text-base md:text-lg font-bold ${darkMode ? "text-white" : "text-black"}`}>
              Transaksi Terbaru
            </h2>
          </div>

          {/* Filter dropdown button */}
          <div className="relative">
            <button
              onClick={toggleFilterDropdown}
              className={`flex items-center gap-2 cursor-pointer text-xs md:text-sm font-medium ${
                darkMode
                  ? "text-gray-200 bg-gray-700 hover:bg-gray-600"
                  : "text-gray-700 bg-gray-100 hover:bg-gray-200"
              } px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors`}
            >
              {getFilterLabel()}
              <FiChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  showFilterDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className={`pr-2 md:pr-3 mt-2 ${
            showAllTransactions ? "custom-scrollbar overflow-y-scroll" : "overflow-y-hidden"
          } 
            ${filteredTransactions.length >= 5 ? "h-64 md:h-80" : "h-auto"} 
            ${darkMode ? "bg-gray-800" : "bg-white"} ${showAllTransactions ? "scrollbar-show" : ""}`}
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: showAllTransactions ? "thin" : "none",
            msOverflowStyle: showAllTransactions ? "auto" : "none",
          }}
        >
          {isLoading ? (
            <div
              className={`flex justify-center items-center py-8 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-xs md:text-sm">Memuat transaksi...</span>
            </div>
          ) : filteredTransactions.length > 0 ? (
            (showAllTransactions ? filteredTransactions : displayedTransactions).map((item) => (
              <div
                key={item.id}
                className={`border-b ${
                  darkMode ? "border-gray-700 hover:bg-gray-900" : "border-gray-100 hover:bg-gray-200"
                } py-2 md:py-3 
                  flex justify-between items-center px-1 md:px-2
                 }`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className={`p-1 md:px-1.5 md:py-1 rounded-full ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <span className="text-base md:text-lg">{item.icon}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 md:gap-1">
                    <p
                      className={`text-xs md:text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.type === "income" ? item.source : item.category}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {formatDate(item.date)}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex justify-center items-center gap-1 md:gap-2 text-xs font-semibold p-1.5 md:p-2 rounded-lg 
                    ${
                      item.type === "income"
                        ? darkMode
                          ? "text-green-300 bg-green-900"
                          : "text-green-600 bg-green-100"
                        : darkMode
                        ? "text-red-300 bg-red-900"
                        : "text-red-600 bg-red-100"
                    }`}
                >
                  <span className="whitespace-nowrap">
                    {item.type === "income" ? "+Rp" : "-Rp"}
                    {Math.abs(item.amount).toLocaleString("id-ID")}
                  </span>
                  {item.type === "income" ? (
                    <FiTrendingUp size={14} className="md:text-base" />
                  ) : (
                    <FiTrendingDown size={14} className="md:text-base" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div
              className={`text-center py-8 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } text-xs md:text-sm`}
            >
              {transactionFilter === "all"
                ? "Belum ada transaksi"
                : transactionFilter === "income"
                ? "Belum ada pemasukan"
                : "Belum ada pengeluaran"}
            </div>
          )}
        </div>

        {filteredTransactions.length > maxVisibleTransactions && (
          <button
            onClick={toggleTransactions}
            className={`mt-2 md:mt-3 ${
              darkMode
                ? "text-purple-400 hover:text-white border-purple-600 hover:bg-purple-700"
                : "text-blue-600 hover:text-white border-blue-500 hover:bg-blue-600"
            } 
              font-medium text-xs cursor-pointer md:text-sm w-full py-1.5 md:py-2 text-center border rounded-lg transition-colors`}
          >
            {showAllTransactions ? "Lihat Lebih Sedikit" : "Lihat Semua"}
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentTransaction;
