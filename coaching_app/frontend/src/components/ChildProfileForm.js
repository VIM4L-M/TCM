import React, { useState } from "react";
import { TextField, Button, Grid, Paper } from "@mui/material";

function ChildProfileForm({ setChildren }) {
  const [form, setForm] = useState({ name: "", age: "", community: "", gender: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setChildren((prev) => [...prev, { id: Date.now(), ...form }]);
    setForm({ name: "", age: "", community: "", gender: "" });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth label="Age" name="age" value={form.age} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Community" name="community" value={form.community} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField fullWidth label="Gender" name="gender" value={form.gender} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button type="submit" variant="contained" sx={{ height: "100%", backgroundColor: "#1d4ed8" }}>
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default ChildProfileForm;
