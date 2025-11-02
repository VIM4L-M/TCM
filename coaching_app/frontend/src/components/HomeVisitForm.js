import React, { useState } from "react";
import { TextField, Button, Grid, Paper } from "@mui/material";

function HomeVisitForm() {
  const [form, setForm] = useState({ coach: "", child: "", date: "", notes: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Visit recorded for ${form.child}`);
    setForm({ coach: "", child: "", date: "", notes: "" });
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Coach Name" name="coach" value={form.coach} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth label="Child Name" name="child" value={form.child} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField fullWidth type="date" label="Date" name="date" value={form.date} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button type="submit" variant="contained" sx={{ height: "100%", backgroundColor: "#1d4ed8" }}>
              Save Visit
            </Button>
          </Grid>
        </Grid>
        <TextField
          label="Notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mt: 2 }}
        />
      </form>
    </Paper>
  );
}

export default HomeVisitForm;
