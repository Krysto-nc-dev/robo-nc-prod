import React from "react";
// import Topbar from "../global/Topbar";
// import AdminSidebar from "../global/AdminSidebar";

const UserLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* <AdminSidebar /> */}

      <div
        style={{
          flexGrow: 1,
          transition: "margin-left 0.3s ease",
          backgroundColor: "#f0f0f0",
          boxSizing: "border-box",
        }}
      >
        {/* <Topbar /> */}
        <div style={{ marginLeft: "71px", padding: "16px" }}>{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
