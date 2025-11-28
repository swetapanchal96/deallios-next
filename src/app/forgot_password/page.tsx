"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/config";

const ForgotPasswordPage: React.FC = () => {
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!forgotEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/customer/forgot/password`,
        {
          Customer_email: forgotEmail,
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || "OTP sent successfully.");
        setOtpSent(true);
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError("An error occurred while sending the OTP.");
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/customer/forgot/password/verifyOTP`,
        {
          otp: otp,
        }
      );

      if (response.data.success) {
        setMessage(response.data.message || "OTP verified successfully.");
        setOtpVerified(true);

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(response.data.message || "Invalid OTP.");
      }
    } catch (err) {
      setError("An error occurred during OTP verification.");
    }
  };

  return (
    <section className="bg-login">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="box-white">
              <h2 className="text-center">Forgot Password</h2>
              {message && <p className="success-text">{message}</p>}
              {error && <p className="error-text">{error}</p>}

              <form
                className="mt-4 frm-inp"
                onSubmit={otpSent ? handleVerifyOtp : handleForgotPassword}
              >
                {!otpSent ? (
                  <>
                    <div>
                      <input
                        type="email"
                        placeholder="Enter Your Registered Email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button className="auth-btn new-w" type="submit">
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <button className="auth-btn new-w" type="submit">
                      Verify OTP
                    </button>
                  </>
                )}

                <p
                  className="fp-txt"
                  style={{ cursor:"pointer"}}
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Back to Login
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
