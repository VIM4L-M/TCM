import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();

  const handleNotifClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear stored token
    navigate("/login", { replace: true }); // redirect to login
    window.location.reload(); // ensure full app reset
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <h2 className="navbar-title">Coaching Programme Portal</h2>
      <div className="navbar-icons">
        {/* Notification Icon */}
        <div className="icon-container" ref={notifRef}>
          <FaBell className="icon" onClick={handleNotifClick} />
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="dropdown notification-dropdown"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h4>Notifications</h4>
                <p>No new notifications</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Icon */}
        <div className="icon-container" ref={profileRef}>
          <FaUserCircle className="icon" onClick={handleProfileClick} />
          <AnimatePresence>
            {showProfile && (
              <motion.div
                className="dropdown profile-dropdown"
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h4>Programme Manager</h4>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
