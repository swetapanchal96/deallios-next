"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { message, Breadcrumb, Form, Input, Button, Upload, Avatar, Card, Row, Col, Tabs } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  HomeOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { apiUrl } from "@/config";
import Link from "next/link";

interface VendorDataType {
  vendorname: string;
  businessname: string;
  vendoremail: string;
  vendorimg: File | string | null;
  vendoraddress: string;
  vendormobile: string;
}

interface PasswordDataType {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ResellerProfile: React.FC = () => {
  const router = useRouter();
  const [vendorData, setVendorData] = useState<VendorDataType>({
    vendorname: "",
    businessname: "",
    vendoremail: "",
    vendorimg: null,
    vendoraddress: "",
    vendormobile: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const vendor_id = localStorage.getItem("vendor_id");
    if (!token) {
      toast.error("User not authenticated. Please log in.");
      router.push("/login");
    } else {
      axios
        .post(
          `${apiUrl}/vendor/profile`,
          { vendorid: vendor_id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          if (response.data.success) {
            setVendorData(response.data.data);
          }
        })
        .catch((error) => {
          toast.error("Failed to fetch vendor data.");
          console.error(error);
        });
    }
  }, [router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const vendor_id = localStorage.getItem("vendor_id");

    const formData = new FormData();
    formData.append("vendorid", vendor_id ?? "");
    formData.append("vendorname", vendorData.vendorname);
    formData.append("businessname", vendorData.businessname);
    formData.append("vendoremail", vendorData.vendoremail);
    formData.append("vendoraddress", vendorData.vendoraddress);
    formData.append("vendormobile", vendorData.vendormobile);

    if (vendorData.vendorimg instanceof File) {
      formData.append("vendorimg", vendorData.vendorimg);
    }

    try {
      const response = await axios.post(
        `${apiUrl}/vendor/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      if (response.data.success) {
        toast.success("Vendor profile updated successfully.");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error updating profile.");
      console.error(error);
    }
  };

  const ChangePassword: React.FC = () => {
    const [passwordData, setPasswordData] = useState<PasswordDataType>({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setPasswordLoading(true);

      const { oldPassword, newPassword, confirmPassword } = passwordData;

      if (oldPassword === newPassword) {
        setPasswordLoading(false);
        message.error("Old and new passwords cannot be the same.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordLoading(false);
        message.error("New password and confirm password do not match.");
        return;
      }

      const token = localStorage.getItem("token");
      const vendor_id = localStorage.getItem("vendor_id");

      try {
        const response = await axios.post(
          `${apiUrl}/vendor/change/password`,
          {
            vendorid: vendor_id,
            old_password: oldPassword,
            new_password: newPassword,
            confirm_new_password: confirmPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPasswordLoading(false);
        if (response.data.success) {
          message.success("Password changed successfully.");
          setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          message.error(response.data.message || "Failed to change password.");
        }
      } catch (error) {
        setPasswordLoading(false);
        message.error("Error changing password.");
        console.error(error);
      }
    };

    return (
      <Form layout="vertical" onSubmitCapture={handlePasswordSubmit}>
        <Form.Item label="Old Password">
          <Input.Password
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            placeholder="Enter old password"
          />
        </Form.Item>
        <Form.Item label="New Password">
          <Input.Password
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
          />
        </Form.Item>
        <Form.Item label="Confirm Password">
          <Input.Password
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
          />
        </Form.Item>
        <Button
          type="primary"
          block
          className="auth-btn"
          loading={passwordLoading}
          onClick={handlePasswordSubmit}
          style={{ borderRadius: "8px" }}
        >
          {passwordLoading ? "Changing..." : "Change Password"}
        </Button>
      </Form>
    );
  };

  return (
    <>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <Link href="/reseller/dashboard/reseller_dashboard" className="text-white">
                <HomeOutlined className="mx-1" />
                Dashboard
              </Link>
            ),
          },
          {
            title: (
              <Link href="/reseller/dashboard/reseller_profile" className="text-white">
                <FileOutlined className="mx-1" />
                Manage Profile
              </Link>
            ),
          },
        ]}
      />

      <div
        style={{
          background: "aliceblue",
          display: "flex",
          width: "100%",
          margin: "0 auto",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
        }}
        className="pad-30"
      >
        <Card
          className="w-60"
          style={{
            borderRadius: "15px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            backgroundColor: "#ffffff",
            border: "none !important",
          }}
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: <span>👤 Profile</span>,
                children: (
                  <>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <Avatar
                        size={100}
                        icon={<UserOutlined />}
                        src={
                          vendorData.vendorimg instanceof File
                            ? URL.createObjectURL(vendorData.vendorimg)
                            : (vendorData.vendorimg as string) || null
                        }
                        style={{ marginBottom: "10px" }}
                      />
                      <h2 style={{ fontWeight: "bold", margin: 0 }}>
                        {vendorData.vendorname || "Vendor Name"}
                      </h2>
                      <p style={{ margin: 0, color: "#888" }}>
                        {vendorData.vendoremail || "Email Address"}
                      </p>
                    </div>

                    <Form layout="vertical" onSubmitCapture={handleSubmit}>
                      <Row gutter={16}>
                        <Col span={24} lg={12}>
                          <Form.Item label="Vendor Name">
                            <Input
                              type="text"
                              name="vendorname"
                              value={vendorData.vendorname}
                              onChange={handleInputChange}
                              placeholder="Enter vendor name"
                              style={{ borderRadius: "8px" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24} lg={12}>
                          <Form.Item label="Business Name">
                            <Input
                              type="text"
                              name="businessname"
                              value={vendorData.businessname}
                              onChange={handleInputChange}
                              placeholder="Enter business name"
                              style={{ borderRadius: "8px" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24} lg={12}>
                          <Form.Item label="Email">
                            <Input
                              type="email"
                              name="vendoremail"
                              value={vendorData.vendoremail}
                              onChange={handleInputChange}
                              placeholder="Enter email"
                              style={{ borderRadius: "8px" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24} lg={12}>
                          <Form.Item label="Mobile">
                            <Input
                              type="text"
                              name="vendormobile"
                              value={vendorData.vendormobile}
                              onChange={handleInputChange}
                              placeholder="Enter mobile number"
                              style={{ borderRadius: "8px" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item label="Business Address">
                            <Input
                              type="text"
                              name="vendoraddress"
                              value={vendorData.vendoraddress}
                              onChange={handleInputChange}
                              placeholder="Enter business address"
                              style={{ borderRadius: "8px" }}
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Form.Item label="Vendor Image">
                            <Upload
                              name="vendorimg"
                              showUploadList={false}
                              beforeUpload={(file) => {
                                setVendorData({ ...vendorData, vendorimg: file });
                                return false;
                              }}
                            >
                              <Button icon={<UploadOutlined />} style={{ borderRadius: "8px" }}>
                                Upload Image
                              </Button>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Button
                        type="primary"
                        block
                        className="auth-btn"
                        loading={loading}
                        onClick={handleSubmit}
                        style={{
                          borderRadius: "8px",
                          backgroundColor: "#4CAF50",
                          borderColor: "#4CAF50",
                        }}
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </Form>
                  </>
                ),
              },

              {
                key: "2",
                label: <span>🔒 Change Password</span>,
                children: <ChangePassword />,
              },
            ]}
          />

        </Card>
      </div>
    </>
  );
};

export default ResellerProfile;
