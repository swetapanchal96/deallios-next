// app/reseller/dashboard/page.tsx  (or wherever you want this route)

"use client";

import React, { useState, useContext } from "react";
import { Layout } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/reseller/AuthContext"; // adjust path
import TopMenu from "@/app/reseller/common/ResellerDashboardTopbar";
import ContentSection from "@/app/reseller/common/RessellerContentSection";
import FooterSection from "@/app/reseller/common/RessellerDashboardFooter";
import { apiUrl } from "@/config";
import "@/app/reseller/dashboard/Sidebar.css";
import "react-toastify/dist/ReactToastify.css";

const { Header, Sider } = Layout;



const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);
//     const auth = useContext(AuthContext);
//    if (!auth) {
//   throw new Error("AuthContext must be used within AuthProvider");
// }

// const { logout } = auth;

  const { logout }:any = useContext(AuthContext);

   

  const router = useRouter();

  const handleLogout = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const vendor_id = typeof window !== "undefined" ? localStorage.getItem("vendor_id") : null;
    const savedDealsId = typeof window !== "undefined" ? localStorage.getItem("deal_id") : null;

    console.log(savedDealsId, "SAVE DEAL ID");
    console.log("Logout Auth", token);

    try {
      const response = await axios.post(
        `${apiUrl}/logout`,
        { vendorid: vendor_id },
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      console.log("DATA", response.data);

      if (response.data.success) {
        logout();

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("vendor_id");
          localStorage.removeItem("deal_id");
        }

        toast.success(response.data.message || "Successfully logged out.");

        setTimeout(() => {
          router.push("/reseller/reseller_login");
        }, 200);
      } else {
        toast.error(response.data.message || "Logout failed.");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "An error occurred during logout"
      );
    }
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        {/* If you later add a Sider component, you can use collapsed here */}
        <Layout>
          <TopMenu
            collapsed={collapsed}
            toggleSidebar={toggleSidebar}
            handleLogout={handleLogout}
          />
          <ContentSection />
          <FooterSection />
        </Layout>
      </Layout>
      {/* Global toast container (you can alternatively move this to a layout/provider) */}
      <ToastContainer />
    </>
  );
};

export default Dashboard;