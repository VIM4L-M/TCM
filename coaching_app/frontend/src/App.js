import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/children" element={<ChildProfiles />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/coaches" element={<Coaches />} />
                <Route path="/home-visits" element={<HomeVisits />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
