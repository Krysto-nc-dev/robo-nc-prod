import express from "express";
import {
  getFactureDetails,
  getFactureDetailsByNumfact,
  getFactureDetailsByNart,
} from "../controllers/factureDetailsControlleur.js";

const router = express.Router();

// Route pour obtenir tous les détails de factures
router.route("/").get(getFactureDetails);

// Route pour obtenir les détails d'une facture par son NUMFACT
router.route("/:numfact").get(getFactureDetailsByNumfact);

// Route pour obtenir les détails d'une facture par le code article (NART)
router.route("/article/:nart").get(getFactureDetailsByNart);

export default router;
