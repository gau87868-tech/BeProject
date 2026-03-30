import React, { useContext } from "react";
import { InterviewContext } from "../../context/InterviewContext";
import { Link } from "react-router-dom";

export default function NavigationControls() {
  const { currentQuestionIndex, prevQuestion, nextQuestion, questionSet, playQuestion } = useContext(InterviewContext);

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questionSet.length - 1;

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={() => {
          prevQuestion();
          playQuestion(currentQuestionIndex - 1);
        }}
        disabled={isFirstQuestion}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>

      {isLastQuestion && (
        <Link to="/completed">
          <button className="px-4 py-2 bg-gray-200 rounded">
            Go to Completion Screen
          </button>
        </Link>
      )}

      <button
        onClick={() => {
          nextQuestion();
          playQuestion(currentQuestionIndex + 1);
        }}
        disabled={isLastQuestion}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
