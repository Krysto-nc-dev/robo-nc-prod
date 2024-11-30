import React from "react";
import { Link } from "react-router-dom";

const AdminSettings = () => {
  return (
    <div className="flex gap-2">
      <Link to={"/admin/users"} className="btn">
        Gestion des utilsateurs
      </Link>
      <Link to={"/admin/filliales"} className="btn">
        Gestion des filliales
      </Link>
    </div>
  );
};

export default AdminSettings;
