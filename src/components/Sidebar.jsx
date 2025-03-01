import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = ({ username, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('isLogin');
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <FiBarChart2 size={20} /> },
        { name: 'Income', path: '/income', icon: <FiTrendingUp size={20} /> },
        { name: 'Expense', path: '/expense', icon: <FiTrendingDown size={20} /> },
        { name: 'Settings', path: '/settings', icon: <FiSettings size={20} /> }
    ];

    return (
        <div className="bg-white text-gray-500 w-full h-full flex flex-col border-r border-gray-200">
            {/* Logo */}
            <div className="px-6 py-6">
                <div className="flex justify-start items-center space-x-2">
                    <h2 className="text-xl font-bold text-black">Spend Wise</h2>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (location.pathname === '/' && item.path === '/');
                        return (
                            <li key={item.name} className="pr-14">
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 ${isActive
                                        ? 'bg-black text-white font-medium rounded-r-xl'
                                        : 'text-gray-500 hover:bg-gray-100 rounded-r-xl'
                                        }`}
                                >
                                    <span className="w-6">{item.icon}</span>
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout button */}
            <div className="py-10 pr-14 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 w-full text-gray-500 hover:bg-gray-100 rounded-r-xl"
                >
                    <FiLogOut size={20} className="w-6" />
                    <span className="ml-3">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;