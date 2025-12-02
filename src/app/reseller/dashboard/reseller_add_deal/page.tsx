"use client";

import React, { useState, useEffect } from "react";
import {
    Layout,
    Menu,
    Button,
    Modal,
    Form,
    Input,
    Drawer,
    Breadcrumb,
} from "antd";
import {
    MenuOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    BarChartOutlined,
    HomeOutlined,
    FileOutlined,
    FileTextOutlined,
    InfoCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";
import PhotosSection from "../photos_section/page";
import DescriptionBox from "../description/page";
import VoucherInstruction from "../voucher_instruction/page";
import Options from "../options/page";
import Review from "../review/page";
import BusinessDetails from "../business_details/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Padding } from "@mui/icons-material";

const { Sider, Content } = Layout;

type OptionItem = {
    id: number;
    title: string;
    regularPrice: string;
    PriceCutPrice: string;
    cap: string;
};


const ResellerAddDeal: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            toast.error("User not authenticated. Please log in.");
            router.push("/login");
        }
    }, [router]);

    const [selectedTab, setSelectedTab] = useState<string>("1");
    const [options, setOptions] = useState<OptionItem[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editOption, setEditOption] = useState<OptionItem | null>(null);

    const [form] = Form.useForm<OptionItem>();
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

    // Load the selected tab from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        const savedTab = localStorage.getItem("selectedTab");
        if (savedTab) {
            setSelectedTab(savedTab);
        }
    }, []);

    // Save the selected tab to localStorage whenever it changes
    useEffect(() => {
        if (typeof window === "undefined") return;
        localStorage.setItem("selectedTab", selectedTab);
    }, [selectedTab]);

    // Show the modal for adding/editing an option
    const showModal = (option: OptionItem | null = null) => {
        setEditOption(option);
        if (option) form.setFieldsValue(option);
        else form.resetFields();
        setIsModalVisible(true);
    };

    // Handle save (Add/Edit)
    const handleSave = () => {
        form.validateFields().then((values) => {
            if (editOption) {
                setOptions((prev) =>
                    prev.map((item) =>
                        item.id === editOption.id ? { ...item, ...values } : item
                    )
                );
            } else {
                setOptions((prev) => [
                    ...prev,
                    { ...values, id: Date.now() }, // Assign a unique ID
                ]);
            }
            setIsModalVisible(false);
        });
    };

    // Handle delete
    const handleDelete = (id: number) => {
        setOptions((prev) => prev.filter((item) => item.id !== id));
    };

    // Render content based on the selected tab
    const renderContent = () => {
        if (selectedTab === "1") {
            return (
                <DescriptionBox
                    onNext={() => setSelectedTab("2")}
                    onPrevious={() => setSelectedTab("2")}
                />
            );
        } else if (selectedTab === "2") {
            return (
                <Options
                    onNext={() => setSelectedTab("3")}
                    onPrevious={() => setSelectedTab("1")}
                    setSelectedTab={setSelectedTab}
                />
            );
        } else if (selectedTab === "3") {
            return (
                <PhotosSection
                    onNext={() => setSelectedTab("4")}
                    onPrevious={() => setSelectedTab("2")}
                    options={options}
                    showModal={showModal}
                    handleDelete={handleDelete}
                    setSelectedTab={setSelectedTab}
                />
            );
        } else if (selectedTab === "4") {
            return (
                <VoucherInstruction
                    onNext={() => setSelectedTab("5")}
                    onPrevious={() => setSelectedTab("3")}
                />
            );
        } else if (selectedTab === "5") {
            return (
                <BusinessDetails
                    onNext={() => setSelectedTab("6")}
                    onPrevious={() => setSelectedTab("4")}
                />
            );
        } else if (selectedTab === "6") {
            return (
                <Review
                    onNext={() => setSelectedTab("5")}
                    onPrevious={() => setSelectedTab("4")}
                />
            );
        }
        return null;
    };

    return (
        <>
            <Breadcrumb
                style={{ margin: "16px 0" ,color:"white" }}
                items={[
                    {
                        title: (
                            <Link href="/reseller/dashboard/reseller_dashboard" className="text-white">
                                <HomeOutlined className="mx-1" /> Dashboard
                            </Link>
                        ),
                    },
                    {
                        title: (
                            <Link href="/reseller/dashboard/reseller_add_deal" className="text-white">
                                <FileOutlined className="mx-1" /> Manage Deal
                            </Link>
                        ),
                    },
                ]}
            />

            <Button
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                className="mobile-only hamburger-button-new mb-3 d-flex"
                style={{
                    top: "16px",
                    left: "16px",
                    zIndex: 1000,
                    background: "#2a2247",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                }}
            >
                Menu
            </Button>
            <Layout style={{ minHeight: "100vh" }}>
                {/* Drawer for Mobile */}
                <Drawer
                    title="Manage Deal"
                    placement="left"
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    styles={{
                        body: { padding: 0 },
                    }}
                >
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedTab]}
                        onClick={(e) => {
                            setSelectedTab(e.key);
                            setDrawerVisible(false);
                        }}
                    >
                        <Menu.Item key="1" icon={<PlusOutlined />}>
                            Description
                        </Menu.Item>
                        <Menu.Item key="2" icon={<UnorderedListOutlined />}>
                            Options
                        </Menu.Item>
                        <Menu.Item key="3" icon={<BarChartOutlined />}>
                            Photos
                        </Menu.Item>
                        <Menu.Item key="4" icon={<FileTextOutlined />}>
                            Voucher Instruction
                        </Menu.Item>
                        <Menu.Item key="5" icon={<InfoCircleOutlined />}>
                            Business Information
                        </Menu.Item>
                        <Menu.Item key="6" icon={<StarOutlined />}>
                            Review
                        </Menu.Item>
                    </Menu>
                </Drawer>

                {/* Sider for Desktop */}
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    style={{
                        backgroundColor: "#282445",
                        borderRadius: "12px",
                        justifyContent: "flex-start",
                    }}
                    className="desktop-sidebar"
                >
                    <div
                        style={{
                            height: "64px",
                            color: "white",
                            fontSize: "20px",
                            textAlign: "center",
                            lineHeight: "64px",
                            fontWeight: "bold",
                        }}
                    >
                        Manage Deal
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedTab]}
                        onClick={(e) => setSelectedTab(e.key)}
                        items={[
                            {
                                key: "1",
                                icon: <PlusOutlined />,
                                label: "Description"
                            },
                            {
                                key: "2",
                                icon: <UnorderedListOutlined />,
                                label: "Options"
                            },
                            {
                                key: "3",
                                icon: <BarChartOutlined />,
                                label: "Photos"
                            },
                            {
                                key: "4",
                                icon: <FileTextOutlined />,
                                label: "Voucher Instruction"
                            },
                            {
                                key: "5",
                                icon: <InfoCircleOutlined />,
                                label: "Business Information"
                            },
                            {
                                key: "6",
                                icon: <StarOutlined />,
                                label: "Review"
                            }
                        ]}
                    />
                        
                </Sider>

                <Layout>
                    <Content style={{ margin: "24px 16px", background: "#fff" }}>
                        {renderContent()}
                    </Content>
                </Layout>

                {/* Modal for Adding/Editing */}
                <Modal
                    title={editOption ? "Edit Option" : "Add New Option"}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onOk={handleSave}
                    okText="Save"
                >
                    <Form<OptionItem> form={form} layout="vertical">
                        <Form.Item
                            name="title"
                            label="Option Title"
                            rules={[{ required: true, message: "Title is required" }]}
                        >
                            <Input placeholder="Enter title" />
                        </Form.Item>
                        <Form.Item
                            name="regularPrice"
                            label="Regular Price"
                            rules={[{ required: true, message: "Regular price is required" }]}
                        >
                            <Input placeholder="Enter regular price" />
                        </Form.Item>
                        <Form.Item
                            name="DealliosPrice"
                            label="Deallios Price"
                            rules={[{ required: true, message: "Deallios price is required" }]}
                        >
                            <Input placeholder="Enter Deallios price" />
                        </Form.Item>
                        <Form.Item
                            name="cap"
                            label="Monthly Voucher Cap"
                            rules={[{ required: true, message: "Voucher cap is required" }]}
                        >
                            <Input placeholder="Enter voucher cap" type="number" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </>
    );
};

export default ResellerAddDeal;
