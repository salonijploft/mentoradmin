import React, { useState, useCallback, useEffect } from "react";
import { logo1 } from "../imagepath";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link  } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Formik } from "formik";
import { Form, Spinner } from "react-bootstrap";
import { LoginSchema } from "../../../utils/validationSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance.js";
// import { useAuth } from "../Context.js";
import { useAuth } from "../../../context/AuthContext.js"

// const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 300000; // 5 minutes

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [failedAttempts, setFailedAttempts] = useState(0);
  // const [lockoutTime, setLockoutTime] = useState(null);
  const { fetchUser , user } = useAuth(); // Assuming fetchUser  updates user state

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
      const normalizedValues = {
        ...values,
        email: values.email.toLowerCase().trim(),
      };
      try {
        const csrfToken = await fetchCsrfToken();
        if (csrfToken) {
          axiosSecure.defaults.headers['X-CSRF-Token'] = csrfToken;
        }
        const response = await axiosSecure.post('/admin/login', normalizedValues);
        
        console.log("Response from login:", response.data);
  
        if (response.data.status === 200) {
          toast.success('Login Successful!');
          
          // Call fetchUser  to update user state
          await fetchUser (); // Wait for fetchUser  to complete
          console.log("User  state after fetchUser :", user); // Log user state
          console.log("Navigating to /admin");
          navigate('/admin');
         
        } else {
          console.error("Unexpected response status:", response.data.status);
          toast.error('Login failed: Unexpected response status');
        }
      } catch (error) {
        console.error("Error during login:", error);
        let errorMessage = 'Login failed';
        if (error.response) {
          errorMessage = error.response.data?.message || 'Server error';
        }
        setErrors({ email: 'Invalid credentials' });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }, [navigate, fetchUser , user] // Ensure user is included in dependencies
  );
  
  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo login-new">
          <img src={logo1} alt="MentoBridge Logo" />
        </div>
        <h2 style={{ textAlign: "left" }} className="my-4">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
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
