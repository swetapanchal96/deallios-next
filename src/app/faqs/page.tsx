'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import "./faqs.css";

const faqData = [
  {
    id: 1,
    question: "I didn't receive my QR code. What should I do?",
    answer:
      "If you don't see your QR code after getting the deal or if it doesn't come to you via email or text message, try refreshing the page or checking your spam or junk box. If you still can't find it, please call our support team for help.",
  },
  {
    id: 2,
    question: "Do I need to create an account to use Deallios?",
    answer:
      "No, you do not have to create an account. To explore and claim offers, you can continue as a guest. Nevertheless, by creating an account and enabling location services, you will receive more personalized offers nearby.",
  },
  {
    id: 3,
    question: "Can I use the same deal more than once?",
    answer:
      "Each company providing the deal has terms set of its usage. Some of the deals can be used once and few are redeemable multiple times. Make sure to read the usage terms of each deal.",
  },
  {
    id: 4,
    question: "I own a business. Can I list my deals on Deallios?",
    answer:
      "Yes! Any business, large or small, can join Deallios and publish their offers. We're open to all sectors.",
  },
  {
    id: 5,
    question: "Are there any fees for businesses to post deals?",
    answer:
      "Businesses can post their deals on Deallios completely free, no listing charges, no commissions. Customers can browse and redeem offers without paying anything.",
  },
  {
    id: 6,
    question: "Is there an Android or iOS version of Deallios?",
    answer:
      "Not yet, but it's coming soon! The app will be available on both platforms in the near future. Stay connected with us for launch updates and exclusive early access.",
  },
];

function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQs - Frequently Asked Questions | Deallios</title>
        <meta 
          name="description" 
          content="Find answers to common questions about using Deallios, QR codes, deals, business listings, and mobile apps." 
        />
        <meta property="og:title" content="FAQs - Deallios" />
        <meta property="og:description" content="Have Questions? We've Got Answers." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="container py-5">
        <h1 style={{ textAlign: "left" }}>Frequently Asked Questions (FAQs)</h1>
        <h5 style={{ padding: "20px 0px" }}>
          Have Questions? We Have Got Answers.
        </h5>

        <div className="faq-accordion">
          {faqData.map((faq, index) => (
            <div key={faq.id} className="accordion-item mb-2">
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion(index)}
              >
                <button
                  className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`}
                  type="button"
                >
                  {index + 1}. {faq.question}
                </button>
              </div>
              <div 
                className={`accordion-collapse ${openIndex === index ? 'show' : ''}`}
              >
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Faqs;
