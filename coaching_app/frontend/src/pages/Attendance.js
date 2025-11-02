import React, { useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import { Button } from "@mui/material";

function Attendance() {
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().substring(0, 10));

  return (
    <div>
      <h2>Session Attendance</h2>
      <label>Date: </label>
      <input
        type="date"
        value={sessionDate}
        onChange={(e) => setSessionDate(e.target.value)}
        style={{ margin: "10px", padding: "6px" }}
      />
      <Button variant="contained" sx={{ backgroundColor: "#16a34a" }}>Mark Attendance</Button>
      <AttendanceTable />
    </div>
  );
}

export default Attendance;
