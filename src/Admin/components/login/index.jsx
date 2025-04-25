import React, { useState, useCallback } from "react";
import { logo1 } from "../imagepath";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Formik } from "formik";
import { Form, Spinner } from "react-bootstrap";
import { LoginSchema } from "../../../utils/validationSchema";
import { API_BASE_URL } from "../../../Helper/apicall";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie"; 
import { axiosSecure, fetchCsrfToken }  from  "../../../utils/axiosSecureInstance.js";

const MAX_FAILED_ATTEMPTS = 5; // Maximum allowed failed attempts
const LOCK_TIME = 300000; // Lock time in milliseconds (5 minutes)

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutTime, setLockoutTime] = useState(null);

    const handleSubmit = useCallback(async (values, { setSubmitting, setErrors }) => {
        setLoading(true);
        
        if (lockoutTime && Date.now() < lockoutTime) {
            const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
            setErrors({ email: `Account locked. Try again in ${remainingTime} seconds.` });
            setLoading(false);
            return;
        }
    
        const normalizedValues = {
            ...values,
            email: values.email.toLowerCase().trim()
        };
    
        try {
            await fetchCsrfToken(); 
            const response = await axiosSecure.post(`/admin/login`, normalizedValues); 
    
            // Call handleLoginResponse to save token and permissions
            handleLoginResponse(response);
    
            // Trigger login success event and redirect
            window.dispatchEvent(new Event("login-success"));
            window.location.href = "/admin";
            toast.success("Login Successful!", { position: "top-right" });
            setFailedAttempts(0);
        } catch (error) {
            console.error("Login Failed:", error.response?.data || error.message);
            setFailedAttempts(prev => prev + 1);
            if (failedAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
                setLockoutTime(Date.now() + LOCK_TIME);
                setErrors({ email: "Account locked due to too many failed attempts. Please try again later." });
                toast.error("Account locked due to too many failed attempts. Please try again later.", { position: "top-right" });
            } else {
                setErrors({ email: "Invalid email or password" });
                toast.error("Login Failed: Invalid email or password", { position: "top-right" });
            }
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    }, [lockoutTime, failedAttempts]);
    
    
    /// function to save rolepermissions 
    const handleLoginResponse = (response) => {
        if (response.status === 200 && response.data.data.token) {
            Cookies.set("token", response.data.data.token, { expires: 7 });
            const rolePermissions = response.data.data.adminStaffData.RolePermission;
            Cookies.set("rolePermissions", JSON.stringify(rolePermissions), { expires: 7 });   
            console.log("Role permissions saved to cookies:", rolePermissions);
        }
    }; 

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="logo login-new">
                    <img src={logo1} alt="MentoBridge Logo" />
                </div>
                <h2 style={{ textAlign: "left" }} className="my-4">Login</h2>
                <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
                    {({ isSubmitting, handleSubmit }) => (
                        <Form autoComplete="off" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <Field type="email" name="email" className="form-control" placeholder="Email" />
                                <ErrorMessage name="email" component="small" className="text-danger" />
                            </div>
                            <div className="form-group position-relative mb-1">
                                <Field type={showPassword ? "text" : "password"} name="password" className="form-control" placeholder="Password" />
                                <span
                                    className="position-absolute"
                                    style={{ right: "10px", top: "10px", cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </span>
                            </div>
                            <ErrorMessage name="password" component="small" className="text-danger mt-0 py-0" />
                            <button type="submit" className="btn btn-primary btn-block mt-4" disabled={isSubmitting || loading}>
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" /> Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </Form>
                    )}
                </Formik>
                <p className="forgot-password">
                    <Link to="/admin/forgotPassword">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;