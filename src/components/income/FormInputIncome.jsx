import React, { useState, useEffect } from "react";
import IconSelector from "../IconSelector";
import { FaSave, FaTimes, FaHistory } from "react-icons/fa";
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
  incomes = [], // We'll pass the existing incomes to use for templates
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate suggestions based on input
  useEffect(() => {
    if (formData.source && formData.source.length > 0) {
      // Filter incomes for matches in the source field
      const matchingSources = incomes
        .filter(income =>
          income.source.toLowerCase().includes(formData.source.toLowerCase()) &&
          income.source.toLowerCase() !== formData.source.toLowerCase() // Don't suggest exact matches
        )
        .map(income => ({
          source: income.source,
          icon: income.icon || "💰",
        }));

      // Remove duplicates by source name
      const uniqueSuggestions = Array.from(
        new Map(matchingSources.map(item => [item.source, item])).values()
      ).slice(0, 5); // Limit to 5 suggestions

      setSuggestions(uniqueSuggestions);
      setShowSuggestions(uniqueSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [formData.source, incomes]);

  // Apply a template suggestion
  const applyTemplate = (suggestion) => {
    handleInputChange({
      target: { name: "source", value: suggestion.source }
    });
    handleIconSelect(suggestion.icon);
    setShowSuggestions(false);
  };

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-10 p-4">
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

                <div className="relative">
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
                    autoComplete="off"
                  />

                  {/* Suggestions dropdown */}
                  {showSuggestions && (
                    <div className={`absolute z-10 mt-1 w-full rounded-md shadow-lg ${darkMode ? "bg-gray-700" : "bg-white border border-gray-300"
                      }`}>
                      <div className="py-1">
                        {suggestions.length > 0 && (
                          <div className={`px-4 py-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                            <div className="flex items-center gap-1">
                              <FaHistory size={12} />
                              <span>Riwayat pemasukan</span>
                            </div>
                          </div>
                        )}
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => applyTemplate(suggestion)}
                            className={`w-full text-left px-4 py-2 flex items-center gap-2 ${darkMode
                              ? "hover:bg-gray-600"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            <span className="text-xl">{suggestion.icon}</span>
                            <span>{suggestion.source}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
                    placeholder="0"
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
                  className={`flex items-center cursor-pointer justify-center gap-2 px-4 py-2 rounded-md ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-500 hover:bg-blue-600"
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