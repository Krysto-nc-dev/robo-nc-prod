import express from "express";
import {
  createLog,
  getLogs,
  getLogById,
  deleteLog,
  getLogAnalytics,
} from "../controllers/logController.js";

const router = express.Router();

router.route("/").get(getLogs).post(createLog); // Récupérer tous les logs et créer un log
router.route("/analytics").get(getLogAnalytics); // Analyse des logs
router.route("/:id").get(getLogById).delete(deleteLog); // Récupérer ou supprimer un log par ID

export default router;
