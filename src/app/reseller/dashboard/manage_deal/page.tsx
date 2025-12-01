'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, message, Spin, Modal, Breadcrumb } from "antd";
import { ColumnType } from 'antd/es/table';
import type { Breakpoint } from 'antd';
import Link from "next/link";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  FileOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import QRCode from "qrcode";
import html2pdf from "html2pdf.js";
import "./ManageDeal.css";

// Type definitions
interface DealImage {
  photo: string;
  is_primary: number;
}

interface DealOption {
  regular_price: number;
  pricecut_price: number;
  monthly_voucher_cap: number;
  option_title: string;
}

interface DealVendor {
  vendorname: string;
  vendoraddress: string;
}

interface Deal {
  Deals_id: string;
  GUID: string;
  main_title: string;
  images: DealImage[];
  options: DealOption[];
  Is_publish: number;
  deal_description?: string;
  business_desc?: string;
  business_website?: string;
  vendor?: DealVendor;
}

interface DealDetails extends Deal {
  deal_description: string;
  business_desc: string;
  business_website: string;
  vendor: DealVendor;
}

interface ApiResponse {
  success: boolean;
  data: Deal[] | DealDetails;
  error?: string;
  message?: string;
}

export default function ManageDeal() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dealDetails, setDealDetails] = useState<DealDetails | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const vendorid = typeof window !== 'undefined' ? localStorage.getItem("vendor_id") : null;

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        if (!vendorid) {
          throw new Error("Vendor ID is not available.");
        }

        const response = await fetch(
          "https://getdemo.in/pricecut/api/Front/ManageDeal",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ vendorid }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        if (data.success) {
          setDeals(data.data as Deal[]);
        } else {
          throw new Error(data.error || "Failed to fetch deals");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [vendorid]);

  const handleView = async (record: Deal) => {
    try {
      message.info("Fetching deal details...");
      const response = await fetch(
        "https://getdemo.in/pricecut/api/Front/Deallist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Deals_id: record.Deals_id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setDealDetails(data.data as DealDetails);
        setIsModalVisible(true);
      } else {
        throw new Error("Failed to fetch deal details");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      message.error(errorMessage);
    }
  };

  const handleEdit = (record: Deal) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("deal_id", record.Deals_id);
    }
    router.push("/reseller_add_deal");
  };

  const handleDelete = (record: Deal) => {
    Modal.confirm({
      title: "Are you sure you want to delete this deal?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          const response = await fetch(
            "https://getdemo.in/pricecut/api/Front/DeleteDeal",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Deals_id: record.Deals_id }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: ApiResponse = await response.json();
          if (data.success) {
            message.success(data.message);
            setDeals((prevDeals) =>
              prevDeals.filter((deal) => deal.Deals_id !== record.Deals_id)
            );
          } else {
            throw new Error(data.message || "Failed to delete the deal");
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
          message.error(errorMessage);
        }
      },
    });
  };

  const handleGeneratePDF = async (record: Deal) => {
    try {
      const guid = record.GUID;
      const qrURL = `https://deallios.apolloinfotech.in/deal/${guid}`;

      // Generate the QR Code with custom color
      const qrCodeDataURL = await QRCode.toDataURL(qrURL, {
        color: {
          dark: "#2a2247",
          light: "#ffffff",
        },
      });

      // Create template for PDF
      const template = document.createElement("div");
      template.innerHTML = `
        <div class="container">
          <div style="border:2px solid #2a2247;">
            <div class="header logo-kl text-center pt-3 pb-3">
              <div>
                <img width="150" src="/images/logo-white.png" />
              </div>
            </div>
            <div class="qr-code text-center">
              <img src="${qrCodeDataURL}" alt="QR Code" />
            </div>
            <p class="text-black text-center">Scan the QR code to view the deal details online:</p>
          </div>
          <footer class="text-white" style="background:#2a2247;text-align:center;width:100%;padding:5px 0px">
            Generated by Deallios
          </footer>
        </div>
      `;

      // Configure options for `html2pdf.js`
      const options = {
        margin: 1,
        filename: "deal-details.pdf",
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in" as const , format: "letter" as const, orientation: "portrait" as const},
      };

      // Generate and download the PDF
      html2pdf().from(template).set(options).save();
    } catch (err) {
      console.error("Failed to generate the PDF:", err);
      message.error("Failed to generate PDF");
    }
  };

//    const responsiveBreakpoints: Breakpoint[] = ['sm', 'md', 'lg'];

  const columns: ColumnType<Deal>[] = [
    {
      title: "Sr. No.",
      key: "sr_no",
      render: (_: any, __: Deal, index: number) => index + 1,
      responsive: ["sm", "md", "lg"],
    },
    {
      title: "Deal Image",
      key: "primary_image",
      render: (_: any, record: Deal) => {
        const primaryImage = record.images?.find((img) => img.is_primary === 1);
        return primaryImage ? (
          <img
            src={primaryImage.photo}
            alt="Primary"
            style={{ width: 100, height: 50, objectFit: "cover" }}
          />
        ) : (
          "No Image"
        );
      },
    },
    {
      title: "Options Count",
      key: "options_count",
      render: (_: any, record: Deal) => {
        return record.options ? record.options.length : 0;
      },
    },
    {
      title: "Deal Title",
      dataIndex: "main_title",
      key: "main_title",
    },
    {
      title: "Original Price",
      key: "original_price",
      render: (_: any, record: Deal) => {
        const option = record.options?.[0];
        return option ? `₹${option.regular_price}` : "N/A";
      },
    },
    {
      title: "Deallios Price",
      key: "final_price",
      render: (_: any, record: Deal) => {
        const option = record.options?.[0];
        return option ? `₹${option.pricecut_price}` : "N/A";
      },
    },
    {
      title: "Deal Publish Status",
      key: "deal_status",
      render: (_: any, record: Deal) => {
        const status = record.Is_publish;
        if (status === 0) {
          return "Pending";
        } else if (status === 1) {
          return "Publish";
        }
        return "N/A";
      },
    },
    {
      title: "Monthly Selling Limit",
      key: "monthly_voucher_cap",
      render: (_: any, record: Deal) => {
        const option = record.options?.[0];
        return option ? option.monthly_voucher_cap : "N/A";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Deal) => (
        <div className="action-buttons">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record)}
          />
          <Button
            type="link"
            icon={<QrcodeOutlined />}
            onClick={() => handleGeneratePDF(record)}
          />
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="tab-gap">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href="/reseller_dashboard">
            <HomeOutlined className="mx-1" />
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/manage_deal">
            <FileOutlined className="mx-1" />
            Manage Deal
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="table-mainhead mt-4">Manage Deals</h1>
      <Table<Deal>
        columns={columns}
        dataSource={deals}
        rowKey="Deals_id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        // responsive={true}
      />

      <Modal
        title="Deal Details"
        className="deal-de-t"
        width="60%"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {dealDetails ? (
          <div className="row mt-3">
            <div className="col-lg-6">
              {dealDetails.images && dealDetails.images.length > 0 && (
                <div>
                  <img
                    src={dealDetails.images[0].photo}
                    alt="Deal Image"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="col-lg-6 ov-h">
              <h5>{dealDetails.main_title}</h5>
              <p
                dangerouslySetInnerHTML={{
                  __html: `<strong>Description:</strong> ${dealDetails.deal_description}`,
                }}
              ></p>
              <p
                dangerouslySetInnerHTML={{
                  __html: `<strong>Business Description:</strong> ${dealDetails.business_desc}`,
                }}
              ></p>
              <p>
                <strong>Business Website:</strong>{" "}
                <a
                  href={dealDetails.business_website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dealDetails.business_website}
                </a>
              </p>
              <p>
                <strong>Vendor Name:</strong> {dealDetails.vendor.vendorname}
              </p>
              <p>
                <strong>Vendor Address:</strong>{" "}
                {dealDetails.vendor.vendoraddress}
              </p>
              <h4>Options:</h4>
              {dealDetails.options && dealDetails.options.length > 0 ? (
                <ul>
                  {dealDetails.options.map((option, index) => (
                    <li key={index}>
                      <p>
                        <strong>Option {index + 1}:</strong>
                      </p>
                      <p>
                        <strong>Option Title:</strong> {option.option_title}
                      </p>
                      <p>
                        <strong>Original Price:</strong> ₹
                        {option.regular_price}
                      </p>
                      <p>
                        <strong>Deallios Price:</strong> ₹
                        {option.pricecut_price}
                      </p>
                      <p>
                        <strong>Monthly Selling Limit:</strong>{" "}
                        {option.monthly_voucher_cap}
                      </p>
                      <hr />
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No options available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading deal details...</p>
        )}
      </Modal>
    </div>
  );
}