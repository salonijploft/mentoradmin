import React, { useEffect, useState } from "react";
import SidebarNav from "../sidebar";
import { FaStar } from "react-icons/fa";
import ShowImage from "../CustomModals/ShowImage";
require("../../../client/assets/css/custom.css");
import Loader from "../../components/Loader.js";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { useParams } from "react-router-dom";


const MentorDetail = () => {
    const [show, setShow] = React.useState(false);
    const [image, setImage] = React.useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mentorData, setMentorData] = useState(null);
    const { id } = useParams();


    useEffect(() => {
        const fetchMentorsDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_BASE_URL}/api/admin/menteeDetail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setMentorData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("API Error:", error.message);
                setError(error.message);
                setLoading(false);
            }
        };

        if (id) fetchMentorsDetails(); // ✅ only fetch if id exists
    }, [id]);





    const mentorDetails = {
        jobTitle: "Senior Software Engineer",
        company: "Tech Corp",
        experience: "8 years",
        expertise: "Full Stack Development",
        linkedin: "https://www.linkedin.com/in/mentorprofile",
        aboutMe: "Passionate about building scalable applications and mentoring developers.",
        bankDetails: {
            accountName: "John Doe",
            accountNumber: "1234567890",
            bankName: "Bank of America",
            bankCode: "BOA123",
            bvn: "12345678901" // Optional
        }
    };

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
                                        mentorData?.profileImage
                                            ? `${API_BASE_URL}/${mentorData.profileImage}`
                                            : "default-image.png"
                                    }
                                    alt="Mentor"
                                />
                            </div>
                            <div>
                                <h4 className="usr-name">{mentorData?.firstName}</h4>
                                <p>Email: {mentorData?.email}</p>
                                <p>Phone: {mentorData?.phoneNumber}</p>
                                <p className="text-muted">
                                     {mentorData?.city} 
                                     {mentorData?.state} 
                                     {mentorData?.country}</p>

                                <span>  <FaStar color="orange" fontSize={'20px'} />  {" "} 0.0 (0)</span>

                            </div>
                        </div>
                    </div>
                    {/* Profile Card */}
                    <div className="card col-md-10 mx-auto p-3">
                        <div className="card-body">
                            <h4 className="mb-3">Personal Information</h4>

                            {/* <p><strong>Area of Expertise:</strong> {mentorDetails.expertise}</p> */}
                            <p><strong>Learning Goal:</strong> - </p>
                            <p><strong>LinkedIn URL:</strong> <a href={mentorData?.linkedInURL}  target="_blank" rel="noopener noreferrer">{mentorData?.linkedInURL}</a></p>
                            <p><strong>About Me:</strong> {mentorData?.aboutMe}  </p>


                        </div>

                    </div>



                </div>
            </div>
            <ShowImage
                show={show}
                image={image}
                handleClose={() => setShow(false)}

            />
        </>
    );
};

export default MentorDetail;
