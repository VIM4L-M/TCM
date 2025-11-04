import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Assessment = () => {
  const [assessments, setAssessments] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Simulated API call (frontend only)
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        child_name: "Aarav Kumar",
        assessment_type: "LSAS - Emotional Wellbeing",
        assessment_date: "2025-10-29",
        assessor_name: "Coach Priya",
        overall_score: "85%",
      },
      {
        id: 2,
        child_name: "Meera Sharma",
        assessment_type: "LSAS - Cognitive Skills",
        assessment_date: "2025-10-30",
        assessor_name: "Coach Ravi",
        overall_score: "90%",
      },
      {
        id: 3,
        child_name: "Rohan Patel",
        assessment_type: "LSAS - Physical Development",
        assessment_date: "2025-11-01",
        assessor_name: "Coach Neha",
        overall_score: "78%",
      },
      {
        id: 4,
        child_name: "Sara Khan",
        assessment_type: "LSAS - Social Interaction",
        assessment_date: "2025-11-02",
        assessor_name: "Coach Dev",
        overall_score: "88%",
      },
    ];

    // Simulate loading delay
    setTimeout(() => setAssessments(mockData), 800);
  }, []);

  return (
    <Paper sx={{ p: 3, mt: 3, overflowX: "auto" }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 600,
          fontFamily: "Poppins, sans-serif",
          color: "#1e293b",
        }}
      >
        LSAS Assessment Records
      </Typography>

      {/* Responsive Table */}
      <Table
        sx={{
          minWidth: isMobile ? "600px" : "100%",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <TableHead sx={{ backgroundColor: "#e0e7ff" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Child</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Assessment Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Assessor</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Overall Score</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {assessments.length > 0 ? (
            assessments.map((a) => (
              <TableRow
                key={a.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f8fafc" },
                  transition: "0.2s ease",
                }}
              >
                <TableCell>{a.child_name}</TableCell>
                <TableCell>{a.assessment_type}</TableCell>
                <TableCell>{a.assessment_date}</TableCell>
                <TableCell>{a.assessor_name}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#2563eb" }}>
                  {a.overall_score}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Loading data...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Assessment;
