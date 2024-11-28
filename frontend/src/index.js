import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

import App from "./App";
import NotFound from "./screens/NotFound";
import PrivateRoutes from "./components/utils/PrivateRoutes";
import AdminRoutes from "./components/utils/AdminRoutes";
import UserRoutes from "./components/utils/UserRoutes";
import Login from "./screens/Login";
import About from "./screens/About";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminInventories from "./screens/admin/AdminInventories";
import AdminInventoryDetails from "./screens/admin/AdminInventoryDetails"; // Import du composant des détails d'inventaire
import AdminZoneDetails from "./screens/admin/AdminZoneDetails";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Page d'accueil */}
      <Route index element={<Login />} />

      {/* Page de connexion */}
      <Route path="a-propos" element={<About />} />

      {/* Private Routes */}
      <Route path="private" element={<PrivateRoutes />}>
        {/* Exemple de route privée */}
        <Route path="dashboard" element={<h2>Private Dashboard</h2>} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminRoutes />}>
        {/* Exemple de route admin */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="inventories" element={<AdminInventories />} />
        <Route path="inventories/documentation" element={<AdminInventories />} />
        <Route path="inventories/:id" element={<AdminInventoryDetails />} /> {/* Route pour les détails d'un inventaire */}
        <Route path="zones/:id" element={<AdminZoneDetails/>} /> {/* Route pour les détails d'un inventaire */}
      </Route>

      {/* User Routes */}
      <Route path="user" element={<UserRoutes />}>
        {/* Exemple de route utilisateur */}
        <Route path="profile" element={<h2>User Profile</h2>} />
      </Route>

      {/* Route générique pour gérer toutes les autres routes non définies */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
