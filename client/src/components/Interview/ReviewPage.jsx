// src/components/Interview/ReviewPage.jsx
import React, { useContext } from "react";
import { InterviewContext } from "../../context/InterviewContext";
import { Link } from "react-router-dom";

export function ReviewPage() {
  const { questionSet, answers } = useContext(InterviewContext);

  // Combine questions with current answers
  const answerDetails = questionSet?.map((q, idx) => ({
    question: q.question,
    answerFromDb: answers[idx]?.answer || "No answer provided",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-3">
            Interview Review
          </h1>
          <p className="text-gray-600 text-lg">
            Review your answers before final submission
          </p>
        </div>

        {/* Questions and Answers */}
        <div className="space-y-6 mb-8">
          {answerDetails?.map((set, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-100 hover:border-indigo-300 transform hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm tracking-wider uppercase">
                    Question {idx + 1}
                  </span>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {idx + 1} / {answerDetails.length}
                  </span>
                </div>
              </div>

              {/* Question */}
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Question
                    </h3>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-l-4 border-indigo-500">
                    <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed">
                      {set.question}
                    </p>
                  </div>
                </div>

                {/* Answer */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Your Response
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-green-500 min-h-[100px]">
                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                      {set.answerFromDb}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {answerDetails?.length > 0 && (
          <div className="flex justify-center items-center pt-6 pb-8">
            <Link to={"/dashboard"}>
              <button className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
                Back To Dashboard
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}