import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Setting from "./pages/Setting";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

  useEffect(() => {
    // Check for token instead of isLogin flag
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("user");
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";
    const storedLastActivity = localStorage.getItem("lastActivity");

    if (token && userDataString) {
      try {
        const userData = JSON.parse(userDataString);

        // Check if session has expired
        if (storedLastActivity && Date.now() - parseInt(storedLastActivity) > SESSION_TIMEOUT) {
          // Session expired, force logout
          handleLogout("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          setIsLoggedIn(true);
          setUsername(userData.full_name || userData.email);
          setLastActivity(storedLastActivity ? parseInt(storedLastActivity) : Date.now());
          // Update last activity time
          localStorage.setItem("lastActivity", Date.now().toString());
        }
      } catch (error) {
        // If JSON parsing fails, clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastActivity");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    setDarkMode(isDarkMode);
    setIsLoading(false);
  }, []);

  // Setup event listeners to track user activity
  useEffect(() => {
    if (!isLoggedIn) return;

    const updateLastActivity = () => {
      const currentTime = Date.now();
      setLastActivity(currentTime);
      localStorage.setItem("lastActivity", currentTime.toString());
    };

    // List of events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown"
    ];

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, updateLastActivity);
    });

    // Cleanup function
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastActivity);
      });
    };
  }, [isLoggedIn]);

  // Check for inactivity
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkInactivity = setInterval(() => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;

      if (inactiveTime > SESSION_TIMEOUT) {
        handleLogout("Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan login kembali.");
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInactivity);
  }, [isLoggedIn, lastActivity]);

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

  const handleLogout = (message) => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
    setIsLoggedIn(false);
    setUsername("");

    // Show message if provided
    if (message) {
      toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
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
      <ToastContainer
        limit={3} // Batasi hanya 3 toast yang muncul bersamaan
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={`flex h-screen overflow-hidden ${darkMode ? "dark" : ""}`}>
        {/* Sidebar for desktop */}
        {isLoggedIn && (
          <div className="hidden md:block md:w-64 h-full sidebar-container">
            <Sidebar
              username={username}
              setIsLoggedIn={handleLogout}
              darkMode={darkMode}
              toggleMobileMenu={toggleMobileMenu}
            />
          </div>
        )}

        {/* Mobile sidebar (will slide in) */}
        {isLoggedIn && (
          <div
            className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform sidebar-container ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <Sidebar
              username={username}
              setIsLoggedIn={handleLogout}
              darkMode={darkMode}
              toggleMobileMenu={toggleMobileMenu}
            />
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
          className={`flex-1 overflow-auto ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
            } transition-colors duration-200`}
        >
          {/* Mobile menu toggle button */}

          <div className={` ${isLoggedIn ? "md:ml-0 pt-3" : ""}`}>
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
                element={
                  <ProtectedRoute
                    element={
                      <Dashboard
                        isLoggedIn={isLoggedIn}
                        toggleMobileMenu={toggleMobileMenu}
                        darkMode={darkMode}
                      />
                    }
                  />
                }
              />
              <Route
                path="/income"
                element={
                  <ProtectedRoute
                    element={
                      <Income
                        isLoggedIn={isLoggedIn}
                        toggleMobileMenu={toggleMobileMenu}
                        darkMode={darkMode}
                      />
                    }
                  />
                }
              />
              <Route
                path="/expense"
                element={
                  <ProtectedRoute
                    element={
                      <Expense
                        isLoggedIn={isLoggedIn}
                        toggleMobileMenu={toggleMobileMenu}
                        darkMode={darkMode}
                      />
                    }
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute
                    element={
                      <Setting
                        darkMode={darkMode}
                        isLoggedIn={isLoggedIn}
                        toggleMobileMenu={toggleMobileMenu}
                        toggleDarkMode={toggleDarkMode}
                      />
                    }
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