import express from "express";
import {
  getFactures,
  getFactureByNumfact,
  getFacturesByDate,
  exportFacturesToExcel,
} from "../controllers/factureControlleur.js";

const router = express.Router();

router.get("/", getFactures); // Obtenir toutes les factures avec pagination et filtres
router.get("/date", getFacturesByDate); // Obtenir les factures par date
router.get("/export", exportFacturesToExcel); // Exporter les factures par date vers Excel
router.get("/:numfact", getFactureByNumfact); // Obtenir une facture par NUMFACT

export default router;
