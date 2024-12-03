import express from "express";
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
} from "../controllers/documentController.js";
import multer from "multer";
import path from "path";

// Configuration de multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Répertoire où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Génère un nom de fichier unique
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "application/vnd.ms-excel", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non pris en charge. Seuls les PDF, Excel et CSV sont acceptés."), false);
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// Routes pour gérer les documents
router.route("/")
  .get(getDocuments) // Récupérer tous les documents
  .post(upload.single("file"), createDocument); // Créer un document (avec téléchargement de fichier)

router.route("/:id")
  .get(getDocumentById) // Récupérer un document par ID
  .put(updateDocument) // Mettre à jour un document
  .delete(deleteDocument); // Supprimer un document

router.route("/:id/download")
  .get(downloadDocument); // Télécharger un document

export default router;
