import express from "express";
import {
  getFactures,
  getFactureByNumfact,
} from "../controllers/factureControlleur.js";

const router = express.Router();

// Route pour obtenir toutes les factures
router.route("/").get(getFactures);

// Route pour obtenir une facture par son NUMFACT
router.route("/:numfact").get(getFactureByNumfact);

export default router;
