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
  TableContainer,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";

function CoachSessionList() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)");

  // Simulated API call with data (replace with Django API later)
  useEffect(() => {
    // Replace this with your actual API call if backend is ready
    const fetchData = async () => {
      try {
        // Uncomment below when backend is ready:
        // const res = await axios.get("http://localhost:8000/api/coaches/");
        // setCoaches(res.data);

        // --- Temporary Demo Data ---
        const data = [
          {
            id: "C101",
            name: "Arun Kumar",
            email: "arun.maths@tcm.org",
            phone: "9876543210",
            sessions: "Mathematics - Algebra & Geometry",
            travel_hours: "3 hrs/week",
          },
          {
            id: "C102",
            name: "Sneha R",
            email: "sneha.english@tcm.org",
            phone: "9998877665",
            sessions: "English - Grammar & Composition",
            travel_hours: "2 hrs/week",
          },
          {
            id: "C103",
            name: "Rahul Prakash",
            email: "rahul.science@tcm.org",
            phone: "9786543120",
            sessions: "Science - Physics & Chemistry",
            travel_hours: "4 hrs/week",
          },
        ];
        setTimeout(() => {
          setCoaches(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error fetching coach data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Paper
      sx={{
        mt: 3,
        p: isMobile ? 1 : 2,
        boxShadow: 3,
        borderRadius: 3,
        backgroundColor: "#f8fafc",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#1e3a8a",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        Coach Session Tracker
      </Typography>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <CircularProgress color="primary" />
        </div>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead sx={{ backgroundColor: "#e0e7ff" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Coach ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Sessions</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Travel Hours</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {coaches.length > 0 ? (
                coaches.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f1f5f9" },
                    }}
                  >
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell>{c.sessions}</TableCell>
                        <TableCell>{c.travel_hours}</TableCell>
                      </>
                    )}
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
        </TableContainer>
      )}
    </Paper>
  );
}

export default CoachSessionList;
