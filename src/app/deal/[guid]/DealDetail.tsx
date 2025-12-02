"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Skeleton, Snackbar, Alert, Box } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import "./DealDetail.css";
import "./WiningEffect.css";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface DealImage {
  Dealimage_id: number;
  photo: string;
}

interface DealOption {
  deal_option_id: number;
  option_title: string;
  regular_price: number;
  pricecut_price: number;
  monthly_voucher_cap: number;
}

interface DealData {
  main_title: string;
  deal_description: string;
  business_type: string;
  business_website: string;
  deal_address: string;
  Map_link: string;
  business_desc: string;
  images: DealImage[];
  options: DealOption[];
}

interface RelatedDeal {
  Deals_id: number;
  GUID: string;
  deals_slug: string;
  main_title: string;
  business_type: string;
  vendor?: { vendoraddress?: string };
  images: DealImage[];
  options: DealOption[];
  average_rating?: number;
}

export default function DealDetail({ guid }: { guid: string }) {
  const params = useParams();
  const GUID = params?.guid as string;
  const [deal, setDeal] = useState<DealData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"info" | "error" | "success">("info");
  const [relatedProduct, setRelatedProduct] = useState<RelatedDeal[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  const router = useRouter();

  const fetchDealDetail = async () => {
    try {
      const response = await fetch(
        "https://getdemo.in/pricecut/api/Front/DealDetail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ GUID: GUID }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setDeal(result.data);
        setRelatedProduct(result.related_deals);
      }
    } catch (error) {
      console.error("Error fetching deal details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealDetail();
  }, [guid]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const customerGUID = localStorage.getItem("Customer_GUID");
    const token = localStorage.getItem("token");

    if (!customerGUID || !token) {
      setSnackbarMessage("Please log in to subscribe to this deal.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    try {
      const response = await fetch(
        "https://getdemo.in/pricecut/api/customersubscribedeal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            GUID: GUID,
            Customer_GUID: customerGUID,
            deal_option_id: selectedOption,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setIsWinner(true);
        setPopupOpen(true);

        setTimeout(() => {
          setPopupOpen(false);
          setIsWinner(false);
          router.push("/mycoupons");
        }, 8000);
      } else {
        setSnackbarMessage(result.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch {
      setSnackbarMessage("Something went wrong!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  if (loading) {
    return (
      <section className="mt-5 mb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <Skeleton variant="rectangular" width="100%" height={400} />
            </div>
            <div className="col-lg-4">
              <Skeleton variant="rectangular" height={300} />
              <Skeleton className="mt-3" height={50} />
              <Skeleton className="mt-2" height={50} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!deal) return <p>No deal found.</p>;

  const mainImageSettings = {
    dots: deal.images.length > 1,
    arrows: deal.images.length > 1,
    infinite: deal.images.length > 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    beforeChange: (_: number, next: number) => setMainImageIndex(next),
  };

  const thumbnailSettings = {
    slidesToShow: 4,
    focusOnSelect: true,
    infinite: deal.images.length > 1,
    centerPadding: "0",
  };

  return (
    <>
      <section className="mt-5 overflow-hidden">
        <div className="container">
          <div className="row">
            {/* LEFT: Images */}
            <div className="col-lg-8">
              {deal.images && deal.images.length > 0 ? (
                <div className="deal-images-slider">
                  <Slider
                    {...mainImageSettings}
                    arrows={deal.images.length > 1} // Show arrows only if multiple images
                    dots={deal.images.length > 1} // Show dots only if multiple images
                    infinite={deal.images.length > 1} // Loop only if multiple images
                  >
                    {deal.images.map((image) => (
                      <div key={image.Dealimage_id}>
                        <img
                          src={image.photo}
                          alt={`Deal Image ${image.Dealimage_id}`}
                          className="deal-image"
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <p>No images available.</p>
              )}
              {/* Thumbnails */}
              {deal.images.length > 0 && (
                <div className="thumbnail-slider">
                  <Slider
                    {...thumbnailSettings}
                    arrows={deal.images.length > 1} // Show arrows only if multiple thumbnails
                    infinite={deal.images.length > 1} // Loop only if multiple thumbnails
                  >
                    {deal.images.map((image, index) => (
                      <div
                        className="s-gap"
                        key={image.Dealimage_id}
                        onClick={() => setMainImageIndex(index)}
                      >
                        <img
                          src={image.photo}
                          alt={`Thumbnail ${image.Dealimage_id}`}
                          className={`thumbnail-image ${mainImageIndex === index ? "active" : ""
                            }`}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}

              <h1 className="mb-4 mt-4">{deal.main_title}</h1>
              <div className="deal-description"
                dangerouslySetInnerHTML={{ __html: deal.deal_description }}
              ></div>

              <h3 className="mt-3">Business Info:</h3>
              <p><strong>Business Type:</strong> {deal.business_type}</p>

              <p>
                <strong>Website: </strong>
                <a href={`https://${deal.business_website}`} target="_blank">
                  {deal.business_website}
                </a>
              </p>

              <p><strong>Address:</strong> {deal.deal_address}</p>

              {deal.Map_link ? (
                <div dangerouslySetInnerHTML={{ __html: deal.Map_link }} />
              ) : (
                <p>Map not available.</p>
              )}

              <div
                dangerouslySetInnerHTML={{ __html: deal.business_desc }}
              ></div>
            </div>

            {/* RIGHT: Options */}
            <div className="col-lg-4">
              <div className="text-center mb-3">
                {" "}
                <h3>Deal Options</h3>
              </div>
              <div className="deal-option-d">
                <form onSubmit={handleSubscribe}>
                  {deal.options.map((opt) => (
                    <div
                      key={opt.deal_option_id}
                      className={`deal-option ${selectedOption === opt.deal_option_id ? "active" : ""}`}
                    >
                      <label className="custom-radio-label">
                        <input
                          type="radio"
                          className="custom-radio"
                          name="deal-option"
                          checked={selectedOption === opt.deal_option_id}
                          onChange={() => setSelectedOption(opt.deal_option_id)}
                        />
                        <span className="custom-radio-circle"></span>
                      </label>

                      <div>
                        <h5>{opt.option_title}</h5>
                        <p><strong>Regular Price:</strong> ₹{opt.regular_price}</p>
                        <p><strong>Price Cut:</strong> ₹{opt.pricecut_price}</p>
                        <p><strong>Monthly Voucher Cap:</strong> {opt.monthly_voucher_cap}</p>
                      </div>
                    </div>
                  ))}

                  <button
                    className="auth-btn w-100 new-w"
                    type="submit"
                    disabled={!selectedOption}
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {popupOpen && (
                <div className="popup-overlay">
                  <div className="popup-content">
                    {isWinner && (
                      <>
                        <Confetti width={window.innerWidth} height={window.innerHeight} />
                        <motion.h1
                          className="text-4xl font-bold text-center"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1.1 }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        >
                          🎉 Congratulations! Deal Subscribed! 🎊
                        </motion.h1>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Deals */}
      <section className="mt-5">
        <h2 className="text-center">Related Deal</h2>
        <div className="container">
          <div className="row">
            <div className="row">
              {relatedProduct.map((store) => {
                const regularPrice =
                  store.options[0]?.regular_price || null;
                const dealPrice = store.options[0]?.pricecut_price || null;
                return (
                  <div
                    key={store.Deals_id}
                    className="col-xl-4 col-sm-6 custom-card-block"
                  >
                    <div className="custom-card border rounded shadow-sm overflow-hidden">
                      <div className="position-relative">
                        <Link
                          href={`/deal/${store.GUID}`}
                          title={store.deals_slug}
                          onClick={() => router.push(`/deal/${store.GUID}`)}
                        >
                          <img
                            className="img-fluid w-100"
                            src={
                              store.images[0]?.photo ||
                              "/images/placeholder.png"
                            }
                            alt={store.business_type}
                            style={{ height: "185px", objectFit: "cover" }}
                          />
                        </Link>
                      </div>

                      <div className="p-2">
                        <div className="custom-card-body justify-content-between">
                          <div className="d-flex align-items-center justify-content-between">
                            <p
                              className="brand mb-0"
                              style={{ textTransform: "capitalize" }}
                            >
                              {store.business_type}
                            </p>
                            <div className="st-icon d-flex align-items-center gap-1">
                              <i className="fa-solid fa-star"></i>
                              <span>
                                {(store.average_rating || 3.5).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="">
                              <h6>
                                <Link
                                  href={`/deal/${store.GUID}`}
                                  className="fw-bold title-txt"
                                  title={store.deals_slug}
                                  onClick={() =>
                                    router.push(`/deal/${store.GUID}`)
                                  }
                                  style={{ textTransform: "capitalize" }}
                                >
                                  {store.main_title}
                                </Link>
                              </h6>
                              <p
                                className="address"
                                style={{ textTransform: "capitalize" }}
                              >
                                {store.vendor?.vendoraddress}
                              </p>
                            </div>
                            <div className="">
                              {/* {distance && (
                                    <div className="deal-location">
                                      <i className="fa-solid fa-location-dot icon-margin"></i>{" "}
                                      {distance}
                                    </div>
                                  )} */}
                            </div>
                          </div>
                          {/* {discountPercentage !== null && (
                                <span
                                  className="badge position-absolute top-0 end-0 m-2"
                                  style={{
                                    backgroundColor: "#00ff00",
                                    fontSize: "0.8rem",
                                    color: "#000", // optional: to ensure text is readable
                                  }}
                                >
                                  -{discountPercentage}%
                                </span>
                              )} */}
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-3">
                          <div>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <span className="text-decoration-line-through fw-bold">
                                ₹{store.options[0]?.pricecut_price || "N/A"}
                              </span>

                              {regularPrice && (
                                <p
                                  style={{ color: "green" }}
                                  className="mb-0 fw-bold"
                                >
                                  ₹{regularPrice}
                                </p>
                              )}
                            </div>

                            {dealPrice && (
                              <p
                                style={{ color: "#7E40B2" }}
                                className="mb-0 fw-bold fs-6"
                              >
                                ₹{dealPrice}
                              </p>
                            )}
                          </div>
                          <a
                            href="#"
                            className="btn btn-sm "
                            style={{
                              background: "#A36DB5",
                              color: "white",
                              fontWeight: "bold",
                              padding: "6px 15px",
                              fontSize: "0.9rem",
                              textDecoration: "none",
                              width: 100,
                            }}
                          >
                            Get Offer
                          </a>
                        </div>

                        {/* Button */}
                      </div>
                    </div>
                  </div>
                )
              }
              )}
            </div>
          </div>
        </div>
      </section>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}
