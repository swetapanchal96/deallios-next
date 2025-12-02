"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import { apiUrl } from "@/config";

type Offer = {
    offer_image: string;
    is_align: number;
    // add other fields from API here if needed
};

const Offers: React.FC = () => {
    const [imgoffer, setImageOffer] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios
            .post(`${apiUrl}/Front/OfferImageDisaplay`)
            .then((res) => {
                const filteredOffers: Offer[] = res.data.data.filter(
                    (image: Offer) => image.is_align === 1
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
                        : imgoffer.map((image, index) => (
                            <div className="col-12 col-md-6 col-lg-6" key={index}>
                                <div
                                    className="offer-box position-relative"
                                    style={{
                                        backgroundColor: "#fef3e4",
                                        width: "100%",
                                        height: "300px", // required for next/image fill
                                        overflow: "hidden",
                                    }}
                                >

                                    {/* If you want to use next/image here, configure external domains in next.config.[web:27][web:30] */}
                                    <Image
                                        src={image?.offer_image}
                                        alt={`Offer ${index + 1}`}
                                        fill
                                        className="object-cover w-100 h-100"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default Offers;


// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Skeleton } from "@mui/material";

// function Offers() {
//   const [imgoffer, setImageOffer] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .post("https://getdemo.in/pricecut/api/Front/OfferImageDisaplay")
//       .then((res) => {
//         const filteredOffers = res.data.data.filter(
//           (image:any) => image.is_align === 1
//         );
//         setImageOffer(filteredOffers);
//         setLoading(false); // Set loading to false once the data is fetched
//       })
//       .catch((error) => {
//         console.error("Error fetching offers:", error);
//         setLoading(false); // In case of error, set loading to false
//       });
//   }, []);

//   return (
//     <section className="section-padding homepage-store-block">
//       <div className="container">
//         <div className="row bg-1">
//           {loading
//             ? [...Array(2)].map(
//                 (
//                   _,
//                   index // Create 4 skeleton loaders
//                 ) => (
//                   <div className="col-12 col-md-6 col-lg-6" key={index}>
//                     <div className="offer-box">
//                       <Skeleton
//                         variant="rectangular"
//                         width="100%"
//                         height={200}
//                       />
//                     </div>
//                   </div>
//                 )
//               )
//             : imgoffer.map((image :any, index) => (
//                 <div className="col-12 col-md-6 col-lg-6" key={index}>
//                   <div
//                     className="offer-box"
//                     style={{ backgroundColor: "#fef3e4" }}
//                   >
//                     <img
//                       className="img-fluid dd"
//                       src={image.offer_image}
//                       alt={`Offer ${index + 1}`}
//                     />
//                   </div>
//                 </div>
//               ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Offers;
