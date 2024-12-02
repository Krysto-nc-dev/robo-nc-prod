import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetAccessAppByIdQuery } from "../../slices/appAccessSlice";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdminRepportsAccessDetails = () => {
  const { id } = useParams(); // Récupérer l'ID depuis l'URL
  const { data: accessApp, isLoading, error } = useGetAccessAppByIdQuery(id);

  if (isLoading) return <p>Chargement des détails de l'application...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="p-4  shadow-md rounded-md">
      <h1 className="text-lg font-bold text-gray-800 mb-4">
        Détails de l'Application Access
      </h1>

      <div className="mb-6">
        <Link
          to="/admin/rapports/access"
          className="text-blue-600 hover:underline text-sm"
        >
          Retour à la liste des applications
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Nom */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Nom</span>
          <span className="text-gray-800 font-semibold">{accessApp.nom}</span>
        </div>

        {/* Note */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Note</span>
          <span className="text-gray-800">
            {accessApp.note || "Aucune note"}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col col-span-2">
          <span className="text-gray-500 text-sm">Description</span>
          <span className="text-gray-800">
            {accessApp.description || "Aucune description"}
          </span>
        </div>

        {/* Statut */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Statut</span>
          <span className="flex items-center">
            {accessApp.status === "Actif" ? (
              <FaCheckCircle className="text-green-600 mr-2" />
            ) : (
              <FaTimesCircle className="text-red-600 mr-2" />
            )}
            {accessApp.status}
          </span>
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Type</span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full max-w-16 ${
              accessApp.type === "global"
                ? "bg-green-200 text-green-800"
                : "bg-blue-200 text-blue-800"
            }`}
          >
            {accessApp.type}
          </span>
        </div>

        {/* Multisociété */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Multisociété</span>
          <span>
            {accessApp.multisociete ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaTimesCircle className="text-red-600" />
            )}
          </span>
        </div>

        {/* Externe */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Externe</span>
          <span>
            {accessApp.externe ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaTimesCircle className="text-red-600" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminRepportsAccessDetails;
