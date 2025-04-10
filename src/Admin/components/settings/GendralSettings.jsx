import React, { useState, useEffect, useRef } from "react";
import { logoSmall, logo, facebook } from "../imagepath";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import Select from "react-select";
import SidebarNav from "../sidebar";
import { addressSchema, basicDetails } from "../../../utils/validationSchema";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../../Helper/apicall";
import { toast } from 'react-toastify'; // Assuming you are using react-toastify
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';


const GendralSettings = ({ }) => {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const token = localStorage.getItem("token");
  const basicFormRef = useRef();

  // 2. Function to manually trigger the first form submission
  const triggerBasicFormSubmit = () => {
    if (basicFormRef.current) {
      basicFormRef.current.handleSubmit();
    }
  };

  const [userData, setUserData] = useState([])
  // ... stateOptions and countryOptions code
  useEffect(() => {
    const fetchSettingDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/getSetting`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("response234234", response.data);
        if (response.data.status === 200) {
          const settingData = response.data.data[0]; // Access the first item in the data array
          console.log("settingData", settingData);
          setUserData({
            id: settingData.id || "",
            vat: settingData.vat || "",
            vatCommission: settingData.vatCommission || "",
            whtNigerian: settingData.whtNigerian || "",
            whtNonNigerian: settingData.whtNonNigerian || "",
            platformCommission: settingData.platformCommission || "",
            priceThree: settingData.priceThree || "",
            priceSix: settingData.priceSix || "",
            priceGeneralSession: settingData.priceGeneralSession || "",
            cancellationFees: settingData.cancellationFees || "",
            payoutThreshold: settingData.payoutThreshold || "",
            mobileNo: settingData.mobileNo || "",
            email: settingData.Email || "",
            facebookLink: settingData.facebookLink || "",
            instagramLink: settingData.instagramLink || "",
            linkedInLink: settingData.linkedInLink || "",
            twitterLink: settingData.twitterLink || "",
            address: settingData.address || "",
            createdBy: settingData.createdBy || "",
            status: settingData.status || "",
            createdAt: settingData.createdAt || "",
            updatedAt: settingData.updatedAt || ""
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchSettingDetails();
  }, [id, token]);


  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        vat: values.vat,
        vatCommission: values.vatCommission,
        whtNigerian: values.whtNigerian,
        platformCommission: values.platformCommission,
        priceThree: values.priceThree,
        priceSix: values.priceSix,
        priceGeneralSession: values.priceGeneralSession,
        cancellationFees: values.cancellationFees,
        payoutThreshold: values.payoutThreshold,
      };

      const response = await axios.post(`${API_BASE_URL}/api/admin/updateOrCreateSetting`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.status === 200) {
        toast.success("Basic details updated successfully!", { position: "top-right" });
        resetForm(); // Reset form fields after successful submission
      } else {
        toast.error("Failed to update Basic details!");
      }
    } catch (error) {
      console.error("Error saving Basic details:", error);
      toast.error("An error occurred while saving Basic details.");
    } finally {
      setSubmitting(false);
    }
  };


  /// function to update the setting links
  
  const handleUpdate = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        email: values.email,
        mobileNo: values.mobileNo,
        instagramLink: values.instagramLink,
        linkedInLink: values.linkedInLink,
        twitterLink: values.twitterLink,
        address: values.address
      };
  
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/updateOrCreateSettingLinks`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Response Data:", response.data);
  
      if (response.data.status === 200) {
        toast.success("Setting links updated successfully.");
        resetForm(); // ✅ Optional: use only if you want to clear the form
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while updating settings.");
    } finally {
      setSubmitting(false); // ✅ Important to stop Formik loading state
    }
  };
  
  console.log("userdata", userData)

  return (
    <>
      <div >
        {/* Header */}
        {/* Sidebar */}
        <SidebarNav />
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="">
              <div className="row">
                <div className="col">
                  <h3 className="page-title">Settings</h3>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Basic Details</h5>
                  </div>
                  <div className="card-body pt-0">
                    <Formik
                      innerRef={basicFormRef}
                      initialValues={{
                        id: userData.id || "",
                        vat: userData.vat || "",
                        vatCommission: userData.vatCommission || "",
                        whtNigerian: userData.whtNigerian || "",
                        whtNonNigerian: userData.whtNonNigerian || "",
                        platformCommission: userData.platformCommission || "",
                        priceThree: userData.priceThree || "",
                        priceSix: userData.priceSix || "",
                        priceGeneralSession: userData.priceGeneralSession || "",
                        cancellationFees: userData.cancellationFees || "",
                        payoutThreshold: userData.payoutThreshold || ""
                      }}
                      // validationSchema={basicDetails}
                      enableReinitialize={true}
                      onSubmit={handleSubmit}
                    >

                      {({ errors, touched, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                          <div className="settings-form">
                            {/* VAT % */}
                            <div className="form-group">
                              <label>
                                VAT % <span className="star-red">*</span>
                              </label>
                              <Field type="text" name="vat" className="form-control" placeholder="Enter VAT %" />
                              <ErrorMessage name="vat" component="div" className="text-danger" />
                            </div>
                            {/* VAT on Commission */}
                            <div className="form-group">
                              <label>
                                VAT on Commission (%) <span className="star-red">*</span>
                              </label>
                              <Field type="text" name="vatCommission" className="form-control" placeholder="Enter VAT %" />
                              <ErrorMessage name="vatCommission" component="div" className="text-danger" />
                            </div>

                            {/* WHT For Nigerian */}
                            <div className="form-group">
                              <label>
                                WHT For Nigerian % <span className="star-red">*</span>
                              </label>
                              <Field type="text" name="whtNigerian" className="form-control" placeholder="Enter WHT %" />
                              <ErrorMessage name="whtNigerian" component="div" className="text-danger" />
                            </div>

                            {/* WHT For Non-Nigerian */}
                            <div className="form-group">
                              <label>
                                WHT For Non-Nigerian % <span className="star-red">*</span>
                              </label>
                              <Field type="text" name="whtNonNigerian" className="form-control" placeholder="Enter WHT %" />
                              <ErrorMessage name="whtNonNigerian" component="div" className="text-danger" />
                            </div>

                            {/* Platform Commission */}
                            <div className="form-group">
                              <label>
                                Platform commission % (Admin Commission %) <span className="star-red">*</span>
                              </label>
                              <Field type="text" name="platformCommission" className="form-control" placeholder="Enter platform %" />
                              <ErrorMessage name="platformCommission" component="div" className="text-danger" />
                            </div>

                            {/* Max Bundle Price (3 Months) */}
                            <div className="form-group">
                              <label>Max Bundle Price Of 3 Months Bundle</label>
                              <Field type="text" name="priceThree" className="form-control" placeholder="Enter Price" />
                              <ErrorMessage name="priceThree" component="div" className="text-danger" />
                            </div>

                            {/* Max Bundle Price (6 Months) */}
                            <div className="form-group">
                              <label>Max Bundle Price Of 6 Months Bundle</label>
                              <Field type="text" name="priceSix" className="form-control" placeholder="Enter Price" />
                              <ErrorMessage name="priceSix" component="div" className="text-danger" />
                            </div>

                            {/* Max Bundle Price (1 General Session) */}
                            <div className="form-group">
                              <label>Max Bundle Price Of 1 General Session</label>
                              <Field type="text" name="priceGeneralSession" className="form-control" placeholder="Enter Price" />
                              <ErrorMessage name="priceGeneralSession" component="div" className="text-danger" />
                            </div>

                            {/* After 1 Cancellation or Reschedule Fees */}
                            <div className="form-group">
                              <label>After 1 Cancellation or Reschedule fees</label>
                              <Field type="text" name="cancellationFees" className="form-control" placeholder="Enter Fees" />
                              <ErrorMessage name="cancellationFees" component="div" className="text-danger" />
                            </div>

                            {/* Payout Threshold */}
                            <div className="form-group">
                              <label>Payout Threshold</label>
                              <Field type="text" name="payoutThreshold" className="form-control" placeholder="Enter Payout Amount" />
                              <ErrorMessage name="payoutThreshold" component="div" className="text-danger" />
                            </div>

                            {/* Buttons */}
                            <div className="form-group mb-0">
                              <div className="settings-btns">
                                <button type="submit" className="btn btn-primary mx-2">
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}

                    </Formik>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title">Social Links </h5>
                  </div>
                  <div className="card-body pt-0">
                    <Formik
                      initialValues={{
                        facebook: userData.facebookLink || "",
                        instagram: userData.instagramLink || "",
                        linkedin: userData.linkedInLink || "",
                        twitter: userData.twitterLink || "",
                        address: userData.address || "",
                        mobile: userData.mobileNo || "",
                        email: userData.email || "",
                      }}
                      // validationSchema={addressSchema}
                      enableReinitialize={true}
                      onSubmit={handleUpdate} // Ensure this is correct
                    >
                      {({ errors, touched, handleUpdate }) => ( // Use handleSubmit here
                        <Form onSubmit={handleUpdate}>
                          <div className="settings-form">
                            {/* Facebook */}
                            <div className="form-group">
                              <label>Facebook Link <span className="star-red">*</span></label>
                              <Field type="text" name="facebook" className="form-control" placeholder="Enter Facebook Link" />
                              <ErrorMessage name="facebook" component="div" className="text-danger" />
                            </div>
                            {/* Instagram */}
                            <div className="form-group">
                              <label>Instagram Link <span className="star-red">*</span></label>
                              <Field type="text" name="instagram" className="form-control" placeholder="Enter Instagram Link" />
                              <ErrorMessage name="instagram" component="div" className="text-danger" />
                            </div>
                            {/* LinkedIn */}
                            <div className="form-group">
                              <label>LinkedIn Link <span className="star-red">*</span></label>
                              <Field type="text" name="linkedin" className="form-control" placeholder="Enter LinkedIn Link" />
                              <ErrorMessage name="linkedin" component="div" className="text-danger" />
                            </div>
                            {/* Twitter */}
                            <div className="form-group">
                              <label>Twitter Link <span className="star-red">*</span></label>
                              <Field type="text" name="twitter" className="form-control" placeholder="Enter Twitter Link" />
                              <ErrorMessage name="twitter" component="div" className="text-danger" />
                            </div>

                            <h5 className="title">Address & Contact Details</h5>
                            {/* Address */}
                            <div className="form-group mt-3">
                              <label>Address <span className="star-red">*</span></label>
                              <Field type="text" name="address" className="form-control" placeholder="Enter Address" />
                              <ErrorMessage name="address" component="div" className="text-danger" />
                            </div>

                            {/* Mobile No */}
                            <div className="form-group">
                              <label>Mobile No <span className="star-red">*</span></label>
                              <Field type="text" name="mobile" className="form-control" placeholder="Enter Mobile No" />
                              <ErrorMessage name="mobile" component="div" className="text-danger" />
                            </div>

                            {/* Email */}
                            <div className="form-group">
                              <label>Email <span className="star-red">*</span></label>
                              <Field type="text" name="email" className="form-control" placeholder="Enter Email" />
                              <ErrorMessage name="email" component=" div" className="text-danger" />
                            </div>

                            {/* Buttons */}
                            <div className="form-group mb-0">
                              <div className="settings-btns">
                                <button type="submit" className="btn btn-primary mx-2">Update</button>
                                {/* <button type="reset" className="btn btn-grey">Cancel</button> */}
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
            {/* /Settings */}
          </div>
        </div>
      </div>
    </>
  );
};

export default GendralSettings;
