// src/components/Dashboard/DashboardHome.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CompanyAuthContext } from "../../context/CompanyAuthContext";
import fetchFunction from "../../utils/fetchFunction";
import { COMPANY_DASHBOARD_URL } from "../../utils/constants";
import {
  ClipboardList,
  Users,
  UserCheck,
  CalendarClock,
  Plus,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function DashboardHome() {
  const { company } = useContext(CompanyAuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    const result = await fetchFunction({
      apiUrl: COMPANY_DASHBOARD_URL,
      crudMethod: "GET",
      setError,
    });
    if (result?.status === "success") {
      setStats(result.data);
    }
    setLoading(false);
  };

  const statCards = [
    {
      label: "Total Interviews",
      value: stats?.totalInterviews || 0,
      icon: ClipboardList,
      color: "bg-blue-500",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Active Interviews",
      value: stats?.activeInterviews || 0,
      icon: CalendarClock,
      color: "bg-green-500",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      label: "Total Candidates",
      value: stats?.totalCandidatesAttempted || 0,
      icon: Users,
      color: "bg-purple-500",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Shortlisted",
      value: stats?.shortlistedCandidates || 0,
      icon: UserCheck,
      color: "bg-amber-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {company?.companyName || "Company"} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's an overview of your interview activities
          </p>
        </div>
        <button
          onClick={() => navigate("/interviews/create")}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Create Interview
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.lightBg} p-3 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/interviews/create")}
        >
          <h3 className="text-lg font-semibold mb-2">Create New Interview</h3>
          <p className="text-indigo-100 text-sm mb-4">
            Set up an AI-powered interview with custom questions, scheduling, and candidate invitations.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium">
            Get Started <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/interviews")}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">View All Interviews</h3>
          <p className="text-gray-500 text-sm mb-4">
            Manage your interviews, check results, and track candidate progress.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            View Interviews <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats?.totalInterviews > 0 ? (
            <>
              <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    You have {stats.totalInterviews} interview{stats.totalInterviews !== 1 ? "s" : ""} created
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.activeInterviews} currently active
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {stats.totalCandidatesAttempted} candidate{stats.totalCandidatesAttempted !== 1 ? "s" : ""} attempted interviews
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.shortlistedCandidates} shortlisted so far
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No activity yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Create your first interview to get started
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}