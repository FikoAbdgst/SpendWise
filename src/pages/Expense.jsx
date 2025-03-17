import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTimes, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import FormInputExpense from "../components/expense/FormInputExpense";
import TableDataExpense from "../components/expense/TableDataExpense";

const Expense = ({ darkMode, isLoggedIn, toggleMobileMenu }) => {
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("💸");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Set default sort to created_at in descending order (newest first)
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date(),
    icon: "💸",
    amountNumeric: 0,
    category: "",
  });

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  // Fetch expenses whenever page, sort column, or sort direction changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchExpenses();
    }
  }, [currentPage, sortColumn, sortDirection, isLoggedIn]);

  // Filter expenses when search query or expenses change
  useEffect(() => {
    filterExpenses();
  }, [searchQuery, expenses]);

  // Calculate total amount when filtered expenses change
  useEffect(() => {
    const total = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    setTotalAmount(total);
  }, [filteredExpenses]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      // Always sort by created_at desc regardless of UI sort selection
      const url = `${apiUrl}/api/expenses?page=${currentPage}&limit=${itemsPerPage}&sort=${sortColumn}&order=${sortDirection}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const allData = result.data || [];
        setExpenses(allData);

        // Calculate total pages based on the total count from the API
        const totalCount = result.totalCount || allData.length;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setError(result.message || "Failed to fetch expenses");
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
        expense.description?.toLowerCase().includes(query) ||
        expense.amount?.toString().includes(query) ||
        expense.category?.toLowerCase().includes(query)
    );

    setFilteredExpenses(filtered);
  };

  const formatNumberWithDots = (value) => {
    if (!value) return "";
    // Remove non-numeric characters except for digits
    const numericValue = value.toString().replace(/[^\d]/g, "");
    // Add dots for thousands separator
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseFormattedNumber = (formattedValue) => {
    if (!formattedValue) return 0;
    // Remove dots and convert to number
    return Number(formattedValue.toString().replace(/\./g, "")) || 0;
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

    // Form validation
    if (!formData.amountNumeric || formData.amountNumeric <= 0) {
      toast.error("Jumlah harus diisi dengan nilai yang valid");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("Kategori pengeluaran tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Sesi login telah berakhir. Silakan login kembali.");
        setLoading(false);
        return;
      }

      const url = editMode ? `${apiUrl}/api/expenses/${editId}` : `${apiUrl}/api/expenses`;

      // Set the time to noon to avoid timezone issues
      const dateObj =
        formData.date instanceof Date ? new Date(formData.date) : new Date(formData.date);

      // Set time to 12:00:00 to prevent date shift due to timezone
      dateObj.setHours(12, 0, 0, 0);

      const formattedDate = dateObj.toISOString().split("T")[0];

      const dataToSend = {
        amount: formData.amountNumeric,
        date: formattedDate,
        icon: formData.icon,
        category: formData.category,
        // Don't send created_at field when updating - server should preserve it
      };

      const response = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success(
          editMode ? "Pengeluaran berhasil diperbarui!" : "Pengeluaran berhasil ditambahkan!"
        );
        resetForm();
        fetchExpenses();
      } else {
        setError(result.message || "Failed to save expense");
        toast.error(`Gagal menyimpan pengeluaran: ${result.message}`);
      }
    } catch (error) {
      setError("Error saving expense. Please try again.");
      console.error("Error saving expense:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      date: new Date(),
      icon: "💸",
      amountNumeric: 0,
      category: "",
    });
    setSelectedIcon("💸");
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (expense) => {
    // Format the amount to remove the decimal places
    const formattedAmount = formatNumberWithDots(String(Math.round(expense.amount || 0)));

    setFormData({
      amount: formattedAmount,
      amountNumeric: parseFloat(expense.amount || 0),
      date: new Date(expense.date),
      icon: expense.icon || "💸",
      category: expense.category || "",
    });
    setSelectedIcon(expense.icon || "💸");
    setEditMode(true);
    setEditId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Sesi login telah berakhir. Silakan login kembali.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/expenses/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Pengeluaran berhasil dihapus!");
        setShowConfirmDelete(false);
        fetchExpenses();
      } else {
        setError(result.message || "Failed to delete expense");
        toast.error("Gagal menghapus pengeluaran.");
      }
    } catch (error) {
      setError("Error deleting expense. Please try again.");
      console.error("Error deleting expense:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "Rp0";
    return `Rp${Math.round(amount).toLocaleString("id-ID")}`;
  };

  // This function is kept for UI interaction but doesn't affect actual API sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    // No need to make API call with sorting changes since we always sort by created_at
  };

  return (
    <div className={`w-full min-h-screen p-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center justify-center mb-5 md:mb-0 relative">
          {isLoggedIn && (
            <button
              className={`md:hidden absolute -left-18 p-2 rounded-md bg-transparent border ${darkMode ? "text-gray-600 border-gray-700" : "text-gray-500 border-gray-300"
                } transition-colors duration-200`}
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
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

          <h1 className="text-2xl font-bold">Kelola Pengeluaran</h1>
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
              aria-label="Search expenses"
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2 cursor-pointer rounded-md ${darkMode
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            aria-label="Add new expense"
          >
            <FaPlus />
            <span>Tambah Pengeluaran</span>
          </button>
        </div>
      </div>

      <FormInputExpense
        showForm={showForm}
        darkMode={darkMode}
        editMode={editMode}
        resetForm={resetForm}
        handleSubmit={handleSubmit}
        setShowIconSelector={setShowIconSelector}
        showIconSelector={showIconSelector}
        selectedIcon={selectedIcon}
        handleIconSelect={handleIconSelect}
        handleInputChange={handleInputChange}
        formData={formData}
        handleDateChange={handleDateChange}
        loading={loading}
        expenses={expenses} // Pass all expenses data for template suggestions
      />

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div
            className={`w-full max-w-md rounded-lg shadow-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"
              }`}
            role="dialog"
            aria-labelledby="delete-dialog-title"
          >
            <h2 id="delete-dialog-title" className="text-xl font-bold mb-4">
              Konfirmasi Hapus
            </h2>
            <p className="mb-6">Apakah Anda yakin ingin menghapus pengeluaran ini?</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className={`px-4 py-2 rounded-md cursor-pointer ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 disabled:opacity-50"
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
            <button
              onClick={() => {
                setError(null);
                fetchExpenses();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="p-6 text-center">
            <p>
              {searchQuery
                ? "Tidak ada hasil yang cocok dengan pencarian Anda."
                : "Belum ada data pengeluaran."}
            </p>
          </div>
        ) : (
          <TableDataExpense
            darkMode={darkMode}
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            filteredExpenses={filteredExpenses}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            handleEdit={handleEdit}
            handleDelete={(id) => {
              setDeleteId(id);
              setShowConfirmDelete(true);
            }}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={10}
          />
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-700">
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Expense;
