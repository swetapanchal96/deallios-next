"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./additional_consideration.css"; 
import { apiUrl } from "@/config";

// 👉 Type for API response
interface CmsData {
  strTitle: string;
  strDescription: string;
}

export default function AdditionalConsideration() {
  const [cmsData1, setCmsData1] = useState<CmsData | null>(null);
  const [loading1, setLoading1] = useState(true);
  const [error1, setError1] = useState<string | null>(null);

  useEffect(() => {
    axios
      .post(`${apiUrl}/Front/Cmschange`, { id: "2" })
      .then((response) => {
        if (response.data.success) {
          setCmsData1(response.data.data);
        } else {
          setError1("Failed to load Additional Consideration content.");
        }
      })
      .catch(() => {
        setError1("An error occurred while fetching the content.");
      })
      .finally(() => {
        setLoading1(false);
      });
  }, []);

  if (loading1)
    return <div className="centered-riple">Loading...</div>;

  if (error1) return <p style={{ color: "red" }}>{error1}</p>;

  return (
    <div className="terms-container">
      {/* Title */}
      <h1>{cmsData1?.strTitle || "Additional Considerations"}</h1>

      {/* Dynamic HTML Content */}
      <div
        className="terms-content"
        dangerouslySetInnerHTML={{ __html: cmsData1?.strDescription || "" }}
      />
    </div>
  );
}
