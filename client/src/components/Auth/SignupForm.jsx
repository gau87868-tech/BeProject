// src/components/Auth/SignupForm.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import fetchFunction from "../../utils/fetchFunction";
import { SIGNUP_URL } from "../../utils/constants";
import { AuthContext } from "../../context/AuthContext";

export default function SignupForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [fetchError, setFetchError] = useState("");

  const { login, setLoading } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    let isValid = true;

    if (!fullName.trim()) {
      setNameError("Full name is required.");
      isValid = false;
    } else setNameError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else setEmailError("");

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",.<>/?\\|`~]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol."
      );
      isValid = false;
    } else setPasswordError("");

    if (!isValid) {
      setLoading(false);
      return;
    }

    const postData = {
      name: fullName,
      email,
      password,
    };

    const result = await fetchFunction({
      apiUrl: SIGNUP_URL,
      crudMethod: "POST",
      postData,
      setError: setFetchError,
    });

    console.log("SIGNUP RESULT", result);

    if (result?.status === "success") {
      // tokens come inside result.tokens
      const accessToken = result.tokens?.accessToken || null;
      const refreshToken = result.tokens?.refreshToken || null;

      // backend sends user or userDetails
      const userDetails = result.userDetails || result.user || null;

      if (accessToken) {
        localStorage.setItem("aiInterviewerAccessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("aiInterviewerRefreshToken", refreshToken);
      }

      if (userDetails) {
        login({ user: userDetails });
      }

      setLoading(false);
      navigate("/dashboard");
    } else {
      console.log("ERROR:", fetchError);
      setLoading(false);
    }
  };

  return (
    <>
      <header className="w-full fixed top-0 left-0 flex justify-between items-center px-10 py-4 bg-[#1e3a8a]/70 backdrop-blur-md shadow-lg border-b border-blue-400/30 z-50">
        <h1 className="flex items-center text-3xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
          <span className="text-white mr-2">🤖</span>
          AI <span className="text-blue-300 ml-1">Interviewer</span>
        </h1>

        <nav className="flex space-x-6 text-lg font-semibold">
          {/* <button
            onClick={() => (window.location.href = "/dashboard")}
            className="text-white hover:text-blue-400 transition"
          >
            Home
          </button> */}
          <button
            onClick={() => (window.location.href = "/about")}
            className="text-white hover:text-blue-400 transition"
          >
            About Us
          </button>
        </nav>
      </header>

      <div className="flex justify-between items-center min-h-screen px-10 bg-gradient-to-br from-[#a7c0f2] via-[#7ea1e8] to-[#a7c0f2] pt-24">
        <div className="flex flex-col justify-center w-1/2 pl-10">
          <h1 className="text-6xl font-extrabold text-brown-700 mb-4 drop-shadow-sm">
            AI Interviewer
          </h1>
          <p className="text-xl text-white-600 font-medium">
            Practice Smart. Interview Confidently.
          </p>
        </div>

        <div className="flex justify-center items-center w-1/2">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg w-96 text-center"
          >
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Create Account ✨
            </h1>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (nameError) setNameError("");
                }}
                required
                className={`p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  nameError ? "border-red-500" : ""
                }`}
              />
              {nameError && (
                <p className="text-red-500 text-sm font-medium -mt-2">
                  {nameError}
                </p>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                required
                className={`p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  emailError ? "border-red-500" : ""
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-sm font-medium -mt-2">
                  {emailError}
                </p>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  required
                  className={`p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordError ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm font-medium -mt-2">
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-4 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}