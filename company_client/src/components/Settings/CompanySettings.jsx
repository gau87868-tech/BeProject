// src/components/Settings/CompanySettings.jsx
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
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

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profile.companyName.trim()) {
      setProfileError("Company name is required");
      return;
    }

    // Update company in context and localStorage
    const updatedCompany = { ...company, ...profile };
    login(updatedCompany, localStorage.getItem("companyAccessToken"), localStorage.getItem("companyRefreshToken"));
    setProfileSuccess("Profile updated successfully!");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
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

    // Note: No backend endpoint for password change yet
    setPasswordSuccess("Password change feature coming soon. Backend endpoint needed.");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const tabs = [
    { key: "profile", label: "Company Profile", icon: Building2 },
    { key: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your company profile and account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
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
          <h3 className="text-lg font-semibold text-gray-800">Company Information</h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building2 className="w-4 h-4 inline mr-1" /> Company Name *
              </label>
              <input
                name="companyName"
                value={profile.companyName}
                onChange={handleProfileChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" /> Company Email
              </label>
              <input
                name="companyEmail"
                value={profile.companyEmail}
                readOnly
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" /> Contact Person
              </label>
              <input
                name="contactPerson"
                value={profile.contactPerson}
                onChange={handleProfileChange}
                placeholder="HR Manager name"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" /> Phone Number
              </label>
              <input
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleProfileChange}
                placeholder="+91 XXXXXXXXXX"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Factory className="w-4 h-4 inline mr-1" /> Industry
              </label>
              <select
                name="industry"
                value={profile.industry}
                onChange={handleProfileChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select Industry</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Globe className="w-4 h-4 inline mr-1" /> Website
              </label>
              <input
                name="website"
                value={profile.website}
                onChange={handleProfileChange}
                placeholder="https://company.com"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="w-4 h-4 inline mr-1" /> Company Description
            </label>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleProfileChange}
              rows={3}
              placeholder="Brief description about your company..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Messages */}
          {profileSuccess && (
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
              <CheckCircle2 className="w-5 h-5" /> {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5" /> {profileError}
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Save className="w-5 h-5" /> Save Changes
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
          <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Re-enter new password"
                className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwords.newPassword && passwords.confirmPassword && (
              <p className={`text-sm mt-1 ${
                passwords.newPassword === passwords.confirmPassword
                  ? "text-green-600" : "text-red-600"
              }`}>
                {passwords.newPassword === passwords.confirmPassword
                  ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Messages */}
          {passwordSuccess && (
            <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
              <CheckCircle2 className="w-5 h-5" /> {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5" /> {passwordError}
            </div>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Lock className="w-5 h-5" /> Update Password
          </button>
        </motion.form>
      )}

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
      >
        <p className="text-xs text-gray-500">
          Account created: {company?.createdAt ? new Date(company.createdAt).toLocaleDateString() : "N/A"}
          {" · "}
          Organization ID: <code className="text-xs bg-gray-200 px-1 rounded">{company?._id || "N/A"}</code>
        </p>
      </motion.div>
    </div>
  );
}