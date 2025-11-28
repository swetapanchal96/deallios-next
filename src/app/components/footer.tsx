import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlack from "@/app/assets/logoblack.png"

const Footer: React.FC = () => {
  return (
    <>
      <section className="footer section-padding">
        <div className="container">
          <div className="row py-lg-4">
            <div className="col-lg-2 col-sm-6">
              <div className="footer-brand w-100">
                <Image
                  className="img-fluid"
                  src={logoBlack}
                  alt="PriceCut Logo"
                  width={200}
                  height={80}
                  priority
                />
              </div>
            </div>
            <div className="col-lg-2 col-sm-6 mt-5 mt-lg-0">
              <h6 className="text-[#343a40] mb-0">Company</h6>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/how_it_works">How it Works</Link>
                </li>
                <li>
                  <Link href="/services">Our Services</Link>
                </li>
                <li>
                  <Link href="/home_page">Home Page</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-sm-6">
              <h6 className="text-gray-900 mb-0">Work with Us</h6>
              <ul>
                <li>
                  <Link href="/reseller">Join Deallios&apos;s Marketplace</Link>
                </li>
                <li>
                  <Link href="/affiliate">Affiliate Program</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-sm-6">
              <h6 className="text-gray-900 mb-0">More</h6>
              <ul>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/Terms-Conditions">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link href="/Additional-Consideration">
                    Additional Consideration
                  </Link>
                </li>
                <li>
                  <Link href="/faqs">FAQs</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-sm-6">
              <iframe
                title="Ahmedabad Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.170708781631!2d72.57136217407403!3d23.082762979130323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f351f7ad8f%3A0x91a514db2193051c!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1719590502301!5m2!1sen!2sin"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        <div className="container d-none">
          <h6>Check out deals and discounts</h6>
          <p>
            Groupon is an easy way to get huge discounts while discovering fun
            activities in your city. Our daily local deals consist of
            restaurants, beauty, travel, ticket vouchers, hotels, and a whole
            lot more, in hundreds of cities across the world. Discover the best
            gift ideas with Groupon: check out great deals for Black Friday,
            Gifts for Mother&apos;s Day, Gifts for Him, Gifts for Her, Gifts for
            Couples, Birthday Gifts and Affordable Gifts.
          </p>
        </div>
      </section>

      <section className="py-4 bg-white osahan-copyright">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="d-flex align-items-center justify-content-between">
                <p className="m-0 text-secondary">Copyright © PriceCut 2024</p>
                <p className="m-0">
                  <Link href="/about" className="text-secondary">
                    About Us
                  </Link>
                  &nbsp; · &nbsp;
                  <Link href="/privacy" className="text-secondary">
                    Privacy Policy
                  </Link>
                  &nbsp; · &nbsp;
                  <Link href="/terms" className="text-secondary">
                    Terms &amp; Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
