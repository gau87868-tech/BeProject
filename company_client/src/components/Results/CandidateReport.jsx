// src/components/Results/CandidateReport.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import fetchFunction from "../../utils/fetchFunction";
import { INTERVIEW_RESULT_URL, INTERVIEW_SHORTLIST_URL } from "../../utils/constants";
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
  StarOff,
} from "lucide-react";

export default function CandidateReport() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { company } = useContext(CompanyAuthContext);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shortlisting, setShortlisting] = useState(false);

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

  // ── Shortlist toggle ──────────────────────────────────────
  const isShortlisted = result?.status === "SHORTLISTED";

  const handleShortlistToggle = async () => {
    setShortlisting(true);
    setError("");

    const res = await fetchFunction({
      apiUrl: `${INTERVIEW_SHORTLIST_URL}/${resultId}`,
      crudMethod: "PATCH",
      postData: { shortlisted: !isShortlisted },
      setError,
    });

    if (res?.status === "success" && res.data) {
      setResult((prev) => ({ ...prev, status: res.data.status, shortlistedAt: res.data.shortlistedAt }));
    }
    setShortlisting(false);
  };

  // ── Helpers ────────────────────────────────────────────────
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

  // ── Loading / Not Found ───────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Result not found</h3>
        <p className="text-gray-400 mt-1">The requested result could not be loaded.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-medium hover:underline mt-4 inline-block"
        >
          Go Back
        </button>
      </div>
    );
  }

  const scoreGrade = getScoreGrade(result.aiScore || 0);
  const recStyle = getRecommendationStyle(result.recommendation);

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </button>

      {/* Candidate Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {(result.candidateId?.name?.[0] || result.candidateId?.email?.[0] || "?").toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {result.candidateId?.name || "Anonymous Candidate"}
              </h2>
              {result.candidateId?.email && (
                <p className="text-indigo-200 flex items-center gap-1.5 mt-1">
                  <Mail className="w-4 h-4" />
                  {result.candidateId.email}
                </p>
              )}
              {result.interviewId?.title && (
                <p className="text-indigo-200 flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                  {result.interviewId.title}
                </p>
              )}
              {result.completedAt && (
                <p className="text-indigo-200 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(result.completedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Score Badge */}
        <div className="flex items-center justify-center -mt-6">
          <div className={`${scoreGrade.bg} ${scoreGrade.ring} ring-4 rounded-2xl px-8 py-4 text-center shadow-lg`}>
            <div className={`text-4xl font-bold ${scoreGrade.color}`}>
              {result.aiScore != null ? `${result.aiScore}%` : "N/A"}
            </div>
            <div className="text-sm text-gray-500 mt-1">Grade: {scoreGrade.grade}</div>
          </div>
        </div>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${recStyle.bg} ${recStyle.border} border rounded-xl p-6 text-center`}
      >
        <span className="text-3xl">{recStyle.icon}</span>
        <h3 className={`text-xl font-bold ${recStyle.text} mt-2`}>
          {result.recommendation || "Pending Evaluation"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">AI Recommendation</p>
      </motion.div>

      {/* Shortlisted Banner (if shortlisted) */}
      {isShortlisted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
        >
          <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
          <div>
            <p className="text-amber-800 font-semibold text-sm">Shortlisted Candidate</p>
            {result.shortlistedAt && (
              <p className="text-amber-600 text-xs mt-0.5">
                Shortlisted on{" "}
                {new Date(result.shortlistedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Strengths & Weaknesses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Strengths */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-green-700 mb-4">
            <TrendingUp className="w-5 h-5" />
            Strengths
          </h3>
          {result.strengths?.length > 0 ? (
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No strengths data available yet.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-red-700 mb-4">
            <TrendingDown className="w-5 h-5" />
            Areas for Improvement
          </h3>
          {result.weaknesses?.length > 0 ? (
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No improvement areas data available yet.</p>
          )}
        </div>
      </motion.div>

      {/* Answers Section */}
      {result.answers?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Interview Answers ({result.answers.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {result.answers.map((ans, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {ans.questionText || ans.questionId?.questionText || `Question ${i + 1}`}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      {ans.answerText || "No answer provided"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Status Badge */}
      <div className="flex justify-center">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          Status: {result.status || "Unknown"}
        </span>
      </div>

      {/* ── Shortlist Action Button ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center pt-2 pb-4"
      >
        <button
          onClick={handleShortlistToggle}
          disabled={shortlisting}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
            isShortlisted
              ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
          }`}
        >
          {shortlisting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isShortlisted ? "Removing…" : "Shortlisting…"}
            </>
          ) : isShortlisted ? (
            <>
              <StarOff className="w-4 h-4" />
              Remove from Shortlist
            </>
          ) : (
            <>
              <Star className="w-4 h-4" />
              Mark as Shortlisted
            </>
          )}
        </button>
      </motion.div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
