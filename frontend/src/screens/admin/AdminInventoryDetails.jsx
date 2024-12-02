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
import { useCreateAgentMutation } from "../../slices/agentSlice";
import { Save, Edit, PictureAsPdf, Delete } from "@mui/icons-material";

const AdminInventoryDetails = () => {
  const { id: inventoryId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [formData, setFormData] = useState({ nom: "", prenom: "" });
  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateInventory] = useUpdateInventoryMutation();

  const {
    data: inventory,
    error: inventoryError,
    isLoading: inventoryLoading,
    refetch,
  } = useGetInventoryByIdQuery(inventoryId);

  const completedZonesCount = inventory?.zones.filter((zone) =>
    zone.parties.every((part) => part.status === "Terminé")
  ).length;

  const totalZonesCount = inventory?.zones.length || 0;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom) {
      console.error("Nom et prénom sont obligatoires.");
      return;
    }

    if (!inventoryId) {
      console.error("L'ID de l'inventaire est manquant.");
      return;
    }

    try {
      await createAgent({
        nom: formData.nom,
        prenom: formData.prenom,
        inventaire: inventoryId,
      }).unwrap();
      setFormData({ nom: "", prenom: "" });
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agent :", error);
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
                color="success"
                onClick={() => setIsModalOpen(true)}
              >
                Ajouter Agent
              </Button>
              <Link
                to={`/admin/inventories-suivie/${inventoryId}`}
                className="py-2 px-4 text-sm font-semibold text-white rounded bg-gray-700 hover:bg-gray-800 shadow-md"
              >
                Commencer
              </Link>
            </Box>
          </Box>

          {/* Statistics */}
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

          {/* Agents Table */}
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Liste des Agents Associés
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.agents.map((agent) => (
                    <TableRow key={agent._id}>
                      <TableCell>{agent.nom}</TableCell>
                      <TableCell>{agent.prenom}</TableCell>
                      <TableCell>{agent._id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Modal */}
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <DialogTitle>Ajouter un Agent</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                margin="dense"
                required
              />
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                margin="dense"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)} color="secondary">
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={isCreating}
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
