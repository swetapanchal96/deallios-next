import React, { useEffect, useState } from "react";
import { Card, Row, Col, Carousel, Spin, Typography, Button, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import placeholderImage from '@/app/assets/No_Image_Available.jpg'
import Image from "next/image";
import { apiUrl } from "@/config";

const { Title, Text } = Typography;

interface Option {
  option_title: string;
  regular_price: string;
  pricecut_price: string;
}

interface DealData {
  main_title?: string;
  deal_description?: string;
  business_website?: string;
  business_type?: string;
  images?: { photo: string }[];
  options?: Option[];
  deal_address?: string;
  Is_publish?: number;
}

interface VoucherInstructionProps {
  onNext: () => void;
  onPrevious: () => void;
}

const EditDeal: React.FC<VoucherInstructionProps> = ({onNext, onPrevious}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [dealId, setDealId] = useState<string | null>(null);

  const router = useRouter();

//   const placeholderImage = "@/app/assets/No_Image_Available.jpg";

  useEffect(() => {
    const savedDealsId = window.localStorage.getItem("deal_id");
    if (savedDealsId) {
      setDealId(savedDealsId);
      fetchDealDetails(savedDealsId);
    }
  }, []);

  const fetchDealDetails = async (savedDealsId: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/Front/Deallist`, {
        Deals_id: savedDealsId,
      });
      if (response.data.success) {
        setDealData(response.data.data);
      } else {
        message.error("Failed to fetch deal details.");
      }
    } catch (error) {
      message.error("An error occurred while fetching deal details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPublish = async () => {
    if (!dealId) {
      message.error("Deal ID is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/Front/DealPublish`, {
        Deals_id: dealId,
      });
      if (response.data.success) {
        message.success("Deal published successfully!");
        setTimeout(() => {
          setDealData(null);
          router.push("/manage_deal");
        }, 3000);
      } else {
        message.error("Failed to publish the deal.");
      }
    } catch (error) {
      message.error("An error occurred while publishing the deal.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card
         variant="borderless"
        style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Carousel autoplay>
              {(dealData?.images?.length ? dealData.images : [{ photo: placeholderImage }]).map(
                (image, index) => (
                  <div key={index}>
                    <Image
                      src={ image.photo || placeholderImage}
                      alt={`Product ${index + 1}`}
                      style={{ width: "100%", objectFit: "cover", borderRadius: "10px" }}
                    />
                  </div>
                )
              )}
            </Carousel>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ paddingLeft: "10px" }}>
              <Title level={3}>{dealData?.main_title || "N/A"}</Title>

              <Title level={4} style={{ marginTop: "0px" }}>
                Highlight
              </Title>
              <div
                className="mb-0 sc-p"
                dangerouslySetInnerHTML={{ __html: dealData?.deal_description || "N/A" }}
              />

              <Title level={4} style={{ marginTop: "10px" }}>
                Business Website
              </Title>
              <Text>
                <a
                  href={dealData?.business_website || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dealData?.business_website || "N/A"}
                </a>
              </Text>

              <Title level={4} style={{ marginTop: "20px" }}>
                Business Type
              </Title>
              <Text>{dealData?.business_type || "N/A"}</Text>

              <div style={{ marginTop: "10px" }}>
                <Title level={4}>About This Deal</Title>
                {dealData?.options?.map((option, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <Text>
                      {option.option_title || "N/A"}:{" "}
                      <span style={{ textDecoration: "line-through", color: "gray" }}>
                        {option.regular_price || "N/A"}
                      </span>{" "}
                      - {option.pricecut_price || "N/A"}
                    </Text>
                  </div>
                ))}
              </div>

              <Title level={4} style={{ marginTop: "10px" }}>
                Deal Address
              </Title>
              <Text>{dealData?.deal_address || "N/A"}</Text>

              <div className="mt-3">
                {dealData?.Is_publish === 0 && (
                  <Button
                    className="main-btn"
                    onClick={handleSaveAndPublish}
                    loading={loading}
                    disabled={loading}
                    style={{ marginTop: "0px" }}
                  >
                    Publish
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default EditDeal;
