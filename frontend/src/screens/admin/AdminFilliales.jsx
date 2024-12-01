import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const AdminFilliales = () => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "16px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="text.primary" mb={1}>
          Gestion des Filiales
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cette page vous permet d'ajouter, modifier ou supprimer les
          informations relatives aux filiales de l'entreprise.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminFilliales;
