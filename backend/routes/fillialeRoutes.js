import express from 'express';
import {
  getFilliales,
  createFilliale,
  getFillialeById,
  updateFilliale,
  deleteFilliale,
} from '../controllers/fillialeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route pour obtenir toutes les filiales ou en créer une nouvelle
router
  .route('/')
  .get(getFilliales) // Accessible publiquement
  .post(
     // Middleware pour vérifier l'utilisateur authentifié
    (req, res, next) => {
      // Vérification des champs fiscaux
      const { debutAnneeFiscale, finAnneeFiscale } = req.body;
      if (!debutAnneeFiscale || !finAnneeFiscale) {
        return res
          .status(400)
          .json({ message: "Veuillez fournir le début et la fin de l'année fiscale." });
      }
      next();
    },
    createFilliale
  );

// Route pour obtenir, mettre à jour ou supprimer une filiale par son ID
router
  .route('/:id')
  .get(getFillialeById) // Accessible publiquement
  .put(protect, updateFilliale) // Authentification requise
  .delete(protect, deleteFilliale); // Authentification requise

export default router;
