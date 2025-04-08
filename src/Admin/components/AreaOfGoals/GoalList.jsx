import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import { API_BASE_URL } from "../../../Helper/apicall";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap"; // Import Spinner

const GoalList = () => { 
    const [goals, setGoals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true); // New state for loader
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        setLoading(true); // Start loading
        if (!token) {
            console.error("Token not found. Redirecting to login.");
            navigate("/login"); // Redirect if token is missing
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/getMenteeGoals?limit=${limit}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            console.log("Response Data:", response.data.pagination.currentPage); // Debugging
            if (response.data.status === 200) {
                setGoals(response.data.data); // Ensure goals is an array
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
                console.log("Data fetched successfully:", response.data.data);
                console.log("count:", response.data.pagination.totalCount);
            } else {
                console.error("Error fetching data:", response.data.message);
            }
        } catch (error) {
            console.error("API Error:", error);
            if (error.response) {
                console.error("Response Status:", error.response.status);
                console.error("Response Data:", error.response.data);
            }
            if (error.response?.status === 401) {
                console.error("Unauthorized access. Redirecting to login.");
                navigate("/login"); // Redirect to login if unauthorized
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchData();
    }, [page]);

    // Function to handle category deletion
    const handleDelete = async (id) => {
        console.log("handleDelete called with goalId:", id);
        if (!id) {
            console.error("Invalid goal ID");
            return;
        }
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/deleteMenteeGoal/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Delete API response:", response);
                if (response.data.status === 200) {
                    setGoals(goals.filter(goal => goal.id !== id));
                    toast.success("Goal deleted successfully!", { position: "top-right" });
                } else {
                    toast.error("Failed to delete goal.", { position: "top-right" });
                }
            } catch (error) {
                console.error("Error deleting goal:", error);
                toast.error("Failed to delete goal.", { position: "top-right" });
            }
        }
    };

    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-10">
                                <h3 className="page-title">Mentorship Goals</h3>
                            </div>
                            <div className="col-sm-2 text-end">
                                <Link to="/admin/add-goal">
                                    <button className="btn btn-primary btn-lg">Create Goal</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    {loading ? (
                                        <div className="d-flex justify-content-center">
                                            <Spinner animation="border" />
                                        </div>
                                    ) : (
                                        <div className="table-responsive custom-table">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Status</th>
                                                        <th>Created At</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {goals.length > 0 ? (
                                                        goals.map((item) => (
                                                            <tr key={item.id}>
                                                                <td>{item.title}</td>
                                                                <td>{item.status === 1 ? "Active" : "Inactive"}</td>
                                                                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}</td>
                                                                <td>
                                                                    <div className="d-flex action-buttons">
                                                                        <Link to={`/admin/edit-goal/${item.id}`} className="me-2">
                                                                            <MdEdit fontSize={"18px"} />
                                                                        </Link>
                                                                        <MdDelete
                                                                            onClick={(e) => {
                                                                                e.stopPropagation(); // Ensure click event is not blocked
                                                                                handleDelete(item.id);
                                                                            }}
                                                                            fontSize={"18px"}
                                                                            className="text-danger delete-icon"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="text-center">No Goals Found</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {/* Custom Pagination Component Placeholder */}
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
            </div>
        </>
    );
};

export default GoalList;