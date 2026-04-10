// src/components/Results/InterviewAnalytics.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import fetchFunction from "../../utils/fetchFunction";
import {
  INTERVIEW_ANALYTICS_URL,
  INTERVIEW_DETAIL_URL,
} from "../../utils/constants";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SCORE_COLORS = ["#ef4444", "#f97316", "#eab308", "#3b82f6", "#22c55e"];

const REC_COLORS = {
  "Strong Hire": "#16a34a",
  Hire: "#22c55e",
  Hold: "#eab308",
  Reject: "#ef4444",
  Pending: "#9ca3af",
};

const CustomTooltipBar = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2.5 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">Score: {label}</p>
        <p className="text-sm text-indigo-600">
          {payload[0].value} candidate{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2.5 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700">
          {payload[0].name}
        </p>
        <p className="text-sm" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} candidate{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

export default function InterviewAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    // Fetch both in parallel
    const [analyticsRes, interviewRes] = await Promise.all([
      fetchFunction({
        apiUrl: `${INTERVIEW_ANALYTICS_URL}/${id}`,
        crudMethod: "GET",
        setError,
      }),
      fetchFunction({
        apiUrl: `${INTERVIEW_DETAIL_URL}/${id}`,
        crudMethod: "GET",
        setError,
      }),
    ]);

    if (analyticsRes?.status === "success") {
      setAnalytics(analyticsRes.data);
    }
    if (interviewRes?.status === "success") {
      setInterview(interviewRes.data);
    }

    setLoading(false);
  };

  // Prepare chart data
  const scoreData = analytics?.scoreDistribution || [];
  const recData = analytics?.recommendationBreakdown
    ? Object.entries(analytics.recommendationBreakdown).map(([name, value]) => ({
        name,
        value,
        fill: REC_COLORS[name] || "#9ca3af",
      }))
    : [];

  const passRate =
    analytics && analytics.totalCandidates > 0
      ? Math.round((analytics.passCount / analytics.totalCandidates) * 100)
      : 0;

  // ─── Loading ─────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // ─── Render ──────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back */}
      <button
        onClick={() => navigate(`/interviews/${id}/results`)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition"
      >
        <ArrowLeft size={18} />
        Back to Results
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <BarChart3 className="text-indigo-600" size={28} />
          Interview Analytics
        </h1>
        <p className="text-gray-500">
          {interview?.title || "Interview"}
          {interview?.role ? ` — ${interview.role}` : ""}
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Empty state */}
      {analytics && analytics.totalCandidates === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            No analytics data yet
          </h3>
          <p className="text-gray-500 mt-1">
            Analytics will appear once candidates complete this interview.
          </p>
        </motion.div>
      ) : (
        <>
          {/* ─── Stat Cards ──────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: "Total Candidates",
                value: analytics?.totalCandidates || 0,
                icon: Users,
                color: "bg-indigo-500",
                lightBg: "bg-indigo-50",
                textColor: "text-indigo-600",
              },
              {
                label: "Average Score",
                value: `${analytics?.avgScore || 0}%`,
                icon: TrendingUp,
                color: "bg-blue-500",
                lightBg: "bg-blue-50",
                textColor: "text-blue-600",
              },
              {
                label: "Passed (≥60%)",
                value: analytics?.passCount || 0,
                icon: CheckCircle,
                color: "bg-green-500",
                lightBg: "bg-green-50",
                textColor: "text-green-600",
                sub: `${passRate}% pass rate`,
              },
              {
                label: "Failed (<60%)",
                value: analytics?.failCount || 0,
                icon: XCircle,
                color: "bg-red-500",
                lightBg: "bg-red-50",
                textColor: "text-red-600",
                sub: `${100 - passRate}% fail rate`,
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`${card.lightBg} p-3 rounded-xl`}>
                    <card.icon className={card.textColor} size={22} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {card.value}
                    </p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    {card.sub && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {card.sub}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── Charts Row ──────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-indigo-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Score Distribution
                </h2>
              </div>

              {scoreData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={scoreData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltipBar />} />
                    <Bar
                      dataKey="count"
                      name="Candidates"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={56}
                    >
                      {scoreData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SCORE_COLORS[index % SCORE_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-400">
                  No score data available
                </div>
              )}
            </motion.div>

            {/* Recommendation Breakdown Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <PieChartIcon className="text-indigo-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">
                  Recommendation Breakdown
                </h2>
              </div>

              {recData.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={recData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {recData.map((entry, index) => (
                          <Cell key={`pie-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltipPie />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
                    {recData.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="text-gray-600">
                          {entry.name}{" "}
                          <span className="font-semibold text-gray-800">
                            ({entry.value})
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-400">
                  No recommendation data available
                </div>
              )}
            </motion.div>
          </div>

          {/* ─── Pass / Fail Ratio Visual ─────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Pass / Fail Ratio
            </h2>

            <div className="flex items-center gap-4">
              {/* Bar */}
              <div className="flex-1 h-8 rounded-full bg-gray-100 overflow-hidden flex">
                {analytics?.passCount > 0 && (
                  <div
                    className="h-full bg-green-500 transition-all duration-700 flex items-center justify-center text-xs font-semibold text-white"
                    style={{
                      width: `${passRate}%`,
                      minWidth: passRate > 0 ? "32px" : "0",
                    }}
                  >
                    {passRate > 10 ? `${passRate}%` : ""}
                  </div>
                )}
                {analytics?.failCount > 0 && (
                  <div
                    className="h-full bg-red-400 transition-all duration-700 flex items-center justify-center text-xs font-semibold text-white"
                    style={{
                      width: `${100 - passRate}%`,
                      minWidth: 100 - passRate > 0 ? "32px" : "0",
                    }}
                  >
                    {100 - passRate > 10 ? `${100 - passRate}%` : ""}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-3 text-sm">
              <span className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle size={14} />
                Passed: {analytics?.passCount || 0} candidate
                {analytics?.passCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-2 text-red-500 font-medium">
                <XCircle size={14} />
                Failed: {analytics?.failCount || 0} candidate
                {analytics?.failCount !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
