"use client";

import { usePathname } from "next/navigation";
import Header from "./components/header";
import Footer from "./components/footer";
import ScrollToTop from "./components/scrollToTop";

export default function HideUserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReseller = pathname.startsWith("/reseller");
  const isDashboard = pathname.startsWith("/reseller/dashboard");

  return (
    <>
      {!isReseller && !isDashboard && <Header />}
      <ScrollToTop />
      {children}
      {!isReseller && !isDashboard && <Footer />}
    </>
  );
}
