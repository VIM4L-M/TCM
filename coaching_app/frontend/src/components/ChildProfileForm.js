import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";

function ChildProfileForm() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    community: "",
    gender: "",
  });
  const [children, setChildren] = useState([]);

  // Fetch existing child profiles from backend on load
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/children/")
      .then((res) => setChildren(res.data))
      .catch((err) => console.error("Error fetching children:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/children/", form);
      setChildren((prev) => [...prev, res.data]);
      setForm({ name: "", age: "", community: "", gender: "" });
    } catch (err) {
      console.error("Error creating child profile:", err);
      alert("Failed to save child profile. Please check the backend.");
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Add Child Profile
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Community"
              name="community"
              value={form.community}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                height: "100%",
                backgroundColor: "#1d4ed8",
                "&:hover": { backgroundColor: "#1e40af" },
              }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Display table of child profiles */}
      <Paper sx={{ mt: 4, p: 2, backgroundColor: "#f8fafc" }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
          Child Profiles
        </Typography>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#e2e8f0" }}>
            <tr>
              <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Age</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Community</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Gender</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {children.map((child) => (
              <tr key={child.id}>
                <td style={{ padding: "8px" }}>{child.name}</td>
                <td style={{ padding: "8px" }}>{child.age}</td>
                <td style={{ padding: "8px" }}>{child.community}</td>
                <td style={{ padding: "8px" }}>{child.gender}</td>
                <td style={{ padding: "8px" }}>{child.date_joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Paper>
  );
}

export default ChildProfileForm;
