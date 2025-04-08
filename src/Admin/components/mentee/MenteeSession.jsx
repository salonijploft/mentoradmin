import React, { useState } from "react";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import PaymentDetails from "../CustomModals/PaymentDetails";
import { Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
require("../../../client/assets/css/custom.css");

const MentorSession = () => {
    const [key, setKey] = useState("completed");
    const [showPayment, setShowPaymentPopup] = useState(false);
    const [sessionData, setSessionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchsessions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/menteeSessionLists/${id}`)
            setSessionData(response.data.data);
        } catch(error) {
            setError("Failed to fetch session data");
        } finally {
            setLoading(false);
        }
    };
    fetchsessions();
  },[])

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
                                                    <th>Remaining  Sessions</th>
                                                    <th>Completed Sessions</th>
                                                    <th>Session Track Duration</th>
                                                    <th>Time Zone</th>
                                                    <th>Per Session Amount</th>
                                                    <th>Session Date & Time</th>
                                                    <th>Booked Date & Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessionData.map((session, index) => (
                                                    <tr key={index}>
                                                        <td>{session.MentorName}</td>
                                                        <td>{session.SessionTrack}</td>
                                                        <td>{'Introduction to frontned development'}</td>
                                                        <td>{session.sessionRemaing}</td>
                                                        <td>{session.sessionTaken}</td>
                                                        <td>{'3 Months (6 Sessions)'}</td>
                                                        <td>{session.TimeSlot}</td>
                                                        <td className="amounts cursor-pointer" onClick={() => {
                                                            setShowPaymentPopup(true);
                                                        }} >{session.SessionAmount}</td>
                                                        <td>{session.sessionTime}</td>
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
