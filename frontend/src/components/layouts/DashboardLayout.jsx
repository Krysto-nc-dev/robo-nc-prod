// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Header from "./Header";

// const DashboardLayout = () => {
//   return (
//     <div className="flex h-screen w-screen overflow-hidden">
//       {/* Sidebar with fixed width */}
//       <div className="w-64 bg-neutral h-full">
//         {" "}
//         {/* Définit une largeur fixe pour la sidebar */}
//         <Sidebar />
//       </div>

//       {/* Main Content Area */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         {/* Header */}
//         <Header className="w-full" />

//         {/* Content area below header */}
//         <div className="flex-1 p-8 overflow-auto">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  return (
    <div className="flex flex-row bg-neutral h-screen w-screen overflow-hidden ">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header className="fixed w-full top-0 z-10" />
        <div className=" pl-8  p-4 overflow-auto ml-12 ">
          <Outlet />
        </div>
      </div>
      {/* <footer>Footer</footer> */}
    </div>
  );
};

export default DashboardLayout;
