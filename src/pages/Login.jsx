import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ darkMode, setIsLoggedIn, setUsername }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-spendwise.vercel.app"
      : "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Validasi input
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // Simpan token di localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update state aplikasi
      setIsLoggedIn(true);
      setUsername(data.user.full_name || data.user.email);

      // Redirect ke halaman utama
      navigate("/");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-8 rounded shadow-md w-96`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>Login</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              placeholder="Masukkan email"
            />
          </div>

          <div className="mb-6">
            <label className={`block mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${darkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Belum punya akun?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;