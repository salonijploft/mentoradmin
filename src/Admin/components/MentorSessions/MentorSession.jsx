import React, { useState, useEffect } from "react";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import PaymentDetails from "../CustomModals/PaymentDetails";
import { Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
require("../../../client/assets/css/custom.css");
import { useParams } from "react-router-dom";

const MentorSession = () => {
    const { id } = useParams();
    const [key, setKey] = useState("completed");
    const [showPayment, setShowPaymentPopup] = useState(false);
    const [sessionData, setSessionData] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${API_BASE_URL}/api/admin/mentorSessionLists/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Make sure the token is fetched here
                        },
                    }
                );
                setSessionData(response.data.data); // Assuming response structure is { data: { data: [...] } }
            } catch (error) {
                console.error("Error fetching session data:", error);
            }
        };
        fetchSessions();
    }, [id]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${API_BASE_URL}/api/admin/mentorSessionLists/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Make sure the token is fetched here
                        },
                    }
                );
                setSessionData(response.data.data); // Assuming response structure is { data: { data: [...] } }
            } catch (error) {
                console.error("Error fetching session data:", error);
            }
        };
        fetchSessions();
    }, [id]);

    return (
        <>
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
                        {/* <div className="card payment-summary-card col-md-5 ms-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Total Sessions</h5>
                                <div className="payment-summary d-flex justify-content-between">
                                    <div>
                                        <p className="mb-1"><strong>Completed Sessions:</strong></p>
                                        <h6 className="avilamount">256</h6>
                                    </div>
                                    <div>
                                        <p className="mb-1"><strong>Upcoming Sessions:</strong></p>
                                        <h6 className="pendingamount">220</h6>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-sm-12">

                            <Tabs id="booking-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-1  custom-tabs">
                                <Tab eventKey="upcoming" title="Upcoming Sessions">
                                </Tab>
                                {/* <Tab eventKey="pending" title="Pending Sessions">
                                </Tab> */}
                                <Tab eventKey="completed" title="Completed Sessions">
                                </Tab>
                                <Tab eventKey="cancelled" title="Cancelled Sessions">
                                </Tab>
                            </Tabs>
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive custom-table">
                                        <table className="table ">
                                            <thead className="">
                                                <tr>
                                                    <th>Mentee Name</th>
                                                    <th>Mentorship Track Name</th>
                                                    <th>Session Track Name</th>
                                                    <th>Session Track Duration</th>
                                                    <th>Time Zone</th>
                                                    <th>Per Session Amount</th>
                                                    <th>Session Date & Time</th>
                                                    <th>Cancelled By </th>
                                                    <th>Cancelled Reason </th>
                                                    <th>Booked Date & Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessionData.map((session, index) => (
                                                    <tr key={index}>
                                                        <td>{session.userId}</td>
                                                        <td>{session.track.trackName}</td>
                                                        <td>{session.track.consultationPrice}</td>
                                                        <td>{session.track.trackDuration}</td>
                                                        <td>{session.TimeSlot}</td>
                                                        {/* <td className="amounts cursor-pointer" onClick={() => {
                                                            setShowPaymentPopup(true);
                                                        }} >{session.SessionAmount}</td> */}
                                                        <td>{session.track.consultationPrice}</td>
                                                        <td>{session.sessionTime}</td>
                                                        <td>
                                                            <Link to={`#`} className="text-black">
                                                                {'Jhon Doe'}
                                                            </Link>
                                                        </td>
                                                        {/*  Redirect to the detail page */}
                                                        <td>{'Behavior was not good'}</td>
                                                        <td>{session.BookingTime}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
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
