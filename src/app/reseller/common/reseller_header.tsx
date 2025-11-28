"use client"
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";

const navItems = [
  { label: "Home", link: "/reseller" },
  { label: "About", link: "#" },
  { label: "Contact", link: "#" },
  { label: "Login", link: "/reseller_login" },
  { label: "Register", link: "/reseller" },
];

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        DEALLIOS RESELLER
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link href={item.link} passHref legacyBehavior>
                <a style={{ width: "100%", display: "block", color: "inherit", textDecoration: "none" }}>
                  <ListItemText primary={item.label} />
                </a>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <section>
      <div className="container">
        <div className="row">
          <Box sx={{ display: "flex" }}>
            <AppBar component="nav" className="reseller-nav">
              <Toolbar>
                {/* Mobile Menu Icon */}
                <IconButton
                  color="inherit"
                  edge="start"
                  className="reseller-links"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>

                {/* Brand Name */}
                <Typography
                  variant="h6"
                  component="div"
                  className="text-black"
                  sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                >
                  DEALLIOS RESELLER
                </Typography>

                {/* Desktop Navigation */}
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  {navItems.map((item) => (
                    <Link key={item.label} href={item.link} passHref legacyBehavior>
                      <Button sx={{ color: "#fff" }} component="a">
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </Box>
              </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Box component="nav">
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: "block", sm: "none" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: 240,
                  },
                }}
              >
                {drawer}
              </Drawer>
            </Box>

            {/* Toolbar Spacer */}
            <Toolbar />
          </Box>
        </div>
      </div>
    </section>
  );
};

export default Header;
