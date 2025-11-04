import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ChildProfileForm from "../components/ChildProfileForm";

function ChildProfiles() {
  const [showForm, setShowForm] = useState(false);
  const [children, setChildren] = useState([
    { id: 1, name: "Arun Kumar", age: 12, community: "Urban Hope", gender: "M" },
    { id: 2, name: "Sneha R", age: 13, community: "CIT Nagar", gender: "F" },
  ]);

  // Add new child dynamically
  const handleAddChild = (newChild) => {
    const newEntry = {
      id: children.length + 1,
      ...newChild,
    };
    setChildren([...children, newEntry]);
  };

  return (
    <div>
      <h2>Child Profiles</h2>
      <Button
        variant="contained"
        sx={{ mt: 2, mb: 2, backgroundColor: "#1e40af", width: "150px"}}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Add Child"}
      </Button>

      {showForm && <ChildProfileForm onAddChild={handleAddChild} />}

      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e0e7ff" }}>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Community</TableCell>
              <TableCell>Gender</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((child) => (
              <TableRow key={child.id}>
                <TableCell>{child.id}</TableCell>
                <TableCell>{child.name}</TableCell>
                <TableCell>{child.age}</TableCell>
                <TableCell>{child.community}</TableCell>
                <TableCell>{child.gender}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default ChildProfiles;
