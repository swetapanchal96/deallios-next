"use client"

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { Button, Input, DatePicker, Select, Spin } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { apiUrl } from "@/config";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const { Option } = Select;

const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        ["link", "image"],
        ["blockquote", "code-block"],
        [{ direction: "rtl" }],
    ],
};

interface Category {
    Categories_id: string | number;
    Category_name: string;
    Subcategories: Subcategory[];
}

interface Subcategory {
    Subcategory_id: string | number;
    Subcategory_name: string;
    parentCategoryId?: string | number;
}

const Description: React.FC<{ onNext: () => void; onPrevious?: () => void }> = ({
    onNext,
    onPrevious,
}) => {
    const router = useRouter();
    // const { state } = useLocation(); // replaced by router.query if needed

    const [heading, setHeading] = useState<string>("");
    const [dealaddress, setDealaddress] = useState<string>("");
    const [Map_link, setMapLink] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dealsId, setDealsId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiDataLoading, setApiDataLoading] = useState<boolean>(true);

    // Dates stored as string in DD-MM-YYYY format
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [offerStartDate, setOfferStartDate] = useState<string | null>(null);
    const [offerEndDate, setOfferEndDate] = useState<string | null>(null);

    const [isPublish, setIsPublish] = useState<number>(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedDealsId = localStorage.getItem("deal_id");
            if (savedDealsId) {
                setDealsId(savedDealsId);
            }
        }
    }, []);

    const fetchDealDetails = async (dealId: string) => {
        setApiDataLoading(true);
        try {
            const response = await axios.post(
                `${apiUrl}/Front/Showtitleordescription`,
                { Deals_id: dealId }
            );

            if (response.data.success) {
                const {
                    main_title,
                    deal_category_id,
                    deal_sub_category_id,
                    deal_address,
                    deal_description,
                    Map_link,
                    display_start_date,
                    display_end_date,
                    offer_start_date,
                    offer_end_date,
                    is_publish,
                } = response.data.data;

                setHeading(main_title);
                setDealaddress(deal_address);
                setDescription(deal_description);
                setMapLink(Map_link);
                setStartDate(display_start_date);
                setEndDate(display_end_date);
                setOfferStartDate(offer_start_date);
                setOfferEndDate(offer_end_date);
                setIsPublish(is_publish);

                setSelectedCategoryId(deal_category_id);

                const selectedCategory = categories.find(
                    (cat) => String(cat.Categories_id) === String(deal_category_id)
                );
                if (selectedCategory) {
                    setSubcategories(selectedCategory.Subcategories || []);
                }

                setSelectedSubcategoryId(deal_sub_category_id);
            } else {
                toast.error(response.data.message || "Failed to fetch deal details.");
            }
        } catch (error) {
            console.error("Error fetching deal details:", error);
            toast.error("Failed to fetch deal details. Please try again later.");
        } finally {
            setApiDataLoading(false);
        }
    };

    useEffect(() => {
        if (dealsId && categories.length > 0) {
            fetchDealDetails(dealsId);
        }
    }, [dealsId, categories]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post(
                    `${apiUrl}/Front/Topmenu`
                );
                setCategories(response.data.data);

                const extractedSubcategories = response.data.data.flatMap((category: Category) =>
                    category.Subcategories.map((sub: Subcategory) => ({
                        ...sub,
                        parentCategoryId: category.Categories_id,
                    }))
                );
                setSubcategories(extractedSubcategories);
            } catch (err) {
                console.error("Error fetching menu list:", err);
            }
        };

        fetchCategories();
    }, []);

    // Handlers with types
    const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeading(e.target.value);
        if (typeof window !== "undefined") {
            localStorage.setItem("heading", e.target.value);
        }
    };

    const handleDealaddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDealaddress(e.target.value);
        if (typeof window !== "undefined") {
            localStorage.setItem("dealaddress", e.target.value);
        }
    };

    const handleMapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMapLink(e.target.value);
        if (typeof window !== "undefined") {
            localStorage.setItem("Map_link", e.target.value);
        }
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        if (typeof window !== "undefined") {
            localStorage.setItem("description", value);
        }
    };

    const handleStartDateChange = (date: Dayjs | null, dateString: string | string[]) => {
        setStartDate(date ? dayjs(date).format("DD-MM-YYYY") : null);
    };

    const handleEndDateChange = (date: Dayjs | null, dateString: string | string[]) => {
        setEndDate(date ? dayjs(date).format("DD-MM-YYYY") : null);
    };

    const handleOfferStartDateChange = (date: Dayjs | null, dateString: string | string[]) => {
        setOfferStartDate(date ? dayjs(date).format("DD-MM-YYYY") : null);
    };

    const handleOfferEndDateChange = (date: Dayjs | null, dateString: string | string[]) => {
        setOfferEndDate(date ? dayjs(date).format("DD-MM-YYYY") : null);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategoryId(value);
        setSelectedSubcategoryId("");
        const selectedCategory = categories.find(
            (cat) => String(cat.Categories_id) === String(value)
        );
        if (selectedCategory) {
            setSubcategories(selectedCategory.Subcategories || []);
        } else {
            setSubcategories([]);
        }
    };

    const handleSubcategoryChange = (value: string) => {
        setSelectedSubcategoryId(value);
    };

    const handleSaveDescription = async () => {
        if (!heading || !description) {
            toast.error("Please fill in both the heading and description.");
            return;
        }

        if (typeof window === "undefined") {
            toast.error("This action can only be performed in the browser.");
            return;
        }

        const vendor_id = localStorage.getItem("vendor_id");
        if (!vendor_id) {
            toast.error("Vendor ID not found. Please login again.");
            return;
        }

        const payload = {
            main_title: heading,
            deal_address: dealaddress,
            deal_category_id: selectedCategoryId,
            deal_sub_category_id: selectedSubcategoryId,
            Map_link,
            vendorid: vendor_id,
            deal_description: description,
            display_start_date: startDate,
            display_end_date: endDate,
            offer_start_date: offerStartDate,
            offer_end_date: offerEndDate,
            ...(dealsId ? { Deals_id: dealsId } : {}),
        };

        

        setLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/Adddesortitle`, payload);
            if (response.data.success) {
                toast.success(
                    dealsId
                        ? "Deal title and description updated successfully!"
                        : "Deal title and description added successfully!"
                );
                if (!dealsId && response.data.data.Deals_id) {
                    const newDealsId = response.data.data.Deals_id;
                    setDealsId(newDealsId);
                    localStorage.setItem("deal_id", newDealsId);
                }
                onNext();
            } else {
                toast.error(response.data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error saving description:", error);
            toast.error("Failed to save the deal. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <Spin spinning={loading || apiDataLoading} tip="Saving...">
            <div className="bg-white p-2">
                <h3>Add a Voucher</h3>
                <Input
                    value={heading}
                    onChange={handleHeadingChange}
                    placeholder="Enter voucher heading"
                    style={{ marginBottom: 16, padding: 10 }}
                />
                <div
                    style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        margin: "20px 0",
                        flexWrap: "wrap",
                    }}
                >
                    <Select
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                        placeholder="Select Category"
                        style={{ width: 200, marginBottom: 10 }}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <Option key={category.Categories_id} value={String(category.Categories_id)}>
                                {category.Category_name}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        value={selectedSubcategoryId}
                        onChange={handleSubcategoryChange}
                        placeholder="Select Subcategory"
                        style={{ width: 200 }}
                        disabled={!selectedCategoryId}
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((sub) => (
                            <Option key={sub.Subcategory_id} value={String(sub.Subcategory_id)}>
                                {sub.Subcategory_name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <Input
                    value={dealaddress}
                    onChange={handleDealaddressChange}
                    placeholder="Enter Deal Address"
                    style={{ marginBottom: 16, padding: 10 }}
                />
                <Input
                    value={Map_link}
                    onChange={handleMapChange}
                    placeholder="Enter Map Link"
                    style={{ marginBottom: 16, padding: 10 }}
                />

                <div className="row d-flex">
                    <div className="col-lg-3">
                        <p className="mb-0">
                            <label>Offer Display Start Date</label>
                        </p>
                        <DatePicker
                            value={startDate ? dayjs(startDate, "DD-MM-YYYY") : null}
                            onChange={handleStartDateChange}
                            placeholder="Select Display Start Date"
                            style={{ marginBottom: 16, width: "100%" }}
                            format="DD-MM-YYYY"
                        />
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0">
                            <label>Offer Display End Date</label>
                        </p>
                        <DatePicker
                            value={endDate ? dayjs(endDate, "DD-MM-YYYY") : null}
                            onChange={handleEndDateChange}
                            placeholder="Select Display End Date"
                            style={{ marginBottom: 16, width: "100%" }}
                            format="DD-MM-YYYY"
                        />
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0">
                            <label>Offer Valid From Date</label>
                        </p>
                        <DatePicker
                            value={offerStartDate ? dayjs(offerStartDate, "DD-MM-YYYY") : null}
                            onChange={handleOfferStartDateChange}
                            placeholder="Select Offer Start Date"
                            style={{ marginBottom: 16, width: "100%" }}
                            format="DD-MM-YYYY"
                        />
                    </div>
                    <div className="col-lg-3">
                        <p className="mb-0">
                            <label>Offer Valid to Date</label>
                        </p>
                        <DatePicker
                            value={offerEndDate ? dayjs(offerEndDate, "DD-MM-YYYY") : null}
                            onChange={handleOfferEndDateChange}
                            placeholder="Select Offer End Date"
                            style={{ marginBottom: 16, width: "100%" }}
                            format="DD-MM-YYYY"
                        />
                    </div>
                </div>
                    <ReactQuill
                        value={description}
                        onChange={handleDescriptionChange}
                        modules={modules}
                        theme="snow"
                        className="text-area-des"
                        placeholder="Enter your description here"
                    />

                <div style={{ marginTop: 16 }} className="mt-5 text-start">
                    <Button
                        className="main-btn"
                        type="primary"
                        onClick={handleSaveDescription}
                        style={{ padding: "20px", marginTop: "15px" }}
                    >
                        {isPublish === 0 ? "Submit" : "Save & Update"}
                    </Button>
                </div>
            </div>
        // </Spin>
    );
};

export default Description;
