import React, { useState } from "react";
import { TextField, Button, Grid, Paper } from "@mui/material";
import api from "../services/api";

function HomeVisitForm() {
  const [form, setForm] = useState({
    child: "",
    coach: "",
    visit_date: "",
    visit_time: "",
    purpose: "",
    observations: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("home-visits/", form);
      alert(`Home visit for child ${form.child} saved.`);
      setForm({ child: "", coach: "", visit_date: "", visit_time: "", purpose: "", observations: "" });
    } catch (err) {
      console.error("Error saving home visit:", err);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField label="Coach ID" name="coach" value={form.coach} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Child ID" name="child" value={form.child} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField type="date" label="Visit Date" name="visit_date" value={form.visit_date} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField type="time" label="Visit Time" name="visit_time" value={form.visit_time} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Purpose" name="purpose" value={form.purpose} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Observations" name="observations" value={form.observations} onChange={handleChange} fullWidth multiline rows={3} />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#1d4ed8" }}>
              Save Visit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default HomeVisitForm;
