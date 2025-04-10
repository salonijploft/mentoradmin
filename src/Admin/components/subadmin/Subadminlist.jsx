// import React, { useState, useEffect } from "react";
// import { MdDelete, MdEdit } from "react-icons/md";
// import { FaEye } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { API_BASE_URL } from "../../../Helper/apicall";
// import SidebarNav from "../sidebar";
// // import Pagination from "../Pagination/Pagination";
// import ShowPermissions from "../CustomModals/ShowPermission";
// import { Spinner } from "react-bootstrap";
// import { Formik, Form, Field } from "formik";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";

// const Subadminlist = () => {
//     const [showPermision, setShowPermision] = useState(false);
//     const [subadmin, setSubadmin] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedPermissions, setSelectedPermissions] = useState([]);

//     useEffect(() => {
//         fetchStaffList();
//     }, []);

//     const fetchStaffList = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.get(`${API_BASE_URL}/api/admin/getStaff`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             console.log("API Response:", response.data); // Debugging
//             // Ensure the response is an array
//             if (response.data && Array.isArray(response.data.data)) {
//                 setSubadmin(response.data.data); // Use response.data.data
//             } else {
//                 console.error("Unexpected response format:", response.data);
//                 setSubadmin([]); // Fallback to an empty array
//             }
//         } catch (error) {
//             console.error("Error fetching staff list:", error);
//             toast.error("Failed to fetch subadmins", { position: "top-right" });
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchStaffList();
//     }, []);

//     /// delete subadmin 
//     const deleteBlogHandler = async (id) => {
//         const result = await Swal.fire({
//             title: "Are you sure?",
//             text: "You won't be able to revert this!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, delete it!",
//         });
//         // delete api 

//         if (result.isConfirmed) {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await axios.get(`${API_BASE_URL}/api/admin/deleteStaff/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 if (response.status === 200) {
//                     toast.success("Admin Staff and associated Role Permissions deleted successfully!", { position: "top-right" });
//                     // Fetch updated list after deletion
//                     fetchStaffList();
//                 }
//             } catch (error) {
//                 console.error("Error deleting subadmin:", error);
//                 toast.error("Failed to delete subadmin", { position: "top-right" });
//             }
//         }
//     };
//     // to show the permissionlist 
//     const handleShowPermissions = (permissions) => {
//         setSelectedPermissions(permissions);
//         setShowPermision(true);
//     };


//     const handleToggleStatus = async (id, currentStatus) => {
//         const token = localStorage.getItem("token");
//         const updatedStatus = currentStatus === 1 ? 0 : 1;

//         try {
//           const response = await axios.post(
//             `${API_BASE_URL}/api/admin/updateStaffStatus`,
//             { id, status: updatedStatus },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           // Update the local state after success
//           setSubadmin((prev) =>
//             prev.map((staff) =>
//               staff.id === id ? { ...staff, status: updatedStatus } : staff
//             )
//           );
//           toast.success("Status updated successfully!", {
//             position: "top-right",
//           });
//         } catch (error) {
//           console.error("Failed to update status:", error);
//           toast.error("Error updating status", { position: "top-right" });
//         }
//       };
//     return (
//         <>
//             <SidebarNav />
//             <div className="page-wrapper">
//                 <div className="content container-fluid">
//                     {/* Page Header */}
//                     <div className="my-3">
//                         <div className="row">
//                             <div className="col-sm-10">
//                                 <h3 className="page-title">List of Subadmin</h3>
//                             </div>
//                             <div className="col-sm-2">
//                                 <Link to="/admin/subadmin/create">
//                                     <button className="btn btn-primary btn-lg">Create Subadmin</button>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                     {/* /Page Header */}
//                     <div className="row">
//                         <div className="col-sm-12">
//                             <div className="card">
//                                 <div className="card-body">
//                                     {loading ? (
//                                         <div className="d-flex justify-content-center">
//                                             <Spinner animation="border" />
//                                         </div>
//                                     ) : (
//                                         <div className="table-responsive custom-table">
//                                             <table className="table">
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="text-start">Name / Email</th>
//                                                         <th>Roles & Permissions</th>
//                                                         <th>Created At</th>
//                                                         <th>Account Status</th>
//                                                         <th>Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {Array.isArray(subadmin) && subadmin.length > 0 ? (
//                                                         subadmin.map((staff) => (
//                                                             <tr key={staff.id}>
//                                                                 <td className="text-start email-anme">
//                                                                     <div>
//                                                                         <Link className="avatar mx-2" to="#">
//                                                                             <img
//                                                                                 className="rounded-circle"
//                                                                                 src={`${API_BASE_URL}/${staff.profileImage}`}
//                                                                                 alt={staff.firstName}
//                                                                                 width="40"
//                                                                             />
//                                                                         </Link>
//                                                                     </div>
//                                                                     <div>
//                                                                         <Link to="#">{staff.firstName} {staff.lastName}</Link> <br />
//                                                                         <span>{staff.email}</span>
//                                                                     </div>
//                                                                 </td>
//                                                                 <td onClick={() => handleShowPermissions(staff.RolePermission)}>
//                                                                     <FaEye fontSize={"18px"} />
//                                                                 </td>

//                                                                 <td>{new Date(staff.otpExpiresAt).toLocaleDateString()}</td>
//                                                                 {/* <td>
//                                                                     <div className="status-toggle">
//                                                                         <input id={`status${staff.id}`} className="check" type="checkbox" checked={staff.status === 1} />
//                                                                         <label htmlFor={`status${staff.id}`} className="checktoggle checkbox-bg">checkbox</label>
//                                                                     </div>
//                                                                 </td> */}
//                                                                 <td>
//                                                                     <div className="status-toggle">
//                                                                         <input
//                                                                             id={`status${staff.id}`}
//                                                                             className="check"
//                                                                             type="checkbox"
//                                                                             checked={staff.status === 1}
//                                                                             onChange={() => handleToggleStatus(staff.id, staff.status)}
//                                                                         />
//                                                                         <label htmlFor={`status${staff.id}`} className="checktoggle checkbox-bg">
//                                                                             checkbox
//                                                                         </label>
//                                                                     </div>
//                                                                 </td>

//                                                                 <td>
//                                                                     <div className="d-flex align-items-center action-buttons">
//                                                                         <Link to={`/admin/subadmin/edit/${staff.id}`} className="me-2">
//                                                                             <MdEdit fontSize={"18px"} />
//                                                                         </Link>
//                                                                         <MdDelete fontSize={"18px"} className="text-danger delete-icon" onClick={() => deleteBlogHandler(staff.id)} />
//                                                                     </div>
//                                                                 </td>
//                                                             </tr>
//                                                         ))
//                                                     ) : (
//                                                         <tr>
//                                                             <td colSpan="5" className="text-center">No subadmins found</td>
//                                                         </tr>
//                                                     )}
//                                                 </tbody>

//                                             </table>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="d-flex justify-content-end mt-3">
//                                     {/* <Pagination current={1} total={5} pagination={() => { }} /> */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <ShowPermissions show={showPermision} handleClose={() => setShowPermision(false)} permissions={selectedPermissions} />
//         </>
//     );
// };

// export default Subadminlist;
import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import SidebarNav from "../sidebar";
import ShowPermissions from "../CustomModals/ShowPermission";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const Subadminlist = () => {
    const [showPermision, setShowPermision] = useState(false);
    const [subadmin, setSubadmin] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        fetchStaffList();
    }, []);

    const fetchStaffList = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/api/admin/getStaff`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("API Response:", response.data); // Debugging
            if (response.data && Array.isArray(response.data.data)) {
                setSubadmin(response.data.data); // Use response.data.data
            } else {
                console.error("Unexpected response format:", response.data);
                setSubadmin([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error("Error fetching staff list:", error);
            toast.error("Failed to fetch subadmins", { position: "top-right" });
        } finally {
            setLoading(false);
        }
    };
    const deleteBlogHandler = async (id) => {
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
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_BASE_URL}/api/admin/deleteStaff/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    toast.success("Admin Staff and associated Role Permissions deleted successfully!", { position: "top-right" });
                    fetchStaffList();
                }
            } catch (error) {
                console.error("Error deleting subadmin:", error);
                toast.error("Failed to delete subadmin", { position: "top-right" });
            }
        }
    };

    const handleShowPermissions = (permissions) => {
        setSelectedPermissions(permissions);
        setShowPermision(true);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const token = localStorage.getItem("token");
        // Toggle between 1 (active) and 0 (inactive)
        const updatedStatus = currentStatus === 1 ? 0 : 1;

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/admin/staffStatusUpdate/${id}`,
                { id, status: updatedStatus }, // Body structure based on API requirements
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Check if the response status is 200 (success)
            if (response.status === 200) {
                // Update local state
                setSubadmin((prev) =>
                    prev.map((staff) =>
                        staff.id === id ? { ...staff, status: updatedStatus } : staff
                    )
                );
                toast.success("Status updated successfully!", {
                    position: "top-right",
                });
            } else {
                toast.error("Failed to update status", { position: "top-right" });
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Error updating status", { position: "top-right" });
        }
    };

    return (
        <>
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
                                        <div className="d-flex justify-content-center">  <Spinner animation="border" /></div>
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
                                                    {Array.isArray(subadmin) && subadmin.length > 0 ? (
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
                                                                <td>{new Date(staff.otpExpiresAt).toLocaleDateString()}</td>
                                                                <td>
                                                                    {/* <div className="status-toggle">
                                                                        <input
                                                                            id={`status${staff.id}`}
                                                                            className="check"
                                                                            type="checkbox"
                                                                            checked={staff.status === 1}
                                                                            onChange={() => handleToggleStatus(staff.id, staff.status)}
                                                                        />
                                                                        <label htmlFor={`status${staff.id}`} className="checktoggle checkbox-bg">  checkbox </label>
                                                                    </div> */}
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