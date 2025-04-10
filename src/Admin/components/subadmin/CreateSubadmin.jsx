import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { subadmin } from "../../../utils/validationSchema";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CreateSubadmin = () => {
    const location = useLocation();
    const { staffId } = useParams();
    const navigate = useNavigate();
    const isEditMode = location.pathname.includes(`/subadmin/edit/`);
    const token = localStorage.getItem("token");

    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profile_image: "",
        permissions: {},
        status: ""
    });

    const modules = [
        "Dashboard", "Mentor", "Mentee", "Booking List", "Mentorship Categories",
        "Transactions", "Dispute Management", "Mentorship Goals", "Blogs", "Settings", "Help-&-support"
    ];

    const transformRolePermissions = (rolePermissions) => {
        const permissions = {};
        modules.forEach(module => {
            permissions[module] = { view: false, create: false, edit: false, delete: false };
        });
        rolePermissions.forEach((item) => {
            permissions[item.moduleName] = {
                view: item.isRead === 1,
                create: item.isAdd === 1,
                edit: item.isUpdate === 1,
                delete: item.isDelete === 1,
            };
        });
        return permissions;
    };

    const fetchStaffDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/staffDetail/${staffId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 200) {
                const staffData = response.data.data;
                const permissions = transformRolePermissions(staffData.RolePermission);
                setInitialValues({
                    firstName: staffData.firstName || "",
                    lastName: staffData.lastName || "",
                    email: staffData.email || "",
                    password: "",
                    profile_image: null,
                    permissions,
                    status: staffData.status
                });
                if (staffData.profileImage) {
                    setImagePreview(`${API_BASE_URL}/${staffData.profileImage}`);
                }
            } else {
                toast.error("Failed to fetch staff details.");
            }
        } catch (error) {
            console.error("Error fetching staff details:", error);
            toast.error("Error fetching staff details. Please try again.");
        }
    };

    useEffect(() => {
        if (isEditMode && staffId) {
            fetchStaffDetails();
        }
    }, [isEditMode, staffId]);

    const handleImageChange = (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setFieldValue("profile_image", file);
        } else {
            toast.error("Please select a valid image file.");
        }
    };

    const handleSubmit = async (values) => {
        try {
            const dataToSend = new FormData();
            dataToSend.append("firstName", values.firstName);
            dataToSend.append("lastName", values.lastName);
            dataToSend.append("email", values.email);
            if (!isEditMode) {
                dataToSend.append("password", values.password);
            }
            if (values.profile_image) {
                dataToSend.append("profileImage", values.profile_image);
            }
            dataToSend.append("status", values.status);

            const rolePermissions = Object.keys(values.permissions).map((module) => ({
                moduleName: module,
                isRead: values.permissions[module].view ? 1 : 0,
                isAdd: values.permissions[module].create ? 1 : 0,
                isUpdate: values.permissions[module].edit ? 1 : 0,
                isDelete: values.permissions[module].delete ? 1 : 0,
            }));

            rolePermissions.forEach((permission, index) => {
                dataToSend.append(`rolePermission[${index}][moduleName]`, permission.moduleName);
                dataToSend.append(`rolePermission[${index}][isRead]`, permission.isRead);
                dataToSend.append(`rolePermission[${index}][isAdd]`, permission.isAdd);
                dataToSend.append(`rolePermission[${index}][isUpdate]`, permission.isUpdate);
                dataToSend.append(`rolePermission[${index}][isDelete]`, permission.isDelete);
            });
            const url = isEditMode
                ? `${API_BASE_URL}/api/admin/updateStaff/${staffId}`
                : `${API_BASE_URL}/api/admin/createStaff`;

            const response = await axios({
                method: isEditMode ? "post" : "post",
                url,
                data: dataToSend,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success(isEditMode ? "Subadmin updated successfully!" : "Subadmin created successfully!");
                navigate("/admin/subadmin/list");
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Error creating/updating subadmin.");
        }
    };

    return (
        <div>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12 d-flex gap-3">
                                <button className="btn btn-primary" onClick={() => navigate("/admin/subadmin/list")}><FaArrowLeftLong /></button>
                                <h3 className="page-title">{isEditMode ? "Edit Subadmin" : "Add Subadmin"}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <Formik
                                        enableReinitialize
                                        initialValues={initialValues}
                                        // validationSchema={subadmin}
                                        onSubmit={(values) => {
                                            console.log("Formik onSubmit triggered"); // Add this
                                            handleSubmit(values);
                                        }}
                                    >
                                        {({ values, setFieldValue, handleChange }) => (
                                            <Form>
                                                {/* <div className="col-md-12 text-right">
                                                    <div className="col-md-6 text-right">
                                                        <div className="profile-containers" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '20px' }}>
                                                            <img
                                                                src={imagePreview || '/assets/img/dummy.png'}
                                                                alt="Profile"
                                                                className="profile-images"
                                                                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                                                            />
                                                            <label htmlFor="profile_image" className="edit-icons" style={{ cursor: 'pointer', marginTop: '10px' }}>
                                                                <FaEdit />
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id="profile_image"
                                                                name="profile_image"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                                                style={{ display: "none" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="col-md-12 text-right">
                                                    <div className="col-md-12" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                        <div className="profile-containers" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                                                            <img
                                                                src={imagePreview || '/assets/img/dummy.png'}
                                                                alt="Profile"
                                                                className="profile-images"
                                                                style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto' }} // Center by auto margin
                                                            />
                                                            <label htmlFor="profile_image" className="edit-icons" style={{ cursor: 'pointer', marginTop: '10px' }}>
                                                                <FaEdit />
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id="profile_image"
                                                                name="profile_image"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                                                style={{ display: "none" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <label>First Name</label>
                                                        <Field className="form-control" type="text" name="firstName" />
                                                        <ErrorMessage name="firstName" component="div" className="text-danger" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Last Name</label>
                                                        <Field className="form-control" type="text" name="lastName" />
                                                        <ErrorMessage name="lastName" component="div" className="text-danger" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label>Email</label>
                                                        <Field className="form-control" type="email" name="email" />
                                                        <ErrorMessage name="email" component="div" className="text-danger" />
                                                    </div>
                                                    {!isEditMode && (
                                                        <div className="col-md-6">
                                                            <label>Password</label>
                                                            <div className="position-relative">
                                                                <Field
                                                                    className="form-control"
                                                                    type={showPassword ? "text" : "password"}
                                                                    name="password"
                                                                />
                                                                <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                </span>
                                                                <ErrorMessage name="password" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="form-group mt-3">
                                                    <label>Roles & Permissions</label>
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Module</th>
                                                                <th>View</th>
                                                                <th>Edit</th>
                                                                <th>Delete</th>
                                                                <th>Create</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {modules.map((module) => (
                                                                <tr key={module}>
                                                                    <td>{module}</td>
                                                                    {["view", "edit", "delete", "create"].map((perm) => (
                                                                        <td key={perm}>
                                                                            <Field
                                                                                type="checkbox"
                                                                                name={`permissions.${module}.${perm}`}
                                                                                checked={values.permissions[module]?.[perm] || false}
                                                                                onChange={() =>
                                                                                    setFieldValue(
                                                                                        `permissions.${module}.${perm}`,
                                                                                        !values.permissions[module]?.[perm]
                                                                                    )
                                                                                }
                                                                            />
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Account Status</label>
                                                        <select className="form-select" name="status" onChange={handleChange} value={values.status}>
                                                            <option value="">Select Status</option>
                                                            <option value="1">Active</option>
                                                            <option value="0">Inactive</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="text-center mt-4">
                                                    <button className="btn btn-primary" type="submit">
                                                        {isEditMode ? "Update Subadmin" : "Save Subadmin"}
                                                    </button>
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
        </div>
    );
};

export default CreateSubadmin;
