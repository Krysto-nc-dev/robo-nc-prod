import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetArticleByIdQuery } from "../../slices/qcArticleApiSlice";
import { useGetFournisseurByIdQuery } from "../../slices/qcFournisseurApiSlice";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Avatar,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import Barcode from "react-barcode";
import "tailwindcss/tailwind.css";

const AdminQcArticleDetails = () => {
  const { id: articleId } = useParams();
  const {
    data: article,
    error: articleError,
    isLoading: articleLoading,
  } = useGetArticleByIdQuery(articleId);
  const fournisseurId = article?.FOURN || null;
  const {
    data: fournisseur,
    isLoading: fournisseurLoading,
    error: fournisseurError,
  } = useGetFournisseurByIdQuery(fournisseurId, { skip: !fournisseurId });

  if (articleLoading || fournisseurLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Typography variant="h6" color="error">
          Erreur lors du chargement des détails de l'article.
        </Typography>
      </div>
    );
  }

  if (fournisseurError) {
    console.error(
      "Erreur lors du chargement du fournisseur:",
      fournisseurError
    );
  }

  const isDeprecated = article.DESIGN.startsWith("**");
  const fournisseurName = fournisseur?.NOM || "N/A";

  return (
    <div
      className={`p-6 min-h-screen ${
        isDeprecated ? "bg-red-50" : "bg-gray-100"
      }`}
    >
      <Typography
        variant="h4"
        component="h1"
        className="text-center text-gray-800 mb-6 font-bold"
      >
        Fiche Produit
      </Typography>

      <Card className="shadow-md">
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} className="p-4">
                <Avatar
                  src={article.IMAGE || "https://via.placeholder.com/150"}
                  alt="Produit"
                  variant="rounded"
                  sx={{ width: "100%", height: "auto" }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box className="flex justify-between items-center mb-4">
                <Box>
                  <Typography variant="h5" className="font-bold text-gray-800">
                    {article.DESIGN} ({article.NART})
                  </Typography>
                  {isDeprecated && (
                    <Tooltip title="Cet article est déprécié">
                      <Chip
                        label="Déprécié"
                        color="warning"
                        size="small"
                        className="mt-2"
                      />
                    </Tooltip>
                  )}
                </Box>
                <Box>
                  {article.GENCOD && (
                    <Barcode
                      value={article.GENCOD}
                      format="CODE128"
                      displayValue
                      height={50}
                    />
                  )}
                </Box>
              </Box>

              <Divider className="mb-4" />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1" className="font-semibold">
                    Désignation secondaire
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {article.DESIGN2 || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="font-semibold">
                    Référence
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {article.REFER || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="font-semibold">
                    Fournisseur
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {fournisseurName}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="font-semibold">
                    Prix prévu
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {article.PREV ? `${article.PREV.toFixed(2)} XPF` : "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="font-semibold">
                    Quantité 2
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {article.QT2 || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="font-semibold">
                    Stock actuel
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {article.STOCK || "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body1" className="font-semibold">
                    Stock minimum
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {article.SMINI || "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider className="my-4" />

              <Box>
                <Typography variant="body1" className="font-semibold">
                  Observations
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {article.OBSERV || "Aucune observation"}
                </Typography>
              </Box>

              <Box className="mt-4 flex justify-end">
                <Button variant="contained" color="primary">
                  Modifier
                </Button>
                <Button variant="outlined" color="secondary" className="ml-2">
                  Supprimer
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQcArticleDetails;
