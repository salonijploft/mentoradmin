/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useState, useContext, useMemo, useEffect } from "react";
import config from "config";
import { Navigate, Route, Routes} from "react-router-dom";
import Header from "./components/header/index";
import Dashboard from "./components/dashboard";
import Appointments from "./components/appointments";
import Specialities from "./components/specialities";
import Mentor from "./components/mentor";
import Subadminlist from "./components/Subadmin/Subadminlist";
import Mentee from "./components/mentee";
import Reviews from "./components/reviews";
import Transaction from "./components/transaction";
import Settings from "./components/settings";
import Blog from "./components/Blog/blog";
import BlogDetails from "./components/Blog/blogdetails";
import AddBlog from "./components/Blog/addblog";
import PendingBlog from "./components/Blog/pendingblog";
import Profile from "./components/profile/Profile";
import Login from "./components/login";
import Register from "./components/register";
import ForgotPassword from "./components/forgotpassword";
import ResetPassword from "./components/forgotpassword/ResetPassword";
import GendralSettings from "./components/settings/GendralSettings";
import { Appcontext } from "../approuter";
import CreateSubadmin from "./components/subadmin/CreateSubadmin";
import AboutUs from "./components/Cms/AboutUs";
import PrivacyPolicy from "./components/Cms/PrivacyPolicy";
import TermsConditions from "./components/Cms/TermsConditions";
import Faq from "./components/Cms/FaqAdd";
import FaqList from "./components/Cms/FaqList";
import CategoryList from "./components/Category/CategoryList";
import AddCategory from "./components/Category/AddCategory";
import DisputeList from "./components/dispute/DisputeList";
import MentorDetail from "./components/mentor/MentorDetail";
import MenteeDetail from "./components/mentee/MenteeDetail";
import HelpSupport from "./components/HelpSupport/HelpSupport";
import Wallet from "./components/mentor/Wallet";
import MentorSession from "./components/MentorSessions/MentorSession";
import MentorTracks from "./components/MentorTracks/MentorTracks";
import MenteeSession from "./components/mentee/MenteeSession";
import Commission from "./components/transaction/Commission";
import PayoutRequests from "./components/mentor/Payout";
import RefundRequests from "./components/transaction/RefundRequests";
import VatCommissionList from "./components/transaction/VatCommissionList";
import WhtRequests from "./components/transaction/WhtRequests";
import CancelationFees from "./components/transaction/CancellationFees";
import AddGoals from "./components/AreaOfGoals/AddGoals";
import GoalList from "./components/AreaOfGoals/GoalList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "../utils/ProtectedRoute";
import { AuthProvider } from "./components/context/AuthContext";

const AppUniversal = function () {
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => {setMenu(!menu);};
  const { isAuth, setIsAuth } = useContext(Appcontext);
  const location = window?.location;
  console.log("location", location?.pathname);
 // Determine if the header should be shown based on the current route
 useEffect(() => {
  if (
    location.pathname === "/admin/login" ||
    location.pathname === "/admin/register" ||
    location.pathname === "/admin/forgotPassword" ||
    location.pathname === "/admin/conform-email" ||
    location.pathname === "/admin/404" ||
    location.pathname === "/admin/500"
  ) {
    setIsAuth("admin");
  } else {
    setIsAuth("user");
  }
}, [location.pathname]); // Depend on pathname changes

const showHeader = useMemo(() => {
  return ![
    "/admin/login",
    "/admin/register",
    "/admin/forgotPassword",
    "/admin/resetPassword",
    "/admin/conform-email",
    "/admin/404",
    "/admin/500"
  ].includes(location.pathname);
}, [location.pathname]);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        {/* {
          location?.pathname == "/admin/login" ||
            location?.pathname == "/admin/register" ||
            location?.pathname == "/admin/forgotPassword" ||
            location?.pathname == "/admin/conform-email" ||
            location?.pathname == "/admin/404" ||
            location?.pathname == "/admin/500" ? (
            ""
          ) :
            <Header onMenuClick={() => toggleMobileMenu()}
            />
        } */}
       {showHeader && <Header onMenuClick={toggleMobileMenu} />}

        <Routes>
          <Route path="/admin/register" element={<Register />} />
          <Route path="/admin/forgotPassword" element={<ForgotPassword />} />

          <Route  path="/admin/resetPassword" element={<ResetPassword />}  />
          
          <Route path="/admin/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
          
            <Route path="/admin/subadmin/list" element={<Subadminlist />} />
            <Route path="/admin/subadmin/create" element={<CreateSubadmin />} />

            <Route path="/admin/subadmin/edit/:staffId" element={<CreateSubadmin />} />


            <Route
              path="/admin/cancellation-fees"
              element={<CancelationFees />}
            />


            <Route path="/admin" element={<Dashboard />} />
            <Route
              path="/admin/booking-list"

              element={<Appointments />}
            />

            <Route
              path="/admin/refund-requests"
              element={<RefundRequests />}
            />


            <Route
              path="/admin/wht-list"
              element={<WhtRequests />}
            />
            <Route path="/admin/vat-commission-list" element={<VatCommissionList />} />
            <Route
              path="/admin/commissions"
              element={<Commission />}
            />
            <Route
              path="/admin/transactions-list"  element={<Transaction />}
            />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/generalsettings" element={<GendralSettings />} />

            <Route path="/admin/blogs" element={<Blog />} />
            <Route path="/admin/blog-details" element={<BlogDetails />} />
            <Route path="/admin/add-blog" element={<AddBlog />} />
            <Route path="/admin/edit-blog/:id" element={<AddBlog />} />
            <Route path="/admin/pending-blog" element={<PendingBlog />} />
            <Route path="/admin/profile" element={<Profile />} />

            <Route path="/admin/payout-requests" element={<PayoutRequests />} />
            <Route path="/admin/mentee-list" element={<Mentee />} />
            <Route path="/admin/deleted-mentees" element={<Mentee />} />
            <Route path="/admin/mentee-detail/:id" element={<MenteeDetail />} />


            <Route path="/admin/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin/termsConditions" element={<TermsConditions />} />
            <Route path="/admin/about-us" element={<AboutUs />} />
            <Route path="/admin/faq-add" element={<Faq />} />
            <Route path="/admin/edit-faq/:id" element={<Faq />} />
            <Route path="/admin/faq" element={<FaqList />} />
            <Route
              path="/admin/dispute-management"
              element={<DisputeList />}
            />
            <Route
              path="/admin/help-support"
              element={<HelpSupport />}
            />
            <Route
              path="/admin/mentor-wallet/:id"
              element={<Wallet />}
            />
            <Route
              path="/admin/mentor-sessions/:id"
              element={<MentorSession />}
            /> <Route path="/admin/mentor/list" element={<Mentor />} />
            <Route path="/admin/approved-mentors" element={<Mentor />} />
            <Route path="/admin/reverify-mentors" element={<Mentor />} />
            <Route path="/admin/rejected-mentors" element={<Mentor />} />
            <Route path="/admin/deleted-mentors" element={<Mentor />} />
            <Route path="/admin/pending-mentors" element={<Mentor />} />
            <Route path="/admin/mentor-detail/:id" element={<MentorDetail />} />

            <Route path="/admin/mentee-sessions/:id"  element={<MenteeSession />}/>
            <Route path="/admin/mentor-tracks/:id" element={<MentorTracks />} />
            <Route path="/admin/goal-list" element={<GoalList />} />
            <Route path="/admin/edit-goal/:id" element={<AddGoals />} />
            <Route path="/admin/add-goal" element={<AddGoals />} />
            <Route path="/admin/category-list" element={<CategoryList />} />
            <Route path="/admin/edit-category/:id" element={<AddCategory />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
         </Route>
         
            <Route path="/*" element={<Navigate to="/admin/login" replace />} />

        </Routes>

      </div>
    </>
  );
};

export default AppUniversal;
