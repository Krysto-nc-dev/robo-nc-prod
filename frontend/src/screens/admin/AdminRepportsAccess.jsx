import React, { useState } from "react";
import {
  useGetAccessAppsQuery,
  useCreateAccessAppMutation,
} from "../../slices/appAccessSlice.js";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdminReportsAccess = () => {
  const { data: accessApps, isLoading, error } = useGetAccessAppsQuery();
  const [createAccessApp] = useCreateAccessAppMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    note: "",
    description: "",
    status: "Actif",
    multisociete: false,
    externe: false,
    type: "global",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccessApp(formData).unwrap();
      setIsModalOpen(false);
      setFormData({
        nom: "",
        note: "",
        description: "",
        status: "Actif",
        multisociete: false,
        externe: false,
        type: "global",
      });
    } catch (err) {
      console.error("Erreur lors de la création : ", err);
    }
  };

  const filteredApps = accessApps?.filter((app) =>
    app.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcul des statistiques
  const activeCount =
    accessApps?.filter((app) => app.status === "Actif").length || 0;
  const multisocieteCount =
    accessApps?.filter((app) => app.multisociete).length || 0;
  const externeCount = accessApps?.filter((app) => app.externe).length || 0;

  if (isLoading) return <p>Chargement des applications Access...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="">
      <h1 className="text-lg font-semibold text-gray-800 mb-2">
        Application Access
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Liste des rapports Access pour une analyse approfondie et un suivi
        précis de leur utilisation.
      </p>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-bold text-green-800">{activeCount}</h2>
          <p className="text-sm text-green-700">Rapports Actifs</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-bold text-blue-800">
            {multisocieteCount}
          </h2>
          <p className="text-sm text-blue-700">Multisociétés</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md shadow-sm">
          <h2 className="text-lg font-bold text-yellow-800">{externeCount}</h2>
          <p className="text-sm text-yellow-700">Externes</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mb-4 border px-4 py-2 rounded-md"
      />

      {/* Tableau des applications Access */}
      <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-2">Nom</th>
            <th className="border border-gray-300 px-2 py-2">Description</th>
            <th className="border border-gray-300 px-2 py-2">Statut</th>
            <th className="border border-gray-300 px-2 py-2">Type</th>
            <th className="border border-gray-300 px-2 py-2">Multisociété</th>
            <th className="border border-gray-300 px-2 py-2">Externe</th>
          </tr>
        </thead>
        <tbody>
          {filteredApps?.map((app) => (
            <tr key={app.id} className="text-center">
              <td className="border border-gray-300 px-2 py-2 text-blue-600 hover:underline">
                <Link to={`/admin/access-apps/${app._id}`}>{app.nom}</Link>
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {app.description || "N/A"}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {app.status === "Actif" ? (
                  <FaCheckCircle className="text-green-600 mx-auto" />
                ) : (
                  <FaTimesCircle className="text-red-600 mx-auto" />
                )}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    app.type === "global"
                      ? "bg-green-200 text-green-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {app.type}
                </span>
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {app.multisociete ? (
                  <FaCheckCircle className="text-green-600 mx-auto" />
                ) : (
                  <FaTimesCircle className="text-red-600 mx-auto" />
                )}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {app.externe ? (
                  <FaCheckCircle className="text-green-600 mx-auto" />
                ) : (
                  <FaTimesCircle className="text-red-600 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal pour ajouter une nouvelle application */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Ajouter une application Access
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ml-2"
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsAccess;
