import express from "express";
import { getTiers, getTiersByCompte } from "../controllers/tierControlleur.js";

const router = express.Router();

// Route pour récupérer tous les comptes Tiers
router.route("/").get(getTiers);

// Route pour récupérer un compte spécifique par numéro de compte
router.route("/:compte").get(getTiersByCompte);

export default router;
