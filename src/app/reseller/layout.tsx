"use client"
import React, { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import ResellerHeader from "./common/reseller_header";
import ResellerFooter from "./common/reseller_footer";
import { AuthProvider } from "@/app/reseller/AuthContext";
// import DashboardLayout from "./Dashboard_Layout";

interface ResellerLayoutProps {
  children: ReactNode;
}

const ResellerLayout: React.FC<ResellerLayoutProps> = ({ children }) => {
  // const router = useRouter();
  const pathname = usePathname();

  // Check if current path matches any of the special routes
  const isDashboardArea =
    pathname.startsWith("/reseller/dashboard/reseller_dashboard") ||
    pathname.startsWith("/reseller/dashboard/add_promocode") ||
    pathname.startsWith("/reseller/dashboard/manage_promocode") ||
    pathname.startsWith("/reseller/dashboard/manage_deal") ||
    pathname.startsWith("/reseller/dashboard/reseller_add_deal") ||
    pathname.startsWith("/reseller/dashboard/reseller_profile")

  return (
    <AuthProvider>
      <div>
        {/* Show reseller header/footer ONLY on login/register pages, NOT on dashboard area */}
        {!isDashboardArea && <ResellerHeader />}

        <main style={{ flex: 1 }}>{children}</main>

        {!isDashboardArea && <ResellerFooter />}
      </div>
    </AuthProvider>
  );
};

export default ResellerLayout;