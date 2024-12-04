import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetRepportGeneratorByIdQuery } from "../../slices/repportGeneratorsApiSlice";
import {
  useGetTicketsQuery,
  useCreateTicketMutation,
} from "../../slices/ticketApiSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Select,
  MenuItem,
  Chip,
  Backdrop,
  Tooltip
} from "@mui/material";

import { CheckCircle, Cancel, Info, Folder, Notes, Verified } from "@mui/icons-material";

import { PlusCircle, AlertCircle } from "lucide-react";

const AdminGeneratorDetails = () => {
  const { id } = useParams();

  // Fetch generator and tickets
  const {
    data: generator,
    isLoading: isGeneratorLoading,
    error: generatorError,
    refetch: refetchGenerator,
  } = useGetRepportGeneratorByIdQuery(id);

  const {
    data: tickets,
    isLoading: isTicketsLoading,
    refetch: refetchTickets,
  } = useGetTicketsQuery();

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState({
    titre: "",
    description: "",
    priorite: "Moyenne",
  });

  const [createTicket] = useCreateTicketMutation();

  const handleTicketInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket({
        ...ticketData,
        parentModel: "RepportGenerator",
        parentId: id,
      }).unwrap();
      alert("Ticket créé avec succès !");
      setIsTicketModalOpen(false);
      refetchTickets(); // Recharger les tickets
      refetchGenerator(); // Recharger les détails du générateur
    } catch (error) {
      console.error("Erreur lors de la création du ticket :", error);
    }
  };

  if (isGeneratorLoading || isTicketsLoading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (generatorError) {
    return (
      <Box textAlign="center" color="red">
        <Typography variant="h6">
          Erreur lors du chargement du générateur.
        </Typography>
      </Box>
    );
  }

  const filteredTickets = tickets?.filter((ticket) => ticket.parentId === id);

  return (
    <>
      <Typography variant="h6" fontWeight="bold" marginBottom={4}>
        {generator.nom}
      </Typography>

      {/* Informations Générales */}
      <Card variant="outlined" sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Info sx={{ mr: 1, color: "primary.main" }} />
          Informations Générales
        </Typography>
          {/* Description */}
          <Box
            display="flex"
            alignItems="center"
            marginBottom="10px"
            gap={1}
            sx={{ flex: "2 1 40%", minWidth: "40%" }}
          >
            <Notes color="secondary" />
            <Typography variant="body1" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"  }}>
              <strong>Description :</strong>{" "}
              {generator.description || (
                <Tooltip title="Aucune description disponible">
                  <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>
                    Non spécifié
                  </span>
                </Tooltip>
              )}
            </Typography>
          </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Informations sur une seule ligne */}
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          gap={2}
          sx={{ justifyContent: "space-between" }}
        >
        

          {/* Note */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ flex: "1 1 15%", minWidth: "15%" }}
          >
            <Verified color="success" />
            <Typography variant="body1">
              <strong>Note :</strong>{" "}
              {generator.note || (
                <Tooltip title="Aucune note disponible">
                  <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>
                    Non spécifié
                  </span>
                </Tooltip>
              )}
            </Typography>
          </Box>

          {/* Chemin */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ flex: "1 1 20%", minWidth: "20%" }}
          >
            <Folder color="primary" />
            <Typography variant="body1">
              <strong>Chemin :</strong>{" "}
              {generator.path || (
                <Tooltip title="Non spécifié">
                  <span style={{ color: "#9e9e9e", fontStyle: "italic" }}>
                    Non spécifié
                  </span>
                </Tooltip>
              )}
            </Typography>
          </Box>

          {/* Version */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ flex: "1 1 10%", minWidth: "10%" }}
          >
            <Verified color="info" />
            <Typography variant="body1">
              <strong>Version :</strong> {generator.version || "Non spécifiée"}
            </Typography>
          </Box>

          {/* Statut */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ flex: "1 1 10%", minWidth: "10%" }}
          >
            <CheckCircle color={generator.status === "Actif" ? "success" : "error"} />
            <Typography variant="body1">
              <strong>Statut :</strong>{" "}
              <Chip
                label={generator.status}
                color={generator.status === "Actif" ? "success" : "error"}
                size="small"
              />
            </Typography>
          </Box>

          {/* Multi-société */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ flex: "1 1 10%", minWidth: "10%" }}
          >
            <CheckCircle color={generator.multisociete ? "success" : "error"} />
            <Typography variant="body1">
              <strong>Multi-société :</strong>{" "}
              {generator.multisociete ? (
                <Chip label="Oui" color="success" size="small" />
              ) : (
                <Chip label="Non" color="error" size="small" />
              )}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
      {/* Tickets Associés */}
      <Card variant="outlined" marginBottom={4}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <Typography variant="h6">Tickets Associés</Typography>
            <IconButton
              color="primary"
              onClick={() => setIsTicketModalOpen(true)}
            >
              <PlusCircle />
            </IconButton>
          </Box>
          <Divider />
          {filteredTickets && filteredTickets.length > 0 ? (
            <List>
              {filteredTickets.map((ticket) => (
                <ListItem key={ticket._id}>
                  <ListItemText
                    primary={ticket.titre}
                    secondary={`Statut : ${ticket.status}`}
                  />
                  <Chip
                    label={ticket.status}
                    color={
                      ticket.status === "En cours"
                        ? "warning"
                        : ticket.status === "Résolu"
                        ? "success"
                        : "default"
                    }
                    icon={
                      ticket.status === "En cours" ? (
                        <AlertCircle />
                      ) : ticket.status === "Résolu" ? (
                        <CheckCircle />
                      ) : null
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="error">Aucun ticket associé.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Modal pour Ajouter un Ticket */}
      <Dialog
        open={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)} // Fermer la modal en cliquant à l'extérieur
      >
        <DialogTitle>Ajouter un Ticket</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            name="titre"
            value={ticketData.titre}
            onChange={handleTicketInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            name="description"
            value={ticketData.description}
            onChange={handleTicketInputChange}
            fullWidth
            margin="dense"
            multiline
            rows={4}
          />
          <Select
            name="priorite"
            value={ticketData.priorite}
            onChange={handleTicketInputChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Basse">Basse</MenuItem>
            <MenuItem value="Moyenne">Moyenne</MenuItem>
            <MenuItem value="Haute">Haute</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTicketModalOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleTicketSubmit} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminGeneratorDetails;
