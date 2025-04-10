import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import SidebarNav from "../sidebar";
import { categorySchma, faqValidation } from "../../../utils/validationSchema";
import { API_BASE_URL } from "../../../Helper/apicall";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Faq = () => {
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = location.pathname.includes(`/admin/edit-faq/`);
    const [category, setCategory] = useState([]);
    const [question, setQuestion] = useState([]);
    const [answer, setAnswer] = useState([]);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        question: "",
        answer: "",
        category: "",
    });
    const token = localStorage.getItem("token");
    // Initial form values
    const initialValues = {
        question: "",
        answer: "",
        category: ""
    };

    //   // Fetch categories for the faq's
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/getMenteeCategories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 200) {
          setCategory(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch categories. Please try again later");
      }
    };
    fetchCategory();
  }, [token]); 

    // Fetch FAQ details when in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchFaqDetails = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/admin/faqDetail/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.status === 200) {
                        const faqData = response.data.data;
                        setUserData({
                            question: faqData.question || "",
                            answer: faqData.answer || "",
                            category: faqData.category || "",
                        });
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            };
            fetchFaqDetails();
        }
    }, [isEditMode, id]);

 const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                question: values.question,
                answer: values.answer,
                category: values.category
            };
            const response = await axios.post(`${API_BASE_URL}/api/admin/createFaq`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in headers
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log("res:", response.data)
            if (response.data.status === 200) {
                toast.success("Faq Added successfully!", { position: "top-right" });
                navigate("/admin/faq");
            } else {
                // toast.error("Failed to save FAQ!");
            }
        } catch (error) {
            console.error("Error saving FAQ:", error);
            toast.error("An error occurred while saving FAQ.");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/getMenteeCategories`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include token in headers
                            "Content-Type": "application/json"
                        }
                    }
                )
                console.log("res.data", response.data)
                if (response.data.status === 200) {
                    setCategory(response.data.data)
                }
            } catch {
                console.log("error:", error)
            }
        }
        fetchCategory();
    }, [])

    // Fetch FAQ details when in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchFaqDetails = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/admin/faqDetail/${id}`);
                    if (response.data.status === 200) {
                        const faqData = response.data.data;
                        setUserData({
                            question: faqData.question || "",
                            answer: faqData.answer || "",
                            category: faqData.category || "",
                        });
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            };
            fetchFaqDetails();
        }
    }, [isEditMode, id]);

    useEffect(() => {
        console.log("Updated userData:", userData);
    }, [userData]);

    ///update faq
    // Update FAQ
 const handleUpdate = async (values, { setSubmitting, resetForm }) => {
        console.log("handleUpdate called with values:", values);
        try {
            const token = localStorage.getItem("token");
            const payload = {
                question: values.question,
                answer: values.answer,
                category: values.category,
            };
            console.log("Updating FAQ with payload:", payload);
            const response = await axios.post(`${API_BASE_URL}/api/admin/updateFaq/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                    "Content-Type": "application/json"
                }
            });
            console.log("Response from updateFaq:", response.data);
            if (response.data.status === 200) {
                toast.success("FAQ updated successfully!", { position: "top-right" });
                resetForm();
                navigate("/admin/faq");
            } else {
                toast.error("Failed to update FAQ.");
            }
        } catch (error) {
            console.error("Error updating FAQ:", error);
            toast.error("An error occurred while updating FAQ.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle Delete Image
    const handleDelete = (setFieldValue) => {
        setFieldValue("blogImage", '');
        setPreview(null);
        document.getElementById("file-upload").value = "";
    };

    const handleBack = () => {
        navigate(-1); // this goes back to the previous page
    };

    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="page-header">
                    <div className="row align-items-center pt-4">
                        <div className="col">
                            <h3 className="page-title">Manage FAQ</h3>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <Formik
                        enableReinitialize
                        initialValues={userData}
                        validationSchema={faqValidation}
                        onSubmit={isEditMode ? handleUpdate : handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="p-4 border rounded bg-white shadow-sm">
                                <div className="mb-3">
                                    <label className="form-label">Question</label>
                                    <Field
                                        type="text"
                                        name="question"
                                        className="form-control"
                                        placeholder="Enter question"
                                    />
                                    <ErrorMessage
                                        name="question"
                                        component="div"
                                        className="text-danger"
                                    />
                                </div>
                                {/* <div className="mb-3">
                                    <label className="form-label">Category *</label>
                                    <Field as="select" name="category" className="form-select">
                                        <option value="">Select category</option>
                                        {category.length > 0 ? (
                                            category.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.categoryName}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Loading categories...</option>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="category"
                                        component="div"
                                        className="text-danger"
                                    />
                                </div> */}
                                <div className="mb-3">
                                    <label> Category *</label>
                                    <Field as="select" className="form-control" name="blogCategory">
                                        <option value="">Select Category</option>
                                        <option value="General">General</option>
                                        <option value="Mentor">Mentor</option>
                                        <option value="Mentee">Mentee</option>
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="text-danger"/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Answer</label>
                                    <Field
                                        as="textarea"
                                        name="answer"
                                        className="form-control"
                                        placeholder="Enter answer"
                                        rows="4"
                                    />
                                    <ErrorMessage
                                        name="answer"
                                        component="div"
                                        className="text-danger"
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleBack}
                                    >  Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update FAQ" : "Save FAQ"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default Faq;
