import React from "react";
import PropTypes from "prop-types";
import { Box, Modal, Typography, Button, useTheme } from "@mui/material";

const ReusableModal = ({ open, onClose, title, content, actions }) => {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: theme.palette.secondary.main,
          color: theme.palette.text.primary,
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Typography id="modal-description" sx={{ mb: 3 }}>
          {content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          {actions || (
            <Button onClick={onClose} variant="contained" color="primary">
              Close
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

ReusableModal.propTypes = {
  open: PropTypes.bool.isRequired, // Indique si la modale est ouverte
  onClose: PropTypes.func.isRequired, // Fonction de fermeture
  title: PropTypes.string, // Titre de la modale
  content: PropTypes.node, // Contenu de la modale
  actions: PropTypes.node, // Actions personnalisées pour le pied de la modale
};

export default ReusableModal;
