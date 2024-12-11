import express from "express";
import {
  getFactureDetails,
  getFactureDetailsByNumfact,
  exportFactureDetailsByNumfactToExcel,
  exportFactureDetailsByDateToExcel,
} from "../controllers/factureDetailsControlleur.js";

const router = express.Router();

router.get("/", getFactureDetails); // Obtenir tous les détails des factures avec pagination et filtres
router.get("/:numfact", getFactureDetailsByNumfact); // Obtenir les détails d'une facture par NUMFACT
router.get("/export/:numfact", exportFactureDetailsByNumfactToExcel); // Exporter les détails d'une facture en Excel
router.get("/export/date/:date", exportFactureDetailsByDateToExcel); // Exporter les détails des factures d'une date en Excel

export default router;
