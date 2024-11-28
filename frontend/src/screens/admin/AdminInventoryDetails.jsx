import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";
import { useGetRecordsQuery } from "../../slices/recordSlice";
import Barcode from "react-barcode"; // Importer Barcode

const AdminInventoryDetails = () => {
  const { id: inventoryId } = useParams();
  const navigate = useNavigate();

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
    try {
      // Utilisation d'Axios pour la requête
      const response = await axios.get(
        `https://api.robot-nc.com/inventories/${inventoryId}/generate-pdf`,
        {
          responseType: "blob", // Reçoit la réponse en tant que Blob
          headers: {
            Accept: "application/pdf", // Précise que l'on attend un PDF
          },
          withCredentials: true, // Si vous avez besoin d'envoyer des cookies
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
        window.URL.revokeObjectURL(url); // Nettoyage après utilisation
      } else {
        console.error("Le PDF généré est vide ou invalide.");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
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

  // Filtrer les enregistrements pour les zones de l'inventaire
  const filteredRecords = records?.filter((record) =>
    inventory?.zones.some((zone) => zone._id === record.zone)
  );

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
                className={`py-1 px-4 text-sm font-semibold text-white rounded ${"bg-blue-600 hover:bg-blue-700"}`}
              >
                Générer PDF
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="mb-4 text-sm">
            <p>
              Date de début :{" "}
              {new Date(inventory.dateDebut).toLocaleDateString()}
            </p>
            <p>
              Date de fin :{" "}
              {inventory.dateFin
                ? new Date(inventory.dateFin).toLocaleDateString()
                : "Non défini"}
            </p>
          </div>

          {/* Zones */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Zones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.zones.map((zone) => (
                <div
                  key={zone._id}
                  onClick={() => navigate(`/admin/zones/${zone._id}`)}
                  className="p-3 bg-gray-700 rounded-md shadow-md cursor-pointer hover:bg-gray-600"
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

          {/* Logs des enregistrements */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              Logs des Enregistrements
            </h2>
            {filteredRecords?.length > 0 ? (
              <table className="w-full border-collapse border border-gray-700 bg-gray-700">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-left text-gray-200">
                      Type d'Action
                    </th>
                    <th className="py-2 px-3 text-left text-gray-200">Zone</th>
                    <th className="py-2 px-3 text-left text-gray-200">Agent</th>
                    <th className="py-2 px-3 text-left text-gray-200">
                      Code Barre
                    </th>
                    <th className="py-2 px-3 text-left text-gray-200">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record._id}
                      className="border-t border-gray-600 hover:bg-gray-600"
                    >
                      <td className="py-2 px-3 text-sm text-gray-300 font-semibold">
                        {record.typeAction}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-300">
                        {inventory.zones.find(
                          (zone) => zone._id === record.zone
                        )?.nom || "N/A"}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-300">
                        {inventory.agents.find(
                          (agent) => agent._id === record.agent
                        )?.nom || "N/A"}{" "}
                        {inventory.agents.find(
                          (agent) => agent._id === record.agent
                        )?.prenom || ""}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-300">
                        {record.codeBarre}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-300">
                        {new Date(record.dateAction).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400">
                Aucun enregistrement trouvé pour cet inventaire.
              </p>
            )}
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
