"use client"

import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Font Awesome icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiUrl } from "@/config";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  ip_address: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    ip_address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [hasStoredConsent, setHasStoredConsent] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/customer-registration`,
        {
          Customer_name: formData.username,
          Customer_phone: formData.phone,
          Customer_address: formData.address,
          Customer_email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          ip_address: formData.ip_address,
        }
      );

      if (response.data.success) {
        setIsOtpSent(true);
        setSuccessMessage(response.data.message);
      } else {
        setError("Registration failed!");
      }
    } catch (error) {
      setError("An error occurred during registration!");
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${apiUrl}/customerverifyOTP`,
        {
          Customer_email: formData.email,
          otp: otp,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Registration completed successfully!");
        router.push("/login");
      } else {
        setError("Invalid OTP. Please try again!");
      }
    } catch (error) {
      setError("An error occurred during OTP verification!");
    }
  };

  return (
    <section className="bg-login">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="box-white">
              <h2 className="text-center">Register</h2>
              {error && <p className="error-text">{error}</p>}
              {successMessage && (
                <p className="success-text">{successMessage}</p>
              )}
              {!isOtpSent ? (
                <form className="mt-4 frm-inp" onSubmit={handleRegister}>
                  <div>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter Your Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter Your Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter Your Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Your Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="eye-icon" onClick={togglePassword}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Your Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="eye-icon" onClick={toggleConfirmPassword}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <div className="d-flex align-contant-center">
                    <input
                      type="checkbox"
                      id="terms"
                      style={{ width: "10px", padding: "8px" }}
                      checked={isChecked}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        setIsChecked(checked);

                        if (checked && !hasStoredConsent) {
                          try {
                            const res = await axios.get(
                              "https://api.ipify.org?format=json"
                            );
                            const ip = res.data.ip;
                            setFormData({
                              ...formData,
                              ip_address: ip,
                            });
                            setHasStoredConsent(true);
                          } catch (err) {
                            console.error("Error fetching IP:", err);
                          }
                        }
                      }}
                      className="form-check-input me-2"
                    />
                    <label htmlFor="terms" className="form-check-label d-flex align-items-center">
                      I agree to the {" "}
                      <Link href="/Terms-Conditions">
                        <p className="text-decoration-underline mb-0"> Terms & Conditions</p>
                      </Link>
                    </label>
                  </div>

                  <button
                    className="auth-btn new-w"
                    type="submit"
                    disabled={!isChecked}
                  >
                    Register
                  </button>

                  <p className="fp-txt">Already have an account?</p>
                  <h4 className="text-center">
                    <Link href="/login">
                      <p>Go to Login</p>
                    </Link>
                  </h4>
                </form>
              ) : (
                <form className="mt-4 frm-inp" onSubmit={handleVerifyOtp}>
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
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
