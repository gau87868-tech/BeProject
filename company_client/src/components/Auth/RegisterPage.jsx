// src/components/Auth/RegisterPage.jsx
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import { Eye, EyeOff, Building2, CheckCircle, XCircle } from "lucide-react";
import fetchFunction from "../../utils/fetchFunction";
import { COMPANY_REGISTER_URL } from "../../utils/constants";

const INDUSTRIES = [
 "Technology",
 "Finance",
 "Healthcare",
 "Education",
 "Manufacturing",
 "Retail",
 "Consulting",
 "Other",
];

function PasswordStrength({ password }) {
 const checks = [
 { label: "At least 6 characters", test: password.length >= 6 },
 { label: "Uppercase letter", test: /[A-Z]/.test(password) },
 { label: "Lowercase letter", test: /[a-z]/.test(password) },
 { label: "Number", test: /\d/.test(password) },
 { label: "Special character", test: /[!@#$%^&*()_\-+=[{\]};:'",.<>/?\\|`~]/.test(password) },
 ];

 const passed = checks.filter((c) => c.test).length;
 const strength =
 passed <= 1 ? "Weak" : passed <= 3 ? "Fair" : passed <= 4 ? "Good" : "Strong";
 const color =
 passed <= 1
      ? "bg-red-500"
      : passed <= 3
      ? "bg-yellow-500"
      : passed <= 4
      ? "bg-blue-500"
      : "bg-green-500";

 if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${(passed / checks.length) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          passed <= 1 ? "text-red-600" : passed <= 3 ? "text-yellow-600" : passed <= 4 ? "text-blue-600" : "text-green-600"
        }`}>
          {strength}
        </span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {c.test ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
            )}
            <span className={`text-xs ${c.test ? "text-green-700" : "text-gray-400"}`}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// FIX: InputField moved OUTSIDE RegisterPage so it doesn't get re-created every render.
// When it was defined inside, every keystroke caused React to see a "new" component,
// unmount the old input, and mount a fresh one — which loses focus.
function InputField({ label, field, type = "text", placeholder, required, children, form, errors, updateField }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input
          type={type}
          value={form[field]}
          onChange={(e) => updateField(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
            errors[field] ? "border-red-500 bg-red-50/50" : "border-gray-300"
          }`}
        />
      )}
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {errors[field]}
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, setLoading } = useContext(CompanyAuthContext);

  // Form state
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
    contactPerson: "",
    phoneNumber: "",
    industry: "",
    website: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Generic field updater
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Validation
  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    if (form.companyName.trim() && form.companyName.trim().length < 2)
      errs.companyName = "Company name must be at least 2 characters";

    if (!form.companyEmail.trim()) errs.companyEmail = "Email is required";
    else if (!emailRegex.test(form.companyEmail))
      errs.companyEmail = "Please enter a valid email address";

    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";

    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (form.phoneNumber && !/^[+]?[\d\s()-]{7,15}$/.test(form.phoneNumber))
      errs.phoneNumber = "Please enter a valid phone number";

    if (
      form.website &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/.*)?$/.test(form.website)
    )
      errs.website = "Please enter a valid URL";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFetchError("");

    if (!validate()) return;

    setSubmitting(true);
    setLoading(true);

    // Build payload — only send fields the backend expects (exclude confirmPassword)
    const payload = {
      companyName: form.companyName.trim(),
      companyEmail: form.companyEmail.trim().toLowerCase(),
      password: form.password,
    };
    if (form.contactPerson.trim()) payload.contactPerson = form.contactPerson.trim();
    if (form.phoneNumber.trim()) payload.phoneNumber = form.phoneNumber.trim();
    if (form.industry) payload.industry = form.industry;
    if (form.website.trim()) payload.website = form.website.trim();

    try {
      const result = await fetchFunction({
        apiUrl: COMPANY_REGISTER_URL,
        crudMethod: "POST",
        postData: payload,
        setError: setFetchError,
      });

      if (result?.status === "success") {
        login(result.organization, result.accessToken, result.refreshToken);
        navigate("/dashboard");
      } else {
        setFetchError(
          result?.error || result?.message || "Registration failed. Please try again."
        );
      }
    } catch (err) {
      setFetchError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-5/12 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-12 h-12" />
            <span className="text-3xl font-bold">AI Interviewer</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Join Our Platform</h1>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Register your organization to start creating AI-powered interviews,
            inviting candidates, and making smarter hiring decisions.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Set up in under 2 minutes",
              "Create unlimited interviews",
              "AI evaluation & scoring",
              "Invite candidates via email",
              "Real-time analytics & reports",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-indigo-200">
                <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-indigo-200 italic">
              "AI Interviewer streamlined our hiring pipeline and saved us 60% of
              the time we used to spend on initial screenings."
            </p>
            <p className="text-sm text-white font-semibold mt-2">— HR Team, TechVerito</p>
          </div>
        </motion.div>
      </div>

      {/* Right — Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-2 mb-6 justify-center">
            <Building2 className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">AI Interviewer</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create your account</h2>
          <p className="text-gray-500 mb-6">Fill in your company details to get started</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Section: Company Information ── */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company Name"
                  field="companyName"
                  placeholder="Acme Inc."
                  required
                  form={form}
                  errors={errors}
                  updateField={updateField}
                />
                <InputField
                  label="Company Email"
                  field="companyEmail"
                  type="email"
                  placeholder="hr@acme.com"
                  required
                  form={form}
                  errors={errors}
                  updateField={updateField}
                />
                <InputField label="Industry" field="industry" placeholder="Select industry" form={form} errors={errors} updateField={updateField}>
                  <select
                    value={form.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white ${
                      errors.industry ? "border-red-500 bg-red-50/50" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </InputField>
                <InputField
                  label="Website"
                  field="website"
                  type="url"
                  placeholder="https://acme.com"
                  form={form}
                  errors={errors}
                  updateField={updateField}
                />
              </div>
            </div>

            {/* ── Section: Contact Details ── */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Contact Person"
                  field="contactPerson"
                  placeholder="John Doe"
                  form={form}
                  errors={errors}
                  updateField={updateField}
                />
                <InputField
                  label="Phone Number"
                  field="phoneNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  form={form}
                  errors={errors}
                  updateField={updateField}
                />
              </div>
            </div>

            {/* ── Section: Security ── */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Create a strong password"
                      className={`w-full p-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                        errors.password ? "border-red-500 bg-red-50/50" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.password}
                    </p>
                  )}
                  <PasswordStrength password={form.password} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                      className={`w-full p-3 pr-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                        errors.confirmPassword ? "border-red-500 bg-red-50/50" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    >
                      {showConfirm ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {errors.confirmPassword}
                    </p>
                  )}
                  {form.confirmPassword &&
                    form.password === form.confirmPassword &&
                    !errors.confirmPassword && (
                      <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Passwords match
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Fetch Error */}
            {fetchError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-200 ${
                submitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
