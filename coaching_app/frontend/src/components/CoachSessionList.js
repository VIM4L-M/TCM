import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function CoachSessionList() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend API
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/coaches/")
      .then((res) => {
        setCoaches(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching coach data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Coach Session Tracker
      </Typography>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <Table>
          <TableHead sx={{ backgroundColor: "#e0e7ff" }}>
            <TableRow>
              <TableCell>Coach ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Sessions</TableCell>
              <TableCell>Travel Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coaches.length > 0 ? (
              coaches.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone || "—"}</TableCell>
                  <TableCell>{c.sessions}</TableCell>
                  <TableCell>{c.travel_hours}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No coach records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default CoachSessionList;
