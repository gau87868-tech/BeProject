import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { InterviewContext } from "../../context/InterviewContext";
import useAuth from "../../hooks/useAuth";
import QuestionDisplay from "./QuestionDisplay";
import AnswerDisplay from "./AnswerDisplay";
import RecordingButton from "./RecordingButton";
import NavigationControls from "./NavigationControls";
import ProgressionIndicator from "./ProgressionIndicator";
import styles from "../../styles/InterviewContainer.module.css";

export default function InterviewContainer() {
  const {
    questionSet,
    currentQuestionIndex,
    playQuestion,
    selectedCompany,
    selectedRole,
    startInterview,
    resetInterview,

    // NEW autoplay control variables from context
    shouldAutoPlay,
    setShouldAutoPlay,
    triggerReplay,
  } = useContext(InterviewContext);

  const { credits } = useAuth();
  const navigate = useNavigate();
  const [showCredits, setShowCredits] = useState(false);

  // FIXED: Autoplay only when shouldAutoPlay = true
  useEffect(() => {
    if (shouldAutoPlay) {
      playQuestion(currentQuestionIndex);
      setShouldAutoPlay(false); // prevent re-playing next time index changes
    }
  }, [currentQuestionIndex, shouldAutoPlay]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#a7c0f2] via-[#7ea1e8] to-[#a7c0f2]">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-6 py-3 bg-[#1e3a8a]/80 backdrop-blur-md shadow-md border-b border-blue-400/30 sticky top-0 z-50">
        <h1 className="flex items-center text-2xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
          <span className="text-white mr-2">🤖</span>
          AI <span className="text-blue-300 ml-1">Interviewer</span>
        </h1>

        <nav className="flex space-x-4 text-lg font-medium overflow-x-auto">
          <Link to="/dashboard" className="text-white hover:text-blue-400 transition whitespace-nowrap">
            Home
          </Link>
          {/* <Link to="/about" className="text-white hover:text-blue-400 transition whitespace-nowrap">
            About Us
          </Link> */}
          <button
            onClick={() => setShowCredits(true)}
            className="text-white hover:text-blue-400 transition whitespace-nowrap"
          >
            Credits
          </button>
          <Link to="/logout" className="text-white hover:text-red-400 transition whitespace-nowrap">
            Logout
          </Link>
        </nav>
      </header>

      {/* Centered Interview Card */}
      <div className="flex justify-center items-center flex-1 px-4 py-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto"
        >
          {/* Company & Role */}
          <div className="mb-4 sticky top-0 bg-white py-2 z-10">
            <h2 className="text-xl font-semibold">
              Interview: {selectedCompany} - {selectedRole}
            </h2>
          </div>

          {/* Progress */}
          <ProgressionIndicator
            total={questionSet.length}
            current={currentQuestionIndex + 1}
          />

          {/* Question */}
          <QuestionDisplay />

          {/* Replay button */}
          <div className="flex justify-end my-2">
            <button
              onClick={() => triggerReplay()} // NEW replay logic
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              🔊 Replay
            </button>
          </div>

          {/* Answer input controlled via context */}
          <AnswerDisplay />

          {/* Recording button */}
          <RecordingButton />

          {/* Navigation controls */}
          <NavigationControls />
        </motion.div>
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
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Your Credits</h2>
              <p className="text-5xl font-extrabold text-indigo-600 mb-4">{credits}</p>
              <p className="text-gray-600 mb-6">
                Each interview costs <span className="font-semibold">5 credits</span>.
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
    </div>
  );
}