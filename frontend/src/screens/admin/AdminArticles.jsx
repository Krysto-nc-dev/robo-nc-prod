import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

const AdminArticles = () => {
  const inputRef = useRef();

  useEffect(() => {
    // Donne le focus au champ d'entrée au chargement du composant
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const articles = [
    { id: 1, name: "Article 1", description: "Description 1", price: "100" },
    { id: 2, name: "Article 2", description: "Description 2", price: "200" },
    { id: 3, name: "Article 3", description: "Description 3", price: "300" },
  ];

  const downloadCSV = () => {
    const headers = ["ID", "Nom", "Description", "Prix"];
    const rows = articles.map((article) => [
      article.id,
      article.name,
      article.description,
      article.price,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "articles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="text.primary" mb={2}>
        Articles
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Cette section vous permet de gérer les articles. Vous pouvez rechercher,
        ajouter, modifier ou supprimer des articles, et télécharger la liste au
        format CSV.
      </Typography>

      {/* Champ de recherche avec focus */}
      <Box mb={4}>
        <TextField
          inputRef={inputRef}
          label="Rechercher un article"
          variant="outlined"
          fullWidth
        />
      </Box>

      {/* Tableau des articles */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Prix</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.id}</TableCell>
                <TableCell>{article.name}</TableCell>
                <TableCell>{article.description}</TableCell>
                <TableCell>{article.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Bouton pour télécharger le CSV */}
      <Box mt={4} textAlign="right">
        <Button variant="contained" color="primary" onClick={downloadCSV}>
          Télécharger en CSV
        </Button>
      </Box>
    </Box>
  );
};

export default AdminArticles;
