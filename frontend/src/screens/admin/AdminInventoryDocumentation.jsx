import React from "react";
import { Box, Typography } from "@mui/material";

const AdminInventoryDocumentation = () => {
  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="text.primary" mb={2}>
        Documentation Utilisateur - Gestion des Inventaires
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Retrouvez ici toutes les informations nécessaires pour utiliser la
        plateforme de gestion des inventaires. Ce guide couvre la création,
        modification, exportation, gestion des zones et les nouvelles
        fonctionnalités avancées.
      </Typography>

      {/* Section Introduction */}
      <Box mb={8}>
        <Typography variant="h6" fontWeight="bold" color="success.main" mb={2}>
          Introduction
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bienvenue dans la documentation utilisateur de ROBOT-NC. Ce guide vous
          accompagne dans l’utilisation de la plateforme pour une gestion
          optimale des inventaires. Prenez en main rapidement les
          fonctionnalités essentielles et avancées.
        </Typography>
      </Box>

      {/* Fonctionnalité : Recherche Avancée */}
      <Box mb={8} display="flex" gap={2}>
        <Box flex={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            mb={2}
          >
            1. Recherche Avancée
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Utilisez la recherche avancée pour filtrer vos inventaires selon des
            critères spécifiques.
          </Typography>
          <ol>
            <li>
              <Typography variant="body2" color="text.secondary">
                Cliquez sur l’icône{" "}
                <strong style={{ color: "#1976d2" }}>
                  "Recherche Avancée"
                </strong>{" "}
                dans la barre supérieure.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Sélectionnez vos critères : nom, statut, date, etc.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Cliquez sur{" "}
                <strong style={{ color: "#1976d2" }}>"Rechercher"</strong>.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Les résultats apparaîtront sous forme de tableau interactif.
              </Typography>
            </li>
          </ol>
        </Box>
        <Box flex={1} display="flex" justifyContent="center">
          <img
            src="https://via.placeholder.com/300x200?text=Recherche+Avancée"
            alt="Exemple de Recherche Avancée"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      </Box>

      {/* Fonctionnalité : Notifications Automatisées */}
      <Box mb={8} display="flex" gap={2}>
        <Box flex={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            mb={2}
          >
            2. Notifications Automatisées
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Recevez des notifications pour des tâches importantes ou des rappels
            liés à vos inventaires.
          </Typography>
          <ul>
            <li>
              <Typography variant="body2" color="text.secondary">
                Activez les notifications dans les paramètres utilisateur.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Configurez les types de rappels :{" "}
                <em>fin d’inventaire, validation en attente, etc.</em>
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Les notifications apparaîtront sous forme de pop-ups ou
                d’emails.
              </Typography>
            </li>
          </ul>
        </Box>
        <Box flex={1} display="flex" justifyContent="center">
          <img
            src="https://via.placeholder.com/300x200?text=Notifications"
            alt="Exemple de Notifications"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      </Box>

      {/* Fonctionnalité : Visualisation Graphique */}
      <Box mb={8} display="flex" gap={2}>
        <Box flex={2}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            mb={2}
          >
            3. Visualisation Graphique des Inventaires
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Visualisez vos données d’inventaires sous forme de graphiques
            interactifs.
          </Typography>
          <ol>
            <li>
              <Typography variant="body2" color="text.secondary">
                Accédez à l'onglet{" "}
                <strong style={{ color: "#1976d2" }}>"Graphiques"</strong>.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Sélectionnez le type de graphique :{" "}
                <em>barres, camembert, chronologique</em>.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Personnalisez les filtres (par date, statut, zones).
              </Typography>
            </li>
            <li>
              <Typography variant="body2" color="text.secondary">
                Les graphiques sont exportables en PDF ou PNG.
              </Typography>
            </li>
          </ol>
        </Box>
        <Box flex={1} display="flex" justifyContent="center">
          <img
            src="https://via.placeholder.com/300x200?text=Graphiques"
            alt="Exemple de Graphiques"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      </Box>

      <Box mt={4} textAlign="center" fontSize="12px" color="text.secondary">
        Cette documentation est destinée à un usage interne. Pour toute
        assistance, contactez l'équipe technique.
      </Box>
    </Box>
  );
};

export default AdminInventoryDocumentation;
