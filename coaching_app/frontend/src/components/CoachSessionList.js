import React from "react";
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

function CoachSessionList() {
  const coaches = [
    { id: 1, name: "Ravi", sessions: 12, travelHours: 5 },
    { id: 2, name: "Anjali", sessions: 15, travelHours: 8 },
  ];

  return (
    <Paper sx={{ mt: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#e0e7ff" }}>
          <TableRow>
            <TableCell>Coach ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Sessions</TableCell>
            <TableCell>Travel Hours</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coaches.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.sessions}</TableCell>
              <TableCell>{c.travelHours}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CoachSessionList;
