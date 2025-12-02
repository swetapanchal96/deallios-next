"use client";

import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { CustomAuthContext } from "../components/AuthContext";
import { UserProfileContext } from "../components/UserProfileContext";
import Image from "next/image";
import lightLogo from '@/app/assets/logowhite.png'
import blinking from '@/app/assets/bg-imgs.svg'
import ScrollToTop from "./scrollToTop";
import { apiUrl } from "@/config";

const Header = () => {
    const { avatar } = useContext(UserProfileContext);
    const { isLoggedIn, logout } = useContext(CustomAuthContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSigninBoxOpen, setIsSigninBoxOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [responseData, setResponseData] = useState<any>(null);
    const [searchInput, setSearchInput] = useState("");
    const [cityQuery, setCityQuery] = useState("1");
    const [deals, setDeals] = useState<any[]>([]);
    const [filteredDeals, setFilteredDeals] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [cities, setCities] = useState<any[]>([]);
    const searchContainerRef = useRef<HTMLDivElement | null>(null);

    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const toggleSigninBox = () => {
        setIsSigninBoxOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        setShowDropdown(false);
        logout();
        setOpenSnackbar(true);
    };

    useEffect(() => {
        console.log("Login status changed:", isLoggedIn);
    }, [isLoggedIn]);

    useEffect(() => {
        if (cities.length > 0) {
            const ahmedabad = cities.find(
                (city: any) => city.cityName.toLowerCase() === "ahmedabad"
            );
            if (ahmedabad) {
                setCityQuery(ahmedabad.cityId);
            }
        }
    }, [cities]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post(
                    `${apiUrl}/Front/Topmenu`
                );
                setCategories(response.data.data);
                const extractedSubcategories = response.data.data.flatMap(
                    (category: any) =>
                        category.Subcategories.map((sub: any) => ({
                            ...sub,
                            parentCategoryId: category.Categories_id,
                        }))
                );
                setSubcategories(extractedSubcategories);
            } catch (err: any) {
                console.error("Error fetching menu list:", err);
                setError(err.message);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.post(
                    `${apiUrl}/city`
                );
                setCities(response.data.data);
            } catch (err) {
                console.error("Error fetching cities:", err);
            }
        };

        fetchCities();
    }, []);

    const handleSearch = async () => {
        setDeals([]);
        setError(null);
        setShowResults(true);
        if (!searchInput.trim() && !cityQuery) {
            setError("Please enter search terms or select a city");
            return;
        }

        try {
            let lat = "22.9866501";
            let long = "72.5796216";

            if (cityQuery) {
                const selectedCity = cities.find(
                    (city: any) => String(city.cityId) === String(cityQuery)
                );

                if (selectedCity) {
                    const geoResponse = await axios.get(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                            selectedCity.cityName
                        )}`
                    );

                    if (geoResponse.data.length === 0) {
                        setError("City not found");
                        return;
                    }

                    lat = geoResponse.data.lat;
                    long = geoResponse.data.lon;
                }
            }

            const response = await axios.post(
                `${apiUrl}/Front/Dealsearch`,
                {
                    lat,
                    long,
                    Title: searchInput,
                    businessname: searchInput,
                    ...(cityQuery && { city: cityQuery }),
                }
            );

            if (response.data.success && response.data.data.length > 0) {
                setResponseData(response.data);
            } else {
                setError("No deals found matching your criteria");
            }
        } catch (error) {
            setError("No deals found matching your criteria.");
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setError(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleResultClick = (guid: string) => {
        setSearchInput("");
        setDeals([]);
        router.push(`/deal/${guid}`);
    };

    useEffect(() => {
        if (responseData) {
            if (searchInput.trim() === "") {
                setDeals(responseData.popular_deals);
            } else {
                const filtered = responseData.data.filter((item: any) => {
                    return (
                        item.main_title
                            .toLowerCase()
                            .includes(searchInput.toLowerCase()) ||
                        item.vendor.vendoraddress
                            .toLowerCase()
                            .includes(searchInput.toLowerCase())
                    );
                });
                setDeals(filtered);
            }
        }
    }, [searchInput, responseData]);

    const handleInputClick = async () => {
        setError(null);
        setShowResults(!showResults);

        let lat = "22.9866501";
        let long = "72.5796216";

        if (cityQuery) {
            const selectedCity = cities.find(
                (city: any) => String(city.cityId) === String(cityQuery)
            );

            if (selectedCity) {
                const geoResponse = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        selectedCity.cityName
                    )}`
                );

                if (geoResponse.data.length > 0) {
                    lat = geoResponse.data.lat;
                    long = geoResponse.data.lon;
                }
            }
        }

        try {
            const response = await axios.post(
                `${apiUrl}/Front/Dealsearch`,
                {
                    lat,
                    long,
                    Title: "",
                    businessname: "",
                    ...(cityQuery && { city: cityQuery }),
                }
            );

            if (response.data.success && response.data.popular_deals) {
                setResponseData(response.data);
                setDeals(response.data.popular_deals);
            } else {
                setDeals([]);
                setError("No popular deals found for the selected city");
            }
        } catch (error) {
            console.error("Error fetching popular deals:", error);
            setError("Error fetching popular deals.");
        }
    };

    const handleCategoryClick = async (categoryId: string | number, slug: string) => {

        const safeSlug = encodeURIComponent(slug);
        setError(null);

        let lat = "22.9866501";
        let long = "72.5796216";

        if (cityQuery) {
            const selectedCity = cities.find(
                (city: any) => String(city.cityId) === String(cityQuery)
            );

            if (selectedCity) {
                const geoResponse = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        selectedCity.cityName
                    )}`
                );

                if (geoResponse.data.length > 0) {
                    lat = geoResponse.data.lat;
                    long = geoResponse.data.lon;
                }
            }
        }

        try {
            const response = await axios.post(
                `${apiUrl}/Front/Dealsearch`,
                {
                    lat,
                    long,
                    Title: "",
                    businessname: "",
                    ...(cityQuery && { city: cityQuery }),
                    ...(categoryId && { category_id: categoryId }),
                }
            );

            if (response.data.success) {
                setResponseData(response.data);
                setDeals(response.data.popular_deals);
            } else {
                setDeals([]);
                setError("No deals found for this category");
            }

            router.push(
                `/search?category=${safeSlug}${cityQuery ? `&city=${""}` : ""}`
            );
        } catch (error) {
            console.error("Error fetching category deals:", error);
        }
    };
    console.log(deals, "dealsdeals")
    return (
        <>
            <ScrollToTop />
            <section className="top-header-bar">
                <div
                    className="d-flex align-items-center justify-content-between flex-wrap px-3 w-100"
                    style={{ height: "40px", position: "relative", zIndex: 2 }}
                >
                    <div className="d-none d-md-block">
                        <h6 className="mb-0 text-black">Welcome To Deallios</h6>
                    </div>

                    <div className=" ms-auto vendor-buttons">
                        <button
                            className="btn btn-sm d-flex align-items-center gap-2"
                            style={{
                                backgroundColor: "transparent",
                                color: "rgb(190, 133, 209)",
                                fontWeight: "bold",
                                border: "none",
                            }}
                            onClick={() => router.push("reseller/reseller_login/")}
                        >
                            <i className="fa fa-handshake"></i>Deal Partner Login
                        </button>
                    </div>
                </div>
            </section>

            <section className="header mb-0">
                <header className="container posi-rel">
                    <div className=" d-flex align-items-center  flex-wrap">
                        <div className="col-lg-3 ">
                            <Link className="navbar-brand" href="/">
                                <Image
                                    src={lightLogo}
                                    alt="Logo"
                                    width={140}   // required
                                    height={50}   // required
                                    className="img-fluid"
                                    priority      // optional: makes logo load instantly
                                />
                            </Link>
                        </div>

                        <div className="col-lg-7 col-md-12 col-sm-12 my-2 psrel ">
                            <div className="bg-white rounded px-3 py-2">
                                <div className="row gx-2 align-items-center">
                                    <div className="col-12 col-md-6">
                                        <input
                                            type="text"
                                            className="form-control search w-100"
                                            placeholder="Search deals or business name"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onClick={handleInputClick}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="d-flex align-items-center gap-2">
                                            <select
                                                className="form-control location w-100"
                                                value={cityQuery}
                                                onChange={(e) => setCityQuery(e.target.value)}
                                            >
                                                <option value="">Enter a Location</option>
                                                {cities.map((city: any) => (
                                                    <option key={city.cityId} value={city.cityId}>
                                                        {city.cityName} ({city.stateName})
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                                                type="button"
                                                onClick={handleSearch}
                                                style={{ width: "40px", height: "40px" }}
                                            >
                                                <i className="fa fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div ref={searchContainerRef} className="mt-3 posi-ab">
                                {error && (
                                    <div className="alert alert-danger mt-2">{error}</div>
                                )}

                                {showResults && deals.length > 0 ? (
                                    <div className="position-relative search-results-container">
                                        <div
                                            className="deals-scroll-vertical pe-2"
                                            style={{
                                                maxHeight: "70vh",
                                                overflowY: "auto",
                                                paddingRight: "8px",
                                            }}
                                        >
                                            {deals.map((deal: any) => (
                                                <div
                                                    key={deal.Deals_id}
                                                    className="deal-item mb-3 p-2 border rounded"
                                                >
                                                    <div className="d-flex flex-wrap align-items-start">
                                                        <div className="w-50 pe-2">
                                                            {deal.images.length > 0 && (
                                                                <Image
                                                                    src={deal.images[0].photo || "/placeholder.png"}
                                                                    alt={deal.main_title || "deal image"}
                                                                    width={500}
                                                                    height={300}
                                                                    className="serach-deal-img w-100 rounded object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                        <div
                                                            className="w-50"
                                                            onClick={() => handleResultClick(deal.GUID)}
                                                        >
                                                            <Link
                                                                className="fw-bold title-txt text-black mb-0 pb-0"
                                                                href="#"
                                                                title={deal.deals_slug}
                                                            >
                                                                {deal.main_title}
                                                            </Link>
                                                            <div className="mt-1">
                                                                {deal.options.map((option: any) => (
                                                                    <div
                                                                        key={option.deal_option_id}
                                                                        className="fw-bold title-txt2"
                                                                    >
                                                                        {option.option_title} - ₹
                                                                        {option.pricecut_price}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="view-all-button-fixed text-center pt-2 px-2">
                                            <button
                                                className="btn btn-primary w-100 rounded-pill py-2 fw-bold"
                                                onClick={() => {
                                                    router.push(
                                                        `/search?query=${searchInput}&city=${cityQuery}`
                                                    );
                                                    setShowResults(false);
                                                }}
                                            >
                                                <i className="fa fa-search me-2"></i> View All Results
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    !error &&
                                    (searchInput || cityQuery) &&
                                    showResults && (
                                        <div className="alert alert-info mt-2">
                                            Start typing and search results will appear.
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div className=" col-lg-1 col-xl-2">
                            <div className=" ">
                                <div className="text-right d-flex align-items-center justify-content-end">
                                    {isLoggedIn ? (
                                        <div className="dropdown">
                                            <img
                                                src={
                                                    avatar ||
                                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Jf7L1uLyKL81OhzN2fk-x0OSKXABNLEZYg&s"
                                                }
                                                alt="Profile Avatar"
                                                className="rounded-circle avatar"
                                                onClick={() => setShowDropdown(!showDropdown)}
                                                style={{ cursor: "pointer" }}
                                            />
                                            {showDropdown && (
                                                <div className="dropdown-menu show">
                                                    <Link
                                                        href="/my-profile"
                                                        className="dropdown-item"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        My Profile
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="dropdown-item"
                                                        onClick={handleLogout}
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="dropdown">
                                            <button
                                                type="button"
                                                className="sign_btn"
                                            // onClick={toggleSigninBox}
                                            >
                                                <Link href="/login">Sign In</Link>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="hamburger-menu">
                                <input
                                    id="menu__toggle"
                                    type="checkbox"
                                    checked={isMenuOpen}
                                    onChange={toggleMenu}
                                    style={{ background: "", padding: "10px" }}
                                />

                                <label className="menu__btn" htmlFor="menu__toggle">
                                    <span></span>
                                </label>

                                <ul
                                    className={`menu__box ${isMenuOpen ? "open" : ""}`}
                                    aria-hidden={!isMenuOpen}
                                >
                                    {isLoggedIn ? (
                                        <>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    Home
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/about">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    About Us
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/how_it_works">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    How It Works
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/services">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    Our Services
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/contact">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    Contact Us
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/my-profile">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/mycoupons">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    My Coupons
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <a href="#" onClick={handleLogout}>
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    Logout
                                                </a>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/login">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    Sign In
                                                </Link>
                                            </li>
                                            <li onClick={() => setIsMenuOpen(false)}>
                                                <Link href="/mycoupons">
                                                    <svg width="24" height="24" className="icon">
                                                        <path d="..." />
                                                    </svg>
                                                    My Coupons
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="category-wrapper">
                                <ul className="category">
                                    {categories.map((category: any) => {
                                        return (
                                            <li
                                                className="dropdown-menu-parent"
                                                key={category.Categories_id}
                                            >
                                                <button
                                                    className="dropdown-category"
                                                    onClick={() =>
                                                        handleCategoryClick(
                                                            category.Categories_id,
                                                            category.Categories_slug
                                                        )
                                                    }
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        padding: "0",
                                                        textAlign: "left",
                                                        width: "100%",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    <img
                                                        src={category.Categories_icon}
                                                        alt={category.Category_name}
                                                        style={{
                                                            width: "24px",
                                                            height: "24px",
                                                            marginRight: "8px",
                                                        }}
                                                    />
                                                    {category.Category_name}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="ps-ab " style={{ width: "100%", height: "85px" }}>
                    <Image
                        src={blinking}
                        alt="blinking background"
                        fill
                        className="img-fluid blinking-img "
                        priority
                    />
                </div>
            </section>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="success"
                    variant="filled"
                >
                    You have logged out!
                </Alert>
            </Snackbar>
        </>
    );
};

export default Header;