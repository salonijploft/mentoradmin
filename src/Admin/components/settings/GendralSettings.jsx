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
import Cookies from "js-cookie";
import { axiosSecure, fetchCsrfToken } from "../../../utils/axiosSecureInstance";
import { useUser } from "../../../context/UserContext.js";
import { monthsShort } from "moment";
import Loader from "../Loader.js";

const GendralSettings = ({ }) => {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const token = Cookies.get("token");
  const basicFormRef = useRef();
  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const { rolePermissions } = useUser();
  const [loading, setLoading] = useState(true);
  const [Loading, setIsLoading] = useState(true);
  
  console.log("rolepermissions in the generalSettings:", rolePermissions);

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
      const timeoutId =  setTimeout(() => {
        setLoading(false)
      }, 2000);

      try {
        setLoading(true);
        const response = await axiosSecure.get(`${API_BASE_URL}/api/admin/getSetting`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 200) {
          const settingData = response.data.data[0];
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
            logo: settingData.logo || "",
            favicon: settingData.favicon || "",
            facebookLink: settingData.facebookLink || "",
            instagramLink: settingData.instagramLink || "",
            linkedInLink: settingData.linkedInLink || "",
            twitterLink: settingData.twitterLink || "",
            address: settingData.address || "",
            mobileNo: settingData.mobileNo || "",
            Email: settingData.Email || "",
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };
    fetchSettingDetails();
  }, [id, token]);

  // Update logo preview when userData changes
  useEffect(() => {
    if (userData?.logo) {
      setLogoPreview(`${API_BASE_URL}/${userData.logo}`);
    }
    if (userData?.favicon) {
      setFaviconPreview(`${API_BASE_URL}/${userData.favicon}`);
    }
  }, [userData]);

  const handleLogoChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl); // Update the logo preview state
      setFieldValue("logo", file); // Update Formik field value
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleFaviconChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setFaviconPreview(previewUrl); // Update the favicon preview state
      setFieldValue("favicon", file); // Update Formik field value
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append('vat', values.vat);
      formData.append('vatCommission', values.vatCommission);
      formData.append('whtNigerian', values.whtNigerian);
      formData.append('whtNonNigerian', values.whtNonNigerian); // Make sure to include this if it's part of your form
      formData.append('platformCommission', values.platformCommission);
      formData.append('priceThree', values.priceThree);
      formData.append('priceSix', values.priceSix);
      formData.append('priceGeneralSession', values.priceGeneralSession);
      formData.append('cancellationFees', values.cancellationFees);
      formData.append('payoutThreshold', values.payoutThreshold);

      // Append the logo file if it exists
      if (values.logo) {
        formData.append('logo', values.logo);
      }
      const response = await axiosSecure.post(`${API_BASE_URL}/api/admin/updateOrCreateSetting`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" // Set the content type to multipart/form-data
        }
      });
      if (response.data.status === 200) {
        toast.success("Basic details updated successfully!", { position: "top-right" });
        setUserData((prev) => ({
          ...prev,
          ...values // Update userData with the new values
        }));
        resetForm();
      }
    } catch (error) {
      console.error("Error saving Basic details:", error);
      toast.error("An error occurred while saving Basic details.");
    } finally {
      setSubmitting(false);
    }
  };

  /// function to update the setting links
  const handleLinkSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = {
        Email: values.Email,
        mobileNo: values.mobileNo,
        facebookLink: values.facebookLink,
        instagramLink: values.instagramLink,
        linkedInLink: values.linkedInLink,
        twitterLink: values.twitterLink,
        address: values.address
      };
      const response = await axiosSecure.post(
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
        setUserData((prev) => ({
          ...prev,
          ...payload
        }));
        resetForm();
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while updating settings.");
    } finally {
      setSubmitting(false);
    }
  };
  console.log("userdata", userData)

  // /setting the logo image 
  useEffect(() => {
    if (userData?.logo && typeof userData.logo === "string") {
      setLogoPreview(`${API_BASE_URL}/${userData.logo}`);
    }
  }, [userData?.logo]);

  //function to check the permissions 
  const hasPermission = (moduleName, action) => {
    console.log("moduleName in settings:", moduleName);
    const permission = rolePermissions.find(permission => permission.moduleName === 'Settings')
    console.log("permission for settings:", permission);
    return permission ? permission[action] === 1 : false;
  }

  const hasCreatePermission = (moduleName) => hasPermission(moduleName, 'isAdd');
  //  const hasReadPermission = (moduleName) => hasCreatePermission(moduleName, 'isRead');
  const hasUpdatePermission = (moduleName) => hasPermission(moduleName, 'isUpdate');


  return (
    <>
    {loading && <Loader />}
      <div >
        <SidebarNav />
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
                        payoutThreshold: userData.payoutThreshold || "",
                        logo: userData.logo || "",
                        favicon: userData.favicon || "",
                      }}
                      validationSchema={basicDetails}
                      enableReinitialize={true}
                      onSubmit={handleSubmit}
                    >
                      {({ errors, touched, handleSubmit, setFieldValue }) => (
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

                            {/* Logo */}
                            <div className="form-group">
                              <label>Logo</label>
                              <Field name="logo">
                                {({ form }) => (
                                  <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                      type="file"
                                      id="logoUpload"
                                      accept="image/*"
                                      style={{ display: "none" }}
                                      onChange={(e) => {
                                        const file = e.currentTarget.files[0];
                                        form.setFieldValue("logo", file); // Set the file
                                        handleLogoChange(e, form.setFieldValue); // Optional: for preview
                                      }}
                                    />
                                    <label htmlFor="logoUpload"
                                      style={{
                                        height: "60px",
                                        border: "1px solid #ced4da",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0 10px",
                                        cursor: "pointer",
                                      }}>
                                      {logoPreview || userData.logo ? (
                                        <img
                                          src={logoPreview || `${API_BASE_URL}/${userData.logo}`}
                                          alt="Logo Preview"
                                          style={{
                                            height: "30px",
                                            width: "40px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                          }}
                                        />
                                      ) : (
                                        <span style={{ color: "#6c757d" }}>Click to upload logo</span>
                                      )}
                                    </label>
                                  </div>
                                )}
                              </Field>
                              <ErrorMessage name="logo" component="div" className="text-danger" />
                            </div>

                            {/* Favicon */}
                            <div className="form-group">
                              <label>Favicon</label>
                              <Field name="favicon" type="file">
                                {({ field, form }) => (
                                  <div style={{ position: "relative", width: "100%" }}>
                                    <input
                                      type="file"
                                      id="faviconUpload"
                                      style={{ display: "none" }}
                                      onChange={(e) => handleFaviconChange(e, setFieldValue)} // Use the new function here
                                    />
                                    <label
                                      htmlFor="faviconUpload"
                                      style={{
                                        height: "60px",
                                        border: "1px solid #ced4da",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "0 10px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {/* Display favicon preview or the favicon from API */}
                                      {faviconPreview || userData.favicon ? (
                                        <img
                                          src={faviconPreview || `${API_BASE_URL}/${userData.favicon}`}
                                          alt="Favicon Preview"
                                          style={{
                                            height: "25px",
                                            width: "40px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                          }}
                                        />
                                      ) : (
                                        <span style={{ color: "#6c757d" }}>Click to upload favicon</span>
                                      )}
                                    </label>
                                  </div>
                                )}
                              </Field>
                              <ErrorMessage name="favicon" component="div" className="text-danger"/>
                            </div>

                            <div className="form-group mb-0">
                              <div className="settings-btns">
                                {hasUpdatePermission('Settings') && (
                                  <button type="submit" className="btn btn-primary mx-2">
                                    Update
                                  </button>
                                )}
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
                    <h5 className="card-title">Social Links</h5>
                  </div>
                  <div className="card-body pt-0">
                    <Formik
                      initialValues={{
                        facebookLink: userData.facebookLink || "",
                        mobileNo: userData.mobileNo || "",
                        instagramLink: userData.instagramLink || "",
                        linkedInLink: userData.linkedInLink || "",
                        twitterLink: userData.twitterLink || "",
                        Email: userData.Email || "",
                        address: userData.address || ""
                      }}
                      validationSchema={addressSchema}
                      enableReinitialize={true}
                      onSubmit={handleLinkSubmit}
                    >
                      {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                          <div className="settings-form">
                            <div className="form-group">
                              <label>Facebook Link *</label>
                              <Field type="text" name="facebookLink" className="form-control" placeholder="Enter Facebook Link" />
                              <ErrorMessage name="facebookLink" component="div" className="text-danger" />
                            </div>
                            <div className="form-group">
                              <label>Instagram *</label>
                              <Field type="text" name="instagramLink" className="form-control" placeholder="Enter Facebook Link" />
                              <ErrorMessage name="instagramLink" component="div" className="text-danger" />
                            </div>
                            <div className="form-group">
                              <label>LinkedIn *</label>
                              <Field type="text" name="linkedInLink" className="form-control" placeholder="Enter LinkedIn Link" />
                              <ErrorMessage name="linkedInLink" component="div" className="text-danger" />
                            </div>
                            <div className="form-group">
                              <label>Twitter *</label>
                              <Field type="text" name="twitterLink" className="form-control" placeholder="Enter Twitter Link" />
                              <ErrorMessage name="twitterLink" component="div" className="text-danger" />
                            </div>
                            <h5 className="title">Address & Contact Details</h5>

                            <div className="form-group">
                              <label>Address *</label>
                              <Field type="text" name="address" className="form-control" placeholder="Enter Address" />
                              <ErrorMessage name="address" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                              <label>Mobile No *</label>
                              <Field type="text" name="mobileNo" className="form-control" placeholder="Enter Mobile No" />
                              <ErrorMessage name="mobileNo" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                              <label>Email *</label>
                              <Field type="text" name="Email" className="form-control" placeholder="Enter Email" />
                              <ErrorMessage name="Email" component="div" className="text-danger" />
                            </div>

                            <div className="form-group">
                              {hasUpdatePermission('Settings') && (
                                <button type="submit" className="btn btn-primary">Update</button>
                              )}
                            </div>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GendralSettings;
