import express from "express";
import {
  getCommandes,
  getCommandeById,
  getCommandesByFournisseur,
  
} from "../controllers/commandeControlleur.js";

const router = express.Router();

// Routes pour les commandes

// @route   GET /api/commandes
// @desc    Obtenir toutes les commandes avec pagination et filtres
router.get("/", getCommandes);

// @route   GET /api/commandes/:id
// @desc    Obtenir une commande par ID
router.get("/:id", getCommandeById);

// @route   GET /api/commandes/fournisseur/:fournisseurId
// @desc    Obtenir toutes les commandes pour un fournisseur spécifique
router.get("/fournisseur/:fournisseurId", getCommandesByFournisseur);

export default router;
