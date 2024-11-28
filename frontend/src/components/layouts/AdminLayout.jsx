import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Package,
  FileText,
  Clipboard,
  Settings,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-200 text-gray-700">
      {/* Sidebar */}
      <div className="w-64 bg-gray-700 flex flex-col fixed h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-12 bg-primaryColor">
          <h1 className="text-md font-bold text-gray-900">QC Administration</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 p-4 space-y-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center p-3 rounded-md text-gray-400 hover:text-black hover:bg-highlightColor transition"
          >
            <LayoutDashboard className="mr-2 w-5 h-5" />
            Tableaux de bord
          </Link>
          <Link
            to="/admin/supliers"
            className="flex items-center p-3 rounded-md text-gray-400 hover:text-black hover:bg-highlightColor transition"
          >
            <Truck className="mr-2 w-5 h-5" />
            Fournisseurs
          </Link>
          <Link
            to="/admin/inventories"
            className="flex items-center p-3 rounded-md text-gray-400 hover:text-black hover:bg-highlightColor transition"
          >
            <Package className="mr-2 w-5 h-5" />
            Articles
          </Link>
          <Link
            to="/admin/billing"
            className="flex items-center p-3 rounded-md text-gray-400 hover:text-black hover:bg-highlightColor transition"
          >
            <FileText className="mr-2 w-5 h-5" />
            Facturation
          </Link>
          <Link
            to="/admin/inventories"
            className="flex items-center p-3 rounded-md text-gray-400 hover:text-black hover:bg-highlightColor transition"
          >
            <Clipboard className="mr-2 w-5 h-5" />
            Inventaires
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center p-3 rounded-md text-gray-400 hover:text-black hover:bg-highlightColor transition"
          >
            <Settings className="mr-2 w-5 h-5" />
            Paramètres
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 text-sm text-center text-gray-500">
          © 2024 QC Admin
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-4 bg-gray-900 text-gray-100 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
