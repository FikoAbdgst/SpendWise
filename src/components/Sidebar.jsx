import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = ({ setIsLoggedIn, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FiBarChart2 size={20} /> },
    { name: "Income", path: "/income", icon: <FiTrendingUp size={20} /> },
    { name: "Expense", path: "/expense", icon: <FiTrendingDown size={20} /> },
    { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
  ];

  return (
    <div
      className={`${
        darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"
      } w-full h-full flex flex-col border-r ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } transition-colors duration-200`}
    >
      {/* Logo */}
      <div className="px-4 md:px-6 py-4 md:py-6">
        <div className="flex justify-start items-center space-x-2">
          <h2 className={`text-lg md:text-xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
            Spend Wise
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path || (location.pathname === "/" && item.path === "/");
            return (
              <li key={item.name} className="pr-4 md:pr-14">
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 md:py-3 rounded-r-xl transition-colors duration-200
                                         ${
                                           isActive
                                             ? darkMode
                                               ? "bg-gray-900 text-white font-semibold" // Warna active di dark mode
                                               : "bg-gray-200 text-black font-semibold" // Warna active di light mode
                                             : darkMode
                                             ? "text-gray-400 hover:bg-gray-700" // Warna non-active di dark mode
                                             : "text-gray-500 hover:bg-gray-100" // Warna non-active di light mode
                                         }`}
                >
                  <span className="w-6">{item.icon}</span>
                  <span className="ml-3 text-sm md:text-base">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="py-6 md:py-10 pr-4 md:pr-14 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex cursor-pointer items-center px-4 py-2 md:py-3 w-full ${
            darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"
          } rounded-r-xl transition-colors duration-200`}
        >
          <FiLogOut size={20} className="w-6" />
          <span className="ml-3 text-sm md:text-base">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
