// src/components/Interviews/InterviewDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import fetchFunction from "../../utils/fetchFunction";
import {
  QUESTIONS_URL,
  INTERVIEW_DETAIL_URL,
  INTERVIEW_UPDATE_URL,
  INTERVIEW_DELETE_URL,
  INTERVIEW_STATUS_URL,
} from "../../utils/constants";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Lock,
  Users,
  Mail,
  BarChart3,
  Edit3,
  Trash2,
  Plus,
  Save,
  X,
  Loader2,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const QUESTION_TYPES = ["technical", "behavioral", "coding", "hr"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

export default function InterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company } = useContext(CompanyAuthContext);

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editQuestions, setEditQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    loadInterviewData();
  }, [id]);

  // ─── Fetch interview from API instead of localStorage ───
  const loadInterviewData = async () => {
    setLoading(true);
    setError("");

    // Fetch interview details from API
    const interviewResult = await fetchFunction({
      apiUrl: `${INTERVIEW_DETAIL_URL}/${id}`,
      crudMethod: "GET",
      setError,
    });

    if (interviewResult?.status === "success" && interviewResult.data) {
      setInterview(interviewResult.data);
    }

    // Fetch questions from API
    const qResult = await fetchFunction({
      apiUrl: `${QUESTIONS_URL}/${id}`,
      crudMethod: "GET",
      setError: () => {}, // Don't overwrite interview errors
    });

    if (qResult?.status === "success" && qResult?.data?.questions) {
      setQuestions(qResult.data.questions.questions || []);
    }

    setLoading(false);
  };

  // ─── Update interview status ───
  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    setError("");
    const result = await fetchFunction({
      apiUrl: `${INTERVIEW_STATUS_URL}/${id}`,
      crudMethod: "PATCH",
      postData: { status: newStatus },
      setError,
    });
    if (result?.status === "success" && result.data) {
      setInterview(result.data);
    }
    setActionLoading(false);
  };

  // ─── Delete interview ───
  const handleDelete = async () => {
    setActionLoading(true);
    setError("");
    const result = await fetchFunction({
      apiUrl: `${INTERVIEW_DELETE_URL}/${id}`,
      crudMethod: "DELETE",
      setError,
    });
    if (result?.status === "success") {
      navigate("/interviews");
    }
    setActionLoading(false);
  };

  // ─── Question editing ───
  const startEdit = () => {
    setEditQuestions(questions.map((q) => ({ ...q })));
    setEditMode(true);
    setSaveSuccess(false);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditQuestions([]);
  };

  const updateEditQuestion = (index, field, value) => {
    setEditQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addEditQuestion = () => {
    setEditQuestions((prev) => [
      ...prev,
      { questionText: "", type: "technical", difficulty: "medium", timeLimit: 120 },
    ]);
  };

  const removeEditQuestion = (index) => {
    if (editQuestions.length <= 1) return;
    setEditQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const saveQuestions = async () => {
    const hasEmpty = editQuestions.some((q) => !q.questionText.trim());
    if (hasEmpty) {
      setError("All questions must have text");
      return;
    }

    setSaving(true);
    setError("");

    const result = await fetchFunction({
      apiUrl: `${QUESTIONS_URL}/${id}`,
      crudMethod: "PUT",
      postData: { questions: editQuestions },
      setError,
    });

    if (result?.status === "success") {
      setQuestions(result.data?.questions?.questions || editQuestions);
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }

    setSaving(false);
  };

  const getDifficultyColor = (d) => {
    switch (d) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeColor = (t) => {
    switch (t) {
      case "technical":
        return "bg-blue-100 text-blue-700";
      case "behavioral":
        return "bg-purple-100 text-purple-700";
      case "coding":
        return "bg-teal-100 text-teal-700";
      case "hr":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-gray-200 text-gray-700";
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

  if (!interview) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Interview not found</h3>
        <button
          onClick={() => navigate("/interviews")}
          className="mt-4 text-indigo-600 font-medium hover:underline"
        >
          Back to Interviews
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/interviews")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Interviews
      </button>

      {/* Interview Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">
                {interview.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(interview.status)}`}>
                {interview.status || "published"}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                {interview.accessType === "private" ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Globe className="w-4 h-4" />
                )}
                {interview.accessType}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {interview.role}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {interview.scheduledAt
                  ? new Date(interview.scheduledAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not scheduled"}
              </span>
              {interview.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {interview.duration} mins
                </span>
              )}
              {interview.type && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                  {interview.type}
                </span>
              )}
              {interview.difficulty && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(interview.difficulty)}`}>
                  {interview.difficulty}
                </span>
              )}
            </div>

            {interview.description && (
              <p className="text-gray-600 text-sm">{interview.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/interviews/${id}/invite`)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <Mail className="w-4 h-4" />
              Invite
            </button>
            <button
              onClick={() => navigate(`/interviews/${id}/results`)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <BarChart3 className="w-4 h-4" />
              Results
            </button>

            {/* Status controls */}
            {interview.status !== "closed" && (
              <button
                onClick={() =>
                  handleStatusChange(
                    interview.status === "draft" ? "published" : "closed"
                  )
                }
                disabled={actionLoading}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition disabled:opacity-50 ${
                  interview.status === "draft"
                    ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : interview.status === "draft" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
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
                onClick={() => handleStatusChange("published")}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
              >
                {actionLoading ? (
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
            {deleteConfirm ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Success Banner */}
      {saveSuccess && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5" />
          Questions updated successfully!
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Questions Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Questions ({editMode ? editQuestions.length : questions.length})
            </h2>
          </div>
          {!editMode ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <Edit3 className="w-4 h-4" />
              Edit Questions
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={saveQuestions}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          )}
        </div>

        {/* View Mode */}
        {!editMode && (
          <div className="space-y-3">
            {questions.length > 0 ? (
              questions.map((q, i) => (
                <div
                  key={q._id || i}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      {q.questionText}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                          q.type
                        )}`}
                      >
                        {q.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                      {q.timeLimit && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {q.timeLimit}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">
                No questions added yet. Click "Edit Questions" to add some.
              </p>
            )}
          </div>
        )}

        {/* Edit Mode */}
        {editMode && (
          <div className="space-y-4">
            {editQuestions.map((q, i) => (
              <div
                key={i}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">
                    Question {i + 1}
                  </span>
                  <button
                    onClick={() => removeEditQuestion(i)}
                    disabled={editQuestions.length <= 1}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-300 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={q.questionText}
                  onChange={(e) =>
                    updateEditQuestion(i, "questionText", e.target.value)
                  }
                  placeholder="Enter question text..."
                  rows={2}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateEditQuestion(i, "type", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <select
                    value={q.difficulty}
                    onChange={(e) =>
                      updateEditQuestion(i, "difficulty", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {DIFFICULTY_LEVELS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Time (sec):</label>
                    <input
                      type="number"
                      value={q.timeLimit || 120}
                      onChange={(e) =>
                        updateEditQuestion(
                          i,
                          "timeLimit",
                          parseInt(e.target.value) || 120
                        )
                      }
                      min={10}
                      max={600}
                      className="w-20 px-2 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEditQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        )}
      </div>

      {/* Invited Students */}
      {interview.invitedStudents?.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Invited Candidates ({interview.invitedStudents.length})
          </h2>
          <div className="space-y-2">
            {interview.invitedStudents.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{s.email}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    s.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : s.status === "started"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {s.status || "pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
