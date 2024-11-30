import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles"; // Correction de l'import de createTheme
import { themeSettings } from "./theme.js"; // Correction de l'import de themeSettings
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css"; // Assurez-vous que ce chemin est correct
import ScrollToTop from "./components/utils/ScrollToTop";
import { CssBaseline, ThemeProvider } from "@mui/material"; // Ajout de CssBaseline pour un style de base uniforme

import { Outlet } from "react-router-dom";

const App = () => {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Assure la cohérence visuelle dans tous les navigateurs */}
      <div>
        <ScrollToTop />
        <div>
          <div>
            <Outlet />
          </div>
        </div>
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
};

export default App;
