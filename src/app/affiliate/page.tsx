'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../about/about.css";
import '../contact/contact.css';
import '../home_page/Homepage.css'
import "./affiliate_program.css"; // Keep your existing CSS file
import vision from "@/app/assets/vision.jpg";
import bgImage from "../../../public/assets/deal-banner.jpg";

interface TabData {
  title: string;
  content: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  reason: string;
}

const tabData: TabData[] = [
  {
    title: "Boost Your Visibility",
    content:
      "We make your company stand out. When you post a deal on Deallios, it gets seen by a lot of people in your area who are looking for deals, discounts, and events.",
  },
  {
    title: "Increase Sales",
    content:
      "Deals bring people to stores and websites alike. Our platform is designed to help you turn attention into sales, whether you're releasing a new product, getting rid of old stock, or making a big deal out of your services.",
  },
  {
    title: "Simple, Flexible Listings",
    content:
      "You're in charge of everything. You decide on the price, the length of the deal, and the rules. There are no complicated restrictions or integrations, just a simple way to get new users.",
  },
  {
    title: "No Barriers to Entry",
    content:
      "There is no long process for getting approval. Any real business will be able to join Deallios, make ads, and start growing as soon as we open up our collaboration model.",
  },
];

const Affiliate: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    reason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // TODO: submit handler logic
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <section className="affiliate-section">
        <div className="container pt-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h1>Partner With Deallios</h1>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
              <h5>
                Grow Your Reach. Drive More Sales. Join the Deal Revolution.
              </h5>
              <p className="card-text text-justify">
                At Deallios, we believe that great businesses deserve great
                visibility. Whether you're a neighborhood retailer, a growing
                café, or an established brand — if you have a product or service
                to promote, we offer a powerful platform to connect you with
                deal-savvy customers actively looking for what you offer.
              </p>
            </div>
          </div>

          <h1 className="text-center mb-5">Why Collaborate with Deallios?</h1>
          <div className="vertical-tabs-wrapper">
            <div className="tab-buttons">
              {tabData.map((tab, index) => (
                <button
                  key={index}
                  style={{ color: "black" }}
                  type="button"
                  onClick={() => setActiveTabIndex(index)}
                  className={activeTabIndex === index ? "active" : ""}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            <div className="tab-content">
              <h2>{tabData[activeTabIndex].title}</h2>
              <p>{tabData[activeTabIndex].content}</p>
            </div>
          </div>
        </div>
        <div style={{ background: "#eeeeee" }}>
          <div className="about-container container py-5">
            <div className="about-column image-column">
              <Image
                src={vision}
                alt="Deallios vision"
                width={600}
                height={400}
                priority={false}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
            <div className="about-column text-column">
              <h1>Our Vision for Partner Collaboration</h1>
              <br />
              <h5>
                Although we are not actively onboarding partners at this moment,
                we're actively working toward a dedicated collaboration program
                that includes:
              </h5>
              <p>
                <span className="fa fa-check" aria-hidden="true" /> A{" "}
                <strong>partner portal</strong> to manage your deals, track
                performance, and update offerings
                <br />
                <span className="fa fa-check" aria-hidden="true" /> Marketing
                and promotional support to feature top-performing vendors
                <br />
                <span className="fa fa-check" aria-hidden="true" /> Analytics
                and insights to help you optimize your strategy
                <br />
                <span className="fa fa-check" aria-hidden="true" /> Dedicated
                support channels for easy communication and assistance
              </p>
              <p>
                Dedicated support channels for easy communication and assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="stay-connected-section py-5"
        style={{ backgroundColor: "#d0d0d0" }}
      >
        <div className="container text-center">
          <h2 className="mb-3">Stay Connected</h2>
          <p
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "18px",
              lineHeight: "1.6",
            }}
          >
            Interested in becoming a partner in the future?
            <br />
            We'd love to keep in touch. While we're not currently onboarding new
            vendors, you can express your interest by reaching out to us
            directly.
          </p>
        </div>
      </section>

      <section id="contact">
        <h2 className="text-center">Contact Us</h2>
        <p className="text-center">
          Have a question or want to collaborate? Reach out we're all ears.
        </p>
        <div className="container contact-container">
          <div className="contact-column">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="row g-3">
                <div className="col-sm-6">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3 mt-3">
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <select
                  className="form-select"
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="">Reasons to Contact Us</option>
                  <option value="general">
                    Having trouble using a QR code or deal
                  </option>
                  <option value="support">
                    Concerns regarding business posting deals
                  </option>
                  <option value="feedback">
                    Reporting a technical problem
                  </option>
                  <option value="comments">
                    Comments to help us get better
                  </option>
                  <option value="partnerships">
                    Enquiries about partnerships or the media
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Type your message here"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn1 btn1-color w-50 justify-content-center"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="border contact-info">
            <div className="contact-item">
              <div className="contact-icon">
                <i
                  className="fas fa-envelope"
                  style={{
                    border: "1px solid #8529a3",
                    padding: "10px",
                    borderRadius: "50%",
                  }}
                ></i>
              </div>
              <div>
                <h4>Email</h4>
                <p>info@deallios.in</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="bannerContainer"
        style={{ backgroundImage: `url(${bgImage.src})`, marginTop: "20px" }}
      >
        <div className="bannerOverlay" />
        <div className="bannerContent">
          <div className="bannerText">
            <h2>Let's Grow Together</h2>
          </div>
          <p>
            The future of deals is digital and with Deallios, it's also simple,
            smart, and seller-focused. Stay tuned as we open our doors to
            businesses ready to reach more, sell more, and thrive in a
            deal-driven marketplace.
          </p>
          <p>
            <strong>
              Your business has value. We're building a platform to help the
              world see it.
            </strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default Affiliate;
