import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
} from "../../slices/inventorySlice";
import { useCreateAgentMutation } from "../../slices/agentSlice";

const AdminInventoryDetails = () => {
  const { id: inventoryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [formData, setFormData] = useState({ nom: "", prenom: "" });
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateInventory] = useUpdateInventoryMutation();

  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch,
  } = useGetInventoryByIdQuery(inventoryId);

  const completedZonesCount = inventory?.zones.filter((zone) =>
    zone.parties.every((part) => part.status === "Terminé")
  ).length;

  const todoZonesCount = inventory?.zones.filter((zone) =>
    zone.parties.every((part) => part.status === "À faire")
  ).length;

  const inProgressZonesCount = inventory?.zones.filter(
    (zone) =>
      zone.parties.some(
        (part) => part.status === "En cours" || part.status === "Terminé"
      ) && !zone.parties.every((part) => part.status === "Terminé")
  ).length;

  const totalZonesCount = inventory?.zones.length || 0;

  const progressPercentage =
    totalZonesCount > 0
      ? Math.round((completedZonesCount / totalZonesCount) * 100)
      : 0;

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
      setFormData({ nom: "", prenom: "" });
      setIsModalOpen(false);
      await refetch();
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
      setEditMode(false);
      await refetch();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  if (inventoryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-base text-gray-400">Chargement...</span>
      </div>
    );
  }

  if (inventoryError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-base text-red-500">
          Erreur lors du chargement des données.
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-200 bg-gray-900 rounded-lg shadow-xl">
      {inventory ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            {editMode ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-black w-64"
                  placeholder="Modifier le nom"
                />
                <button
                  onClick={handleUpdateInventoryName}
                  className="py-2 px-4 bg-green-700 text-white text-sm rounded hover:bg-green-800 shadow-md"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="py-2 px-4 bg-gray-700 text-white text-sm rounded hover:bg-gray-800 shadow-md"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-bold">
                {inventory.nom || "Inventaire"}
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
                className={`py-2 px-3 rounded-full text-xs font-semibold shadow-md ${
                  inventory.statut === "En cours"
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {inventory.statut}
              </span>
              <button
                onClick={handleGeneratePDF}
                className="py-2 px-4 text-sm font-semibold text-white rounded bg-blue-700 hover:bg-blue-800 shadow-md"
              >
                Générer PDF
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="py-2 px-4 text-sm font-semibold text-white rounded bg-green-700 hover:bg-green-800 shadow-md"
              >
                Ajouter Agent
              </button>
              <Link
                to={`/admin/inventories-suivie/${inventoryId}`}
                className="py-2 px-4 text-sm font-semibold text-white rounded bg-gray-700 hover:bg-gray-800 shadow-md"
              >
                Commencer
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">Nombre de zones</h2>
              <p className="text-3xl font-semibold">{totalZonesCount}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">Zones terminées</h2>
              <p className="text-3xl font-semibold">{completedZonesCount}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">Zones à faire</h2>
              <p className="text-3xl font-semibold">{todoZonesCount}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">Zones en cours</h2>
              <p className="text-3xl font-semibold">{inProgressZonesCount}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">Progression</h2>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-right text-sm font-semibold mt-2">
                {progressPercentage}%
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">Agents associés</h2>
              <p className="text-3xl font-semibold">
                {inventory.agents.length}
              </p>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="text-lg font-bold mb-4">Agents associés</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.agents.map((agent) => (
                <div
                  key={agent._id}
                  className="p-4 bg-gray-800 rounded-lg shadow-md"
                >
                  <h3 className="text-lg font-bold mb-1">
                    {agent.nom} {agent.prenom}
                  </h3>
                  <p className="text-sm text-gray-400">ID : {agent._id}</p>
                </div>
              ))}
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-bold mb-3">Ajouter un Agent</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
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
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
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
                      className="py-2 px-4 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="py-2 px-4 bg-green-700 text-white text-sm rounded hover:bg-green-800"
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
        <div className="text-center text-base text-gray-400">
          Aucun détail d'inventaire trouvé.
        </div>
      )}
    </div>
  );
};

export default AdminInventoryDetails;
