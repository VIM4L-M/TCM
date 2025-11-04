import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import { Grid, CircularProgress } from "@mui/material";
import { FaUserFriends, FaClipboardList, FaUserTie, FaChartPie } from "react-icons/fa";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dashboard/") // 🔹 adjust endpoint to your Django backend
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
      </div>
    );
  }

  // ✅ Optional chaining + default fallback values prevent null errors
  return (
    <div style={{  width: "100%", height: "100%" }}>
      <h2>Welcome, Programme Manager 👋</h2>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Children"
            value={stats?.total_children ?? 0}
            icon={<FaUserFriends />}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Active Sessions"
            value={stats?.active_sessions ?? 0}
            icon={<FaClipboardList />}
            color="#22c55e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Coaches"
            value={stats?.total_coaches ?? 0}
            icon={<FaUserTie />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Communities"
            value={stats?.total_communities ?? 0}
            icon={<FaChartPie />}
            color="#ef4444"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
