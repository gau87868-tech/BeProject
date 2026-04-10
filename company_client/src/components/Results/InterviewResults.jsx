// src/components/Results/InterviewResults.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import fetchFunction from "../../utils/fetchFunction";
import { INTERVIEW_RESULTS_URL } from "../../utils/constants";
import {
  ArrowLeft,
  BarChart3,
  Users,
  Search,
  Loader2,
  UserCircle,
  TrendingUp,
  Award,
  AlertCircle,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";

export default function InterviewResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score-desc");

  useEffect(() => {
    fetchResults();
    loadInterview();
  }, [id]);

  const loadInterview = () => {
    const stored = localStorage.getItem("companyInterviews");
    if (stored) {
      const all = JSON.parse(stored);
      const found = all.find((iv) => iv._id === id);
      if (found) setInterview(found);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    const result = await fetchFunction({
      apiUrl: `${INTERVIEW_RESULTS_URL}/${id}`,
      crudMethod: "GET",
      setError,
    });

    if (result?.status === "success") {
      setResults(result.data || []);
    }
    setLoading(false);
  };

  const getRecommendationStyle = (rec) => {
    switch (rec) {
      case "Strong Hire":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: ThumbsUp,
        };
      case "Hire":
        return {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          icon: ThumbsUp,
        };
      case "Hold":
        return {
          bg: "bg-amber-100",
          text: "text-amber-700",
          icon: Minus,
        };
      case "Reject":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          icon: ThumbsDown,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          icon: Minus,
        };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const filteredResults = results
    .filter((r) => {
      const name =
        r.candidateId?.name ||
        r.candidateId?.email ||
        "";
      return name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return (b.aiScore || 0) - (a.aiScore || 0);
        case "score-asc":
          return (a.aiScore || 0) - (b.aiScore || 0);
        case "date-desc":
          return (
            new Date(b.completedAt || 0) -
            new Date(a.completedAt || 0)
          );
        case "date-asc":
          return (
            new Date(a.completedAt || 0) -
            new Date(b.completedAt || 0)
          );
        default:
          return 0;
      }
    });

  // Stats
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (sum, r) => sum + (r.aiScore || 0),
            0
          ) / results.length
        )
      : 0;
  const hireCount = results.filter(
    (r) =>
      r.recommendation === "Strong Hire" ||
      r.recommendation === "Hire"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(`/interviews/${id}`)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Interview
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Interview Results
        </h1>
        <p className="text-gray-500 mt-1">
          {interview?.title || "Interview"} —{" "}
          {interview?.role || ""}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {results.length}
              </p>
              <p className="text-sm text-gray-500">
                Total Candidates
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2.5 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {avgScore}%
              </p>
              <p className="text-sm text-gray-500">
                Average Score
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-lg">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {hireCount}
              </p>
              <p className="text-sm text-gray-500">
                Recommended to Hire
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
        >
          <option value="score-desc">Score: High to Low</option>
          <option value="score-asc">Score: Low to High</option>
          <option value="date-desc">Date: Newest First</option>
          <option value="date-asc">Date: Oldest First</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <div className="space-y-3">
          {filteredResults.map((result, i) => {
            const recStyle = getRecommendationStyle(
              result.recommendation
            );
            const RecIcon = recStyle.icon;

            return (
              <motion.div
                key={result._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() =>
                  navigate(`/results/${result._id}`)
                }
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold">
                        {(
                          result.candidateId?.name?.[0] ||
                          result.candidateId?.email?.[0] ||
                          "?"
                        ).toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {result.candidateId?.name ||
                          result.candidateId?.email ||
                          "Unknown Candidate"}
                      </h3>
                      {result.candidateId?.email && (
                        <p className="text-sm text-gray-500">
                          {result.candidateId.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          result.aiScore != null
                            ? getScoreColor(result.aiScore)
                            : "text-gray-400"
                        }`}
                      >
                        {result.aiScore != null
                          ? `${result.aiScore}%`
                          : "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        AI Score
                      </p>
                    </div>

                    {/* Recommendation Badge */}
                    {result.recommendation && (
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${recStyle.bg} ${recStyle.text}`}
                      >
                        <RecIcon className="w-3.5 h-3.5" />
                        {result.recommendation}
                      </span>
                    )}

                    {/* Status */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        result.status === "EVALUATED"
                          ? "bg-green-100 text-green-700"
                          : result.status === "SUBMITTED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {result.status}
                    </span>

                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
        >
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No results yet
          </h3>
          <p className="text-gray-500">
            No candidates have completed this interview yet.
            {interview?.accessType === "private" && (
              <span>
                {" "}
                Try inviting candidates to get started.
              </span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}