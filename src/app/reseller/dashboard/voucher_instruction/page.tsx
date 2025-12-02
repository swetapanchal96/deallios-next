"use client"

import React, { useState, useEffect } from 'react';
import {
    Radio,
    Input,
    Select,
    Button,
    Typography,
    Divider,
    Modal,
    Form,
    notification,
    RadioChangeEvent
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { apiUrl } from '@/config';

interface VoucherInstructionProps {
  onNext: () => void;
  onPrevious: () => void;
}

const { Title, Text } = Typography;
const { Option } = Select;

const VoucherInstruction: React.FC<VoucherInstructionProps> = ({onNext,onPrevious}) => {
    const [redemptionMethod, setRedemptionMethod] = useState<string>("physical");
    const [appointmentRequired, setAppointmentRequired] = useState<string>("required");
    const [contactMethod, setContactMethod] = useState<string>("email");
    const [email, setEmail] = useState<string>("dev3.apolloinfotech@gmail.com");
    const [vendorAddress, setVendorAddress] = useState<string | null>(null);
    const [vendorMobile, setVendorMobile] = useState<string | null>(null);
    const [vendorName, setVendorName] = useState<string | null>(null);
    const [stateName, setStateName] = useState<string>("");
    const [cityName, setCityName] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [updatedAddress, setUpdatedAddress] = useState<string>("");
    const [updatedMobile, setUpdatedMobile] = useState<string>("");

    useEffect(() => {
        const fetchLocation = async () => {
            const vendorId = localStorage.getItem("vendor_id");
            if (!vendorId) {
                console.error("Vendor ID not found in localStorage");
                return;
            }

            try {
                const response = await fetch(
                    `${apiUrl}/Front/DisplayLocation`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ vendorid: vendorId }),
                    }
                );

                const result = await response.json();
                if (result.success && result.data) {
                    const vendorData = result.data;
                    setVendorAddress(vendorData.vendoraddress);
                    setVendorMobile(vendorData.vendormobile);
                    setVendorName(vendorData.vendorname);
                    setStateName(vendorData.state_name);
                    setCityName(vendorData.city_name);
                } else {
                    console.error("Failed to fetch location data");
                }
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        };

        fetchLocation();
    }, []);

    const handleEdit = () => {
        setUpdatedAddress(vendorAddress || "");
        setUpdatedMobile(vendorMobile || "");
        setIsModalVisible(true);
    };

    const handleUpdateLocation = async () => {
        const vendorId = localStorage.getItem("vendor_id");
        if (!vendorId) {
            notification.error({ title: "Error", description: "Vendor ID not found in localStorage" });
            return;
        }

        try {
            const response = await fetch(
                `${apiUrl}/Front/UpdateLocation`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        vendorid: vendorId,
                        vendoraddress: updatedAddress,
                        vendormobile: updatedMobile,
                        Deals_id: vendorId,
                    }),
                }
            );

            const result = await response.json();
            if (result.success) {
                notification.success({
                    title: "Success",
                    description: "Vendor location updated successfully",
                });
                setVendorAddress(updatedAddress);
                setVendorMobile(updatedMobile);
                setIsModalVisible(false);
            } else {
                notification.error({ title: "Error", description: "Failed to update location" });
            }
        } catch (error) {
            console.error("Error updating location:", error);
            notification.error({ title: "Error", description: "Error updating location" });
        }
    };

    return (
        <div>
            <Title level={4}>Let customers know how to redeem their vouchers.</Title>
            <Text type="secondary">
                Select one method of redemption and let customers know if they need to
                make an appointment in advance. This information will be added to your
                campaign.
            </Text>

            <Divider />

            <div>
                <Title level={5}>How will customers redeem their vouchers?</Title>
                <Radio.Group
                    value={redemptionMethod}
                    onChange={(e: RadioChangeEvent) => setRedemptionMethod(e.target.value)}
                >
                    <Radio value="physical">
                        Customers will visit a physical location.
                    </Radio>
                    <Radio value="online">Customers will use their voucher online.</Radio>
                </Radio.Group>
            </div>

            {redemptionMethod === "physical" && (
                <div className="mt-3">
                    <Title level={5}>Customers will visit the physical location</Title>
                    <div className="w-25">
                        {vendorAddress && vendorMobile && vendorName ? (
                            <Text>
                                {vendorName} <br />
                                {vendorAddress} <br />
                                {vendorMobile && `Contact: ${vendorMobile}`} <br />
                                {cityName && stateName && `${cityName}, ${stateName}`}
                            </Text>
                        ) : (
                            <Text type="secondary">Loading address...</Text>
                        )}
                    </div>
                    {/* <div>
            <Button icon={<EditOutlined />} type="link" onClick={handleEdit}>
              Edit
            </Button>
          </div> */}
                </div>
            )}

            <Divider />

            <div>
                <Title level={5}>Do customers need to make an appointment?</Title>
                <Radio.Group
                    value={appointmentRequired}
                    onChange={(e: RadioChangeEvent) => setAppointmentRequired(e.target.value)}
                >
                    <Radio value="not-needed">No appointment needed</Radio>
                    <Radio value="required">Yes appointment required</Radio>
                </Radio.Group>
            </div>

            <Divider />

            <div>
                <Title level={5}>Contact Method</Title>
                <Select
                    style={{ width: "100%", marginBottom: "10px" }}
                    value={contactMethod}
                    onChange={(value: string) => setContactMethod(value)}
                >
                    <Option value="email">Email</Option>
                    <Option value="phone">Phone</Option>
                </Select>

                {contactMethod === "email" && (
                    <div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            This email address will be shown on your campaign page and vouchers.
                        </Text>
                    </div>
                )}
            </div>

            <Modal
                title="Edit Vendor Location"
                open={isModalVisible}
                onOk={handleUpdateLocation}
                onCancel={() => setIsModalVisible(false)}
                okText="Update"
                cancelText="Cancel"
            >
                <Form layout="vertical">
                    <Form.Item label="Vendor Address">
                        <Input
                            value={updatedAddress}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdatedAddress(e.target.value)}
                            placeholder="Enter new address"
                        />
                    </Form.Item>
                    <Form.Item label="Vendor Mobile">
                        <Input
                            value={updatedMobile}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdatedMobile(e.target.value)}
                            placeholder="Enter new mobile number"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default VoucherInstruction;
