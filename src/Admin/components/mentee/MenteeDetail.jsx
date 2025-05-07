import React, { useEffect, useState } from "react";
import SidebarNav from "../sidebar";
import { FaStar } from "react-icons/fa";
import ShowImage from "../CustomModals/ShowImage";
require("../../../client/assets/css/custom.css");
import Loader from "../../components/Loader.js";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance.js";

const MenteeDetail = () => {
    const [mentee, setMentee] = useState([]);
    const [show, setShow] = React.useState(false);
    const [image, setImage] = React.useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menteeData, setMenteeData] = useState(null);
    const { id } = useParams();
    // const token = Cookies.get("token")

    useEffect(() => {
        const fetchMenteeDetails = async () => {
            try {
                const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/menteeDetail/${id}`,
                    //  {
                    // headers: {
                    //     Authorization: `Bearer ${token}`,
                    // },
                //    }
                {
                    withCredentials: true,
                }
            );
                setMenteeData(response.data.data);
                console.log("setmenteeData:", response.data.data)
                setLoading(false);
            } catch (error) {
                console.error("API Error:", error.message);
                setError(error.message);
                setLoading(false);
            }
        };
        if (id) fetchMenteeDetails();
    }, [id]);
    
    return (
        <>
            {loading && <Loader />}
            <SidebarNav />
            <div className="page-wrapper">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header details">
                        <h3 className="page-title">Mentee Detail</h3>
                    </div>
                    {/* Profile Card */}
                    <div className="card col-md-10 mx-auto p-3">
                        <div className="card-body d-flex align-items-center">
                            <div className="mentor-img me-3">
                                <img
                                    src={
                                        menteeData?.profileImage
                                            ? `${API_BASE_URL}/${menteeData.profileImage}`
                                            : "/images/default-image.png"
                                    }
                                    alt="Mentor"
                                />
                            </div>
                            <div>
                                <h4 className="usr-name">{menteeData?.firstName}</h4>
                                <p>Email: {menteeData?.email}</p>
                                <p>Phone: {menteeData?.phoneNumber}</p>
                                <p className="text-muted">
                                    {menteeData?.city}
                                    {menteeData?.state}
                                    {menteeData?.country}</p>
                                <span> <FaStar color="orange" fontSize={'20px'} />  {" "} 0.0 (0)</span>
                            </div>
                        </div>
                    </div>
                    {/* Profile Card */}
                    <div className="card col-md-10 mx-auto p-3">
                        <div className="card-body">
                            <h4 className="mb-3">Personal Information</h4>
                            {/* <p><strong>Area of Expertise:</strong> {mentorDetails.expertise}</p> */}
                            <p><strong>Learning Goal:</strong> - </p>
                            {menteeData?.linkedInURL ? (
                                <a href={menteeData.linkedInURL} target="_blank" rel="noopener noreferrer">
                                    {menteeData.linkedInURL}
                                </a>
                            ) : (
                                <span className="text-muted">No LinkedIn provided</span>
                            )}
                            <p><strong>About Me:</strong> {menteeData?.aboutMe}  </p>
                        </div>
                    </div>
                </div>
            </div>
            <ShowImage show={show} image={image} handleClose={() => setShow(false)} />
        </>
    );
};

export default MenteeDetail;
