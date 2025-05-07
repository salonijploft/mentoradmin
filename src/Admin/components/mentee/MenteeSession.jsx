import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import PaymentDetails from "../CustomModals/PaymentDetails";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
require("../../../client/assets/css/custom.css");
import { axiosSecure } from "../../../utils/axiosSecureInstance";
import Cookies from "js-cookie";
import Loader from "../Loader";

const MentorSession = () => {
    
    const [key, setKey] = useState("completed");
    const [showPayment, setShowPaymentPopup] = useState(false);
    const [sessionData, setSessionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [Loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = Cookies.get("token");
    const { id } = useParams();

    useEffect(() => {
        const fetchSessions = async () => {
            const timeoutId = setTimeout(() => {
                setLoading(false); // Stop loading after a minimum duration
              }, 5000); // Set minimum loading time (e.g., 2 seconds)
        
            try {
                setLoading(true); // Start loading
                if (!id || !token) return;
                const response = await axiosSecure.get(
                    `${API_BASE_URL}/api/admin/menteeSessionLists/${id}`,

                    {
                        withCredentials: true,
                    }
                );
                setSessionData(response.data.data);
            } catch (error) {
                setError("Failed to fetch session data");
            } finally {
                setLoading(false); // Stop loading
                setIsLoading(false);
                clearTimeout(timeoutId);
            }
        };
        fetchSessions();
    }, [id, token]); // Add dependencies if they come from props, route, or state

    return (
        <>
            {loading && <Loader />} {/* Show loader while loading */}
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Session Lists</h3>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-sm-12">
                            <Tabs id="booking-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-1 custom-tabs">
                                <Tab eventKey="upcoming" title="Upcoming Sessions">
                                    {/* Content for Upcoming Sessions */}
                                </Tab>
                                <Tab eventKey="completed" title="Completed Sessions">
                                    {/* Content for Completed Sessions */}
                                </Tab>
                                <Tab eventKey="cancelled" title="Cancelled Sessions">
                                    {/* Content for Cancelled Sessions */}
                                </Tab>
                            </Tabs>
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive custom-table">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Mentee Name</th>
                                                    <th>Mentorship Track Name</th>
                                                    <th>Session Track Name</th>
                                                    <th>Remaining Sessions</th>
                                                    <th>Completed Sessions</th>
                                                    <th>Session Track Duration</th>
                                                    <th>Time Zone</th>
                                                    <th>Per Session Amount</th>
                                                    <th>Session Date & Time</th>
                                                    <th>Booked Date & Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessionData.length > 0 ? (
                                                    sessionData.map((session, index) => (
                                                        <tr key={index}>
                                                            <td>{session.MentorName}</td>
                                                            <td>{session.SessionTrack}</td>
                                                            <td>{'Introduction to frontend development'}</td>
                                                            <td>{session.sessionRemaing}</td>
                                                            <td>{session.sessionTaken}</td>
                                                            <td>{'3 Months (6 Sessions)'}</td>
                                                            <td>{session.TimeSlot}</td>
                                                            <td className="amounts cursor-pointer" onClick={() => {
                                                                setShowPaymentPopup(true);
                                                            }}>{session.SessionAmount}</td>
                                                            <td>{session.sessionTime}</td>
                                                            <td>{session.BookingTime}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    !loading && <tr><td colSpan="10" className="text-center">No sessions available</td></tr>
                                                )}
                                            </ tbody>
                                        </table>
                                    </div>
                                    <div className="d-flex justify-content-end mt-3">
                                        <Pagination
                                            current={1}
                                            total={5}
                                            pagination={() => { }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PaymentDetails
                    show={showPayment}
                    handleClose={() => {
                        setShowPaymentPopup(false);
                    }}
                />
            </div>
        </>
    );
};

export default MentorSession;