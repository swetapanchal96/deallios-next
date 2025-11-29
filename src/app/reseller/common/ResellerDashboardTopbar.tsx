// components/TopMenu.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Menu, MenuProps, Dropdown, Avatar, Drawer, Button, Layout, Typography } from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  FileOutlined,
  TagsOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface TopMenuProps {
  handleLogout: () => void;
  collapsed: boolean;
  toggleSidebar: () => void;
}

const TopMenu: React.FC<TopMenuProps> = ({ handleLogout }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleAddDealClick = () => {
    if (!pathname.includes("/reseller_add_deal")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("deal_id");
        console.log("deal_id removed from localStorage");
      }
    }
  };

  const menuItems = [
    { path: "/reseller_dashboard", name: "Dashboard", icon: <HomeOutlined /> },
    {
      path: "/reseller_add_deal",
      name: "Add Deal",
      icon: <PlusOutlined />,
      onClick: handleAddDealClick,
    },
    { path: "/manage_deal", name: "Manage Deal", icon: <FileOutlined /> },
    { path: "/add_promocode", name: "Add Promocode", icon: <TagsOutlined /> },
    {
      path: "/manage_promocode",
      name: "Manage Promocode",
      icon: <FileOutlined />,
    },
  ];

//   const userMenu = (
//     <Menu>
//       <Menu.Item key="1" icon={<SettingOutlined />}>
//         <Link href="/reseller_profile" legacyBehavior>
//           <a>Profile</a>
//         </Link>
//       </Menu.Item>
//       <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
//         Logout
//       </Menu.Item>
//     </Menu>
//   );

 const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <SettingOutlined />,
      label: (
        <Link href="/reseller_profile">
          Profile
        </Link>
      ),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = (info) => {
    if (info.key === "logout") {
      handleLogout();
    }
    // profile is handled by the Link itself
  };

  const toggleDrawer = () => setDrawerVisible(!isDrawerVisible);

  useEffect(() => {
    if (isDrawerVisible) {
      setDrawerVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <Layout.Header
        style={{
          background: "#fff",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text
            strong
            style={{ marginLeft: "16px", fontSize: "18px", color: "#000" }}
          >
            <Link href="/reseller_dashboard" legacyBehavior>
              <a>
                <img width={150} src="/images/deal-logo-white.png" alt="Logo" />
              </a>
            </Link>
          </Text>
        </div>

        {/* Desktop Menu */}
        <div className="menu-container d-flex">
          <div className="desktop-menu">
            {menuItems.map((item, index) => (
              <Link href={item.path} passHref legacyBehavior key={index}>
                <a
                  style={{
                    color: pathname === item.path ? "#b14ede" : "#000",
                    fontSize: "16px",
                    marginRight: "16px",
                  }}
                  onClick={item.onClick}
                >
                  {item.icon}
                  <span className="mx-2">{item.name}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>

        <div className="profile-box d-flex">
          <Button
            className="mobile-menu-button"
            type="text"
            icon={<MenuOutlined className="text-white" />}
            onClick={toggleDrawer}
            style={{
              background: "transparent",
              border: "none",
              color: "#000",
              fontSize: "20px",
            }}
          />
          <Dropdown trigger={["click"]} menu={{
          items: userMenuItems,
          onClick: handleUserMenuClick,
        }}>
            <Avatar
              style={{ backgroundColor: "#b14ede", cursor: "pointer" }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </div>
      </Layout.Header>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={toggleDrawer}
        open={isDrawerVisible}
        width={250}
      >
        <Menu mode="inline">
          {menuItems.map((item, index) => (
            <Menu.Item
              key={index}
              onClick={() => {
                if (item.onClick) item.onClick();
                toggleDrawer();
                router.push(item.path);
              }}
            >
              {item.icon}
              <span className="mx-2">{item.name}</span>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    </>
  );
};

export default TopMenu;
