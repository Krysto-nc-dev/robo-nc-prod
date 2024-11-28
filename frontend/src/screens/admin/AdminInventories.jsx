import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetInventoriesQuery,
  useImportZonesMutation,
} from "../../slices/inventorySlice";
import { toast } from "react-toastify";

const InventoryManager = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  // Hook pour récupérer la liste des inventaires
  const {
    data: inventories,
    isLoading: isLoadingInventories,
    error,
  } = useGetInventoriesQuery();

  // Hook pour importer des zones en CSV
  const [importZones, { isLoading: isImporting }] = useImportZonesMutation();

  // Gestion du fichier CSV
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Envoi du fichier CSV pour créer un inventaire
  const handleImportZones = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier CSV !");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await importZones(formData).unwrap();
      toast.success("Zones importées avec succès et inventaire créé !");
      setSelectedFile(null);
    } catch (err) {
      toast.error("Erreur lors de l'importation des zones.");
    }
  };

  // Fonction pour naviguer vers la page dédiée à un inventaire
  const handleInventoryClick = (inventoryId) => {
    navigate(`/admin/inventories/${inventoryId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4 text-secondaryColor">
        Gestion des Inventaires
      </h1>

      {/* Importer des zones en CSV */}
      <div className="mb-4">
        <h2 className="text-lg font-medium text-secondaryColor mb-2">
          Créer un nouvel inventaire
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-1/2"
          />
          <button
            onClick={handleImportZones}
            disabled={isImporting}
            className="btn"
          >
            {isImporting ? "Importation..." : "Importer Zones"}
          </button>
        </div>
      </div>

      {/* Liste des inventaires */}
      <div>
        <h2 className="text-lg font-medium text-secondaryColor mb-2">
          Liste des Inventaires
        </h2>
        {isLoadingInventories ? (
          <p className="text-mutedColor">Chargement des inventaires...</p>
        ) : error ? (
          <p className="text-dangerColor">
            Erreur lors du chargement des inventaires.
          </p>
        ) : inventories && inventories.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Statut</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventories.map((inventory) => (
                <tr key={inventory._id}>
                  <td>{inventory.nom || "N/A"}</td>
                  <td>{inventory.statut || "Inconnu"}</td>
                  <td>{new Date(inventory.dateDebut).toLocaleDateString()}</td>
                  <td>
                    {inventory.dateFin
                      ? new Date(inventory.dateFin).toLocaleDateString()
                      : "En cours"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleInventoryClick(inventory._id)}
                      className="btn"
                    >
                      Voir Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-mutedColor">Aucun inventaire trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default InventoryManager;
