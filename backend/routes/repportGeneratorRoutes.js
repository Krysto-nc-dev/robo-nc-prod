import express from 'express';
import { 
  createRepportGenerator, 
  deleteRepportGenerator, 
  getRepportGeneratorById, 
  getRepportGenerators, 
  updateRepportGenerator,
  uploadDocumentToReport, 
  generatePDFReport
} from '../controllers/repportGeneratorController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour obtenir tous les rapports générés ou en créer un nouveau
router
  .route('/')
  .get(getRepportGenerators) // Accessible publiquement
  .post(
    // Middleware pour vérifier les champs nécessaires lors de la création d'un rapport
    (req, res, next) => {
      const { nom, type } = req.body;
      if (!nom || !type) {
        return res.status(400).json({ message: "Veuillez fournir le nom et le type du rapport." });
      }
      next();
    },
    createRepportGenerator
  );

// Route pour obtenir, mettre à jour ou supprimer un rapport généré par son ID
router
  .route('/:id')
  .get(getRepportGeneratorById) // Accessible publiquement
  .put(protect, updateRepportGenerator) // Authentification requise
  .delete(protect, deleteRepportGenerator); // Authentification requise

// Route pour télécharger un document et l'ajouter au rapport
router
  .route('/:id/upload-document')
  .post( uploadDocumentToReport); // Authentification requise

// Route pour générer un PDF à partir d'un rapport
router
  .route('/:id/generate-pdf')
  .get(generatePDFReport); // Accessible publiquement

export default router;
