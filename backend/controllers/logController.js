import asyncHandler from "../middlewares/async.js";
import Log from "../models/logModel.js";

// @desc    Créer un log
// @route   POST /api/logs
// @access  Public
const createLog = asyncHandler(async (req, res) => {
  const {
    user,
    action,
    category,
    target,
    targetId,
    details,
    result,
    ipAddress,
    location,
  } = req.body;

  // Vérification des champs requis
  if (!user || !action || !category || !target) {
    res.status(400);
    throw new Error(
      "Veuillez fournir les champs requis : user, action, category, target."
    );
  }

  const log = new Log({
    user,
    action,
    category,
    target,
    targetId,
    details,
    result: result || "Succès", // Défaut à "Succès" si non spécifié
    ipAddress: ipAddress || req.ip, // Par défaut, l'IP de la requête
    location,
  });

  const createdLog = await log.save();
  res.status(201).json(createdLog);
});

// @desc    Récupérer tous les logs
// @route   GET /api/logs
// @access  Public
const getLogs = asyncHandler(async (req, res) => {
  const { user, action, category, target, startDate, endDate } = req.query;

  // Création d'un filtre dynamique basé sur les paramètres
  const filter = {};
  if (user) filter.user = user;
  if (action) filter.action = action;
  if (category) filter.category = category;
  if (target) filter.target = target;

  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
  }

  const logs = await Log.find(filter).sort({ timestamp: -1 }); // Tri du plus récent au plus ancien
  res.status(200).json(logs);
});

// @desc    Récupérer un log par ID
// @route   GET /api/logs/:id
// @access  Public
const getLogById = asyncHandler(async (req, res) => {
  const log = await Log.findById(req.params.id).populate("user", "name email");

  if (log) {
    res.status(200).json(log);
  } else {
    res.status(404);
    throw new Error("Log introuvable.");
  }
});

// @desc    Supprimer un log par ID
// @route   DELETE /api/logs/:id
// @access  Public
const deleteLog = asyncHandler(async (req, res) => {
  const log = await Log.findById(req.params.id);

  if (log) {
    await log.deleteOne();
    res.status(200).json({ message: "Log supprimé avec succès." });
  } else {
    res.status(404);
    throw new Error("Log introuvable.");
  }
});

// @desc    Analyse des logs
// @route   GET /api/logs/analytics
// @access  Public
const getLogAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Filtre par date
  const filter = {};
  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate);
    if (endDate) filter.timestamp.$lte = new Date(endDate);
  }

  // Regroupement et agrégation
  const analytics = await Log.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$action",
        total: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } }, // Tri par total décroissant
  ]);

  res.status(200).json(analytics);
});

export { createLog, getLogs, getLogById, deleteLog, getLogAnalytics };
