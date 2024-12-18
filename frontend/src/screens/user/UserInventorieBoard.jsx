import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";

const UserInventorieBoard = () => {
  const [inventoryId, setInventoryId] = useState("674d29e9cf4c6c7c0f130367");
  const [selectedLieu, setSelectedLieu] = useState("Tous");
  const [selectedZone, setSelectedZone] = useState(null); // État pour la zone sélectionnée
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modal

  const {
    data: inventory,
    error,
    isLoading,
  } = useGetInventoryByIdQuery("674d29e9cf4c6c7c0f130367");

  const getZoneBorderColor = (zone) => {
    const allDone = zone.parties.every((part) => part.status === "Terminé");
    const allToDo = zone.parties.every((part) => part.status === "À faire");
    if (allDone) return "border-2 border-green-500 bg-green-100";
    if (allToDo) return "border-2 border-red-500 bg-red-100";
    return "border-2 border-orange-400 bg-orange-100";
  };

  const progressPercentage =
    (inventory?.zones?.filter((zone) =>
      zone.parties.every((part) => part.status === "Terminé")
    ).length /
      (inventory?.zones?.length || 1)) *
    100;

  const zonesInProgressCount =
    inventory?.zones?.filter((zone) =>
      zone.parties.some(
        (part) => part.status !== "À faire" && part.status !== "Terminé"
      )
    ).length || 0;

  const lieux = [
    "Tous",
    ...new Set(inventory?.zones.map((zone) => zone.lieu || "Non spécifié")),
  ];

  const filteredZones =
    selectedLieu === "Tous"
      ? inventory?.zones
      : inventory?.zones.filter((zone) => zone.lieu === selectedLieu);

  useEffect(() => {
    if (!inventoryId) {
      console.error("L'identifiant de l'inventaire est manquant.");
    }
  }, [inventoryId]);

  const handleZoneClick = (zone) => {
    setSelectedZone(zone); // Stocke la zone sélectionnée
    setIsModalOpen(true); // Ouvre la modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Ferme la modal
    setSelectedZone(null); // Réinitialise la zone sélectionnée
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Erreur lors du chargement des données.
      </div>
    );
  }

  if (!inventoryId) {
    return (
      <div className="flex justify-center items-center h-screen">
        Identifiant de l'inventaire non fourni.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 h-full min-h-screen">
      {/* Barre de progression */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">
          Progression de l'Inventaire
        </h2>
        <div className="relative bg-gray-300 rounded-full h-2">
          <div
            className="absolute top-0 left-0 bg-green-500 h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-right">
          {progressPercentage.toFixed(2)}% terminé
        </p>
      </div>

      {/* Nombre de zones en cours */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-600">
          Zones en cours : {zonesInProgressCount}
        </p>
      </div>

      {/* Filtre par lieu */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Filtrer par lieu
        </label>
        <select
          value={selectedLieu}
          onChange={(e) => setSelectedLieu(e.target.value)}
          className="border border-gray-800 rounded px-4 py-2 w-full"
        >
          {lieux.map((lieu, index) => (
            <option className="text-gray-800" key={index} value={lieu}>
              {lieu}
            </option>
          ))}
        </select>
      </div>

      {/* Zones */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {filteredZones?.map((zone) => (
          <div
            key={zone._id}
            className={`p-2 bg-gray-50 rounded shadow border cursor-pointer ${getZoneBorderColor(
              zone
            )}`}
            onClick={() => handleZoneClick(zone)} // Ajout du clic sur la carte
          >
            <h3 className="text-[0.6rem] font-bold text-gray-700 text-center mb-1 truncate">
              {zone.nom}
            </h3>
            <div className="flex justify-center gap-1 flex-wrap">
              {zone.parties.map((partie) => (
                <div
                  key={partie.codeBarre}
                  className={`w-4 h-4 text-[0.65rem] flex justify-center items-center rounded-full ${
                    partie.status === "Terminé" ? "bg-green-500" : "bg-red-500"
                  }`}
                  title={partie.type}
                >
                  {partie.type.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedZone && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {selectedZone.nom}
            </h3>
            <p className="text-sm text-gray-600">
              Lieu : {selectedZone.lieu || "Non spécifié"}
            </p>
            <ul className="mt-4 space-y-2">
              {selectedZone.parties.map((partie) => (
                <li key={partie.codeBarre} className="text-sm text-gray-700">
                  {partie.type} - {partie.status}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInventorieBoard;
