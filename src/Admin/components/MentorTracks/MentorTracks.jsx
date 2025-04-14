// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import SidebarNav from "../sidebar";
// import Pagination from "../Pagination/Pagination";
// import PaymentDetails from "../CustomModals/PaymentDetails";
// import { Tab, Tabs } from "react-bootstrap";
// import ShowSessionList from "../CustomModals/ShowSessionList";
// import { API_BASE_URL } from "../../../Helper/apicall";
// import { useParams } from "react-router-dom";

// require("../../../client/assets/css/custom.css");

// const MentorTracks = () => {
//     const [key, setKey] = useState("completed");
//     const [showPayment, setShowPaymentPopup] = useState(false);
//     const [sessionTracks, setSessionTracks] = useState([]);
//     const { id } = useParams();
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPage, setTotalPages] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [page, setPage] = useState(1);
//     const [selectedTrackId, setSelectedTrackId] = useState(null);
//     // **New state variable for sessionDetails**
//     const [sessionDetails, setSessionDetails] = useState(null);


//     const fetchSessionTracks = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${API_BASE_URL}/api/admin/mentorTrackLists/${id}?limit=${limit}&page=${page}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (response.data && response.data.data) {
//                 setSessionTracks(response.data.data);
//                 setCurrentPage(response.data.pagination.currentPage);
//                 setTotalPages(response.data.pagination.totalPages);
//             }
//         } catch (error) {
//             console.error("Error fetching session tracks:", error);
//         }
//     };

//     useEffect(() => {
//         if (id) fetchSessionTracks();
//     }, [id, page]);


//     const fetchSessionDetails = async (trackId) => {
//         console.log("trackid:", trackId)  
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(`${API_BASE_URL}/api/admin/trackToSession?trackId=${trackId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (response.data && response.data.data) {
//                 // Pass the session data to the modals
//                 setSessionDetails(response.data.data); 
//             }
//             // fetchSessionDetails(session.trackId);
//         } catch (error) {
//             console.error("Error fetching session details:", error);
//         }
//     };

//     return (
//         <>
//             <SidebarNav />
//             <div className="page-wrapper">
//                 <div className="content container-fluid">
//                     {/* Page Header */}
//                     <div className="page-header">
//                         <div className="row">
//                             <div className="col-sm-12">
//                                 <h3 className="page-title">Mentorship Track List</h3>
//                             </div>
//                         </div>
//                     </div>
//                     {/* /Page Header */}
//                     <div className="row">
//                         <div className="col-sm-12">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <div className="table-responsive custom-table">
//                                         <table className="table">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Session Track Name</th>
//                                                     <th>Mentorship Track Duration</th>
//                                                     <th>Track Price</th>
//                                                     <th>Created At</th>
//                                                     <th>Action</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {sessionTracks.map((session, index) => (
//                                                     <tr key={index}>
//                                                         <td>{session.trackName || "N/A"}</td>
//                                                         <td>{session.trackDuration || "N/A"}</td>
//                                                         <td className="amounts cursor-pointer">₦{session.trackPrice || "N/A"}</td>
//                                                         <td>{session.createdAt}</td>
//                                                         <td>
//                                                             <button
//                                                                 className="btn btn-primary"
//                                                                 onClick={() => {
//                                                                     setSelectedTrackId(session.trackId); // Assuming `trackId` is available in `session`
//                                                                     setShowPaymentPopup(true);
//                                                                     fetchSessionDetails(session.trackId); // Function to fetch session details
//                                                                 }}
//                                                             >
//                                                                 View
//                                                             </button>

//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                     <div className="d-flex justify-content-end mt-3">
//                                         <Pagination
//                                             current={currentPage}
//                                             total={totalPage}
//                                             pagination={(page) => { setPage(page); }}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <ShowSessionList
//                     show={showPayment}
//                     handleClose={() => setShowPaymentPopup(false)}
//                     // Updated to use sessionDetails correctly
//                     data={sessionDetails}
//                 />
//             </div>
//         </>
//     );
// };
// export default MentorTracks;

import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import PaymentDetails from "../CustomModals/PaymentDetails";
import { Tab, Tabs } from "react-bootstrap";
import ShowSessionList from "../CustomModals/ShowSessionList";
import { API_BASE_URL } from "../../../Helper/apicall";
import { useParams } from "react-router-dom";

require("../../../client/assets/css/custom.css");

const MentorTracks = () => {
    const [key, setKey] = useState("completed");
    const [showPayment, setShowPaymentPopup] = useState(false);
    const [sessionTracks, setSessionTracks] = useState([]);
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [sessionDetails, setSessionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSessionDetails = async (trackId) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/admin/trackToSession?trackId=${trackId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data && response.data.data) {
                setSessionDetails(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching session details:", error);
            setError("Failed to load session details.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSessionTracks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/admin/mentorTrackLists/${id}?limit=${limit}&page=${page}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data && response.data.data) {
                setSessionTracks(response.data.data);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Error fetching session tracks:", error);
        }
    };

    useEffect(() => {
        if (id) fetchSessionTracks();
    }, [id, page]);

    // // **Fetch session details based on trackId**
    // const fetchSessionDetails = async (trackId) => {
    //     console.log("trackId:", trackId);  
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get(`${API_BASE_URL}/api/admin/trackToSession?trackId=${trackId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         if (response.data && response.data.data) {
    //             setSessionDetails(response.data.data);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching session details:", error);
    //     }
    // };

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
                                                        <td className="amounts cursor-pointer">₦{session.trackPrice || "N/A"}</td>
                                                        <td>{session.createdAt}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={() => {
                                                                    setSelectedTrackId(session.id);
                                                                    setShowPaymentPopup(true);
                                                                    fetchSessionDetails(session.id);
                                                                }}
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="d-flex justify-content-end mt-3">
                                        <Pagination
                                            current={currentPage}
                                            total={totalPage}
                                            pagination={(page) => { setPage(page); }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ShowSessionList
                    show={showPayment}
                    handleClose={() => setShowPaymentPopup(false)}
                    data={sessionDetails}
                />
            </div>
        </>
    );
};

export default MentorTracks;