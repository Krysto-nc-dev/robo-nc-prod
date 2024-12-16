import asyncHandler from "../middlewares/async.js";
import Commande from "../models/qc/commandeModel.js";

// @desc    Get all commandes with pagination and filters
// @route   GET /api/commandes
// @access  Public
const getCommandes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = "createdAt", order = "desc", search, filter } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  const queryFilters = {};

  // Search filter
  if (search) {
    queryFilters.$or = [
      { NUMCDE: { $regex: search, $options: "i" } },
      { BATEAU: { $regex: search, $options: "i" } },
      { OBSERV: { $regex: search, $options: "i" } },
    ];
  }

  // Advanced filtering
  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.entries(parsedFilter).forEach(([key, value]) => {
      queryFilters[key] = value;
    });
  }

  // Count total commandes matching filters
  const totalItems = await Commande.countDocuments(queryFilters);

  // Fetch commandes with pagination
  const commandes = await Commande.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    commandes,
  });
});

// @desc    Get commande by ID
// @route   GET /api/commandes/:id
// @access  Public
const getCommandeById = asyncHandler(async (req, res) => {
  const commande = await Commande.findById(req.params.id);

  if (!commande) {
    res.status(404);
    throw new Error("Commande introuvable.");
  }

  res.status(200).json(commande);
});

// @desc    Get all commandes by a specific fournisseur
// @route   GET /api/commandes/fournisseur/:fournisseurId
// @access  Public
const getCommandesByFournisseur = asyncHandler(async (req, res) => {
  const fournisseurId = parseInt(req.params.fournisseurId, 10);

  if (isNaN(fournisseurId)) {
    res.status(400);
    throw new Error("L'identifiant du fournisseur doit être un nombre.");
  }

  const commandes = await Commande.find({ FOURN: fournisseurId });

  if (!commandes || commandes.length === 0) {
    res.status(404);
    throw new Error("Aucune commande trouvée pour ce fournisseur.");
  }

  res.status(200).json(commandes);
});




export {
  getCommandes,
  getCommandeById,
  getCommandesByFournisseur,

};
