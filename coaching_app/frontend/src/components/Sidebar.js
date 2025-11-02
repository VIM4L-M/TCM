import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserFriends, FaClipboardList, FaHome, FaChartPie, FaChalkboardTeacher, FaUserTie } from "react-icons/fa";
import "../App.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">Coaching Manager</div>
      <nav className="sidebar-links">
        <NavLink to="/" className="nav-item"><FaHome /> Dashboard</NavLink>
        <NavLink to="/children" className="nav-item"><FaUserFriends /> Children</NavLink>
        <NavLink to="/attendance" className="nav-item"><FaClipboardList /> Attendance</NavLink>
        <NavLink to="/coaches" className="nav-item"><FaUserTie /> Coaches</NavLink>
        <NavLink to="/home-visits" className="nav-item"><FaHome /> Home Visits</NavLink>
        <NavLink to="/assessments" className="nav-item"><FaChalkboardTeacher /> Assessments</NavLink>
        <NavLink to="/reports" className="nav-item"><FaChartPie /> Reports</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
