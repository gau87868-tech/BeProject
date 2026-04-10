// src/components/Interviews/InterviewDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import fetchFunction from "../../utils/fetchFunction";
import { QUESTIONS_URL } from "../../utils/constants";
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

  useEffect(() => {
    loadInterviewData();
  }, [id]);

  const loadInterviewData = async () => {
    setLoading(true);
    setError("");

    // Load interview from localStorage
    const stored = localStorage.getItem("companyInterviews");
    if (stored) {
      const all = JSON.parse(stored);
      const found = all.find((iv) => iv._id === id);
      if (found) setInterview(found);
    }

    // Load questions from API
    const result = await fetchFunction({
      apiUrl: `${QUESTIONS_URL}/${id}`,
      crudMethod: "GET",
      setError,
    });

    if (result?.status === "success" && result?.data?.questions) {
      setQuestions(result.data.questions.questions || []);
    }

    setLoading(false);
  };

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
      { questionText: "", type: "technical", difficulty: "medium" },
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
      setQuestions(
        result.data?.questions?.questions || editQuestions
      );
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/interviews")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Interviews
      </button>

      {/* Interview Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-800">
                {interview?.title || "Interview"}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                  interview?.accessType === "private"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {interview?.accessType === "private" ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                {interview?.accessType}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {interview?.role || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {interview?.scheduledAt
                  ? new Date(
                      interview.scheduledAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not scheduled"}
              </span>
              {interview?.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {interview.duration} mins
                </span>
              )}
            </div>

            {interview?.description && (
              <p className="text-gray-600 mt-3">
                {interview.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/interviews/${id}/invite`)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <Mail className="w-4 h-4" /> Invite
            </button>
            <button
              onClick={() => navigate(`/interviews/${id}/results`)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <BarChart3 className="w-4 h-4" /> Results
            </button>
          </div>
        </div>
      </motion.div>

      {/* Success Banner */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Questions updated successfully!
        </motion.div>
      )}

      {/* Questions Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Questions ({editMode ? editQuestions.length : questions.length})
            </h2>
          </div>
          {!editMode ? (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              <Edit3 className="w-4 h-4" /> Edit Questions
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={saveQuestions}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* View Mode */}
        {!editMode && (
          <div className="space-y-3">
            {questions.length > 0 ? (
              questions.map((q, i) => (
                <div
                  key={q._id || i}
                  className="bg-gray-50 rounded-lg p-4 flex items-start gap-3"
                >
                  <span className="bg-indigo-100 text-indigo-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">
                      {q.questionText}
                    </p>
                    <div className="flex gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${getTypeColor(
                          q.type
                        )}`}
                      >
                        {q.type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${getDifficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No questions added yet</p>
                <button
                  onClick={startEdit}
                  className="mt-3 text-indigo-600 font-medium hover:underline"
                >
                  Add questions
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit Mode */}
        {editMode && (
          <div className="space-y-4">
            {editQuestions.map((q, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <span className="bg-indigo-100 text-indigo-700 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-3">
                    <textarea
                      value={q.questionText}
                      onChange={(e) =>
                        updateEditQuestion(
                          index,
                          "questionText",
                          e.target.value
                        )
                      }
                      placeholder="Enter your question..."
                      rows={2}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
                    />
                    <div className="flex gap-3">
                      <select
                        value={q.type}
                        onChange={(e) =>
                          updateEditQuestion(
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {QUESTION_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </option>
                        ))}
                      </select>
                      <select
                        value={q.difficulty}
                        onChange={(e) =>
                          updateEditQuestion(
                            index,
                            "difficulty",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {DIFFICULTY_LEVELS.map((d) => (
                          <option key={d} value={d}>
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEditQuestion(index)}
                    disabled={editQuestions.length <= 1}
                    className="text-gray-400 hover:text-red-500 disabled:opacity-30 transition p-1"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addEditQuestion}
              className="flex items-center gap-2 px-4 py-2.5 text-indigo-600 border-2 border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition w-full justify-center font-medium"
            >
              <Plus className="w-5 h-5" /> Add Question
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}