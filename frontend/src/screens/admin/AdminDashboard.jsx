import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ResponsivePie } from "@nivo/pie";
import { Trophy, ClipboardList, Ticket } from "lucide-react";

// Données factices
const fakeKPIs = {
  totalRapports: 45,
  totalTickets: 200,
};

const fakeReports = [
  { id: 1, nom: "Rapport des ventes", tickets: 30 },
  { id: 2, nom: "Rapport des stocks", tickets: 25 },
  { id: 3, nom: "Rapport financier", tickets: 20 },
  { id: 4, nom: "Rapport des achats", tickets: 15 },
  { id: 5, nom: "Rapport de performance", tickets: 10 },
];

const fakeLogs = [
  {
    id: 1,
    action: "Création",
    utilisateur: "Admin",
    catégorie: "Rapport",
    résultat: "Succès",
    date: "2024-12-03 10:00",
  },
  {
    id: 2,
    action: "Suppression",
    utilisateur: "Utilisateur 1",
    catégorie: "Ticket",
    résultat: "Échec",
    date: "2024-12-03 09:45",
  },
  {
    id: 3,
    action: "Modification",
    utilisateur: "Admin",
    catégorie: "Générateur",
    résultat: "Succès",
    date: "2024-12-03 09:30",
  },
  {
    id: 4,
    action: "Lecture",
    utilisateur: "Utilisateur 2",
    catégorie: "Document",
    résultat: "Succès",
    date: "2024-12-03 08:50",
  },
];

const fakePieData = [
  { id: "Tickets Résolus", value: 120, label: "Résolus" },
  { id: "Tickets En cours", value: 50, label: "En cours" },
  { id: "Tickets Ouverts", value: 30, label: "Ouverts" },
];

const AdminDashboard = () => {
  return (
    <Box padding={4}>
      <Typography variant="h4" fontWeight="bold" marginBottom={4}>
        Tableau de Bord Administrateur
      </Typography>

      <Grid container spacing={3}>
        {/* KPIs */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: "#2e7d32" }}>
                  <ClipboardList color="white" />
                </Avatar>
                <Box>
                  <Typography variant="h6">Rapports Générés</Typography>
                  <Typography variant="h4">{fakeKPIs.totalRapports}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: "#d32f2f" }}>
                  <Ticket color="white" />
                </Avatar>
                <Box>
                  <Typography variant="h6">Tickets Total</Typography>
                  <Typography variant="h4">{fakeKPIs.totalTickets}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: "#1976d2" }}>
                  <Trophy color="white" />
                </Avatar>
                <Box>
                  <Typography variant="h6">Top Rapport</Typography>
                  <Typography variant="h5">
                    {fakeReports[0]?.nom} ({fakeReports[0]?.tickets} tickets)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique circulaire */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition des Tickets
              </Typography>
              <Divider />
              <Box height={300}>
                <ResponsivePie
                  data={fakePieData}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tableau des rapports avec le plus de tickets */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rapports avec le plus de Tickets
              </Typography>
              <Divider />
              <Box height={300}>
                <DataGrid
                  rows={fakeReports}
                  columns={[
                    { field: "id", headerName: "ID", width: 70 },
                    { field: "nom", headerName: "Nom du Rapport", flex: 1 },
                    {
                      field: "tickets",
                      headerName: "Nombre de Tickets",
                      width: 150,
                    },
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tableau des logs */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Derniers Logs
              </Typography>
              <Divider />
              <Box height={400}>
                <DataGrid
                  rows={fakeLogs}
                  columns={[
                    { field: "id", headerName: "ID", width: 70 },
                    { field: "action", headerName: "Action", flex: 1 },
                    {
                      field: "utilisateur",
                      headerName: "Utilisateur",
                      width: 150,
                    },
                    { field: "catégorie", headerName: "Catégorie", width: 150 },
                    { field: "résultat", headerName: "Résultat", width: 100 },
                    { field: "date", headerName: "Date", width: 200 },
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
