'use client';

import React, { useState } from "react";
import axios from "axios";
import "./Homepage.css";
import { apiUrl } from "@/config";

const HomePage = () => {
  const services = [
    {
      title: "Email",
      description: "info@deallios.in",
      iconClass: "fas fa-envelope",
    },
    {
      title: "Phone",
      description: "1-800-DEALLIOS",
      variant: "green",
      iconClass: "fas fa-phone-alt",
    },
    {
      title: "Location",
      description: "123 Savings Street, Deal City",
      variant: "pink",
      iconClass: "fas fa-map-marker-alt",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    reason: "",
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await axios.post(
        `${apiUrl}/Front/contactmailsend`,
        {
          name: formData.name,
          email: formData.email,
          mobile: formData.phone,
          message: formData.message,
          reason: formData.reason,
        }
      );

      if (response.data.success) {
        setSuccessMsg("Your message was sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          reason: "",
        });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="banner" style={{ background: "rgb(238, 238, 238)" }}>
        <div className="container">
          <div className="banner-content text-black">
            <h1 className="banner-title">Deals at Your Fingertips</h1>
            <p className="banner-subtitle">One Scan Away from Big Savings.</p>
            <p>Scan. Save. Smile.</p>
            <a
              href="#how-it-works"
              className="btn text-white"
              style={{ marginTop: "20px", background: "#8529a3" }}
            >
              Grab a Deal Today
            </a>
          </div>
        </div>
      </section>

      <section id="about">
        <div className="container">
          <h2 className="text-center">Your Shortcut to Smarter Shopping</h2>
          <p className="text-center">
            We make finding deals simple for shoppers and effective for businesses
          </p>

          <div className="about-content">
            <div className="about-text">
              <p>
                It can be frustrating, can't it? Sifting through endless websites to find a decent deal, or trying to cut through the noise to get your amazing business offers noticed. We hear you!
              </p>
              <p>
                That's exactly why we're making some exciting changes to how we find and share deals here at Deallios. Whether you're on the hunt for the best savings or you're a business looking to give your deals more visibility, we're here to be your go-to partner. We're committed to helping you save money and get the attention your business deserves.
              </p>
              <p>We're more than just a coupon site - we're your deal ally.</p>

              <h3 style={{ marginTop: "15px", marginBottom: "15px" }}>
                What Makes Us Different?
              </h3>
              <ul className="feature-list" style={{ listStyle: "none !important" }}>
                <li>Users and businesses can use it for free, there are no fees or hidden costs.</li>
                <li>Easy to make, scan, and redeem with a simple QR code system.</li>
                <li>Made for small businesses and big chains across the country.</li>
              </ul>
              <p>
                Businesses can effortlessly connect with a wider audience through Deallios, while users enjoy personalized savings tailored to their needs, all in just a few clicks.
              </p>
            </div>
            <div className="about-image">
              <img
                src="https://picsum.photos/seed/deallios/600/400.jpg"
                alt="Deallios QR Code System"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="services border">
        <div className="container">
          <h2 className="text-center mt-5">Steals, Deals & Everything in Between</h2>
          <p className="text-center">Explore our range of services for both shoppers and businesses</p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-tags"></i>
              </div>
              <h3 className="service-title">Deals</h3>
              <p>Special offers and promotions created directly by businesses for your savings.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <h3 className="service-title">Coupons</h3>
              <p>Ready-to-use savings that are just a scan away with our QR code system.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-percentage"></i>
              </div>
              <h3 className="service-title">Promo Codes</h3>
              <p>Digital keys to discounts at checkout, both online and offline.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-gift"></i>
              </div>
              <h3 className="service-title">Discounts</h3>
              <p>From daily essentials to exclusive buys, explore real savings across categories.</p>
            </div>
          </div>

          <div className="business-section">
            <div className="business-header">
              <h3>For Businesses</h3>
              <a style={{ backgroundColor: "#be85d1", color: "black" }} href="#" className="btn">
                Get Started
              </a>
            </div>
            <p>Create, publish, and share your deals at no cost. Just sign up, design your promotion, and let customers scan and redeem via QR codes - no technical hassle, no setup fee.</p>
          </div>

          <div className="business-section" style={{ backgroundColor: "var(--background)" }}>
            <div className="business-header">
              <h3>For Shoppers</h3>
              <a style={{ backgroundColor: "#be85d1", color: "black" }} href="#" className="btn">
                Explore Deals
              </a>
            </div>
            <p>Explore deals, select what suits you, get your unique QR, and redeem at the point of service. No accounts required. No spam. Just quick, easy savings.</p>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="container">
          <h2 className="text-center">What Our Users Say</h2>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "Deallios made it easy for my business to promote weekly discounts. Within days, customer footfall increased without me spending on ads. The QR system is genius."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://picsum.photos/seed/business1/50/50.jpg"
                  alt="Business Owner"
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>Local Business Owner</h4>
                  <p>Small Business Owner</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-text">
                "As a customer, I've never found saving money this effortless. The deals are real, the process is smooth, and I don't have to sign up unless I want to."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://picsum.photos/seed/shopper1/50/50.jpg"
                  alt="Happy Shopper"
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>Happy Shopper</h4>
                  <p>Regular User</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <p className="testimonial-text">
                "I posted a restaurant offer through Deallios and saw a measurable rise in reservations. It's simple and effective."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://picsum.photos/seed/restaurant1/50/50.jpg"
                  alt="Restaurant Manager"
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>Restaurant Chain Manager</h4>
                  <p>Restaurant Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works">
        <div className="container">
          <h2 className="text-center mt-3">How It Works</h2>
          <p className="text-center">Simple steps to start saving with Deallios</p>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Sign Up or Explore as a Guest</h3>
              <p>Guests can explore deals, filter by location or category, and generate QR codes to redeem offers. For personalized deals nearby, we recommend signing in with location on.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Find Your Perfect Deal</h3>
              <p>Browse deals by location, category, or your favorite brands. Whether signed in or exploring as a guest, you can easily view all active offers in real time.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Generate Your QR Code</h3>
              <p>Once you select a deal, a unique QR code is instantly generated just for you. This code is your digital ticket to instant savings, ready to be used anytime.</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3 className="step-title">Redeem & Save Instantly</h3>
              <p>Show the QR code at the business while making your purchase. No printing, no code memorization - just scan, save, and smile.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <h2 className="text-center">Contact Us</h2>
        <p className="text-center">Have a question or want to collaborate? Reach out we're all ears.</p>
        <div className="container contact-container">
          <div className="contact-column">
            <form onSubmit={handleSubmit} className="contact-form">
              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              
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
                  <option value="general">Having trouble using a QR code or deal</option>
                  <option value="support">Concerns regarding business posting deals</option>
                  <option value="feedback">Reporting a technical problem</option>
                  <option value="comments">Comments to help us get better</option>
                  <option value="partnerships">Enquiries about partnerships or the media</option>
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
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
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
    </>
  );
};

export default HomePage;
