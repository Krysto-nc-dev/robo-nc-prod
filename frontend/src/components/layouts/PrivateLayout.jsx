import React from "react";

import { Outlet } from "react-router-dom";
import Header from "./Header";

const PrivateLayout = ({ children }) => {
  return (
    <div className="flex flex-row bg-neutral h-screen w-screen overflow-hidden ">
      <h2>PRIVATE SIDEBAR</h2>
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

export default PrivateLayout;
