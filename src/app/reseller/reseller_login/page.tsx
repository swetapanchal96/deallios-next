"use client"
import { useState, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import loginImg from "@/app/assets/reseller/register_bg.jpg"
import { apiUrl } from "@/config";

const ResellerLogin: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loginInput, setLoginInput] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginInput);
            const isMobile = /^\d{10}$/.test(loginInput);

            if (!isEmail && !isMobile) {
                throw new Error(
                    "Please enter a valid email or 10-digit mobile number."
                );
            }

            const payload = isEmail
                ? { vendoremail: loginInput, vendorpassword: password }
                : { vendormobile: loginInput, vendorpassword: password };

            const { data } = await axios.post(
                `${apiUrl}/login`,
                payload
            );

            console.log("API Response:", data);

            if (data.success) {
                const customerdetail = data.customerdetail || data.vendordetail; // Support both response types
                const { authorisation } = data;

                if (customerdetail?.vendor_id) {
                    localStorage.setItem("vendor_id", customerdetail.vendor_id);
                }

                if (authorisation?.token) {
                    localStorage.setItem("token", authorisation.token);
                }

                router.push("/reseller_dashboard");
            } else {
                setError(data.message || "Login failed.");
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Unable to login. Please try again later.";
            setError(errorMessage);
            console.error("Error during login:", err);
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
                                alt="Reseller Registration Background"
                                width={1920}       // ✔ required
                                height={1080}      // ✔ required
                                priority           // (optional) loads faster
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="box-white2 p-4">
                            <h2 className="text-center">Login</h2>
                            <form onSubmit={handleLogin} className="frm-inp2">
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Mobile Number or Email"
                                        value={loginInput}
                                        onChange={(e) => setLoginInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3 position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter Your Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        className="position-absolute end-0 top-50 translate-middle-y me-3 cursor-pointer"
                                        onClick={togglePassword}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                <button
                                    className="auth-btn w-100 new-w"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>

                                <div className="text-center mt-2">
                                    <p className="mb-0">
                                        <Link href="/reseller_forgot">Forgot Password?</Link>
                                    </p>
                                    <p>
                                        Don’t have an account?{" "}
                                        <Link href="/reseller">Register here</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResellerLogin;
