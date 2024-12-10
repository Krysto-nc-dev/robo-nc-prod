import asyncHandler from "../middlewares/async.js";
import FactureDetails from "../models/qc/factureDetailsModel.js";

// @desc    Get all facture details
// @route   GET /api/facture-details
// @access  Public
const getFactureDetails = asyncHandler(async (req, res) => {
  const factureDetails = await FactureDetails.find();
  res.status(200).json(factureDetails);
});

// @desc    Get facture details by NUMFACT
// @route   GET /api/facture-details/:numfact
// @access  Public
const getFactureDetailsByNumfact = asyncHandler(async (req, res) => {
  const factureDetail = await FactureDetails.find({ NUMFACT: req.params.numfact });

  if (!factureDetail || factureDetail.length === 0) {
    res.status(404);
    throw new Error("Aucun détail trouvé pour ce numéro de facture.");
  }

  res.status(200).json(factureDetail);
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
