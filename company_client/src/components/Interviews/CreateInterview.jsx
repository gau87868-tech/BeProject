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
  Save,
  Send,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Questions" },
  { id: 3, label: "Review & Publish" },
];

const INTERVIEW_TYPES = ["technical", "hr", "mixed"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
const QUESTION_TYPES = ["technical", "behavioral", "coding", "hr"];

export default function CreateInterview() {
  const navigate = useNavigate();
  const { company } = useContext(CompanyAuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1: Basic Details — now includes type and difficulty
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    description: "",
    type: "mixed",
    difficulty: "medium",
    scheduledAt: "",
    duration: 30,
    accessType: "public",
  });

  // Step 2: Questions — now includes timeLimit
  const [questions, setQuestions] = useState([
    { questionText: "", type: "technical", difficulty: "medium", timeLimit: 120 },
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
      { questionText: "", type: "technical", difficulty: "medium", timeLimit: 120 },
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
  const handleSubmit = async (saveAsDraft = false) => {
    setSubmitting(true);
    setError("");

    try {
      // 1. Create the interview
      const interviewPayload = {
        ...formData,
        organizationId: company?._id,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        status: saveAsDraft ? "draft" : "published",
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
        setError(interviewResult?.message || "Failed to create interview");
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
        console.warn("Interview created but questions failed:", qResult?.message);
      }

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
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white rounded-2xl p-10 shadow-lg border border-gray-100 max-w-md"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Interview Created!
          </h2>
          <p className="text-gray-500 mb-6">
            Your interview has been created successfully.
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
                  type: "mixed",
                  difficulty: "medium",
                  scheduledAt: "",
                  duration: 30,
                  accessType: "public",
                });
                setQuestions([
                  { questionText: "", type: "technical", difficulty: "medium", timeLimit: 120 },
                ]);
              }}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Create Another
            </button>
          </div>
        </motion.div>
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

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, i) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                currentStep === step.id
                  ? "bg-indigo-600 text-white"
                  : currentStep > step.id
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {currentStep > step.id ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{step.id}</span>
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  currentStep > step.id ? "bg-green-400" : "bg-gray-200"
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
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        {/* STEP 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Basic Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Interview Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Job Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => updateForm("role", e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.role ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
              </div>

              {/* Interview Type (NEW) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Interview Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {INTERVIEW_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level (NEW) */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Difficulty Level</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => updateForm("difficulty", e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Schedule Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => updateForm("scheduledAt", e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.scheduledAt ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.scheduledAt && <p className="text-red-500 text-xs mt-1">{formErrors.scheduledAt}</p>}
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => updateForm("duration", parseInt(e.target.value) || 30)}
                  min={5}
                  max={180}
                  className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.duration && <p className="text-red-500 text-xs mt-1">{formErrors.duration}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateForm("description", e.target.value)}
                rows={3}
                placeholder="Describe the interview..."
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Access Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Access Type</label>
              <div className="flex gap-4">
                {["public", "private"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateForm("accessType", type)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 font-medium transition ${
                      formData.accessType === type
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {type === "public" ? (
                      <Globe className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {formData.accessType === "public"
                  ? "Any registered student can attempt this interview"
                  : "Only invited students can attempt this interview"}
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Questions */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                <HelpCircle className="w-5 h-5 inline mr-1 text-indigo-500" />
                Questions ({questions.length})
              </h2>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveQuestion(i, i - 1)}
                        disabled={i === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move up"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold text-gray-500">
                        Q{i + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(i)}
                      disabled={questions.length <= 1}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-300 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    value={q.questionText}
                    onChange={(e) => updateQuestion(i, "questionText", e.target.value)}
                    placeholder="Enter question text..."
                    rows={2}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(i, "type", e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <select
                      value={q.difficulty}
                      onChange={(e) => updateQuestion(i, "difficulty", e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DIFFICULTY_LEVELS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Time limit (sec):
                      </label>
                      <input
                        type="number"
                        value={q.timeLimit}
                        onChange={(e) => updateQuestion(i, "timeLimit", parseInt(e.target.value) || 120)}
                        min={10}
                        max={600}
                        className="w-20 px-2 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>
        )}

        {/* STEP 3: Review & Publish */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Review & Publish</h2>

            {/* Interview Summary */}
            <div className="bg-gray-50 rounded-lg p-5 space-y-3">
              <h3 className="font-semibold text-gray-800">Interview Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Title:</span> <span className="font-medium">{formData.title}</span></div>
                <div><span className="text-gray-500">Role:</span> <span className="font-medium">{formData.role}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{formData.type}</span></div>
                <div><span className="text-gray-500">Difficulty:</span> <span className="font-medium capitalize">{formData.difficulty}</span></div>
                <div><span className="text-gray-500">Duration:</span> <span className="font-medium">{formData.duration} mins</span></div>
                <div><span className="text-gray-500">Access:</span> <span className="font-medium capitalize">{formData.accessType}</span></div>
                <div className="col-span-2"><span className="text-gray-500">Scheduled:</span> <span className="font-medium">{formData.scheduledAt ? new Date(formData.scheduledAt).toLocaleString() : "N/A"}</span></div>
                {formData.description && <div className="col-span-2"><span className="text-gray-500">Description:</span> <span className="font-medium">{formData.description}</span></div>}
              </div>
            </div>

            {/* Questions Summary */}
            <div className="bg-gray-50 rounded-lg p-5 space-y-3">
              <h3 className="font-semibold text-gray-800">
                Questions ({questions.filter((q) => q.questionText.trim()).length})
              </h3>
              {questions.filter((q) => q.questionText.trim()).map((q, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="font-bold text-indigo-500">{i + 1}.</span>
                  <div>
                    <p className="text-gray-800">{q.questionText}</p>
                    <p className="text-xs text-gray-400">
                      {q.type} • {q.difficulty} • {q.timeLimit || 120}s
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            {/* Save as Draft */}
            <button
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save as Draft
            </button>
            {/* Publish */}
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Publish Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
