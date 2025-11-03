import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function ReportAnalytics() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/reports/")
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#1e3a8a" }}>
        Report Analytics Overview
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            📈 Attendance Rate Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="report_date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance_rate" stroke="#2563eb" name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            📊 Children & Coaches Report
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="report_date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_children" fill="#34d399" name="Children" />
              <Bar dataKey="total_coaches" fill="#f59e0b" name="Coaches" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mt: 4, color: "#4b5563" }}>
        Average Assessment Score (latest report):{" "}
        <strong>
          {reports.length > 0 ? reports[0].avg_assessment_score.toFixed(2) : "N/A"}
        </strong>
      </Typography>
    </Paper>
  );
}

export default ReportAnalytics;
