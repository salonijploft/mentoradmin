import React, { useState, useEffect } from "react";
import { Table } from "antd";
import SidebarNav from "../sidebar";
import { Link, useLocation } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
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


const Mentor = () => {
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
  const [verifyStatusss, setVerifyStatusss] = useState(0)
  const location = useLocation();

  const token = localStorage.getItem("token");
  // Define mapping of routes to verifyStatus
  const routeStatusMap = {
    "/admin/pending-mentors": 0,
    "/admin/approved-mentors": 1,
    "/admin/rejected-mentors": 2,
    "/admin/deleted-mentors": 3,
  };
  // Get the verifyStatus based on the current route
  const verifyStatus = routeStatusMap[location.pathname] ?? 0;


  // Fetch Mentors
  const fetchMentors = async () => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("Authorization token is missing!");
      }

      const searchParam = filters.MentorName ? `&search=${filters.MentorName}` : "";

      const response = await axios.get(
        `${API_BASE_URL}/api/admin/getMentors?verifyStatus=${verifyStatus}&limit=${limit}&page=${currentPage}${searchParam}`,
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

    setTimeout(() => {
      fetchMentors();
    }, 0);
  };

  const pathname = window.location.pathname;

  const handleToggleStatus = async (mentorId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User might not be authenticated.");
        return;
      }

      const newStatus = currentStatus === 1 ? 0 : 1;

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/accountStatusUpdate`,
        { id: mentorId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
        toast.success("Mentor status updated successfully!", { position: "top-right" });
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


  const handleVerify = async (mentorId, newStatus) => {
    if (newStatus === 2 || newStatus === 3) {
      setSelectedMentor(mentorId);
      setVerifyStatusss(newStatus)
      setShowModal(true);
      return;
    }

    try {
      setVerifyStatusss(newStatus)
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing!");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/verifyStatusUpdate`,
        { verifyStatus: newStatus, id: mentorId, rejectedReson: "" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        fetchMentors();
        toast.success(`Mentor Verify Status updated successfully!`, { position: "top-right" });
        // Update state locally instead of re-fetching all mentors
        setMentorStatus(true)
      }
    } catch (error) {
      console.error("Error updating mentor verify status:", error);
    }
  };

  const handleDropdownChange = (mentor, newStatus) => {
    if (newStatus === 2 || newStatus === 3) {
      setSelectedMentor({ ...mentor, status: newStatus });
      setShowModal(true);
    } else {
      handleVerify(mentor.id, newStatus);
    }
  };


  const handleSubmit = () => {
    if (selectedMentor) {
      handleVerify(selectedMentor.id, selectedMentor.status);
      setShowModal(false);
      setReason("");
    }
  };


  const submitRejectionReason = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing!");
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/admin/verifyStatusUpdate`,
        { verifyStatus: verifyStatusss, id: selectedMentor, rejectedReason: rejectionReason }, // Include reason
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Rejection reason submitted!", { position: "top-right" });
        setShowModal(false);
        setRejectionReason("");
        fetchMentors();
      }
    } catch (error) {
      console.error("Error submitting rejection reason:", error);
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
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/mentorDelete/${mentorId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with actual token if required
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
    })
  };

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <h3 className="page-title">Mentor List </h3>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="row mb-3">
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

                <div className="col-md-3 d-flex gap-2">
                  <button className="btn-primary-new" onClick={handleSearch}>
                    Search
                  </button>
                  <button className="btn btn-secondary" onClick={resetFilters}>
                    Reset
                  </button>
                </div>

              </div>

              <div className="card">
                <div className="card-body">
                  <div className="table-responsive custom-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-start">Name / Email</th>
                          <th>TIN Number</th>
                          <th>Earned</th>
                          <th>Account Status</th>
                          <th>Mentorship Tracks</th>
                          {/* {pathname?.split("/admin/")[1] === "pending-mentors" && <th>Verify Status</th>}
                          {pathname?.split("/admin/")[1] === "rejected-mentors" && ( */}
                          {verifyStatus === 0 && <th>Verify Status</th>}
                          {verifyStatus === 2 && (
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
                              <Spinner height={50} width={50} color="#4fa94d" />
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
                                  <Link to="#">{mentor.firstName}</Link> <br />
                                  <span>{mentor.email}</span>
                                </div>
                              </td>
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
                                    checked={mentor.status === 1} // Ensure you use `status`, not `verifyStatus`
                                    onChange={() => handleToggleStatus(mentor.id, mentor.status)}
                                  />
                                  <label htmlFor={`rating${mentor.id}`} className="checktoggle checkbox-bg">
                                    Toggle
                                  </label>
                                </div>
                              </td>
                              <td>
                                {/* <Link to={`/admin/mentor-tracks/${mentor.id}`}>
                                  <button className="btn btn-primary">View</button>
                                </Link> */}

                                <Link>
                                  <button className="btn btn-primary">View</button>
                                </Link>
                              </td>
                              {/* {(pathname?.split("/admin/")[1] === "pending-mentors" ||
                                pathname?.split("/admin/")[1] === "reverify-mentors") && ( */}
                              {(mentor.verifyStatus === 0) ? (
                                <td>
                                  <select
                                    value={mentor.verifyStatus}
                                    onChange={(e) => handleVerify(mentor.id, parseInt(e.target.value))}
                                    className="form-select"
                                  >
                                    <option value="0">Pending</option>
                                    <option value="1">Approved</option>
                                    <option value="2">Soft Reject</option>
                                    <option value="3">Hard Reject</option>
                                  </select>
                                </td>
                              ) : (mentor.verifyStatus === 2) ? (
                                <span className="user-name">Soft Rejected</span>
                              ) : ""}
                              {
                                mentor.verifyStatus === 2 && (
                                  <td>{mentor.rejectedReson ? mentor.rejectedReson : "N?A"}</td>
                                )
                              }
                              <td>{mentor.lastLoginDate || "-"}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link to={`/admin/mentor-detail/${mentor.id}`}>
                                    <FaEye fontSize={"18px"} />
                                  </Link>
                                  {/* {pathname?.split("/admin/")[1] !== "deleted-mentors" && ( */}
                                  {verifyStatus !== 3 && (
                                    <MdDelete fontSize={"18px"} className="text-danger delete-icon mt-1"
                                      onClick={() => handleDelete(mentor.id)}
                                    />
                                    // <button onClick={() => handleDelete(mentor.id)}>🗑️</button>
                                  )}
                                  {/* {pathname?.split("/admin/")[1] !== "deleted-mentors" && ( */}
                                  {verifyStatus !== 3 && (
                                    <>
                                      {/* {pathname?.split("/admin/")[1] === "approved-mentors" && ( */}
                                      {verifyStatus === 1 && (
                                        <Link to={`/admin/mentor-wallet/${mentor.id}`}>
                                          <FaWallet fontSize={"18px"} />
                                        </Link>
                                      )}
                                      {/* <Link to={`/admin/mentor-sessions/${mentor.id}`}>
                                        <button className="btn btn-primary">Sessions</button>
                                      </Link> */}
                                      <Link >
                                        <button className="btn btn-primary">Sessions</button>
                                      </Link>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>

                    </table>
                    {/* modal */}
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
                          onClick={() => {
                            submitRejectionReason();
                          }}
                        >
                          Submit
                        </Button>
                      </Modal.Footer>
                    </Modal>

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
        <RejectReason show={status} handleClose={() => setStatus(false)} />
      </div>
    </>
  );
};

export default Mentor;
