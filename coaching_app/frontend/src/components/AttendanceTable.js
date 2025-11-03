import React, { useState, useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from "@mui/material";
import api from "../services/api";

function AttendanceTable() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("attendance/");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const toggleAttendance = async (id, currentStatus) => {
    try {
      const updated = records.map((r) =>
        r.id === id ? { ...r, is_present: !currentStatus } : r
      );
      setRecords(updated);
      await api.patch(`attendance/${id}/`, { is_present: !currentStatus });
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
  };

  return (
    <Paper sx={{ mt: 3 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#e2e8f0" }}>
          <TableRow>
            <TableCell>Session</TableCell>
            <TableCell>Child</TableCell>
            <TableCell>Present</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell>{rec.session_title || rec.session}</TableCell>
              <TableCell>{rec.child_name || rec.child}</TableCell>
              <TableCell>
                <Checkbox
                  checked={rec.is_present}
                  onChange={() => toggleAttendance(rec.id, rec.is_present)}
                  color="success"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default AttendanceTable;
