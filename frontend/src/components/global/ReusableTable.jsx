import React from "react";
import { MaterialReactTable } from "material-react-table";
import { Button, Box, Typography } from "@mui/material";
import { ExportToCsv } from "export-to-csv";

const ReusableTable = ({ columns, data, title }) => {
  // Configuration pour le téléchargement CSV
  const csvOptions = {
    filename: `${title || "data"}.csv`,
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: false,
    title: title || "Data Export",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true, // Utilisez les clés comme en-têtes
  };
  const csvExporter = new ExportToCsv(csvOptions);

  // Fonction pour exporter les données au format CSV
  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5", // Couleur de fond légère
        borderRadius: "8px", // Coins arrondis
        padding: "16px", // Espacement interne
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Ombre
      }}
    >
      {/* Titre du tableau */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          marginBottom: "1rem",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center", // Centrer le titre
        }}
      >
        {title || "Tableau"}
      </Typography>

      {/* Bouton pour télécharger en CSV */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleExportData}
        sx={{
          marginBottom: "1rem",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto", // Centrer le bouton
        }}
      >
        Télécharger CSV
      </Button>

      {/* Tableau avec Material React Table */}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting // Activer le tri
        enableColumnFilters // Activer les filtres par colonne
        enablePagination // Activer la pagination
        enableRowSelection // Permettre la sélection des lignes
        enableGlobalFilter // Activer la recherche globale
        initialState={{
          density: "comfortable", // Espacement confortable
          pagination: { pageSize: 10 }, // Taille de page par défaut
        }}
        muiTableProps={{
          sx: {
            tableLayout: "auto", // Ajustement automatique des colonnes
            backgroundColor: "#fff", // Couleur de fond du tableau
            borderRadius: "8px", // Coins arrondis
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#e0e0e0", // Couleur d'arrière-plan de l'en-tête
            fontWeight: "bold",
            color: "#333",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            color: "#555", // Couleur du texte dans le corps
          },
        }}
        muiTablePaginationProps={{
          rowsPerPageOptions: [5, 10, 20], // Options de pagination
        }}
      />
    </Box>
  );
};

export default ReusableTable;
