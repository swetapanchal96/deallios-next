"use client";

import React from "react";
import { Layout } from "antd";
import { usePathname } from "next/navigation";

const { Content } = Layout;

// Import your components (converted pages)
import Dashboard from "../dashboard/reseller_dashboard/page";
import path from "path";
import ResellerAddDeal from "../dashboard/reseller_add_deal/page";
import ResellerProfile from "../dashboard/reseller_profile/page";
import ManageDeal from "../dashboard/manage_deal/page";
import AddPromoCode from "../dashboard/add_promocode/page";
import ManagePromoCode from "../dashboard/manage_promocode/page";




const ContentSection: React.FC = () => {
  const pathname = usePathname();
const isDashboardArea =
    pathname.startsWith("/reseller/dashboard/reseller_dashboard") 
  const renderComponent = () => {
    switch (pathname) {
        
      case "/reseller/dashboard/reseller_dashboard":
        return <Dashboard />;
      case "/reseller/dashboard/reseller_add_deal":
        return <ResellerAddDeal />;
      case "/reseller/dashboard/reseller_profile":
        return <ResellerProfile />;
      case "/reseller/dashboard/manage_deal":
        return <ManageDeal />;
      case "/reseller/dashboard/add_promocode":
        return <AddPromoCode />;
      case "/reseller/dashboard/manage_promocode":
        return <ManagePromoCode />;
      default:
        return <Dashboard />; // default fallback
    }
  };

  return (
    <Content
      className="sm-pad-set"
      style={{
        margin: "24px 16px",
        padding: "0px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {renderComponent()}
    </Content>
  );
};

export default ContentSection;
