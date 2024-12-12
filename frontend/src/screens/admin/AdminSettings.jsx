import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBuilding, FaFileAlt } from "react-icons/fa";

const AdminSettings = () => {
  return (
    <div className="p-4">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Paramètres d'Administration
        </h1>
        <p className="text-gray-600 mb-8">
          Gérez les différentes sections de l'application avec des outils
          adaptés pour une administration efficace.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestion des Utilisateurs */}
          <Link
            to="/admin/users"
            className="group block p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          >
            <div className="flex items-center mb-4">
              <FaUsers className="text-4xl mr-4" />
              <div>
                <h2 className="text-xl font-semibold">
                  Gestion des Utilisateurs
                </h2>
                <p className="text-sm">
                  Ajouter, modifier ou supprimer des utilisateurs.
                </p>
              </div>
            </div>
            <div className="text-right text-sm group-hover:underline">
              Voir les détails →
            </div>
          </Link>

          {/* Gestion des Filiales */}
          <Link
            to="/admin/filliales"
            className="group block p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-green-500 to-green-600 text-white"
          >
            <div className="flex items-center mb-4">
              <FaBuilding className="text-4xl mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Gestion des Filiales</h2>
                <p className="text-sm">Configurer et gérer les filiales.</p>
              </div>
            </div>
            <div className="text-right text-sm group-hover:underline">
              Voir les détails →
            </div>
          </Link>

          {/* Voir les Logs */}
          <Link
            to="/admin/logs"
            className="group block p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-purple-500 to-purple-600 text-white"
          >
            <div className="flex items-center mb-4">
              <FaFileAlt className="text-4xl mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Voir les Logs</h2>
                <p className="text-sm">
                  Consulter les journaux d'activité pour le suivi.
                </p>
              </div>
            </div>
            <div className="text-right text-sm group-hover:underline">
              Voir les détails →
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl flex justify-center mt-10">Liens</h2>
        <h3 className="text-blue-500">Articles</h3>
        <p>Obtenir tout les articles</p>
        <p>rechercher un article par nom</p>
        <div className="p-3 bg-gray-200 text-purple-700">
          <p>https://api.robot-nc.com/qc-articles?search=aspirateur</p>
        </div>
        <p>retourne les articles d'un fournisseur</p>
        <div className="p-3 bg-gray-200 text-purple-700">
          <p>https://api.robot-nc.com/qc-articles/fournisseur/454</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
