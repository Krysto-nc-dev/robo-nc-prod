import asyncHandler from "../middlewares/async.js";
import Ticket from "../models/ticketModel.js";

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Public
const getTickets = asyncHandler(async (req, res) => {
  const { status, priorite, assignedTo, createdBy, parentModel, parentId } = req.query;

  // Filtre dynamique basé sur les paramètres de requête
  const filter = {};
  if (status) filter.status = status;
  if (priorite) filter.priorite = priorite;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (createdBy) filter.createdBy = createdBy;
  if (parentModel) filter.parentModel = parentModel;
  if (parentId) filter.parentId = parentId;

  const tickets = await Ticket.find(filter)
    .populate("createdBy", "name email") // Inclure le créateur avec son nom et email
    .populate("assignedTo", "name email"); // Inclure l'utilisateur assigné avec son nom et email

  res.status(200).json(tickets);
});

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Public
const createTicket = asyncHandler(async (req, res) => {
  const { titre, description, priorite, assignedTo, parentModel, parentId } = req.body;

  // Validation des champs obligatoires
  if (!titre || !description) {
    res.status(400);
    throw new Error("Veuillez fournir un titre et une description pour le ticket.");
  }

  const ticket = new Ticket({
    titre,
    description,
    priorite,
    assignedTo,
    createdBy: req.user?._id || null, // Utilisateur connecté
    parentModel,
    parentId,
  });

  const createdTicket = await ticket.save();
  res.status(201).json(createdTicket);
});

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Public
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("createdBy", "name email") // Inclure le créateur avec son nom et email
    .populate("assignedTo", "name email"); // Inclure l'utilisateur assigné avec son nom et email

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket introuvable.");
  }

  res.status(200).json(ticket);
});

// @desc    Update a ticket
// @route   PUT /api/tickets/:id
// @access  Public
const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedTicket = await Ticket.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!updatedTicket) {
    res.status(404);
    throw new Error("Ticket introuvable.");
  }

  res.status(200).json(updatedTicket);
});

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
// @access  Public
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket introuvable.");
  }

  await ticket.deleteOne();
  res.status(200).json({ message: "Ticket supprimé avec succès." });
});

// @desc    Add a comment to a ticket
// @route   POST /api/tickets/:id/comments
// @access  Public
const addCommentToTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { texte } = req.body;

  if (!texte) {
    res.status(400);
    throw new Error("Veuillez fournir un texte pour le commentaire.");
  }

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket introuvable.");
  }

  const commentaire = {
    utilisateur: req.user?._id || null, // Utilisateur connecté
    texte,
  };

  ticket.commentaires.push(commentaire);
  await ticket.save();

  res.status(201).json({ message: "Commentaire ajouté avec succès.", ticket });
});

// @desc    Change the status of a ticket
// @route   PUT /api/tickets/:id/status
// @access  Public
const changeTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Veuillez fournir un statut valide.");
  }

  const ticket = await Ticket.findById(id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket introuvable.");
  }

  ticket.status = status;
  ticket.resolutionDetails = status === "Résolu" ? { resolvedBy: req.user._id, resolutionDate: Date.now() } : null;

  await ticket.save();

  res.status(200).json({ message: "Statut mis à jour avec succès.", ticket });
});

export {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  addCommentToTicket,
  changeTicketStatus,
};
