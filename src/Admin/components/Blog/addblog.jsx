import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import SidebarNav from "../sidebar";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Form, Spinner } from "react-bootstrap";
import { MdClose } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { API_BASE_URL } from "../../../Helper/apicall";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema for the form
const validationSchema = Yup.object().shape({
  blogName: Yup.string().required("Blog Name is required"),
  blogCategory: Yup.string().required("Blog Category is required"),
  blogImage: Yup.mixed().required("Blog Image is required"),
  description: Yup.string().required("Description is required")
});

const AddBlog = () => {
  const [userData, setUserData] = useState({});
  const [editorData, setEditorData] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = location.pathname === `/admin/edit-blog/${id}`;
  const token = localStorage.getItem("token");

  // Fetch categories for the blog
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

  // Fetch blog details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBlogDetails = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/admin/blogDetail/${id}`, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.status === 200) {
            const blogData = response.data.data;
            const imageUrl = `${API_BASE_URL}/${blogData.image.replace(/\\/g, "/")}`;
            setUserData({
              ...blogData,
              blogName: blogData.name,
              blogImage: imageUrl,
            });
            setPreview(imageUrl);
          } else {
            toast.error("Failed to fetch blog details.");
          }
        } catch (error) {
          toast.error("Failed to fetch blog details.");
        }
      };
      fetchBlogDetails();
    }
  }, [isEditMode, id, token]);

  // Handle file change for image upload
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue("blogImage", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle image deletion
  const handleDelete = (setFieldValue) => {
    setFieldValue("blogImage", null);
    setPreview(null);
    document.getElementById("file-upload").value = "";
  };

  // Handle form submission for creating a blog
  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.blogName);
      formData.append("category", values.blogCategory);
      formData.append("status", values.blogStatus === "public" ? "1" : "0");
      formData.append("description", editorData);
      if (values.blogImage) {
        formData.append("image", values.blogImage);
      }
      const response = await axios.post(`${API_BASE_URL}/api/admin/createBlog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res:", response.data.status)
      if (response.data.status === 200) {
        // resetForm();
        // setEditorData("");
        // setPreview(null);
        navigate("/admin/blogs");
        setTimeout(() => {
          toast.success("Blog created successfully!"); // Show toast after navigation
        }, 500); // Delay ensures the page loads before showing toast
      }
    } catch (error) {
      toast.error("Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for updating a blog
  const handleUpdate = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.blogName);
      formData.append("category", values.blogCategory);
      formData.append("status", values.blogStatus === "active" ? "1" : "0");
      formData.append("description", editorData);
      if (values.blogImage && typeof values.blogImage !== "string") {
        formData.append("image", values.blogImage);
      }
      const response = await axios.post(`${API_BASE_URL}/api/admin/updateBlog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response.data); 
      if (response.data.status === 200) {
        toast.success("Blog updated successfully!");
        resetForm();
        setEditorData("");
        setPreview(null);
        navigate("/admin/blogs");
        setTimeout(() => {
          toast.success("Blog updated successfully!"); // Show toast after navigation
        }, 500);
      }
    } catch (error) {
      toast.error("Failed to update blog.");
    } finally {
      setLoading(false);
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
                <h3 className="page-title">{isEditMode ? "Edit Blog" : "Add Blog"}</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <Formik
                    enableReinitialize
                    initialValues={{
                      blogName: userData.blogName || "",
                      blogCategory: userData.blogCategory || "",
                      blogImage: userData.blogImage || null, // Ensure the blogImage state is preserved
                      description: userData.description || "",
                      blogStatus: userData.blogStatus || "draft",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={isEditMode ? handleUpdate : handleSubmit}
                  >
                    {({ setFieldValue, handleSubmit: formikSubmit, values, errors, touched }) => (
                      <Form onSubmit={formikSubmit}>
                        <div className="form-group">
                          <label>Blog Name *</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="blogName"
                            onChange={(e) => {
                              setFieldValue("blogName", e.target.value);
                              setUserData({ ...userData, blogName: e.target.value });
                            }}
                          />
                          {touched.blogName && errors.blogName && (
                            <div className="text-danger">{errors.blogName}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Blog Image *</label>
                          <div className="custom-file-upload">
                            <span>Upload Blog Image</span>
                            <label htmlFor="file-upload">
                              <IoCloudUploadOutline className="upload-icon" fontSize={"30px"} />
                            </label>
                            <input
                              type="file"
                              id="file-upload"
                              accept="image/*"
                              onChange={(event) => handleFileChange(event, setFieldValue)}
                            />
                          </div>
                          {preview || userData.blogImage ? (
                            <div className="image-preview-container">
                              <img
                                src={preview || userData.blogImage}
                                alt="Blog Image"
                                className="image-preview"
                              />
                              <button className="delete-btn" type="button" onClick={() => handleDelete(setFieldValue)}>
                                <MdClose fontSize={"20px"} />
                              </button>
                            </div>
                          ) : null}
                          <ErrorMessage name="blogImage" component="div" className="text-danger" />
                        </div>
                        <div className="form-group">
                          <label>Blog Category *</label>
                          <Field as="select" className="form-control" name="blogCategory">
                            <option value="">Select Category</option>
                            <option value="General">General</option>
                            <option value="Mentor">Mentor</option>
                            <option value="Mentee">Mentee</option>
                          </Field>
                          {touched.blogCategory && errors.blogCategory && (
                            <div className="text-danger">{errors.blogCategory}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Blog Description *</label>
                          {/* <CKEditor
                            editor={ClassicEditor}
                            data={userData.description || ""}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setFieldValue("description", data);
                              setEditorData(data);
                              setUserData((prev) => ({ ...prev, description: data }));
                            }}
                          /> */}
                          <CKEditor
                            editor={ClassicEditor}
                            data={values.description} // Ensure it is taking value from Formik state
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setEditorData(data);
                              setFieldValue("description", data);
                            }}
                          />

                          <ErrorMessage name="description" component="div" className="text-danger" />
                        </div>
                        <div className="form-group">
                          <label className="display-block w-100">Blog Status *</label>
                          <div className="form-check form-radio form-check-inline">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="blogStatus"
                              value="draft"
                              onChange={() => setFieldValue("blogStatus", "draft")}
                              checked={values.blogStatus === "draft"}
                            />
                            <label className="form-check-label">Draft</label>
                          </div>
                          <div className="form-check form-radio form-check-inline">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="blogStatus"
                              value="public"
                              onChange={() => setFieldValue("blogStatus", "public")}
                              checked={values.blogStatus === "public"}
                            />
                            <label className="form-check-label">Publish</label>
                          </div>
                          <ErrorMessage name="blogStatus" component="div" className="text-danger" />
                          <div className="d-flex justify-content-between">
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            onClick={handleBack}
                                                        >
                                                            Back
                                                        </button>
                          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : isEditMode ? "Update Blog" : "Create Blog"}
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
      {/* </div> */}
     
    </>
  );
};

export default AddBlog;