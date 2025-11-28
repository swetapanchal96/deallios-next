"use client";

import React from "react";
import Image from "next/image";
import "./services.css";

// Image imports (Next.js automatically handles optimization)
import servicesIllustration from "@/app/assets/aboutus/service.webp";
import servicesIllustration1 from "@/app/assets/aboutus/what_we_offer.webp";
import bgImage from "../../../public/assets/deal-banner.jpg";

export default function Services() {
  const services = [
    {
      title: "Create a Business Account",
      description: "Sign up quickly and provide basic details about your business.",
      variant: "",
      iconClass: "fa-solid fa-briefcase",
    },
    {
      title: "Publish Your Deals",
      description:
        "After you've added your deal's information, like a description, price, and time frame, the site will go live.",
      variant: "green",
      iconClass: "fa-solid fa-bullhorn",
    },
    {
      title: "Expand Your Reach",
      description:
        "People in your neighbourhood or business looking to save can see your discounts immediately.",
      variant: "pink",
      iconClass: "fa-solid fa-chart-line",
    },
  ];

  return (
    <div>
      {/* Section 1 */}
      <div className="service-container container pt-5">
        <div className="service-column text-column">
          <h1 className="service-title">Our Services</h1>
          <p className="service-description">
            Got a fantastic deal you're eager to share? You've found the perfect spot.
          </p>
          <p className="service-description">
            We created Deallios so businesses like yours, from that charming local café to big national chains, can easily share eye-catching discounts. If you've got a deal, we've got the audience to help you boost foot traffic and get noticed.
          </p>
        </div>

        <div className="service-column image-column">
          <Image src={servicesIllustration} alt="Our services illustration" className="img-fluid" />
        </div>
      </div>

      {/* Section 2 */}
      <div className="service-container container">
        <div className="service-column image-column1">
          <Image src={servicesIllustration1} alt="What we offer illustration" className="img-fluid" />
        </div>

        <div className="service-column text-column">
          <h1 className="service-title">What We Offer</h1>
          <h5 className="pt-3">
            Deallios is a platform for deals that change all the time; businesses can list the following:

          </h5>

          <div className="service-description">
            <h4 style={{ color: "#2a2247" }}>1. Deals, Offers, Discounts, and Promo Codes</h4>
            <p>
              Businesses can share their best deals with a bigger audience, including flash sales, seasonal offers, and promo codes. There are no limits on the type of business or its size.
            </p>

            <h4 style={{ color: "#2a2247" }}>2. Reach New Customers</h4>
            <p>
             Every deal posted on Deallios helps attract potential customers who are actively searching for value. Whether you're in retail, food, beauty, electronics, or services, if you're offering a discount, we're here to help you showcase it.
            </p>

            <h4 style={{ color: "#2a2247" }}>3. Flexible Deal Terms</h4>
            <p>
              Companies are in charge of all of their deals. You choose the prices, the discount rate, and the length of time. We give you the platform, and you decide the rules.
            </p>

            <h4 style={{ color: "#2a2247" }}>4. Open Access for All Businesses</h4>
            <p>
              Deallios lets any business join and start offering deals. Our goal is to make it easy and available for everyone to share deals.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container pb-5">
        <div className="row text-center mb-4">
          <h1 style={{ color: "#2a2247" }}>How It Works</h1>
        </div>

        <div className="row">
          {services.map((svc, idx) => (
            <div key={idx} className="col-lg-4 col-md-4 col-sm-6 d-flex">
              <div className={`serviceBox1 ${svc.variant} position-relative`}>
                <div className="icon-container">
                  <i className={`icon fa ${svc.iconClass}`}></i>
                </div>
                <h3 className="title1 mt-5">{svc.title}</h3>
                <p className="description1">{svc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div
        className="bannerContainer"
        style={{ backgroundImage: `url(${bgImage.src})`, marginTop: "20px" }}
      >
        <div className="bannerOverlay" />
        <div className="bannerContent">
          <div className="bannerText">
            <h2>You Ready to Start?</h2>
          </div>

          <p>
            Deallios helps small and large businesses find new consumers and increase sales through deal marketing. If you’re interested in selling goods or services, simply head over to our Contact Us page and get in touch with us directly.
          </p>
          <p>Deallios is the only location to post offers currently.</p>

          <a href="/reseller" className="join-btn mb-1">
            Join Us
          </a>
        </div>
      </div>
    </div>
  );
}
