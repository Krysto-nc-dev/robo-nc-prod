import express from "express";
import { getFournisseurs, getFournisseurById } from "../controllers/fournisseurControlleur.js";

const router = express.Router();

router.route("/").get(getFournisseurs);
router.route("/:id").get(getFournisseurById);

export default router;
