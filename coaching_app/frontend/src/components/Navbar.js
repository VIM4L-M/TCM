import React, { useState, useRef, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Notifications from "../components/Notifications";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar" style={styles.navbar}>
      <div className="navbar-left">
        <h2>Coaching Programme</h2>
      </div>

      <div className="navbar-right" ref={notifRef} style={styles.navRight}>
        <FaBell
          className="icon"
          onClick={() => setShowNotifications(!showNotifications)}
          style={styles.bellIcon}
        />

        {/* Animated popup */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              key="notif-popup"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              style={styles.popupWrapper}
            >
              <Notifications />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "10px 20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 10,
  },
  navRight: {
    position: "relative",
  },
  bellIcon: {
    cursor: "pointer",
    fontSize: "20px",
    color: "#1E3A8A",
  },
  popupWrapper: {
    position: "absolute",
    top: "40px",
    right: "0",
    zIndex: 100,
  },
};

export default Navbar;
