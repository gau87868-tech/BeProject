// src/components/Interview/CompletionScreen.jsx
import React, { useContext, useEffect, useState } from "react";
import { InterviewContext } from "../../context/InterviewContext";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import fetchFunction from "../../utils/fetchFunction";
import { SUBMIT_INTERVIEW } from "../../utils/constants";

export default function CompletionScreen() {
  const {
    answers,
    questionSet,
    selectedCompany,
    selectedRole,
    setLoading,
  } = useContext(InterviewContext);

  const { user } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Count
  const totalQuestions = questionSet.length;
  const answeredCount = answers.filter(
    (a) =>
      a?.answer &&
      a.answer.trim() !== "" &&
      a.answer.trim().toLowerCase() !== "no answer recorded"
  ).length;

  // AUTO SUBMIT ON PAGE LOAD
  useEffect(() => {
    const autoSubmit = async () => {
      if (!user?.user?.[0]?._id) {
        setError("User ID missing");
        return;
      }

      if (!selectedCompany || !selectedRole) {
        setError("Company or Role missing");
        return;
      }

      setLoading(true);

      // Prepare final answers
      const formattedAnswers = answers.map((a, i) => ({
        question: questionSet[i]?.question || "",
        answer: a.answer?.trim() || "No answer provided",
      }));

      const postData = {
        candidate: user.user[0]._id,
        interviews: [
          {
            companyName: selectedCompany,
            companyRole: selectedRole,
            candidateAnswers: formattedAnswers,
          },
        ],
      };

      const result = await fetchFunction({
        apiUrl: SUBMIT_INTERVIEW,
        crudMethod: "POST",
        postData,
        setError,
      });

      setLoading(false);

      if (result?.status === "success") {
        setSuccess(true);
      } else {
        setError(result?.message || "Error submitting interview.");
      }
    };

    autoSubmit();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-green-50">
      <div className="text-center">
        <div className="text-4xl mb-4">🎉</div>

        <h1 className="text-2xl font-semibold mb-2">
          Interview Completed
        </h1>

        <p className="text-gray-700 mb-2">
          {answeredCount} / {totalQuestions} answers recorded
        </p>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && (
          <p className="text-green-600 mb-3 font-medium">
            Your interview has been submitted successfully!
          </p>
        )}

        {/* Review Button */}
        <Link to={"/review"}>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg">
            Review Answers
          </button>
        </Link>
      </div>
    </div>
  );
}
