'use client';

import React from "react";
import { Layout, Typography, Space } from "antd";
import Link from "next/link";

const { Footer } = Layout;
const { Text } = Typography;

const FooterSection: React.FC = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
        background: "#2a2247",
        color: "#fff",
        padding: "16px",
      }}
    >
      <Space style={{
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      }}>
        <Text style={{ color: "#aaa" }}>
          © {new Date().getFullYear()} Deallios Dashboard
        </Text>

        <Space>
          <Link href="/privacy-policy" style={{ color: "#aaa" }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: "#aaa" }}>
            Terms of Service
          </Link>
          <Link href="/contact" style={{ color: "#aaa" }}>
            Contact Us
          </Link>
        </Space>
      </Space>
    </Footer>
  );
};

export default FooterSection;
