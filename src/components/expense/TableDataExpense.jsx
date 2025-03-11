import React, { useEffect } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa';

const TableDataExpense = ({ darkMode, handleSort, sortColumn, sortDirection, filteredExpenses, formatDate, formatCurrency, handleEdit, handleDelete }) => {

    useEffect(() => {
        console.log(filteredExpenses);
    }, []);

    return (

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                        <th
                            className="px-4 py-3 text-left cursor-pointer"
                            onClick={() => handleSort("date")}
                        >
                            <div className="flex items-center">
                                <span>Tanggal</span>
                            </div>
                        </th>
                        <th
                            className="px-4 py-3 text-left cursor-pointer"
                            onClick={() => handleSort("source")}
                        >
                            <div className="flex items-center">
                                <span>Sumber</span>
                                {sortColumn === "source" && (
                                    <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                                )}
                            </div>
                        </th>
                        <th
                            className="px-4 py-3 text-right cursor-pointer"
                            onClick={() => handleSort("amount")}
                        >
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
                    {filteredExpenses.map((expense) => (
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
                                        className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                                            }`}
                                        title="Edit"
                                    >
                                        <FaEdit className={darkMode ? "text-blue-400" : "text-blue-500"} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense.id)}
                                        className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                                            }`}
                                        title="Hapus"
                                    >
                                        <FaTrash className={darkMode ? "text-red-400" : "text-red-500"} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableDataExpense