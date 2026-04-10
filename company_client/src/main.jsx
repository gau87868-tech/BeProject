import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.jsx';
import { CompanyAuthProvider } from "./context/CompanyAuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CompanyAuthProvider>
      <App />
    </CompanyAuthProvider>
  </React.StrictMode>
);
