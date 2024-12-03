import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider, useSelector } from "react-redux"; // Correction de l'import de useSelector
import store from "./store";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";
import { useMemo } from "react";

import App from "./App";
import NotFound from "./screens/NotFound";
import PrivateRoutes from "./components/utils/PrivateRoutes";
import AdminRoutes from "./components/utils/AdminRoutes";
import UserRoutes from "./components/utils/UserRoutes";
import Login from "./screens/Login";
import About from "./screens/About";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminInventories from "./screens/admin/AdminInventories";
import AdminInventoryDetails from "./screens/admin/AdminInventoryDetails";
import AdminZoneDetails from "./screens/admin/AdminZoneDetails";
import AdminInventoriesSuivie from "./screens/admin/AdminInventoriesSuivie";
import AdminInventoryDocumentation from "./screens/admin/AdminInventoryDocumentation";
import AdminUsers from "./screens/admin/AdminUsers";
import AdminUserDetails from "./screens/admin/AdminUserDetails";
import AdminSettings from "./screens/admin/AdminSettings";

import AdminFilliales from "./screens/admin/AdminFilliales";
import AdminProfileScreen from "./screens/admin/AdminProfileScreen.jsx";

import AdminfillialeDetails from "./screens/admin/AdminfillialeDetails.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Login />} />
      <Route path="a-propos" element={<About />} />
      <Route path="private" element={<PrivateRoutes />}>
        <Route path="dashboard" element={<h2>Private Dashboard</h2>} />
      </Route>
      <Route path="admin" element={<AdminRoutes />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="inventories" element={<AdminInventories />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="filliales" element={<AdminFilliales />} />
        <Route path="filliales/:id" element={<AdminfillialeDetails/>} />

        <Route path="users/:id" element={<AdminUserDetails />} />
        <Route path="inventories/documentation" element={<AdminInventoryDocumentation />} />
        <Route path="inventories/:id" element={<AdminInventoryDetails />} />
        <Route path="inventories-suivie/:id" element={<AdminInventoriesSuivie />} />
        <Route path="zones/:id" element={<AdminZoneDetails />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="profile" element={<AdminProfileScreen />} />
      </Route>
      <Route path="user" element={<UserRoutes />}>
        <Route path="profile" element={<h2>User Profile</h2>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const AppWrapper = () => {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </React.StrictMode>
);
