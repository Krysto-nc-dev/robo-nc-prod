import express from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  addCommentToTicket,
  changeTicketStatus,
} from "../controllers/ticketController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route pour obtenir tous les tickets ou en créer un nouveau
router
  .route("/")
  .get(protect, getTickets) // Authentification requise pour lister les tickets
  .post(protect, createTicket); // Authentification requise pour créer un ticket

// Route pour obtenir, mettre à jour ou supprimer un ticket par ID
router
  .route("/:id")
  .get(protect, getTicketById) // Authentification requise pour récupérer un ticket
  .put(protect, updateTicket) // Authentification requise pour mettre à jour un ticket
  .delete(protect, deleteTicket); // Authentification requise pour supprimer un ticket

// Route pour ajouter un commentaire à un ticket
router
  .route("/:id/comments")
  .post(protect, addCommentToTicket); // Authentification requise pour ajouter un commentaire

// Route pour changer le statut d'un ticket
router
  .route("/:id/status")
  .put(protect, changeTicketStatus); // Authentification requise pour changer le statut

export default router;
