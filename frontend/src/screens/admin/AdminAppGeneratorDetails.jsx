import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetRepportGeneratorByIdQuery,
  useDeleteRepportGeneratorMutation,
  useUploadDocumentToReportGeneratorMutation,
  useGeneratePDFReportQuery,
} from "../../slices/repportGeneratorsApiSlice";
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
  Chip,
  Backdrop,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { PlusCircle, Trash2, Upload, FileText, Download } from "lucide-react";

const AdminGeneratorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: generator,
    isLoading: isGeneratorLoading,
    error: generatorError,
    refetch: refetchGenerator,
  } = useGetRepportGeneratorByIdQuery(id);

  const [deleteGenerator] = useDeleteRepportGeneratorMutation();
  const [uploadDocument] = useUploadDocumentToReportGeneratorMutation();
  const { refetch: fetchPDF } = useGeneratePDFReportQuery(id, { skip: true });
  const [isDeleting, setIsDeleting] = useState(false); // Nouvel état pour le loader

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ticketData, setTicketData] = useState({
    titre: "",
    description: "",
  });
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setFeedback({
        open: true,
        message: "Veuillez sélectionner un fichier.",
        severity: "warning",
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await uploadDocument({ id, formData }).unwrap();
      setFeedback({
        open: true,
        message: "Document ajouté avec succès.",
        severity: "success",
      });
      setIsUploadModalOpen(false);
      refetchGenerator();
    } catch (error) {
      setFeedback({
        open: true,
        message: "Erreur lors du téléchargement.",
        severity: "error",
      });
    }
  };

  const handleDeleteGenerator = async () => {
    setIsDeleting(true); // Activer le loader
    try {
      await deleteGenerator(id).unwrap();
      setFeedback({
        open: true,
        message: "Générateur supprimé avec succès.",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/generator")); // Redirection après succès
    } catch (error) {
      setFeedback({
        open: true,
        message: "Erreur lors de la suppression.",
        severity: "error",
      });
    } finally {
      setIsDeleting(false); // Désactiver le loader après l'opération
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await fetchPDF();
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${generator.nom}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setFeedback({
        open: true,
        message: "PDF téléchargé avec succès.",
        severity: "success",
      });
    } catch (error) {
      setFeedback({
        open: true,
        message: "Erreur lors du téléchargement du PDF.",
        severity: "error",
      });
    }
  };

  const handleTicketSubmit = async () => {
    // Implémentez ici l'appel à l'API pour créer un ticket
    setIsTicketModalOpen(false);
    setFeedback({
      open: true,
      message: "Ticket créé avec succès.",
      severity: "success",
    });
  };

  if (isGeneratorLoading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (generatorError && !isDeleting) {
    return (
      <Box textAlign="center" color="red">
        <Typography variant="h6">
          Erreur lors du chargement du générateur.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
        >
          {feedback.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" fontWeight="bold" marginBottom={4}>
        {generator.nom}
      </Typography>

      {/* Informations Générales */}
      <Card variant="outlined" marginBottom={4}>
        <CardContent>
          <Typography variant="h6">Informations Générales</Typography>
          <Divider />
          <Typography>
            <strong>Description :</strong>{" "}
            {generator.description || "Aucune description disponible."}
          </Typography>
          <Typography>
            <strong>Statut :</strong> {generator.status}
          </Typography>
          <Grid container spacing={2} mt={2}>
            <Grid item>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 />}
                onClick={handleDeleteGenerator}
                disabled={isDeleting} // Désactiver le bouton pendant la suppression
              >
                {isDeleting ? (
                  <CircularProgress size={20} color="inherit" /> // Loader à la place du texte
                ) : (
                  "Supprimer"
                )}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Download />}
                onClick={handleDownloadPDF}
              >
                Télécharger PDF
              </Button>
            </Grid>
          </Grid>
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
          {generator.tickets && generator.tickets.length > 0 ? (
            <List>
              {generator.tickets.map((ticket) => (
                <ListItem key={ticket._id}>
                  <ListItemText
                    primary={ticket.titre}
                    secondary={`Statut : ${ticket.status}`}
                  />
                  <Chip label={ticket.status} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">Aucun ticket associé.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Documents Associés */}
      <Card variant="outlined" marginBottom={4}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={2}
          >
            <Typography variant="h6">Documents Associés</Typography>
            <IconButton
              color="primary"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload />
            </IconButton>
          </Box>
          <Divider />
          {generator.documents && generator.documents.length > 0 ? (
            <List>
              {generator.documents.map((doc) => (
                <ListItem key={doc._id}>
                  <ListItemText primary={doc.name} secondary={doc.fileType} />
                  <Tooltip title="Voir le document">
                    <IconButton
                      color="primary"
                      component="a"
                      href={doc.filePath}
                      target="_blank"
                    >
                      <FileText />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">
              Aucun document associé.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Modal pour Upload de Document */}
      <Dialog
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      >
        <DialogTitle>Ajouter un Document</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            InputProps={{
              inputProps: { accept: ".pdf,.doc,.docx,.xls,.xlsx" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUploadModalOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleUploadSubmit} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal pour Ajouter un Ticket */}
      <Dialog
        open={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
      >
        <DialogTitle>Ajouter un Ticket</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre"
            fullWidth
            margin="dense"
            onChange={(e) =>
              setTicketData({ ...ticketData, titre: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            onChange={(e) =>
              setTicketData({ ...ticketData, description: e.target.value })
            }
          />
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
    </Box>
  );
};

export default AdminGeneratorDetails;
