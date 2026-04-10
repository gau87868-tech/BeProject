// src/components/Auth/LoginPage.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import { Eye, EyeOff, Building2 } from "lucide-react";
import fetchFunction from "../../utils/fetchFunction";
import { COMPANY_LOGIN_URL } from "../../utils/constants";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, setLoading } = useContext(CompanyAuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fetchError, setFetchError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setFetchError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else setEmailError("");

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else setPasswordError("");

    if (!isValid) return;

    setLoading(true);
    try {
      const result = await fetchFunction({
        apiUrl: COMPANY_LOGIN_URL,
        crudMethod: "POST",
        postData: { companyEmail :email, password },
        setError: setFetchError,
      });

      if (result?.status === "success") {
        login(
          result.organization,
          result.accessToken,
          result.refreshToken
        );
        navigate("/dashboard");
      } else {
        setFetchError(result?.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setFetchError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-12 h-12" />
            <span className="text-3xl font-bold">AI Interviewer</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Company Portal</h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Create AI-powered interviews, invite candidates, and evaluate performance 
            with intelligent scoring — all from one dashboard.
          </p>
          <div className="mt-8 space-y-3">
            {["Create & schedule interviews", "Invite candidates via email", "AI-powered evaluation & scoring", "Real-time analytics dashboard"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-indigo-200">
                <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <Building2 className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">AI Interviewer</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back 👋</h2>
          <p className="text-gray-500 mb-6">Sign in to your company account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="company@example.com"
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  emailError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Enter your password"
                  className={`w-full p-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            {/* Fetch Error */}
            {fetchError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {fetchError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
