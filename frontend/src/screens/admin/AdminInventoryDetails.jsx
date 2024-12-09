import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import {
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
} from "../../slices/inventorySlice";
import {
  useCreateZoneMutation,
  useGetZonesQuery,
} from "../../slices/zoneSlice";
import { Save, Edit, PictureAsPdf } from "@mui/icons-material";

const AdminInventoryDetails = () => {
  const { id: inventoryId } = useParams();
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [zoneData, setZoneData] = useState({
    nom: "",
    designation: "",
    observation: "",
    lieu: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");

  const [createZone, { isLoading: isCreatingZone }] = useCreateZoneMutation();
  const [updateInventory] = useUpdateInventoryMutation();

  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch,
  } = useGetInventoryByIdQuery(inventoryId);

  const { data: zones, refetch: refetchZones } = useGetZonesQuery();

  const completedZonesCount = zones?.filter((zone) =>
    zone.parties.every((part) => part.status === "Terminé")
  ).length;

  const totalZonesCount = zones?.length || 0;

  const progressPercentage =
    totalZonesCount > 0
      ? Math.round((completedZonesCount / totalZonesCount) * 100)
      : 0;

  const handleGeneratePDF = async () => {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.robot-nc.com"
        : "http://localhost:4000";

    try {
      const response = await axios.get(
        `${baseUrl}/inventories/${inventoryId}/generate-pdf`,
        {
          responseType: "blob",
          headers: { Accept: "application/pdf" },
          withCredentials: true,
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
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Le PDF généré est vide ou invalide.");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
    }
  };

  const handleZoneChange = (e) => {
    const { name, value } = e.target;
    setZoneData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleAddZone = async () => {
    if (!zoneData.nom || !zoneData.designation || !zoneData.lieu) {
      console.error("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    try {
      await createZone({
        ...zoneData,
        inventaire: inventoryId,
      }).unwrap();
      setZoneData({ nom: "", designation: "", observation: "", lieu: "" });
      setIsZoneModalOpen(false);
      await refetchZones();
    } catch (error) {
      console.error("Erreur lors de la création de la zone :", error);
    }
  };

  const handleUpdateInventoryName = async () => {
    if (!inventoryId) {
      console.error("ID d'inventaire manquant !");
      return;
    }

    try {
      await updateInventory({ inventoryId, nom: updatedName }).unwrap();
      setEditMode(false);
      await refetch();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  if (inventoryLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="body1">Chargement...</Typography>
      </Box>
    );
  }

  if (inventoryError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error" variant="body1">
          Erreur lors du chargement des données.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {inventory && (
        <Box>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              {editMode ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    placeholder="Modifier le nom"
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleUpdateInventoryName}
                    startIcon={<Save />}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setEditMode(false)}
                  >
                    Annuler
                  </Button>
                </Box>
              ) : (
                <Typography variant="h6" component="div">
                  {inventory.nom}
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => setEditMode(true)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </Typography>
              )}
            </Box>

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGeneratePDF}
                startIcon={<PictureAsPdf />}
              >
                Générer PDF
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsZoneModalOpen(true)}
              >
                Ajouter Zone
              </Button>
              <Link
                to={`/admin/inventories-suivie/${inventoryId}`}
                style={{ textDecoration: "none" }}
              >
                <Button variant="outlined" color="secondary">
                  Aller à l'Inventaire
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Zones */}
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Zones Totales</Typography>
                  <Typography variant="h6">{totalZonesCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Zones Terminées</Typography>
                  <Typography variant="h6">{completedZonesCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Progression</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" textAlign="right" sx={{ mt: 1 }}>
                    {progressPercentage}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Zones Table */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Liste des Zones
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Lieu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {zones?.map((zone) => (
                    <TableRow key={zone._id}>
                      <TableCell>{zone.nom}</TableCell>
                      <TableCell>{zone.designation}</TableCell>
                      <TableCell>{zone.lieu}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Add Zone Dialog */}
          <Dialog
            open={isZoneModalOpen}
            onClose={() => setIsZoneModalOpen(false)}
          >
            <DialogTitle>Ajouter une Zone</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={zoneData.nom}
                onChange={handleZoneChange}
                margin="dense"
                required
              />
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={zoneData.designation}
                onChange={handleZoneChange}
                margin="dense"
                required
              />
              <TextField
                fullWidth
                label="Lieu"
                name="lieu"
                value={zoneData.lieu}
                onChange={handleZoneChange}
                margin="dense"
                required
              />
              <TextField
                fullWidth
                label="Observation"
                name="observation"
                value={zoneData.observation}
                onChange={handleZoneChange}
                margin="dense"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setIsZoneModalOpen(false)}
                color="secondary"
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddZone}
                variant="contained"
                color="primary"
                disabled={isCreatingZone}
              >
                Ajouter
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
};

export default AdminInventoryDetails;
