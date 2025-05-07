import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import SidebarNav from "../sidebar";
import ShowPermissions from "../CustomModals/ShowPermission";
// import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import SimplePagination from "../newpagination/Simplepagination"; 
import Pagination from "../Pagination/Pagination";
import Cookies from "js-cookie";
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";
import Loader from "../Loader";

const Subadminlist = () => {
    const [showPermision, setShowPermision] = useState(false);
    const [subadmin, setSubadmin] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const token = Cookies.get('token');
    // const fetchStaffList = async () => {
    //     setLoading(true);
    //     try {
    //         ;
    //         // const token = Cookies.get('token');
    //         const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/getStaff?limit=${limit}&page=${page}`, 
                
    //             // headers: {
    //             //     Authorization: `Bearer ${token}`,
    //             // },
    //             {
    //               withCredentials: true, // ✅ Automatically sends the cookie
    //             }
    //             );
    //         console.log("token:", token)
    //         if (response.data.status === 200) {
    //             setSubadmin(response.data.data);
    //             setCurrentPage(response.data.pagination.currentPage);
    //             setTotalPages(response.data.pagination.totalPages);
    //         } else {
    //             setSubadmin([]);
    //         }
    //     } catch (error) {
    //         toast.error("Failed to fetch subadmins", { position: "top-right" });
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    // useEffect(() => {
    //     fetchStaffList();
    // }, [page]);

    const fetchStaffList = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            const response = await axiosSecure.get(
                `${API_BASE_URL}/api/admin/getStaff?limit=${limit}&page=${page}`,
                {
                    withCredentials: true,
                }
            );
            console.log("token:", token);
            if (response.data.status === 200) {
                setSubadmin(response.data.data);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
            } else {
                setSubadmin([]);
            }
        } catch (error) {
            toast.error("Failed to fetch subadmins", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
             fetchStaffList();
        }, [page]);
    
    
    const deleteBlogHandler = async (id) => {
        const token = Cookies.get("token");
        if (!token) {
            toast.error("Token missing. Please log in again.");
            return;
        }
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
            try {
                const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/deleteStaff/${id}`,
                //      {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                //    }
                {
                    withCredentials: true,
                }
            );
                console.log("token after login :", response.data);
                if (response.status === 200) {
                    toast.success("Admin Staff and associated Role Permissions deleted successfully!", { position: "top-right" });
                    fetchStaffList();
                }
            } catch (error) {
                console.error("delete-api-error:", error)
                toast.error("Failed to delete subadmin", { position: "top-right" });
            }
        }
    };
    const handleShowPermissions = (permissions) => {
        setSelectedPermissions(permissions);
        setShowPermision(true);
    };

    const handleToggleStatus = async (id, currentStatus) => { // const token = localStorage.getItem("token");
        const updatedStatus = currentStatus === 1 ? 0 : 1;
        try {
            const token = Cookies.get('token');
            const response = await axiosSecure.post(
                `${API_BASE_URL}/api/admin/staffStatusUpdate/${id}`,
                { id, status: updatedStatus },
                { 
                    headers:
                     {
                         Authorization: `Bearer ${token}` 
                     } 
                }
                //  { 
                //     withCredentials: true 
                // },
            );
            if (response.status === 200) {
                setSubadmin((prev) =>
                    prev.map((staff) =>
                        staff.id === id ? { ...staff, status: updatedStatus } : staff
                    )
                );
                toast.success("Status updated successfully!", {
                    position: "top-right"
                });
            } else {
                toast.error("Failed to update status", { position: "top-right" });
            }
        } catch (error) {
            toast.error("Error updating status", { position: "top-right" });
        }
    };

    return (
        <>
            {loading && <Loader />}
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="my-3">
                        <div className="row">
                            <div className="col-sm-10">
                                <h3 className="page-title">List of Subadmin</h3>
                            </div>
                            <div className="col-sm-2">
                                <Link to="/admin/subadmin/create">
                                    <button className="btn btn-primary btn-lg">Create Subadmin</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    {loading ? (
                                        <div className="d-flex justify-content-center">
                                            {/* <Spinner animation="border" /> */}
                                        </div>
                                    ) : (
                                        <div className="table-responsive custom-table">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="text-start">Name / Email</th>
                                                        <th>Roles & Permissions</th>
                                                        <th>Created At</th>
                                                        <th>Account Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subadmin.length > 0 ? (
                                                        subadmin.map((staff) => (
                                                            <tr key={staff.id}>
                                                                <td className="text-start email-anme">
                                                                    <div>
                                                                        <Link className="avatar mx-2" to="#">
                                                                            <img
                                                                                className="rounded-circle"
                                                                                src={`${API_BASE_URL}/${staff.profileImage}`}
                                                                                alt={staff.firstName}
                                                                                width="40"
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                    <div>
                                                                        <Link to="#">{staff.firstName} {staff.lastName}</Link> <br />
                                                                        <span>{staff.email}</span>
                                                                    </div>
                                                                </td>
                                                                <td onClick={() => handleShowPermissions(staff.RolePermission)}>
                                                                    <FaEye fontSize={"18px"} />
                                                                </td>
                                                                {/* <td>{new Date(staff.otpExpiresAt).toLocaleDateString()}</td> */}
                                                                <td>
                                                                    {new Date().toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: '2-digit',
                                                                        day: '2-digit',
                                                                    })}
                                                                </td>
                                                                <td>
                                                                    <div className="status-toggle">
                                                                        <input
                                                                            id={`status${staff.id}`}
                                                                            className="check"
                                                                            type="checkbox"
                                                                            checked={staff.status === 1}
                                                                            onChange={() => handleToggleStatus(staff.id, staff.status)}
                                                                        />
                                                                        <label htmlFor={`status${staff.id}`} className="checktoggle checkbox-bg"> checkbox </label>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center action-buttons">
                                                                        <Link to={`/admin/subadmin/edit/${staff.id}`} className="me-2">
                                                                            <MdEdit fontSize={"18px"} />
                                                                        </Link>
                                                                        <MdDelete fontSize={"18px"} className="text-danger delete-icon" onClick={() => deleteBlogHandler(staff.id)} />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="text-center">No subadmins found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-end mt-3">
                                    <Pagination
                                        current={currentPage}
                                        total={totalPage}
                                        pagination={(page) => { setPage(page); }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ShowPermissions show={showPermision} handleClose={() => setShowPermision(false)} permissions={selectedPermissions} />
        </>
    );
};
export default Subadminlist;