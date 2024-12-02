import express from 'express';
import multer from 'multer';
import {
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  importArticlesFromCSV,
} from '../controllers/articleController.js';

const router = express.Router();

// Configuration de Multer pour gérer les fichiers CSV
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

// Routes principales pour les articles
router.route('/')
  .get(getArticles)    // Récupérer tous les articles
  .post(createArticle); // Créer un nouvel article

// Route pour l'importation des articles depuis un fichier CSV
router.post('/import', upload.single('file'), importArticlesFromCSV);

// Routes pour un article spécifique identifié par son ID
router.route('/:id')
  .get(getArticleById) // Récupérer un article par ID
  .put(updateArticle)  // Mettre à jour un article
  .delete(deleteArticle); // Supprimer un article

export default router;
