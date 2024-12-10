import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { DataGrid } from "@mui/x-data-grid";
import { TrendingUp, BarChart2, ShoppingCart } from "lucide-react";

// Données factices pour les graphiques et tableaux
const salesData = [
  { id: "Lundi", ventes: 120 },
  { id: "Mardi", ventes: 150 },
  { id: "Mercredi", ventes: 200 },
  { id: "Jeudi", ventes: 180 },
  { id: "Vendredi", ventes: 250 },
  { id: "Samedi", ventes: 300 },
  { id: "Dimanche", ventes: 220 },
];

const monthlySalesData = [
  { id: "Jan", ventes: 1200 },
  { id: "Fév", ventes: 1500 },
  { id: "Mar", ventes: 2000 },
  { id: "Avr", ventes: 1800 },
  { id: "Mai", ventes: 2500 },
  { id: "Juin", ventes: 3000 },
  { id: "Juil", ventes: 2700 },
  { id: "Août", ventes: 3200 },
  { id: "Sept", ventes: 2800 },
  { id: "Oct", ventes: 3500 },
  { id: "Nov", ventes: 3700 },
  { id: "Déc", ventes: 4000 },
];

const bestSellingProducts = [
  { id: 342315, nom: "Produit A", ventes: 300 },
  { id: 453765, nom: "Produit B", ventes: 250 },
  { id: 453222, nom: "Produit C", ventes: 200 },
  { id: 765432, nom: "Produit D", ventes: 150 },
  { id: 545987, nom: "Produit E", ventes: 100 },
];

const suppliersByCountry = [
  { country: "France", fournisseurs: 30 },
  { country: "USA", fournisseurs: 15 },
  { country: "Allemagne", fournisseurs: 20 },
  { country: "Chine", fournisseurs: 25 },
];

const fakeKPIs = {
  dailySales: 1200,
  monthlySales: 35000,
  totalProductsSold: 5000,
};

const branches = ["Toutes", "Filiale 1", "Filiale 2", "Filiale 3"];

const AdminDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState("Toutes");

  const handleBranchChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  return (
    <Box padding={4}>
      <Typography variant="h4" fontWeight="bold" marginBottom={4}>
        Tableau de Bord - Suivi des Activités
      </Typography>

      <FormControl
        fullWidth
        sx={{ marginBottom: 3, backgroundColor: "#f5f5f5", borderRadius: 1 }}
      >
        <InputLabel id="branch-select-label">Filtrer par Filiale</InputLabel>
        <Select
          labelId="branch-select-label"
          value={selectedBranch}
          onChange={handleBranchChange}
          sx={{
            boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
            ".MuiSelect-select": {
              padding: "10px 14px",
            },
          }}
        >
          {branches.map((branch) => (
            <MenuItem key={branch} value={branch}>
              {branch}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: "#4caf50" }}>
                  <TrendingUp color="white" />
                </Avatar>
                <Box>
                  <Typography variant="body2">Ventes j-1</Typography>
                  <Typography variant="h6">
                    {fakeKPIs.dailySales} Xpf
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: "#2196f3" }}>
                  <BarChart2 color="white" />
                </Avatar>
                <Box>
                  <Typography variant="body2">Ventes Mensuelles</Typography>
                  <Typography variant="h6">
                    {fakeKPIs.monthlySales} Xpf
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ backgroundColor: "#ff9800" }}>
                  <ShoppingCart color="white" />
                </Avatar>
                <Box>
                  <Typography variant="body2">Produits Vendus</Typography>
                  <Typography variant="h6">
                    {fakeKPIs.totalProductsSold}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ventes Hebdomadaires
              </Typography>
              <Divider />
              <Box height={300}>
                <ResponsiveBar
                  data={salesData}
                  keys={["ventes"]}
                  indexBy="id"
                  margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
                  padding={0.3}
                  colors={{ scheme: "nivo" }}
                  borderRadius={2}
                  enableLabel={false}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Jours de la semaine",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Ventes (€)",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ventes Mensuelles
              </Typography>
              <Divider />
              <Box height={300}>
                <ResponsiveBar
                  data={monthlySalesData}
                  keys={["ventes"]}
                  indexBy="id"
                  margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
                  padding={0.3}
                  colors={{ scheme: "set2" }}
                  enableLabel={false}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Mois",
                    legendPosition: "middle",
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Ventes (€)",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Suppliers by Country */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fournisseurs par Pays
              </Typography>
              <Divider />
              <Box height={300}>
                <ResponsivePie
                  data={suppliersByCountry.map(({ country, fournisseurs }) => ({
                    id: country,
                    label: country,
                    value: fournisseurs,
                  }))}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  colors={{ scheme: "pastel1" }}
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

        {/* Best Selling Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meilleurs Produits
              </Typography>
              <Divider />
              <Box height={300}>
                <DataGrid
                  rows={bestSellingProducts}
                  columns={[
                    { field: "id", headerName: "NART", width: 70 },
                    { field: "nom", headerName: "Produit", flex: 1 },
                    { field: "ventes", headerName: "Ventes", width: 150 },
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
