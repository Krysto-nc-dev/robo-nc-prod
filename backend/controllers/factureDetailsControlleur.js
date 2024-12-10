import asyncHandler from "../middlewares/async.js";
import FactureDetails from "../models/qc/factureDetailsModel.js";

// @desc    Get all facture details with pagination and filters
// @route   GET /api/facture-details
// @access  Public
const getFactureDetails = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = "createdAt", order = "desc", search, filter } = req.query;

  // Convertir `page` et `limit` en nombres entiers
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);

  // Construire les filtres
  const queryFilters = {};

  if (search) {
    queryFilters.$or = [
      { NUMFACT: { $regex: search, $options: "i" } }, // Recherche par numéro de facture
      { NART: { $regex: search, $options: "i" } },    // Recherche par code article
      { DESIGN: { $regex: search, $options: "i" } },  // Recherche par désignation
    ];
  }

  if (filter) {
    const parsedFilter = JSON.parse(filter);
    Object.entries(parsedFilter).forEach(([key, value]) => {
      queryFilters[key] = value;
    });
  }

  // Obtenir les détails avec pagination et tri
  const totalItems = await FactureDetails.countDocuments(queryFilters); // Compte total des enregistrements

  const factureDetails = await FactureDetails.find(queryFilters)
    .sort({ [sort]: order === "desc" ? -1 : 1 }) // Tri
    .skip((pageNumber - 1) * pageSize) // Sauter les détails des pages précédentes
    .limit(pageSize); // Limiter le nombre de détails retournés

  // Retourner les données
  res.status(200).json({
    page: pageNumber,
    limit: pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    factureDetails,
  });
});

// @desc    Get facture details by NUMFACT
// @route   GET /api/facture-details/:numfact
// @access  Public
const getFactureDetailsByNumfact = asyncHandler(async (req, res) => {
  const factureDetails = await FactureDetails.find({ NUMFACT: req.params.numfact });

  if (!factureDetails || factureDetails.length === 0) {
    res.status(404);
    throw new Error("Aucun détail trouvé pour ce numéro de facture.");
  }

  res.status(200).json(factureDetails);
});

// @desc    Get facture details by NART (code article)
// @route   GET /api/facture-details/article/:nart
// @access  Public
const getFactureDetailsByNart = asyncHandler(async (req, res) => {
  const factureDetails = await FactureDetails.find({ NART: req.params.nart });

  if (!factureDetails || factureDetails.length === 0) {
    res.status(404);
    throw new Error("Aucun détail trouvé pour ce code article.");
  }

  res.status(200).json(factureDetails);
});

export { getFactureDetails, getFactureDetailsByNumfact, getFactureDetailsByNart };
