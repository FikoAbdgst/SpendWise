import React from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const Setting = ({ darkMode, toggleDarkMode, isLoggedIn, toggleMobileMenu }) => {
  return (
    <div className={`w-full h-full p-3 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className="flex items-center justify-center mb-5 md:mb-0 relative">
        {isLoggedIn && (
          <button
            className={`md:hidden absolute left-0 p-2 rounded-md bg-transparent border ${
              darkMode ? "text-600 border-gray-700" : " text-gray-500 border-gray-300"
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

        <h1
          className={`text-center md:text-start mb-1 md:mb-5 text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Settings
        </h1>
      </div>

      <div
        className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <FiMoon size={24} className="text-purple-400" />
            ) : (
              <FiSun size={24} className="text-orange-400" />
            )}
            <div>
              <p className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
                {darkMode ? "Dark Mode" : "Light Mode"}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {darkMode
                  ? "Switch to light mode for a brighter appearance"
                  : "Switch to dark mode for a darker appearance"}
              </p>
            </div>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-18 md:w-12 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
              darkMode ? "bg-purple-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
