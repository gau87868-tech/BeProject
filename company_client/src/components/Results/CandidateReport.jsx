// src/components/Results/CandidateReport.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import fetchFunction from "../../utils/fetchFunction";
import { INTERVIEW_RESULT_URL } from "../../utils/constants";
import {
  ArrowLeft,
  User,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  Mail,
  Calendar,
  Briefcase,
  Star,
  AlertCircle,
} from "lucide-react";

export default function CandidateReport() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { company } = useContext(CompanyAuthContext);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    setLoading(true);
    const data = await fetchFunction({
      apiUrl: `${INTERVIEW_RESULT_URL}/${resultId}`,
      crudMethod: "GET",
      setError,
    });
    if (data?.status === "success") {
      setResult(data.data);
    }
    setLoading(false);
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return { grade: "A+", color: "text-green-600", bg: "bg-green-50", ring: "ring-green-200" };
    if (score >= 80) return { grade: "A", color: "text-green-600", bg: "bg-green-50", ring: "ring-green-200" };
    if (score >= 70) return { grade: "B+", color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200" };
    if (score >= 60) return { grade: "B", color: "text-blue-600", bg: "bg-blue-50", ring: "ring-blue-200" };
    if (score >= 50) return { grade: "C", color: "text-yellow-600", bg: "bg-yellow-50", ring: "ring-yellow-200" };
    return { grade: "D", color: "text-red-600", bg: "bg-red-50", ring: "ring-red-200" };
  };

  const getRecommendationStyle = (rec) => {
    switch (rec) {
      case "Strong Hire":
        return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "🌟" };
      case "Hire":
        return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "✅" };
      case "Hold":
        return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "⏳" };
      case "Reject":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "❌" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "📋" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Result not found</h3>
        <p className="text-gray-500 mb-4">The requested result could not be loaded.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-medium hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const scoreGrade = getScoreGrade(result.aiScore || 0);
  const recStyle = getRecommendationStyle(result.recommendation);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Results
      </button>

      {/* Candidate Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {result.candidateId?.name || "Anonymous Candidate"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                {result.candidateId?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {result.candidateId.email}
                  </span>
                )}
                {result.interviewId?.title && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {result.interviewId.title}
                  </span>
                )}
                {result.completedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(result.completedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className={`flex flex-col items-center p-4 rounded-xl ${scoreGrade.bg} ring-2 ${scoreGrade.ring}`}>
            <p className={`text-3xl font-bold ${scoreGrade.color}`}>
              {result.aiScore != null ? `${result.aiScore}%` : "N/A"}
            </p>
            <p className={`text-sm font-medium ${scoreGrade.color}`}>Grade: {scoreGrade.grade}</p>
          </div>
        </div>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl p-6 border ${recStyle.bg} ${recStyle.border}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{recStyle.icon}</span>
          <div>
            <p className={`text-lg font-bold ${recStyle.text}`}>
              {result.recommendation || "Pending Evaluation"}
            </p>
            <p className={`text-sm ${recStyle.text} opacity-80`}>
              AI Recommendation
            </p>
          </div>
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Strengths
          </h3>
          {result.strengths?.length > 0 ? (
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No strengths data available yet.</p>
          )}
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            Areas for Improvement
          </h3>
          {result.weaknesses?.length > 0 ? (
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{w}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No improvement areas data available yet.</p>
          )}
        </motion.div>
      </div>

      {/* Answers Section */}
      {result.answers?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Interview Answers ({result.answers.length})
          </h3>
          <div className="space-y-4">
            {result.answers.map((ans, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-2">
                      {ans.questionText || ans.questionId?.questionText || `Question ${i + 1}`}
                    </p>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {ans.answerText || "No answer provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex justify-center">
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            result.status === "EVALUATED"
              ? "bg-green-100 text-green-700"
              : result.status === "SUBMITTED"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          Status: {result.status || "Unknown"}
        </span>
      </motion.div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}