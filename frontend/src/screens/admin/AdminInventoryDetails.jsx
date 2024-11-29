import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
} from "../../slices/inventorySlice";
import { useCreateAgentMutation } from "../../slices/agentSlice";

const AdminInventoryDetails = () => {
  const { id: inventoryId } = useParams(); // Récupérer l'ID de l'inventaire depuis l'URL
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modal
  const [editMode, setEditMode] = useState(false); // État pour activer/désactiver le mode édition
  const [updatedName, setUpdatedName] = useState(""); // État pour le nouveau nom d'inventaire
  const [formData, setFormData] = useState({ nom: "", prenom: "" }); // État pour le formulaire
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateInventory] = useUpdateInventoryMutation();

  // Récupérer les détails de l'inventaire
  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch,
  } = useGetInventoryByIdQuery(inventoryId);

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
    if (!inventoryId) {
      console.error("L'ID de l'inventaire est manquant.");
      return;
    }
    try {
      await createAgent({
        nom: formData.nom,
        prenom: formData.prenom,
        inventaire: inventoryId,
      }).unwrap();
      setFormData({ nom: "", prenom: "" }); // Réinitialisez le formulaire
      setIsModalOpen(false); // Fermez la modal
      await refetch(); // Rafraîchissez les données
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agent :", error);
    }
  };

  const handleUpdateInventoryName = async () => {
    if (!inventoryId) {
      console.error("ID d'inventaire manquant !");
      return;
    }

    try {
      await updateInventory({ inventoryId, nom: updatedName }).unwrap();
      setEditMode(false); // Sort du mode édition
      await refetch(); // Rafraîchit les données
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  if (inventoryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (inventoryError) {
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
            {editMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-black w-80"
                  placeholder="Modifier le nom"
                />
                <button
                  onClick={handleUpdateInventoryName}
                  className="py-1 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="py-1 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-bold">
                {inventory.nom || "Inventaire"}{" "}
                <button
                  onClick={() => {
                    setEditMode(true);
                    setUpdatedName(inventory.nom);
                  }}
                  className="text-sm text-blue-400 underline ml-2"
                >
                  Modifier
                </button>
              </h1>
            )}
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
              <Link
                to={`/admin/inventories-suivie/${inventoryId}`}
                className="py-1 px-4 text-sm font-semibold text-white rounded bg-gray-600 hover:bg-gray-700"
              >
                Commencer
              </Link>
            </div>
          </div>

          {/* Nombre de zones et d'agents */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Nombre de zones : {inventory.zones.length}
            </h2>
            <h2 className="text-lg font-semibold mb-2">
              Nombre d'agents associés : {inventory.agents.length}
            </h2>
          </div>

          {/* Liste des agents */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Agents associés</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.agents.map((agent) => (
                <div
                  key={agent._id}
                  className="p-3 bg-gray-700 rounded-md shadow-md"
                >
                  <h3 className="text-lg font-bold mb-1">
                    {agent.nom} {agent.prenom}
                  </h3>
                  <p className="text-sm text-gray-400">ID : {agent._id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Modal pour ajouter un agent */}
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
