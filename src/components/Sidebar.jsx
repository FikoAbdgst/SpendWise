import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = ({ setIsLoggedIn, darkMode, toggleMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleMenuClick = () => {
    // Close the sidebar on mobile when a menu item is clicked
    if (window.innerWidth < 768 && toggleMobileMenu) {
      toggleMobileMenu();
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FiBarChart2 size={20} /> },
    { name: "Income", path: "/income", icon: <FiTrendingUp size={20} /> },
    { name: "Expense", path: "/expense", icon: <FiTrendingDown size={20} /> },
    { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
  ];

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"
        } w-full h-full flex flex-col border-r ${darkMode ? "border-gray-700" : "border-gray-200"
        } transition-colors duration-300 shadow-lg`}
    >
      <div className="px-4 md:px-6 py-6 md:py-8">
        <div className="flex justify-start items-center space-x-3">
          <div className={`p-2 rounded-lg ${darkMode ? "bg-purple-500/20" : "bg-purple-100"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-8 w-8 ${darkMode ? "text-purple-500" : "text-purple-600"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className={`text-xl md:text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Spend<span className="text-purple-500">tvise</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (location.pathname === "/" && item.path === "/");
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={handleMenuClick}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden
                    ${isActive
                      ? darkMode
                        ? "bg-purple-600 text-white font-medium"
                        : "bg-purple-500 text-white font-medium"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >

                  <div className={`flex items-center justify-center w-8 h-8 ${isActive ? "text-white" : hoveredItem === item.name ? (darkMode ? "text-purple-400" : "text-purple-500") : ""
                    }`}>
                    {item.icon}
                  </div>
                  <span className="ml-3 text-sm md:text-base">{item.name}</span>

                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={`mx-4 mb-5 h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>


      <div className="mb-10 p-4 mt-auto">
        <button
          onClick={() => {
            handleLogout();
            handleMenuClick();
          }}
          className={`flex items-center cursor-pointer px-4 py-5 w-full rounded-xl transition-all duration-200
            ${darkMode
              ? "bg-gray-800 text-gray-300 hover:bg-red-900/50 hover:text-red-300"
              : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600"} 
          `}
        >
          <FiLogOut size={20} className="w-6" />
          <span className="ml-3 text-sm md:text-base font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;