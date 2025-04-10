import React, { useState } from "react";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import PaymentDetails from "../CustomModals/PaymentDetails";
import { Tab, Tabs } from "react-bootstrap";
require("../../../client/assets/css/custom.css");

const Wallet = () => {
    const [key, setKey] = useState("pending");
    const [showPayment, setShowPaymentPopup] = useState(false);

    const sessionData = [
        {
            MentorName: "John Doe",
            SessionTrack: "React Development",
            TimeSlot: "Asian/Pacific",
            BookingTime: "2024-03-04 09:30 AM",
            SessionAmount: "₦ 15,000"
        },
        {
            MentorName: "Jane Smith",
            SessionTrack: "Node.js Backend",
            TimeSlot: "Asian/Pacific",

            BookingTime: "2024-03-04 01:45 PM",
            SessionAmount: "₦ 18,000"
        },
        {
            MentorName: "Michael Brown",
            SessionTrack: "UI/UX Design",
            TimeSlot: "Asian/Pacific",

            BookingTime: "2024-03-04 11:00 AM",
            SessionAmount: "₦ 12,500"
        }
    ];


    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Wallet</h3>

                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">

                        <div className="card col-md-6">
                            <div className="card-body">
                                <div className="mentor-widget">
                                    <div className="user-info-left align-items-center">
                                        <div className="mentor-img d-flex flex-wrap justify-content-center">
                                            <div className="pro-avatar">JD</div>
                                            <div className="rating">
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star filled" />
                                                <i className="fas fa-star" />
                                            </div>
                                            <div className="mentor-details m-0">
                                                <p className="user-location m-0">
                                                    <i className="fas fa-map-marker-alt" /> Tamil Nadu,
                                                    India
                                                </p>
                                            </div>
                                        </div>
                                        <div className="user-info-cont">
                                            <h4 className="usr-name">Jonathan Doe</h4>
                                            <p>jhonathan@gmail.com</p>


                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="card payment-summary-card col-md-5 ms-3 shadow-sm rounded-lg">
                            <div className="card-body text-center">
                                <h5 className="card-title fw-bold text-dark">Payment Summary</h5>
                                <div className="payment-summary d-flex flex-column align-items-center gap-3 mt-3">
                                    <div className="text-center">
                                        <p className="mb-1 ">Available Amount:</p>
                                        <h5 className="text-warning fw-bold">₦ 50,000</h5>
                                    </div>
                                    <hr  />
                                    <div className="text-center">
                                        <p className="mb-1 ">Pending Amount:</p>
                                        <h5 className="text-primary fw-bold">₦ 30,000</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12">

                            <Tabs id="booking-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-1  custom-tabs">
                                <Tab eventKey="pending" title="Pending Amount">
                                </Tab>
                                <Tab eventKey="available" title="Available Amount">
                                </Tab>

                            </Tabs>
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive custom-table">
                                        <table className="table ">
                                            <thead className="">
                                                <tr>
                                                    <th>Mentor Name</th>
                                                    <th>Session Track Name</th>
                                                    <th>Time Slot</th>
                                                    <th>Booking Time</th>
                                                    <th>Amount per session</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessionData.map((session, index) => (
                                                    <tr key={index}>
                                                        <td>{session.MentorName}</td>
                                                        <td>{session.SessionTrack}</td>
                                                        <td>{session.TimeSlot}</td>
                                                        <td>{session.BookingTime}</td>
                                                        <td className="amounts cursor-pointer" onClick={() => {
                                                            setShowPaymentPopup(true);
                                                        }} >{session.SessionAmount}</td>
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

export default Wallet;
