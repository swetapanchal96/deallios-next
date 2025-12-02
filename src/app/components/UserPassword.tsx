"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/system";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/config";

// Styled Save Button
const SaveButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  background: "linear-gradient(90deg, #282445, #673AB7)",
  color: "white",
  fontWeight: "bold",
  borderRadius: "12px",
  padding: theme.spacing(1.5),
  "&:hover": {
    background: "linear-gradient(90deg, #282445, #673AB7)",
  },
}));

const SettingsTab: React.FC = () => {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);

  const customerGUID =
    typeof window !== "undefined"
      ? localStorage.getItem("Customer_GUID")
      : null;

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Simulate initial loading (from your code)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ---------------- HANDLE PASSWORD CHANGE ----------------
  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/customer/change/password`,
        {
          Customer_GUID: customerGUID,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        router.push("/login"); // Next.js redirect
      }
    } catch (error) {
      setErrorMessage(
        "There was an error updating the password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------ UI RENDER ------------------
  return (
    <div>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Settings
      </Typography>

      {loading ? (
        <>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            sx={{ borderRadius: "8px" }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            sx={{ marginTop: 2, borderRadius: "8px" }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            sx={{ marginTop: 2, borderRadius: "8px" }}
          />
          <Skeleton
            variant="rectangular"
            width="200px"
            height={56}
            sx={{ marginTop: 2, borderRadius: "8px" }}
          />
        </>
      ) : (
        <>
          {/* OLD PASSWORD */}
          <TextField
            fullWidth
            label="Old Password"
            type={showOldPassword ? "text" : "password"}
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* NEW PASSWORD */}
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* CONFIRM PASSWORD */}
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <SaveButton variant="contained" onClick={handlePasswordChange}>
            Update Password
          </SaveButton>
        </>
      )}

      {/* SUCCESS SNACKBAR */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        message={successMessage}
        onClose={() => setSuccessMessage("")}
      />

      {/* ERROR SNACKBAR */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        message={errorMessage}
        onClose={() => setErrorMessage("")}
      />
    </div>
  );
};

export default SettingsTab;
