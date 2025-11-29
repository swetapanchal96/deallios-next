'use client';

import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import {
  DashboardOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const pathname = usePathname(); // Next.js 13+ App Router hook
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set selected menu item based on current pathname
    switch (pathname) {
      case "/dashboard":
        setSelectedKey("1");
        break;
      case "/today_order":
        setSelectedKey("2");
        break;
      case "/strategies_listing":
        setSelectedKey("3");
        break;
      case "/user_profile":
        setSelectedKey("4");
        break;
      case "/SmartApiWebSocket":
        setSelectedKey("5");
        break;
      default:
        setSelectedKey(null);
        break;
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return (
    <>
      {/* Hamburger icon for mobile */}
      {isMobile && (
        <Button
          className="menu-button bg-main"
          type="text"
          icon={<MenuOutlined style={{ color: "#fff !important" }} />}
          onClick={showDrawer}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1000,
            color: "#fff",
            fontSize: "20px",
          }}
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={toggleSidebar}
          style={{ background: "#2a2247" }}
          trigger={null}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div
            style={{
              height: "64px",
              textAlign: "center",
              lineHeight: "64px",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            <img width={150} className="mb-5" src="/images/logo-white.png" alt="Logo" />
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={selectedKey ? [selectedKey] : []}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link href="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />}>
              <Link href="/today_order">Today's Order</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BarChartOutlined />}>
              <Link href="/strategies_listing">Strategies Listing</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              <Link href="/user_profile">User Profile</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<SettingOutlined />}>
              <Link href="/SmartApiWebSocket">SmartApiWebSocket</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      )}

      {/* Mobile Full-Screen Drawer */}
      {isMobile && (
        <Drawer
          title="STOCKIZEN"
          placement="left"
          closable
          onClose={hideDrawer}
          open={visible} // Changed from 'visible' to 'open' (Antd v5)
          bodyStyle={{ padding: 0, backgroundColor: "#001628" }}
          headerStyle={{ background: "#fff", color: "#000" }}
          width="100%"
          height="100vh"
          styles={{ body: { padding: 0 } }} // Additional styles prop for Antd v5
        >
          <Menu theme="dark" mode="inline" selectedKeys={selectedKey ? [selectedKey] : []}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link href="/dashboard" onClick={hideDrawer}>
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<SettingOutlined />}>
              <Link href="/today_order" onClick={hideDrawer}>
                Today's Order
              </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BarChartOutlined />}>
              <Link href="/strategies_listing" onClick={hideDrawer}>
                Strategies Listing
              </Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<SettingOutlined />}>
              <Link href="/user_profile" onClick={hideDrawer}>
                User Profile
              </Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<SettingOutlined />}>
              <Link href="/SmartApiWebSocket" onClick={hideDrawer}>
                SmartApiWebSocket
              </Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
