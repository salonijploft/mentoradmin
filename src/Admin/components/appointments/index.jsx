import React, { useState } from "react";
import SidebarNav from "../sidebar";
import Pagination from "../Pagination/Pagination";
import BookingDetails from "./BookingDetails";
import { useUser } from "../../../context/UserContext";

const Bookings = () => {
  const [show, setShow] = useState(false);
  const { rolePermissions } = useUser();
  console.log("rolePermissions in the BookingList module ", rolePermissions);
  
  
  const [data, setData] = useState([
    {
      id: 1,
      MentorName: "Jose Anderson",
      Speciality: "3 Months",
      SessionTrack: "React Intro",
      MenteeName: "Travis Trimble",
      Earned: "$5000.00",
      Date: "5 Nov 2019",
      time: "11.00 AM - 11.35 AM",
      Amount: "$300.00",
      timeSlot: "Asian/India",
      Status: "Pending",
    },
    {
      id: 2,
      MentorName: "Jessica Fogarty",
      Speciality: "6 Months",
      SessionTrack: "React Hooks",
      MenteeName: "Carl Kelly",
      Earned: "$3300.00",
      Date: "11 Nov 2019",
      time: "12.00 PM - 12.15 PM",
      Amount: "$150.00",
      timeSlot: "Asian/India",
      Status: "Completed",
    },
    {
      id: 3,
      MentorName: "Marvin Campbell",
      Speciality: "1 General Consultation",
      SessionTrack: "React Updates",
      MenteeName: "Walter Roberson",
      Earned: "$4100.00",
      Date: "21 Nov 2019",
      time: "12.10 PM - 12.25 PM",
      Amount: "$300.00",
      timeSlot: "Asian/India",
      Status: "In Progress",
    },
  ]);

  const [filters, setFilters] = useState({
    SessionTrack: "",
    MentorName: "",
    MenteeName: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = data.filter((record) =>
    Object.keys(filters).every((key) =>
      filters[key] === "" || record[key].toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  const resetFilters = () => {
    setFilters({ SessionTrack: "", MentorName: "", MenteeName: "" });
  };


  
   // Permission Check Function
 const hasPermission = (moduleName, action) => {
  const permission = rolePermissions.find(permission => permission.moduleName === 'Booking List');
  console.log("moduleName for appointments:", moduleName);
  console.log("permissions for Booking List Module:", permission);
  return permission ? permission[action] === 1 : false;
};

const hasReadPermission = (moduleName) => hasPermission(moduleName, 'isRead');
const hasCreatePermission = (moduleName) => hasPermission(moduleName, 'isCreate');
const hasUpdatePermission = (moduleName) => hasPermission(moduleName, 'isUpdate');
const hasDeletePermission = (moduleName) => hasPermission(moduleName, 'isDelete');

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Bookings</h3>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 mb-2">
              {hasReadPermission ('Booking List') && ( 
              <input
                type="text"
                className="form-control"
                placeholder="Search by Session Track"
                name="SessionTrack"
                value={filters.SessionTrack}
                onChange={handleFilterChange}
              />
             )}
            </div>
            <div className="col-md-3 mb-2 "> 
              {hasReadPermission ('Booking List') && ( 
              <input
                type="text"
                className="form-control"
                placeholder="Search by Mentor Name"
                name="MentorName"
                value={filters.MentorName}
                onChange={handleFilterChange}
              />
              )}
            </div>
            <div className="col-md-3 mb-2">
            {hasReadPermission ('Booking List') && ( 
              <input
                type="text"
                className="form-control"
                placeholder="Search by Mentee Name"
                name="MenteeName"
                value={filters.MenteeName}
                onChange={handleFilterChange}
              /> 
            )}
            </div>

            <div className="col-md-3 d-flex gap-2">
            {hasReadPermission ('Booking List') && ( 
              <button className="btn btn-primary h-75" onClick={() => { }}>Search</button>
              )}

             {hasReadPermission ('Booking List') && ( 
              <button className="btn btn-secondary" onClick={resetFilters}>Reset</button>
              )}
            </div>
          </div>
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
                          <th>Mentor (TIN)</th>
                          <th>Mentorship Track</th>
                          <th>Session Track Name</th>
                          <th>Amount per session</th>

                          <th>Time Zone</th>
                          <th>Booked Date & Time</th>
                          <th>Session Date & Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((record, index) => (
                          <tr key={record.id}>
                            <td>{index + 1}</td>
                            <td>{record.MenteeName}</td>
                            <td>{record.MentorName}</td>
                            <td>TIN 123</td>
                            <td>{record.Speciality}</td>
                            <td>{record.SessionTrack}</td>
                            <td>{record.Earned}</td>

                            <td>{record.timeSlot}</td>
                            <td>
                              {record.Date} <br />
                              <small>{record.time}</small>
                            </td>
                            <td>
                              {record.Date} <br />
                              <small>{record.time}</small>
                            </td>
                            <td>
                         
                              <button className="btn btn-primary" onClick={() => {
                                setShow(true);
                              }}> View</button> 
                            </td>

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
        <BookingDetails show={show} onHide={() => setShow(false)} />
      </div>
    </>
  );
};

export default Bookings;
