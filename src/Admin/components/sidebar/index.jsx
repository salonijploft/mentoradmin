import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
// import FeatherIcon from "feather-icons-react";
import { Appcontext } from "../../../approuter";
import { useLocation } from "react-router-dom";

const SidebarNav = () => {
  // let pathname = props?.location?.pathname;

  const location = useLocation();
  const pathname = location.pathname;

  const { setIsAuth } = useContext(Appcontext);
  const [isSideMenu, setSideMenu] = useState("");

  const toggleSidebar = (value) => {
    setSideMenu(value);
  };

  const toggleSidebarNew = (value) => {
    setSideMenuNew(value);
  };

  const toggleSidebarNew2 = (value) => {
    setSideMenuNew2(value);
  };

  // eslint-disable-next-line no-unused-vars
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMouseOverSidebar, setMouseOverSidebar] = useState(false);

  useEffect(() => {
    if (
      isMouseOverSidebar &&
      document.body.classList.contains("mini-sidebar")
    ) {
      document.body.classList.add("expand-menu");
      return;
    }
    document.body.classList.remove("expand-menu");
  }, [isMouseOverSidebar]);

  const handleMouseEnter = () => {
    setMouseOverSidebar(true);
  };

  const handleMouseLeave = () => {
    setMouseOverSidebar(false);
  };

  return (
    <>
      {/* <!-- Sidebar --> */}
      <div
        className={`sidebar ${isSidebarExpanded ? "" : "hidden"}`}
        id="sidebar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={0}
          autoHeightMax="95vh"
          thumbMinSize={30}
          universal={false}
          hideTracksWhenNotNeeded={true}
        >
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className="menu-title">
                  <span>
                    <i className="fe fe-home"></i> MAIN
                  </span>
                </li>
                <li className={pathname === "/admin" ? "active" : ""}>
                  <Link to="/admin">
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li
                  className={pathname?.includes("subadmin") ? "active" : ""}
                >
                  <Link to="/admin/subadmin/list">
                    <span>Subadmin</span>
                  </Link>
                </li>



                <li className="submenu">
                  <Link
                    to="#"
                    className={isSideMenu == "reports" ? "subdrop" : ""}
                    onClick={() =>
                      toggleSidebar(isSideMenu == "reports" ? "" : "reports")
                    }
                  >
                    <span> Mentors</span> <span className="menu-arrow"></span>
                  </Link>
                  {isSideMenu == "reports" ? (
                    <ul
                      style={{
                        display: isSideMenu == "reports" ? "block" : "none",
                      }}
                    >
                      <li>
                        <Link
                          to="/admin/approved-mentors"
                          className={
                            pathname?.includes("approved-mentors") ? "active" : ""
                          }
                        >
                          Approved Mentors
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/pending-mentors"
                          className={
                            pathname?.includes("pending-mentors") ? "active" : ""
                          }
                        >
                          Pending Mentors

                        </Link>
                      </li>


                      <li>
                        <Link
                          to="/admin/rejected-mentors"
                          className={
                            pathname?.includes("rejected-mentors") ? "active" : ""
                          }
                        >
                          Rejected Mentors
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/deleted-mentors"
                          className={
                            pathname?.includes("deleted-mentors") ? "active" : ""
                          }
                        >
                          Deleted Mentors

                        </Link>
                      </li>

                      {/* <li>
                        <Link
                          to="/admin/reverify-mentors"
                          className={
                            pathname?.includes("reverify-mentors") ? "active" : ""
                          }
                        >
                          Re-Approved Mentors

                        </Link>
                      </li> */}


                    </ul>
                  ) : (
                    ""
                  )}
                </li>


                <li className="submenu">
                  <Link
                    to="#"
                    className={isSideMenu == "mentees" ? "subdrop" : ""}
                    onClick={() =>
                      toggleSidebar(isSideMenu == "mentees" ? "" : "mentees")
                    }
                  >
                    <span> Mentees</span> <span className="menu-arrow"></span>
                  </Link>
                  {isSideMenu == 'mentees' ?
                    <ul style={{
                      display: isSideMenu == "mentees" ? "block" : "none",
                    }}>
                      <li
                        className={pathname?.includes("mentee-list") ? "active" : ""}
                      >
                        <Link to="/admin/mentee-list">
                          <span>Mentees</span>
                        </Link>
                      </li>
                      <li
                        className={pathname?.includes("deleted-mentees") ? "active" : ""}
                      >
                        <Link to="/admin/deleted-mentees">
                          <span>Deleted Mentees</span>
                        </Link>
                      </li>
                    </ul> : ""}

                </li>
                <li
                  className={
                    pathname?.includes("/admin/booking-list") ? "active" : ""
                  }
                >
                  <Link to="/admin/booking-list">
                    <span>Booking List</span>
                  </Link>
                </li>

                <li
                  className={pathname?.includes("category-list") ? "active" : ""}
                >
                  <Link to="/admin/category-list">
                    <span>Mentorship Categories</span>
                  </Link>
                </li>


                <li
                  className={pathname?.includes("admin/goal-list") ? "active" : ""}
                >
                  <Link to="/admin/goal-list">
                    <span>Mentorship Goals</span>
                  </Link>
                </li>
                <li
                  className={pathname?.includes("transaction") ? "active" : ""}
                >
                  <Link to="/admin/transactions-list">
                    <span>Transactions</span>
                  </Link>
                </li>


                <li
                  className={pathname?.includes("cancellation-fees") ? "active" : ""}
                >
                  <Link to="/admin/cancellation-fees">
                    <span>Cancellation Fees</span>
                  </Link>
                </li>
                <li
                  className={pathname?.includes("payout-requests") ? "active" : ""}
                >
                  <Link to="/admin/payout-requests">
                    <span>Payout Request</span>
                  </Link>
                </li>

                <li className={pathname?.includes("/admin/commissions") ? "active" : ""}>
                  <Link to="/admin/commissions">
                    <span>Commissions</span>
                  </Link>
                </li>

                <li className={pathname?.includes("refund-requests") ? "active" : ""}>
                  <Link to="/admin/refund-requests">
                    <span>Refunded Transactions</span>
                  </Link>
                </li>
                {/*
                <li className={pathname?.includes("wht-list") ? "active" : ""}>
                  <Link to="/admin/wht-list?type=remmited">
                    <span>Remmited WHT</span>
                  </Link>
                </li>


                <li className={pathname?.includes("wht-list") ? "active" : ""}>
                  <Link to="/admin/wht-list?type=unremmited">
                    <span>Unremmited WHT</span>
                  </Link>
                </li> */}

                <li
                  className={pathname?.includes("dispute-management") ? "active" : ""}
                >
                  <Link to="/admin/dispute-management">
                    <span>Dispute Management</span>
                  </Link>
                </li>



                <li
                  className={pathname?.includes("help-support") ? "active" : ""}
                >
                  <Link to="/admin/help-support">
                    <span>Help & Support</span>
                  </Link>
                </li>



                <li
                  className={
                    pathname?.includes("/admin/blogs") ? "active" : ""
                  }
                >
                  <Link to="/admin/blogs">
                    <span>Blogs</span>
                  </Link>
                </li>
                <li
                  className={
                    pathname?.includes("settings") ||
                      pathname?.includes("localization") ||
                      pathname?.includes("sociallinks") ||
                      pathname?.includes("seo")
                      ? "active"
                      : ""
                  }
                >
                  <Link to="/admin/generalsettings">
                    <span> Settings</span>
                  </Link>
                </li>
                <li className="submenu">
                  <Link
                    to="#"
                    className={isSideMenu == "reports" ? "subdrop" : ""}
                    onClick={() =>
                      toggleSidebar(isSideMenu == "reports" ? "" : "reports")
                    }
                  >
                    <span> CMS</span> <span className="menu-arrow"></span>
                  </Link>
                  {isSideMenu == "reports" ? (
                    <ul
                      style={{
                        display: isSideMenu == "reports" ? "block" : "none",
                      }}
                    >
                      <li>
                        <Link
                          to="/admin/privacy-policy"
                          className={
                            pathname?.includes("invoice-list") ? "active" : ""
                          }
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/termsConditions"
                          className={
                            pathname?.includes("termsConditions") ? "active" : ""
                          }
                        >
                          Terms & Conditions
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/admin/faq"
                          className={
                            pathname?.includes("faq") ? "active" : ""
                          }
                        >
                          FAQ's
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/about-us"
                          className={
                            pathname?.includes("about-us") ? "active" : ""
                          }
                        >
                          About Us
                        </Link>
                      </li>

                    </ul>
                  ) : (
                    ""
                  )}
                </li>

              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
      {/* <!-- /Sidebar --> */}
    </>
  );
};

export default SidebarNav;
