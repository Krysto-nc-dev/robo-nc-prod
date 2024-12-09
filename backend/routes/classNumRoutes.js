import express from "express";
import { getClassnums, getClassnumByClassnum } from "../controllers/classNumControlleur.js";

const router = express.Router();

// Route pour récupérer tous les classnums
router.route("/").get(getClassnums);

// Route pour récupérer un classnum spécifique par CLASSNUM
router.route("/:classnum").get(getClassnumByClassnum);

export default router;