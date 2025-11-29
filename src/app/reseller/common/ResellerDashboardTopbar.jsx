import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom"; // Use useLocation for current path
import { Menu, Dropdown, Avatar, Drawer, Button } from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  FileOutlined,
  TagsOutlined,
  SettingOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons"; // Ensure icons are imported
import { Layout, Typography } from "antd"; // Ensure correct imports for Layout and Text

const { Text } = Typography;

const TopMenu = ({ handleLogout }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation(); // Get current location (path)

  const handleAddDealClick = () => {
    if (!location.pathname.includes("/reseller_add_deal")) {
      localStorage.removeItem("deal_id");
      console.log("deal_id removed from localStorage");
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

  const userMenu = (
    <Menu>
      <Menu.Item>
        {/* <span className="mx-2 sm-d-block">Hello,</span> */}
      </Menu.Item>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        <NavLink to="/reseller_profile">Profile</NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const toggleDrawer = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  // Close drawer when location changes
  useEffect(() => {
    if (isDrawerVisible) {
      setDrawerVisible(false);
    }
  }, [location]);

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
        {/* <div style={{ display: "flex", alignItems: "center" }}>
          <Text
            strong
            style={{ marginLeft: "16px", fontSize: "18px", color: "#000" }}
          >
            <img width={150} src="images/deal-logo-white.png" alt="Logo" />
          </Text>
        </div> */}

        <div style={{ display: "flex", alignItems: "center" }}>
          <Text
            strong
            style={{ marginLeft: "16px", fontSize: "18px", color: "#000" }}
          >
            <Link to="/reseller_dashboard">
              <img width={150} src="images/deal-logo-white.png" alt="Logo" />
            </Link>
          </Text>
        </div>

        {/* Desktop Menu */}
        <div className="menu-container d-flex">
          <div className="desktop-menu">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                style={{
                  color: "#000",
                  fontSize: "16px",
                  marginRight: "16px",
                }}
                onClick={item.onClick}
              >
                {item.icon}
                <span className="mx-2">{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
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
          {/* <span className="mx-2 sm-d-none text-white">Hello,</span> */}
          <Dropdown overlay={userMenu} trigger={["click"]}>
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
        visible={isDrawerVisible}
        width={250}
      >
        <Menu mode="inline">
          {menuItems.map((item, index) => (
            <Menu.Item
              key={index}
              onClick={() => {
                item.onClick();
                toggleDrawer();
              }}
            >
              <NavLink to={item.path} style={{ color: "#000" }}>
                {item.icon}
                <span className="mx-2">{item.name}</span>
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    </>
  );
};

export default TopMenu;
