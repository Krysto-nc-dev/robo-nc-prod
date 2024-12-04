import express from 'express';
import multer from 'multer'; // Middleware pour le téléchargement de fichiers
import {
    createReport,
    deleteReport,
    getReportById,
    getReports,
    updateReport,
    addDocumentToReport,
    generatePDFReport,
  } from '../controllers/reportController.js';
  
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configuration de Multer pour le téléchargement des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Répertoire où les fichiers seront sauvegardés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nom unique pour éviter les conflits
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier à 5MB
});

// Route pour obtenir tous les rapports ou en créer un nouveau
router
  .route('/')
  .get(protect, getReports) // Authentification requise pour voir la liste
  .post(protect, admin, createReport); // Authentification + rôle admin pour création

// Route pour obtenir, mettre à jour ou supprimer un rapport par ID
router
  .route('/:id')
  .get(protect, getReportById) // Authentification requise pour voir un rapport spécifique
  .put(protect, admin, updateReport) // Authentification + rôle admin pour mise à jour
  .delete(protect, admin, deleteReport); // Authentification + rôle admin pour suppression

// Route pour télécharger un document et l'ajouter au rapport
router
  .route('/:id/add-document')
  .post(protect, upload.single('file'), addDocumentToReport); // Authentification + téléchargement de fichier

// Route pour générer un PDF à partir d'un rapport
router
  .route('/:id/generate-pdf')
  .get(protect, generatePDFReport); // Authentification requise pour générer un PDF

export default router;
