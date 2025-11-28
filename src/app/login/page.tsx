// pages/login.tsx (or app/login/page.tsx with "use client")
"use client"; // Remove this line if using Pages Router

import React, { useContext, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For App Router
// import { useRouter } from "next/router"; // For Pages Router
import axios from "axios";
import { CustomAuthContext } from "@/app/components/AuthContext"; // Adjust path as needed
import { apiUrl } from "@/config";

// Type definitions
interface LoginFormData {
  phone: string;
  password: string;
}

interface CustomerDetail {
  Customer_GUID: string;
  Customer_email: string;
}

interface Authorisation {
  token: string;
}

interface LoginResponse {
  success: boolean;
  customerdetail: CustomerDetail;
  authorisation: Authorisation;
}

const Login: React.FC = () => {
  const { login } = useContext(CustomAuthContext);
  const router = useRouter();
  
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    phone: "",
    password: "",
  });
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Location state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationPopupVisible, setLocationPopupVisible] = useState(true);

  const DEFAULT_LAT = 23.0225; // Ahmedabad latitude
  const DEFAULT_LONG = 72.5714; // Ahmedabad longitude

  // Get user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.warn("Location access denied. Using default location.");
          setLatitude(DEFAULT_LAT);
          setLongitude(DEFAULT_LONG);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
      setLatitude(DEFAULT_LAT);
      setLongitude(DEFAULT_LONG);
    }
  }, []);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!latitude || !longitude) {
      setError("Please allow location access before logging in.");
      return;
    }

    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.phone);
      const loginData = isEmail
        ? {
            Customer_email: formData.phone,
            Customerpassword: formData.password,
            latitude,
            longitude,
          }
        : {
            Customer_phone: formData.phone,
            Customerpassword: formData.password,
            latitude,
            longitude,
          };

      const response = await axios.post<LoginResponse>(
        `${apiUrl}/customerlogin`,
        loginData
      );

      if (response.data.success) {
        setMessage("Login successful!");
        const { Customer_GUID, Customer_email } = response.data.customerdetail;
        const { token } = response.data.authorisation;

        // Store location data
        const userLatLong = { lat: latitude, long: longitude };
        localStorage.setItem("userLatLong", JSON.stringify(userLatLong));

        // Store auth data
        localStorage.setItem("Customer_GUID", Customer_GUID);
        localStorage.setItem("token", token);
        localStorage.setItem("email", Customer_email);

        // Auth context login
        login(Customer_GUID, token);
        
        // Navigate to home
        router.push("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <section className="bg-login min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="row -m-4 justify-content-center">
          <div className="col-lg-6 p-4">
            <div className="box-white bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Login</h2>
              
              {message && (
                <p className="success-text bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  {message}
                </p>
              )}
              {error && (
                <p className="error-text bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </p>
              )}

              {!forgotPasswordMode && (
                <form className="mt-4 frm-inp space-y-4" onSubmit={handleLogin}>
                  <div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter Your Phone Number or Email"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className=""
                      required
                    />
                  </div>
                  
                  <div className="password-input-container relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Your Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className=""
                      required
                    />
                    <span 
                      className="eye-icon absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                      onClick={togglePassword}
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                  </div>
                  
                  <button
                    className="auth-btn new-w "
                    type="submit"
                    disabled={!latitude || !longitude}
                  >
                    Login
                  </button>
                  
                  <p
                    className="fp-txt "
                    style={{ cursor:"pointer"}}
                    onClick={() => router.push("/forgot_password")}
                  >
                    Forgot Password?
                  </p>
                </form>
              )}

              {!forgotPasswordMode && (
                <h4 className="text-center mt-6">
                  <Link 
                    href="/register" 
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Haven't An Account?
                  </Link>
                </h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
