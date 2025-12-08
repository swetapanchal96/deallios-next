'use client';

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Skeleton, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "react-slick"; // Make sure to install: npm i react-slick slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { apiUrl } from "@/config";

const DEFAULT_LAT: number = 23.0225; // Ahmedabad latitude
const DEFAULT_LONG: number = 72.5714; // Ahmedabad longitude

const sliderSettings = {
  dots: true,
  arrows: true,
  infinite: true,
  autoplay: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  margin: 0,
} as const;

interface Image {
  photo: string;
}

interface Option {
  discount_percentage: number | null;
  regular_price: number | null;
  pricecut_price: number | null;
}

interface Vendor {
  latitude: number;
  longitude: number;
  vendoraddress: string;
}

interface Store {
  Deals_id: string | number;
  GUID: string;
  deals_slug: string;
  business_type: string;
  main_title: string;
  average_rating?: number;
  images: Image[];
  options: Option[];
  vendor: Vendor | null;
}

interface UserLatLong {
  lat: number;
  long: number;
}

const TopStores: React.FC = () => {
  const sliderRef = useRef<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [userLatLong, setUserLatLong] = useState<UserLatLong | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  // Get stored location safely
  let storeLocation: { vendor?: { latitude?: number; longitude?: number } } | null = null;
  try {
    const stored = localStorage?.getItem("userLatLong");
    if (stored) {
      storeLocation = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error parsing stored location:", error);
  }

  const fetchDealsData = async (lat: number, long: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/Front/Dealsearch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: "",
          lat,
          long,
          category: "",
          subcategory: "",
          state: "",
          city: "",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStores(result.data || []);
      } else {
        console.error("Failed to fetch deals data");
        setStores([]);
      }
    } catch (error) {
      console.error("Error fetching deals data:", error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const toRad = (value: number): number => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    return distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} Km`;
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          const userLocation: UserLatLong = { lat: latitude, long: longitude };
          setUserLatLong(userLocation);
          localStorage.setItem("userLatLong", JSON.stringify(userLocation));

          fetchDealsData(latitude, longitude);

          // Calculate distance if store location exists
          if (storeLocation?.vendor?.latitude && storeLocation?.vendor?.longitude) {
            const calculatedDistance = calculateDistance(
              userLocation.lat,
              userLocation.long,
              storeLocation.vendor.latitude,
              storeLocation.vendor.longitude
            );
            setDistance(calculatedDistance);
          }
        },
        (error) => {
          console.warn("Location access denied. Using default location.");
          setLatitude(DEFAULT_LAT);
          setLongitude(DEFAULT_LONG);
          setUserLatLong(null);
          fetchDealsData(DEFAULT_LAT, DEFAULT_LONG);
          setDistance(null);
        }
      );
    } else {
      console.error("Geolocation is not supported.");
      setLatitude(DEFAULT_LAT);
      setLongitude(DEFAULT_LONG);
      setUserLatLong(null);
      fetchDealsData(DEFAULT_LAT, DEFAULT_LONG);
      setDistance(null);
    }
  }, []);

  const sliderRefs = useMemo(() => {
    return stores.reduce((acc: Record<string, React.RefObject<any>>, store: Store) => {
      acc[store.Deals_id as string] = React.createRef();
      return acc;
    }, {});
  }, [stores]);

  if (loading) {
    return (
      <section className="section-padding homepage-view-offers topstores">
        <div className="container">
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h5 mb-0 text-gray-900">Top stores</h1>
          </div>
          <div className="row">
            {[...new Array(9)].map((_, index) => (
              <div key={index} className="col-xl-4 col-sm-6 custom-card-block">
                <Box sx={{ borderRadius: 1, overflow: "hidden" }}>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <Box sx={{ padding: 2 }}>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="50%" />
                  </Box>
                </Box>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding homepage-view-offers topstores">
      <div className="container">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h5 mb-0 text-gray-900">Top stores</h1>
        </div>
        <div className="row">
          {stores.map((store) => {
            const discountPercentage =
              store.options && store.options.length > 0
                ? store.options[0].discount_percentage
                : null;
            const distance =
              userLatLong && store.vendor?.latitude && store.vendor?.longitude
                ? calculateDistance(
                  userLatLong.lat,
                  userLatLong.long,
                  store.vendor.latitude,
                  store.vendor.longitude
                )
                : null;
            const regularPrice = store.options[0]?.regular_price || null;
            const dealPrice = store.options[0]?.pricecut_price || null;
            return (
              <div key={store.Deals_id} className="col-xl-4 col-sm-6 custom-card-block">
                <div className="custom-card border rounded shadow-sm overflow-hidden">
                  <div className="position-relative">
                    <div className="slider-wrapper position-relative">
                      {store.images.length > 1 ? (
                        <>
                          <Slider ref={sliderRefs[store.Deals_id as string]} {...sliderSettings}>
                            {store.images.map((item, index) => (
                              <div key={index} className="deal-slide-card">
                                <div className="card-image-container">
                                  <Link href={`/deal/${store.GUID}`} title={store.deals_slug}>
                                    <img
                                      src={item.photo || "/images/placeholder.png"}
                                      alt={store.business_type}
                                      className="img-fluid"
                                    />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </Slider>
                          <button
                            className="slider-btn prev"
                            onClick={() => sliderRefs[store.Deals_id as string]?.current?.slickPrev()}
                            type="button"
                          >
                            <i className="fa fa-chevron-left"></i>
                          </button>
                          <button
                            className="slider-btn next"
                            onClick={() => sliderRefs[store.Deals_id as string]?.current?.slickNext()}
                            type="button"
                          >
                            <i className="fa fa-chevron-right"></i>
                          </button>
                        </>
                      ) : (
                        <div className="deal-slide-card">
                          <div className="card-image-container">
                            <Link href={`/deal/${store.GUID}`} title={store.deals_slug}>
                              <img
                                src={
                                  store.images[0]?.photo || "/images/placeholder.png"
                                }
                                alt={store.business_type}
                                className="img-fluid"
                              />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add card content here - uncomment and adapt the commented JSX from original */}
                  <div className="p-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <p className="brand mb-0" style={{ textTransform: "capitalize" }}>
                        {store.business_type}
                      </p>
                      <div className="st-icon d-flex align-items-center gap-1">
                        <i className="fa-solid fa-star"></i>
                        <span>{(store.average_rating || 3.5).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="mb-2">
                          <Link
                            href={`/deal/${store.GUID}`}
                            className="fw-bold title-txt"
                            title={store.deals_slug}
                            style={{ textTransform: "capitalize" }}
                          >
                            {store.main_title}
                          </Link>
                        </h6>

                        <p className="address mb-2" style={{ textTransform: "capitalize" }}>
                          {store.vendor?.vendoraddress}
                        </p>

                      </div>

                      {distance && (
                        <div className="deal-location mb-2">
                          <i className="fa-solid fa-location-dot icon-margin"></i> {distance}
                        </div>
                      )}

                    </div>
                    {discountPercentage !== null && (
                      <span
                        className="badge position-absolute top-0 end-0 m-2"
                        style={{
                          backgroundColor: "#00ff00",
                          fontSize: "0.8rem",
                          color: "#000",
                        }}
                      >
                        -{discountPercentage}%
                      </span>
                    )}

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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopStores;
