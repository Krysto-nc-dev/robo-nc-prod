import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetInventoriesQuery,
  useImportZonesMutation,
  useDeleteInventoryMutation,
} from "../../slices/inventorySlice";
import { toast } from "react-toastify";
import { Eye, Loader2, Trash2 } from "lucide-react";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

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

  // Hook pour supprimer un inventaire
  const [deleteInventory, { isLoading: isDeleting }] =
    useDeleteInventoryMutation();

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

  // Fonction pour supprimer un inventaire
  const handleDeleteInventory = async (inventoryId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet inventaire ?")) {
      try {
        await deleteInventory(inventoryId).unwrap();
        toast.success("Inventaire supprimé avec succès !");
      } catch (err) {
        toast.error("Erreur lors de la suppression de l'inventaire.");
      }
    }
  };

  return (
    <Box
      sx={{
        padding: "16px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", color: "#333", fontWeight: "bold" }}
      >
        Gestion des Inventaires
      </Typography>
      <Link to={"documentation"} className="text-blue-500 underline">
        Documentation
      </Link>

      {/* Importer des zones en CSV */}
      <Box
        sx={{
          marginBottom: "24px",
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#555", fontWeight: "bold" }}
        >
          Créer un nouvel inventaire
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-1/2"
          />
          <Button
            onClick={handleImportZones}
            variant="contained"
            color="primary"
            disabled={isImporting}
          >
            {isImporting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Importer Zones"
            )}
          </Button>
        </Box>
      </Box>

      {/* Liste des inventaires */}
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#555", fontWeight: "bold" }}
        >
          Liste des Inventaires
        </Typography>
        {isLoadingInventories ? (
          <Box display="flex" justifyContent="center" padding="16px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">
            Erreur lors du chargement des inventaires.
          </Typography>
        ) : inventories && inventories.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date de début</TableCell>
                  <TableCell>Date de fin</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventories.map((inventory) => (
                  <TableRow key={inventory._id}>
                    <TableCell>{inventory.nom || "N/A"}</TableCell>
                    <TableCell>{inventory.statut || "Inconnu"}</TableCell>
                    <TableCell>
                      {new Date(inventory.dateDebut).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {inventory.dateFin
                        ? new Date(inventory.dateFin).toLocaleDateString()
                        : "En cours"}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => handleInventoryClick(inventory._id)}
                        variant="text"
                        color="primary"
                        size="small"
                      >
                        <Eye />
                      </Button>
                      <Button
                        onClick={() => handleDeleteInventory(inventory._id)}
                        variant="text"
                        color="error"
                        size="small"
                        disabled={isDeleting}
                        sx={{ marginLeft: "8px" }}
                      >
                        {isDeleting ? <Loader2 /> : <Trash2 />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Aucun inventaire trouvé.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default InventoryManager;
