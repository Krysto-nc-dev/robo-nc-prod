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
        backgroundColor: "#fafafa", // Couleur de fond douce
        borderRadius: "12px", // Coins légèrement arrondis
        padding: "24px", // Espacement interne
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // Ombre subtile
        border: "1px solid #e0e0e0", // Bordure légère
      }}
    >
      {/* Titre du tableau */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          marginBottom: "1.5rem",
          fontWeight: "bold",
          color: "#222",
          textAlign: "center", // Centrer le titre
          fontSize: "1.5rem",
        }}
      >
        {title || "Tableau"}
      </Typography>

      {/* Bouton pour télécharger en CSV */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleExportData}
        sx={{
          marginBottom: "1.5rem",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto", // Centrer le bouton
          backgroundColor: "#4caf50",
          ":hover": {
            backgroundColor: "#45a047",
          },
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        Télécharger CSV
      </Button>

      {/* Tableau avec Material React Table */}
      <MaterialReactTable
        columns={columns} // Colonnes sans la colonne "actions"
        data={data}
        enableSorting // Activer le tri
        enableColumnFilters // Activer les filtres par colonne
        enablePagination // Activer la pagination
        enableGlobalFilter // Activer la recherche globale
        localization={{
          toolbar: {
            searchPlaceholder: "Rechercher...",
            searchTooltip: "Rechercher",
          },
          pagination: {
            labelDisplayedRows: "{from}-{to} sur {count}",
            labelRowsPerPage: "Lignes par page",
            first: "Première",
            last: "Dernière",
            next: "Suivante",
            previous: "Précédente",
          },
          header: {
            actions: "Actions",
          },
          noData: "Aucune donnée disponible",
        }}
        initialState={{
          density: "comfortable", // Espacement confortable
          pagination: { pageSize: 10 }, // Taille de page par défaut
        }}
        muiTableProps={{
          sx: {
            tableLayout: "auto", // Ajustement automatique des colonnes
            backgroundColor: "#fff", // Couleur de fond du tableau
            borderRadius: "12px", // Coins arrondis
            overflow: "hidden",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "#f0f0f0", // Couleur d'arrière-plan de l'en-tête
            fontWeight: "bold",
            color: "#333",
            textAlign: "center", // Alignement du texte dans les en-têtes
            fontSize: "1rem",
            padding: "12px",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            color: "#555", // Couleur du texte dans le corps
            padding: "12px",
            textAlign: "center",
          },
        }}
        muiTablePaginationProps={{
          rowsPerPageOptions: [5, 10, 20], // Options de pagination
          sx: {
            ".MuiTablePagination-toolbar": {
              backgroundColor: "#f9f9f9", // Fond de la pagination
              borderTop: "1px solid #e0e0e0",
            },
          },
        }}
      />
    </Box>
  );
};

export default ReusableTable;
