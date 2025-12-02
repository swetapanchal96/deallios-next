'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import bgImage from "../../../public/assets/deal-banner.jpg";
import "./contact.css"; // Keep your existing CSS (place in public or styles folder)
import { apiUrl } from '@/config';

function Contact() {
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

  // Custom SEO hook replacement using Next.js Head
  useEffect(() => {
    // SEO metadata set via Head component below
  }, []);

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
      <Head>
        <title>Contact Us - Deallio</title>
        <meta name="description" content="Contact Deallio for deals, support, partnerships, and more. We're just an email away!" />
        <meta property="og:title" content="Contact Us - Deallio" />
        <meta property="og:description" content="Let’s Talk Deals We’re Just an Email Away." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="contact-container container pt-5">
        <div className="contact-column text-column">
          <h1>Contact Us</h1>
          <h5 style={{ paddingTop: "20px" }}>
            Let&apos;s Talk Deals We&apos;re Just an Email Away.
          </h5>
          <p>
            Have a question, suggestion, or just want to say hello? We&apos;d love to
            hear from you. Whether you&apos;re a user looking for help, a business
            exploring opportunities, or someone curious about what we do we&apos;re
            here to assist.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-8">
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

              {error && <div className="alert alert-danger">{error}</div>}
              {successMsg && <div className="alert alert-success">{successMsg}</div>}

              <button
                type="submit"
                className="btn1 btn1-color w-50 justify-content-center"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
          <div className="col-lg-5 pt-4 lg-pt-0 contact-column text-column">
            <h5>Reach Out Anytime</h5>

            <p>
              For general inquiries, support, feedback, or collaboration
              requests, feel free to drop us a message at:
              <br />
              <strong>info@deallio.in</strong>
              <br />
              We aim to respond within 24-48 hours, Monday through Friday.
            </p>
          </div>
        </div>
      </div>

      <div className="bannerContainer py-5" style={{ backgroundImage: `url(${bgImage.src})`, marginTop: "20px" }}>
        {/* <Image
          src="/images/deal-banner.jpg"
          alt="Deal banner background"
          fill
          className="banner-image"
          priority={false}
          quality={85}
        /> */}
        <div className="bannerOverlay" />
        <div className="bannerContent">
            <div className="bannerText">

          <h2 style={{ paddingBottom: "20px" }}>Stay Connected</h2>
            </div>
          <p>
            While we work on building more ways to connect, email remains the
            best way to reach us directly. We appreciate your patience and
            promise to get back to you as soon as we can.
          </p>
          <p>Thanks for being part of the Deallio community!</p>
        </div>
      </div>
    </>
  );
}

export default Contact;
