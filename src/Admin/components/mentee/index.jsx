import React, { useState, useEffect } from "react";
import { Table } from "antd";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import SidebarNav from "../sidebar";
import { user, user_1, user_2, user_3, user_4, user_5, user_6, user_7, user_8, user_9 } from "../imagepath";
import { Link, useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Pagination from "../Pagination/Pagination";
import { FaEye, FaWallet } from "react-icons/fa";
import RejectReason from "../CustomModals/RejectReson";
import { API_BASE_URL } from "../../../Helper/apicall";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import {axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";


const Mentee = () => {
  const [status, setStatus] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [mentorStatus, setMentorStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ MentorName: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const token = Cookies.get("token");

  // Get the verifyStatus based on the current route
  const routeStatusMap = {
    "/admin/mentee-list": 0,
    "/admin/deleted-mentees": 1

  };
  // Get the verifyStatus based on the current route
  const isDelete = routeStatusMap[location.pathname] ?? 0;

  // Fetch Mentors
  const fetchMentors = async () => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("Authorization token is missing!");
      }
      const searchParam = filters.MentorName ? `&search=${filters.MentorName}` : "";
      const response = await axiosSecure.get(
        // `${API_BASE_URL}/api/admin/getMentees?type=${isDelete}&limit=${limit}&page=${currentPage}${searchParam}`,
        `${API_BASE_URL}/api/admin/getMentees?limit=${limit}&page=${page}${searchParam}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        setMentors(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Mentors when page loads and when filters change
  useEffect(() => {
    fetchMentors();
  }, [page]);

  // Handle Input Change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle Search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    fetchMentors();
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({ MentorName: "" });
    setCurrentPage(1); // Reset to first page

    setTimeout(() => {
      fetchMentors();
    }, 0);
  };
  const pathname = window.location.pathname;

  const handleToggleStatus = async (mentorId, currentStatus) => {
    try {
      const token = Cookies.get("token");
      // const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User might not be authenticated.");
        return;
      }

      const newStatus = currentStatus === 1 ? 0 : 1;

      const response = await axiosSecure.post(
        `${API_BASE_URL}/api/admin/menteeStatuUpdate/${mentorId}`,
        { id: mentorId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        toast.success("Mentee status updated successfully!", { position: "top-right" });
        // Update the mentor status in the local state without re-fetching
        setMentors((prevMentors) =>
          prevMentors.map((mentor) =>
            mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
          )
        );
      } else {
        console.error("Failed to update mentor status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating mentor status:", error);
    }
  };

  const handleDelete = async (mentorId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = Cookies.get("token");
          const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/mentorDelete/${mentorId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            toast.success("Mentor deleted successfully!");
            setMentors((prevMentors) => prevMentors.filter((mentor) => mentor.id !== mentorId));
          }
        } catch (error) {
          console.error("Error deleting mentor:", error);
          alert("Failed to delete mentor. Please try again.");
        }
      }
    });
  };


  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">List of Mentee</h3>

              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive custom-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-start">Name / Email</th>
                          <th>Issubscribed Email</th> 
                          <th>Created At</th>
                          <th>Account Status</th>
                          <th>Last Login Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              <Spinner height={50} width={50} color="#4fa94d" />
                            </td>
                          </tr>
                        ) : mentors.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center">No mentees available.</td>
                          </tr>
                        ) : (
                          mentors.map((mentor) => (
                            <tr key={mentor.id}>
                              <td className="email-anme text-start">
                                <div>
                                  <Link className="avatar mx-2" to="#">
                                    <img
                                      className="rounded-circle"
                                      src={`${API_BASE_URL}/${mentor.profileImage}` || "default-avatar.png"}
                                      alt={mentor.firstName}
                                    />
                                  </Link>
                                </div>
                                <div>
                                  <Link to="#">{mentor.firstName} {mentor.lastName}</Link> <br />
                                  <span>{mentor.email}</span>
                                </div>
                              </td>
                              <td>{mentor.isSubscribeEmail === "1" ? "yes" : "No"}</td>
                              <td>
                                <span className="user-name">{mentor.createdAt || "-"}</span>
                              </td>

                              <td>
                                <div className="status-toggle">
                                  <input
                                    id={`rating${mentor.id}`}
                                    className="check"
                                    type="checkbox"
                                    checked={mentor.status === 1} // Ensure you use `status`, not `verifyStatus`
                                    onChange={() => handleToggleStatus(mentor.id, mentor.status)}
                                  />
                                  <label htmlFor={`rating${mentor.id}`} className="checktoggle checkbox-bg">  Toggle </label>
                                </div>
                              </td>

                              <td>{mentor.lastLoginDate || "-"}</td>

                              <td>
                                <div className="d-flex gap-2">
                                  <Link to={`/admin/mentee-detail/${mentor.id}`}>
                                    <FaEye fontSize={"18px"} />
                                  </Link>
                                  <MdDelete fontSize={"18px"} className="text-danger delete-icon mt-1"
                                    onClick={() => handleDelete(mentor.id)}
                                  />
                                  <>
                                    <Link>
                                      <FaWallet fontSize={"18px"} />
                                    </Link>
                                    {/* <Link to={`/admin/mentor-sessions/${mentor.id}`}>
                                      <button className="btn btn-primary">Sessions</button>
                                    </Link> */}
                                    <Link to={`/admin/mentee-sessions/${mentor.id}`}>
                                      <button className="btn btn-primary">Sessions</button>
                                    </Link>
                                  </>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>

                    </table>
                  </div>
                </div>
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
      </div >
    </>
  );
};

export default Mentee;
