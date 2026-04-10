// src/App.jsx
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CompanyAuthContext } from "./context/CompanyAuthContext";

// Layout
import DashboardLayout from "./components/Layout/DashboardLayout";

// Auth Pages
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";

// Dashboard Pages
import DashboardHome from "./components/Dashboard/DashboardHome";
import InterviewList from "./components/Interviews/InterviewList";
import CreateInterview from "./components/Interviews/CreateInterview";
import InterviewDetail from "./components/Interviews/InterviewDetail";
import InviteCandidates from "./components/Interviews/InviteCandidates";
import InterviewResults from "./components/Results/InterviewResults";
import CandidateReport from "./components/Results/CandidateReport";
import InterviewAnalytics from "./components/Results/InterviewAnalytics"; // NEW
import CompanySettings from "./components/Settings/CompanySettings";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(CompanyAuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Guest Route wrapper (redirects to dashboard if already logged in)
function GuestRoute({ children }) {
  const { isAuthenticated } = useContext(CompanyAuthContext);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public/Guest routes */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected routes with sidebar layout */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="interviews" element={<InterviewList />} />
          <Route path="interviews/create" element={<CreateInterview />} />
          <Route path="interviews/:id" element={<InterviewDetail />} />
          <Route path="interviews/:id/invite" element={<InviteCandidates />} />
          <Route path="interviews/:id/results" element={<InterviewResults />} />
          <Route path="interviews/:id/analytics" element={<InterviewAnalytics />} />
          <Route path="results/:resultId" element={<CandidateReport />} />
          <Route path="settings" element={<CompanySettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
