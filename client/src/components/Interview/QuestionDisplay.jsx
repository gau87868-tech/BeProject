// src/components/Interview/QuestionDisplay.jsx
import React, { useContext } from "react";
import { InterviewContext } from "../../context/InterviewContext";

export default function QuestionDisplay() {
  const { questionSet, currentQuestionIndex } = useContext(InterviewContext);
  const currQuestion = questionSet[currentQuestionIndex];

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-lg md:text-xl font-semibold">
      {/* Render safely: check if it's a string or object */}
      {typeof currQuestion === "string" ? currQuestion : currQuestion?.question}
    </div>
  );
}
