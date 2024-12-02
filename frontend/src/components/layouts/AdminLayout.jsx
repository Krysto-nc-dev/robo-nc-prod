import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetFillialesQuery } from "../../slices/fillialesApiSlice";
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
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  Clipboard,
  Settings,
  ScanBarcode,
  Users,
  ChartColumnDecreasing,
  Database,
  Package,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rapportOpen, setRapportOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [fillialeOpen, setFillialeOpen] = useState({});
  const [mode, setMode] = useState("light");
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: filliales, isLoading: fillialesLoading } =
    useGetFillialesQuery();

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
  const toggleRapportOpen = () => setRapportOpen(!rapportOpen);
  const toggleTablesOpen = () => setTablesOpen(!tablesOpen);
  const toggleModuleOpen = () => setModuleOpen(!moduleOpen);
  const toggleFillialeOpen = (acronyme) => {
    setFillialeOpen((prevState) => ({
      ...prevState,
      [acronyme]: !prevState[acronyme],
    }));
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const toggleThemeMode = () =>
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  const drawerContent = (
    <Box
      sx={{
        width: 180,
        marginTop: "64px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontSize: "0.875rem",
      }}
    >
      <List>
        <ListItem
          button
          component={Link}
          to="/admin/articles"
          sx={{ padding: "8px 12px" }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <ScanBarcode />
          </ListItemIcon>
          <ListItemText primary="Articles" />
        </ListItem>

        {/* Rapports */}
        <ListItem
          button
          onClick={toggleRapportOpen}
          sx={{ padding: "8px 12px" }}
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
              sx={{ padding: "6px 24px" }}
            >
              <ListItemText primary="Access" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/admin/rapports/global"
              sx={{ padding: "6px 24px" }}
            >
              <ListItemText primary="Global" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/admin/rapports/master"
              sx={{ padding: "6px 24px" }}
            >
              <ListItemText primary="Master" />
            </ListItem>
          </List>
        </Collapse>

        {/* Tables */}
        <ListItem
          button
          onClick={toggleTablesOpen}
          sx={{ padding: "8px 12px" }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <Database />
          </ListItemIcon>
          <ListItemText primary="Tables" />
          {tablesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={tablesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {fillialesLoading ? (
              <ListItem>
                <ListItemText primary="Chargement..." />
              </ListItem>
            ) : (
              filliales?.map((filliale) => (
                <React.Fragment key={filliale._id}>
                  <ListItem
                    button
                    onClick={() => toggleFillialeOpen(filliale.acronyme)}
                    sx={{ padding: "6px 24px" }}
                  >
                    <ListItemText primary={`${filliale.acronyme}`} />
                    {fillialeOpen[filliale.acronyme] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItem>
                  <Collapse
                    in={fillialeOpen[filliale.acronyme]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <ListItem
                        button
                        component={Link}
                        to={`/admin/tables/${filliale.acronyme}/articles`}
                        sx={{ padding: "6px 36px" }}
                      >
                        <ListItemText primary="Articles" />
                      </ListItem>
                      <ListItem
                        button
                        component={Link}
                        to={`/admin/tables/${filliale.acronyme}/fournisseurs`}
                        sx={{ padding: "6px 36px" }}
                      >
                        <ListItemText primary="Fournisseurs" />
                      </ListItem>
                      <ListItem
                        button
                        component={Link}
                        to={`/admin/tables/${filliale.acronyme}/proformats`}
                        sx={{ padding: "6px 36px" }}
                      >
                        <ListItemText primary="Proformats" />
                      </ListItem>
                      <ListItem
                        button
                        component={Link}
                        to={`/admin/tables/${filliale.acronyme}/facturation-details`}
                        sx={{ padding: "6px 36px" }}
                      >
                        <ListItemText primary="Details" />
                      </ListItem>
                      <ListItem
                        button
                        component={Link}
                        to={`/admin/tables/${filliale.acronyme}/tiers`}
                        sx={{ padding: "6px 36px" }}
                      >
                        <ListItemText primary="Tiers" />
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              ))
            )}
          </List>
        </Collapse>

        {/* Modules */}
        <ListItem
          button
          onClick={toggleModuleOpen}
          sx={{ padding: "8px 12px" }}
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
              sx={{ padding: "6px 24px" }}
            >
              <ListItemText primary="Inventaires" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          component={Link}
          to="/admin/settings"
          sx={{ padding: "8px 12px" }}
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
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
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
            <IconButton edge="end" color="inherit" onClick={toggleThemeMode}>
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
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/admin/profile">
                Profil
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{ "& .MuiDrawer-paper": { width: 180 } }}
        >
          {drawerContent}
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: "100%",
          }}
        >
          <Toolbar />
          <div className="sm:pl-[180px]">{children}</div>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
