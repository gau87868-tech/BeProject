// src/components/Interviews/CreateInterview.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import fetchFunction from "../../utils/fetchFunction";
import {
  CREATE_INTERVIEW_URL,
  CREATE_QUESTIONS_URL,
} from "../../utils/constants";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  Calendar,
  Clock,
  Globe,
  Lock,
  FileText,
  HelpCircle,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Questions" },
  { id: 3, label: "Review & Publish" },
];

const QUESTION_TYPES = ["technical", "behavioral", "coding", "hr"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

export default function CreateInterview() {
  const navigate = useNavigate();
  const { company } = useContext(CompanyAuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1: Basic Details
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    description: "",
    scheduledAt: "",
    duration: 30,
    accessType: "public",
  });

  // Step 2: Questions
  const [questions, setQuestions] = useState([
    { questionText: "", type: "technical", difficulty: "medium" },
  ]);

  const [formErrors, setFormErrors] = useState({});

  // ------ Handlers ------

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { questionText: "", type: "technical", difficulty: "medium" },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const moveQuestion = (from, to) => {
    if (to < 0 || to >= questions.length) return;
    setQuestions((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  };

  // ------ Validation ------

  const validateStep1 = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Interview title is required";
    if (!formData.role.trim()) errs.role = "Job role is required";
    if (!formData.scheduledAt) errs.scheduledAt = "Scheduled date is required";
    if (formData.duration < 5 || formData.duration > 180)
      errs.duration = "Duration must be 5–180 minutes";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const hasEmpty = questions.some((q) => !q.questionText.trim());
    if (hasEmpty) {
      setError("All questions must have text");
      return false;
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // ------ Submit ------

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      // 1. Create the interview
      const interviewPayload = {
        ...formData,
        organizationId: company?._id,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
      };

      const interviewResult = await fetchFunction({
        apiUrl: CREATE_INTERVIEW_URL,
        crudMethod: "POST",
        postData: interviewPayload,
        setError,
      });

      if (
        interviewResult?.status !== "success" ||
        !interviewResult?.createdInterview
      ) {
        setError(
          interviewResult?.message || "Failed to create interview"
        );
        setSubmitting(false);
        return;
      }

      const createdInterview = interviewResult.createdInterview;

      // 2. Add questions
      const questionsPayload = {
        interviewId: createdInterview._id,
        organizationId: company?._id,
        questions: questions.filter((q) => q.questionText.trim()),
      };

      const qResult = await fetchFunction({
        apiUrl: CREATE_QUESTIONS_URL,
        crudMethod: "POST",
        postData: questionsPayload,
        setError,
      });

      if (qResult?.status !== "success") {
        console.warn(
          "Interview created but questions failed:",
          qResult?.message
        );
      }

      // 3. Save to localStorage for the list page
      const stored = localStorage.getItem("companyInterviews");
      const existing = stored ? JSON.parse(stored) : [];
      existing.unshift({
        ...createdInterview,
        status: "published",
        questionsCount: questions.length,
      });
      localStorage.setItem(
        "companyInterviews",
        JSON.stringify(existing)
      );

      setSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ------ Success Screen ------

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-16"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Interview Created! 🎉
        </h2>
        <p className="text-gray-500 mb-8">
          Your interview has been published with {questions.length} question
          {questions.length !== 1 ? "s" : ""}.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/interviews")}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            View Interviews
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setCurrentStep(1);
              setFormData({
                title: "",
                role: "",
                description: "",
                scheduledAt: "",
                duration: 30,
                accessType: "public",
              });
              setQuestions([
                {
                  questionText: "",
                  type: "technical",
                  difficulty: "medium",
                },
              ]);
            }}
            className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Create Another
          </button>
        </div>
      </motion.div>
    );
  }

  // ------ Render ------

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/interviews")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Interviews
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Interview
      </h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  currentStep >= step.id
                    ? "text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        {/* ---------- STEP 1: Basic Details ---------- */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Interview Details
              </h2>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="e.g., Frontend Developer Interview"
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.title
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.title}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Role *
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => updateForm("role", e.target.value)}
                placeholder="e.g., React Developer"
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  formErrors.role
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {formErrors.role && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.role}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  updateForm("description", e.target.value)
                }
                placeholder="Brief description of the interview..."
                rows={3}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Schedule & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Scheduled Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) =>
                    updateForm("scheduledAt", e.target.value)
                  }
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.scheduledAt
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.scheduledAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.scheduledAt}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    updateForm("duration", parseInt(e.target.value) || 30)
                  }
                  min={5}
                  max={180}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.duration
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.duration && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.duration}
                  </p>
                )}
              </div>
            </div>

            {/* Access Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Type
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => updateForm("accessType", "public")}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    formData.accessType === "public"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Globe
                    className={`w-5 h-5 ${
                      formData.accessType === "public"
                        ? "text-indigo-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Public</p>
                    <p className="text-xs text-gray-500">
                      Any registered student can attempt
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => updateForm("accessType", "private")}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    formData.accessType === "private"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Lock
                    className={`w-5 h-5 ${
                      formData.accessType === "private"
                        ? "text-indigo-600"
                        : "text-gray-400"
                    }`}
                  />
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Private</p>
                    <p className="text-xs text-gray-500">
                      Only invited students
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------- STEP 2: Questions ---------- */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Interview Questions
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                {questions.length} question
                {questions.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Question Cards */}
            <div className="space-y-4">
              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    {/* Drag handle + number */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <button
                        onClick={() =>
                          moveQuestion(index, index - 1)
                        }
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <span className="text-xs font-bold text-gray-400">
                        {index + 1}
                      </span>
                      <button
                        onClick={() =>
                          moveQuestion(index, index + 1)
                        }
                        disabled={index === questions.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Question text */}
                      <textarea
                        value={q.questionText}
                        onChange={(e) =>
                          updateQuestion(
                            index,
                            "questionText",
                            e.target.value
                          )
                        }
                        placeholder="Enter your question..."
                        rows={2}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white"
                      />

                      {/* Type & Difficulty */}
                      <div className="flex gap-3">
                        <select
                          value={q.type}
                          onChange={(e) =>
                            updateQuestion(
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
                            updateQuestion(
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

                    {/* Delete button */}
                    <button
                      onClick={() => removeQuestion(index)}
                      disabled={questions.length <= 1}
                      className="text-gray-400 hover:text-red-500 disabled:opacity-30 transition p-1"
                      title="Remove question"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Question */}
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2.5 text-indigo-600 border-2 border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition w-full justify-center font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>
        )}

        {/* ---------- STEP 3: Review & Publish ---------- */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Review & Publish
            </h2>

            {/* Interview Summary */}
            <div className="bg-gray-50 rounded-lg p-5 space-y-3">
              <h3 className="font-semibold text-gray-800">
                Interview Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Title:</span>{" "}
                  <span className="font-medium">
                    {formData.title}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Role:</span>{" "}
                  <span className="font-medium">{formData.role}</span>
                </div>
                <div>
                  <span className="text-gray-500">Schedule:</span>{" "}
                  <span className="font-medium">
                    {formData.scheduledAt
                      ? new Date(
                          formData.scheduledAt
                        ).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>{" "}
                  <span className="font-medium">
                    {formData.duration} mins
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Access:</span>{" "}
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${
                      formData.accessType === "private"
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  >
                    {formData.accessType === "private" ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Globe className="w-3 h-3" />
                    )}
                    {formData.accessType}
                  </span>
                </div>
              </div>
              {formData.description && (
                <div className="text-sm">
                  <span className="text-gray-500">Description:</span>
                  <p className="mt-1 text-gray-700">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Questions Summary */}
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-3">
                Questions ({questions.length})
              </h3>
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-sm bg-white p-3 rounded-lg"
                  >
                    <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-800">
                        {q.questionText || "(empty)"}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                          {q.type}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Publish Interview
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}