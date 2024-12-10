import express from "express";
import {
  getModules,
  createModule,
  getModuleById,
  updateModule,
  deleteModule,
  activateModule,
  deactivateModule,
  downloadModule,
} from "../controllers/moduleController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour obtenir tous les modules ou en créer un nouveau
router
  .route("/")
  .get(getModules) // Accessible publiquement
  .post(protect, createModule); // Authentification requise pour la création

// Route pour obtenir, mettre à jour ou supprimer un module par son ID
router
  .route("/:id")
  .get(getModuleById) // Accessible publiquement
  .put(protect, updateModule) // Authentification requise pour la mise à jour
  .delete(protect, deleteModule); // Authentification requise pour la suppression

// Route pour activer un module
router
  .route("/:id/activate")
  .patch(protect, activateModule); // Authentification requise pour l'activation

// Route pour désactiver un module
router
  .route("/:id/deactivate")
  .patch(protect, deactivateModule); // Authentification requise pour la désactivation

// Route pour télécharger un module
router
  .route("/:id/download")
  .get(downloadModule); // Accessible publiquement

export default router;
