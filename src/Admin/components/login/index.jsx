 
        // window.location.href = "/admin"
        // navigate("/admin");  
        import React, { useState } from "react";
        import { logo1 } from "../imagepath";
        import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
        import { Link, useNavigate } from "react-router-dom";
        import { ErrorMessage, Field, Formik } from "formik";
        import { Form, Spinner } from "react-bootstrap";
        import { LoginSchema } from "../../../utils/validationSchema";
        import { API_BASE_URL } from "../../../Helper/apicall";
        import axios from "axios";
        import { ToastContainer, toast } from "react-toastify";
        import "react-toastify/dist/ReactToastify.css";
        
        const MAX_FAILED_ATTEMPTS = 5; // Maximum allowed failed attempts
        const LOCK_TIME = 300000; // Lock time in milliseconds (5 minutes)
        
        const Login = () => {
          const navigate = useNavigate();
          const [showPassword, setShowPassword] = useState(false);
          const [loading, setLoading] = useState(false);
          const [failedAttempts, setFailedAttempts] = useState(0);
          const [lockoutTime, setLockoutTime] = useState(null);
        
          const handleSubmit = async (values, { setSubmitting, setErrors }) => {
            setLoading(true);
            
            // Check if the account is locked
            if (lockoutTime && Date.now() < lockoutTime) {
              const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000);
              setErrors({ email: `Account locked. Try again in ${remainingTime} seconds.` });
              setLoading(false);
              return;
            }
        
            try {
              const response = await axios.post(`${API_BASE_URL}/api/admin/login`, values);
              console.log("Response:", response);
              if (response.status === 200 && response.data.data.token) {
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("loginSuccess", "true");
                window.location.href = "/admin"
                navigate("/admin");
                toast.success("Login Successful!", { position: "top-right" });
                setFailedAttempts(0); // Reset failed attempts on successful login
              }
            } catch (error) {
              console.error("Login Failed:", error.response?.data || error.message);
              setFailedAttempts(prev => prev + 1); // Increment failed attempts
        
              if (failedAttempts + 1 >= MAX_FAILED_ATTEMPTS) {
                setLockoutTime(Date.now() + LOCK_TIME); // Lock the account
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