import React from "react";
import IconSelector from "../IconSelector";
import { FaSave, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";

const FormInputIncome = ({
  showForm,
  darkMode,
  editMode,
  resetForm,
  handleSubmit,
  setShowIconSelector,
  showIconSelector,
  selectedIcon,
  handleIconSelect,
  handleInputChange,
  formData,
  handleDateChange,
  loading,
}) => {
  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div
            className={`w-full max-w-2xl rounded-lg shadow-lg p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editMode ? "Edit Pemasukan" : "Tambah Pemasukan Baru"}
              </h2>
              <button
                onClick={resetForm}
                className={`p-2 rounded-full cursor-pointer hover:bg-opacity-10 ${
                  darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
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
                    className={`w-full flex items-center justify-between px-4 py-2 cursor-pointer rounded-md ${
                      darkMode
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
                    className={`w-full px-4 py-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800 border border-gray-300"
                    }`}
                    placeholder="Gaji, Bonus, dll"
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
                    className={`w-full px-4 py-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800 border border-gray-300"
                    }`}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className={`w-full px-4 py-2 rounded-md ${
                      darkMode
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
                  className={`px-4 py-2 cursor-pointer rounded-md ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-md ${
                    darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-500 hover:bg-blue-600"
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
    </>
  );
};

export default FormInputIncome;
