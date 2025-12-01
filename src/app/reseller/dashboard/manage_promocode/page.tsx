"use client"
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Breadcrumb,
  Upload,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  FileOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { UploadOutlined } from "@ant-design/icons";
import { apiUrl } from "@/config";

const ManagePromocode: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | string | null>(null); // For holding selected image

  // Fetch promocode list
  useEffect(() => {
    const fetchPromocodeList = async () => {
      setLoading(true);
      const vendorId = localStorage.getItem("vendor_id");

      try {
        const response = await fetch(
          `${apiUrl}/Front/PromocodeList`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vendorid: vendorId }),
          }
        );
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          message.error("Failed to fetch promocode list.");
        }
      } catch (error) {
        console.error("Error fetching promocode data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromocodeList();
  }, []);

  // Show promocode details
  const handleShowPromocode = async (promo_id: string | number) => {
    try {
      const response = await fetch(
        `${apiUrl}/Front/PromocodeShow`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promo_id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setSelectedPromo(result.data);
        setIsModalVisible(true);

        // Convert discount percentage to number & set form values
        form.setFieldsValue({
          ...result.data,
          dis_per: Number(result.data.dis_per),
        });

        // Set image file if available
        if (result.data.pro_img) {
          setImageFile(result.data.pro_img);
        }
      } else {
        message.error("Failed to fetch promocode details.");
      }
    } catch (error) {
      console.error("Error showing promocode:", error);
    }
  };

  // Update promocode
  const handleUpdatePromocode = async (values: any) => {
    try {
      const vendorId = localStorage.getItem("vendor_id");
      const payload = {
        ...values,
        vendorid: vendorId,
      };

      if (imageFile) {
        const formData = new FormData();
        formData.append("promo_id", values.promo_id);
        formData.append("code", values.code);
        formData.append("dis_per", values.dis_per);
        formData.append("description", values.description);
        formData.append("start_date", values.start_date);
        formData.append("end_date", values.end_date);
        formData.append("link", values.link);
        formData.append("pro_img", imageFile);

        const response = await fetch(
          `${apiUrl}/Front/Updatepromocode`,
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();
        if (result.success) {
          message.success("Promocode updated successfully.");
          setIsModalVisible(false);
          const updatedData = data.map((promo) =>
            promo.promo_id === values.promo_id ? result.data : promo
          );
          setData(updatedData);
        } else {
          message.error("Failed to update promocode.");
        }
      } else {
        const response = await fetch(
          `${apiUrl}/Front/Updatepromocode`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const result = await response.json();
        if (result.success) {
          message.success("Promocode updated successfully.");
          setIsModalVisible(false);
          const updatedData = data.map((promo) =>
            promo.promo_id === values.promo_id ? result.data : promo
          );
          setData(updatedData);
        } else {
          message.error("Failed to update promocode.");
        }
      }
    } catch (error) {
      console.error("Error updating promocode:", error);
    }
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    setImageFile(file);
    return false;
  };

  // Table columns
  const columns = [
    {
      title: "Sr. No.",
      key: "sr_no",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Promo Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Promo Image",
      dataIndex: "pro_img",
      key: "pro_img",
      render: (text: string) => (
        <img
          src={text}
          alt="Promo"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Discount (%)",
      dataIndex: "dis_per",
      key: "dis_per",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleShowPromocode(record.promo_id)}
            title="Show"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setIsUpdate(true);
              handleShowPromocode(record.promo_id);
            }}
            title="Update"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() =>
              Modal.confirm({
                title: "Are you sure?",
                content: "Do you want to delete this promocode?",
                okText: "Yes",
                cancelText: "No",
                // onOk: () => handleDeletePromocode(record.promo_id),
              })
            }
            title="Delete"
          />
        </>
      ),
    },
  ];

  // You might want to implement handleDeletePromocode depending on your needs.

  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href="/reseller/dashboard/reseller_dashboard">
            <HomeOutlined className="mx-1" />
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/reseller/dashboard/manage_promocode">
            <FileOutlined className="mx-1" />
            Manage Promo Code
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ padding: "20px" }}>
        <h1 className="table-mainhead">Manage Promocodes</h1>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="promo_id"
          bordered
        />

        <Modal
          open={isModalVisible}
          title={isUpdate ? "Update Promocode" : "Promocode Details"}
          onCancel={() => {
            setIsModalVisible(false);
            setIsUpdate(false);
            form.resetFields();
            setImageFile(null);
          }}
          onOk={() => {
            if (isUpdate) {
              form.validateFields().then((values) => {
                handleUpdatePromocode({
                  ...values,
                  promo_id: selectedPromo?.promo_id,
                });
              });
            } else {
              setIsModalVisible(false);
            }
          }}
        >
          <Form
            form={form}
            layout={"vertical" as const}
            initialValues={{
              code: selectedPromo?.code,
              dis_per: selectedPromo?.dis_per,
              description: selectedPromo?.description,
              start_date: selectedPromo?.start_date,
              end_date: selectedPromo?.end_date,
              link: selectedPromo?.link,
            }}
          >
            <div className="row">
              <div className="col-lg-6">
                <Form.Item
                  name="code"
                  label="Promo Code"
                  rules={[{ required: true, message: "Promo Code is required" }]}
                >
                  <Input disabled={!isUpdate} />
                </Form.Item>
              </div>
              <div className="col-lg-6">
                <Form.Item
                  name="dis_per"
                  label="Discount (%)"
                  rules={[
                    {
                      required: true,
                      type: "number",
                      min: 1,
                      max: 100,
                      message: "Discount must be between 1% and 100%",
                    },
                  ]}
                >
                  <InputNumber className="w-100" disabled={!isUpdate} />
                </Form.Item>
              </div>
              <div className="col-lg-12">
                <Form.Item name="description" label="Promocode Description">
                  <Input disabled={!isUpdate} />
                </Form.Item>
              </div>
              <div className="col-lg-6">
                <Form.Item name="start_date" label="Start Date">
                  <Input disabled={!isUpdate} />
                </Form.Item>
              </div>
              <div className="col-lg-6">
                <Form.Item name="end_date" label="End Date">
                  <Input disabled={!isUpdate} />
                </Form.Item>
              </div>
              <div className="col-lg-12">
                <Form.Item name="link" label="Link">
                  <Input disabled={!isUpdate} />
                </Form.Item>
              </div>

              {isUpdate && (
                <div className="col-lg-12">
                  <Form.Item label="Promo Image">
                    <Upload showUploadList={false} beforeUpload={handleImageUpload}>
                      <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>

                    {imageFile && (
                      <img
                        src={typeof imageFile === "string" ? imageFile : URL.createObjectURL(imageFile)}
                        alt="Promo"
                        style={{ width: "100px" }}
                      />
                    )}
                  </Form.Item>
                </div>
              )}
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ManagePromocode;
