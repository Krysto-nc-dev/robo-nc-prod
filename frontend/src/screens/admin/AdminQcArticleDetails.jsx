import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetArticleByIdQuery } from "../../slices/qcArticleApiSlice";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import "tailwindcss/tailwind.css";

const AdminQcArticleDetails = () => {
  const { id: articleId } = useParams();
  const { data: article, error, isLoading } = useGetArticleByIdQuery(articleId);

  useEffect(() => {
    console.log("Article ID:", articleId);
    console.log("Article Data:", article);
  }, [articleId, article]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <CircularProgress />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Typography variant="h6" color="error">
          Erreur lors du chargement des détails de l'article.
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Typography
        variant="h4"
        component="h1"
        className="text-center text-gray-800 mb-6 font-bold"
      >
        Détails de l'Article
      </Typography>

      <Card className="shadow-md">
        <CardContent className="flex flex-col gap-6">
          <Box className="flex justify-between items-center">
            <Typography variant="h5" className="font-bold text-gray-800">
              {article.DESIGN} ({article.NART})
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Code barre: {article.GENCOD || "N/A"}
            </Typography>
          </Box>

          <Divider />

          <Box className="flex flex-wrap justify-between gap-4">
            <Box className="flex flex-col">
              <Typography variant="body1" className="font-semibold">
                Désignation secondaire
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {article.DESIGN2 || "N/A"}
              </Typography>
            </Box>
            <Box className="flex flex-col">
              <Typography variant="body1" className="font-semibold">
                Référence
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {article.REFER || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box className="flex flex-wrap justify-between gap-4">
            <Box className="flex flex-col">
              <Typography variant="body1" className="font-semibold">
                Fournisseur
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {article.FOURN || "N/A"}
              </Typography>
            </Box>
            <Box className="flex flex-col">
              <Typography variant="body1" className="font-semibold">
                Prix de vente
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {article.PVTE ? `${article.PVTE.toFixed(2)} XPF` : "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box className="flex flex-wrap justify-between gap-4">
            <Box className="flex flex-col">
              <Typography variant="body1" className="font-semibold">
                Stock actuel
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {article.STOCK || "N/A"}
              </Typography>
            </Box>
            <Box className="flex flex-col">
              <Typography variant="body1" className="font-semibold">
                Stock minimum
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {article.SMINI || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="body1" className="font-semibold">
              Observations
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {article.OBSERV || "Aucune observation"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQcArticleDetails;
