module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primaryColor: '#FFC000', // Jaune vif du logo
        grayColor: '#4D4D4D', // Gris foncé pour les textes principaux
        secondaryColor: '#000000', // Noir du logo
        accentColor: '#FFFFFF', // Blanc pour contraster
        textColor: '#333333', // Gris foncé pour une bonne lisibilité
        backgroundColor: '#F9F9F9', // Gris clair neutre pour les fonds
        highlightColor: '#FFD700', // Jaune doré pour les éléments en surbrillance
        mutedColor: '#BDBDBD', // Gris moyen pour les textes secondaires
        dangerColor: '#D32F2F', // Rouge inchangé
        warningColor: '#FFA500', // Orange vif pour les avertissements
        successColor: '#4CAF50', // Vert inchangé
      },
      fontFamily: {
        sans: ['Rubik', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
};
