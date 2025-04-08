import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import PaymentDetails from "../CustomModals/PaymentDetails";
import { Tab, Tabs } from "react-bootstrap";
import ShowSessionList from "../CustomModals/ShowSessionList";
import { API_BASE_URL } from "../../../Helper/apicall";

require("../../../client/assets/css/custom.css");

const MentorTracks = () => {
    const [key, setKey] = useState("completed");
    const [showPayment, setShowPaymentPopup] = useState(false);
    const [sessionTracks, setSessionTracks] = useState([]);

    useEffect(() => {
        const fetchSessionTracks = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${API_BASE_URL}/api/admin/mentorTrackLists/4`, {
                        headers: { Authorization: `Bearer ${token}` },        
                });
                if (response.data && response.data.data) {
                    setSessionTracks(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching session tracks:", error);
            }
        };
        fetchSessionTracks();
    }, []);

    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Mentorship Track List</h3>
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
                                                    <th>Session Track Name</th>
                                                    <th>Mentorship Track Duration</th>
                                                    <th>Track Price</th>
                                                    <th>Created At</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessionTracks.map((session, index) => (
                                                    <tr key={index}>
                                                        <td>{session.trackName || "N/A"}</td>
                                                        <td>{session.trackDuration || "N/A"}</td>
                                                        <td className="amounts cursor-pointer">{session.trackPrice || "N/A"}</td>
                                                        <td>{session.createdAt}</td>
                                                        <td>
                                                            <button className="btn btn-primary" onClick={() => setShowPaymentPopup(true)}>View</button>
                                                        </td>
                                                    </tr>
                                                ))}
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
                <ShowSessionList
                    show={showPayment}
                    handleClose={() => setShowPaymentPopup(false)}
                    data={sessionTracks[0]?.sessions}
                />
            </div>
        </>
    );
};

export default MentorTracks;
