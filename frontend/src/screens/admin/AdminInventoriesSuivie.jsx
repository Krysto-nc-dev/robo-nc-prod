import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
import { useScanZonePartMutation } from "../../slices/zoneSlice";

const AdminInventoriesSuivie = () => {
  const { id: inventoryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [scanZonePart] = useScanZonePartMutation();
  const [barcodeInput, setBarcodeInput] = useState("");

  // Récupérer les détails de l'inventaire
  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch,
  } = useGetInventoryByIdQuery(inventoryId);

  useEffect(() => {
    if (selectedPart) {
      setIsModalOpen(true);
    }
  }, [selectedPart]);

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

  // Fonction pour déterminer la couleur de fond selon le statut
  const getStatusColor = (status) => {
    switch (status) {
      case "À faire":
        return "bg-red-500";
      case "En cours":
        return "bg-orange-500";
      case "Terminé":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Fonction pour ouvrir le modal lors du clic sur une action
  const handlePartClick = (zoneId, part) => {
    setSelectedPart({ zoneId, ...part });
  };

  // Fonction pour envoyer la mise à jour du statut de l'action
  const handleScanSubmit = async () => {
    if (!selectedPart || !selectedAgent) {
      console.error("Partie ou agent non sélectionné");
      return;
    }

    try {
      await scanZonePart({
        zoneId: selectedPart.zoneId,
        data: { type: selectedPart.type, agentId: selectedAgent },
      }).unwrap();
      setIsModalOpen(false);
      setSelectedPart(null);
      setSelectedAgent("");
      refetch(); // Rafraîchir les données après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la partie :", error);
    }
  };

  // Fonction pour gérer le scan du code-barres
  const handleBarcodeScan = () => {
    const foundZone = inventory.zones.find((zone) =>
      zone.parties.some((part) => part.codeBarre === barcodeInput)
    );

    if (foundZone) {
      const foundPart = foundZone.parties.find(
        (part) => part.codeBarre === barcodeInput
      );
      setSelectedPart({ zoneId: foundZone._id, ...foundPart });
    } else {
      console.error("Code-barres non trouvé");
    }
  };

  return (
    <div className="p-4  mx-auto">
      <h1 className="text-2xl font-bold text-gray-300 mb-4">
        Suivi des zones de l'inventaire : {inventory?.nom}
      </h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Scanner un code-barres
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            className="px-3 py-2 rounded-lg border text-black w-80"
            placeholder="Entrer le code-barres"
          />
          <button
            onClick={handleBarcodeScan}
            className="py-1 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Scanner
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {inventory?.zones.map((zone) => (
          <div
            key={zone._id}
            className="p-2 border border-gray-300 bg-gray-600 rounded-md shadow-md"
          >
            {/* Nom de la zone */}
            <h3 className="text-center text-white font-bold text-sm mb-2">
              {zone.nom}
            </h3>

            {/* Statuts des parties */}
            <div className="flex justify-around items-center">
              {zone.parties.map((partie) => (
                <div
                  key={partie.type}
                  className={`w-6 h-6 flex justify-center items-center rounded ${getStatusColor(
                    partie.status
                  )}`}
                  title={partie.type} // Infobulle pour afficher le type
                  onClick={() => handlePartClick(zone._id, partie)}
                >
                  {partie.type.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour scanner une partie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Scanner une Partie</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Sélectionner un agent</option>
                {inventory.agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.nom} {agent.prenom}
                  </option>
                ))}
              </select>
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
                onClick={handleScanSubmit}
                className="py-1 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoriesSuivie;
