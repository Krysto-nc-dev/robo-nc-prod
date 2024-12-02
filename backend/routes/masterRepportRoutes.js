import express from "express";
import {
  getMasterRepports,
  createMasterRepport,
  getMasterRepportById,
  updateMasterRepport,
  deleteMasterRepport,
  addDocumentToMasterRepport,
  deleteDocumentFromMasterRepport, // Nouvelle méthode
} from "../controllers/masterRepportControleur.js";

const router = express.Router();

router.route("/")
  .get(getMasterRepports)
  .post(createMasterRepport);

router.route("/:id")
  .get(getMasterRepportById)
  .put(updateMasterRepport)
  .delete(deleteMasterRepport);

router.route("/:id/documents")
  .post(addDocumentToMasterRepport);

router.route("/:id/documents/:docId")
  .delete(deleteDocumentFromMasterRepport); // Nouvelle route

export default router;
