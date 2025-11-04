import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Alert,
} from "@mui/material";

function HomeVisitForm() {
  const [form, setForm] = useState({
    coach: "",
    child: "",
    visit_date: "",
    visit_time: "",
    purpose: "",
    observations: "",
  });

  const [visits, setVisits] = useState([
    {
      coach: "ENG101",
      child: "STU001",
      visit_date: "2025-11-01",
      visit_time: "10:00",
      purpose: "English Grammar Support",
      observations: "Explained tenses with exercises.",
    },
    {
      coach: "MATH202",
      child: "STU002",
      visit_date: "2025-11-02",
      visit_time: "11:30",
      purpose: "Math Revision",
      observations: "Helped with fractions and word problems.",
    },
    {
      coach: "SCI303",
      child: "STU003",
      visit_date: "2025-11-03",
      visit_time: "09:45",
      purpose: "Science Practical Demo",
      observations: "Conducted simple circuit experiments.",
    },
  ]);

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.coach || !form.child || !form.visit_date || !form.visit_time || !form.purpose) {
      setMessage("❌ Please fill all required fields.");
      return;
    }

    const newVisit = { ...form };
    setVisits([...visits, newVisit]);
    setForm({
      coach: "",
      child: "",
      visit_date: "",
      visit_time: "",
      purpose: "",
      observations: "",
    });
    setMessage(`✅ Home visit for ${newVisit.child} added successfully!`);

    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "#1e3a8a" }}
      >
        Home Visit Tracking
      </Typography>

      {message && (
        <Alert
          severity={message.startsWith("✅") ? "success" : "error"}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              label="Coach ID *"
              name="coach"
              value={form.coach}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              label="Child ID *"
              name="child"
              value={form.child}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              type="date"
              label="Visit Date *"
              name="visit_date"
              value={form.visit_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              type="time"
              label="Visit Time *"
              name="visit_time"
              value={form.visit_time}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              label="Purpose *"
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Observations"
              name="observations"
              value={form.observations}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1d4ed8",
                ":hover": { backgroundColor: "#1e40af" },
              }}
            >
              Save Visit
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Responsive Table */}
      <Paper sx={{ mt: 4, overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#e0e7ff" }}>
            <TableRow>
              <TableCell>Coach ID</TableCell>
              <TableCell>Child ID</TableCell>
              <TableCell>Visit Date</TableCell>
              <TableCell>Visit Time</TableCell>
              <TableCell>Purpose</TableCell>
              <TableCell>Observations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.length > 0 ? (
              visits.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>{v.coach}</TableCell>
                  <TableCell>{v.child}</TableCell>
                  <TableCell>{v.visit_date}</TableCell>
                  <TableCell>{v.visit_time}</TableCell>
                  <TableCell>{v.purpose}</TableCell>
                  <TableCell>{v.observations}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No visit records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Paper>
  );
}

export default HomeVisitForm;
