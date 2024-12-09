import asyncHandler from '../middlewares/async.js';
import Tiers from "../models/qc/tierModel.js";

// @desc    Récupérer tous les comptes Tiers
// @route   GET /api/tiers
// @access  Public
const getTiers = asyncHandler(async (req, res) => {
  const tiers = await Tiers.find();
  res.status(200).json(tiers);
});

// @desc    Récupérer un compte Tiers par numéro de compte
// @route   GET /api/tiers/:compte
// @access  Public
const getTiersByCompte = asyncHandler(async (req, res) => {
  const compte = req.params.compte;
  const tier = await Tiers.findOne({ COMPTE: compte });

  if (!tier) {
    res.status(404);
    throw new Error("Compte introuvable.");
  }

  res.status(200).json(tier);
});

export { getTiers, getTiersByCompte };
