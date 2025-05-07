import React, { useState, useEffect } from "react";
import { Table } from "antd";
import SidebarNav from "../sidebar";
import { Link, useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import Pagination from "../Pagination/Pagination";
import { FaEye, FaWallet } from "react-icons/fa";
import RejectReason from "../CustomModals/RejectReson";
import { API_BASE_URL } from "../../../Helper/apicall";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";
import { useUser } from "../../../context/UserContext.js";
import  Loader  from "../Loader.js";

const Mentor = () => {
  const [status, setStatus] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ MentorName: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const location = useLocation();
  const { rolePermissions } = useUser();
  console.log("rolePermissions in the mentor module ", rolePermissions);
  const token = Cookies.get('token');

  // Define mapping of routes to verifyStatus
  const routeStatusMap = {
    "/admin/pending-mentors": 0,
    "/admin/approved-mentors": 1,
    "/admin/rejected-mentors": 2,
    "/admin/deleted-mentors": 3,
  };
  const verifyStatus = routeStatusMap[location.pathname] ?? 0;
  // Fetch Mentors
  const fetchMentors = async () => {
   setLoading(true);
    try {
      if (!token) {
        throw new Error("Authorization token is missing!");
      }
      const searchParam = filters.MentorName ? `&search=${filters.MentorName}` : "";
      const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/getMentors?verifyStatus=${verifyStatus}&limit=${limit}&page=${currentPage}${searchParam}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "application/json",
        // },
        withCredentials: true,
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
  }, [verifyStatus, currentPage]);

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
    fetchMentors();
  };

  const handleToggleStatus = async (mentorId, currentStatus) => {
    try {
      if (!token) {
        console.error("No token found! User might not be authenticated.");
        return;
      }
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await axiosSecure.post(
        `${API_BASE_URL}/api/admin/accountStatusUpdate`,
        { id: mentorId, status: newStatus },
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // }
        {
          withCredentials: true,
        }
      );
      if (response.data.status === 200) {
        toast.success("Mentor status updated successfully!", { position: "top-right" });
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

  const handleVerify = async (mentorId, newStatus, rejectionReason = "") => {
    if ((newStatus === 2 || newStatus === 3) && !rejectionReason) {
      setSelectedMentor({ id: mentorId, status: newStatus });
      setShowModal(true);
      return;
    }
    try {
      const response = await axiosSecure.post(
        `${API_BASE_URL}/api/admin/verifyStatusUpdate`,
        {
          verifyStatus: newStatus,
          id: mentorId,
          rejectedReason: rejectionReason,
        },
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // }
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        fetchMentors();
        toast.success("Mentor Verify Status updated successfully!", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating mentor verify status:", error);
    }
  };

  const handleSubmit = () => {
    if (selectedMentor) {
      handleVerify(selectedMentor.id, selectedMentor.status);
      setShowModal(false);
      setRejectionReason("");
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
          const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/mentorDelete/${mentorId}`, 
          //   {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
          {
            withCredentials: true,
          }
        );
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

  const submitRejectionReason = () => {
    if (selectedMentor) {
      handleVerify(selectedMentor.id, selectedMentor.status, rejectionReason);
      setShowModal(false);
      setRejectionReason("");
    }
  };

  //   Permission Check Function
  const hasPermission = (moduleName, action) => {
    const permission = rolePermissions.find(permission => permission.moduleName === 'Mentor');
    console.log("permissions for MentorModule:", permission);
    return permission ? permission[action] === 1 : false;
  };

  const hasReadPermission = (moduleName) => hasPermission(moduleName, 'isRead');
  const hasCreatePermission = (moduleName) => hasPermission(moduleName, 'isCreate');
  const hasUpdatePermission = (moduleName) => hasPermission(moduleName, 'isUpdate');
  const hasDeletePermission = (moduleName) => hasPermission(moduleName, 'isDelete');

  return (
    <>
    {loading && <Loader />}
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Mentor List </h3>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12"> 
                <div className="row mb-3">
                {hasReadPermission('Mentor') && (
                  <div className="col-md-3 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by Mentor Name"
                      name="MentorName"
                      value={filters.MentorName}
                      onChange={handleFilterChange}
                    />
                  </div>
                )}
                  <div className="col-md-3 d-flex gap-2">
                    {hasReadPermission('Mentor') && (
                      <button className="btn-primary-new" onClick={handleSearch}>
                        Search
                      </button>
                    )}
                    {hasReadPermission('Mentor') && (
                      <button className="btn btn-secondary" onClick={resetFilters}>
                        Reset
                      </button>
                    )}
                  </div>
                </div>

              <div className="card">
                <div className="card-body">
                  <div className="table-responsive custom -table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-start">Name / Email</th>
                          <th>Issubscribedemail</th>
                          <th>TIN Number</th>
                          <th>Earned</th>
                          <th>Account Status</th>
                          <th>Mentorship Tracks</th>
                          {hasUpdatePermission('Mentor') && verifyStatus === 0 && <th>Verify Status</th>}
                          {hasUpdatePermission('Mentor') && verifyStatus === 0 && <th>Verify Status</th>}
                          {hasUpdatePermission('Mentor') && verifyStatus === 2 && (
                            <>
                              <th>Rejected Status</th>
                              <th>Rejected Reason</th>
                            </>
                          )}
                          <th>Last Login Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                           
                            </td>
                          </tr>
                        ) : mentors.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center">No mentors available.</td>
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
                              <td>{mentor.isSubscribeEmail === "1" ? "Yes" : "No"}</td>
                              <td>
                                <span className="user-name">{mentor.tinNumber || "N/A"}</span>
                              </td>
                              <td>₦ {mentor.earned || "0.00"}</td>
                              <td>
                                <div className="status-toggle">
                                  <input
                                    id={`rating${mentor.id}`}
                                    className="check"
                                    type="checkbox"
                                    checked={mentor.status === 1}
                                    onChange={() => hasUpdatePermission('Mentor') && handleToggleStatus(mentor.id, mentor.status)}
                                  />
                                  <label htmlFor={`rating${mentor.id}`} className="checktoggle checkbox-bg">
                                    Toggle
                                  </label>
                                </div>
                              </td>
                              <td>{hasReadPermission('Mentor') && (
                                <Link to={`/admin/mentor-tracks/${mentor.id}`}>
                                  <button className="btn btn-primary" disabled={!hasReadPermission('Mentor')}>View</button>
                                </Link>
                              )}
                              </td>
                              {(mentor.verifyStatus === 0) ? (
                                <td>
                                  <select value={mentor.verifyStatus}
                                    onChange={(e) => hasUpdatePermission('Mentor') && handleVerify(mentor.id, parseInt(e.target.value))}
                                    className="form-select"
                                  >
                                    <option value="0">Pending</option>
                                    <option value="1">Approved</option>
                                    <option value="2">Reject</option>
                                  </select>
                                </td>
                              ) : (mentor.verifyStatus === 2) ? (
                                <span className="user-name">Rejected</span>
                              ) : ""}
                              {mentor.verifyStatus === 2 && (
                                <td>{mentor.rejectedReason ? mentor.rejectedReason : "N/A"}</td>
                              )}
                              <td>{mentor.lastLoginDate || "-"}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  {hasReadPermission('Mentor') && (
                                    <Link to={`/admin/mentor-detail/${mentor.id}`}>
                                      <FaEye fontSize={"18px"} />
                                    </Link>
                                  )}
                                  {hasDeletePermission('Mentor') && verifyStatus !== 3 && (
                                    <MdDelete fontSize={"18px"} className="text-danger delete-icon mt-1"
                                      onClick={() => handleDelete(mentor.id)}
                                    />
                                  )}
                                  {verifyStatus !== 3 && (
                                    <>
                                      {hasUpdatePermission('Mentor') && verifyStatus === 1 && (
                                        <Link to={`/admin/mentor-wallet/${mentor.id}`}>
                                          <FaWallet fontSize={"18px"} />
                                        </Link>
                                      )}
                                      {hasReadPermission('Mentor') && (
                                        <Link to={`/admin/mentor-sessions/${mentor.id}`}>
                                          <button className="btn btn-primary" disabled={!hasReadPermission('Mentor')}>Sessions</button>
                                        </Link>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                      <Modal.Header closeButton>
                        <Modal.Title>Rejected Reason</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <label htmlFor="rejectionReason">Reason</label>
                        <input
                          id="rejectionReason"
                          className="form-control"
                          type="text"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          onClick={submitRejectionReason}
                          disabled={!rejectionReason.trim()}
                        >
                          Submit
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Pagination current={currentPage} total={totalPage}
                      pagination={(page) => {
                        setCurrentPage(page); // Update currentPage state
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RejectReason show={status} handleClose={() => setStatus(false)} />
      </div>
    </>
  );
};
export default Mentor;