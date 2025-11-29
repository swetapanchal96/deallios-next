'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import loginImg from "@/app/assets/reseller/register_bg.jpg"
import { apiUrl } from "@/config";

interface FormData {
  vendorname: string;
  vendormobile: string;
  businessname: string;
  vendoraddress: string;
  vendorsocialpage: string;
  businesscategory: string;
  businessubcategory: string;
  vendorstate: string;
  vendorcity: string;
  latitude: string;
  longitude: string;
  password: string;
  confirm_password: string;
}

interface State {
  stateId: string;
  stateName: string;
}

interface City {
  cityId: string;
  cityName: string;
}

interface Category {
  Categories_id: string;
  Category_name: string;
}

const Reseller: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    vendorname: "",
    vendormobile: "",
    businessname: "",
    vendoraddress: "",
    vendorsocialpage: "",
    businesscategory: "",
    businessubcategory: "",
    vendorstate: "",
    vendorcity: "",
    latitude: "",
    longitude: "",
    password: "",
    confirm_password: "",
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [catagories, setCatagories] = useState<Category[]>([]);
  const [cityInputVisible, setCityInputVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // Fetch state list on component mount
    axios
      .get(`${apiUrl}/states`)
      .then((response) => {
        if (response.data.success) {
          setStates(response.data.data);
        } else {
          setErrorMessage("Failed to fetch states.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
        setErrorMessage("Failed to fetch states.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      });

    // Get user's current location (latitude and longitude)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prevState) => ({
          ...prevState,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      });
    }
  }, []);

  useEffect(() => {
    axios.get(`${apiUrl}/categories`).then((response) => {
      if (response.data.data) {
        setCatagories(response.data.data);
      } else {
        setErrorMessage("Failed to fetch Categories.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Fetch cities when state is selected
    if (name === "vendorstate") {
      axios
        .post(`${apiUrl}/city`, { stateid: value })
        .then((response) => {
          if (response.data.success) {
            if (response.data.data.length === 0) {
              setCityInputVisible(true);
              setCities([]);
            } else {
              setCities(response.data.data);
              setCityInputVisible(false);
            }
          } else {
            setErrorMessage(response.data.message || "No data found.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            setCityInputVisible(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
          setErrorMessage("Failed to fetch cities.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
          setCityInputVisible(true);
        });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const resetForm = () => {
    setFormData({
      vendorname: "",
      vendormobile: "",
      businessname: "",
      vendoraddress: "",
      vendorsocialpage: "",
      businesscategory: "",
      businessubcategory: "",
      vendorstate: "",
      vendorcity: "",
      latitude: "",
      longitude: "",
      password: "",
      confirm_password: "",
    });
    setOtp("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordCriteria =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordCriteria.test(formData.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/new-registration`,
        { ...formData, vendoremail: email }
      );

      if (response.data.success) {
        setIsOtpSent(true);
        setErrorMessage(response.data.message || "OTP sent successfully!");
        setSnackbarSeverity("success");
      } else {
        if (response.data.message) {
          setErrorMessage(response.data.message);
        } else if (response.data.errors) {
          const errorMessages = Object.values(response.data.errors)
            .flat()
            .join(", ");
          setErrorMessage(errorMessages || "Registration failed.");
        } else {
          setErrorMessage("Registration failed.");
        }
        setSnackbarSeverity("error");
      }
      setOpenSnackbar(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      } else {
        setErrorMessage("Network error. Please try again later.");
      }
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/verifyOTP`,
        {
          vendoremail: email,
          otp,
        }
      );
      if (response.data.success) {
        setErrorMessage("Credentials have been sent to your registered email.");
        setSnackbarSeverity("success");
        resetForm();
        router.push("/reseller_login");
      } else {
        if (response.data.errors) {
          const errorMessages = Object.values(response.data.errors)
            .flat()
            .join(", ");
          setErrorMessage(errorMessages || "OTP verification failed.");
        } else {
          setErrorMessage(response.data.message || "OTP verification failed.");
        }
        setSnackbarSeverity("error");
      }
      setOpenSnackbar(true);
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrorMessage("OTP verification failed. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <section className="mt-5 mb-5">
        <div className="container">
          <div>
            <h1>Promote Your Business with Deallios Merchant</h1>
            <p className="cm-txt">
              Reach New Customers. Build Loyalty. Become a True Destination.
            </p>
          </div>
          <div className="row bg-row-light">
            <div className="col-lg-6 px-0">
              <Image
                className=" bg-register"
                src={loginImg}
                alt="Register Background"
                width={800}
                height={680}
                priority={false}
              />
            </div>
            <div className="col-lg-6">
              <div className="box-white2">
                {!isOtpSent && (
                  <form onSubmit={handleRegister} className="frm-inp2">
                    <input
                      type="text"
                      name="vendorname"
                      placeholder="Full Name"
                      value={formData.vendorname}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="email"
                      name="vendoremail"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                    <input
                      type="tel"
                      name="vendormobile"
                      placeholder="Phone Number"
                      value={formData.vendormobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="mb-2"
                      required
                    />
                    <select
                      name="businesscategory"
                      value={formData.businesscategory}
                      onChange={handleInputChange}
                      className="mb-2"
                      required
                    >
                      <option value="">Choose a category</option>
                      {catagories.map((catagorie) => (
                        <option
                          key={catagorie.Categories_id}
                          value={catagorie.Categories_id}
                        >
                          {catagorie.Category_name}
                        </option>
                      ))}
                    </select>
                    <select
                      name="vendorstate"
                      value={formData.vendorstate}
                      onChange={handleInputChange}
                      className="mb-2"
                      required
                    >
                      <option value="">Choose a state</option>
                      {states.map((state) => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.stateName}
                        </option>
                      ))}
                    </select>
                    {cityInputVisible ? (
                      <input
                        type="text"
                        name="vendorcity"
                        placeholder="Enter City"
                        value={formData.vendorcity}
                        onChange={handleInputChange}
                        className="mb-2"
                        required
                      />
                    ) : (
                      <select
                        name="vendorcity"
                        value={formData.vendorcity}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Choose a city</option>
                        {cities.map((city) => (
                          <option key={city.cityId} value={city.cityId}>
                            {city.cityName}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      name="businessname"
                      placeholder="Business Name"
                      value={formData.businessname}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="vendoraddress"
                      placeholder="Business Address"
                      value={formData.vendoraddress}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="url"
                      name="vendorsocialpage"
                      placeholder="Website Or Social Media Page"
                      value={formData.vendorsocialpage}
                      onChange={handleInputChange}
                    />
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                      <span
                        className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                        onClick={togglePassword}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleInputChange}
                        required
                      />
                      <span
                        className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                        onClick={togglePassword}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <button type="submit" className="auth-btn w-100 new-w">
                      Register Now
                    </button>
                  </form>
                )}
                {isOtpSent && (
                  <form onSubmit={handleVerifyOtp} className="frm-inp2">
                    <input
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                      required
                    />
                    <button type="submit" className="auth-btn w-100">
                      Verify OTP
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default Reseller;
