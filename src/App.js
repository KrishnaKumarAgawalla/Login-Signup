import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Registration from "./Components/Registration/Registration";
import Dashboard from "./Components/Dashboard/Dashboard";
import { useState, useEffect } from "react";

const dashboardArray = [
  "Dashboard",
  "Job Post",
  "Posted Job",
  "Change Password",
];

const id_check = localStorage.getItem("user_id");
if (id_check === null) {
  localStorage.setItem("user_id", "");
  localStorage.setItem("mobile", "");
  localStorage.setItem("name", "");
  localStorage.setItem("company", "");
  localStorage.setItem("img", "");
  localStorage.setItem("gst", "");
  localStorage.setItem("email", "");
  localStorage.setItem("address", "");
  localStorage.setItem("remember", false);
} else {
  let remember = localStorage.getItem("remember");
  if (remember === false) {
    localStorage.setItem("user_id", "");
    localStorage.setItem("mobile", "");
    localStorage.setItem("name", "");
    localStorage.setItem("company", "");
    localStorage.setItem("img", "");
    localStorage.setItem("gst", "");
    localStorage.setItem("email", "");
    localStorage.setItem("address", "");
    localStorage.setItem("remember", "");
  }
}

function App() {
  let id = localStorage.getItem("user_id");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/login"
          element={
            id === null || id === "" ?  <Login /> : <Navigate to="/dashboard" />
          }
        />
        <Route index path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/dashboard"
          element={
            id === null || id === "" ? (
              <Navigate to="/login" />
            ) : (
              <Dashboard lists={dashboardArray} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
