import express from 'express';
import {
  getFilliales,
  createFilliale,
  getFillialeById,
  updateFilliale,
  deleteFilliale,
} from '../controllers/fillialeController.js';

const router = express.Router();

// Route pour obtenir toutes les filiales ou en créer une nouvelle
router.route('/')
  .get(getFilliales)
  .post((req, res, next) => {
    // Vérification basique si les champs fiscaux sont présents lors de la création
    const { debutAnneeFiscale, finAnneeFiscale } = req.body;
    if (!debutAnneeFiscale || !finAnneeFiscale) {
      return res.status(400).json({ message: "Veuillez fournir le début et la fin de l'année fiscale." });
    }
    next();
  }, createFilliale);

// Route pour obtenir, mettre à jour ou supprimer une filiale par son ID
router.route('/:id')
  .get(getFillialeById)
  .put(updateFilliale)
  .delete(deleteFilliale);

export default router;
