import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // State untuk menyimpan error spesifik per field
  const [fieldErrors, setFieldErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        [name]: ""
      });
    }
  };

  const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://backend-spendwise.vercel.app'
    : 'http://localhost:3000';

  // Password validation function (client side)
  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const { full_name, email, password, confirmPassword } = formData;
    const errors = {};
    let isValid = true;

    // Validasi field kosong
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
    setGeneralError("");
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
        // Handle error berdasarkan response API
        if (data.field && data.message) {
          // API mengembalikan error spesifik untuk field tertentu
          setFieldErrors({
            ...fieldErrors,
            [data.field]: data.message
          });
        } else if (data.message && data.message.includes("email")) {
          // Jika pesan error berkaitan dengan email (seperti "email sudah terdaftar")
          setFieldErrors({
            ...fieldErrors,
            email: data.message
          });
        } else {
          throw new Error(data.message || "Registrasi gagal");
        }
        return;
      }

      setSuccess("Registrasi berhasil! Silahkan login.");

      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Cek apakah error message berisi kata "email" untuk menentukan apakah error terkait email
      if (err.message && err.message.toLowerCase().includes("email")) {
        setFieldErrors({
          ...fieldErrors,
          email: err.message
        });
      } else {
        setGeneralError(err.message || "Terjadi kesalahan saat registrasi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-8 rounded shadow-md w-96`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>Register</h2>

        {generalError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{generalError}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${fieldErrors.full_name ? "border-red-500" :
                darkMode ? "border-gray-600" : "border-gray-300"
                } ${darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
                }`}
              placeholder="Masukkan nama lengkap"
            />
            {fieldErrors.full_name && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.full_name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${fieldErrors.email ? "border-red-500" :
                darkMode ? "border-gray-600" : "border-gray-300"
                } ${darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
                }`}
              placeholder="Masukkan email"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${fieldErrors.password ? "border-red-500" :
                darkMode ? "border-gray-600" : "border-gray-300"
                } ${darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
                }`}
              placeholder="Masukkan password"
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div className="mb-6">
            <label className={`block mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${fieldErrors.confirmPassword ? "border-red-500" :
                darkMode ? "border-gray-600" : "border-gray-300"
                } ${darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-white text-gray-900 placeholder-gray-500"
                }`}
              placeholder="Masukkan konfirmasi password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;