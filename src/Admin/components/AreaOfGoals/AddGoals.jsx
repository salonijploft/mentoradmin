import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { ErrorMessage, Field, Formik } from "formik";
import { goalSchma } from "../../../utils/validationSchema";
import { Form, Spinner } from "react-bootstrap"; // Import Spinner
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddGoals = () => {
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = location.pathname.includes(`/admin/edit-goal`);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [goalData, setGoalsData] = useState({
        status: "Active",
    });
    const [goalTitle, setGoalTitle] = useState('');
    const [loading, setLoading] = useState(false); // New loading state

    // Fetch goals details when in edit mode 
    useEffect(() => {
        if (isEditMode && id) {
            const fetchGoalsDetails = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/admin/menteeGoalDetail/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.data.status === 200) {
                        const { title, status } = response.data.data;
                        setGoalTitle(title);
                        setGoalsData({
                            status: status === 1 ? "Active" : "Inactive",
                        });
                    } else {
                        toast.error("Failed to fetch goal details.");
                    }
                } catch (error) {
                    console.error("API Error:", error);
                    toast.error("Something went wrong while fetching goal details.");
                }
            };
            if (id) {
                fetchGoalsDetails();
            }
        }
    }, [isEditMode, id, token]);

    // Post and update goals
    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true); // Start loading
        try {
            const payload = {
                title: values.goalTitle,
                status: values.status === "Active" ? 1 : 0,
            };

            let response;
            if (isEditMode) {
                response = await axios.post(`${API_BASE_URL}/api/admin/updateMenteeGoal/${id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                response = await axios.post(`${API_BASE_URL}/api/admin/createMenteeGoal`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            if (response.data.status === 200) {
                toast.success(isEditMode ? "Goal Updated Successfully!" : { position: "top-right" });
                resetForm();
                navigate("/admin/goal-list");
            } else {
                toast.error("Failed to process goal. Try again.");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false); // Stop loading
        }
    }

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
                                <h3 className="page-title">{isEditMode ? "Edit Goal" : "Add Goal"}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <Formik
                                        initialValues={{
                                            goalTitle: goalTitle,  // Formik will control this
                                            status: goalData.status,
                                        }}
                                        enableReinitialize
                                        validationSchema={goalSchma}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ handleSubmit }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    {/* Goal Title */}
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Goal Title *</label>
                                                            <Field name="goalTitle" className="form-control" type="text" />
                                                            <ErrorMessage name="goalTitle" component="div" className="text-danger" />
                                                        </div>
                                                    </div>
                                                    {/* Status */}
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label>Status</label>
                                                            <Field as="select" name="status" className="form-control">
                                                                <option value="Active">Active</option>
                                                                <option value="Inactive">Inactive</option>
                                                            </Field>
                                                            {/* <ErrorMessage name="status" component="div" className="text-danger" /> */}
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
                                                            {loading ? <Spinner animation="border" size="sm" /> : (isEditMode ? "Update Goal" : "Create Goal")}
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

export default AddGoals;