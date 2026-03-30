import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { InterviewProvider } from "./context/InterviewContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <InterviewProvider>
        <AppWrapper />
      </InterviewProvider>
    </AuthProvider>
  </React.StrictMode>
);
