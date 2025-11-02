import React from "react";
import DashboardCard from "../components/DashboardCard";
import { Grid } from "@mui/material";
import { FaUserFriends, FaClipboardList, FaUserTie, FaChartPie } from "react-icons/fa";

function Dashboard() {
  return (
    <div>
      <h2>Welcome, Programme Manager 👋</h2>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Children" value="1,250" icon={<FaUserFriends />} color="#3b82f6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Active Sessions" value="58" icon={<FaClipboardList />} color="#22c55e" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Coaches" value="24" icon={<FaUserTie />} color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Communities" value="12" icon={<FaChartPie />} color="#ef4444" />
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
