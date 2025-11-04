import React, { useState, useEffect } from "react";
import { Paper, Typography, Divider, Chip, Box } from "@mui/material";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Local frontend notifications
    const sampleNotifications = [
      {
        title: "Recent Login",
        message: "You have logged in as Programme Manager.",
        type: "info",
      },
      {
        title: "New Child Added",
        message: "A new child profile has been added to Community A.",
        type: "success",
      },
      {
        title: "Attendance Report",
        message: "Weekly attendance analytics have been updated successfully.",
        type: "update",
      },
      {
        title: "Assessment Pending",
        message: "Reminder: Two assessments are pending review.",
        type: "warning",
      },
      {
        title: "System Update",
        message: "Dashboard interface improved with latest analytics.",
        type: "secondary",
      },
    ];

    setNotifications(sampleNotifications);
  }, []);

  const badgeColor = {
    info: "primary",
    success: "success",
    update: "secondary",
    warning: "warning",
    secondary: "info",
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        right: 20,
        top: 60,
        width: 320,
        backgroundColor: "#fff",
        boxShadow: 3,
        borderRadius: 2,
        zIndex: 100,
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontSize: "16px", fontWeight: 600, mb: 1 }}
      >
        Notifications
      </Typography>

      <Divider sx={{ mb: 1 }} />

      {notifications.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No new notifications
        </Typography>
      ) : (
        notifications.map((note, idx) => (
          <Box key={idx} sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {note.title}
              </Typography>
              <Chip
                label={
                  note.type.charAt(0).toUpperCase() + note.type.slice(1)
                }
                color={badgeColor[note.type] || "default"}
                size="small"
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {note.message}
            </Typography>

            <Divider sx={{ mt: 1 }} />
          </Box>
        ))
      )}
    </Paper>
  );
}

export default Notifications;
