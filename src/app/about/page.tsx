'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./about.css";
import aboutHero from "@/app/assets/aboutus/img1.jpg"
import saving from "@/app/assets/aboutus/saving.webp"
import layers from '@/app/assets/aboutus/Layer1.png'

function About() {
  // Custom SEO hook replacement - add metadata in layout or use generateMetadata
  const cards = [
    {
      id: 1,
      iconClass: "fa fa-eye",
      title: "Our Vision",
      description: `At Deallios, our vision is to build a truly connected digital marketplace where discovering and sharing offers and discounts is effortless. We aim to make savings accessible to everyone across big cities and small towns alike. By connecting businesses with customers in real time, we're reshaping how value is exchanged.`,
      text: `We see a future where every business can grow without spending a rupee on promotions. And every customer can enjoy real deals without the clutter or confusion. With Deallios, the future of smart, seamless savings is already here.`,
      colorClass: "",
    },
    {
      id: 2,
      iconClass: "fa fa-bullseye",
      title: "Our Mission",
      description: `We aim to simplify how businesses and customers connect through real-time deals, discounts, coupons, and promo codes. Our platform offers a quick, cost-free way to list, discover, and use offers, all powered by easy QR scans. We make saving and promoting effortless for everyone.`,
      text: `We're here to help businesses grow, without any listing fees or technical hassle. From small shops to large chains, anyone can reach new customers instantly. And with a simple sign-up, users can personalize their experience and never miss a deal.`,
      text1: `At Deallios, smart shopping and smart selling go hand in hand.`,
      colorClass: "", // Changed from "blue" to respect user preference [memory:3]
    },
  ];

  const cardData = [
    {
      title: "Digital Deals & Coupons",
      description: "Live offers with ready-to-use QR codes",
    },
    {
      title: "Promo Code Campaigns",
      description: "Run flash sales, reward loyal customers",
    },
    {
      title: "No-Cost Listings",
      description: "Promote freely, expand infinitely",
    },
    {
      title: "Flexible Access",
      description:
        "Guests can explore, filter by location or category, and redeem offers via QR codes. Sign in with location on for personalized nearby deals.",
    },
    {
      title: "Secure, Streamlined System",
      description: "Designed for results, not complexity",
    },
  ];

  return (
    <>
      <div className="" style={{}}>
        <div className="text-center pb-3 pt-5">
          <h1>Deallios: Tap Into Savings, One Deal at a Time</h1>
          <h5 className="my-2" style={{ paddingTop: "10px" }}>
            Where Offers Find You – Instantly, Effortlessly, Everywhere
          </h5>
        </div>

        <div className="container about-container">
          <div className="about-column image-column">
            <Image
              src={aboutHero}
              alt="Deallios savings"
              width={600}
              height={400}
              priority
            />
          </div>
          <div className="about-column text-column">
            <p>
              Tired of chasing paper flyers or waiting for that one-off sale?
              It's time to flip the script. At Deallios, we're turning the deal
              game on its head, making it faster, fairer, and free. Whether it's
              a limited-time discount, a surprise promo code, or an everyday
              coupon, we deliver it all.
            </p>
            <p>
              Whether you're a local business wanting to turn heads with your
              latest offer, or a smart shopper looking to stretch your rupee
              without stretching your time, Deallios puts everything within
              arm's reach literally, with just one tap.
            </p>
            <p>
              Consider it as your digital business alive with real-time deals,
              dynamic promotions, and QR-powered check-ins that make grabbing
              offers as simple as surveying your way to savings.
            </p>
            <p>
              We provide a smart, linked platform with no intermediaries, a
              place where companies of any size may thrive and where visitors
              can conveniently explore, check in, and save. We live in a world
              where every choice matters, so why bother trimming when you can
              just click?
            </p>
            <p>
              With Deallios, you're not just finding deals you're finding
              possibilities.
            </p>
          </div>
        </div>
      </div>

      <div className="cardsContainer container">
        {cards.map(({ id, iconClass, title, description, colorClass, text, text1 }) => (
          <div key={id} className={`serviceBox ${colorClass}`}>
            <div className="cardHeader">
              <div className="service-icon">
                <i className={iconClass} />
              </div>
              <h1 className="title">{title}</h1>
            </div>
            <p className="description">{description}</p>
            <p className="description">{text}</p>
            {text1 && <p className="description">{text1}</p>}
          </div>
        ))}
      </div>

      <div style={{ background: "#eeeeee" }}>
        <div className="about-container container py-5">
          <div className="about-column text-column">
            <h1>Why Choose Deallios?</h1>
            <br />
            <h5>Simple. Fast. Real. That's the Deallios Edge.</h5>
            <p>
              <span className="fa fa-check" aria-hidden="true" />{" "}
              <strong>Power for All Businesses - </strong> From corner stores to
              nationwide chains
              <br />
              <span className="fa fa-check" aria-hidden="true" />{" "}
              <strong>Zero-Cost Visibility - </strong> No commissions, no
              listing charges
              <br />
              <span className="fa fa-check" aria-hidden="true" />{" "}
              <strong>Tech That Works for Everyone - </strong> Scan-and-go QR
              magic
              <br />
              <span className="fa fa-check" aria-hidden="true" />{" "}
              <strong>No Fake Promos - </strong> Featuring only verified and
              impactful deals
            </p>
            <p>
              We're not here to flood your screen we're here to help you grab
              the right offer at the right time.
            </p>
          </div>
          <div className="about-column image-column">
            <Image
              src={saving}
              alt="Deallios vision"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </div>

      <div className="about-container container py-5">
        <div className="about-column image-column">
          <Image
            src={layers}
            alt="Deallios mission"
            width={600}
            height={400}
          />
        </div>
        <div className="about-column text-column">
          <h1>The Deallios Experience: Scan. Save. Smile.</h1>
          <br />
          <h5>
            We believe getting a great deal should feel as good as giving one.
            That's why we created a platform that:
          </h5>
          <p>
            <span className="fa fa-check" aria-hidden="true" /> Let’s businesses
            generate QR coupons & promo codes in seconds
            <br />
            <span className="fa fa-check" aria-hidden="true" /> Allows users to
            browse deals with or without signing in it's your choice
            <br />
            <span className="fa fa-check" aria-hidden="true" /> Enables brands
            to promote directly, no agencies or hefty budgets needed
            <br />
            <span className="fa fa-check" aria-hidden="true" /> Gives vendors
            real-time analytics and control to optimize performance
            <br />
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center" }} className="deal-container py-5">
        <div className="container">
          <h1 className="section-title text-center">Here's What You Get</h1>
          <div className="layout-body">
            <div className="boxes-column">
              {cardData.map((card, index) => (
                <div key={index} className="info-box">
                  <h4 className="box-title">{card.title}</h4>
                  <p className="box-desc">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="bannerContainer"
        style={{ backgroundImage: `url("/assets/deal-banner.jpg")`, marginTop: "20px" }}
      >
        <div className="bannerOverlay" />
        <div className="bannerContent">
          <h2 style={{ paddingBottom: "20px" }}>
            Ready to Share Your Deal with the World?
          </h2>
          <p>
            Whether you're brewing coffee at a cozy café or launching a
            mega-sale across locations, Deallios is your space to shine.
          </p>
          <h5>Got a deal? We've got the audience.</h5>
          <p>Get started with Deallios – where growth meets opportunity.</p>
        </div>
      </div>
    </>
  );
}

export default About;
