import { useState, useEffect, useMemo, useRef } from "react";
import { Skeleton, Box, Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import Slider from "react-slick";

const DEFAULT_LAT = 23.0225; // Ahmedabad latitude
const DEFAULT_LONG = 72.5714; // Ahmedabad longitude
const sliderSettings = {
  dots: true,
  arrows: true,
  infinite: true,
  autoplay: true,
  speed: 1000,
  slidesToShow: 1,
  slidesToScroll: 1,
  margin: 0,
};

type UserLatLong = {
  lat: number;
  long: number;
};


export default function TopStores() {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();
  const [userLatLong, setUserLatLong] = useState<UserLatLong | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const store = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("userLatLong")) : null;

  // Function to fetch deals data from the API
  const fetchDealsData = async (lat:any, long:any) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://getdemo.in/pricecut/api/Front/Dealsearch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Title: "",
            lat: lat,
            long: long,
            category: "",
            subcategory: "",
            state: "",
            city: "",
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setStores(result.data);
      } else {
        console.error("Failed to fetch deals data");
      }
    } catch (error) {
      console.error("Error fetching deals data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(stores.length / itemsPerPage);
  const paginatedStores = stores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);

          const userLocation = { lat: latitude, long: longitude };
          setUserLatLong(userLocation);

          fetchDealsData(latitude, longitude);

          if (store?.vendor?.latitude && store?.vendor?.longitude) {
            const calculatedDistance = calculateDistance(
              userLocation.lat,
              userLocation.long,
              store.vendor.latitude,
              store.vendor.longitude
            );
            setDistance(calculatedDistance);
          }
        },
        () => {
          console.warn("Location access denied. Using default location.");
          setLatitude(DEFAULT_LAT);
          setLongitude(DEFAULT_LONG);
          setUserLatLong(null);
          fetchDealsData(DEFAULT_LAT, DEFAULT_LONG);
          setDistance(null);
        }
      );
    } else if (typeof window !== "undefined") {
      console.error("Geolocation is not supported.");
      setLatitude(DEFAULT_LAT);
      setLongitude(DEFAULT_LONG);
      setUserLatLong(null);
      fetchDealsData(DEFAULT_LAT, DEFAULT_LONG);
      setDistance(null);
    }
  }, []);

  const calculateDistance = (lat1:any, lon1:any, lat2:any, lon2:any) => {
    const toRad = (value:any) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    return distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${distanceKm.toFixed(1)} Km`;
  };

  const sliderRefs = useRef({});

  useEffect(() => {
    // initialize refs for each store when stores changes
    const refs = {};
    stores.forEach(store => {
      refs[store.Deals_id] = React.createRef();
    });
    sliderRefs.current = refs;
  }, [stores]);

  return (
    <section className="section-padding homepage-view-offers topstores">
      <div className="container bg-2 new-b12">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h5 mb-0 text-gray-900">See All Deals</h1>
          <Link href="#" passHref>
            <a className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm text-white">
              <i className="fas fa-eye fa-sm text-white-50"></i> View All
            </a>
          </Link>
        </div>

        <div className="row p-0">
          {loading
            ? [...new Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="col-xl-4 col-sm-6 custom-card-block"
                >
                  <Box sx={{ borderRadius: 1, overflow: "hidden" }}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                    <Box sx={{ padding: 2 }}>
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="50%" />
                    </Box>
                  </Box>
                </div>
              ))
            : paginatedStores.map((store:any) => {
                const dist =
                  userLatLong &&
                  store.vendor?.latitude &&
                  store.vendor?.longitude
                    ? calculateDistance(
                        userLatLong.lat,
                        userLatLong.long,
                        store.vendor.latitude,
                        store.vendor.longitude
                      )
                    : null;
                const discountPercentage =
                  store.options && store.options.length > 0
                    ? store.options[0].discount_percentage
                    : null;
                const regularPrice = store.options[0]?.regular_price || null;
                const dealPrice = store.options[0]?.pricecut_price || null;

                return (
                  <div
                    key={store.Deals_id}
                    className="col-xl-4 col-sm-6 custom-card-block"
                  >
                    <div className="custom-card border rounded shadow-sm overflow-hidden">
                      <div className="position-relative">
                        <div className="slider-wrapper position-relative">
                          {store.images.length > 1 ? (
                            <>
                              <Slider
                                ref={sliderRefs.current[store.Deals_id]}
                                {...sliderSettings}
                              >
                                {store.images.map((item:any, index:any) => (
                                  <div key={index} className="deal-slide-card">
                                    <div className="card-image-container">
                                      <img
                                        src={item.photo || "/images/placeholder.png"}
                                        alt={store.business_type}
                                        className="img-fluid"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </Slider>

                              <button
                                className="slider-btn prev"
                                onClick={() =>
                                  sliderRefs.current[store.Deals_id]?.current?.slickPrev()
                                }
                              >
                                <i className="fa fa-chevron-left"></i>
                              </button>

                              <button
                                className="slider-btn next"
                                onClick={() =>
                                  sliderRefs.current[store.Deals_id]?.current?.slickNext()
                                }
                              >
                                <i className="fa fa-chevron-right"></i>
                              </button>
                            </>
                          ) : (
                            <div className="deal-slide-card">
                              <div className="card-image-container">
                                <img
                                  src={
                                    store.images[0]?.photo || "/images/placeholder.png"
                                  }
                                  alt={store.business_type}
                                  className="img-fluid"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-2">
                        <div className="custom-card-body justify-content-between">
                          <div className="d-flex align-items-center justify-content-between">
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
                              <h6>
                                <a
                                  className="fw-bold title-txt"
                                  title={store.deals_slug}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`/deal/${store.GUID}`);
                                  }}
                                  style={{ textTransform: "capitalize", cursor: "pointer" }}
                                >
                                  {store.main_title}
                                </a>
                              </h6>
                              <p className="address" style={{ textTransform: "capitalize" }}>
                                {store.vendor?.vendoraddress}
                              </p>
                            </div>
                            <div>
                              {dist && (
                                <div className="deal-location">
                                  <i className="fa-solid fa-location-dot icon-margin"></i> {dist}
                                </div>
                              )}
                            </div>
                          </div>

                          {discountPercentage !== null && (
                            <span
                              className="badge position-absolute top-0 end-0 m-2"
                              style={{ backgroundColor: "#00ff00", fontSize: "0.8rem", color: "#000" }}
                            >
                              -{discountPercentage}%
                            </span>
                          )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center gap-3">
                          <div>
                            <div className="d-flex align-items-center gap-2 mt-1">
                              <span className="text-decoration-line-through fw-bold">
                                ₹{store.options[0]?.pricecut_price || "N/A"}
                              </span>
                              {regularPrice && (
                                <p style={{ color: "green" }} className="mb-0 fw-bold">
                                  ₹{regularPrice}
                                </p>
                              )}
                            </div>
                            {dealPrice && (
                              <p style={{ color: "#7E40B2" }} className="mb-0 fw-bold fs-6">
                                ₹{dealPrice}
                              </p>
                            )}
                          </div>
                          <a
                            href="#"
                            className="btn btn-sm"
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

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
            />
          </div>
        )}
      </div>
    </section>
  );
}
