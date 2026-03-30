// src/components/About/AboutUs.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

 export default function AboutUs() {
  const navigate = useNavigate();

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
          {/* <button
            onClick={() => (window.location.href = "/about")}
            className="text-white hover:text-blue-400 transition"
          >
            About Us
          </button> */}
          {/* <button
            onClick={() => (window.location.href = "/credits")}
            className="text-white hover:text-blue-400 transition"
          >
            Credits
          </button> */}
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-white hover:text-blue-400 transition"
          > 
            Login
          </button>
          <button
            onClick={() => (window.location.href = "/signup")}
            className="text-white hover:text-blue-400 transition"
          >
            Signup
          </button>
          {/* <button
            onClick={() => window.location.reload()}
            className="text-white hover:text-red-400 transition"
          >
            Logout
          </button> */}
        </nav>
      </header>

      
      <div className="min-h-screen bg-gradient-to-br from-[#a7c0f2] via-[#7ea1e8] to-[#a7c0f2] text-white flex flex-col items-center justify-center px-10 py-16 pt-24">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold mb-6 drop-shadow-lg text-center"
        >
          About Us
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl bg-white text-gray-800 p-8 rounded-2xl shadow-2xl text-center"
        >
          <p className="text-lg leading-relaxed mb-4">
            <span className="font-semibold text-indigo-600">AI Interviewer</span> is a smart
            interview simulation platform that helps students and professionals
            prepare for real-world interviews.
          </p>

          <p className="text-gray-600 mb-4">
            It provides realistic interview experiences using AI-based analysis,
            feedback, and scoring. Users can practice technical or HR rounds,
            track progress, and identify strengths and areas of improvement.
          </p>

          <p className="text-gray-600 mb-8">
            Our goal is to make interview preparation interactive, effective,
            and accessible to everyone.
          </p>

          {/* <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            ← Back to Dashboard
          </button> */}
        </motion.div>
      </div>
    </>
  );
}