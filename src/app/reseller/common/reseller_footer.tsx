'use client';

import Link from 'next/link';
import React from 'react';
import { FaFacebookSquare, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2a2247] text-white py-5 px-3"
    style={{ backgroundColor: '#2a2247', color: 'white' }}
    >
      <div className="container">
        <div className="row g-3 mb-5">
          {/* Column 1: Quick Links */}
          <div className="col-12 col-sm-4">
            <h3 className="h6 mb-4 fw-bold text-white">Quick Links</h3>
            <ul className="list-unstyled footer-li mb-0">
              <li className="mb-2"><a href="/" className="text-white text-decoration-none footer-link">Home</a></li>
              <li className="mb-2"><a href="/about" className="text-white text-decoration-none footer-link">About Us</a></li>
              <li className="mb-2"><a href="/contact" className="text-white text-decoration-none footer-link">Contact</a></li>
              <li className="mb-2"><a href="/login" className="text-white text-decoration-none footer-link">Login</a></li>
              <li><a href="/register" className="text-white text-decoration-none footer-link">Register</a></li>
            </ul>
          </div>

          {/* Column 2: Social Media */}
          <div className="col-12 col-sm-4">
            <h3 className="h6 mb-4 fw-bold text-white">Follow Us</h3>
            <div className="d-flex gap-3">
              <Link 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white p-3 d-flex align-items-center justify-content-center text-decoration-none transition-all"
                style={{ width: '48px', height: '48px' }}
                aria-label="Facebook"
              >
                <FaFacebookSquare size={25} />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white p-3 d-flex align-items-center justify-content-center text-decoration-none transition-all"
                style={{ width: '50px', height: '50px' }}
                aria-label="Twitter"
              >
                <FaTwitter size={25} />
              </Link>
              <Link 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white p-3 d-flex align-items-center justify-content-center text-decoration-none transition-all"
                style={{ width: '48px', height: '48px' }}
                aria-label="Instagram"
              >
                <FaInstagram size={25} />
              </Link>
            </div>
          </div>

          {/* Column 3: Contact Us */}
          <div className="col-12 col-sm-4">
            <h3 className="h6 mb-4 fw-bold text-white">Contact Us</h3>
            <p className="mb-2 small">Email: info@deallios.in</p>
            <p className="mb-0 small">Phone: +1 234 567 890</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-top border-secondary-subtle pt-4 text-center">
          <p className="mb-0 small">
            © {new Date().getFullYear()} My Website. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
