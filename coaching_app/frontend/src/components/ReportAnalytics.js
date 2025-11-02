import React from "react";
import { Paper } from "@mui/material";

function ReportAnalytics() {
  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <h4>Sample Analytics</h4>
      <ul>
        <li>👧 Gender Ratio: 52% Female / 48% Male</li>
        <li>🏫 Communities Active: 12</li>
        <li>🕓 Average Sessions per Coach: 14</li>
        <li>📈 Retention Rate: 89%</li>
      </ul>
    </Paper>
  );
}

export default ReportAnalytics;
