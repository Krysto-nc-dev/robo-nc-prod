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
} from "@mui/material";
import { PlusCircle, AlertCircle, CheckCircle, Upload, FileText } from "lucide-react";

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

  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsDeleting(true);
    try {
      await deleteGenerator(id).unwrap();
      setFeedback({
        open: true,
        message: "Générateur supprimé avec succès.",
        severity: "success",
      });
      setTimeout(() => navigate("/admin/generator"), 500);
    } catch (error) {
      setFeedback({
        open: true,
        message: "Erreur lors de la suppression.",
        severity: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await fetchPDF();
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${generator?.nom || "document"}.pdf`);
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

  const handleTicketSubmit = () => {
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
        <Typography variant="h6">Erreur lors du chargement du générateur.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" marginBottom={4}>
        Détails du Générateur : {generator?.nom || "Inconnu"}
      </Typography>

      {/* Informations Générales */}
      <Card variant="outlined" sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informations Générales
          </Typography>
          <Divider />
          <Typography>
            <strong>Description :</strong> {generator?.description || "Aucune description disponible."}
          </Typography>
          <Typography>
            <strong>Note :</strong> {generator?.note || "Aucune note disponible."}
          </Typography>
          <Typography>
            <strong>Chemin :</strong> {generator?.path || "Non spécifié."}
          </Typography>
          <Typography>
            <strong>Version :</strong> {generator?.version || "Inconnu"}
          </Typography>
          <Typography>
            <strong>Statut :</strong> {generator?.status || "Inconnu"}
          </Typography>
          <Typography>
            <strong>Multi-société :</strong> {generator?.multisociete ? "Oui" : "Non"}
          </Typography>
        </CardContent>
      </Card>

      {/* Tickets Associés */}
      <Card variant="outlined" sx={{ marginBottom: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
            <Typography variant="h6">Tickets Associés</Typography>
            <IconButton color="primary" onClick={() => setIsTicketModalOpen(true)}>
              <PlusCircle />
            </IconButton>
          </Box>
          <Divider />
          {generator?.tickets?.length > 0 ? (
            <List>
              {generator.tickets.map((ticket) => (
                <ListItem key={ticket._id}>
                  <ListItemText primary={ticket.titre} secondary={`Statut : ${ticket.status}`} />
                  <Chip label={ticket.status} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary">Aucun ticket associé.</Typography>
          )}
        </CardContent>
      </Card>
      {/* Ajout des autres sections */}
    </Box>
  );
};

export default AdminGeneratorDetails;
