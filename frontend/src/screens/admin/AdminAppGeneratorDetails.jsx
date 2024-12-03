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
} from "@mui/material";
import { PlusCircle, AlertCircle, CheckCircle } from "lucide-react";

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
      <Typography variant="h4" fontWeight="bold" marginBottom={4}>
        Détails du Générateur : {generator.nom}
      </Typography>

      {/* Informations Générales */}
      <Card variant="outlined" marginBottom={4}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informations Générales
          </Typography>
          <Divider />
          <Typography>
            <strong>Description :</strong>{" "}
            {generator.description || "Aucune description disponible."}
          </Typography>
          <Typography>
            <strong>Note :</strong>{" "}
            {generator.note || "Aucune note disponible."}
          </Typography>
          <Typography>
            <strong>Chemin :</strong> {generator.path || "Non spécifié."}
          </Typography>
          <Typography>
            <strong>Version :</strong> {generator.version}
          </Typography>
          <Typography>
            <strong>Statut :</strong> {generator.status}
          </Typography>
          <Typography>
            <strong>Multi-société :</strong>{" "}
            {generator.multisociete ? "Oui" : "Non"}
          </Typography>
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
