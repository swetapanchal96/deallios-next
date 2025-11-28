"use client";

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import "./CouponsSlider.css";

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3.5,
  slidesToScroll: 1,
  autoplay: false,
  arrows: false,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 2440,
      settings: {
        slidesToShow: 3.5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 3.5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2.5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1.8,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.5,
        slidesToScroll: 1,
      },
    },
  ],
};

const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const CouponsSlider = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(
          "https://getdemo.in/pricecut/api/Front/FrontPromocodelist",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        if (result.success) setCoupons(result.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <section className="coupon-section">
      <div
        className="container bg-1 new-b12"
        style={{ border: "2px solid #343a40" }}
      >
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h5 mb-0 text-gray-900">🔥 Trending Coupons</h1>
          <a
            className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm text-white"
            href="/trandingcoupns"
          >
            <i className="fas fa-eye fa-sm text-white-50"></i> Trending View
          </a>
        </div>

        <div className="slider-controls">
          <button
            className="prev-btn"
            onClick={() => sliderRef.current?.slickPrev()}
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            className="next-btn"
            onClick={() => sliderRef.current?.slickNext()}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton-card">
                <Skeleton variant="rectangular" width="100%" height={200} />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </div>
            ))}
          </div>
        ) : (
          <Slider ref={sliderRef} {...sliderSettings}>
            {coupons.map((coupon) => (
              <div key={coupon.promo_id}>
                <img
                  className="coupon-image"
                  src={coupon.pro_img || "https://via.placeholder.com/150"}
                  alt={coupon.promo_name}
                  onClick={() =>
                    router.push(`/promocode_detail/${coupon.GUID}`)
                  }
                />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default CouponsSlider;
