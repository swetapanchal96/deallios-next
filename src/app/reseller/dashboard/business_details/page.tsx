"use client"

import React, { useEffect, useState } from "react";
import { Input, Form, Button, message } from "antd";
import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css";
import { apiUrl } from "@/config";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface BusinessDetailsFormValues {
  businessType: string;
  businessWebsite: string;
  businessDescription: string;
}

interface VoucherInstructionProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface ApiResponse {
  success: boolean;
  data?: {
    business_type?: string;
    business_desc?: string;
    business_website?: string;
    is_publish?: number;
  };
  message?: string;
}

const BusinessDetails: React.FC<VoucherInstructionProps> = ({onNext, onPrevious}) => {
  const [form] = Form.useForm<BusinessDetailsFormValues>();
  const [loading, setLoading] = useState(false);
  const [isPublish, setIsPublish] = useState<number>(0);

  const validateWebsite = (_: any, value: string): Promise<void> => {
    if (!value) return Promise.reject(new Error("Please enter your business website!"));
    const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;
    return regex.test(value)
      ? Promise.resolve()
      : Promise.reject(new Error("Please enter a valid URL!"));
  };

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      const savedDealsId = localStorage.getItem("deal_id");
      if (!savedDealsId) return;

      try {
        const response = await fetch(
          `${apiUrl}/Front/ShowBusinessInfo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ Deals_id: savedDealsId }),
          }
        );

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          const { business_type, business_desc, business_website, is_publish } = result.data;

          form.setFieldsValue({
            businessType: business_type || "",
            businessWebsite: business_website || "",
            businessDescription: business_desc || "",
          });

          setIsPublish(is_publish || 0);
        } else {
          message.error(result.message || "Failed to load business info.");
        }
      } catch (error) {
        console.error("API Error:", error);
        message.error("An error occurred while fetching business info.");
      }
    };

    fetchBusinessDetails();
  }, [form]);

  const handleSubmit = async (values: BusinessDetailsFormValues) => {
    const savedDealsId = localStorage.getItem("deal_id");
    if (!savedDealsId) {
      message.error("Vendor ID is missing in local storage!");
      return;
    }

    const payload = {
      Deals_id: savedDealsId,
      business_type: values.businessType,
      business_website: values.businessWebsite,
      business_desc: values.businessDescription,
    };

    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/Front/AddBusinessInfo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedDealsId}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result: ApiResponse = await response.json();

      if (result.success) {
        message.success(result.message || "Business Info Updated Successfully!");
      } else {
        message.error(result.message || "Failed to update business info.");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("An error occurred while updating business info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", margin: "auto" }}>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Business Type"
          name="businessType"
          rules={[{ required: true, message: "Please enter your business type!" }]}
        >
          <Input placeholder="Enter your business type" />
        </Form.Item>

        <Form.Item
          label="Business Website"
          name="businessWebsite"
          rules={[{ required: true, validator: validateWebsite }]}
        >
          <Input placeholder="Enter your business website" />
        </Form.Item>

        <Form.Item
          label="Business Description"
          name="businessDescription"
          rules={[{ required: true, message: "Please provide a description!" }]}
        >
          <ReactQuill
            theme="snow"
            placeholder="Write a brief description of your business"
            style={{ height: "150px" }}
            onChange={(value) => form.setFieldsValue({ businessDescription: value })}
          />
        </Form.Item>

        <Form.Item className="mt-5">
          <Button
            className="main-btn"
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ padding: "20px", marginTop: "15px" }}
          >
            {isPublish === 0 ? "Submit" : "Save & Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BusinessDetails;
