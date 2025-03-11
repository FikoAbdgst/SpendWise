import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMoon, FiSun, FiUser, FiLock, FiSave, FiAlertTriangle } from "react-icons/fi";
import { toast } from "react-toastify";

const Setting = ({ darkMode, toggleDarkMode, isLoggedIn, toggleMobileMenu }) => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const apiUrl =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not logged in");
        return;
      }

      const response = await axios.get(`${apiUrl}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProfileData({
          full_name: response.data.user.full_name,
          email: response.data.user.email,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Password Baru is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(`${apiUrl}/api/auth/update-profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Profil berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${apiUrl}/api/auth/update-password`,
        {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Password berhasil diperbarui");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

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
          className={`text-center md:text-start mb-5 text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Settings
        </h1>
      </div>

      <div className={`mb-6 flex border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`px-4 py-2 mr-2 cursor-pointer font-medium ${
            activeTab === "appearance"
              ? darkMode
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-blue-500 border-b-2 border-blue-500"
              : darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          Penampilan
        </button>
        {isLoggedIn && (
          <>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 mr-2 cursor-pointer font-medium ${
                activeTab === "profile"
                  ? darkMode
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-blue-500 border-b-2 border-blue-500"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-4 py-2 cursor-pointer font-medium ${
                activeTab === "password"
                  ? darkMode
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-blue-500 border-b-2 border-blue-500"
                  : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Password
            </button>
          </>
        )}
      </div>

      {activeTab === "appearance" && (
        <div
          className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
            darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
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
                    ? "Beralih ke mode terang untuk tampilan yang lebih cerah"
                    : "Beralih ke mode gelap untuk tampilan yang lebih gelap"}
                </p>
              </div>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-19 md:w-12 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
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
      )}

      {isLoggedIn && activeTab === "profile" && (
        <div
          className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
            darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-5">
            <FiUser size={24} className={darkMode ? "text-purple-400" : "text-blue-500"} />
            <h2 className={`font-medium text-lg ${darkMode ? "text-white" : "text-black"}`}>
              Profile Settings
            </h2>
          </div>

          <form onSubmit={updateProfile}>
            <div className="mb-4">
              <label
                htmlFor="full_name"
                className={`block font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={profileData.full_name}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 rounded-md focus:outline-none 
                  ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                  } 
                  ${errors.full_name ? "border-red-500" : ""}
                `}
                placeholder="Enter your full name"
              />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className={`block font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className={`w-full px-4 py-2 rounded-md focus:outline-none 
                  ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                  } 
                  ${errors.email ? "border-red-500" : ""}
                `}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center cursor-pointer justify-center py-2 px-6 rounded-md font-medium transition-colors ${
                darkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? (
                <span className="animate-pulse">Menyimpan...</span>
              ) : (
                <>
                  <FiSave className="mr-2" /> Simpan Perubahan
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {isLoggedIn && activeTab === "password" && (
        <div
          className={`p-6 rounded-xl shadow-md transition-colors duration-200 ${
            darkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-5">
            <FiLock size={24} className={darkMode ? "text-purple-400" : "text-blue-500"} />
            <h2 className={`font-medium text-lg ${darkMode ? "text-white" : "text-black"}`}>
              Ganti Password
            </h2>
          </div>

          <form onSubmit={updatePassword}>
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className={`block font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Password saat ini
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 rounded-md focus:outline-none 
                  ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                  } 
                  ${errors.currentPassword ? "border-red-500" : ""}
                `}
                placeholder="Masukkan password saat ini"
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className={`block font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Password Baru
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 rounded-md focus:outline-none 
                  ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                  } 
                  ${errors.newPassword ? "border-red-500" : ""}
                `}
                placeholder="Masukkan password baru"
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
            </div>

            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className={`block font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 rounded-md focus:outline-none 
                  ${
                    darkMode
                      ? "bg-gray-700 text-white border-gray-600 focus:ring-purple-500"
                      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
                  } 
                  ${errors.confirmPassword ? "border-red-500" : ""}
                `}
                placeholder="Konfirmasi Password Baru"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div
              className={`border-l-4 p-4 mb-5 ${
                darkMode ? "bg-yellow-900/20 border-yellow-600" : "bg-yellow-50 border-yellow-400"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FiAlertTriangle
                    className={`h-5 w-5 ${darkMode ? "text-yellow-500" : "text-yellow-400"}`}
                  />
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                    Pastikan kata sandi baru Anda setidaknya terdiri dari 6 karakter dan mengandung
                    campuran huruf, angka, dan simbol untuk keamanan yang lebih baik.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex cursor-pointer items-center justify-center py-2 px-6 rounded-md font-medium transition-colors ${
                darkMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? (
                <span className="animate-pulse">Memperbarui...</span>
              ) : (
                <>
                  <FiLock className="mr-2" /> Update Password
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Setting;
