import React, { useEffect, useState } from "react";
import axios from "axios";
import { Paper, Typography, Divider } from "@mui/material";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/notifications/")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Error fetching notifications:", err));
  }, []);

  return (
    <Paper
      sx={{
        position: "absolute",
        right: 20,
        top: 60,
        width: 300,
        backgroundColor: "#fff",
        boxShadow: 3,
        borderRadius: 2,
        zIndex: 100,
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600, mb: 1 }}>
        Notifications
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {notifications.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No new notifications
        </Typography>
      ) : (
        notifications.map((note, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "500" }}>
              {note.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {note.message}
            </Typography>
            <Divider sx={{ mt: 1 }} />
          </div>
        ))
      )}
    </Paper>
  );
}

export default Notifications;
