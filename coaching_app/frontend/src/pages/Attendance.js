import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import AttendanceTable from "../components/AttendanceTable";

function Attendance() {
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  // Example initial attendance data
  const [records, setRecords] = useState([
    { id: 1, session: "Math Class", child: "Arun Kumar", is_present: false },
    { id: 2, session: "Science Class", child: "Sneha R", is_present: true },
    { id: 3, session: "English Class", child: "Rahul P", is_present: false },
  ]);

  const [messageOpen, setMessageOpen] = useState(false);

  // Handle toggle checkbox
  const toggleAttendance = (id) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, is_present: !rec.is_present } : rec
      )
    );
  };

  // Handle button click
  const handleMarkAttendance = () => {
    console.log("Marked Attendance:", records);
    setMessageOpen(true);
  };

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
      <Button
        variant="contained"
        onClick={handleMarkAttendance}
        sx={{
          backgroundColor: "#16a34a",
          width: "fit-content",
          height: "100%",
          px: 4,
          mb: 2,
          "&:hover": { backgroundColor: "#15803d" },
        }}
      >
        MARK ATTENDANCE
      </Button>

      {/* Table */}
      <AttendanceTable records={records} toggleAttendance={toggleAttendance} />

      {/* Snackbar message */}
      <Snackbar
        open={messageOpen}
        autoHideDuration={3000}
        onClose={() => setMessageOpen(false)}
      >
        <Alert
          onClose={() => setMessageOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Attendance marked successfully for {sessionDate}!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Attendance;
