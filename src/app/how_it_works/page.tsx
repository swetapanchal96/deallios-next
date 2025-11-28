"use client";

import React from "react";
import Image from "next/image";
import "./how_it_works.css";

// Importing images from public folder
import whyItWorksImage from "@/app/assets/howtowork.jpg";
import bgImage from "../../../public/assets/deal-banner.jpg";

export default function HowItWorks() {
  return (
    <>
      <div className="container pt-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <h1>How It Works</h1>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
            <h5>
              A great deal is just a click away and we've made sure it's as easy as pie.
            </h5>
            <p className="card-text text-justify">
              We at Deallios think that finding a good deal shouldn't be like going on a treasure hunt. That's why we made the process so easy and smooth that you can go from looking around to claiming in just a few steps.
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="row">
          {/* Card 1 */}
          <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
            <div className="card p-4">
              <div className="step-icon-wrapper">
                <div className="step-icon">01</div>
              </div>
              <div className="card-body">
                <h5 className="card-title">Sign Up or Continue as a Guest</h5>
                <p className="card-text">You don't have to go through any hoops to start.</p>
                <p className="card-text">
                  <span className="tick-icon fa fa-check" /> <strong>Create an Account:</strong> Fill out a short form to get started and have a more personalized experience.
                  <br />
                  <span className="tick-icon fa fa-check" /> <strong>Guest Access:</strong> Do you like things to be easy? Don't worry; you can get your deal without signing up.
                </p>
                <p>You'll be able to look at live deals right away either way.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
            <div className="card p-4">
              <div className="step-icon-wrapper">
                <div className="step-icon">02</div>
              </div>
              <div className="card-body">
                <h5 className="card-title"> Browse and Grab the Deal</h5>
                <p className="card-text">
                  Explore deals from your favorite shops, restaurants, salons, and service providers. From local gems to big brands, we've got them all.
                </p>
                <p className="card-text">
                  <span className="tick-icon fa fa-check" /> Find a deal that suits you
                  <br />
                  <span className="tick-icon fa fa-check" /> Click <strong>Grab Deal</strong>
                  <br />
                  <span className="tick-icon fa fa-check" /> Confirm your selection
                </p>
                <p>No hidden steps — just straightforward savings.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
            <div className="card p-4">
              <div className="step-icon-wrapper">
                <div className="step-icon">03</div>
              </div>
              <div className="card-body">
                <h5 className="card-title">QR Code Gets Generated</h5>
                <p className="card-text">
                  Upon deal finalization, a unique QR code will be instantly generated, allowing immediate redemption of the offer.
                </p>
                <p className="card-text">
                  <span className="tick-icon fa fa-check" /> For the selected offer, a unique QR code will be generated.
                  <br />
                  <span className="tick-icon fa fa-check" /> Save it to your phone or computer, or go straight to it in your browser.
                  <br />
                  <span className="tick-icon fa fa-check" /> You'll also get a copy by email or text based on how you've set it up.
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
            <div className="card p-4">
              <div className="step-icon-wrapper">
                <div className="step-icon">04</div>
              </div>
              <div className="card-body">
                <h5 className="card-title">Redeem the Deal In-Store or Online</h5>
                <p className="card-text">
                  Now, the exciting part is redeeming your deal. Present your QR code to the business at the time of purchase or service. Whether it's at the cash counter, reception desk, or a self-checkout your QR code makes redemption quick and hassle-free.
                </p>
                <p className="card-text">
                  <span className="tick-icon fa fa-check" /> Show your QR code to the team,
                  <br />
                  <span className="tick-icon fa fa-check" /> They'll scan and verify it
                  <br />
                  <span className="tick-icon fa fa-check" /> Enjoy your discounted product or service right away
                </p>
                <p className="mb-0">No printing, no passwords just a scan and you're done.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why It Works Section */}
      <div className="section-container container">
        <div className="section-column text-column">
          <h1>Why It Works</h1>
          <p className="section-description">
            This system ensures fast, secure, and convenient access to deals without unnecessary steps.
            <strong> Saving money has never been easier.</strong>
          </p>
        </div>
        <div className="image-column">
          <Image src={whyItWorksImage} width={300} height={300} alt="Why it works illustration" className="img-fluid" />
        </div>
      </div>

      {/* Banner Section */}
      <div
        className="bannerContainer py-5"
        style={{ backgroundImage: `url(${bgImage.src})`, marginTop: "20px" }}
      >
        <div className="bannerOverlay" />
        <div className="bannerContent">
          <h2 className="pb-3">Get Started Today</h2>
          <p>
            Whether you’re shopping, booking or dining — your next deal is waiting.
            <strong> Sign up or continue as guest.</strong>
          </p>
        </div>
      </div>
    </>
  );
}
