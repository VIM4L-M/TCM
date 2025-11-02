import React from "react";
import { Paper } from "@mui/material";

function Assessments() {
  return (
    <div>
      <h2>LSAS Assessments</h2>
      <Paper sx={{ p: 3, mt: 2 }}>
        <p>Assessment data will be fetched here from backend (baseline, endline, follow-up).</p>
        <p>Each child’s performance graph will be shown here using charts (to be added later).</p>
      </Paper>
    </div>
  );
}

export default Assessments;
