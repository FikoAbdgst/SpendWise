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
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br px-4 py-8 ${darkMode ? "from-gray-900 to-gray-800" : "from-blue-50 to-indigo-100"
        }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-20 -left-20 w-40 md:w-64 h-40 md:h-64 rounded-full ${darkMode ? "bg-blue-900/10" : "bg-blue-500/10"
            }`}
        ></div>
        <div
          className={`absolute top-1/4 -right-20 w-64 md:w-96 h-64 md:h-96 rounded-full ${darkMode ? "bg-purple-900/10" : "bg-indigo-500/10"
            }`}
        ></div>
        <div
          className={`absolute -bottom-20 left-1/3 w-48 md:w-80 h-48 md:h-80 rounded-full ${darkMode ? "bg-indigo-900/10" : "bg-purple-500/10"
            }`}
        ></div>
      </div>

      <div
        className={`relative z-10 ${darkMode ? "bg-gray-800/90" : "bg-white/90"
          } p-4 sm:p-6 md:p-8 rounded-xl shadow-xl backdrop-blur-sm w-full max-w-sm sm:max-w-md flex flex-col items-center border ${darkMode ? "border-gray-700" : "border-gray-200"
          }`}
      >
        {/* Responsive Lottie Animation */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-2">
          <Lottie src="https://cdn.lottielab.com/l/CvhgB3ExbfUqUH.json" ref={animationRef} />
        </div>

        <h2
          className={`text-xl sm:text-2xl font-bold mb-1 text-center ${darkMode ? "text-white" : "text-gray-800"
            }`}
        >
          Selamat Datang
        </h2>

        <p
          className={`text-xs sm:text-sm mb-4 sm:mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Masuk ke akun SpendTvise Anda
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                className={`text-xs sm:text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Email
              </label>
            </div>
            <div
              className={`relative focus-within:ring-2 focus-within:ring-offset-2 ${darkMode ? "focus-within:ring-blue-500" : "focus-within:ring-blue-600"
                } rounded-md`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleEmailFocus}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-3 py-2 sm:py-2.5 text-sm border rounded-md transition duration-200 ${darkMode
                    ? "bg-gray-700/70 border-gray-600 text-white placeholder-gray-400 outline-none focus:border-blue-500"
                    : "bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500"
                  }`}
                placeholder="Masukkan email"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                className={`text-xs sm:text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
              >
                Password
              </label>
            </div>
            <div
              className={`relative focus-within:ring-2 focus-within:ring-offset-2 ${darkMode ? "focus-within:ring-blue-500" : "focus-within:ring-blue-600"
                } rounded-md`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
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
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-10 py-2 sm:py-2.5 text-sm border rounded-md transition duration-200 ${darkMode
                    ? "bg-gray-700/70 border-gray-600 text-white placeholder-gray-400 outline-none focus:border-blue-500"
                    : "bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500 outline-none focus:border-blue-500"
                  }`}
                placeholder="Masukkan password"
              />
              <button
                type="button"
                className={`absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center ${darkMode ? "text-gray-300 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                  }`}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
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
                    className="h-4 w-4 sm:h-5 sm:w-5"
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
            className={`w-full cursor-pointer py-2 sm:py-2.5 px-4 rounded-md text-sm font-medium transition duration-300 shadow-md ${loading
                ? `${darkMode ? "bg-gray-600 text-gray-300" : "bg-gray-400 text-white"
                } cursor-not-allowed`
                : `${darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`
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
                <span>Memproses...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>Masuk</span>
              </div>
            )}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Belum punya akun?{" "}
            <Link
              to="/register"
              className={`font-medium ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                }`}
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
