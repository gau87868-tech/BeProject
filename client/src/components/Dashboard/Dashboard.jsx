// src/components/Dashboard/Dashboard.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bot } from "lucide-react";
import { ALL_COMPANIES_URL } from "../../utils/constants";
import fetchFunction from "../../utils/fetchFunction";
import { InterviewContext } from "../../context/InterviewContext";
import { AuthContext } from "../../context/AuthContext"; //  for deductCredits

export default function Dashboard({ credits = 0 }) {
  const navigate = useNavigate();
  const [showCredits, setShowCredits] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [companiesInfo, setCompaniesInfo] = useState(null);

  const companies = [
    { name: "TCS", role: "Frontend Developer" },
    { name: "Infosys", role: "Backend Developer" },
    { name: "Accenture", role: "Full Stack Developer" },
    { name: "Wipro", role: "UI/UX Designer" },
    { name: "Cognizant", role: "Data Analyst" },
    { name: "Capgemini", role: "Software Engineer" },
    { name: "TechVerito", role: "UI/UX Designer" },
    { name: "Cognizant", role: "Data Engineer" },
    { name: "Credinca", role: "DevOps Engineer" },
    { name: "Equifax", role: "DevOps Engineer" },
  ];

  const { setLoading, selectCompanyRole, startInterview, resetInterview } =
    useContext(InterviewContext);

  const { deductCredits } = useContext(AuthContext); //  use auth credits

  useEffect(() => {
    initialCompaniesFetch();
  }, []);

  async function initialCompaniesFetch() {
    setLoading(true);
    const result = await fetchFunction({
      apiUrl: ALL_COMPANIES_URL,
      crudMethod: "GET",
      setError: setFetchError,
    });
    if (result.status === "success") {
      setCompaniesInfo(result?.companyData);
      setLoading(false);
    } else {
      console.log("ERROR IN FETCH : ", fetchError);
      setLoading(false);
    }
  }

  //  Handle credits + start interview
  const handleStart = async (company) => {
    // Not enough credits → open Credits modal
    if (credits < 5) {
      setShowCredits(true);
      return;
    }

    // Deduct 5 credits for this interview
    deductCredits(5);

    resetInterview();
    await selectCompanyRole(company.slug, company.companyName, company.role);
    startInterview();
    navigate("/interview");
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a7c0f2] via-[#7ea1e8] to-[#a7c0f2] p-8 text-gray-800 relative">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 flex justify-between items-center px-10 py-4 bg-[#1e3a8a]/70 backdrop-blur-md shadow-lg border-b border-blue-400/30">
        <h1 className="flex items-center text-3xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
          <span className="text-white mr-2">🤖</span>
          AI <span className="text-blue-300 ml-1">Interviewer</span>
        </h1>

        <nav className="absolute top-6 right-10 flex space-x-8 text-lg font-semibold">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white hover:text-blue-400 transition"
          >
            Home
          </button>
          {/* <button
            onClick={() => navigate("/about")}
            className="text-white hover:text-blue-400 transition"
          >
            About Us
          </button> */}
          <button
            onClick={() => setShowCredits(true)}
            className="text-white hover:text-blue-400 transition"
          >
            Credits
          </button>
          <button
            onClick={handleLogout}
            className="text-white hover:text-blue-400 transition"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Title */}
      <h1 className="text-4xl font-extrabold mt-20 mb-12 text-center drop-shadow-lg">
        Welcome to AI Interviewer
      </h1>

      {/* Credits display */}
      <div className="flex justify-end mb-6 px-4">
        <div className="bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow-sm text-sm font-medium">
          Credits: <span className="font-bold">{credits}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {(companiesInfo ? companiesInfo : companies).map((company, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.07 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg w-72 cursor-pointer hover:shadow-2xl text-center flex flex-col items-center"
          >
            <h2 className="text-2xl font-bold mb-2 text-indigo-700">
              {company.companyName}
            </h2>
            <p className="text-gray-600 mb-4">{company.role}</p>
            <button
              onClick={() => handleStart(company)}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              Start Interview
            </button>
          </motion.div>
        ))}
      </div>

      {/* Credits Modal */}
      <AnimatePresence>
        {showCredits && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-96 text-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                Your Credits
              </h2>
              <p className="text-5xl font-extrabold text-indigo-600 mb-4">
                {credits}
              </p>
              <p className="text-gray-600 mb-6">
                Each interview costs{" "}
                <span className="font-semibold">5 credits</span>.
              </p>
              <button
                onClick={() => navigate("/credits")}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
              >
                Buy More
              </button>
              <br />
              <button
                onClick={() => setShowCredits(false)}
                className="mt-4 text-indigo-600 font-semibold hover:underline"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-16 bg-white bg-opacity-10 backdrop-blur-md py-6 rounded-t-2xl text-center text-white">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold tracking-wide">
            © 2025 <span className="text-yellow-300">AI Interviewer</span>
          </h2>
          <p className="text-sm text-white-200 mt-2 font-medium">
            Built by <span className="text-yellow-300">Team AI Interviewer</span>{" "}
            | NMIET Pune
          </p>
        </div>
      </footer>
    </div>
  );
}
