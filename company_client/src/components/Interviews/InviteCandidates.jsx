// src/components/Interviews/InviteCandidates.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import fetchFunction from "../../utils/fetchFunction";
import { INVITE_STUDENTS_URL } from "../../utils/constants";
import {
  ArrowLeft,
  Mail,
  Plus,
  X,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  UserPlus,
} from "lucide-react";

export default function InviteCandidates() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("companyInterviews");
    if (stored) {
      const all = JSON.parse(stored);
      const found = all.find((iv) => iv._id === id);
      if (found) setInterview(found);
    }
  }, [id]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const addEmail = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;

    if (!emailRegex.test(trimmed)) {
      setInputError("Please enter a valid email");
      return;
    }

    if (emails.includes(trimmed)) {
      setInputError("Email already added");
      return;
    }

    setEmails((prev) => [...prev, trimmed]);
    setEmailInput("");
    setInputError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const removeEmail = (emailToRemove) => {
    setEmails((prev) => prev.filter((e) => e !== emailToRemove));
  };

  const handleBulkPaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    const parsed = pasted
      .split(/[,;\n\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => emailRegex.test(s));

    if (parsed.length > 0) {
      e.preventDefault();
      const unique = [...new Set([...emails, ...parsed])];
      setEmails(unique);
      setEmailInput("");
    }
  };

  const handleSendInvites = async () => {
    if (emails.length === 0) {
      setError("Please add at least one email");
      return;
    }

    setSending(true);
    setError("");
    setSuccess("");

    const result = await fetchFunction({
      apiUrl: `${INVITE_STUDENTS_URL}/${id}/invite`,
      crudMethod: "POST",
      postData: { interviewId: id, emails },
      setError,
    });

    if (
      result?.status === "Success" ||
      result?.status === "success"
    ) {
      setSuccess(
        `Invitations sent to ${emails.length} candidate${
          emails.length !== 1 ? "s" : ""
        }!`
      );
      setEmails([]);
    } else {
      setError(
        result?.message || "Failed to send invitations"
      );
    }

    setSending(false);
  };

  const isPrivate =
    interview?.accessType?.toLowerCase() === "private";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
          Invite Candidates
        </h1>
        <p className="text-gray-500 mt-1">
          {interview?.title || "Interview"} —{" "}
          {interview?.role || ""}
        </p>
      </div>

      {/* Warning for public interviews */}
      {interview && !isPrivate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Public Interview</p>
            <p className="text-sm mt-0.5">
              Email invitations can only be sent for private interviews.
              This interview is set to public — any registered student can
              attempt it. Change the access type to "Private" to send
              email invitations.
            </p>
          </div>
        </motion.div>
      )}

      {/* Invite Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-5">
          <UserPlus className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Add Candidate Emails
          </h2>
        </div>

        {/* Email Tags */}
        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {emails.map((email) => (
              <span
                key={email}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                {email}
                <button
                  onClick={() => removeEmail(email)}
                  className="hover:text-red-500 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Email Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setInputError("");
              }}
              onKeyDown={handleKeyDown}
              onPaste={handleBulkPaste}
              placeholder="Enter email and press Enter (or paste multiple)"
              disabled={!isPrivate && interview}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                inputError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {inputError && (
              <p className="text-red-500 text-sm mt-1">
                {inputError}
              </p>
            )}
          </div>
          <button
            onClick={addEmail}
            disabled={!isPrivate && !!interview}
            className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Tip: You can paste multiple emails separated by commas,
          semicolons, or newlines.
        </p>

        {/* Summary */}
        {emails.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {emails.length} candidate{emails.length !== 1 ? "s" : ""}{" "}
            ready to invite
          </div>
        )}

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mt-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mt-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}

        {/* Send Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSendInvites}
            disabled={
              sending ||
              emails.length === 0 ||
              (!isPrivate && !!interview)
            }
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Invitations
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Previously Invited */}
      {interview?.invitedStudents?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Previously Invited ({interview.invitedStudents.length})
          </h3>
          <div className="space-y-2">
            {interview.invitedStudents.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {s.email}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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
        </motion.div>
      )}
    </div>
  );
}