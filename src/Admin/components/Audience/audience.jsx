 import React, { useEffect, useState } from "react";
 import { MdDelete, MdEdit } from "react-icons/md";
 import { FaEye } from "react-icons/fa";
 import SidebarNav from "../sidebar";
 import { Link } from "react-router-dom";
 import Pagination from "../Pagination/Pagination";
 import axios from "axios";
 import { API_BASE_URL } from "../../../Helper/apicall";
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 import Swal from "sweetalert2";
 import Cookies from "js-cookie"; 
 import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";
 import Loader from "../Loader";
 
 const Audience = () => {
   const [audience, setAudience] = useState([]);
   const [categories, setCategories] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPage, setTotalPages] = useState(1);
   const [limit, setLimit] = useState(10);
   const [page, setPage] = useState(1);
   const [isDelete, setIsDelete] = useState(false);
   const [loading, setLoading] = useState(false); 
  //  const token = Cookies.get("token");
 
   const fetchCategories = async () => {
     try {
        const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/getMenteeCategories`,
          //  {
        //  headers: { Authorization: `Bearer ${token}` },  }
        {
          withCredentials: true,
        }
      );
       if (response.data.status === 200) {
         setCategories(response.data.data);
       }
     } catch (error) {
       console.error("Error fetching categories:", error);
     }
   };
   
   const fetchAudienceList = async () => {
     setLoading(true); 
     try {
      //  const token = Cookies.get('token');
       const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/audienceList?limit=${limit}&page=${page}`, 
      //   {
      //    headers: {
      //      Authorization: `Bearer ${token}`,
      //    },
      //  }
      {
        withCredentials: true,
      }
      );
       if (response.data.status === 200) {
         setAudience(response.data.data);
         setCurrentPage(response.data.pagination.currentPage);
         setTotalPages(response.data.pagination.totalPages);
         setIsDelete(false);
       }
     } catch (error) {
       console.log("error", error);
       toast.error("Failed to fetch audience", { position: "top-right" });
     } finally {
       setLoading(false);
     }
   };
   useEffect(() => {
     fetchCategories();
     fetchAudienceList();
   }, [page, isDelete]);
   
   
   const deleteAudienceHandler = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    // Check if the user confirmed the action
    if (result.isConfirmed) {
        try {
            // const token = Cookies.get('token');
            const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/deleteAudience?id=${id}`, 
            //   {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // }
            {
              withCredentials: true,
            }
          );
            if (response.data.status === 200) {
                setIsDelete(true);
                toast.success("Audience deleted successfully!", { position: "top-right" });
            } else {
                toast.error("Failed to delete audience", { position: "top-right" });
            }
        } catch (error) {
            console.log("error", error);
            toast.error("Failed to delete audience", { position: "top-right" });
        }
    } else {
        // Optional: You can add a message for when the user cancels the action
        toast.info("Delete action was canceled.", { position: "top-right" });
    }
};

   return (
     <>
     {loading && <Loader />}
       <SidebarNav />
       <div className="page-wrapper">
         <div className="content container-fluid">
           <div className="page-header">
             <div className="row">
               <div className="col-sm-10">
                 <h3 className="page-title">Audience List</h3>
               </div>
               <div className="col-sm-2 text-end">
                 <Link to="/admin/addaudience">
                   <button className="btn btn-primary btn-lg">Create Audience </button>
                 </Link>
               </div>
             </div>
           </div>
           <div className="row">
             <div className="col-sm-12">
               <div className="card">
                 <div className="card-body">
                   {loading ? (
                     <div className="d-flex justify-content-center">
                      
                     </div>
                   ) : (
                     <div className="table-responsive custom-table">
                       <table className="table">
                         <thead>
                           <tr>
                             <th>Name</th>
                             <th>Status</th>
                             <th>Action</th>
                           </tr>
                         </thead>
                         <tbody>
                         {audience.length > 0  ?(
                          audience.map((item) => (
                             <tr key={item.id} >
                               <td>{item.name}</td>
                                  <td>{item.status === 1 ? "Active" : "Inactive"}</td>                         
                               <td>
                                 {/* <div className="d-flex action-buttons"> */}
                                   <Link to={`/admin/edit-audience/${item.id}`} className="me-2">
                                     <MdEdit fontSize={"18px"} />
                                   </Link>
                                   <MdDelete fontSize={"18px"} className="text-danger delete-icon" onClick={() => deleteAudienceHandler(item.id)} />
                                 {/* </div> */}
                               </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                               <td colSpan="5" className="text-center">No  Audience Found</td>
                           </tr>
                       )}
                         </tbody>
                       </table>
                     </div>
                   )}
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
       </div>
       <ToastContainer />
     </>
   );
 };
 export default Audience;
 