import asyncHandler from "../middlewares/async.js";
import Facture from "../models/qc/factureModel.js";

// @desc    Get all factures
// @route   GET /api/factures
// @access  Public
const getFactures = asyncHandler(async (req, res) => {
  const factures = await Facture.find();
  res.status(200).json(factures);
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
