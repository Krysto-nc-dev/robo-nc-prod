import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import connectDB from "./config/db.js";
import morgan from "morgan";
import colors from "colors";
import errorHandler from "./middlewares/error.js";

// Importation des fichiers de routes
import  userRoutes from "./routes/userRoutes.js";
import zoneRoutes from "./routes/zoneRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

import filialeRoutes from "./routes/fillialeRoutes.js";

// Configuration des variables d'environnement
dotenv.config();

// Définition des variables
const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 4000;

// Obtenir le chemin absolu actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion à la base de données MongoDB
connectDB();

// Middleware pour parsing des requêtes JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des logs pour le mode développement
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Configuration des fichiers statiques
app.use("/doc", express.static(path.join(__dirname, "doc")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuration CORS
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://robot-nc.com", // Production domain
  "https://api.robot-nc.com", // Production API subdomain
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Autorise les requêtes sans origine (Postman, cURL)
      if (!allowedOrigins.includes(origin)) {
        const msg = "CORS bloqué : origine non autorisée.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
    credentials: true,
  })
);

// Middleware pour gérer les requêtes OPTIONS (pré-vol)
app.options("*", cors());

// Route principale pour servir la documentation de l'API
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "doc", "api-doc.html"));
});

// Montage des routes
app.use("/users", userRoutes);
app.use("/zones", zoneRoutes);
app.use("/agents", agentRoutes);
app.use("/inventories", inventoryRoutes);
app.use("/filiales", filialeRoutes);

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route introuvable: ${req.originalUrl}`,
  });
});

// Middleware pour gérer les erreurs globales
app.use(errorHandler);

// Lancement du serveur
app.listen(port, () => {
  console.log(
    `Serveur en cours d'exécution sur le port ${port} en mode ${
      isProduction ? "Production".red : "Développement".cyan
    }`.green.bold
  );
});
