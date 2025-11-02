import React, { useState } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Checkbox, Paper } from "@mui/material";

function AttendanceTable() {
  const [records, setRecords] = useState([
    { id: 1, name: "Arun Kumar", attended: true },
    { id: 2, name: "Sneha R", attended: false },
  ]);

  const toggleAttendance = (id) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, attended: !rec.attended } : rec))
    );
  };

  return (
    <Paper sx={{ mt: 3 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#e2e8f0" }}>
          <TableRow>
            <TableCell>Child ID</TableCell>
            <TableCell>Child Name</TableCell>
            <TableCell>Present</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((child) => (
            <TableRow key={child.id}>
              <TableCell>{child.id}</TableCell>
              <TableCell>{child.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={child.attended}
                  onChange={() => toggleAttendance(child.id)}
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
