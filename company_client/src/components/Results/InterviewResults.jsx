// src/components/Results/InterviewResults.jsx
// FIXED: Loads interview from API (not localStorage), adds shortlisting, shortlist filter
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import fetchFunction from "../../utils/fetchFunction";
import {
  INTERVIEW_RESULTS_URL,
  INTERVIEW_DETAIL_URL,
  INTERVIEW_SHORTLIST_URL,
  INTERVIEW_ANALYTICS_URL,
} from "../../utils/constants";
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
  Star,
  StarOff,
  Filter,
  UserCheck,
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
  const [shortlistFilter, setShortlistFilter] = useState("all"); // "all" | "shortlisted" | "not-shortlisted"
  const [shortlistingId, setShortlistingId] = useState(null); // tracks which row is currently toggling

  useEffect(() => {
    fetchResults();
    loadInterview();
  }, [id]);

  // ─── FIX: Load interview from backend API, not localStorage ───
  const loadInterview = async () => {
    const result = await fetchFunction({
      apiUrl: `${INTERVIEW_DETAIL_URL}/${id}`,
      crudMethod: "GET",
      setError,
    });
    if (result?.status === "success" && result.data) {
      setInterview(result.data);
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

  // ─── NEW: Toggle shortlist ───
  const handleToggleShortlist = async (e, resultItem) => {
    e.stopPropagation(); // don't navigate to detail
    const isCurrentlyShortlisted = resultItem.status === "SHORTLISTED";
    setShortlistingId(resultItem._id);

    const res = await fetchFunction({
      apiUrl: `${INTERVIEW_SHORTLIST_URL}/${resultItem._id}`,
      crudMethod: "PATCH",
      postData: { shortlisted: !isCurrentlyShortlisted },
      setError,
    });

    if (res?.status === "success") {
      // Update local state so the UI reacts instantly
      setResults((prev) =>
        prev.map((r) =>
          r._id === resultItem._id
            ? {
                ...r,
                status: !isCurrentlyShortlisted ? "SHORTLISTED" : "EVALUATED",
                shortlistedAt: !isCurrentlyShortlisted
                  ? new Date().toISOString()
                  : null,
              }
            : r
        )
      );
    }

    setShortlistingId(null);
  };

  // ─── Helpers ───
  const getRecommendationStyle = (rec) => {
    switch (rec) {
      case "Strong Hire":
        return { bg: "bg-green-100", text: "text-green-700", icon: ThumbsUp };
      case "Hire":
        return { bg: "bg-emerald-100", text: "text-emerald-700", icon: ThumbsUp };
      case "Hold":
        return { bg: "bg-amber-100", text: "text-amber-700", icon: Minus };
      case "Reject":
        return { bg: "bg-red-100", text: "text-red-700", icon: ThumbsDown };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: Minus };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // ─── Filtering & sorting ───
  const filteredResults = results
    .filter((r) => {
      const name = r.candidateId?.name || r.candidateId?.email || "";
      const matchesSearch = name.toLowerCase().includes(search.toLowerCase());

      let matchesShortlist = true;
      if (shortlistFilter === "shortlisted") {
        matchesShortlist = r.status === "SHORTLISTED";
      } else if (shortlistFilter === "not-shortlisted") {
        matchesShortlist = r.status !== "SHORTLISTED";
      }

      return matchesSearch && matchesShortlist;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return (b.aiScore || 0) - (a.aiScore || 0);
        case "score-asc":
          return (a.aiScore || 0) - (b.aiScore || 0);
        case "date-desc":
          return new Date(b.completedAt || 0) - new Date(a.completedAt || 0);
        case "date-asc":
          return new Date(a.completedAt || 0) - new Date(b.completedAt || 0);
        default:
          return 0;
      }
    });

  // ─── Stats ───
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.aiScore || 0), 0) / results.length
        )
      : 0;
  const hireCount = results.filter(
    (r) => r.recommendation === "Strong Hire" || r.recommendation === "Hire"
  ).length;
  const shortlistedCount = results.filter(
    (r) => r.status === "SHORTLISTED"
  ).length;

  // ─── Loading ───
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
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
        <ArrowLeft size={18} /> Back to Interview
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Interview Results
        </h1>
        <p className="text-gray-500 mt-1">
          {interview?.title || "Interview"} —{" "}
          {interview?.role || ""}
        </p>
      </div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {results.length}
              </p>
              <p className="text-xs text-gray-500">Total Candidates</p>
            </div>
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-50">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {avgScore}%
              </p>
              <p className="text-xs text-gray-500">Average Score</p>
            </div>
          </div>
        </motion.div>

        {/* Recommended to Hire */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-green-50">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {hireCount}
              </p>
              <p className="text-xs text-gray-500">Recommended to Hire</p>
            </div>
          </div>
        </motion.div>

        {/* Shortlisted */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50">
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {shortlistedCount}
              </p>
              <p className="text-xs text-gray-500">Shortlisted</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Search, Sort & Shortlist Filter ─── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Sort */}
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

        {/* Shortlist Filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg overflow-hidden">
          {[
            { key: "all", label: "All" },
            { key: "shortlisted", label: "Shortlisted" },
            { key: "not-shortlisted", label: "Not Shortlisted" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setShortlistFilter(f.key)}
              className={`px-3 py-2 text-sm font-medium transition-all ${
                shortlistFilter === f.key
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ─── Results List ─── */}
      {filteredResults.length > 0 ? (
        <div className="space-y-3">
          {filteredResults.map((result, i) => {
            const recStyle = getRecommendationStyle(result.recommendation);
            const RecIcon = recStyle.icon;
            const isShortlisted = result.status === "SHORTLISTED";
            const isToggling = shortlistingId === result._id;

            return (
              <motion.div
                key={result._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white rounded-xl p-5 shadow-sm border transition-all hover:shadow-md ${
                  isShortlisted
                    ? "border-amber-200 bg-amber-50/30"
                    : "border-gray-100 hover:border-indigo-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/results/${result._id}`)}
                  >
                    <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                      {(
                        result.candidateId?.name?.[0] ||
                        result.candidateId?.email?.[0] ||
                        "?"
                      ).toUpperCase()}
                    </div>
                  </div>

                  {/* Name / Email */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/results/${result._id}`)}
                  >
                    <p className="font-semibold text-gray-900 truncate">
                      {result.candidateId?.name ||
                        result.candidateId?.email ||
                        "Unknown Candidate"}
                    </p>
                    {result.candidateId?.email && (
                      <p className="text-xs text-gray-400 truncate">
                        {result.candidateId.email}
                      </p>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-center px-3">
                    <p
                      className={`text-xl font-bold ${
                        result.aiScore != null
                          ? getScoreColor(result.aiScore)
                          : "text-gray-400"
                      }`}
                    >
                      {result.aiScore != null ? `${result.aiScore}%` : "N/A"}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                      AI Score
                    </p>
                  </div>

                  {/* Recommendation Badge */}
                  {result.recommendation && (
                    <span
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${recStyle.bg} ${recStyle.text}`}
                    >
                      <RecIcon size={12} />
                      {result.recommendation}
                    </span>
                  )}

                  {/* Shortlisted Badge */}
                  {isShortlisted && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                      <Star size={12} className="fill-amber-500" />
                      Shortlisted
                    </span>
                  )}

                  {/* Status */}
                  <span className="text-[10px] uppercase tracking-wide font-medium text-gray-400 hidden md:block">
                    {result.status}
                  </span>

                  {/* ─── Shortlist Toggle Button ─── */}
                  <button
                    onClick={(e) => handleToggleShortlist(e, result)}
                    disabled={isToggling}
                    title={
                      isShortlisted
                        ? "Remove from shortlist"
                        : "Shortlist candidate"
                    }
                    className={`p-2 rounded-lg border transition-all disabled:opacity-50 ${
                      isShortlisted
                        ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : isShortlisted ? (
                      <Star size={16} className="fill-amber-500" />
                    ) : (
                      <StarOff size={16} />
                    )}
                  </button>

                  {/* Navigate arrow */}
                  <ChevronRight
                    size={18}
                    className="text-gray-300 cursor-pointer hover:text-indigo-500 transition"
                    onClick={() => navigate(`/results/${result._id}`)}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">
            {results.length === 0
              ? "No results yet"
              : "No candidates match your filters"}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {results.length === 0
              ? "No candidates have completed this interview yet."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}
    </div>
  );
}
