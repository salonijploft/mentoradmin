import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarNav from "../sidebar";
import axios from 'axios';
import { API_BASE_URL } from "../../../Helper/apicall";
import { toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap"; 
import Cookies from "js-cookie";
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";

const FaqList = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [loadingFaqs, setLoadingFaqs] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const token = Cookies.get("token");

    // Fetch FAQs from API
    useEffect(() => {
        const fetchFaqs = async () => {
            setLoading(true); 
            try {
                const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/getFaqs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.status === 200) {
                    setFaqs(response.data.data);
                } else {
                    console.error("Error fetching FAQs:", response.data.message);
                }
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoading(false); // Stop loading
                setLoadingFaqs(false);
            }
        };
        fetchFaqs();
    }, [token]);

    // Fetch Categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true); // Start loading categories
            try {
                const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/getMenteeCategories`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.status === 200) {
                    setCategories(response.data.data);
                } else {
                    console.error("Error fetching categories:", response.data.message);
                }
            } catch (error) {
                console.error("API Error in fetching categories:", error);
            } finally {
                setLoadingCategories(false); // Stop loading categories
            }
        };
        fetchCategories();
    }, [token]);

    // Function to get category name from ID
    const getCategoryName = (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.categoryName : "Unknown"; // Fallback to "Unknown"
    };

    // Handle delete
    const deleteBlogHandler = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/deleteFaq/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.status === 200) {
                    setFaqs(faqs.filter(faq => faq.id !== id));
                    toast.success("FAQ deleted successfully!", { position: "top-right" });
                }
            } catch (error) {
                console.log("error", error);
                toast.error("Failed to delete FAQ.");
            }
        }
    };
    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="container mt-4">
                    <div className="page-header">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>FAQs List</h3>
                            <Link to="/admin/faq-add" className="btn btn-primary">Add FAQ</Link>
                        </div>
                    </div>

                    {loadingFaqs || loadingCategories ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Question</th>
                                    <th>Category</th>
                                    <th>Answer</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.length > 0 ? (
                                    faqs.map((faq, index) => (
                                        <tr key={faq.id}>
                                            <td>{index + 1}</td>
                                            <td>{faq.question}</td>
                                            <td>{faq.category}</td>
                                            <td>{faq.answer}</td>
                                            <td>
                                                <Link to={`/admin/edit-faq/${faq.id}`} className="btn btn-warning btn-sm me-2">Edit</Link>
                                                <button onClick={() => deleteBlogHandler(faq.id)} className="btn btn-danger btn-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No FAQs available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default FaqList;