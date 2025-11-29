"use client"
import React, { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import ResellerHeader from "./common/reseller_header";
import ResellerFooter from "./common/reseller_footer";
import { AuthProvider } from "./AuthContext";
// import DashboardLayout from "./Dashboard_Layout";

interface ResellerLayoutProps {
  children: ReactNode;
}

const ResellerLayout: React.FC<ResellerLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path matches any of the special routes
  const isSpecialPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/reseller_dashboard") ||
    pathname.startsWith("/reseller_add_deal") ||
    pathname.startsWith("/manage_deal") ||
    pathname.startsWith("/reseller_profile") ||
    pathname.startsWith("/add_promocode") ||
    pathname.startsWith("/manage_promocode");

  return (
      <AuthProvider>
    <div>
      {!isSpecialPage && <ResellerHeader />}

      <div style={{ display: "flex" }}>
        {/* Render Sidebar only on special pages */}
        {/* {isSpecialPage && <DashboardLayout />} */}

        {/* Main Content - render children */}
        {!isSpecialPage && (
          <main style={{ flex: 1 }}>
            {children}
          </main>
        )}
      </div>

      {!isSpecialPage && <ResellerFooter />}
    </div>
    </AuthProvider>
  );
};

export default ResellerLayout;
