import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
// import FeatherIcon from "feather-icons-react";
import SidebarNav from "../sidebar";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import { avatar12 } from "../imagepath";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import Loader from "../../components/Loader.js";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [previewImage, setPreviewImage] = useState(""); // For instant preview
  const [selectedFile, setSelectedFile] = useState(null); // Holds selected file
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });


  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  // ✅ Validation Schema
  const profileFormSchema = Yup.object().shape({
    firstName: Yup.string().min(2, "Too short!").required("First name is required"),
    lastName: Yup.string().min(2, "Too short!").required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });


  const passwordFormSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required("Old password is required"),

    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[^A-Za-z0-9]/, "Must contain at least one special character") // More inclusive
      .notOneOf([Yup.ref("oldPassword")], "New password cannot be the same as old password"),

    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });


  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      // Show instant preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      // setProfileImage(imageUrl);
    } else {
      toast.error("Please select a valid image file (JPG, PNG, etc.)");
    }
  };

  // Fetch Profiledetail from API
  useEffect(() => {
    const profileDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/profileDetail`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === 200) {
          setUserData(response.data.data);

          // Update profile image only if it exists
          if (response.data.data.profileImage) {
            const imageUrl = `${API_BASE_URL}/${response.data.data.profileImage}?t=${Date.now()}`;
            setProfileImage(imageUrl);
          }
        } else {
          console.error("Error fetching profile details:", response.data.message);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    profileDetail();
  }, [token]);



  // Handle form submission
  const handleProfileSubmit = async (formikValues) => {
    const formData = new FormData();
    // Only append image if selected
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
    formData.append("firstName", formikValues.firstName);
    formData.append("lastName", formikValues.lastName);
    formData.append("email", formikValues.email);

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/profileUpdate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      if (response.data.status === 200) {
        toast.success("Profile updated successfully!");
        // Dispatch a custom event to notify the header
        const event = new CustomEvent("profile-updated");
        window.dispatchEvent(event);

        const updatedImageUrl = `${API_BASE_URL}/${response.data.profileImage}?t=${Date.now()}`;
        // Optionally update the profile image in the state
        setProfileImage(updatedImageUrl);
      } else {
        toast.error(response.data.message || "Profile update failed.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Update Error:", error);
      toast.error("Error updating profile.");
    }
  };


  const handlePasswordSubmit = async (values, { resetForm }) => {

    if (values.newPassword !== values.confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/adminUpdatePassword`,
        values,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setLoading(false);

      if (response.data.status === 201) {
        toast.error(response.data.message);
      } else if (response.data.status === 200) {
        toast.success("Password updated successfully!");
        resetForm();
      } else {
        toast.error("Failed to update password.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Update Error:", error);
      toast.error("An error occurred while updating the password.");
    }
  };


  return (
    <>
      {loading && <Loader />}
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col">
                <h3 className="page-title">My Profile</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="profile-header">
                <div className="row align-items-center">
                  <div className="col-auto profile-image">
                    <label htmlFor="profileImageInput">
                      <img
                        className="rounded-circle"
                        alt="User Image"
                        src={previewImage || profileImage}
                        // src={previewImage || `${API_BASE_URL}/${profileImage}?t=${Date.now()}`}
                        style={{ cursor: "pointer" }}
                      />
                    </label>
                    <input
                      type="file"
                      id="profileImageInput"
                      accept="image/*"
                      style={{ display: 'none' }} // Hide file input
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="col ml-md-n2 profile-user-info">
                    <h4 className="user-name mb-0">{userData?.firstName || ""} {userData?.lastName || ""}</h4>
                    <h6 className="text-muted">{userData?.email || ""} </h6>
                  </div>
                </div>
              </div>
              <div className="tab-content profile-tab-cont">
                {/* Personal Details Tab */}
                <div className="tab-pane fade show active" id="per_details_tab">
                  {/* Personal Details */}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card px-3 py-3">
                        <Formik
                          enableReinitialize
                          initialValues={{
                            firstName: userData?.firstName || "",
                            lastName: userData?.lastName || "",
                            email: userData?.email || "",
                          }}
                          validationSchema={profileFormSchema}
                          onSubmit={handleProfileSubmit}
                        >
                          {({ handleSubmit, values, touched, errors }) => (
                            <form onSubmit={handleSubmit}>
                              <div className="row form-row">
                                <div className="col-12 col-sm-6">
                                  <div className="form-group">
                                    <label>First Name</label>
                                    <Field type="text" name="firstName"
                                      className={`form-control ${touched.firstName && errors.firstName ? "is-invalid" : ""}`}
                                    />
                                    <ErrorMessage name="firstName" component="div" className="text-danger" />

                                  </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                  <div className="form-group">
                                    <label>Last Name</label>
                                    <Field type="text" name="lastName"
                                      className={`form-control ${touched.lastName && errors.lastName ? "is-invalid" : ""}`}
                                    />
                                    <ErrorMessage name="lastName" component="div" className="text-danger" />

                                  </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                  <div className="form-group">
                                    <label>Email ID</label>
                                    <Field type="email" name="email"
                                      className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`} />
                                    <ErrorMessage name="email" component="div" className="text-danger" />
                                  </div>
                                </div>
                              </div>
                              <button type="submit" className="btn btn-primary ">
                                Save Changes
                              </button>
                            </form>
                          )}
                        </Formik>

                      </div>
                      {/* Edit Details Modal */}

                    </div>
                    <div className="col-lg-12">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">Change Password</h5>
                          <div className="row">
                            <div className="col-md-10 col-lg-6">
                              <Formik
                                initialValues={{
                                  oldPassword: '',
                                  newPassword: '',
                                  confirmPassword: ''
                                }}
                                validationSchema={passwordFormSchema}
                                onSubmit={handlePasswordSubmit}
                              >
                                {({ handleSubmit, values, touched, errors }) => (
                                  <form onSubmit={handleSubmit}>

                                    {/* <div className="form-group">
                                      <label>Old Password</label>
                                      <Field
                                        type={showPassword.oldPassword ? 'text' : 'password'}
                                        name="oldPassword"
                                        className={`form-control ${touched.oldPassword && errors.oldPassword ? "is-invalid" : ""}`}
                                      />
                                      <span
                                        className="input-group-text"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => toggleVisibility('oldPassword')}
                                      >
                                        {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                                      </span>
                                      <ErrorMessage name="password" component="div" className="text-danger" />
                                    </div> */}
                                    <div className="form-group position-relative">
                                      <label>Old Password</label>
                                      <div className="input-group">
                                        <Field
                                          type={showPassword.oldPassword ? 'text' : 'password'}
                                          name="oldPassword"
                                          className={`form-control ${touched.oldPassword && errors.oldPassword ? "is-invalid" : ""}`}
                                        />
                                          <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('oldPassword')} >
                                            {showPassword.oldPassword ? <FaEyeSlash /> : <FaEye />}
                                          </span>
                                      </div>
                                      <ErrorMessage name="oldPassword" component="div" className="text-danger" />
                                    </div>
                                    <div className="form-group position-relative">
                                      <label>New Password</label>
                                      <div className="input-group"> 
                                      <Field
                                        type={showPassword.newPassword ? "text" : "password"}
                                        name="newPassword"
                                        className={`form-control ${touched.newPassword && errors.newPassword ? "is-invalid" : ""}`}
                                      />
                                      <span className="input-group-text" style={{ cursor: 'pointer' }} onClick={() => toggleVisibility('newPassword')} >
                                        {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                                      </span>
                                    </div>
                                      <ErrorMessage name="newPassword" component="div" className="text-danger" />
                                    </div>
                                    <div className="form-group position-relative">
                                      <label>Confirm Password</label>
                                      <div className="input-group"> 
                                      <Field
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className={`form-control ${touched.confirmPassword && errors.confirmPassword ? "is-invalid" : ""}`}
                                      />
                                      <span
                                        className="input-group-text"
                                        style={{  cursor: "pointer" }}
                                        onClick={() => toggleVisibility("confirmPassword")}
                                      >
                                        {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                      </span>
                                      </ div> 
                                      <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                                    </div>
                                    <button className="btn btn-primary" type="submit">
                                      Save Changes
                                    </button>
                                  </form>
                                )}
                              </Formik>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Personal Details */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
    </>
  );
};

export default Profile;
