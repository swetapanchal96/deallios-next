import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

import NextLink from "next/link";
import  Grid  from "@mui/material/Grid";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#2a2247",
        color: "#fff",
        py: 4,
        px: 2,
      }}
    >
      <Grid container spacing={2}>
        {/* Column 1: Navigation */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Links
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            className="footer-li"
          >
            {navItems.map(({ label, href }) => (
              <NextLink key={label} href={href} passHref legacyBehavior>
                <a style={{ color: "inherit", textDecoration: "underline" }}>
                  {label}
                </a>
              </NextLink>
            ))}
          </Box>
        </Grid>

        {/* Column 2: Social Media */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Follow Us
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              aria-label="facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#fff" }}
            >
              <FacebookIcon  />
            </IconButton>
            <IconButton
              aria-label="twitter"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#fff" }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              aria-label="instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#fff" }}
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Column 3: Contact */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="body2">Email: info@deallios.in</Typography>
          <Typography variant="body2">Phone: +1 234 567 890</Typography>
        </Grid>
      </Grid>

      <Box
        sx={{
          textAlign: "center",
          borderTop: "1px solid #444",
          mt: 4,
          pt: 2,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} My Website. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
