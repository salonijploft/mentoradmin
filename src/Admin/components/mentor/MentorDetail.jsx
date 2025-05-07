import React, { useEffect, useState } from "react";
import SidebarNav from "../sidebar";
import { FaStar } from "react-icons/fa";
import ShowImage from "../CustomModals/ShowImage";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
; require("../../../client/assets/css/custom.css");
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader.js";
import { img } from "../../assets/img/blog/blog-01.jpg";
import Cookies from 'js-cookie';
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance.js";
import { Link } from "react-router-dom"
const MentorDetail = () => {
    const [show, setShow] = useState(false);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mentorData, setMentorData] = useState(null);
    const { id } = useParams();
    const token = Cookies.get('token');
    useEffect(() => {
        const fetchMentorsDetails = async () => {
            try {
                const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/mentorDetails/${id}`, 
                //     {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                //    }
                {
                    withCredentials: true,
                }
            );
                console.log("ddddd", response.data.data)
                setMentorData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("API Error:", error.message);
                setError(error.message);
                setLoading(false);
            }
        };
        if (id) fetchMentorsDetails();
    }, [id]);

    return (
        <>
            {loading && <Loader />}
            <SidebarNav />
            <div className="page-wrapper details">
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <h3 className="page-title">Mentor Detail</h3>
                    </div>
                    {/* Profile Card */}
                    <div className="card col-md-10 mx-auto p-3">
                        <div className="card-body d-flex align-items-center">
                            <div className="mentor-img me-2">
                                
                                    <img
                                         className="rounded-circle"
                                        src={
                                            mentorData?.profileImage
                                                ? `${API_BASE_URL}/${mentorData.profileImage}`
                                                : "default-avatar.png"
                                        }
                                        alt={mentorData?.firstName || "Mentor"}
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                    />
                            </div>
                            <div>
                                <h4 className="usr-name"> {mentorData?.firstName} {mentorData?.lastName}</h4>
                                <p>Email:  {mentorData?.email}</p>
                                <p>Phone: {mentorData?.phoneNumber}</p>
                                {/* <p className="text-muted">Tamil Nadu, India</p> */}
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
                            <p><strong>Current Job Title:</strong> {mentorData?.MentorDetails?.currentJob}</p>
                            <p><strong>Current Company:</strong> {mentorData?.MentorDetails?.currentCompany}</p>
                            <p><strong>Years of Experience:</strong> {mentorData?.MentorDetails?.yearsOfExperience}</p>
                            <p><strong>Area of Expertise:</strong> {mentorData?.MentorDetails?.areaOfExpertiseName}</p>
                            <p><strong>LinkedIn URL:</strong> <a href={mentorData?.MentorDetails?.linkedinUrl} target="_blank" rel="noopener noreferrer">{mentorData?.MentorDetails?.currentJob}</a></p>
                            <p><strong>About Me:</strong> {mentorData?.MentorDetails?.aboutMe}</p>
                            <hr />
                            {/* + */}
                            <h4 className="mb-3">Payout Details</h4>
                            <p><strong>Account Name:</strong> {mentorData?.MentorDetails?.accountName}</p>
                            <p><strong>Account Number:</strong>{mentorData?.MentorDetails?.accountNumber}</p>
                            <p><strong>Bank Name:</strong>{mentorData?.MentorDetails?.bankName}</p>
                            <p><strong>Bank Code:</strong>{mentorData?.MentorDetails?.bankcode || "NA"}</p>
                            { } && <p><strong>BVN (Optional):</strong> {mentorData?.MentorDetails?.bvn || "NA"}</p>
                        </div>
                    </div>
                    {/* Residency & Permit */}
                    <div className="card col-md-10 mx-auto p-3">
                        <div className="card-body">
                            <h4 className="widget-title">Residency & Tax Details</h4>
                            <hr />
                            <p><strong>Country of Legal Residence:</strong> {mentorData?.MentorDetails?.country}</p>
                            <p><strong>Nationality:</strong> {mentorData?.MentorDetails?.nationality}</p>
                            {/* <p><strong>Are You Nigerian VAT Registered?:</strong> {mentorData?.MentorDetails?.areYouNigerianVat}</p> */}
                            <p>
                                <strong>Are You Nigerian VAT Registered?:</strong>
                                {mentorData?.MentorDetails?.VAT || "NA"}
                                {/* {mentorData?.MentorDetails?.areYouNigerianVat ? "Yes" : "No"} */}
                            </p>
                            <p><strong>Tax Identification Number:</strong></p>
                            <p><strong>State:</strong> {mentorData?.MentorDetails?.state}</p>
                            <p><strong>City:</strong> {mentorData?.MentorDetails?.city}</p>
                            <p><strong>Self Declaration for Non Resident:</strong>{mentorData?.mentorData?.nonresident || "NA"}</p>
                            <p><strong>Self Declaration for Non Nigierian:</strong> {mentorData?.MentorDetails?.confirmationOfVat ? "Yes" : "No"}</p>
                            <p><strong>Govt ID:</strong>
                                {mentorData?.MentorDetails?.govtId && (
                                    <div>
                                        <img
                                            src={`${API_BASE_URL}/${mentorData?.MentorDetails?.govtId}`}
                                            alt="Mentor"
                                            className="mentor-img me-3"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.replaceWith(document.createTextNode('NA'));
                                            }}
                                        />
                                    </div>
                                )}
                            </p>
                            <p><strong>Resident Permit:</strong></p>
                            {mentorData?.MentorDetails?.residentPermit ? (
                                <div>
                                    <img
                                        src={`${API_BASE_URL}/${mentorData?.MentorDetails?.residentPermit || "NA"}`}
                                        alt="Mentor"
                                        className="mentor-img me-3"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.replaceWith(document.createTextNode('NA'));
                                        }}
                                    />
                                </div>
                            ) : (
                                <p>NA</p>
                            )}
                            {/* )} */}
                        </div>
                    </div>
                    {/* Mentor Availability */}
                    <div className="card col-12 col-md-10 mx-auto p-0 mb-5 pb-5 ">
                        <div className="card-body custom-border-card pb-0">
                            {/* Title */}
                            <div className="widget awards-widget m-0">
                                <h4 className="widget-title">Availablity of Mentors</h4>
                                <hr />
                            </div>
                            {/* List of Sessions */}
                            <div className="list-group">
                                {mentorData?.Slots?.length > 0 ? (
                                    mentorData?.Slots.map((session, index) => (
                                        <div
                                            key={index}
                                            className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start"
                                        >
                                            <div className="me-auto">
                                                <h5 className="mb-1">{session.day} </h5>
                                            </div>
                                            <div className="d-flex flex-wrap ms-auto">
                                                <span
                                                    className="text-muted mb-0 btn-primary  px-3 py-1 my-2 rounded me-2"
                                                >
                                                    {session.start_time}
                                                </span>
                                                <span
                                                    className="text-muted mb-0 btn-primary  px-3 py-1 my-2 rounded me-2"
                                                >
                                                    {session.end_time}
                                                </span>
                                            </div>
                                        </div>

                                    ))
                                ) : (
                                    <p className="text-center text-muted">No sessions available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ShowImage show={show}
                image={image}
                handleClose={() => setShow(false)}
            />
        </>
    );
};

export default MentorDetail;
