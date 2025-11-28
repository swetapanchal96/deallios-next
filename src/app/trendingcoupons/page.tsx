"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import "./CouponsCard.css";
import { apiUrl } from "@/config";
import Image from "next/image";

interface Coupon {
    promo_id: string;
    GUID: string;
    promo_name: string;
    pro_img?: string;
    end_date: string;
}

const getDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

const TrandingCoupans: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/Front/FrontPromocodelist`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({}),
                    }
                );

                if (!response.ok)
                    throw new Error(`HTTP error! Status: ${response.status}`);

                const result = (await response.json()) as {
                    success: boolean;
                    data: Coupon[];
                };

                if (result.success) setCoupons(result.data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    return (
        <section className="coupon-section py-4">
            <div className="container bg-1 new-b12">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h5 mb-0 text-gray-900">🔥 Trending Coupons</h1>
                </div>

                {loading ? (
                    <div className="row">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="col-xl-4 col-md-6 mb-4">
                                <Skeleton variant="rectangular" width="100%" height={250} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row">
                        {coupons.map((coupon) => {
                            const dateObj = new Date(coupon.end_date);
                            const formattedDate = `${dateObj.getDate()}${getDaySuffix(
                                dateObj.getDate()
                            )}-${dateObj.toLocaleDateString("en-GB", {
                                month: "short",
                                year: "numeric",
                            })}`;

                            return (
                                <div
                                    key={coupon.promo_id}
                                    className="col-xl-4 col-sm-6 custom-card-block"
                                    onClick={() => router.push(`/promocode_detail/${coupon.GUID}`)}
                                >
                                    <div className="custom-card">
                                        <div className="custom-card-image">
                                            <Image
                                                className="coupon-image"
                                                src={
                                                    coupon.pro_img ||
                                                    "https://via.placeholder.com/300x200?text=Coupon"
                                                }
                                                alt={coupon.promo_name}
                                                width={300}
                                                height={200}
                                                priority={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TrandingCoupans;
