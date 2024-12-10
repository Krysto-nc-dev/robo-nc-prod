import asyncHandler from "../middlewares/async.js";
import Facture from "../models/qc/factureModel.js";

// @desc    Get all factures with pagination and filters
// @route   GET /api/factures
// @access  Public
const getFactures = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = "createdAt", order = "desc", search, filter } = req.query;

  // Convertir `page` et `limit` en nombres entiers
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  // Construire les filtres
  const queryFilters = {};

  if (search) {
    queryFilters.$or = [
      { NUMFACT: { $regex: search, $options: "i" } }, // Recherche par numéro de facture
      { TEXTE: { $regex: search, $options: "i" } },   // Recherche par texte
    ];
  }

  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.entries(parsedFilter).forEach(([key, value]) => {
      queryFilters[key] = value;
    });
  }

  // Obtenir les factures avec pagination, tri et filtres
  const totalItems = await Facture.countDocuments(queryFilters); // Compte total des factures correspondant aux filtres

  const factures = await Facture.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 }) // Tri
    .skip((pageNumber - 1) * pageSize) // Sauter les factures des pages précédentes
    .limit(pageSize); // Limiter le nombre de factures retournées

  // Retourner les données
  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    factures,
  });
});

// @desc    Get facture by NUMFACT
// @route   GET /api/factures/:numfact
// @access  Public
const getFactureByNumfact = asyncHandler(async (req, res) => {
  const facture = await Facture.findOne({ NUMFACT: req.params.numfact });

  if (!facture) {
    res.status(404);
    throw new Error("Facture introuvable.");
  }

  res.status(200).json(facture);
});

export { getFactures, getFactureByNumfact };
