"use client";

import React, { useState, useEffect } from "react";
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Skeleton,
    TablePagination,
    Rating,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { usePathname } from "next/navigation";
import { apiUrl } from "@/config";

// ---------------- TYPES --------------------
interface DealType {
    user_subscribe_deal_id: number;
    deal_id: number;
    vendorid: number;
    deal_title: string;
    pricecut_price: string;
    regular_price: string;
    dealvalidity_fromdate: string;
    dealvalidity_todate: string;
}

const MyCouponsTab: React.FC = () => {
    const pathname = usePathname();
    const isMyCouponsPage = pathname === "/mycoupons";

    const [deals, setDeals] = useState<DealType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedDeal, setSelectedDeal] = useState<DealType | null>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const [reviewDialogOpen, setReviewDialogOpen] = useState<boolean>(false);
    const [selectedReviewDeal, setSelectedReviewDeal] = useState<DealType | null>(
        null
    );
    const [rating, setRating] = useState<number | null>(0);
    const [submittingReview, setSubmittingReview] = useState<boolean>(false);

    // Fetch Deals on Mount
    useEffect(() => {
        fetchDeals();
    }, []);

    // ---------------- FETCH SUBSCRIBED DEALS --------------------
    const fetchDeals = async () => {
        const customerGUID =
            typeof window !== "undefined"
                ? localStorage.getItem("Customer_GUID")
                : null;

        try {
            const response = await fetch(
                `${apiUrl}/customer/subscribe/deal/detail`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Customer_GUID: customerGUID,
                    }),
                }
            );

            const result = await response.json();

            if (result.success) {
                setDeals(result.data);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Failed to fetch deals:", error);
        } finally {
            setLoading(false);
        }
    };

    // ---------------- MODALS --------------------
    const handleViewDetails = (deal: DealType) => {
        setSelectedDeal(deal);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedDeal(null);
        setOpenDialog(false);
    };

    // ---------------- PAGINATION --------------------
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // ---------------- REVIEW --------------------
    const handleOpenReviewDialog = (deal: DealType) => {
        setSelectedReviewDeal(deal);
        setReviewDialogOpen(true);
        setRating(0);
    };

    const handleCloseReviewDialog = () => {
        setReviewDialogOpen(false);
        setSelectedReviewDeal(null);
        setRating(0);
    };

    const handleSubmitReview = async () => {
        if (!rating) return alert("Please select a rating.");

        const customer_id =
            typeof window !== "undefined"
                ? localStorage.getItem("Customer_GUID")
                : null;

        try {
            setSubmittingReview(true);

            const res = await fetch(
                `${apiUrl}/customer/reviewadd`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        review: rating.toString(),
                        customer_id: customer_id,
                        deal_id: selectedReviewDeal?.deal_id,
                        vendor_id: selectedReviewDeal?.vendorid,
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Review Added Successfully");
                handleCloseReviewDialog();
            } else {
                alert(data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Review submit failed:", error);
            alert("Failed to submit review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <div className={isMyCouponsPage ? "section-padding container" : ""}>
            <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                className={isMyCouponsPage ? "pt-5" : ""}
            >
                My Coupons
            </Typography>

            {/* ---------------- LOADING SKELETON ---------------- */}
            {loading ? (
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Skeleton variant="text" width="80%" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width="60%" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="text" width="60%" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton variant="circular" width={30} height={30} />
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton variant="text" width="80%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="60%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" width="60%" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="circular" width={30} height={30} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : deals.length > 0 ? (
                <>
                    {/* ---------------- DEAL LIST TABLE ---------------- */}
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Deal Title</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Validity</TableCell>
                                    <TableCell>Actions</TableCell>
                                    <TableCell>Rating</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {deals
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((deal) => (
                                        <TableRow key={deal.user_subscribe_deal_id}>
                                            <TableCell>{deal.deal_title}</TableCell>

                                            <TableCell>
                                                ₹{deal.pricecut_price} (Regular: ₹{deal.regular_price})
                                            </TableCell>

                                            <TableCell>
                                                {deal.dealvalidity_fromdate} -{" "}
                                                {deal.dealvalidity_todate}
                                            </TableCell>

                                            <TableCell>
                                                <IconButton onClick={() => handleViewDetails(deal)}>
                                                    <Visibility />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    className="rew-btn text-capitlize"
                                                    onClick={() => handleOpenReviewDialog(deal)}
                                                >
                                                    Review Deal
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ---------------- PAGINATION ---------------- */}
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        className="d-flex justify-content-center mt-4"
                        count={deals.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            ) : (
                <Typography>No deals found!</Typography>
            )}

            {/* ---------------- DEAL VIEW MODAL ---------------- */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle style={{ backgroundColor: "#052c65", color: "white" }}>Deal Details</DialogTitle>

                <DialogContent className="pt-3">
                    {selectedDeal ? (
                        <Box>
                            <Typography>
                                <strong>Title:</strong> {selectedDeal.deal_title}
                            </Typography>

                            <Typography className="mt-2 mb-2">
                                <strong>Price:</strong> ₹{selectedDeal.pricecut_price} (Regular:
                                ₹{selectedDeal.regular_price})
                            </Typography>

                            <Typography>
                                <strong>Validity:</strong>{" "}
                                {selectedDeal.dealvalidity_fromdate} -{" "}
                                {selectedDeal.dealvalidity_todate}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography>No deal selected.</Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} style={{ backgroundColor: "black", color: "white" }}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* ---------------- REVIEW MODAL ---------------- */}
            <Dialog open={reviewDialogOpen} onClose={handleCloseReviewDialog}>
                <DialogTitle style={{ backgroundColor: "#052c65", color: "white" }}>Add Your Review</DialogTitle>

                <DialogContent className="text-center mt-3">
                    <Typography gutterBottom>
                        Rate this deal:{" "}
                        <strong>{selectedReviewDeal?.deal_title ?? ""}</strong>
                    </Typography>

                    <Rating
                        name="deal-rating"
                        value={rating}
                        onChange={(_event, newValue) => setRating(newValue)}
                    />
                </DialogContent>

                <DialogActions className="justify-content-center">
                    <Button onClick={handleCloseReviewDialog} style={{ backgroundColor: "black", color: "white" }}>Cancel</Button>

                    <Button onClick={handleSubmitReview} disabled={submittingReview} style={{ backgroundColor: "black", color: "white" }}>
                        {submittingReview ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MyCouponsTab;
