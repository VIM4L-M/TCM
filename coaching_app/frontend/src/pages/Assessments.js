import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

const Assessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/assessments/") // matches LSASAssessmentViewSet
      .then((res) => {
        setAssessments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching LSAS assessments:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        LSAS Assessment Records
      </Typography>

      <Table>
        <TableHead sx={{ backgroundColor: "#e0e7ff" }}>
          <TableRow>
            <TableCell>Child</TableCell>
            <TableCell>Assessment Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Assessor</TableCell>
            <TableCell>Overall Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assessments.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.child_name}</TableCell>
              <TableCell>{a.assessment_type}</TableCell>
              <TableCell>{a.assessment_date}</TableCell>
              <TableCell>{a.assessor_name}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{a.overall_score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default Assessment;
