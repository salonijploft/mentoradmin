import * as Yup from "yup";
export const faqValidation = Yup.object({
  question: Yup.string().required("Question is required"),
  answer: Yup.string().required("Answer is required"),
  category: Yup.string().required("Category is required")
});

export const basicDetails = Yup.object().shape({
  vat: Yup.number().required("VAT % is required"),
  vatCommission: Yup.number().required("VAT on Commission is required"),
  whtNigerian: Yup.number().required("WHT For Nigerian is required"),
  whtNonNigerian: Yup.number().required("WHT For Non-Nigerian is required"),
  platformCommission: Yup.number().required("Platform Commission is required"),
  bundlePrice3Months: Yup.number().required(
    "Max Bundle Price (3 Months) is required"
  ),
  bundlePrice6Months: Yup.number().required(
    "Max Bundle Price (6 Months) is required"
  ),
  generalSessionPrice: Yup.number().required(
    "Max Bundle Price (1 General Session) is required"
  ),
  cancellationFees: Yup.number().required(
    "Cancellation/Reschedule Fee is required"
  ),
  payoutThreshold: Yup.number().required("Payout Threshold is required"),
});

export const addressSchema = Yup.object().shape({
  facebook: Yup.string()
    .url("Invalid URL")
    .required("Facebook Link is required"),
  instagram: Yup.string()
    .url("Invalid URL")
    .required("Instagram Link is required"),
  linkedin: Yup.string()
    .url("Invalid URL")
    .required("LinkedIn Link is required"),
  twitter: Yup.string().url("Invalid URL").required("Twitter Link is required"),
  address: Yup.string().required("Address is required"),
  mobile: Yup.string()
    .matches(/^\d+$/, "Must be a valid number")
    .required("Mobile No is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const subadmin = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  // image: Yup.string().required("Image is required")
});

// export const BlogSchma = Yup.object({
//   blogName: Yup.string().required("Blog name is required"),
//   blogCategory: Yup.string().required("Please select a category"),
//   blogImage: Yup.mixed()
//     .required("Blog image is required")
//     .test("fileSize", "File size should be less than 5MB", (value) =>
//       value ? value.size <= 5242880 : true
//     ),
// });
export const BlogSchma = Yup.object({
  blogName: Yup.string().required("Blog name is required"),
  blogCategory: Yup.string().required("Please select a category"),
  blogImage: Yup.mixed()
    .required("Blog image is required"),
  blogStatus: Yup.string().required("Please select blog status"),
  description: Yup.string().required("Blog description is required"),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
    .required('Password is required'),
});

 export const forgotpassword = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });
  
    const resetPassword = Yup.object().shape({
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm Password is required"),
    });


export const goalSchma = Yup.object().shape({
  goalTitle: Yup.string().required("Goal Title is required"),
  status: Yup.string().required("Status is required"),
});

export const categorySchma = Yup.object().shape({
  categoryTitle: Yup.string().required("Category Title is required"),
  status: Yup.string().required("Status is required"),
});
