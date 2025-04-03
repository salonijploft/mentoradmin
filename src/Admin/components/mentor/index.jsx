import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import SidebarNav from "../sidebar";
import { avatar06, avatar07, avatar08, avatar09, avatar10, avatar11, avatar12, avatar13 } from "../imagepath";
import { Link, useLocation} from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import Pagination from "../Pagination/Pagination";
import { FaEye, FaWallet } from "react-icons/fa";
import RejectReason from "../CustomModals/RejectReson";
import { API_BASE_URL } from "../../../Helper/apicall";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Spinner } from "react-bootstrap";


const Mentor = () => {
  const [status, setStatus] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ MentorName: "" });
  const location = useLocation();

  // Define mapping of routes to verifyStatus
  const routeStatusMap = {
    "/admin/pending-mentors": 0,
    "/admin/approved-mentors": 1,
    "/admin/rejected-mentors": 2,
    "/admin/deleted-mentors": 3,
  };
   // Get the verifyStatus based on the current route
   const verifyStatus = routeStatusMap[location.pathname] ?? 0;

  // useEffect(() => {
  //   fetchMentors();
  // }, []);

  // const fetchMentors = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await axios.get(`${API_BASE_URL}/api/admin/getMentors?verifyStatus=1`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.data.status === 200) {
  //       setMentors(response.data.data);
  //     } else {
  //       console.error("Failed to fetch mentors");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching mentors:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token is missing!");
        }
        const response = await axios.get(`${API_BASE_URL}/api/admin/getMentors?verifyStatus=${verifyStatus}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMentors(response.data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, [verifyStatus, location.pathname]);  

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ MentorName: "" });
  };

  const pathname = window.location.pathname;


  const handleToggleStatus = async (mentorId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found! User might not be authenticated.");
        return;
      }
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle between active (1) and inactive (0)
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/accountStatusUpdate`,
        { id: mentorId, status: newStatus }, // Ensure correct payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status === 200) {
          toast.success("Mentor updated successfully!", { position: "top-right" });
        setMentors((prevMentors) =>
          prevMentors.map((mentor) =>
            mentor.id === mentorId ? { ...mentor, verifyStatus: newStatus } : mentor
          )
        );
        console.log(` Mentor ${mentorId} status updated to ${newStatus}`);
      } else {
        console.error(" Failed to update mentor status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating mentor status:", error);
    }
  };

  ///api for account update 
  const handleVerify = async (mentorId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing!");
      }
  
      // Mapping status values to their respective meanings
      const statusPayload = {
        0: "Pending",
        1: "Approved",
        2: "Soft Reject",
        3: "Hard Reject",
      };
  
      // First API call to update account status
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/verifyStatusUpdate`,
        {
          status: newStatus,
          id: mentorId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log(`Status updated to ${statusPayload[newStatus]} successfully!`, response.data);
  
      // Second API call for Hard Reject (verifyStatus = 3)
      if (newStatus === 3) {
        const verifyResponse = await axios.post(
          "https://g70bg47x-3010.inc1.devtunnels.ms/api/admin/verifyStatusUpdate",
          {
            verifyStatus: 3,
            id: mentorId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Verification status updated successfully!", verifyResponse.data);
      }
  
      if (response.status === 200) {
        toast.success(`Mentor status updated to ${statusPayload[newStatus]} successfully!`, {
          position: "top-right",
        });
      }
      setMentors((prevMentors) =>
        prevMentors.map((mentor) =>
          mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
        )
      );
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("Network Error! Check API URL or backend.");
        alert("Network Error! Check if the server is running.");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
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
                  <button className="btn-primary-new">Search</button>
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
                        ) : (
                          mentors.map((mentor) => (
                            <tr key={mentor.id}>
                              <td className="email-anme text-start">
                                <div>
                                  <Link className="avatar mx-2" to="#">
                                    <img
                                      className="rounded-circle"
                                      src={`https://g70bg47x-3010.inc1.devtunnels.ms/${mentor.profileImage}` || "default-avatar.png"}
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
                                <span className="user-name">{mentor.lastLoginDate || "N/A"}</span>
                              </td>
                              <td>{mentor.Earned}</td>
                              <td>
                                <div className="status-toggle">
                                  <input
                                    id={`rating${mentor.id}`}
                                    className="check"
                                    type="checkbox"
                                    checked={mentor.verifyStatus === 1} // Active if status is 1
                                    onChange={() => handleToggleStatus(mentor.id, mentor.verifyStatus)}
                                  />
                                  <label htmlFor={`rating${mentor.id}`} className="checktoggle checkbox-bg">
                                    Toggle
                                  </label>
                                </div>
                              </td>

                              <td>
                                <Link to={`/admin/mentor-tracks/${mentor.id}`}>
                                  <button className="btn btn-primary">View</button>
                                </Link>
                              </td>

                              {verifyStatus === 2 && (
                                <>
                                  <td>Hard Rejected</td>
                                  <td>Fake Mentor</td>
                                </>
                              )}

                              {pathname?.split("/admin/")[1] === "rejected-mentors" && (
                                <>
                                  <td>Hard Rejected</td>
                                  <td>Fake Mentor</td>
                                </>
                              )}
                              {/* {(pathname?.split("/admin/")[1] === "pending-mentors" ||
                                pathname?.split("/admin/")[1] === "reverify-mentors") && ( */}
                                  {(verifyStatus === 0 || verifyStatus === 2) && (
                                 <td>
                                    <select
                                      value={mentor.status}
                                      onChange={(e) => handleVerify(mentor.id, parseInt(e.target.value))}
                                      className="form-select"
                                    >
                                      <option value="0">Pending</option>
                                      <option value="1">Approved</option>
                                      <option value="2">Soft Reject</option>
                                      <option value="3">Hard Reject</option>
                                    </select>
                                  </td>
                                )}
                              <td>1 March 2020</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Link to={`/admin/mentor-detail/${mentor.id}`}>
                                    <FaEye fontSize={"18px"} />
                                  </Link>
                                  {/* {pathname?.split("/admin/")[1] !== "deleted-mentors" && ( */}
                                  {verifyStatus !== 3 && (
                                    <MdDelete fontSize={"18px"} className="text-danger delete-icon mt-1" />
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
                                      <Link to={`/admin/mentor-sessions/${mentor.id}`}>
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
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Pagination current={1} total={5} pagination={() => { }} />
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
