import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "../App.css";

function Navbar() {
  return (
    <div className="navbar">
      <h3>Coaching Programme Dashboard</h3>
      <div className="navbar-right">
        <FaBell className="icon" />
        <FaUserCircle className="icon" />
      </div>
    </div>
  );
}

export default Navbar;
