'use client';

import React, { useState, useEffect, FormEvent } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Button,
  Input,
  Upload,
  message,
  Form,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Skeleton,
  
} from "antd";
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';
import {
  UploadOutlined,
  SearchOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import type { UploadFile as AntdUploadFile } from 'antd/es/upload/interface';
import { apiUrl } from "@/config";

const { Title, Text } = Typography;

interface ImageBankItem {
  id: number;
  image_url: string;
  category: string;
}

interface ServerImage {
  Dealimage_id: number;
  photo: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    self?: ServerImage[];
    bank?: ServerImage[];
    ai?: ServerImage[];
  };
  message?: string;
  image_url?: string;
}

interface ImageBankResponse {
  success: boolean;
  data: ImageBankItem[];
}
interface OptionItem {
    id: number;
    title: string;
    regularPrice: string;
    PriceCutPrice: string;
    cap: string;
}

interface OptionsProps {
  options: OptionItem[];
  showModal: (option?: OptionItem | null) => void;
  handleDelete: (id: number) => void;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  onNext: () => void;
  onPrevious: () => void;
}

const FileUpload: React.FC<OptionsProps> = () => {
  const [photos, setPhotos] = useState<AntdUploadFile[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [dealId, setDealId] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [searchPrompt, setSearchPrompt] = useState<string>("");
  const [imageBank, setImageBank] = useState<ImageBankItem[]>([]);
  const [selectedImageBankId, setSelectedImageBankId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const storedDealId = typeof window !== 'undefined' ? localStorage.getItem("deal_id") : null;

  useEffect(() => {
    if (storedDealId) {
      setDealId(storedDealId);
    } else {
      setResponseMessage("Deal ID not found in localStorage");
    }
    fetchImageBank();
  }, []);

  const fetchImageBank = async (): Promise<void> => {
    try {
      const response: AxiosResponse<ImageBankResponse> = await axios.get(
        `${apiUrl}/Front/getimages`
      );
      if (response.data.success) {
        setImageBank(response.data.data);
      } else {
        message.error("Failed to fetch image bank");
      }
    } catch (error) {
      message.error("Error fetching image bank");
    }
  };

  useEffect(() => {
    if (storedDealId) {
      const fetchImageUpdate = async (): Promise<void> => {
        try {
          const response: AxiosResponse<ApiResponse> = await axios.post(
            `${apiUrl}/Front/getuploadimages`,
            { Deals_id: storedDealId }
          );

          if (
            response.data.success &&
            response.data.data &&
            response.data.data.self
          ) {
            const selfImages: ServerImage[] = response.data.data.self;

            const serverSelf: AntdUploadFile[] = selfImages.map((item) => ({
              uid: `server-${item.Dealimage_id}`,
              name: `image-${item.Dealimage_id}.jpg`,
              status: "done" as const,
              url: item.photo,
              preview: item.photo,
              fromServer: true,
            }));

            const bankImages: ServerImage[] | undefined = response.data.data.bank;
            const serverBank: AntdUploadFile[] = bankImages ? bankImages.map((item) => ({
              uid: `server-${item.Dealimage_id}`,
              name: `image-${item.Dealimage_id}.jpg`,
              status: "done" as const,
              url: item.photo,
              preview: item.photo,
              fromServer: true,
            })) : [];

            const aiImages: ServerImage[] | undefined = response.data.data.ai;
            const serverAi: AntdUploadFile[] = aiImages ? aiImages.map((item) => ({
              uid: `server-${item.Dealimage_id}`,
              name: `image-${item.Dealimage_id}.jpg`,
              status: "done" as const,
              url: item.photo,
              preview: item.photo,
              fromServer: true,
            })) : [];

            setPhotos([...serverSelf, ...serverBank, ...serverAi]);
          } else {
            message.error("No self images found.");
          }
        } catch (error) {
          message.error("Error fetching uploaded images.");
        }
      };
      fetchImageUpdate();
    }
  }, [storedDealId]);

  const handleFileChange = ({ fileList }: UploadChangeParam<UploadFile>): void => {
    const newFiles: AntdUploadFile[] = fileList
      .filter((file:any) => file.originFileObj)
      .map((file:any) => ({
        ...file,
        preview: URL.createObjectURL(file.originFileObj!),
        fromServer: false,
      } as AntdUploadFile));

    setPhotos((prev) => [...prev.filter((p) => (p as any).fromServer), ...newFiles]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (
      !dealId ||
      (photos.length === 0 && !generatedImage && !selectedImageBankId)
    ) {
      setResponseMessage(
        "Please provide a Deal ID and select at least one image."
      );
      return;
    }

    const formData = new FormData();
    formData.append("Deals_id", dealId);
    
    photos.forEach((photo, index) => {
      if (!(photo as any).fromServer && photo.originFileObj) {
        formData.append(`photos[${index}]`, photo.originFileObj);
      }
    });

    if (generatedImage) {
      formData.append("ai_photos", generatedImage);
    }
    if (selectedImageBankId) {
      formData.append("imagebank_id", selectedImageBankId.toString());
    }

    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${apiUrl}/Front/AddUploadImage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResponseMessage(
        response.data.message || "Photos uploaded successfully."
      );
      message.success(response.data.message || "Photos uploaded successfully.");
    } catch (error) {
      setResponseMessage("Failed to upload photos.");
      message.error("Failed to upload photos.");
    }
  };

  const generateImage = async (): Promise<void> => {
    if (!searchPrompt) {
      message.warning("Please enter a prompt to generate an image.");
      return;
    }

    setLoading(true);

    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${apiUrl}/generate-image`,
        { prompt: searchPrompt }
      );

      if (response.data.image_url) {
        setGeneratedImage(response.data.image_url);
      } else {
        message.error("Failed to generate image.");
      }
    }  catch (error) {
      message.error("Error generating image.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      photos.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview as string);
        }
      });
    };
  }, [photos]);

  const handleRemoveImage = (fileToRemove: AntdUploadFile): void => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.uid !== fileToRemove.uid)
    );

    if ((fileToRemove as any).fromServer) {
      const dealImageId = fileToRemove.uid?.replace("server-", "");

      if (dealImageId) {
        axios
          .post(`${apiUrl}/Front/dealimagedelete`, {
            Dealimage_id: parseInt(dealImageId),
          })
          .then((res: AxiosResponse<ApiResponse>) => {
            if (res.data.success) {
              message.success(res.data.message || "Image deleted successfully.");
            } else {
              message.error(
                res.data.message || "Failed to delete image from server."
              );
            }
          })
          .catch(() => {
            message.error("Error deleting image from server.");
          });
      }
    }
  };

  return (
    <div
      style={{
        padding: 20,
        margin: "auto",
        borderRadius: 10,
        maxWidth: 1000,
      }}
    >
      <Row gutter={16} justify="center">
        <Col lg={24} xs={24} sm={12}>
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              height: "100%",
            }}
          >
            <Form layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16} className="align-items-center">
                <Col xs={24} md={10} className="bn-none">
                  <Card style={{ padding: 20, borderRadius: 8 }}>
                    <h3 className="ph-txt">Select Photos from Gallery</h3>
                    <div className="d-flex align-items-baseline">
                      <Form.Item className="mb-0">
                        <Upload
                          multiple
                          beforeUpload={() => false}
                          onChange={handleFileChange}
                          fileList={photos}
                          accept="image/*"
                        >
                          <Button icon={<UploadOutlined />}>
                            Select Photos
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={14} className="bn-none">
                  <Card
                    style={{
                      background: "white",
                      padding: 20,
                      borderRadius: 8,
                      height: "100%",
                    }}
                  >
                    <h3 className="ph-txt">Generate AI Image</h3>
                    <Row gutter={8} justify="center">
                      <Col span={16}>
                        <Input
                          placeholder="Enter image prompt"
                          value={searchPrompt}
                          onChange={(e) => setSearchPrompt(e.target.value)}
                          prefix={<SearchOutlined />}
                        />
                      </Col>
                      <Col span={8}>
                        <Button
                          className="main-btn"
                          onClick={generateImage}
                          style={{ width: "100%" }}
                          loading={loading}
                        >
                          Generate
                        </Button>
                      </Col>
                    </Row>

                    {(loading || generatedImage) && (
                      <Card
                        hoverable
                        style={{
                          marginTop: 20,
                          textAlign: "center",
                          borderRadius: 10,
                          height: 240,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loading ? (
                          <Skeleton.Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 10,
                            }}
                            active
                          />
                        ) : (
                          generatedImage && (
                            <img
                              src={generatedImage}
                              alt="AI Generated"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                borderRadius: 10,
                                objectFit: "contain",
                              }}
                            />
                          )
                        )}
                      </Card>
                    )}
                  </Card>
                </Col>
              </Row>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 16,
                }}
              >
                {photos.map((file, index) => (
                  <div
                    key={file.uid || index}
                    style={{ position: "relative", width: 100, height: 100 }}
                  >
                    <img
                      src={(file.preview || file.url) as string}
                      alt={`preview-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #d9d9d9",
                      }}
                    />
                    <CloseCircleFilled
                      onClick={() => handleRemoveImage(file)}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        fontSize: 18,
                        color: "red",
                        background: "#fff",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    />
                    {(file as any).fromServer && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 2,
                          left: 2,
                          background: "#fff",
                          fontSize: 10,
                          padding: "2px 4px",
                          borderRadius: 4,
                        }}
                      >
                        Uploaded
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <Form.Item className="mt-5">
                <h3 className="mb-4 ph-txt">Select from Photo Bank</h3>
                <Row gutter={[16, 16]}>
                  {imageBank.map((image) => (
                    <Col
                      className="bn-none"
                      key={image.id}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={6}
                    >
                      <Card
                        className="d-flex justify-content-center"
                        hoverable
                        style={{
                          cursor: "pointer",
                          border:
                            selectedImageBankId === image.id
                              ? "2px solid #2a2247"
                              : "1px solid #000",
                        }}
                        onClick={() => setSelectedImageBankId(image.id)}
                      >
                        <img
                          className="mx-auto"
                          src={image.image_url}
                          alt={image.category}
                          style={{
                            width: "100%",
                            height: "150px",
                            objectFit: "cover",
                            margin: "0 auto",
                          }}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Form.Item>

              <Space>
                <Button
                  className="main-btn"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Upload
                </Button>
              </Space>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FileUpload;
