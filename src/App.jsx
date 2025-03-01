import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Setting from './pages/Setting';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLogin') === 'true';
    const currentUser = localStorage.getItem('currentUser');

    setIsLoggedIn(loginStatus);
    if (currentUser) {
      setUsername(currentUser);
    }
  }, []);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar for desktop */}
        {isLoggedIn && (
          <div className={`hidden md:block md:w-64 h-full`}>
            <Sidebar username={username} setIsLoggedIn={setIsLoggedIn} />
          </div>
        )}

        {/* Mobile sidebar (will slide in) */}
        {isLoggedIn && (
          <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            <Sidebar username={username} setIsLoggedIn={setIsLoggedIn} />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {/* Mobile menu toggle button */}
          {isLoggedIn && (
            <button
              className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-200 text-gray-700"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className={`p-3 md:p-6 ${isLoggedIn ? 'md:ml-0 pt-14 md:pt-6' : ''}`}>
            <Routes>
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
              <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />

              <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/income" element={<ProtectedRoute element={<Income />} />} />
              <Route path="/expense" element={<ProtectedRoute element={<Expense />} />} />
              <Route path="/settings" element={<ProtectedRoute element={<Setting />} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;