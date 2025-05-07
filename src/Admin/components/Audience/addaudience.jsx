import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { ErrorMessage, Field, Formik } from "formik";
import { audienceSchema } from "../../../utils/validationSchema"; // Ensure this schema is defined
import { Form, Spinner } from "react-bootstrap"; // Import Spinner
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie"; 
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";
const AddAudience = () => {
    
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = location.pathname.includes(`/admin/edit-audience`);
    const navigate = useNavigate();
    const [audienceData, setAudienceData] = useState({
        status: "Active",
        audienceName: '', // Initialize audienceName
    });
    const [loading, setLoading] = useState(false); // New loading state
   
    // Fetch audience details when in edit mode 
    useEffect(() => {
        if (isEditMode && id) {
            const fetchAudienceDetails = async () => {
                try {
                    const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/audienceDetail?id=${id}`, 
                    //     {
                    //     headers: { Authorization: `Bearer ${token}` },
                    // }
                    {
                        withCredentials: true,
                    }
                );
                    if (response.data.status === 200) {
                        const { name, status } = response.data.data; // Adjusted to match your data structure
                        setAudienceData({
                            audienceName: name, // Set audienceName
                            status: status === 1 ? "Active" : "Inactive", // Convert status to string
                        });
                    } else {
                        toast.error("Failed to fetch audience details.");
                    }
                } catch (error) {
                    console.error("API Error:", error);
                    toast.error("Something went wrong while fetching audience details.");
                }
            };
            fetchAudienceDetails(); // Call the function to fetch details
        }
    }, [isEditMode, id, token]);

    // Post and update goals
    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true); // Start loading
        try {
            const payload = {
                name: values.audienceName,
                status: values.status === "Active" ? 1 : 0,
            };
            let response;
            if (isEditMode) {
                response = await axiosSecure.post(`${API_BASE_URL}/api/admin/updateAudience?id=${id}`, payload,
                //      {
                //     headers: { Authorization: `Bearer ${token}` },
                // }
                {
                     withCredentials: true,
                }
            );
            } else {
                response = await axiosSecure.post(`${API_BASE_URL}/api/admin/createAudience`, payload, 
                //     {
                //     headers: { Authorization: `Bearer ${token}` },
                // }
                {
                    withCredentials: true,
                }
             );
            }
            if (response.data.status === 200) {
                toast.success(isEditMode ? "Audience Updated Successfully!" : "Audience Created Successfully!", { position: "top-right" });
                resetForm();
                navigate("/admin/audience");
            } else {
                toast.error("Failed to process goal. Try again.");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleBack = () => {
        navigate(-1); // this goes back to the previous page
    };

    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">{isEditMode ? "Edit Audience" : "Add Audience"}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <Formik
                                        initialValues={{
                                            audienceName: audienceData.audienceName,  
                                            status: audienceData.status, 
                                        }}
                                        enableReinitialize 
                                        validationSchema={audienceSchema} 
                                        onSubmit={handleSubmit}
                                    >
                                        
                                        {({ handleSubmit }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    {/* Audience Name */}
                                                    {/* <div className="col */}
                                                    {/* Audience Name */}
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Name *</label>
                                                            <Field name="audienceName" className="form-control" type="text" />
                                                            <ErrorMessage name="audienceName" component="div" className="text-danger" />
                                                        </div>
                                                    </div>
                                                    {/* Status */}
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Status *</label>
                                                            <Field as="select" name="status" className="form-control">
                                                                <option value="Active">Active</option>
                                                                <option value="Inactive">Inactive</option>
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Submit Button */}
                                                <div className="m-t-20 text-center">
                                                    <div className="d-flex justify-content-between">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            onClick={handleBack}
                                                        >
                                                            Back
                                                        </button>
                                                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                                            {loading ? <Spinner animation="border" size="sm" /> : (isEditMode ? "Update Audience" : "Create Audience")}
                                                        </button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddAudience;