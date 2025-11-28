'use client';

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

function OffersBottom() {
  const [imgoffer, setImageOffer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post("https://getdemo.in/pricecut/api/Front/OfferImageDisaplay")
      .then((res) => {
        // Filter the offers based on is_align === 2
        const filteredOffers = res.data.data.filter(
          (image:any) => image.is_align === 2
        );
        setImageOffer(filteredOffers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section-padding homepage-store-block">
      <div className="container">
        <div className="row bg-1">
          {loading
            ? [...Array(2)].map((_, index) => (
                <div className="col-12 col-md-6 col-lg-6" key={index}>
                  <div className="offer-box">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={200}
                    />
                  </div>
                </div>
              ))
            : imgoffer.map((image:any, index) => (
                <div className="col-12 col-md-6 col-lg-6" key={index}>
                  <div
                    className="offer-box"
                    style={{ backgroundColor: "#fef3e4" }}
                  >
                    <img
                      className="img-fluid"
                      src={image.offer_image}
                      alt={`Offer ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default OffersBottom;
