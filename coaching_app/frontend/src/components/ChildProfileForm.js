import React, { useState } from "react";
import { TextField, Button, Grid, Paper, Typography } from "@mui/material";

function ChildProfileForm({ onAddChild }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    community: "",
    gender: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.community || !form.gender) {
      alert("Please fill all fields");
      return;
    }

    // Send new child data to parent
    onAddChild(form);

    // Reset form
    setForm({ name: "", age: "", community: "", gender: "" });
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
    </Paper>
  );
}

export default ChildProfileForm;
