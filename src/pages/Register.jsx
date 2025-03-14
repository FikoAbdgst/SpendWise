import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset error untuk field ini saat user mengetik
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }

    // Update password strength indicators in real-time
    if (name === "password") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
      });
    }
  };

  // Password validation function (client side)
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const { full_name, email, password, confirmPassword } = formData;
    const errors = {};
    let isValid = true;

    if (!full_name.trim()) {
      errors.full_name = "Nama lengkap tidak boleh kosong";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "Email tidak boleh kosong";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password tidak boleh kosong";
      isValid = false;
    } else if (!validatePassword(password)) {
      errors.password = "Password minimal 8 karakter dengan huruf besar, huruf kecil, dan angka";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak boleh kosong";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Password dan konfirmasi password tidak cocok";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset field errors
    setFieldErrors({
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Validasi form
    if (!validateForm()) {
      return;
    }

    const { full_name, email, password, confirmPassword } = formData;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field && data.message) {
          setFieldErrors({
            ...fieldErrors,
            [data.field]: data.message,
          });
        } else if (data.message && data.message.includes("email")) {
          setFieldErrors({
            ...fieldErrors,
            email: data.message,
          });
        } else {
          throw new Error(data.message || "Registrasi gagal");
        }
        return;
      }

      toast.success("Registrasi berhasil! Silahkan login.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes("email")) {
        setFieldErrors({
          ...fieldErrors,
          email: err.message,
        });
      } else {
        toast.error(err.message || "Terjadi kesalahan saat registrasi", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Style for password strength indicators
  const getStrengthColor = (isValid) => {
    return isValid ? "text-green-500" : darkMode ? "text-gray-500" : "text-gray-400";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-300`}
      >
        <div className="mb-8 text-center">
          <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Buat Akun Baru
          </h2>
          <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Daftar untuk mulai mengelola keuangan Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className={`block mb-2 font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  fieldErrors.full_name
                    ? "border-red-500 focus:ring-red-200"
                    : darkMode
                    ? "border-gray-600 bg-gray-700 text-white focus:ring-green-800 focus:border-green-500"
                    : "border-gray-300 bg-white text-gray-900 focus:ring-green-100 focus:border-green-500"
                }`}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            {fieldErrors.full_name && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{fieldErrors.full_name}</span>
              </div>
            )}
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              Email
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  fieldErrors.email
                    ? "border-red-500 focus:ring-red-200"
                    : darkMode
                    ? "border-gray-600 bg-gray-700 text-white focus:ring-green-800 focus:border-green-500"
                    : "border-gray-300 bg-white text-gray-900 focus:ring-green-100 focus:border-green-500"
                }`}
                placeholder="Masukkan email"
              />
            </div>
            {fieldErrors.email && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{fieldErrors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              Password
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  fieldErrors.password
                    ? "border-red-500 focus:ring-red-200"
                    : darkMode
                    ? "border-gray-600 bg-gray-700 text-white focus:ring-green-800 focus:border-green-500"
                    : "border-gray-300 bg-white text-gray-900 focus:ring-green-100 focus:border-green-500"
                }`}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 ${
                  darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m1.834 1.839a10.055 10.055 0 01-5.201 2.893"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{fieldErrors.password}</span>
              </div>
            )}

            {formData.password && (
              <div className={`mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm`}>
                <div className={`flex items-center ${getStrengthColor(passwordStrength.length)}`}>
                  {passwordStrength.length ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 mr-1 border rounded-full border-current"></span>
                  )}
                  <span>Minimal 8 karakter</span>
                </div>
                <div className={`flex items-center ${getStrengthColor(passwordStrength.uppercase)}`}>
                  {passwordStrength.uppercase ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 mr-1 border rounded-full border-current"></span>
                  )}
                  <span>Huruf kapital</span>
                </div>
                <div className={`flex items-center ${getStrengthColor(passwordStrength.lowercase)}`}>
                  {passwordStrength.lowercase ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 mr-1 border rounded-full border-current"></span>
                  )}
                  <span>Huruf kecil</span>
                </div>
                <div className={`flex items-center ${getStrengthColor(passwordStrength.number)}`}>
                  {passwordStrength.number ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 mr-1 border rounded-full border-current"></span>
                  )}
                  <span>Angka</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              className={`block mb-2 font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}
            >
              Konfirmasi Password
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus:ring-red-200"
                    : darkMode
                    ? "border-gray-600 bg-gray-700 text-white focus:ring-green-800 focus:border-green-500"
                    : "border-gray-300 bg-white text-gray-900 focus:ring-green-100 focus:border-green-500"
                }`}
                placeholder="Konfirmasi password Anda"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 ${
                  darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m1.834 1.839a10.055 10.055 0 01-5.201 2.893"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{fieldErrors.confirmPassword}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Mendaftar...</span>
              </div>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
