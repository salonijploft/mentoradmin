import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { avatar12, logo1, logoSmall } from "../imagepath";

const Header = ( ) => {
  const [userData, setUserData] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

   const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/admin/profileDetail`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === 200) {
        setUserData(response.data.data);
        setProfileImg(response.data.data.profileImage);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
   // ✅ On mount + on profile update
   useEffect(() => {
    if (isAuthenticated) fetchUserProfile();
  
    const handleProfileUpdated = () => {
      fetchUserProfile();
    };
  
    window.addEventListener("profile-updated", handleProfileUpdated);
  
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, [isAuthenticated]);

   

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    window.location.href = "/admin/login";  
  };
  

  // Conditional styles for authenticated users
  const profileImage = userData?.profileImage
  ? `${API_BASE_URL}/${userData.profileImage}`
  : avatar12;

  
  return (
    <>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div className="header-left">
          <Link to="/admin" className="logo">
            <img src={logo1} alt="Logo" style={{ height: "60px" }} />
          </Link>
          <Link to="/admin" className="logo logo-small">
            <img src={logoSmall} alt="Logo" width="30" height="30" />
          </Link>
        </div>

        {/* Sidebar Toggle */}
        <Link to="#" id="toggle_btn" onClick={() => document.body.classList.toggle("mini-sidebar")}>
          <i className="fe fe-text-align-left"></i>
        </Link>

        {/* Mobile Menu Toggle */}
        <Link to="#" className="mobile_btn mt-3" id="mobile_btn" onClick={() => document.body.classList.toggle("slide-nav")}>
          <i className="fa fa-bars" />
        </Link>

        {/* Header Right Menu */}
        <ul className="nav user-menu">
          {/* User Profile Dropdown */}
          {isAuthenticated && (
            <li className="nav-item dropdown has-arrow">
              <Link to="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                <span className="user-imggg">
                  <img className="rounded-circle" src={profileImage} width={31} alt="User" />
                </span>
              </Link>
              <div className="dropdown-menu">
                <Link className="dropdown-item" to="/admin/profile">My Profile</Link>
                <Link className="dropdown-item" to="#" onClick={handleLogout}>Logout</Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Header;
