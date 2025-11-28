"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./terms_condition.css"; // <-- update path based on your folder
import { apiUrl } from '@/config';

interface CmsData {
    strTitle:string;
    strDescription:string
}

export default function TermsConditions() {
  const [cmsData, setCmsData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .post(`${apiUrl}/Front/Cmschange`, { id: "1" })
      .then((response) => {
        if (response.data.success) {
          setCmsData(response.data.data);
        } else {
          setError("Failed to load Terms & Conditions.");
        }
      })
      .catch(() => {
        setError("An error occurred while fetching content.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="centered-riple">
        {/* Add your loader component here */}
        Loading...
      </div>
    );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="terms-container">
      {/* Title */}
      <h1>{cmsData?.strTitle || "Terms & Conditions"}</h1>

      {/* Render HTML safely */}
      <div
        className="terms-content"
        dangerouslySetInnerHTML={{ __html: cmsData?.strDescription || "" }}
      />
    </div>
  );
}
