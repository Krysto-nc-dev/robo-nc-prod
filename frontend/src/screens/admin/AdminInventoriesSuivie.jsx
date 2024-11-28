import React from "react";
import { useParams } from "react-router-dom";
import { useGetInventoryByIdQuery } from "../../slices/inventorySlice";

const AdminInventoriesSuivie = () => {
  const { id: inventoryId } = useParams();

  // Récupérer les détails de l'inventaire
  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
  } = useGetInventoryByIdQuery(inventoryId);

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

  return (
    <div className="p-4  mx-auto">
      <h1 className="text-2xl font-bold text-gray-300 mb-4">
        Suivi des zones de l'inventaire : {inventory?.nom}
      </h1>
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
                >
                  {partie.type.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminInventoriesSuivie;
