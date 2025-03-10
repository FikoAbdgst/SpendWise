import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTimes, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconSelector from "../components/IconSelector";

const Expense = ({ darkMode, isLoggedIn, toggleMobileMenu }) => {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💰");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: new Date(),
    icon: "💰",
  });

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, sortColumn, sortDirection]);

  useEffect(() => {
    filterExpenses();
  }, [searchQuery, expenses]);

  useEffect(() => {
    const total = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    setTotalAmount(total);
  }, [filteredExpenses]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const url = `${apiUrl}/api/expenses?page=${currentPage}&limit=${itemsPerPage}&sort=${sortColumn}&order=${sortDirection}`;
      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        const allData = result.data || [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedData = allData.slice(startIndex, startIndex + itemsPerPage);
        setExpenses(paginatedData);
        setTotalPages(Math.ceil(allData.length / itemsPerPage));
      }
    } catch (error) {
      setError("Error fetching expenses. Please try again.");
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    if (!searchQuery.trim()) {
      setFilteredExpenses(expenses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = expenses.filter(
      (expense) =>
        expense.category.toLowerCase().includes(query) || expense.amount.toString().includes(query)
    );

    setFilteredExpenses(filtered);
  };

  const formatNumberWithDots = (value) => {
    const numericValue = value.replace(/\D/g, "");

    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseFormattedNumber = (formattedValue) => {
    return formattedValue.replace(/\./g, "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const numericValue = parseFormattedNumber(value);
      const formattedValue = formatNumberWithDots(value);

      setFormData({
        ...formData,
        [name]: formattedValue,
        amountNumeric: numericValue,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    setFormData({ ...formData, icon });
    setShowIconSelector(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = editMode ? `${apiUrl}/api/expenses/${editId}` : `${apiUrl}/api/expenses`;

      const formattedDate =
        formData.date instanceof Date
          ? formData.date.toISOString().split("T")[0]
          : new Date(formData.date).toISOString().split("T")[0];

      console.log("Data yang akan dikirim:", {
        category: formData.category,
        amount: formData.amountNumeric,
        date: formattedDate,
        icon: formData.icon,
      });

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: formData.category,
          amount: formData.amountNumeric,
          date: formattedDate,
          icon: formData.icon,
        }),
      });

      const result = await response.json();
      console.log("Response dari server:", result);

      if (result.success) {
        setNotification({
          show: true,
          message: editMode ? "Pengeluaran berhasil diperbarui!" : "Pengeluaran berhasil ditambahkan!",
          type: "success",
        });

        resetForm();
        fetchExpenses();
      } else {
        setError(result.message || "Failed to save expense");
        setNotification({
          show: true,
          message: `Gagal menyimpan pengeluaran: ${result.message}`,
          type: "error",
        });
      }
    } catch (error) {
      setError("Error saving expense. Please try again.");
      console.error("Error saving expense:", error);
      setNotification({
        show: true,
        message: "Terjadi kesalahan. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      amount: "",
      date: new Date(),
      icon: "💰",
    });
    setSelectedIcon("💰");
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (expense) => {
    // Format the amount to remove the decimal places
    const formattedAmount = formatNumberWithDots(String(Math.round(expense.amount)));

    setFormData({
      source: expense.source,
      amount: formattedAmount,
      date: new Date(expense.date),
      icon: expense.icon || "💰",
    });
    setSelectedIcon(expense.icon || "💰");
    setEditMode(true);
    setEditId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/expenses/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          show: true,
          message: "Pengeluaran berhasil dihapus!",
          type: "success",
        });

        fetchExpenses();
      } else {
        setError(result.message || "Failed to delete expense");
        setNotification({
          show: true,
          message: "Gagal menghapus pengeluaran.",
          type: "error",
        });
      }
    } catch (error) {
      setError("Error deleting expense. Please try again.");
      console.error("Error deleting expense:", error);
      setNotification({
        show: true,
        message: "Terjadi kesalahan. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setLoading(false);
      setShowConfirmDelete(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `Rp${Math.round(amount).toLocaleString("id-ID")}`;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className={`w-full min-h-screen p-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center justify-center mb-5 md:mb-0 relative">
          {isLoggedIn && (
            <button
              className={`md:hidden absolute -left-18 p-2 rounded-md bg-transparent border ${darkMode ? "text-600 border-gray-700" : " text-gray-500 border-gray-300"
                } transition-colors duration-200`}
              onClick={toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <h1 className="text-2xl font-bold ">Kelola Pemasukan</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className={`relative rounded-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari pengeluaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-md w-full sm:w-64 outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800 border border-gray-300"
                }`}
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-md ${darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            <FaPlus />
            <span>Tambah Pengeluaran</span>
          </button>
        </div>
      </div>

      {notification.show && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-md ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
        >
          {notification.message}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div
            className={`w-full max-w-2xl rounded-lg shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editMode ? "Edit Pengeluaran" : "Tambah Pengeluaran Baru"}
              </h2>
              <button
                onClick={resetForm}
                className={`p-2 rounded-full cursor-pointer hover:bg-opacity-10 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                  }`}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <button
                    type="button"
                    onClick={() => setShowIconSelector(!showIconSelector)}
                    className={`w-full cursor-pointer flex items-center justify-between px-4 py-2 rounded-md ${darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <span className="text-2xl">{selectedIcon}</span>
                    <span>Pilih Icon</span>
                  </button>
                  {showIconSelector && (
                    <div className="mt-2">
                      <IconSelector onSelectIcon={handleIconSelect} darkMode={darkMode} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sumber Pengeluaran</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-md ${darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800 border border-gray-300"
                      }`}
                    placeholder="Belanja, Transportasi, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Jumlah (Rp)</label>
                  <input
                    type="text"
                    name="amount"
                    min={0}
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-md ${darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800 border border-gray-300"
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className={`w-full px-4 py-2 rounded-md ${darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800 border border-gray-300"
                      }`}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-4 py-2 cursor-pointer rounded-md ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-md ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                >
                  {loading ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <FaSave />
                      <span>Simpan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div
            className={`w-full max-w-md rounded-lg shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-6">Apakah Anda yakin ingin menghapus pengeluaran ini?</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className={`px-4 py-2 cursor-pointer rounded-md ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white cursor-pointer rounded-md hover:bg-red-600"
              >
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`mb-4 p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Total Pengeluaran:</h2>
          <p className="text-xl font-bold text-red-500">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {loading && expenses.length === 0 ? (
          <div className="p-6 text-center">
            <p>Memuat data pengeluaran...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-6 text-center">
            <p>Belum ada data pengeluaran.</p>
          </div>
        ) : (
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
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      <span>Sumber</span>
                      {sortColumn === "category" && (
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
                          onClick={() => {
                            setDeleteId(expense.id);
                            setShowConfirmDelete(true);
                          }}
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
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md cursor-pointer ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  } ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md cursor-pointer ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  } ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;
