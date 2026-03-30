import React, { useContext, useEffect } from "react";
import { InterviewContext } from "../../context/InterviewContext";

export default function StartScreen() {
  const { startInterview, playQuestion, currentQuestionIndex } = useContext(InterviewContext);

  const handleStart = () => {
    startInterview();
    // Play first question immediately
    playQuestion(currentQuestionIndex);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <h1 className="text-4xl font-semibold mb-4 text-gray-900">AI Interviewer</h1>
        <p className="mb-6 text-gray-600">
          Click start to begin the interview. You will hear each question — answer by voice.
        </p>
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
