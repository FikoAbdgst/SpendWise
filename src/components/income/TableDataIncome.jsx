import React, { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TableDataIncome = ({
    darkMode,
    handleSort,
    sortColumn,
    sortDirection,
    filteredIncomes,
    formatDate,
    formatCurrency,
    handleEdit,
    handleDelete,
    currentPage,
    setCurrentPage,
    itemsPerPage = 10,
}) => {
    useEffect(() => { }, [filteredIncomes]);

    const safeCurrentPage = currentPage || 1;
    const safeItemsPerPage = itemsPerPage || 10;

    const totalItems = Array.isArray(filteredIncomes) ? filteredIncomes.length : 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / safeItemsPerPage));

    const startIndex = (safeCurrentPage - 1) * safeItemsPerPage;
    const endIndex = Math.min(startIndex + safeItemsPerPage, totalItems);

    const safeData = Array.isArray(filteredIncomes) ? filteredIncomes : [];
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

    // Tema warna untuk tampilan mobile saja
    const mobileTheme = {
        light: {
            mobileCard: "bg-white border-2 border-gray-100 shadow-sm",
            mobileButton: "bg-transparent hover:bg-gray-200",
            incomeText: "text-emerald-600 font-medium",
            editIcon: "text-blue-600",
            deleteIcon: "text-red-600",
            paginationText: "text-gray-600",
        },
        dark: {
            mobileCard: "bg-gray-800 border-2 border-gray-700",
            mobileButton: "bg-transparent hover:bg-gray-600",
            incomeText: "text-emerald-400 font-medium",
            editIcon: "text-blue-400",
            deleteIcon: "text-red-400",
            paginationText: "text-gray-300",
        }
    };

    const mt = darkMode ? mobileTheme.dark : mobileTheme.light;

    return (
        <div>
            {/* Desktop view - standard table (Tidak diubah) */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                        <tr>
                            <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("date")}>
                                <div className="flex items-center">
                                    <span>Tanggal</span>
                                    {sortColumn === "date" && (
                                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                                    )}
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
                            currentPageData.map((income) => (
                                <tr
                                    key={income.id}
                                    className={darkMode ? "border-t border-gray-700" : "border-t border-gray-200"}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-2">{income.icon || "💰"}</span>
                                            <span>{formatDate(income.date)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium">{income.source}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-green-500 font-medium">
                                        {formatCurrency(income.amount)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(income)}
                                                className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                                title="Edit"
                                            >
                                                <FaEdit className={darkMode ? "text-blue-400" : "text-blue-500"} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(income.id)}
                                                className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
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
            {/* Mobile view - card layout (Ditingkatkan) */}
            <div className="md:hidden space-y-3">
                {currentPageData.length > 0 ? (
                    currentPageData.map((income) => (
                        <div
                            key={income.id}
                            className={`p-4 rounded-lg ${mt.mobileCard}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <span className="text-xl mr-2">{income.icon || "💰"}</span>
                                    <span className="font-medium">{income.source}</span>
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handleEdit(income)}
                                        className={`p-2 rounded-full cursor-pointer ${mt.mobileButton}`}
                                        title="Edit"
                                    >
                                        <FaEdit className={mt.editIcon} size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(income.id)}
                                        className={`p-2 rounded-full cursor-pointer ${mt.mobileButton}`}
                                        title="Hapus"
                                    >
                                        <FaTrash className={mt.deleteIcon} size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={mt.paginationText}>
                                    {formatDate(income.date)}
                                </span>
                                <span className={mt.incomeText}>
                                    {formatCurrency(income.amount)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={`p-4 text-center ${mt.paginationText}`}>
                        Tidak ada data untuk ditampilkan
                    </div>
                )}
            </div>

            {/* Pagination - improved for mobile */}
            {totalItems > 0 && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2 px-4">
                    <div className="text-sm text-center md:text-left">
                        Menampilkan {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} dari {totalItems} item
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={safeCurrentPage === 1}
                            className={`px-3 py-1 sm:px-2 sm:py-1 text-xs md:text-sm rounded-md ${safeCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                            aria-label="Previous page"
                        >
                            Sebelumnya
                        </button>

                        {/* Show fewer page numbers on mobile */}
                        {totalPages > 0 &&
                            Array.from({ length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= (window.innerWidth < 640 ? 3 : 5)) {
                                    pageNum = i + 1;
                                } else if (safeCurrentPage <= 2) {
                                    pageNum = i + 1;
                                } else if (safeCurrentPage >= totalPages - 1) {
                                    pageNum = totalPages - (window.innerWidth < 640 ? 2 : 4) + i;
                                } else {
                                    pageNum = safeCurrentPage - 1 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`px-3 py-1 cursor-pointer sm:px-2 sm:py-1 text-xs md:text-sm rounded-md ${safeCurrentPage === pageNum
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
                            className={`px-3 py-1 sm:px-2 sm:py-1 text-xs md:text-sm rounded-md ${safeCurrentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
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

export default TableDataIncome;