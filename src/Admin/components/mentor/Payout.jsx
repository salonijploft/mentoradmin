import React, { useState } from "react";
import SidebarNav from "../sidebar";

const PayoutRequests = () => {
    const payouts = [
        {
            _id: "1",
            mentorId: { name: "John Doe", email: "john@example.com" },
            amount: "₦ 200",
            date: "2024-03-01",
            status: "Pending",
        },
        {
            _id: "2",
            mentorId: { name: "Jane Smith", email: "jane@example.com" },
            amount: "₦ 350",
            date: "2024-03-02",
            status: "Approved",
        },
        {
            _id: "3",
            mentorId: { name: "Michael Lee", email: "michael@example.com" },
            amount: "₦ 500",
            date: "2024-03-03",
            status: "Pending",
        },
        {
            _id: "4",
            mentorId: { name: "Emily Brown", email: "emily@example.com" },
            amount: "₦ 150",
            date: "2024-03-04",
            status: "Rejected",
        },
        {
            _id: "5",
            mentorId: { name: "David Wilson", email: "david@example.com" },
            amount: "₦ 275",
            date: "2024-03-05",
            status: "Approved",
        },
    ];


    return (
        <>
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <h2 className="text-2xl font-semibold mb-4">Payout Requests</h2>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive custom-table">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Mentor Name</th>
                                                    <th>Email</th>
                                                    <th>Amount</th>
                                                    <th>Date</th>
                                                    <th>Update At</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payouts.map((payout) => (
                                                    <tr key={payout._id}>
                                                        <td>{payout.mentorId.name}</td>
                                                        <td>{payout.mentorId.email}</td>
                                                        <td>{payout.amount}</td>
                                                        <td>{payout.date}</td>
                                                        <td>{payout.date}</td>
                                                        <td>{payout.status}</td>
                                                        <td><select className="form-select">
                                                            <option value="Approve">Pending</option>
                                                            <option value="Approve">Approve</option>
                                                            <option value="Approve">Reject</option>
                                                        </select></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayoutRequests;
