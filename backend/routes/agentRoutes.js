import express from 'express';
import {
  getAgents,
  createAgent,
  getAgentById,
  updateAgent,
  deleteAgent,
} from '../controllers/agentController.js';

const router = express.Router();

// Routes principales
router.route('/')
  .get(getAgents) // Récupérer tous les agents
  .post(createAgent); // Créer un nouvel agent

// Routes pour un agent spécifique
router.route('/:id')
  .get(getAgentById) // Récupérer un agent par ID
  .put(updateAgent)  // Mettre à jour un agent
  .delete(deleteAgent); // Supprimer un agent

export default router;
