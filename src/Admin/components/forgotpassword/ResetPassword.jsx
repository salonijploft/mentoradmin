import React, { useState, useEffect } from "react";
import { logo1 } from "../imagepath";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Spinner } from "react-bootstrap";
import Loader from "../../components/Loader.js";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [resetToken, setResetToken] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get("token");

        if (!tokenFromUrl) {
            toast.error("Reset token is missing! Redirecting to login...", { position: "top-right" });
            navigate("/login");
        } else {
            setResetToken(tokenFromUrl);
        }
    }, [location, navigate]);

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string()
          .required("New password is required")
          .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          .matches(/[a-z]/, "Password must contain at least one lowercase letter")
          .matches(/[0-9]/, "Password must contain at least one digit")
          .matches(/[@$!%*?&^#_~()[\]{}\-+=<>.,]/, "Password must contain at least one special character"),
      
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
          .required("Confirm password is required"),
      });

    const handleSubmit = async (values, {resetForm }) => {
        if (!resetToken) {
            toast.error("Reset token is missing!", { position: "top-right" });
            return;
        }
        setLoading(true); 
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/admin/resetPasswordAdmin`,
                { token: resetToken, newPassword: values.newPassword },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                toast.success("Password reset successfully!", { position: "top-right" });
                 resetForm();
                navigate("/admin/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!", { position: "top-right" });
        }
    };

    return (
        <>
      {loading && <Loader />}
        <div className="login-container">
            <div className="login-box">
                <div className="logo login-new">
                    <img src={logo1} alt="MentoBridge Logo" />
                </div>
                <h2 style={{ textAlign: "left" }} className="my-4">Reset Password</h2>
                <p className="text-muted">Enter your new password below.</p>

                <Formik
                    initialValues={{ newPassword: "", confirmPassword: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur }) => (
                        <Form>
                            <div className="form-group position-relative">
                                <Field
                                    type={showPassword ? "text" : "password"}
                                    name="newPassword"
                                    className="form-control"
                                    placeholder="New Password"
                                />
                                <ErrorMessage name="newPassword" component="div" className="text-danger" />
                                <span
                                    className="position-absolute"
                                    style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </span>
                            </div>

                            <div className="form-group position-relative">
                                <Field
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                />
                                <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                <span
                                    className="position-absolute"
                                    style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </span>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
                        </Form>
                    )}
                </Formik>

                <p className="forgot-password mt-3">
                    <Link to="/admin/login">Back to Login</Link>
                </p>
            </div>
        </div>
        </>
    );
};

export default ResetPassword;
