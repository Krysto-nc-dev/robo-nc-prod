import React, { useState, useEffect } from "react";
import { useGetArticlesQuery } from "../../slices/qcArticleApiSlice";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminQcArticles = () => {
  const [search, setSearch] = useState(""); // Recherche par DESIGN ou NART
  const [searchGencod, setSearchGencod] = useState(""); // Recherche par GENCOD
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0); // Page actuelle (base 0)
  const [rowsPerPage, setRowsPerPage] = useState(10); // Nombre d'articles par page

  const navigate = useNavigate();

  // Définir les paramètres de recherche en fonction des champs remplis
  const searchParams = {
    page: page + 1, // API utilise une base 1 pour les pages
    limit: rowsPerPage,
    sort,
    order,
  };

  if (searchGencod) {
    searchParams.gencod = searchGencod; // Priorité à GENCOD si rempli
  } else if (search) {
    searchParams.search = search; // Sinon recherche par DESIGN ou NART
  }

  // Requête pour récupérer les articles
  const { data, isLoading, isError, error } = useGetArticlesQuery(searchParams);

  useEffect(() => {
    if (data) {
      console.log("Données récupérées :", data);
    }
  }, [data]);

  if (isLoading) return <Typography>Chargement...</Typography>;
  if (isError) {
    console.error("Erreur lors du chargement :", error);
    return (
      <Typography>
        Une erreur est survenue lors du chargement des articles.
      </Typography>
    );
  }

  const { articles, totalItems } = data || {};

  const handleSortChange = (field) => {
    const isAsc = sort === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSort(field);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Réinitialiser à la première page lors d'une recherche
    setSearchGencod(""); // Réinitialiser la recherche GENCOD
  };

  const handleSearchGencodChange = (e) => {
    setSearchGencod(e.target.value);
    setPage(0); // Réinitialiser à la première page lors d'une recherche
    setSearch(""); // Réinitialiser la recherche DESIGN/NART
  };

  const handleDetailsClick = (id) => {
    navigate(`/admin/QC-article/${id}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Réinitialiser à la première page
  };

  return (
    <Box padding={4}>
      <div className="">
        <Typography variant="h5" fontWeight="bold" marginBottom={4}>
          Articles QC
        </Typography>

        {/* Barres de recherche */}
        <Box marginBottom={3} display="flex" gap={2}>
          <TextField
            label="Rechercher par NART ou Désignation"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            fullWidth
          />
          <TextField
            label="Rechercher par GENCOD"
            variant="outlined"
            value={searchGencod}
            onChange={handleSearchGencodChange}
            fullWidth
          />
        </Box>
      </div>

      {/* Tableau des articles */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sort === "NART"}
                  direction={sort === "NART" ? order : "asc"}
                  onClick={() => handleSortChange("NART")}
                >
                  NART
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort === "DESIGN"}
                  direction={sort === "DESIGN" ? order : "asc"}
                  onClick={() => handleSortChange("DESIGN")}
                >
                  Désignation
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort === "GENCOD"}
                  direction={sort === "GENCOD" ? order : "asc"}
                  onClick={() => handleSortChange("GENCOD")}
                >
                  GENCOD
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sort === "PVTE"}
                  direction={sort === "PVTE" ? order : "asc"}
                  onClick={() => handleSortChange("PVTE")}
                >
                  Prix Vente
                </TableSortLabel>
              </TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles?.length > 0 ? (
              articles.map((article) => (
                <TableRow
                  key={article._id}
                  hover
                  sx={{
                    backgroundColor: article.DESIGN.startsWith("**")
                      ? "rgba(255, 0, 0, 0.1)"
                      : "inherit",
                  }}
                >
                  <TableCell sx={{ py: 1 }}>{article.NART}</TableCell>
                  <TableCell sx={{ py: 1 }}>{article.DESIGN}</TableCell>
                  <TableCell sx={{ py: 1 }}>{article.GENCOD}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    {article.PVTE?.toFixed(2)} F
                  </TableCell>
                  <TableCell sx={{ py: 1 }}>{article.STOCK}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailsClick(article._id)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun article trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalItems || 0}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50]}
        labelRowsPerPage="Articles par page"
      />
    </Box>
  );
};

export default AdminQcArticles;
