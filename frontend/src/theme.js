export const tokensDark = {
  grey: {
    100: "#f0f0f0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
  },
  primary: {
    100: "#fff9e6", // Jaune très clair
    200: "#fff3cc",
    300: "#ffee99",
    400: "#ffe566",
    500: "#ffdb33", // Jaune vif
    600: "#cca729",
    700: "#997d1f",
    800: "#665414",
    900: "#332a0a",
  },
};

export const tokensLight = {
  grey: {
    100: "#141414",
    200: "#292929",
    300: "#3d3d3d",
    400: "#525252",
    500: "#666666",
    600: "#858585",
    700: "#a3a3a3",
    800: "#c2c2c2",
    900: "#f0f0f0",
  },
  primary: {
    100: "#332a0a",
    200: "#665414",
    300: "#997d1f",
    400: "#cca729",
    500: "#ffdb33",
    600: "#ffe566",
    700: "#ffee99",
    800: "#fff3cc",
    900: "#fff9e6",
  },
};

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: tokensDark.primary[500],
              light: tokensDark.primary[400],
              dark: tokensDark.primary[600],
            },
            background: {
              default: tokensDark.grey[800],
              paper: tokensDark.grey[900],
            },
            text: {
              primary: tokensDark.grey[100],
              secondary: tokensDark.grey[300],
            },
          }
        : {
            primary: {
              main: tokensLight.primary[500],
              light: tokensLight.primary[600],
              dark: tokensLight.primary[400],
            },
            background: {
              default: tokensLight.grey[100],
              paper: tokensLight.grey[200],
            },
            text: {
              primary: tokensLight.grey[900],
              secondary: tokensLight.grey[700],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontSize: 32,
        fontWeight: 700,
      },
      h2: {
        fontSize: 28,
        fontWeight: 600,
      },
      h3: {
        fontSize: 24,
        fontWeight: 500,
      },
      body1: {
        fontSize: 16,
      },
      body2: {
        fontSize: 14,
      },
    },
  };
};
