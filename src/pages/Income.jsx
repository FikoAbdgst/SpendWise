import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTimes, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconSelector from "../components/IconSelector";

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
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date(),
    icon: "💰",
  });

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  useEffect(() => {
    fetchIncomes();
  }, [currentPage, sortColumn, sortDirection]);

  useEffect(() => {
    filterIncomes();
  }, [searchQuery, incomes]);

  useEffect(() => {
    const total = filteredIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    setTotalAmount(total);
  }, [filteredIncomes]);

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const url = `${apiUrl}/api/income?page=${currentPage}&limit=${itemsPerPage}&sort=${sortColumn}&order=${sortDirection}`;
      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        setIncomes(result.data || []);
        setTotalPages(Math.ceil(result.count / itemsPerPage));
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
        income.source.toLowerCase().includes(query) || income.amount.toString().includes(query)
    );

    setFilteredIncomes(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const url = editMode ? `${apiUrl}/api/income/${editId}` : `${apiUrl}/api/income`;

      const formattedDate =
        formData.date instanceof Date
          ? formData.date.toISOString().split("T")[0]
          : new Date(formData.date).toISOString().split("T")[0];

      console.log("Data yang akan dikirim:", {
        source: formData.source,
        amount: parseFloat(formData.amount),
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
          source: formData.source,
          amount: parseFloat(formData.amount),
          date: formattedDate,
          icon: formData.icon,
        }),
      });

      const result = await response.json();
      console.log("Response dari server:", result);

      if (result.success) {
        setNotification({
          show: true,
          message: editMode ? "Pemasukan berhasil diperbarui!" : "Pemasukan berhasil ditambahkan!",
          type: "success",
        });

        resetForm();
        fetchIncomes();
      } else {
        setError(result.message || "Failed to save income");
        setNotification({
          show: true,
          message: `Gagal menyimpan pemasukan: ${result.message}`,
          type: "error",
        });
      }
    } catch (error) {
      setError("Error saving income. Please try again.");
      console.error("Error saving income:", error);
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
      source: "",
      amount: "",
      date: new Date(),
      icon: "💰",
    });
    setSelectedIcon("💰");
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEdit = (income) => {
    setFormData({
      source: income.source,
      amount: income.amount,
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
      const response = await fetch(`${apiUrl}/api/income/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          show: true,
          message: "Pemasukan berhasil dihapus!",
          type: "success",
        });

        fetchIncomes();
      } else {
        setError(result.message || "Failed to delete income");
        setNotification({
          show: true,
          message: "Gagal menghapus pemasukan.",
          type: "error",
        });
      }
    } catch (error) {
      setError("Error deleting income. Please try again.");
      console.error("Error deleting income:", error);
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
              placeholder="Cari pemasukan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-md w-full sm:w-64 outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800 border border-gray-300"
                }`}
            />
          </div>

          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2 cursor-pointer rounded-md ${darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            <FaPlus />
            <span>Tambah Pemasukan</span>
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
                {editMode ? "Edit Pemasukan" : "Tambah Pemasukan Baru"}
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
                    className={`w-full flex items-center justify-between px-4 py-2 cursor-pointer rounded-md ${darkMode
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
                  <label className="block text-sm font-medium mb-1">Sumber Pemasukan</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-md ${darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-800 border border-gray-300"
                      }`}
                    placeholder="Gaji, Bonus, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Jumlah (Rp)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className={`w-full px-4 py-2 rounded-md ${darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-800 border border-gray-300"
                      }`}
                    placeholder="100000"
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
            <p className="mb-6">Apakah Anda yakin ingin menghapus pemasukan ini?</p>

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
                className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600"
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
          </div>
        ) : filteredIncomes.length === 0 ? (
          <div className="p-6 text-center">
            <p>Belum ada data pemasukan.</p>
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
                {filteredIncomes.map((income) => (
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
                          className={`p-2 rounded-full cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                            }`}
                          title="Edit"
                        >
                          <FaEdit className={darkMode ? "text-blue-400" : "text-blue-500"} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(income.id);
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

export default Income;
