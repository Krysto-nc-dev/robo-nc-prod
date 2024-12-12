import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetArticleByIdQuery } from "../../slices/qcArticleApiSlice";
import { useGetFournisseurByIdQuery } from "../../slices/qcFournisseurApiSlice";
import { useGetArticlesByFournisseurQuery } from "../../slices/qcArticleApiSlice";
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
  Chip,
  Tooltip,
} from "@mui/material";
import Barcode from "react-barcode";
import "tailwindcss/tailwind.css";

const AdminQcArticleDetails = () => {
  const { id: articleId } = useParams();

  // Fetch article details
  const {
    data: article,
    error: articleError,
    isLoading: articleLoading,
  } = useGetArticleByIdQuery(articleId);

  const fournisseurId = article?.FOURN || null;

  // Fetch fournisseur details
  const {
    data: fournisseur,
    isLoading: fournisseurLoading,
    error: fournisseurError,
  } = useGetFournisseurByIdQuery(fournisseurId, { skip: !fournisseurId });

  // Fetch all articles of the fournisseur
  const {
    data: articlesByFournisseur,
    isLoading: articlesLoading,
    error: articlesError,
  } = useGetArticlesByFournisseurQuery(fournisseurId, { skip: !fournisseurId });

  if (articleLoading || fournisseurLoading || articlesLoading) {
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

  if (fournisseurError || articlesError) {
    console.error(
      "Erreur lors du chargement des données associées :",
      fournisseurError || articlesError
    );
  }

  const isDeprecated = article.DESIGN.startsWith("**");
  const fournisseurName = fournisseur?.NOM || "N/A";

  // Calculer les statistiques des articles
  const totalArticles = articlesByFournisseur?.length || 0;
  const deprecatedArticles = articlesByFournisseur?.filter((a) =>
    a.DESIGN.startsWith("**")
  ).length;
  const activeArticles = totalArticles - deprecatedArticles;
  const depreciationRate =
    totalArticles > 0
      ? ((deprecatedArticles / totalArticles) * 100).toFixed(2)
      : 0;

  return (
    <div
      className={`p-6 min-h-screen relative ${
        isDeprecated ? "bg-red-50" : "bg-gray-100"
      }`}
    >
      {/* Détails de l'article en question */}
      <Card className="shadow-md w-full mb-8">
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
                  <Typography variant="h6" className="font-bold text-gray-800">
                    {article.DESIGN}
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
                    Prix de revient
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {article.PREV ? `${article.PREV.toFixed(2)} XPF` : "N/A"}
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
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistiques des articles */}
      <div className="mb-8">
        <Typography variant="h5" className="font-bold text-gray-800">
          Articles du fournisseur
        </Typography>
        <div className="flex items-center space-x-4 mt-2">
          <Chip label={`Total : ${totalArticles}`} color="primary" />
          <Chip label={`Actifs : ${activeArticles}`} color="success" />
          <Chip label={`Dépréciés : ${deprecatedArticles}`} color="error" />
          <Chip
            label={`Dépréciation : ${depreciationRate}%`}
            color="secondary"
          />
        </div>
      </div>

      {/* Liste des articles du fournisseur */}
      <div className="mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {articlesByFournisseur.map((article) => (
            <Link
              key={article.NART}
              to={`/admin/QC-article/${article._id}`}
              className={`block shadow-md rounded-lg p-4 transition-shadow ${
                article.DESIGN.startsWith("**")
                  ? "bg-red-100 hover:shadow-lg"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="flex flex-col items-center">
                <Avatar
                  src={article.IMAGE || "https://via.placeholder.com/100"}
                  alt="Produit"
                  variant="rounded"
                  sx={{ width: 64, height: 64 }}
                />
                <Typography
                  variant="body2"
                  className={`mt-2 font-semibold text-center ${
                    article.DESIGN.startsWith("**")
                      ? "text-red-600"
                      : "text-gray-800"
                  }`}
                >
                  {article.DESIGN}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-sm text-center text-gray-600"
                >
                  NART : {article.NART}
                </Typography>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminQcArticleDetails;
