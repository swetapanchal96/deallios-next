// // "use client";

// // import React, { useState, useEffect } from "react";
// // import Slider from "react-slick";
// // import { Box, Skeleton, Snackbar, Alert } from "@mui/material";
// // import { useParams, useRouter } from "next/navigation";
// // import AOS from "aos";
// // import "aos/dist/aos.css";
// // import Confetti from "react-confetti";
// // import { motion } from "framer-motion";
// // import "./DealDetail.css";
// // import "./WiningEffect.css";
// // import Link from "next/link";

// // // -------- TYPES ----------
// // interface DealImage {
// //   Dealimage_id: number;
// //   photo: string;
// // }

// // interface DealOption {
// //   deal_option_id: number;
// //   option_title: string;
// //   regular_price: number;
// //   pricecut_price: number;
// //   monthly_voucher_cap: number;
// //   discount_percentage?: number;
// // }

// // interface DealVendor {
// //   vendoraddress: string;
// //   latitude?: number;
// //   longitude?: number;
// // }

// // interface DealData {
// //   main_title: string;
// //   deal_description: string;
// //   deal_address: string;
// //   business_type: string;
// //   business_website: string;
// //   business_desc: string;
// //   Map_link: string;
// //   images: DealImage[];
// //   options: DealOption[];
// // }

// // interface RelatedDeal {
// //   Deals_id: number;
// //   GUID: string;
// //   deals_slug: string;
// //   business_type: string;
// //   main_title: string;
// //   average_rating: number;
// //   vendor: DealVendor;
// //   images: { photo: string }[];
// //   options: DealOption[];
// // }

// // // -------- COMPONENT ----------
// // export default function DealDetail({ guid }: { guid: string }) {
// //   const router = useRouter();
// //   const params = useParams();
// //   const GUID = params?.guid as string;
// //   const [deal, setDeal] = useState<DealData | null>(null);
// //   const [relatedProduct, setRelatedProduct] = useState<RelatedDeal[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [mainImageIndex, setMainImageIndex] = useState(0);
// //   const [selectedOption, setSelectedOption] = useState<number | null>(null);

// //   const [snackbarOpen, setSnackbarOpen] = useState(false);
// //   const [snackbarMessage, setSnackbarMessage] = useState("");
// //   const [snackbarSeverity, setSnackbarSeverity] = useState<"info" | "error" | "success">("info");

// //   const [isWinner, setIsWinner] = useState(false);
// //   const [popupOpen, setPopupOpen] = useState(false);

// //   // -------- Fetch Deal Detail ----------
// //   const fetchDealDetail = async () => {
// //     try {
// //       const response = await fetch("https://getdemo.in/pricecut/api/Front/DealDetail", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ GUID: GUID }),
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         setDeal(result.data);
// //         setRelatedProduct(result.related_deals);
// //       }
// //     } catch (error) {
// //       console.error("API Error:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchDealDetail();
// //   }, [guid]);

// //   useEffect(() => {
// //     AOS.init({ duration: 1000, once: false });
// //   }, []);

// //   // -------- Subscribe Handler ----------
// //   const handleSubscribe = async (event: React.FormEvent) => {
// //     event.preventDefault();

// //     const customerGUID = localStorage.getItem("Customer_GUID");
// //     const token = localStorage.getItem("token");

// //     if (!customerGUID || !token) {
// //       setSnackbarMessage("Please log in to subscribe.");
// //       setSnackbarSeverity("error");
// //       setSnackbarOpen(true);

// //       setTimeout(() => router.push("/login"), 2000);
// //       return;
// //     }

// //     try {
// //       const response = await fetch("https://getdemo.in/pricecut/api/customersubscribedeal", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           GUID: guid,
// //           Customer_GUID: customerGUID,
// //           deal_option_id: selectedOption,
// //         }),
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         setPopupOpen(true);
// //         setIsWinner(true);

// //         setTimeout(() => {
// //           router.push("/mycoupons");
// //         }, 8000);
// //       } else {
// //         setSnackbarMessage(result.message);
// //         setSnackbarSeverity("error");
// //         setSnackbarOpen(true);
// //       }
// //     } catch {
// //       setSnackbarMessage("Error subscribing. Try again.");
// //       setSnackbarSeverity("error");
// //       setSnackbarOpen(true);
// //     }
// //   };

// //   const handleCloseSnackbar = () => setSnackbarOpen(false);

// //   if (loading) {
// //     return (
// //       <section className="mt-5 mb-5">
// //         <div className="container">
// //           <div className="row">
// //             <div className="col-lg-8">
// //               <Skeleton variant="rectangular" width="100%" height={400} />
// //             </div>
// //             <div className="col-lg-4">
// //               <Skeleton variant="rectangular" width="100%" height={300} />
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   if (!deal) return <p>No deal found.</p>;

// //   // -------- Slider Settings ----------
// //   const mainImageSettings = {
// //     dots: deal.images.length > 1,
// //     infinite: deal.images.length > 1,
// //     speed: 500,
// //     slidesToShow: 1,
// //     slidesToScroll: 1,
// //     autoplay: true,
// //     autoplaySpeed: 3000,
// //     beforeChange: (current: number, next: number) => setMainImageIndex(next),
// //   };

// //   const thumbnailSettings = {
// //     slidesToShow: 4,
// //     slidesToScroll: 1,
// //     focusOnSelect: true,
// //     centerMode: true,
// //     infinite: deal.images.length > 1,
// //     centerPadding: "0",
// //     speed: 500,
// //   };

// //   return (
// //     <>
// //       {/* MAIN DEAL DETAIL UI (same as your code, no change) */}
// //       <section className="mt-5 overflow-hidden">
// //         <div className="container">
// //           <div className="row">
// //             {/* MAIN CONTENT -------------------------------- */}
// //             <div className="col-lg-8">
// //               <div className="deal-detail">

// //                 <div className="deal-images-slider">
// //                   <Slider {...mainImageSettings}>
// //                     {deal.images.map((image) => (
// //                       <div key={image.Dealimage_id}>
// //                         <img src={image.photo} className="deal-image" />
// //                       </div>
// //                     ))}
// //                   </Slider>
// //                 </div>

// //                 <div className="thumbnail-slider">
// //                   <Slider {...thumbnailSettings}>
// //                     {deal.images.map((image, index) => (
// //                       <div key={image.Dealimage_id} onClick={() => setMainImageIndex(index)}>
// //                         <img
// //                           src={image.photo}
// //                           className={`thumbnail-image ${mainImageIndex === index ? "active" : ""}`}
// //                         />
// //                       </div>
// //                     ))}
// //                   </Slider>
// //                 </div>

// //                 <h1 className="mb-4 mt-4">{deal.main_title}</h1>

// //                 {deal.deal_description && (
// //                   <div
// //                     className="deal-description"
// //                     dangerouslySetInnerHTML={{ __html: deal.deal_description }}
// //                   />
// //                 )}

// //                 <h3 className="mt-3">Business Info:</h3>
// //                 <p><strong>Business Type:</strong> {deal.business_type}</p>
// //                 <p>
// //                   <strong>Website:</strong>{" "}
// //                   <a href={`https://${deal.business_website}`} target="_blank">
// //                     {deal.business_website}
// //                   </a>
// //                 </p>

// //                 <p><strong>Deal Address:</strong> {deal.deal_address}</p>

// //                 {deal.Map_link && (
// //                   <div dangerouslySetInnerHTML={{ __html: deal.Map_link }} />
// //                 )}

// //                 {deal.business_desc && (
// //                   <div
// //                     className="business-desc"
// //                     dangerouslySetInnerHTML={{ __html: deal.business_desc }}
// //                   />
// //                 )}
// //               </div>
// //             </div>

// //             {/* SIDEBAR -------------------------------- */}
// //             <div className="col-lg-4">
// //               <h3 className="text-center mb-3">Deal Options</h3>

// //               <form onSubmit={handleSubscribe}>
// //                 {deal.options.map((option) => (
// //                   <div className="deal-option" key={option.deal_option_id}>
// //                     <label className="custom-radio-label">
// //                       <input
// //                         type="radio"
// //                         name="deal-option"
// //                         value={option.deal_option_id}
// //                         onChange={() => setSelectedOption(option.deal_option_id)}
// //                       />
// //                       <span className="custom-radio-circle"></span>
// //                     </label>

// //                     <div>
// //                       <span className="right-head">{option.option_title}</span>
// //                       <p><strong>Regular Price:</strong> ₹{option.regular_price}</p>
// //                       <p><strong>Price Cut:</strong> ₹{option.pricecut_price}</p>
// //                       <p><strong>Monthly Voucher Cap:</strong> {option.monthly_voucher_cap}</p>
// //                     </div>
// //                   </div>
// //                 ))}

// //                 <button className="auth-btn w-100 mt-3" disabled={!selectedOption}>
// //                   Subscribe
// //                 </button>
// //               </form>

// //               {/* Winning Popup */}
// //               {popupOpen && (
// //                 <div className="popup-overlay">
// //                   <div className="popup-content">
// //                     <Confetti width={window.innerWidth} height={window.innerHeight} />
// //                     <motion.h1
// //                       className="text-4xl font-bold text-center"
// //                       initial={{ scale: 0.8 }}
// //                       transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
// //                     >
// //                       🎉 Congratulations! Deal Subscribed! 🎊
// //                     </motion.h1>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* RELATED DEALS (same logic, updated Link) */}
// //       <section className="mt-5">
// //         <h2 className="text-center">Related Deal</h2>

// //         <div className="container">
// //           <div className="row">
// //             {relatedProduct.map((store) => (
// //               <div key={store.Deals_id} className="col-xl-4 col-sm-6 custom-card-block">
// //                 <div className="custom-card border rounded shadow-sm">
// //                   <Link href={`/deal/${store.GUID}`}>
// //                     <img
// //                       src={store.images[0]?.photo || "/images/placeholder.png"}
// //                       className="img-fluid w-100"
// //                       style={{ height: "185px", objectFit: "cover" }}
// //                     />
// //                   </Link>

// //                   <div className="p-2">
// //                     <h6>
// //                       <Link href={`/deal/${store.GUID}`} className="fw-bold">
// //                         {store.main_title}
// //                       </Link>
// //                     </h6>

// //                     <p>{store.vendor?.vendoraddress}</p>

// //                     <div className="d-flex align-items-center gap-2 mt-1">
// //                       <span className="text-decoration-line-through fw-bold">
// //                         ₹{store.options[0]?.pricecut_price}
// //                       </span>
// //                       <span className="fw-bold" style={{ color: "#7E40B2" }}>
// //                         ₹{store.options[0]?.regular_price}
// //                       </span>
// //                     </div>

// //                     <button className="btn btn-sm mt-2" style={{ background: "#A36DB5", color: "white" }}>
// //                       Get Offer
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* Snackbar */}
// //       <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
// //         <Alert severity={snackbarSeverity} onClose={handleCloseSnackbar}>
// //           {snackbarMessage}
// //         </Alert>
// //       </Snackbar>
// //     </>
// //   );
// // }
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import Slider from "react-slick";
// import { Skeleton, Snackbar, Alert, Box } from "@mui/material";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Confetti from "react-confetti";
// import { motion } from "framer-motion";
// import styles from "./DealDetail.module.css"; // CSS module recommended in Next.js

// interface DealImage {
//   Dealimage_id: number;
//   photo: string;
// }

// interface Option {
//   deal_option_id: number;
//   option_title: string;
//   regular_price: number;
//   pricecut_price: number;
//   monthly_voucher_cap: number;
// }

// interface RelatedDeal {
//   Deals_id: number;
//   GUID: string;
//   deals_slug: string;
//   business_type: string;
//   average_rating?: number;
//   main_title: string;
//   vendor?: {
//     vendoraddress: string;
//     latitude?: number;
//     longitude?: number;
//   };
//   images: DealImage[];
//   options: Option[];
// }

// interface Deal {
//   main_title: string;
//   deal_description?: string;
//   business_type: string;
//   business_website: string;
//   deal_address: string;
//   Map_link?: string;
//   business_desc?: string;
//   images: DealImage[];
//   options: Option[];
//   related_deals: RelatedDeal[];
// }

// export default function DealDetail() {
//   const router = useRouter();
//   const { GUID } = router.query;

//   const [deal, setDeal] = useState<Deal | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [mainImageIndex, setMainImageIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<number | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState<
//     "error" | "info" | "success" | "warning"
//   >("info");
//   const [relatedProduct, setRelatedProduct] = useState<RelatedDeal[]>([]);
//   const [isWinner, setIsWinner] = useState(false);
//   const [popupOpen, setPopupOpen] = useState(false);

//   const fetchDealDetail = async () => {
//     if (!GUID) return;
//     try {
//       const response = await fetch(
//         "https://getdemo.in/pricecut/api/Front/DealDetail",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ GUID }),
//         }
//       );

//       const result = await response.json();
//       if (result.success) {
//         setDeal(result.data);
//         setRelatedProduct(result.related_deals);
//       } else {
//         console.error("Failed to fetch deal details");
//       }
//     } catch (error) {
//       console.error("Error fetching deal details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDealDetail();
//   }, [GUID]);

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: false,
//     });
//   }, []);

//   const handleSubscribe = async (event: React.FormEvent) => {
//     event.preventDefault();

//     const customerGUID = localStorage.getItem("Customer_GUID");
//     const token = localStorage.getItem("token");

//     if (!customerGUID || !token) {
//       setSnackbarMessage("Please log in to subscribe to this deal.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);

//       setTimeout(() => {
//         router.push("/login");
//       }, 3000);

//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://getdemo.in/pricecut/api/customersubscribedeal",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             GUID,
//             Customer_GUID: customerGUID,
//             deal_option_id: selectedOption,
//           }),
//         }
//       );

//       const result = await response.json();
//       if (result.success) {
//         setIsWinner(true);
//         setPopupOpen(true);

//         setTimeout(() => {
//           setPopupOpen(false);
//           setIsWinner(false);
//           router.push("/mycoupons");
//         }, 8000);
//       } else {
//         setSnackbarMessage(result.message);
//         setSnackbarSeverity("error");
//         setSnackbarOpen(true);
//       }
//     } catch (error) {
//       console.error("Error subscribing to deal:", error);
//       setSnackbarMessage("An error occurred. Please try again later.");
//       setSnackbarSeverity("error");
//       setSnackbarOpen(true);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbarOpen(false);
//   };

//   if (loading) {
//     return (
//       <section className="mt-5 mb-5">
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-8">
//               <Skeleton variant="rectangular" width="100%" height={400} />
//             </div>
//             <div className="col-lg-4">
//               <Skeleton variant="rectangular" width="100%" height={300} />
//               <Skeleton variant="rectangular" width="100%" height={50} className="mt-3"/>
//               <Skeleton variant="rectangular" width="100%" height={50} className="mt-2"/>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!deal) {
//     return <p>No deal found.</p>;
//   }

//   // Use your existing JSX here unchanged except adapt className to styles from CSS modules if needed
//   // You may continue using your current JSX code almost as is

//   return (
//     <>
//       {/* ...Your JSX here (same as original except Link is from Next.js) */}
//       {/* Example of usage for Link in Next.js */}
//       {/* <Link href={`/deal/${store.GUID}`}><a>Deal Link</a></Link> */}
//       {/* Snackbar component & other elements remain unchanged */}
//     </>
//   );
// }


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
            GUID: guid,
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
              {deal.images.length > 0 ? (
                <div className="deal-images-slider">
                  <Slider {...mainImageSettings}>
                    {deal.images.map((img) => (
                      <div key={img.Dealimage_id}>
                        <img src={img.photo} className="deal-image" />
                      </div>
                    ))}
                  </Slider>
                </div>
              ) : (
                <p>No images available.</p>
              )}

              {/* Thumbnails */}
              {deal.images.length > 0 && (
                <Slider {...thumbnailSettings}>
                  {deal.images.map((img, idx) => (
                    <div key={img.Dealimage_id} onClick={() => setMainImageIndex(idx)}>
                      <img
                        src={img.photo}
                        className={`thumbnail-image ${idx === mainImageIndex ? "active" : ""}`}
                      />
                    </div>
                  ))}
                </Slider>
              )}

              <h1 className="mt-4">{deal.main_title}</h1>
              <div
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
              <h3 className="text-center mb-3">Deal Options</h3>

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
            {relatedProduct.map((store) => (
              <div
                key={store.Deals_id}
                className="col-xl-4 col-sm-6 custom-card-block"
              >
                <div className="custom-card border rounded shadow-sm">
                  <div className="position-relative">
                    <img
                      src={store.images[0]?.photo}
                      className="img-fluid w-100"
                      onClick={() => router.push(`/deal/${store.GUID}`)}
                      style={{ cursor: "pointer", height: 185, objectFit: "cover" }}
                    />
                  </div>

                  <div className="p-2">
                    <h6
                      className="fw-bold title-txt"
                      onClick={() => router.push(`/deal/${store.GUID}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {store.main_title}
                    </h6>
                    <p>{store.vendor?.vendoraddress}</p>

                    <div className="d-flex align-items-center gap-2">
                      <span className="text-decoration-line-through">
                        ₹{store.options[0]?.regular_price}
                      </span>

                      <span className="fw-bold" style={{ color: "#7E40B2" }}>
                        ₹{store.options[0]?.pricecut_price}
                      </span>
                    </div>

                    <button
                      className="btn btn-sm mt-2"
                      style={{ background: "#A36DB5", color: "white" }}
                    >
                      Get Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}
