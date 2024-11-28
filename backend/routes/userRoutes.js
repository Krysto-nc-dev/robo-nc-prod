import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  
} from '../controllers/userController.js';

import { protect, admin } from '../middlewares/authMiddleware.js'; // Middleware pour la protection et les rôles

// Route pour enregistrer un utilisateur ou obtenir tous les utilisateurs (accessible uniquement par les admins)
router.route('/')
  .post(registerUser) // Route pour enregistrer un utilisateur
  .get(protect, admin, getUsers); // Route pour obtenir tous les utilisateurs (admin requis)

// Route pour authentifier un utilisateur
router.post('/login', authUser);

// Route pour déconnecter un utilisateur
router.post('/logout', logoutUser);

// Route pour mot de passe oublié


// Routes pour gérer le profil utilisateur
router
  .route('/profile')
  .get(protect, getUserProfile) // Obtenir les informations du profil utilisateur connecté
  .put(protect, updateUserProfile); // Modifier les informations du profil utilisateur connecté

// Routes pour la gestion des utilisateurs spécifiques par ID (admin requis)
router
  .route('/:id')
  .delete(protect, admin, deleteUser) // Supprimer un utilisateur (admin requis)
  .get(protect, admin, getUserById) // Obtenir les informations d'un utilisateur spécifique (admin requis)
  .put(protect, admin, updateUser); // Modifier les informations d'un utilisateur spécifique (admin requis)

export default router;
