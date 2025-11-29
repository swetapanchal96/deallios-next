"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  Button,
  Skeleton
} from "@mui/material";
import { styled } from "@mui/system";

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

// TypeScript → Profile Data Interface
interface ProfileDataType {
  Customer_name: string;
  customer_email: string;
  Customer_phone: string;
  Customer_address: string;
}

const ProfileDetailsTab: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileDataType>({
    Customer_name: "",
    customer_email: "",
    Customer_phone: "",
    Customer_address: "",
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Fetch profile data on component load
  useEffect(() => {
    const fetchProfileData = async () => {
      const customerGUID =
        typeof window !== "undefined"
          ? localStorage.getItem("Customer_GUID")
          : null;

      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!customerGUID) return;
      if (!storedToken) return;

      try {
        const response = await axios.post(
          "https://getdemo.in/pricecut/api/customer/profile",
          { Customer_GUID: customerGUID },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (response.data.success) {
          const {
            Customer_name,
            Customer_email,
            Customer_phone,
            Customer_address,
          } = response.data.data;

          setProfileData({
            Customer_name: Customer_name || "",
            customer_email: Customer_email || "",
            Customer_phone: Customer_phone || "",
            Customer_address: Customer_address || "",
          });

          console.log("Profile Data Fetched:", response.data.data);
        } else {
          alert("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        alert("An error occurred while fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle Input Change
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save Button Click
  const handleSaveChanges = async () => {
    const customerGUID = localStorage.getItem("Customer_GUID");
    const storedToken = localStorage.getItem("token");

    if (!customerGUID) {
      alert("Customer GUID not found in localStorage.");
      return;
    }

    if (!storedToken) {
      alert("Authorization token not found in localStorage.");
      return;
    }

    const payload = { ...profileData, Customer_GUID: customerGUID };

    try {
      const response = await axios.post(
        "https://getdemo.in/pricecut/api/customer/profile/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully!");
        console.log("Updated Data:", response.data.data);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);

      if (error.response) {
        if (error.response.data.message === "Customer is not authorized.") {
          alert(
            "Authorization failed. Please check your token or login again."
          );
        } else {
          alert(`API Error: ${error.response.data.message}`);
        }
      } else {
        alert(
          "An error occurred while updating the profile. Please try again."
        );
      }
    }
  };

  // Loader Skeleton
  if (loading) {
    return (
      <div>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Profile Details
        </Typography>
        <Skeleton variant="text" width="100%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={60} />
      </div>
    );
  }

  // Render Form
  return (
    <div>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Profile Details
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        name="Customer_name"
        value={profileData.Customer_name}
        onChange={handleInputChange}
        margin="normal"
        variant="outlined"
        sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      />

      <TextField
        fullWidth
        label="Email Address"
        name="customer_email"
        value={profileData.customer_email}
        onChange={handleInputChange}
        margin="normal"
        variant="outlined"
        sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      />

      <TextField
        fullWidth
        label="Phone Number"
        name="Customer_phone"
        value={profileData.Customer_phone}
        onChange={handleInputChange}
        margin="normal"
        variant="outlined"
        sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      />

      <TextField
        fullWidth
        label="Address"
        name="Customer_address"
        value={profileData.Customer_address}
        onChange={handleInputChange}
        margin="normal"
        variant="outlined"
        sx={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
      />

      <SaveButton variant="contained" onClick={handleSaveChanges}>
        Save Changes
      </SaveButton>
    </div>
  );
};

export default ProfileDetailsTab;
