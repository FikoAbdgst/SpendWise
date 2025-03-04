import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Setting from "./pages/Setting";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token instead of isLogin flag
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setIsLoggedIn(true);
        setUsername(userData.full_name || userData.email);
      } catch (error) {
        // If JSON parsing fails, clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    setDarkMode(isDarkMode);
    setIsLoading(false);
  }, []);

  // Update document body class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-900");
    } else {
      document.body.classList.remove("bg-gray-900");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("isDarkMode", newDarkMode.toString());
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
  };

  const ProtectedRoute = ({ element }) => {
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".sidebar-container")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""}`}>
        {/* Sidebar for desktop */}
        {isLoggedIn && (
          <div className="hidden md:block md:w-64 h-full sidebar-container">
            <Sidebar username={username} setIsLoggedIn={handleLogout} darkMode={darkMode} />
          </div>
        )}

        {/* Mobile sidebar (will slide in) */}
        {isLoggedIn && (
          <div
            className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform sidebar-container ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar username={username} setIsLoggedIn={handleLogout} darkMode={darkMode} />
          </div>
        )}

        {/* Overlay for mobile menu */}
        {isLoggedIn && isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <div
          className={`flex-1 overflow-auto ${
            darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
          } transition-colors duration-200`}
        >
          {/* Mobile menu toggle button */}
          {isLoggedIn && (
            <button
              className={`md:hidden fixed top-5 left-5 p-2 rounded-md bg-transparent border ${
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

          <div className={`p-3 md:p-6 ${isLoggedIn ? "md:ml-0 pt-3" : ""}`}>
            <Routes>
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/" />
                  ) : (
                    <Login
                      setIsLoggedIn={setIsLoggedIn}
                      setUsername={setUsername}
                      darkMode={darkMode}
                    />
                  )
                }
              />
              <Route
                path="/register"
                element={isLoggedIn ? <Navigate to="/" /> : <Register darkMode={darkMode} />}
              />

              <Route
                path="/"
                element={<ProtectedRoute element={<Dashboard darkMode={darkMode} />} />}
              />
              <Route
                path="/income"
                element={<ProtectedRoute element={<Income darkMode={darkMode} />} />}
              />
              <Route
                path="/expense"
                element={<ProtectedRoute element={<Expense darkMode={darkMode} />} />}
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute
                    element={<Setting darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
