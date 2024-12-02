import React, { useState } from "react";
import {
  useGetMasterRepportsQuery,
  useCreateMasterRepportMutation,
} from "../../slices/masterRepportSlice.js";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdminReportsMaster = () => {
  const {
    data: masterRepports,
    isLoading,
    error,
  } = useGetMasterRepportsQuery();
  const [createMasterRepport] = useCreateMasterRepportMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    note: "",
    description: "",
    status: "Actif",
    multisociete: false,
    externe: false,
    type: "master",
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
      await createMasterRepport(formData).unwrap();
      setIsModalOpen(false);
      setFormData({
        nom: "",
        note: "",
        description: "",
        status: "Actif",
        multisociete: false,
        externe: false,
        type: "master",
      });
    } catch (err) {
      console.error("Erreur lors de la création : ", err);
    }
  };

  const filteredRepports = masterRepports?.filter((repport) =>
    repport.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcul des statistiques
  const activeCount =
    masterRepports?.filter((repport) => repport.status === "Actif").length || 0;
  const multisocieteCount =
    masterRepports?.filter((repport) => repport.multisociete).length || 0;
  const externeCount =
    masterRepports?.filter((repport) => repport.externe).length || 0;

  if (isLoading) return <p>Chargement des master repports...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="mx-auto">
      <h1 className="text-lg font-semibold text-gray-800 mb-2">
        Master Repports
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Explorez les master repports pour une vue approfondie et une gestion
        stratégique des données clés.
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
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Ajouter un rapport
        </button>
      </div>

      {/* Tableau des master reports */}
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
          {filteredRepports?.map((repport) => (
            <tr key={repport._id} className="text-center">
              <td className="border border-gray-300 px-2 py-2 text-blue-600 hover:underline">
                <Link to={`/admin/master-repports/${repport._id}`}>
                  {repport.nom}
                </Link>
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {repport.description || "N/A"}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {repport.status === "Actif" ? (
                  <FaCheckCircle className="text-green-600 mx-auto" />
                ) : (
                  <FaTimesCircle className="text-red-600 mx-auto" />
                )}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-200 text-blue-800">
                  {repport.type}
                </span>
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {repport.multisociete ? (
                  <FaCheckCircle className="text-green-600 mx-auto" />
                ) : (
                  <FaTimesCircle className="text-red-600 mx-auto" />
                )}
              </td>
              <td className="border border-gray-300 px-2 py-2">
                {repport.externe ? (
                  <FaCheckCircle className="text-green-600 mx-auto" />
                ) : (
                  <FaTimesCircle className="text-red-600 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[380px] ">
      <h2 className="text-lg font-semibold mb-4">
        Ajouter un Master Repport
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
      
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </select>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="multisociete"
            checked={formData.multisociete}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">
            Multisociété
          </label>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="externe"
            checked={formData.externe}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">
            Externe
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Fréquence
          </label>
          <input
            type="text"
            name="frequence"
            value={formData.frequence}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="global">Global</option>
            <option value="master">Master</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Filiales
          </label>
          <input
            type="text"
            name="filliales"
            value={formData.filliales}
            onChange={handleInputChange}
            placeholder="ID des filiales, séparés par des virgules"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Documents
          </label>
          <input
            type="text"
            name="documents"
            value={formData.documents}
            onChange={handleInputChange}
            placeholder="Nom de fichier, URL (séparés par des virgules)"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div className="flex justify-end">
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
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default AdminReportsMaster;
