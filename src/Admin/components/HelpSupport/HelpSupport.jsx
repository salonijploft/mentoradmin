import React from "react";
import SidebarNav from "../sidebar";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import { useUser  } from "../../../context/UserContext";
import moduleUrls from "../../../utils/moduleUrls";
const HelpSupport = () => {

    const {rolePermissions} = useUser();
    console.log("helpsupport rolePermissions:", rolePermissions);

    const helpAndSupportData = [
        {
            ticketId: "TCKT-1001",
            name: 'Jhone',
            email: 'jhone@gmail.com',
            title: "Unable to login to my account",
            subject: "Payment failed but amount deducted",

            status: "Open",
            createdAt: "2025-03-04T10:15:30Z"
        },
        {
            ticketId: "TCKT-1002",
            name: 'Jhone',
            email: 'jhone@gmail.com',
            title: "Payment failed but amount deducted",
            subject: "Payment failed but amount deducted",
            status: "In Progress",
            createdAt: "2025-03-04T11:20:45Z"
        },
        {
            ticketId: "TCKT-1003",
            name: 'Jhone',
            email: 'jhone@gmail.com',
            title: "Profile picture not updating",
            subject: "Payment failed but amount deducted",

            status: "Resolved",
            createdAt: "2025-03-04T12:05:10Z"
        },
        {
            ticketId: "TCKT-1004",
            name: 'Jhone',
            email: 'jhone@gmail.com',
            title: "Error while uploading documents",
            subject: "Payment failed but amount deducted",

            status: "Open",
            createdAt: "2025-03-04T13:30:25Z"
        },
        {
            ticketId: "TCKT-1005",
            name: 'Jhone',
            email: 'jhone@gmail.com',
            title: "Order tracking not updating",
            subject: "Payment failed but amount deducted",

            status: "In Progress",
            createdAt: "2025-03-04T14:45:50Z"
        }
    ];
  
    //check the function list 
    const hasPermission = (moduleName, action) => {
        console.log("moduleName in Bloglist:", moduleName);
        const permission = rolePermissions.find(permission => permission.moduleName === 'Help-&-support') 
        console.log("permission for bloglist:", permission);
        return permission ? permission[action] === 1 : false;
       }  
         
    
    const hasReadPermission = (moduleName) => hasPermission(moduleName, 'isRead');
    const hasCreatePermission = (moduleName) => hasPermission(moduleName, 'isAdd');
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
                                <h3 className="page-title">Help & Support</h3>
                            </div>
                        </div>

                        <div className="row my-3 ">
                            <div className="col-md-3 mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Ticket ID"
                                    name="SessionTrack"
                                />
                            </div>
                            <div className="col-md-3 d-flex gap-2">
                                <button className="btn btn-primary h-75" onClick={() => { }}>Search</button>   
                                <button className="btn btn-secondary">Reset</button>    
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
                                                    <th>Ticket ID</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Subject</th>
                                                    <th>Message</th>
                                                    <th>Status</th>
                                                    <th>Created At</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {helpAndSupportData.map((ticket, index) => (
                                                    <tr key={ticket.ticketId}>
                                                        <td>{index + 1}</td>
                                                        <td>{ticket.ticketId}</td>
                                                        <td>{ticket.name}</td>
                                                        <td>{ticket.email}</td>
                                                        <td>{ticket.title}</td>
                                                        <td>{ticket.subject}</td>
                                                        <td>{hasUpdatePermission ('Help-&-support')  &&  ( 
                                                            <select
                                                                className="form-select w-100 p-2"
                                                                style={{
                                                                    minWidth: "120px",
                                                                    height: "35px",
                                                                    padding: "5px",
                                                                    borderRadius: "5px",
                                                                    border: "1px solid #ccc",
                                                                    backgroundColor: "#fff",
                                                                }}
                                                                defaultValue={ticket.status}
                                                            >
                                                                <option value="Open">Open</option>
                                                                <option value="In Progress">In Progress</option>
                                                                <option value="Resolved">Resolved</option>
                                                                <option value="Closed">Closed</option>
                                                            </select>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {new Date(ticket.createdAt).toLocaleDateString()} <br />
                                                            <small>{new Date(ticket.createdAt).toLocaleTimeString()}</small>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex action-buttons">
                                                                  {hasDeletePermission ('Help-&-support') && (  
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
        </>
    );
};

export default HelpSupport;
