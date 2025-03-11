import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TableDataExpense = ({
  darkMode,
  handleSort,
  sortColumn,
  sortDirection,
  filteredExpenses,
  formatDate,
  formatCurrency,
  handleEdit,
  handleDelete,
  currentPage,
  setCurrentPage,
  itemsPerPage = 10,
}) => {
  useEffect(() => {}, [filteredExpenses]);

  const safeCurrentPage = currentPage || 1;
  const safeItemsPerPage = itemsPerPage || 10;

  const totalItems = Array.isArray(filteredExpenses) ? filteredExpenses.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeItemsPerPage));

  const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
  const endIndex = Math.min(startIndex + safeItemsPerPage, totalItems);

  const safeData = Array.isArray(filteredExpenses) ? filteredExpenses : [];
  const currentPageData = safeData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("date")}>
                <div className="flex items-center">
                  <span>Tanggal</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("source")}>
                <div className="flex items-center">
                  <span>Sumber</span>
                  {sortColumn === "source" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-right cursor-pointer" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end">
                  <span>Jumlah</span>
                  {sortColumn === "amount" && (
                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((expense) => (
                <tr
                  key={expense.id}
                  className={darkMode ? "border-t border-gray-700" : "border-t border-gray-200"}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{expense.icon || "💰"}</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{expense.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-red-500 font-medium">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className={`p-2 rounded-full cursor-pointer ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        title="Edit"
                      >
                        <FaEdit className={darkMode ? "text-blue-400" : "text-blue-500"} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className={`p-2 rounded-full cursor-pointer ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        title="Hapus"
                      >
                        <FaTrash className={darkMode ? "text-red-400" : "text-red-500"} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center">
                  Tidak ada data untuk ditampilkan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2 px-4">
          <div className="text-sm text-center md:text-left">
            Menampilkan {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems} item
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <button
              onClick={handlePrevPage}
              disabled={safeCurrentPage === 1}
              className={`px-3 py-1 sm:px-2 sm:py-1 text-xs md:text-sm rounded-md ${
                safeCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              aria-label="Previous page"
            >
              Sebelumnya
            </button>

            {/* Tampilkan nomor halaman (maksimal 5) */}
            {totalPages > 0 &&
              Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (safeCurrentPage <= 3) {
                  pageNum = i + 1;
                } else if (safeCurrentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = safeCurrentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 cursor-pointer sm:px-2 sm:py-1 text-xs md:text-sm rounded-md ${
                      safeCurrentPage === pageNum
                        ? darkMode
                          ? "bg-purple-600 text-white"
                          : "bg-blue-500 text-white"
                        : darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

            <button
              onClick={handleNextPage}
              disabled={safeCurrentPage === totalPages}
              className={`px-3 py-1 sm:px-2 sm:py-1 text-xs md:text-sm rounded-md ${
                safeCurrentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              aria-label="Next page"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableDataExpense;
