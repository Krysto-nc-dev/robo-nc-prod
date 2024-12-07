import React from "react";
import { useParams } from "react-router-dom";
import { useGetArticleByIdQuery } from "../../slices/qcArticleApiSlice";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import "tailwindcss/tailwind.css";

const AdminQcArticleDetails = () => {
  const { id: articleId } = useParams();
  const { data: article, error, isLoading } = useGetArticleByIdQuery(articleId);

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-center">
        <Typography variant="h6">
          Chargement des détails de l'article...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex justify-center items-center">
        <Typography variant="h6" color="error">
          Erreur lors du chargement des détails de l'article.
        </Typography>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        className="text-center text-gray-800"
      >
        Détails de l'Article
      </Typography>
      <Card className="shadow-lg max-w-3xl mx-auto">
        <CardContent>
          <Typography variant="h5" className="font-semibold mb-4">
            {article.DESIGN} ({article.NART})
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Désignation secondaire"
                secondary={article.DESIGN2 || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Code barre"
                secondary={article.GENCOD || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Référence"
                secondary={article.REFER || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Fournisseur"
                secondary={article.FOURN || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Prix de vente"
                secondary={`${article.PVTE.toFixed(2)} XPF`}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Stock actuel"
                secondary={article.STOCK || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Stock minimum"
                secondary={article.SMINI || "N/A"}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Observations"
                secondary={article.OBSERV || "Aucune observation"}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminQcArticleDetails;
