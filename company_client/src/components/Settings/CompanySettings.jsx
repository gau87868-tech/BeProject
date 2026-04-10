// src/components/Settings/CompanySettings.jsx
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import fetchFunction from "../../utils/fetchFunction";
import { COMPANY_PROFILE_URL, COMPANY_PASSWORD_URL } from "../../utils/constants";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  User,
  Factory,
  FileText,
  Save,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function CompanySettings() {
  const { company, login } = useContext(CompanyAuthContext);

  // Profile form state
  const [profile, setProfile] = useState({
    companyName: company?.companyName || "",
    companyEmail: company?.companyEmail || "",
    contactPerson: company?.contactPerson || "",
    phoneNumber: company?.phoneNumber || "",
    industry: company?.industry || "",
    description: company?.description || "",
    website: company?.website || "",
  });

  // Password form state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Other",
  ];

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setProfileSuccess("");
    setProfileError("");
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setPasswordSuccess("");
    setPasswordError("");
  };

  // ─── FIX: Profile save now calls PATCH /api/v2/organization/profile ───
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    if (!profile.companyName.trim()) {
      setProfileError("Company name is required");
      return;
    }

    setSavingProfile(true);

    const payload = {
      companyName: profile.companyName.trim(),
      contactPerson: profile.contactPerson.trim(),
      phoneNumber: profile.phoneNumber.trim(),
      industry: profile.industry,
      description: profile.description.trim(),
      website: profile.website.trim(),
    };

    const result = await fetchFunction({
      apiUrl: COMPANY_PROFILE_URL,
      crudMethod: "PATCH",
      postData: payload,
      setError: setProfileError,
    });

    if (result?.status === "success") {
      // Update context and localStorage with the response from the server
      const updatedOrg = result.organization;
      login(
        updatedOrg,
        localStorage.getItem("companyAccessToken"),
        localStorage.getItem("companyRefreshToken")
      );
      setProfileSuccess("Profile updated successfully!");
    } else if (!profileError) {
      setProfileError(result?.message || "Failed to update profile");
    }

    setSavingProfile(false);
  };

  // ─── FIX: Password change now calls PATCH /api/v2/organization/password ───
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (!passwords.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);

    const result = await fetchFunction({
      apiUrl: COMPANY_PASSWORD_URL,
      crudMethod: "PATCH",
      postData: {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      },
      setError: setPasswordError,
    });

    if (result?.status === "success") {
      setPasswordSuccess("Password changed successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else if (!passwordError) {
      setPasswordError(result?.message || "Failed to change password");
    }

    setSavingPassword(false);
  };

  const tabs = [
    { key: "profile", label: "Company Profile", icon: Building2 },
    { key: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your company profile and account</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleProfileSave}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5"
        >
          <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company Name */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4" />
                Company Name *
              </label>
              <input type="text" name="companyName" value={profile.companyName} onChange={handleProfileChange} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4" />
                Company Email
              </label>
              <input type="email" value={profile.companyEmail} readOnly className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            {/* Contact Person */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4" />
                Contact Person
              </label>
              <input type="text" name="contactPerson" value={profile.contactPerson} onChange={handleProfileChange} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleProfileChange} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* Industry */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Factory className="w-4 h-4" />
                Industry
              </label>
              <select name="industry" value={profile.industry} onChange={handleProfileChange} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="">Select Industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Website */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                <Globe className="w-4 h-4" />
                Website
              </label>
              <input type="text" name="website" value={profile.website} onChange={handleProfileChange} placeholder="https://" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4" />
              Company Description
            </label>
            <textarea name="description" value={profile.description} onChange={handleProfileChange} rows={3} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          {/* Messages */}
          {profileSuccess && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5" />
              {profileError}
            </div>
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {savingProfile ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Save Changes
          </button>
        </motion.form>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handlePasswordSave}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5"
        >
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>

          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPasswords.current ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPasswords.new ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPasswords.confirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {passwords.newPassword && passwords.confirmPassword && (
              <p className={`text-sm mt-1 ${passwords.newPassword === passwords.confirmPassword ? "text-green-600" : "text-red-600"}`}>
                {passwords.newPassword === passwords.confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Messages */}
          {passwordSuccess && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5" />
              {passwordError}
            </div>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {savingPassword ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            Change Password
          </button>
        </motion.form>
      )}
    </div>
  );
}
