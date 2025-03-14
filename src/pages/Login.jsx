import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from "@lottielab/lottie-player/react";

const Login = ({ darkMode, setIsLoggedIn, setUsername }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const animationRef = useRef(null);

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

  const switchState = (stateName) => {
    animationRef.current?.interactivity?.goToState(stateName, { duration: 0.1 });
  };

  const handleEmailFocus = () => switchState("Following");
  const handlePasswordFocus = () => switchState(showPassword ? "Peeking" : "Covering");
  const handleBlur = () => switchState("Blinking");

  useEffect(() => {
    animationRef.current?.interactivity?.inputs.set(
      "name_length",
      Math.min(formData.email.length / 32, 1)
    );
  }, [formData.email]);

  useEffect(() => {
    switchState(showPassword ? "Peeking" : "Covering");
  }, [showPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Email dan password harus diisi", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setLoading(true);

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);
      setUsername(data.user.full_name || data.user.email);

      navigate("/");
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan saat login", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-8 rounded shadow-md w-96 flex flex-col items-center`}
      >
        {/* Lottie Animation */}
        <div className="w-64 h-64">
          <Lottie src="https://cdn.lottielab.com/l/CvhgB3ExbfUqUH.json" ref={animationRef} />
        </div>

        <h2
          className={`text-2xl font-bold mb-4 text-center ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Login
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>Email</label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleEmailFocus}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Masukkan email"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className={`${darkMode ? "text-gray-200" : "text-gray-700"}`}>Password</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                className={`w-full px-3 py-2 border rounded ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                className={`absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
                onClick={() => setShowPassword(!showPassword)}
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
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
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 cursor-pointer text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
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
