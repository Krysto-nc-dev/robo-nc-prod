import express from 'express';
import multer from 'multer';
import {
  getInventories,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  importZonesFromCSV,
  generatePDFInventory, 
} from '../controllers/inventoryController.js';

const router = express.Router();

// Configuration de multer pour gérer les fichiers CSV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Répertoire des fichiers uploadés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, uniqueSuffix); // Nom unique pour éviter les conflits
  },
});
const upload = multer({ storage });

// Routes pour les inventaires
router.route('/')
  .get(getInventories)   // Récupérer tous les inventaires
  .post(createInventory); // Créer un nouvel inventaire

// Importation des zones depuis un fichier CSV
router.post('/import-zones', upload.single('file'), importZonesFromCSV);

// Génération de PDF des zones d'un inventaire
router.get('/:id/generate-pdf', generatePDFInventory);

// Gestion des opérations sur un inventaire spécifique (ID requis)
router.route('/:id')
  .get(getInventoryById) // Récupérer un inventaire par ID
  .put(updateInventory)  // Mettre à jour un inventaire
  .delete(deleteInventory); // Supprimer un inventaire

export default router;
