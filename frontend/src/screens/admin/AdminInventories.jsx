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
    <Box
      sx={{
        padding: "24px",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#2d3748",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Gestion des Inventaires
      </Typography>

      <Link
        to={"documentation"}
        className="text-blue-500 hover:underline block text-center mb-6"
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
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#4a5568",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          Créer un nouvel inventaire
        </Typography>
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
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#4a5568",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
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
          <Typography>Aucun inventaire trouvé.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default InventoryManager;
