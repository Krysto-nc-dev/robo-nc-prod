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
  useTheme,
  useMediaQuery,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
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
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === "light"
        ? {
            background: {
              default: "#ffffff",
              paper: "#f7f7f7",
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem button component={Link} to="/admin/articles">
          <ListItemIcon>
            <ScanBarcode />
          </ListItemIcon>
          <ListItemText primary="Articles" />
        </ListItem>
        <ListItem button component={Link} to="/admin/rapports">
          <ListItemIcon>
            <ChartColumnDecreasing />
          </ListItemIcon>
          <ListItemText primary="Rapports" />
        </ListItem>
        <ListItem button component={Link} to="/admin/inventories">
          <ListItemIcon>
            <Clipboard />
          </ListItemIcon>
          <ListItemText primary="Inventaires" />
        </ListItem>
        <ListItem button component={Link} to="/admin/users">
          <ListItemIcon>
            <Users />
          </ListItemIcon>
          <ListItemText primary="Utilisateurs" />
        </ListItem>
        <ListItem button component={Link} to="/admin/settings">
          <ListItemIcon>
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
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          <Toolbar>
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

            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              QC Administration
            </Typography>

            {/* Barre de recherche */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: theme.shape.borderRadius,
                padding: "0 10px",
                marginRight: "20px",
              }}
            >
              <SearchIcon />
              <InputBase
                placeholder="Rechercher…"
                sx={{ ml: 1, color: "inherit" }}
              />
            </Box>

            {/* Icône de profil utilisateur */}
            <IconButton
              edge="end"
              color="inherit"
              onClick={toggleThemeMode}
              sx={{ ml: 1 }}
            >
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

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
              width: 250,
              boxSizing: "border-box",
              overflow: "hidden",
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
            width: { sm: `calc(100% - 250px)` },
            ml: { sm: "250px" },
            mt: { xs: 8, sm: 0 },
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
