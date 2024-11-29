import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
import { useGetRecordsQuery } from "../../slices/recordSlice";
import { useCreateAgentMutation } from "../../slices/agentSlice";
import Barcode from "react-barcode";

const AdminInventoryDetails = () => {
  const { id: inventoryId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modal
  const [formData, setFormData] = useState({ nom: "", prenom: "" }); // État pour le formulaire
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();

  // Récupérer les détails de l'inventaire
  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
  } = useGetInventoryByIdQuery(inventoryId);

  // Récupérer les enregistrements
  const {
    data: records,
    error: recordsError,
    isLoading: recordsLoading,
  } = useGetRecordsQuery();

  const handleGeneratePDF = async () => {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.robot-nc.com"
        : "http://localhost:4000";
  
    try {
      const response = await axios.get(
        `${baseUrl}/inventories/${inventoryId}/generate-pdf`,
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
          withCredentials: true,
        }
      );
  
      const blob = response.data;
      if (blob && blob.size > 0) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${inventory?.nom || "inventaire"}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Le PDF généré est vide ou invalide.");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAgent(formData).unwrap();
      setFormData({ nom: "", prenom: "" }); // Réinitialiser le formulaire
      setIsModalOpen(false); // Fermer la modal
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agent :", error);
    }
  };

  if (inventoryLoading || recordsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (inventoryError || recordsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-red-500">
          Erreur lors du chargement des données.
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto text-gray-300 bg-gray-800 rounded-lg shadow-md">
      {inventory ? (
        <div>
          {/* En-tête */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              {inventory.nom || "Inventaire"}
            </h1>
            <div className="flex items-center gap-4">
              <span
                className={`py-1 px-2 rounded-full text-xs font-semibold ${
                  inventory.statut === "En cours"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {inventory.statut}
              </span>
              <button
                onClick={handleGeneratePDF}
                className="py-1 px-4 text-sm font-semibold text-white rounded bg-blue-600 hover:bg-blue-700"
              >
                Générer PDF
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="py-1 px-4 text-sm font-semibold text-white rounded bg-green-600 hover:bg-green-700"
              >
                Ajouter Agent
              </button>
              <Link to={`/admin/inventories-suivie/${inventoryId}`}>
                COMMENCER
              </Link>
            </div>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-lg font-bold mb-4">Ajouter un Agent</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="py-1 px-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="py-1 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Zones */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Zones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.zones.map((zone) => (
                <div
                  key={zone._id}
                  className="p-3 bg-gray-700 rounded-md shadow-md"
                >
                  <h3 className="text-lg font-bold mb-1">{zone.nom}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {zone.designation} - {zone.lieu}
                  </p>
                  {zone.codeBarre && (
                    <div className="mt-2">
                      <Barcode value={zone.codeBarre.toString()} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-lg text-gray-500">
          Aucun détail d'inventaire trouvé.
        </div>
      )}
    </div>
  );
};

export default AdminInventoryDetails;
