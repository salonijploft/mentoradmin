import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./approuter";
import "./client/assets/css/bootstrap.min.css";
import "./client/assets/css/newstyle.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "../src/admin/assets/css/feathericon.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css";
import { AuthProvider } from "./context/AuthContext.js";


if (window.location.pathname.includes("admin")) {
  require("./admin/assets/css/feathericon.min.css");
  require("./admin/assets/css/custom.css");
} else {
  require("./client/assets/css/all.css");
  require("./client/assets/css/all.min.css");
  require("./client/assets/css/custom.css");
  require("../src/client/components/customstyleclient.css");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <AuthProvider >
    <AppRouter />
    </AuthProvider>
  </>
);
