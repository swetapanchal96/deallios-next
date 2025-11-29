"use client"
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import loginImg from "@/app/assets/reseller/register_bg.jpg"
import { apiUrl } from "@/config";
import Image from "next/image";

function ResellerForgot() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();

  const sendOtp = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await axios.post(
        `${apiUrl}/vendor/forgot/password`,
        { vendoremail: email }
      );

      if (response.data.success) {
        setOtpSent(true);
        setSuccessMsg(response.data.message);
      } else {
        setError(response.data.message || "Failed to send OTP.");
      }
    } catch (err:any) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await axios.post(
        `${apiUrl}/vendor/forgot/password/verifyOTP`,
        { otp }
      );

      if (response.data.success) {
        setSuccessMsg("OTP verified successfully!");
        router.push("/reseller_login");
        // Or push to reset password page if needed
        // router.push("/reseller_reset_password");
      } else {
        setError(response.data.message || "OTP verification failed.");
      }
    } catch (err:any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-5 mb-5">
      <div className="container">
        <div className="row bg-row-light justify-content-center">
          <div className="col-lg-6 px-0">
            <div>
              <Image
                className="img-fluid"
                src={loginImg}
                alt="Forgot Password Background"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="box-white2 p-4">
              <h2 className="text-center">Forgot Password</h2>
              <form
                onSubmit={otpSent ? verifyOtp : sendOtp}
                className="frm-inp2"
              >
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={otpSent}
                  />
                </div>

                {otpSent && (
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                )}

                {error && <p className="text-danger">{error}</p>}
                {successMsg && <p className="text-success">{successMsg}</p>}

                <button
                  className="auth-btn w-100 new-w"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Please wait..."
                    : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
                </button>

                <div className="text-center mt-2">
                  <p className="mb-0">
                    <Link href="/reseller/reseller_login">Back to Login</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResellerForgot;
