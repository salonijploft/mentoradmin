import React, { useState } from "react";
import { itemRender, onShowSizeChange } from "../paginationfunction";
import SidebarNav from "../sidebar";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import PaymentDetails from "../CustomModals/PaymentDetails";
import { useUser, useUset} from "../../../context/UserContext";
import Loader from "../Loader";

const Transaction = () => {
  const [showPayment, setShowPaymentPopup] = useState(false);
  const { rolePermissions } = useUser();
  const [loading, setLoading] = useState(false);
  console.log("rolePemission for the Transaction module:", rolePermissions);

  const transactions = [
    {
      id: 1,
      menteeName: "John Doe",
      mentorName: "Dr. Smith",
      bundleName: "Full Stack Development",
      trackTime: '3 Months (6 Sessions)',
      price: "₦ 12,500",
      paymentMethod: "Credit Card",
      date: "5 Mar 2025",
      time: "12:30 PM",
      status: "Completed",
    },
    {
      id: 2,
      menteeName: "Jane Smith",
      mentorName: "Prof. Johnson",
      trackTime: '6 Months (12 Sessions)',

      bundleName: "Cybersecurity Basics",
      price: "₦ 12,500",
      paymentMethod: "PayPal",
      date: "2 Mar 2025",
      time: "3:45 PM",
      status: "Pending",
    },
    {
      id: 3,
      menteeName: "Robert Brown",
      mentorName: "Dr. Emily",
      trackTime: '1 General Consultation',

      bundleName: "AI & Machine Learning",
      price: "₦ 12,500",
      paymentMethod: "Stripe",
      date: "1 Mar 2025",
      time: "5:00 PM",
      status: "Completed",
    },
    {
      id: 4,
      menteeName: "Alice Green",
      mentorName: "Mr. Watson",
      trackTime: '1 General Consultation',

      bundleName: "Cloud Computing Essentials",
      price: "₦ 12,500",
      paymentMethod: "Debit Card",
      date: "28 Feb 2025",
      time: "10:15 AM",
      status: "Refunded",
    },
    {
      id: 5,
      menteeName: "Michael Johnson",
      mentorName: "Ms. Laura",
      trackTime: '1 General Consultation',

      bundleName: "Blockchain Fundamentals",
      price: "₦ 12,500",
      paymentMethod: "Credit Card",
      date: "26 Feb 2025",
      time: "8:50 PM",
      status: "Completed",
    },
  ];

///Permission to check function 
const hasPermission = (moduleName, action) => {
  const permission = rolePermissions.find(permission => permission.moduleName === 'Transaction');
  console.log("moduleName for Transactions:", moduleName);
  console.log("permissions for Transaction Module:", permission);
  return permission ? permission[action] === 1 : false;
};

const hasReadPermission = (moduleName) => hasPermission(moduleName, 'isRead');
const hasCreatePermission = (moduleName) => hasPermission(moduleName, 'isAdd');
const hasUpdatePermission = (moduleName) => hasPermission(moduleName, 'isUpdate');
const hasDeletePermission = (moduleName) => hasPermission(moduleName, 'isDelete');

  return (
    <>
    {loading && <Loader />}
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Transactions</h3>
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
                          <th>Mentorship Track</th>
                          <th>Mentorship Track Duration</th>
                          <th>TIN</th>
                          <th>Price</th>
                          {/* <th>Payment Method</th> */}
                          <th>Transaction Date</th>
                          {/* <th>Status</th> */}
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction, index) => (
                          <tr key={transaction.id}>
                            <td>{index + 1}</td>
                            <td>{transaction.menteeName}</td>
                            <td>{transaction.mentorName}</td>
                            <td>{transaction.bundleName}</td>
                            <td>{transaction.trackTime}</td>
                            <td>TIN-123{index + 1}</td>

                            <td className="amounts cursor-pointer" onClick={() => {
                              setShowPaymentPopup(true);
                            }} >{transaction.price}</td>
                            {/* <td>{transaction.paymentMethod}</td> */}
                            <td>
                              {transaction.date} <br />
                              <small>{transaction.time}</small>
                            </td>
                            {/* <td>
                              <span
                                className={`badge ${transaction.status === "Completed"
                                  ? "bg-success"
                                  : transaction.status === "Pending"
                                    ? "bg-warning"
                                    : "bg-danger"
                                  }`}
                              >
                                {transaction.status}
                              </span>
                            </td> */}
                            {/* <td>
                              <div className="d-flex action-buttons">
                                <Link to={`/admin/transaction/${transaction.id}`} className="me-2">
                                  <button className="btn btn-primary btn-sm">View</button>
                                </Link>

                              </div>
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Pagination current={1} total={5} pagination={() => { }} />
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

export default Transaction;
