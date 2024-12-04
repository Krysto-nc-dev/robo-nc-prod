import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
import { useScanZonePartMutation } from "../../slices/zoneSlice";

const AdminInventoriesSuivie = () => {
  const { id: inventoryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false); // Modal pour les détails de la zone
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null); // Zone sélectionnée
  const [selectedAgent, setSelectedAgent] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const barcodeInputRef = useRef(null);

  const { data: inventory, error, isLoading, refetch } =
    useGetInventoryByIdQuery(inventoryId);
  const [scanZonePart, { isLoading: isScanning }] = useScanZonePartMutation();

  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus(); // Focus sur l'input
    }
  }, [isModalOpen, isZoneModalOpen]);

  const handleBarcodeInputChange = (e) => {
    const value = e.target.value.trim();
    setBarcodeInput(value);

    const foundZone = inventory?.zones?.find((zone) =>
      zone.parties.some((part) => part.codeBarre === value)
    );

    if (foundZone) {
      const foundPart = foundZone.parties.find(
        (part) => part.codeBarre === value
      );
      setSelectedPart({ zoneId: foundZone._id, ...foundPart });
      setIsModalOpen(true);
    } else {
      console.error("Code-barres non trouvé dans l'inventaire.");
    }
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setIsZoneModalOpen(true);
  };

  const handleScanSubmit = async () => {
    if (!selectedPart) {
      console.error("Aucune partie sélectionnée.");
      return;
    }

    if (!selectedAgent) {
      console.error("Aucun agent sélectionné.");
      return;
    }

    try {
      await scanZonePart({
        zoneId: selectedPart.zoneId,
        data: { type: selectedPart.type, status: "Terminé", agentId: selectedAgent },
      }).unwrap();

      setIsModalOpen(false);
      setBarcodeInput("");
      refetch(); // Rafraîchit les données après mise à jour

      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la partie :", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setBarcodeInput(""); // Vide l'input
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  const handleZoneModalClose = () => {
    setIsZoneModalOpen(false);
    setSelectedZone(null);
  };

  const getZoneBorderColor = (zone) => {
    const allDone = zone.parties.every((part) => part.status === "Terminé");
    const allToDo = zone.parties.every((part) => part.status === "À faire");
    if (allDone) return "border-2 border-green-500 bg-green-100";
    if (allToDo) return "border-2 border-red-500 bg-red-100";
    return "border-2 border-orange-400 bg-orange-100";
  };

  const progressPercentage =
    inventory?.zones?.filter((zone) =>
      zone.parties.every((part) => part.status === "Terminé")
    ).length /
      (inventory?.zones?.length || 1) *
      100;

  const zonesInProgressCount = inventory?.zones?.filter((zone) =>
    zone.parties.some((part) => part.status !== "À faire" && part.status !== "Terminé")
  ).length || 0;

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

  return (
    <div className="p-4">
      {/* Barre de progression */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">
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

      {/* Dernière zone scannée */}
      {selectedPart && (
        <div className="mb-6 p-4 bg-gray-50 border rounded shadow">
          <h3 className="text-sm font-bold text-gray-800 mb-2">
            Dernière zone scannée
          </h3>
          <p className="text-sm text-gray-600">
            <strong>Nom de la zone :</strong>{" "}
            {inventory?.zones.find((zone) => zone._id === selectedPart.zoneId)?.nom}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Type :</strong> {selectedPart.type}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Code-barres :</strong> {selectedPart.codeBarre}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Statut :</strong> {selectedPart.status}
          </p>
        </div>
      )}

      {/* Scanner */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Scanner un code-barres
        </label>
        <input
          ref={barcodeInputRef}
          type="text"
          value={barcodeInput}
          onChange={handleBarcodeInputChange}
          placeholder="Entrer un code-barres"
          className="border border-gray-400 rounded px-4 py-2 w-full"
        />
      </div>

      {/* Zones */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {inventory?.zones.map((zone) => (
          <div
            key={zone._id}
            className={`p-2 bg-gray-50 rounded shadow border cursor-pointer ${getZoneBorderColor(
              zone
            )}`}
            onClick={() => handleZoneClick(zone)}
          >
            <h3 className="text-[0.6rem] font-bold text-gray-700 text-center mb-1 truncate">
              {zone.nom}
            </h3>
            <div className="flex justify-center gap-1 flex-wrap">
              {zone.parties.map((partie) => (
                <div
                  key={partie.codeBarre}
                  className={`w-4 h-4 text-[0.65rem] flex justify-center items-center rounded-full cursor-pointer transition-transform transform hover:scale-105 ${
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

      {/* Modal pour le bipage */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Mettre à jour le statut</h2>
            <p className="text-sm mb-4">
              <strong>Code-barres :</strong> {selectedPart?.codeBarre}
            </p>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Sélectionner un agent
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">-- Choisir un agent --</option>
              {inventory.agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.nom} {agent.prenom}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleModalClose}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleScanSubmit}
                disabled={isScanning}
              >
                {isScanning ? "Mise à jour..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour les détails de la zone */}
      {isZoneModalOpen && selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">{selectedZone.nom}</h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>ID :</strong> {selectedZone._id}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Parties :</strong> {selectedZone.parties.length}
            </p>
            <div className="text-sm text-gray-600">
              <strong>Détails des parties :</strong>
              <ul className="list-disc pl-5">
                {selectedZone.parties.map((part, index) => (
                  <li key={index}>
                    {part.type} - {part.status}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={handleZoneModalClose}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoriesSuivie;
