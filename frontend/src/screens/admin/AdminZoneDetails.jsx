import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useGetZoneByIdQuery,
  useUpdateZoneMutation,
} from "../../slices/zoneSlice";
import Barcode from "react-barcode";
import { useCreateRecordMutation } from "../../slices/recordSlice";

const AdminZoneDetails = () => {
  const { id: zoneId } = useParams();
  const [scannedCode, setScannedCode] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [agent, setAgent] = useState("");
  const barcodeInputRef = useRef(null);

  const {
    data: zone,
    error: zoneError,
    isLoading: zoneLoading,
  } = useGetZoneByIdQuery(zoneId);
  const [updateZone] = useUpdateZoneMutation();
  const [createRecord] = useCreateRecordMutation();
  console.log("====================================");
  console.log("zone:", zone);
  console.log("====================================");
  useEffect(() => {
    // Focus automatique sur l'input de code-barres pour écouter les scans
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
      console.log("Focus sur l'input de code-barres");
    }
  }, []);

  const handleBarcodeInput = (e) => {
    const scannedValue = e.target.value.trim();
    console.log("Scanned Code (original):", scannedValue); // Log pour vérifier le code scanné
    const filteredValue = scannedValue.replace(/[^0-9]/g, ""); // Ne garder que les chiffres
    console.log("Scanned Code (filtered):", filteredValue); // Log pour vérifier le code scanné après filtrage
    setScannedCode(filteredValue);
  };

  useEffect(() => {
    if (scannedCode && zone) {
      // Rechercher la partie correspondant au code-barres scanné
      console.log(
        "Recherche du code-barres dans les parties de la zone... Scanned Code:",
        scannedCode
      );
      const part = zone.parties.find((p) => p.codeBarre === scannedCode);
      if (part) {
        console.log("Partie trouvée:", part);
        setSelectedPart(part);
      } else {
        console.log("Aucune partie trouvée pour le code-barres scanné.");
      }
      setScannedCode(""); // Réinitialiser après le scan
    }
  }, [scannedCode, zone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPart && agent) {
      try {
        console.log(
          "Soumission du formulaire avec agent:",
          agent,
          "et partie:",
          selectedPart
        );
        // Ajouter un enregistrement pour l'historique
        await createRecord({
          zone: zoneId,
          typeAction: selectedPart.type,
          agent,
          codeBarre: selectedPart.codeBarre,
        }).unwrap();

        // Mettre à jour le statut de la partie
        const updatedParties = zone.parties.map((p) =>
          p.codeBarre === selectedPart.codeBarre
            ? { ...p, status: "En cours" }
            : p
        );

        await updateZone({ id: zoneId, parties: updatedParties }).unwrap();

        setSelectedPart(null);
        setAgent("");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la zone :", error);
      }
    }
  };

  if (zoneLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (zoneError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg text-red-500">
          Erreur lors du chargement des données de la zone.
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto text-gray-300 bg-gray-800 rounded-lg shadow-md">
      <input
        ref={barcodeInputRef}
        type="text"
        onChange={handleBarcodeInput}
        className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        tabIndex={0} // Assure que l'input est focusable
        placeholder="Scannez le code-barres ici..."
        pattern="[0-9]*" // Accepte uniquement les chiffres
      />
      {zone ? (
        <div>
          {/* En-tête */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{zone.nom}</h1>
            <p className="text-sm text-gray-400 mb-2">
              {zone.designation} - {zone.lieu}
            </p>
            <p>{zone.observation}</p>
          </div>

          {/* Parties de la Zone */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Parties de la Zone</h2>
            {zone.parties && zone.parties.length > 0 ? (
              <div className="flex justify-between flex-1">
                {zone.parties.map((partie, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-700 rounded-md shadow-md w-1/3"
                  >
                    <h3 className="text-lg font-bold mb-1">{partie.type}</h3>
                    <p className="text-sm mb-2">Status: {partie.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Aucune partie trouvée pour cette zone.
              </p>
            )}
          </div>

          {/* Formulaire d'ajout d'agent et mise à jour du statut */}
          {selectedPart && (
            <div className="mb-6 p-4 bg-gray-700 rounded-md shadow-md">
              <h2 className="text-lg font-semibold mb-3">
                Mise à jour de la Partie {selectedPart.type}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold mb-1"
                    htmlFor="agent"
                  >
                    Agent
                  </label>
                  <input
                    type="text"
                    id="agent"
                    value={agent}
                    onChange={(e) => setAgent(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                >
                  Mettre à jour le statut
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-lg text-gray-500">
          Aucun détail de zone trouvé.
        </div>
      )}
    </div>
  );
};

export default AdminZoneDetails;
