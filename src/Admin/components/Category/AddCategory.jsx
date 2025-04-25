/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { ErrorMessage, Field, Formik } from "formik";
import { categorySchma } from "../../../utils/validationSchema";
import { Form } from "react-bootstrap";
import axios from 'axios';
import { API_BASE_URL } from "../../../Helper/apicall";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";

const AddCategory = () => {
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = location.pathname.includes(`/admin/edit-category/`);
    const navigate = useNavigate();
    const token = Cookies.get('token');
    
    // State for category data
    const [categoryData, setCategoryData] = useState({
        categoryTitle: "",
        status: "Active",
    });

    // Fetch category details when in edit mode
    useEffect(() => {
        if (isEditMode && id) {
            const fetchCategoryDetails = async () => {
                try {
                    const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/menteeCategoryDetail/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.status === 200) {
                        const { categoryName, status } = response.data.data;
                        setCategoryData({
                            categoryTitle: categoryName,
                            status: status === 1 ? "Active" : "Inactive",
                        });
                    } else {
                        toast.error("Failed to fetch category details.");
                    }
                } catch (error) {
                    console.error("API Error:", error);
                    toast.error("Something went wrong while fetching category details.");
                }
            };
            fetchCategoryDetails();
        }
    }, [isEditMode, id, token]);

    // Handle Form Submission for both Create & Update
    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = {
                categoryName: values.categoryTitle,
                status: values.status === "Active" ? 1 : 0,
            };
            let response;
            if (isEditMode) {
                // Update existing category
                response = await axiosSecure.post(`${API_BASE_URL}/api/admin/updateMenteeCategory/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                // Create new category
                response = await axiosSecure.post(`${API_BASE_URL}/api/admin/createMenteeCategory`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (response.data.status === 200) {
                toast.success(isEditMode ? "Category Updated Successfully!" : "Category Added Successfully!", { position: "top-right" });
                resetForm();
                navigate("/admin/category-list");
            } else {
                toast.error("Failed to process category. Try again.");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Something went wrong!");
        }
    };


    const handleBack = () => {
        navigate(-1); // this goes back to the previous page
    };

    return (
        <>
            <SidebarNav />
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">{isEditMode ? "Edit Category" : "Add Category"}</h3>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    {/* Add / Edit details */}
                                    <div className="blog-details">
                                        <Formik
                                            enableReinitialize
                                            initialValues={categoryData}
                                            validationSchema={categorySchma}
                                            onSubmit={handleSubmit}
                                        >
                                            {({ handleSubmit }) => (
                                                <Form onSubmit={handleSubmit}>
                                                    <div className="row">
                                                        {/* Category Title */}
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Category Title *</label>
                                                                <Field name="categoryTitle" className="form-control" type="text" />
                                                                <ErrorMessage name="categoryTitle" component="div" className="text-danger" />
                                                            </div>
                                                        </div>

                                                        {/* Status */}
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Status</label>
                                                                <Field as="select" name="status" className="form-control">
                                                                    <option value="">Select Status</option>
                                                                    <option value="Active">Active</option>
                                                                    <option value="Inactive">Inactive</option>
                                                                </Field>
                                                                <ErrorMessage name="status" component="div" className="text-danger" />
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

                                                            <button type="submit" className="btn btn-primary btn-lg">
                                                                {isEditMode ? "Update Category" : "Create Category"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                    {/* /Add details */}
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

export default AddCategory;
