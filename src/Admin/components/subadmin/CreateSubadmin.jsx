import React, { useState, useRef, useEffect } from "react";
import SidebarNav from "../sidebar";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { subadmin } from "../../../utils/validationSchema";
import axios from 'axios';
import { API_BASE_URL } from "../../../Helper/apicall";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children; 
    }
}

const CreateSubadmin = () => {
    const location = useLocation(); // Ensure location is defined
    // const { staffId } = location.state || {};
    const [adminData, setAdminData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState("/assets/img/dummy.png");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { staffId } = useParams();
    const isEditMode = location.pathname.includes(`/subadmin/edit/`);

    const [initialValues, setInitialValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profile_image: "",
        rolePermission: [],
        permissions: {} // Ensure permissions are included
    });

    const modules = [
        "Dashboard", "Mentor", "Mentee", "Booking List", "Mentorship Categories",
        "Transactions", "Dispute Management", "Mentorship Goals", "Blogs", "Settings", "Help-&-support"
    ];

    const initialPermissions = {
        Dashboard: { view: true, edit: false, delete: false, create: false },
        Mentor: { view: true, edit: false, delete: true, create: false },
        Mentee: { view: true, edit: false, delete: true, create: false },
        "Booking List": { view: true, edit: false, delete: false, create: false },
        "Mentorship Categories": { view: true, edit: true, delete: true, create: true },
        "Transactions": { view: true, edit: false, delete: false, create: false },
        "Dispute Management": { view: false, edit: false, delete: true, create: false },
        "Mentorship Goals": { view: true, edit: true, delete: true, create: true },
        "Blogs": { view: true, edit: true, delete: true, create: true },
        "Settings": { view: false, edit: false, delete: false, create: false },
        "Help-&-support": { view: true, edit: true, delete: true, create: false },
    };

    const [selectedPermissions, setSelectedPermissions] = useState(initialPermissions);
    const setFieldValueRef = useRef(null); // Define the ref here

    const handleCheckboxChange = (module, action) => {
        setSelectedPermissions((prev) => {
            const modulePermissions = prev[module] || { view: false, edit: false, delete: false, create: false };
            return {
                ...prev,
                [module]: {
                    ...modulePermissions,
                    [action]: !modulePermissions[action], // Toggle the action
                },
            };
        });
    };

    const handleSubmit = async (values) => {
        try {
            const rolePermissions = Object.keys(values.permissions).map((module) => {
                return {
                    moduleName: module,
                    isRead: values.permissions[module].view ? 1 : 0,
                    isAdd: values.permissions[module].create ? 1 : 0,
                    isUpdate: values.permissions[module].edit ? 1 : 0,
                    isDelete: values.permissions[module].delete ? 1 : 0,
                };
            });

            const dataToSend = new FormData();
            dataToSend.append('firstName', values.firstName);
            dataToSend.append('lastName', values.lastName);
            dataToSend.append('email', values.email);
            dataToSend.append('password', values.password);
            dataToSend.append('profileImage', values.profile_image); 

            rolePermissions.forEach((permission, index) => {
                dataToSend.append(`rolePermission[${index}][moduleName]`, permission.moduleName);
                dataToSend.append(`rolePermission[${index}][isRead]`, permission.isRead);
                dataToSend.append(`rolePermission[${index}][isAdd]`, permission.isAdd);
                dataToSend.append(`rolePermission[${index}][isUpdate]`, permission.isUpdate);
                dataToSend.append(`rolePermission[${index}][isDelete]`, permission.isDelete);
            });

            const url = isEditMode
                ? `${API_BASE_URL}/subadmins/${staffId}`  // For update
                : `${API_BASE_URL}/api/admin/createStaff`; // For create

            const method = isEditMode ? 'PUT' : 'POST';
            const response = await axios({
                method: method,
                url: url,
                data: dataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                toast.success(isEditMode ? "Subadmin updated successfully!" : "Subadmin created successfully!");
                navigate("/admin/subadmin/list");  // Redirect after success
            }
        } catch (error) {
            console.error("Error creating/updating subadmin:", error);
            toast.error("Error creating/updating subadmin.");
        }
    };

    useEffect(() => {
        if (isEditMode) {
            const fetchStaffDetails = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/admin/staffDetail/${staffId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data.status === 200) {
                        const staffData = response.data.data;
                        setInitialValues({
                            firstName: staffData.firstName || "",
                            lastName: staffData.lastName || "",
                            email: staffData.email || "",
                            password: "", // Leave blank for security
                            profileImage: null,
                            rolePermission: staffData.rolePermission || [],
                            permissions: transformPermissions(staffData.rolePermission) // Transform permissions
                        });
                    }
                } catch (error) {
                    console.error("Error fetching staff details:", error);
                }
            };
            fetchStaffDetails();
        }
    }, [isEditMode, staffId]);

    const transformPermissions = (rolePermissions) => {
        const permissions = {};
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file) || "/assets/img/dummy.png"); // Show preview
            if (setFieldValueRef.current) {
                setFieldValueRef.current("profile_image", file); // This stores the raw file in Formik
            }
        }
    };

    
    return (
        <ErrorBoundary>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12 d-flex gap-3">
                                <button className="btn btn-primary"><FaArrowLeftLong /></button>
                                <h3 className="page-title">Add Subadmin</h3>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className='col-md-12 text-center'>
                                            <div className="form-group">
                                                <label>Profile Photo</label> <br />
                                                <div className="profile-containers">
                                                    <img src={image} alt="Profile" className="profile-images" />
                                                    <label htmlFor="profile_image" className="edit-icons">
                                                        <FaEdit />
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="profile_image"
                                                        name="profile_image"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        style={{ display: "none" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 blog-details">
                                            <Formik
                                                initialValues={initialValues}
                                                validationSchema={subadmin}
                                                onSubmit={async (values) => {
                                                    // Handle form submission
                                                }}
                                                //   onSubmit={isEditMode ? handleSubmit : handleSubmit}
                                                enableReinitialize
                                            >
                                                {({ values, setFieldValue, handleSubmit, handleChange }) => {
                                                    return (
                                                        <Form onSubmit={handleSubmit}>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label>First Name</label>
                                                                        <Field className="form-control" type="text" name="firstName" />
                                                                        <ErrorMessage name="firstName" component="div" className="text-danger" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label>Last Name</label>
                                                                        <Field className="form-control" type="text" name="lastName" />
                                                                        <ErrorMessage name="lastName" component="div" className="text-danger" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label>Email</label>
                                                                        <Field className="form-control" type="email" name="email" />
                                                                        <ErrorMessage name="email" component="div" className="text-danger" />
                                                                    </div>
                                                                </div>
                                                                {!isEditMode && (
                                                                    <div className="col-md-6">
                                                                        <label>Password</label>
                                                                        <div className="position-relative">
                                                                            <Field
                                                                                className="form-control password-input"
                                                                                type={showPassword ? "text" : "password"}
                                                                                name="password"
                                                                            />
                                                                            <span className="password-toggle"
                                                                                onClick={() => setShowPassword(!showPassword)}>
                                                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                            </span>
                                                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Roles & Permission</label>
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
                                                                    <select className="form-select" name="accountStatus" value={values.accountStatus} onChange={handleChange}>
                                                                        <option value="">Status</option>
                                                                        <option value="active">Active</option>
                                                                        <option value="inactive">Inactive</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="m-t-20 text-center">
                                                                <button className="btn btn-primary" type="submit">
                                                                    {isEditMode ? "Update Subadmin" : "Save Subadmin"}
                                                                </button>
                                                            </div>
                                                        </Form>
                                                    );
                                                }}
                                            </Formik>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default CreateSubadmin;


































