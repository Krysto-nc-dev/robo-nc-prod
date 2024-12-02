import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetFillialesQuery, useCreateFillialeMutation } from "../../slices/fillialesApiSlice";

const AdminFilliales = () => {
  const navigate = useNavigate();
  const { data: filliales, isLoading, error } = useGetFillialesQuery();
  const [createFilliale, { isLoading: isCreating }] = useCreateFillialeMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFilliale, setNewFilliale] = useState({
    nom: "",
    acronyme: "",
    website: "",
    adresse: "",
    logo: "",
    debutAnneeFiscale: "",
    finAnneeFiscale: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFilliale((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateFilliale = async () => {
    try {
      await createFilliale(newFilliale).unwrap();
      setNewFilliale({
        nom: "",
        acronyme: "",
        website: "",
        adresse: "",
        logo: "",
        debutAnneeFiscale: "",
        finAnneeFiscale: "",
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la filiale :", err);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">Erreur lors du chargement des filiales.</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Gestion des Filiales
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          Ajouter une Filiale
        </Button>
      </Box>

      {/* Filliale Cards */}
      <Grid container spacing={3}>
        {filliales.map((filliale) => (
          <Grid item xs={12} sm={6} md={4} key={filliale._id}>
            <Card
              onClick={() => navigate(`/admin/filliales/${filliale._id}`)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {filliale.nom}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filliale.adresse}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Voir les détails
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Filliale Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Ajouter une nouvelle Filiale</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="nom"
            value={newFilliale.nom}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Acronyme"
            name="acronyme"
            value={newFilliale.acronyme}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="Site Web"
            name="website"
            value={newFilliale.website}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Adresse"
            name="adresse"
            value={newFilliale.adresse}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
          />
          <TextField
            label="URL du Logo"
            name="logo"
            value={newFilliale.logo}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Début de l'année fiscale (mois)"
            name="debutAnneeFiscale"
            type="number"
            value={newFilliale.debutAnneeFiscale}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
            inputProps={{ min: 1, max: 12 }}
          />
          <TextField
            label="Fin de l'année fiscale (mois)"
            name="finAnneeFiscale"
            type="number"
            value={newFilliale.finAnneeFiscale}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            required
            inputProps={{ min: 1, max: 12 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={handleCreateFilliale}
            variant="contained"
            color="primary"
            disabled={isCreating}
          >
            {isCreating ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFilliales;
