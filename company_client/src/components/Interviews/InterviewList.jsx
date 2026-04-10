// src/components/Interviews/InterviewList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import fetchFunction from "../../utils/fetchFunction";
import {
  INTERVIEW_LIST_URL,
  INTERVIEW_DELETE_URL,
  INTERVIEW_STATUS_URL,
} from "../../utils/constants";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Globe,
  Lock,
  Eye,
  BarChart3,
  Mail,
  Loader2,
  ClipboardList,
  Trash2,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function InterviewList() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // holds interview id being acted on
  const [deleteConfirm, setDeleteConfirm] = useState(null); // holds interview id awaiting confirm

  useEffect(() => {
    fetchInterviews();
  }, []);

  // ─── Fetch from backend API instead of localStorage ───
  const fetchInterviews = async () => {
    setLoading(true);
    setError("");
    const result = await fetchFunction({
      apiUrl: INTERVIEW_LIST_URL,
      crudMethod: "GET",
      setError,
    });

    if (result?.status === "success") {
      setInterviews(result.data || []);
    }
    setLoading(false);
  };

  // ─── Delete interview ───
  const handleDelete = async (interviewId) => {
    setActionLoading(interviewId);
    setError("");
    const result = await fetchFunction({
      apiUrl: `${INTERVIEW_DELETE_URL}/${interviewId}`,
      crudMethod: "DELETE",
      setError,
    });

    if (result?.status === "success") {
      setInterviews((prev) => prev.filter((iv) => iv._id !== interviewId));
    }
    setActionLoading(null);
    setDeleteConfirm(null);
  };

  // ─── Update interview status ───
  const handleStatusChange = async (interviewId, newStatus) => {
    setActionLoading(interviewId);
    setError("");
    const result = await fetchFunction({
      apiUrl: `${INTERVIEW_STATUS_URL}/${interviewId}`,
      crudMethod: "PATCH",
      postData: { status: newStatus },
      setError,
    });

    if (result?.status === "success" && result.data) {
      setInterviews((prev) =>
        prev.map((iv) => (iv._id === interviewId ? result.data : iv))
      );
    }
    setActionLoading(null);
  };

  // ─── Filtering ───
  const filteredInterviews = interviews.filter((iv) => {
    const matchesSearch =
      iv.title?.toLowerCase().includes(search.toLowerCase()) ||
      iv.role?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || iv.status?.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
    { key: "closed", label: "Closed" },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-500 mt-1">Manage all your interviews</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInterviews}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/interviews/create")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            Create Interview
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search interviews..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Interview Cards */}
      {filteredInterviews.length > 0 ? (
        <div className="grid gap-4">
          {filteredInterviews.map((interview, i) => (
            <motion.div
              key={interview._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {interview.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(
                        interview.status
                      )}`}
                    >
                      {interview.status || "Published"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      {interview.accessType === "private" ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Globe className="w-3 h-3" />
                      )}
                      {interview.accessType}
                    </span>
                    {interview.type && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                        {interview.type}
                      </span>
                    )}
                    {interview.difficulty && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          interview.difficulty === "easy"
                            ? "bg-green-50 text-green-600"
                            : interview.difficulty === "hard"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {interview.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {interview.role}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(interview.scheduledAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                    {interview.duration && (
                      <span className="text-gray-400">
                        {interview.duration} mins
                      </span>
                    )}
                    {interview.invitedStudents?.length > 0 && (
                      <span className="flex items-center gap-1 text-indigo-500">
                        <Mail className="w-4 h-4" />
                        {interview.invitedStudents.length} invited
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/interviews/${interview._id}`)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/interviews/${interview._id}/results`)
                    }
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Results
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/interviews/${interview._id}/invite`)
                    }
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
                  >
                    <Mail className="w-4 h-4" />
                    Invite
                  </button>

                  {/* Status toggle: Publish / Close */}
                  {interview.status !== "closed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          interview._id,
                          interview.status === "draft" ? "published" : "closed"
                        )
                      }
                      disabled={actionLoading === interview._id}
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition ${
                        interview.status === "draft"
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                      } disabled:opacity-50`}
                    >
                      {actionLoading === interview._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : interview.status === "draft" ? (
                        <>
                          <ClipboardList className="w-4 h-4" />
                          Publish
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Close
                        </>
                      )}
                    </button>
                  )}

                  {interview.status === "closed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(interview._id, "published")
                      }
                      disabled={actionLoading === interview._id}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
                    >
                      {actionLoading === interview._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Reopen
                        </>
                      )}
                    </button>
                  )}

                  {/* Delete */}
                  {deleteConfirm === interview._id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(interview._id)}
                        disabled={actionLoading === interview._id}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {actionLoading === interview._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Confirm"
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(interview._id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No interviews yet
          </h3>
          <p className="text-gray-400 mt-1 mb-6">
            Create your first AI-powered interview to get started
          </p>
          <button
            onClick={() => navigate("/interviews/create")}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            <Plus className="w-5 h-5" />
            Create Interview
          </button>
        </div>
      )}
    </div>
  );
}
