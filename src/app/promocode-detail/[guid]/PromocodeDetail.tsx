'use client';

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Button, Paper, Skeleton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import Image from "next/image";
import { apiUrl } from "@/config";

// Type definitions
interface PromoData {
  pro_img: string;
  dis_per: number | string;
  link: string;
  code: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface ApiResponse {
  success: boolean;
  data: PromoData;
  error?: string;
}

const PromoCard = ({ guid }: { guid: string }) => {
//   const params = useParams();
//   const GUID = params?.GUID as string;
 const GUID = guid;
 console.log(GUID,"dffsjdfs");
 
  
  const [copied, setCopied] = useState<boolean>(false);
  const [promoData, setPromoData] = useState<PromoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        if (!GUID) {
          setError("GUID is missing in the URL");
          setLoading(false);
          return;
        }

        console.log("Extracted GUID from URL:", GUID);

        const response = await axios.post<ApiResponse>(
          `${apiUrl}/Front/PromocodeDetail`,
          { GUID },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          setPromoData(response.data.data);
        } else {
          setError(response.data.error || "Invalid Promo Code");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Error fetching promo details");
      } finally {
        setLoading(false);
      }
    };

    fetchPromoData();
  }, [GUID]);

  const handleCopy = () => {
    if (promoData?.code) {
      navigator.clipboard.writeText(promoData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <section
        className="pt-5 pb-5 sm-pad20"
        style={{ backgroundColor: "aliceblue" }}
      >
        <Paper
          elevation={3}
          sx={{
            maxWidth: 550,
            margin: "auto",
            padding: 3,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ marginBottom: 2 }}
          />
          <Skeleton variant="text" width="60%" sx={{ marginBottom: 2 }} />
          <Skeleton variant="text" width="40%" />
        </Paper>
      </section>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!promoData) {
    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
        <Typography color="error">No promo data available</Typography>
      </Box>
    );
  }

  const formatLink = (link: string): string => {
    if (!link) return "#";
    if (link.startsWith("http://") || link.startsWith("https://")) {
      return link;
    }
    return `https://${link}`;
  };

  return (
    <section
      className="pt-5 pb-5 sm-pad20"
      style={{ backgroundColor: "aliceblue" }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 550,
          margin: "auto",
          padding: 3,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {promoData.pro_img && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 200,
              marginBottom: 2,
            }}
          >
            <Image
              src={promoData.pro_img}
              alt="Promotion"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, 550px"
            />
          </Box>
        )}

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Flat {promoData.dis_per}% Off
        </Typography>
        
        <Typography
          variant="body1"
          component="a"
          href={formatLink(promoData.link)}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ 
            textDecoration: "none", 
            display: "block", 
            marginBottom: 2,
            color: 'primary.main',
            '&:hover': {
              textDecoration: 'underline',
            }
          }}
        >
          Go To Website
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Use code at checkout.
        </Typography>

        {/* Fixed section using Box instead of Grid */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            border: "2px dashed #ccc",
            borderRadius: 2,
            padding: 2,
            marginY: 2,
            backgroundColor: "#f8f8f8",
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
             sx={{ color: "#000", fontWeight: "700", letterSpacing: 0.5 }}
          >
            CODE: {promoData.code}
          </Typography>
          <Button
            variant="contained"
            className="auth-btn"
            startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
            onClick={handleCopy}
            sx={{ 
              minWidth: 100,
              backgroundColor: copied ? 'success.main' : 'error.main',
              '&:hover': {
                backgroundColor: copied ? 'success.dark' : 'error.dark',
              }
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </Box>

        <Box textAlign="left" sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Flat {promoData.dis_per}% Off
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="div"
          >
            <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
              <li>{promoData.description}</li>
              <li>Offer starts on {promoData.start_date}</li>
              <li>Offer ends on {promoData.end_date}</li>
              <li>Use this coupon code at checkout.</li>
              <li>Offer valid for a limited time.</li>
            </ul>
          </Typography>
        </Box>
      </Paper>
    </section>
  );
};

export default PromoCard;