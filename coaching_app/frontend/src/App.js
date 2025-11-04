import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChildProfiles from "./pages/ChildProfiles";
import Attendance from "./pages/Attendance";
import Coaches from "./pages/Coaches";
import HomeVisits from "./pages/HomeVisits";
import Assessments from "./pages/Assessments";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

import "./App.css";

function App() {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route
              path="/"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <Dashboard />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/dashboard"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <Dashboard />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/children"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <ChildProfiles />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/attendance"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <Attendance />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/coaches"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <Coaches />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/home-visits"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <HomeVisits />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/assessments"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <Assessments />
                    </div>
                  </div>
                </div>
              }
            />
            <Route
              path="/reports"
              element={
                <div className="app-container">
                  <Sidebar />
                  <div className="main-content">
                    <Navbar />
                    <div className="page-content">
                      <Reports />
                    </div>
                  </div>
                </div>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
