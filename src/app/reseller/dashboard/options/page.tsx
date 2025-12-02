"use client"

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Modal, Input, Form, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { apiUrl } from "@/config";

interface Option {
  id: string | number;
  title: string;
  regularPrice: string | number;
  PriceCutPrice: string | number;
  cap: string | number;
}

// interface CustomizeOptionsProps {
//   setSelectedTab: (tab: string) => void;
// }

interface VoucherInstructionProps {
  onNext: () => void;
  onPrevious: () => void;
  setSelectedTab: (tab: string) => void;
}

const CustomizeOptions: React.FC<VoucherInstructionProps> = ({ onNext,onPrevious, setSelectedTab }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentOption, setCurrentOption] = useState<Option | null>(null);
  const [form] = Form.useForm();

  // localStorage access guard for SSR
  const savedDealsId = typeof window !== "undefined" ? localStorage.getItem("deal_id") : null;

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/Front/OptionList`,
        { Deals_id: savedDealsId }
      );

      if (response.data.success) {
        const formattedOptions = response.data.data.map((item: any) => ({
          id: item.deal_option_id,
          title: item.option_title,
          regularPrice: item.regular_price,
          PriceCutPrice: item.pricecut_price,
          cap: item.monthly_voucher_cap,
        }));
        setOptions(formattedOptions);
      } else {
        message.error(response.data.message || "Failed to fetch options.");
        setOptions([]);
      }
    } catch (error) {
      setOptions([]);
    }
  };

  const showModal = (option: Option | null = null) => {
    setCurrentOption(option);
    setIsModalVisible(true);
    if (option) {
      form.setFieldsValue({
        title: option.title,
        regularPrice: option.regularPrice,
        PriceCutPrice: option.PriceCutPrice,
        cap: option.cap,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
      if (currentOption) {
        // Update option
        const response = await axios.post(
          `${apiUrl}/Front/UpdateOption`,
          {
            option_title: values.title,
            regular_price: values.regularPrice,
            pricecut_price: values.PriceCutPrice,
            monthly_voucher_cap: values.cap,
            deal_option_id: currentOption.id,
          }
        );
        message.success(response.data.message);
      } else {
        // Add new option
        const response = await axios.post(
          `${apiUrl}/Front/Addoption`,
          {
            title: values.title,
            regularprice: values.regularPrice,
            pricecut_price: values.PriceCutPrice,
            month_voucher_cap: values.cap,
            Deals_id: savedDealsId,
          }
        );
        message.success(response.data.message);
      }
      fetchOptions();
      setIsModalVisible(false);
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  const handleDelete = async (id: string | number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this option?",
      onOk: async () => {
        try {
          const response = await axios.post(
            `${apiUrl}/Front/DeleteOption`,
            { deal_option_id: id }
          );
          message.success(response.data.message);
          fetchOptions();
        } catch (error) {
          message.error("Failed to delete the option.");
        }
      },
    });
  };

  return (
    <div>
      <div className="container p-2">
        {options.length === 0 && (
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Add Option</h3>
        )}
        <Row gutter={[16, 16]}>
          {options.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card
                title={item.title}
                extra={
                  <div className="edit-icon">
                    <EditOutlined
                      style={{ marginRight: 8, color: "#fff" }}
                      onClick={() => showModal(item)}
                    />
                    <DeleteOutlined
                      style={{ color: "#fff" }}
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                }
              >
                <p>Regular price: {item.regularPrice}</p>
                <p>Deallios price: {item.PriceCutPrice}</p>
                <p>Monthly Selling Limit: {item.cap}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div className="mt-4 mx-3 sm-text-center">
        <Button
          className="main-btn"
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add a new option
        </Button>
        <Button
          type="primary"
          className="main-btn mx-2 my-2 my-md-0"
          icon={<RightOutlined />}
          onClick={() => setSelectedTab("3")}
        >
          Next
        </Button>
      </div>

      <Modal
        title={currentOption ? "Edit Option" : "Add Option"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Option Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="regularPrice"
            label="Regular Price"
            rules={[{ required: true, message: "Regular price is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="PriceCutPrice"
            label="Deallios Price"
            rules={[{ required: true, message: "Deallios price is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cap"
            label="Monthly Selling Limit"
            rules={[
              { required: true, message: "Voucher cap is required" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (!/^\d+$/.test(value)) {
                    return Promise.reject(new Error("Only numeric values are allowed"));
                  }
                  if (value.length > 2) {
                    return Promise.reject(new Error("Maximum 2 digits allowed"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" maxLength={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomizeOptions;
