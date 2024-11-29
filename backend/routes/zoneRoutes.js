import express from 'express';
import {
  getZones,
  createZone,
  getZoneById,
  updateZone,
  deleteZone,
  scanZonePart, // Nouvelle méthode pour scanner une étape
} from '../controllers/zoneController.js';

const router = express.Router();

// Routes principales pour les zones
router.route('/')
  .get(getZones) // Récupérer toutes les zones
  .post(createZone); // Créer une nouvelle zone

// Routes pour une zone spécifique (GET, PUT, DELETE)
router.route('/:id')
  .get(getZoneById) // Récupérer une zone par ID
  .put(updateZone)  // Mettre à jour une zone
  .delete(deleteZone); // Supprimer une zone

// Scanner une étape d'une zone spécifique
router.post('/:zoneId/scan', scanZonePart);

export default router;
