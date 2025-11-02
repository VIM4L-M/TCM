import React from "react";
import "../App.css";

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="dashboard-card" style={{ borderLeft: `6px solid ${color}` }}>
      <div className="icon-box" style={{ color }}>{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default DashboardCard;
