import React from "react";
import { Link } from "react-router-dom";

const AdminSettings = () => {
  return (
    <div className="mx-auto">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">
        Paramètres d'Administration
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Accédez aux différentes sections d'administration pour gérer les
        utilisateurs et les filiales de manière efficace.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/users"
          className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
        >
          Gestion des Utilisateurs
        </Link>
        <Link
          to="/admin/filliales"
          className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"
        >
          Gestion des Filiales
        </Link>
        <Link
          to="/admin/logs"
          className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"
        >
          Voir les logs
        </Link>
      </div>
    </div>
  );
};

export default AdminSettings;
