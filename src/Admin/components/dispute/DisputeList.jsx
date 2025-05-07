import React, { useState } from "react";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import DisputePopup from "./DisputePopup";
import { useUser } from "../../../context/UserContext"

const DisputeList = () => {
    const [show, setShowModal] = useState(false)
    const { rolePermissions } = useUser();
    console.log("rolePermissions for DisputeList:", rolePermissions);


    const disputes = [
        {
            id: 1,
            menteeName: "John Doe",
            mentorName: "Dr. Smith",
            bundleName: "Full Stack Development",
            amount: "$500.00",
            disputeReason: "Course not as expected",
            sessionTaken: "2",
            sessionRemaining: "4",
            status: "Pending",
            date: "5 Mar 2025",
            time: "12:30 PM",
        },
        {
            id: 2,
            menteeName: "Jane Smith",
            mentorName: "Prof. Johnson",
            bundleName: "Cybersecurity Basics",
            sessionTaken: "2",
            sessionRemaining: "4",
            amount: "$400.00",
            disputeReason: "Mentor was unavailable",
            status: "Resolved",
            date: "2 Mar 2025",
            time: "3:45 PM",
        },
        {
            id: 3,
            menteeName: "Robert Brown",
            mentorName: "Dr. Emily",
            bundleName: "AI & Machine Learning",
            amount: "$700.00",
            sessionTaken: "2",
            sessionRemaining: "4",
            disputeReason: "Technical issues",
            status: "In Review",
            date: "1 Mar 2025",
            time: "5:00 PM",
        },
        {
            id: 4,
            menteeName: "Alice Green",
            mentorName: "Mr. Watson",
            sessionTaken: "2",
            sessionRemaining: "4",
            bundleName: "Cloud Computing Essentials",
            amount: "$650.00",
            disputeReason: "Did not receive materials",
            status: "Pending",
            date: "28 Feb 2025",
            time: "10:15 AM",
        },
        {
            id: 5,
            menteeName: "Michael Johnson",
            mentorName: "Ms. Laura",
            sessionTaken: "2",
            sessionRemaining: "4",
            bundleName: "Blockchain Fundamentals",
            amount: "$550.00",
            disputeReason: "Unresponsive mentor",
            status: "Resolved",
            date: "26 Feb 2025",
            time: "8:50 PM",
        },
    ];

    // Permission Check Function
    const hasPermission = (moduleName, action) => {
        const permission = rolePermissions.find(permission => permission.moduleName === 'Dispute Management');
        console.log("moduleName for appointments:", moduleName);
        console.log("permissions for Dispute Management Module:", permission);
        return permission ? permission[action] === 1 : false;
    };

    const hasReadPermission = (moduleName) => hasPermission(moduleName, 'isRead');
    const hasCreatePermission = (moduleName) => hasPermission(moduleName, 'isCreate');
    const hasUpdatePermission = (moduleName) => hasPermission(moduleName, 'isUpdate');
    const hasDeletePermission = (moduleName) => hasPermission(moduleName, 'isDelete');


    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <h3 className="page-title">Disputes</h3>

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
                                                    <th>#</th>
                                                    <th>Mentee Name</th>
                                                    <th>Mentor Name</th>
                                                    <th>Disputed By</th>
                                                    <th>Mentorship Track</th>
                                                    <th>Session Track Name</th>
                                                    <th>Completed Sessions</th>
                                                    <th>Remaing Sessions</th>

                                                    <th>Dispute Reason</th>
                                                    <th>Status</th>
                                                    <th>Updated Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {disputes.map((dispute, index) => (
                                                    <tr key={dispute.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{dispute.menteeName}</td>
                                                        <td>{dispute.mentorName}</td>
                                                        <td>{'	Dr. Smith	'}</td>
                                                        <td>{dispute.bundleName}</td>
                                                        <td>{'React js Intro'}</td>

                                                        <td>{dispute.sessionTaken}</td>
                                                        <td>{dispute.sessionRemaining}</td>

                                                        <td>{dispute.disputeReason}</td>
                                                        <td>
                                                        { hasUpdatePermission ('Dispute Management') && ( 
                                                            <select
                                                                className="form-select w-100 p-2"
                                                                style={{
                                                                    minWidth: "120px", // Adjust width as needed
                                                                    height: "35px",
                                                                    padding: "5px",
                                                                    borderRadius: "5px",
                                                                    border: "1px solid #ccc",
                                                                    backgroundColor: "#fff",
                                                                }}
                                                            >
                                                                <option value="">Pending</option>
                                                                <option value="In Review">Under Review</option>
                                                                <option value="Resolved">Resolved</option>
                                                                <option value="Rejected">Rejected</option>
                                                            </select>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {dispute.date} <br />
                                                            <small>{dispute.time}</small>
                                                        </td>
                                                        <td><div className="d-flex action-buttons">
                                                            {hasUpdatePermission('Dispute Management') && (
                                                                index === 0 ? (
                                                                    <button className="btn btn-primary btn-sm">Refunded</button>
                                                                ) : (
                                                                    <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                                                                        Refund
                                                                    </button>
                                                                )
                                                            )}

                                                            {hasDeletePermission('Dispute Management') && (
                                                                <button className="btn btn-danger btn-sm ms-2">Delete</button>
                                                            )}
                                                        </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
            <DisputePopup
                show={show}
                handleClose={() => setShowModal(false)}
            />
        </>
    );
};

export default DisputeList;
