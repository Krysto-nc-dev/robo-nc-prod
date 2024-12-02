import express from 'express';
import {
  getAccessApps,
  createAccessApp,
  getAccessAppById,
  updateAccessApp,
  deleteAccessApp,
} from '../controllers/accessAppController.js';

const router = express.Router();

// Routes principales pour les AccessApps
router.route('/')
  .get(getAccessApps) // Récupérer toutes les applications
  .post(createAccessApp); // Créer une nouvelle application

// Routes pour une AccessApp spécifique
router.route('/:id')
  .get(getAccessAppById) // Récupérer une application par ID
  .put(updateAccessApp)  // Mettre à jour une application
  .delete(deleteAccessApp); // Supprimer une application

export default router;
