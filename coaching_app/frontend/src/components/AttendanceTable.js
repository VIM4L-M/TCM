import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Paper,
} from "@mui/material";

function AttendanceTable({ records, toggleAttendance }) {
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
              <TableCell>{rec.session}</TableCell>
              <TableCell>{rec.child}</TableCell>
              <TableCell>
                <Checkbox
                  checked={rec.is_present}
                  onChange={() => toggleAttendance(rec.id)}
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
