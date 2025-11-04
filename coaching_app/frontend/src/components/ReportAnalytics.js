import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Divider,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Mock sample data (no backend)
  useEffect(() => {
    const sampleData = [
      {
        report_date: "Oct 01",
        attendance_rate: 82,
        total_children: 45,
        total_coaches: 5,
        avg_assessment_score: 78,
      },
      {
        report_date: "Oct 08",
        attendance_rate: 88,
        total_children: 48,
        total_coaches: 6,
        avg_assessment_score: 81,
      },
      {
        report_date: "Oct 15",
        attendance_rate: 91,
        total_children: 50,
        total_coaches: 6,
        avg_assessment_score: 85,
      },
      {
        report_date: "Oct 22",
        attendance_rate: 86,
        total_children: 53,
        total_coaches: 7,
        avg_assessment_score: 84,
      },
      {
        report_date: "Oct 29",
        attendance_rate: 94,
        total_children: 56,
        total_coaches: 7,
        avg_assessment_score: 88,
      },
    ];

    // Simulate fetch delay
    setTimeout(() => {
      setReports(sampleData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2, color: "#475569" }}>
          Loading report analytics...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: isMobile ? 2 : 3,
        mt: 3,
        borderRadius: 3,
        backgroundColor: "#f9fafb",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 700,
          color: "#1e3a8a",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Reports & Analytics
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Attendance Trend Line Chart */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📈 Attendance Rate Over Time
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="report_date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance_rate"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Attendance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Children vs Coaches Bar Chart */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            📊 Children & Coaches Report
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="report_date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_children"
                fill="#22c55e"
                name="Children"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="total_coaches"
                fill="#f97316"
                name="Coaches"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      {/* Summary Section */}
      <Box
        sx={{
          mt: 4,
          backgroundColor: "#e0e7ff",
          p: 2,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "#1e3a8a" }}>
          📘 Average Assessment Score (Latest Report):{" "}
          <strong>
            {reports[reports.length - 1]?.avg_assessment_score ?? "N/A"}%
          </strong>
        </Typography>
      </Box>
    </Paper>
  );
}

export default ReportAnalytics;
