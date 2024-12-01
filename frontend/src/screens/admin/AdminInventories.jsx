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
  Box,
} from "@mui/material";

const InventoryManager = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    data: inventories,
    isLoading: isLoadingInventories,
    error,
  } = useGetInventoriesQuery();

  const [importZones, { isLoading: isImporting }] = useImportZonesMutation();
  const [deleteInventory, { isLoading: isDeleting }] =
    useDeleteInventoryMutation();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

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

  const handleInventoryClick = (inventoryId) => {
    navigate(`/admin/inventories/${inventoryId}`);
  };

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
    <div className="">
      <h1 className="text-lg font-semibold text-gray-800 mb-2">
        Gestion des Inventaires
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Cette page vous permet de gérer vos inventaires : importer des zones,
        consulter et gérer les informations existantes.
      </p>

      <Link
        to={"documentation"}
        className="text-blue-500 hover:underline block mb-6"
        style={{ textAlign: "left" }}
      >
        Documentation
      </Link>

      {/* Importer des zones en CSV */}
      <Box
        sx={{
          marginBottom: "24px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 className="text-md font-bold text-gray-700 mb-4">
          Créer un nouvel inventaire
        </h2>
        <Box display="flex" alignItems="center" gap={2}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full md:w-2/3"
            style={{
              border: "1px solid #cbd5e0",
              borderRadius: "8px",
              padding: "8px",
            }}
          />
          <Button
            onClick={handleImportZones}
            variant="contained"
            color="primary"
            disabled={isImporting}
            sx={{
              backgroundColor: "#4c51bf",
              "&:hover": {
                backgroundColor: "#434190",
              },
            }}
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
        <h2 className="text-md font-bold text-gray-700 mb-4">
          Liste des Inventaires
        </h2>
        {isLoadingInventories ? (
          <Box display="flex" justifyContent="center" padding="16px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <p className="text-red-500">
            Erreur lors du chargement des inventaires.
          </p>
        ) : inventories && inventories.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f7fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#2d3748" }}>
                    Nom
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2d3748" }}>
                    Statut
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2d3748" }}>
                    Date de début
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#2d3748" }}>
                    Date de fin
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "#2d3748" }}
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventories.map((inventory) => (
                  <TableRow
                    key={inventory._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#edf2f7",
                      },
                    }}
                  >
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
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{
                          borderColor: "#4c51bf",
                          color: "#4c51bf",
                          "&:hover": {
                            backgroundColor: "#4c51bf",
                            color: "#ffffff",
                          },
                        }}
                      >
                        <Eye />
                      </Button>
                      <Button
                        onClick={() => handleDeleteInventory(inventory._id)}
                        variant="outlined"
                        color="error"
                        size="small"
                        disabled={isDeleting}
                        sx={{
                          marginLeft: "8px",
                          borderColor: "#e53e3e",
                          color: "#e53e3e",
                          "&:hover": {
                            backgroundColor: "#e53e3e",
                            color: "#ffffff",
                          },
                        }}
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
          <p className="text-gray-600">Aucun inventaire trouvé.</p>
        )}
      </Box>
    </div>
  );
};

export default InventoryManager;
