"use client";

import React, { useState, useEffect, useContext, ChangeEvent } from "react";
import { Box, Tabs, Tab, Avatar, Typography, Snackbar } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserProfileContext } from "../components/UserProfileContext";
import ProfileDetailsTab from "../components/ProfileDetailsTab";
import SettingsTab from "../components/UserPassword";
import MyCouponsTab from "../mycoupons/page";

const ProfileContainer = styled(Box)(({ theme }) => ({
    maxWidth: "100%",
    margin: "auto",
    padding: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
    position: "relative",
    background: `url(https://wallpapercave.com/wp/wp9024400.jpg)`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "280px",
    borderRadius: "16px",
    marginBottom: theme.spacing(4),
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "150px",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: "4px solid white",
    marginBottom: theme.spacing(1),
    cursor: "pointer",
}));

const HeaderText = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "1.5rem",
    color: "white",
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "16px",
}));

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<number>(0);
    const { avatar, setAvatar, name, setName, email, setEmail } =
        useContext(UserProfileContext);

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const customerGUID =
        typeof window !== "undefined"
            ? localStorage.getItem("Customer_GUID")
            : null;

    useEffect(() => {
        if (customerGUID) {
            const requestPayload = { Customer_GUID: customerGUID };

            axios
                .post("https://getdemo.in/pricecut/api/customer/profile", requestPayload)
                .then((response) => {
                    const { Customer_img, Customer_email, Customer_name } =
                        response.data.data;

                    setAvatar(Customer_img);
                    setName(Customer_name);
                    setEmail(Customer_email);
                })
                .catch((err) => console.error("Error fetching profile", err));
        }
    }, [customerGUID]);

    useEffect(() => {
        if (!customerGUID) {
            router.push("/login");
        }
    }, [customerGUID, router]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const storedToken = localStorage.getItem("token");
        const formData = new FormData();
        const customerGUID = localStorage.getItem("Customer_GUID");

        if (!event.target.files?.[0]) return;

        formData.append("Customer_GUID", customerGUID || "");
        formData.append("Customer_img", event.target.files[0]);

        // Show selected image immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result as string);
        };
        reader.readAsDataURL(event.target.files[0]);

        axios
            .post("https://getdemo.in/pricecut/api/customer/profile/update", formData, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            })
            .then(() => setSnackbarOpen(true))
            .catch((err) => console.error("Error updating profile image", err));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <ProfileContainer>
            <Header>
                <AvatarWrapper>
                    <ProfileAvatar
                        src={
                            avatar ||
                            "https://i0.wp.com/www.cssscript.com/wp-content/uploads/2020/12/Customizable-SVG-Avatar-Generator-In-JavaScript-Avataaars.js.png?fit=438%2C408&ssl=1"
                        }
                        alt="Profile"
                        onClick={() =>
                            document.getElementById("file-input")?.click()
                        }
                    />

                    <HeaderText>{name}</HeaderText>

                    <input
                        type="file"
                        id="file-input"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </AvatarWrapper>
            </Header>

            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                indicatorColor="primary"
                textColor="inherit"
                style={{ backgroundColor: "#1a1a40", color: "white" }}
            >
                <StyledTab label="Profile Details" />
                <StyledTab label="My Coupons" />
                <StyledTab label="Settings" />
            </Tabs>

            <Box mt={4}>
                {activeTab === 0 && <ProfileDetailsTab />}
                {activeTab === 1 && <MyCouponsTab />}
                {activeTab === 2 && <SettingsTab />}
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                message="Profile image updated successfully!"
                onClose={handleSnackbarClose}
            />
        </ProfileContainer>
    );
}
