"use client";

import React, { useState, useEffect } from "react";
import { Skeleton, Box, Pagination } from "@mui/material";
import axios from "axios";
import { Button } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "@/config";

/* ------------------------------------------------------
   🔰 TYPES
-------------------------------------------------------*/
interface Vendor {
    latitude: number | null;
    longitude: number | null;
    vendoraddress: string;
}

interface DealOption {
    regular_price: number | null;
    pricecut_price: number | null;
    discount_percentage: number | null;
}

interface DealImage {
    photo: string | null;
}

interface DealStore {
    Deals_id: number;
    GUID: string;
    deals_slug: string;
    business_type: string;
    main_title: string;
    average_rating: number | null;
    vendor: Vendor | null;
    options: DealOption[];
    images: DealImage[];
}

interface City {
    id: number;
    city_name: string;
}

interface SubCategory {
    iSubCategoryId: number;
    strSlugName: string;
    strSubCategoryName: string;
}

/* ------------------------------------------------------
   🔰 COMPONENT
-------------------------------------------------------*/
export default function SearchResults() {
    const [loading, setLoading] = useState<boolean>(true);
    const [stores, setStores] = useState<DealStore[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [userLatLong, setUserLatLong] = useState<{ lat: number; long: number } | null>(null);
    const [distance, setDistance] = useState<string | null>(null);

    const itemsPerPage = 6;

    const router = useRouter();
    const searchParams = useSearchParams();

    const query = searchParams.get("query") || "";
    const cityQuery = searchParams.get("city") || "";
    const categorySlug = searchParams.get("category");

    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    const paginatedStores = stores.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    /* ------------------------------------------------------
       🔰 Fetching Cities
    -------------------------------------------------------*/
    const fetchCities = async () => {
        try {
            const response = await axios.post(`${apiUrl}/city`);
            setCities(response.data.data);
        } catch (err) {
            console.error("Error fetching cities:", err);
        }
    };

    useEffect(() => {
        setSearchInput(query);
        fetchCities();
    }, []);

    /* ------------------------------------------------------
       🔰 Subcategories Fetch
    -------------------------------------------------------*/
    const subcategoryfetch = async () => {
        if (!categorySlug) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${apiUrl}/subcategories`, {
                CategorySlugname: categorySlug,
            });

            setSubCategories(response.data.data || []);
        } catch (err) {
            setError("Failed to fetch subcategories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        subcategoryfetch();
    }, [categorySlug]);

    /* ------------------------------------------------------
       🔰 Deals Search API
    -------------------------------------------------------*/
    const fetchDeals = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${apiUrl}/Front/Dealsearch`, {
                lat: userLatLong?.lat || "22.9866501",
                long: userLatLong?.long || "72.5796216",
                ...(cityQuery && { city: cityQuery }),
                ...(categorySlug && { CategorySlugname: categorySlug }),
                ...(selectedSubCategoryId && { subcategory_slug: selectedSubCategoryId }),
                ...(query && { Title: query }),
            });

            if (response.data.success && response.data.popular_deals) {
                setStores(response.data.data);
                setTotalPages(Math.ceil(response.data.popular_deals.length / itemsPerPage));
            } else {
                setStores([]);
                setTotalPages(1);
                setError("No deals found.");
            }
        } catch (err) {
            setError("Failed to fetch deals.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, [query, cityQuery, categorySlug, selectedSubCategoryId]);

    /* ------------------------------------------------------
       🔰 Distance Calculation
    -------------------------------------------------------*/
    const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): string => {
        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;

        return distanceKm < 1
            ? `${Math.round(distanceKm * 1000)} m`
            : `${distanceKm.toFixed(1)} Km`;
    };

    /* ------------------------------------------------------
       🔰 JSX
    -------------------------------------------------------*/
    return (
        <section className="section-padding homepage-view-offers topstores">
            <div className="container bg-2 new-b12">
                {/* SUBCATEGORY FILTERS */}
                <div className="mb-4 d-flex flex-wrap gap-2">
                    {subCategories.map((cat) => (
                        <Button
                            key={cat.iSubCategoryId}
                            onClick={() => {
                                setSelectedSubCategoryId(cat.strSlugName);
                                setSelectedSubCategory(cat.strSubCategoryName);
                                setCurrentPage(1);
                            }}
                            className={`btn btn-sm ${selectedSubCategory === cat.strSubCategoryName ? "active-category" : ""
                                }`}
                            style={{ background: "#262643", color: "white" }}
                        >
                            {cat.strSubCategoryName}
                        </Button>
                    ))}
                </div>

                {error && <p className="text-danger">{error}</p>}

                {/* DEAL CARDS */}
                <div className="row">
                    {loading
                        ? [...new Array(6)].map((_, idx) => (
                            <div key={idx} className="col-xl-4 col-sm-6">
                                <Skeleton variant="rectangular" width="100%" height={200} />
                            </div>
                        ))
                        : paginatedStores.map((store) => {
                            const discount = store.options?.[0]?.discount_percentage || null;
                            const regularPrice = store.options?.[0]?.regular_price;
                            const dealPrice = store.options?.[0]?.pricecut_price;

                            return (
                                <div key={store.Deals_id} className="col-xl-4 col-sm-6 custom-card-block">
                                    <div className="custom-card border rounded shadow-sm overflow-hidden">
                                        <Link href={`/deal/${store.GUID}`}>
                                            <img
                                                className="img-fluid w-100"
                                                src={store.images?.[0]?.photo || "/images/placeholder.png"}
                                                alt={store.business_type}
                                                style={{ height: "185px", objectFit: "cover" }}
                                            />
                                        </Link>

                                        {discount !== null && (
                                            <span
                                                className="badge position-absolute top-0 end-0 m-2"
                                                style={{ backgroundColor: "#00ff00", color: "#000" }}
                                            >
                                                -{discount}%
                                            </span>
                                        )}

                                        <div className="p-2">
                                            <h6>
                                                <Link href={`/deal/${store.GUID}`} className="fw-bold">
                                                    {store.main_title}
                                                </Link>
                                            </h6>

                                            <p className="address">{store.vendor?.vendoraddress}</p>

                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-decoration-line-through fw-bold">
                                                    ₹{regularPrice}
                                                </span>

                                                <span className="fw-bold" style={{ color: "#7E40B2" }}>
                                                    ₹{dealPrice}
                                                </span>
                                            </div>

                                            <a
                                                href="#"
                                                className="btn btn-sm"
                                                style={{
                                                    background: "#A36DB5",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    width: 100,
                                                }}
                                            >
                                                Get Offer
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(e, page) => setCurrentPage(page)}
                            color="primary"
                            shape="rounded"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
