import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTimes, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import FormInputIncome from "../components/income/FormInputIncome";
import TableDataIncome from "../components/income/TableDataIncome";

const Income = ({ darkMode, isLoggedIn, toggleMobileMenu }) => {
  const [showForm, setShowForm] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
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

  // Set default sort to created_at in descending order (newest first)
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date(),
    icon: "💰",
    amountNumeric: 0,
  });

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  // Fetch incomes whenever page, sort column, or sort direction changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchIncomes();
    }
  }, [currentPage, sortColumn, sortDirection, isLoggedIn]);

  // Filter incomes when search query or incomes change
  useEffect(() => {
    filterIncomes();
  }, [searchQuery, incomes]);

  // Calculate total amount when filtered incomes change
  useEffect(() => {
    const total = filteredIncomes.reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);
    setTotalAmount(total);
  }, [filteredIncomes]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      // Always sort by created_at desc regardless of UI sort selection
      const url = `${apiUrl}/api/income?page=${currentPage}&limit=${itemsPerPage}&sort=created_at&order=desc`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const allData = result.data || [];
        setIncomes(allData);

        // Calculate total pages based on the total count from the API
        const totalCount = result.totalCount || allData.length;
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else {
        setError(result.message || "Failed to fetch incomes");
      }
    } catch (error) {
      setError("Error fetching incomes. Please try again.");
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterIncomes = () => {
    if (!searchQuery.trim()) {
      setFilteredIncomes(incomes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = incomes.filter(
      (income) =>
        income.source?.toLowerCase().includes(query) || income.amount?.toString().includes(query)
    );

    setFilteredIncomes(filtered);
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
    if (!formData.source.trim()) {
      toast.error("Sumber pemasukan tidak boleh kosong");
      return;
    }

    if (!formData.amountNumeric || formData.amountNumeric <= 0) {
      toast.error("Jumlah harus diisi dengan nilai yang valid");
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

      const url = editMode ? `${apiUrl}/api/income/${editId}` : `${apiUrl}/api/income`;

      // Set the time to noon to avoid timezone issues
      const dateObj =
        formData.date instanceof Date ? new Date(formData.date) : new Date(formData.date);

      // Set time to 12:00:00 to prevent date shift due to timezone
      dateObj.setHours(12, 0, 0, 0);

      const formattedDate = dateObj.toISOString().split("T")[0];

      const dataToSend = {
        source: formData.source,
        amount: formData.amountNumeric,
        date: formattedDate,
        icon: formData.icon,
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
        toast.success(editMode ? "Pemasukan berhasil diperbarui!" : "Pemasukan berhasil ditambahkan!");
        resetForm();
        fetchIncomes();
      } else {
        setError(result.message || "Failed to save income");
        toast.error(`Gagal menyimpan pemasukan: ${result.message}`);
      }
    } catch (error) {
      setError("Error saving income. Please try again.");
      console.error("Error saving income:", error);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      source: "",
      amount: "",
      date: new Date(),
      icon: "💰",
      amountNumeric: 0,
    });
    setSelectedIcon("💰");
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (income) => {
    // Format the amount to remove the decimal places
    const formattedAmount = formatNumberWithDots(String(Math.round(income.amount || 0)));

    setFormData({
      source: income.source || "",
      amount: formattedAmount,
      amountNumeric: parseFloat(income.amount || 0),
      date: new Date(income.date),
      icon: income.icon || "💰",
    });
    setSelectedIcon(income.icon || "💰");
    setEditMode(true);
    setEditId(income.id);
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

      const response = await fetch(`${apiUrl}/api/income/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Pemasukan berhasil dihapus!");
        setShowConfirmDelete(false);
        fetchIncomes();
      } else {
        setError(result.message || "Failed to delete income");
        toast.error("Gagal menghapus pemasukan.");
      }
    } catch (error) {
      setError("Error deleting income. Please try again.");
      console.error("Error deleting income:", error);
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
              className={`md:hidden absolute -left-18 p-2 rounded-md bg-transparent border ${
                darkMode ? "text-gray-600 border-gray-700" : "text-gray-500 border-gray-300"
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

          <h1 className="text-2xl font-bold">Kelola Pemasukan</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className={`relative rounded-md ${darkMode ? "bg-gray-700" : "bg-white"}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari pemasukan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-md w-full sm:w-64 outline-none ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800 border border-gray-300"
              }`}
              aria-label="Search incomes"
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2 cursor-pointer rounded-md ${
              darkMode
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            aria-label="Add new income"
          >
            <FaPlus />
            <span>Tambah Pemasukan</span>
          </button>
        </div>
      </div>

      <FormInputIncome
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
      />

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div
            className={`w-full max-w-md rounded-lg shadow-lg p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            role="dialog"
            aria-labelledby="delete-dialog-title"
          >
            <h2 id="delete-dialog-title" className="text-xl font-bold mb-4">
              Konfirmasi Hapus
            </h2>
            <p className="mb-6">Apakah Anda yakin ingin menghapus pemasukan ini?</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className={`px-4 py-2 rounded-md cursor-pointer ${
                  darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
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
          <h2 className="text-lg font-semibold">Total Pemasukan:</h2>
          <p className="text-xl font-bold text-green-500">{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {loading && incomes.length === 0 ? (
          <div className="p-6 text-center">
            <p>Memuat data pemasukan...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchIncomes();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredIncomes.length === 0 ? (
          <div className="p-6 text-center">
            <p>
              {searchQuery
                ? "Tidak ada hasil yang cocok dengan pencarian Anda."
                : "Belum ada data pemasukan."}
            </p>
          </div>
        ) : (
          <TableDataIncome
            darkMode={darkMode}
            handleSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            filteredIncomes={filteredIncomes}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={10}
          />
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className={`px-3 py-1 rounded-md cursor-pointer ${
                  currentPage === 1 || loading ? "opacity-50 cursor-not-allowed" : ""
                } ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                aria-label="Previous page"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || loading}
                className={`px-3 py-1 rounded-md cursor-pointer ${
                  currentPage === totalPages || loading ? "opacity-50 cursor-not-allowed" : ""
                } ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                aria-label="Next page"
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

export default Income;
