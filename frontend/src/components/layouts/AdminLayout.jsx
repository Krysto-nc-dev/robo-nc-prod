import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Clipboard,
  Settings,
  ScanBarcode,
  Users,
  ChartColumnDecreasing,
  Package,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [rapportOpen, setRapportOpen] = useState(false); // État pour le menu déroulant "Rapports"
  const [mode, setMode] = useState("light");
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#f9f9f9",
              paper: "#ffffff",
            },
          }
        : {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }),
    },
  });

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const toggleThemeMode = () =>
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  const toggleModuleOpen = () => setModuleOpen(!moduleOpen);
  const toggleRapportOpen = () => setRapportOpen(!rapportOpen); // Fonction pour ouvrir/fermer le menu "Rapports"

  const drawerContent = (
    <Box
      sx={{
        width: 180, // Réduction de la largeur de la Sidebar
        backgroundColor: theme.palette.background.paper,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <List sx={{ padding: 0 }}>
        <ListItem
          button
          component={Link}
          to="/admin/articles"
          sx={{
            padding: "8px 12px",
            fontSize: "0.8rem",
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <ScanBarcode />
          </ListItemIcon>
          <ListItemText primary="Articles" />
        </ListItem>

        {/* Menu déroulant Rapports */}
        <ListItem
          button
          onClick={toggleRapportOpen}
          sx={{
            padding: "8px 12px",
            fontSize: "0.8rem",
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <ChartColumnDecreasing />
          </ListItemIcon>
          <ListItemText primary="Rapports" />
          {rapportOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={rapportOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/admin/rapports/access"
              sx={{
                padding: "6px 24px",
                fontSize: "0.75rem",
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ListItemText primary="Access" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/admin/rapports/master"
              sx={{
                padding: "6px 24px",
                fontSize: "0.75rem",
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ListItemText primary="Master" />
            </ListItem>
          </List>
        </Collapse>

        {/* Menu déroulant Modules */}
        <ListItem
          button
          onClick={toggleModuleOpen}
          sx={{
            padding: "8px 12px",
            fontSize: "0.8rem",
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Package />
          </ListItemIcon>
          <ListItemText primary="Modules" />
          {moduleOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={moduleOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/admin/inventories"
              sx={{
                padding: "6px 24px",
                fontSize: "0.75rem",
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Clipboard />
              </ListItemIcon>
              <ListItemText primary="Inventaires" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          component={Link}
          to="/admin/users"
          sx={{
            padding: "8px 12px",
            fontSize: "0.8rem",
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Users />
          </ListItemIcon>
          <ListItemText primary="Utilisateurs" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/admin/settings"
          sx={{
            padding: "8px 12px",
            fontSize: "0.8rem",
            "&:hover": { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderBottom: `1px solid ${theme.palette.divider}`,
            height: 56,
            justifyContent: "center",
          }}
        >
          <Toolbar
            sx={{ minHeight: 56, display: "flex", alignItems: "center" }}
          >
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, fontSize: "1rem", fontWeight: 500 }}
            >
              QC Administration
            </Typography>

            {/* Barre de recherche */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                backgroundColor: theme.palette.action.hover,
                borderRadius: "20px",
                padding: "0 10px",
                marginRight: "20px",
              }}
            >
              <SearchIcon sx={{ color: theme.palette.text.secondary }} />
              <InputBase
                placeholder="Rechercher…"
                sx={{
                  ml: 1,
                  color: "inherit",
                  fontSize: "0.875rem",
                }}
              />
            </Box>

            {/* Icône de changement de thème */}
            <IconButton
              edge="end"
              color="inherit"
              onClick={toggleThemeMode}
              sx={{ ml: 1 }}
            >
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Icône de profil utilisateur */}
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar alt="User Avatar" />
            </IconButton>

            {/* Menu déroulant du profil utilisateur */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 3 }}
            >
              <MenuItem
                component={Link}
                to="/admin/profile"
                onClick={handleMenuClose}
              >
                Profil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 180,
              boxSizing: "border-box",
            },
          }}
        >
          {isMobile && (
            <IconButton onClick={toggleDrawer} sx={{ margin: "10px" }}>
              <CloseIcon />
            </IconButton>
          )}
          {drawerContent}
        </Drawer>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 180px)` },
            ml: { sm: "180px" },
            mt: { xs: 7, sm: 0 },
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
