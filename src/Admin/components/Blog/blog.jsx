import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import SidebarNav from "../sidebar";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Blogs = () => {
  const [blog, setBlog] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [isDelete, setIsDelete] = useState(false);
  const [loading, setLoading] = useState(false); 

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/admin/getMenteeCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const fetchBlogList = async () => {
    setLoading(true); 
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/admin/getBlogs?limit=${limit}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setBlog(response.data.data);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
        setIsDelete(false);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to fetch blogs", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchBlogList();
  }, [page, isDelete]);
  
  
  const deleteBlogHandler = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/admin/deleteBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 200) {
        setIsDelete(true);
        toast.success("Blog deleted successfully!", { position: "top-right" });
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to delete blog", { position: "top-right" });
    }
  };

  return (
    <>
      <SidebarNav />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-10">
                <h3 className="page-title">Blog List</h3>
              </div>
              <div className="col-sm-2 text-end">
                <Link to="/admin/add-blog">
                  <button className="btn btn-primary btn-lg">Create Blog</button>
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
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <div className="table-responsive custom-table">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Published Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                        {blog.length > 0  ?(
                          blog.map((item) => (
                            <tr key={item.id} >
                              <td>{item.name}</td>
                              <td>{item.category}</td>
                              <td>{new Intl.DateTimeFormat('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }).format(new Date(item.createdAt))}</td>
                              <td>{item.status === 1 ? "Published" : "Draft"}</td>
                              <td>
                                <div className="d-flex action-buttons">
                                  <Link to={`/admin/edit-blog/${item.id}`} className="me-2">
                                    <MdEdit fontSize={"18px"} />
                                  </Link>
                                  <MdDelete fontSize={"18px"} className="text-danger delete-icon" onClick={() => deleteBlogHandler(item.id)} />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                              <td colSpan="5" className="text-center">No Blogs Found</td>
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
export default Blogs;
