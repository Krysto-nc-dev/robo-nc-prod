import asyncHandler from "../middlewares/async.js";
import Fournisseur from "../models/qc/fournisseurModel.js";

// @desc    Get all fournisseurs
// @route   GET /api/fournisseurs
// @access  Public
const getFournisseurs = asyncHandler(async (req, res) => {
  const fournisseurs = await Fournisseur.find();
  res.status(200).json(fournisseurs);
});

// @desc    Get fournisseur by ID
// @route   GET /api/fournisseurs/:id
// @access  Public
const getFournisseurById = asyncHandler(async (req, res) => {
  const fournisseur = await Fournisseur.findById(req.params.id);

  if (!fournisseur) {
    res.status(404);
    throw new Error("Fournisseur introuvable.");
  }

  res.status(200).json(fournisseur);
});

export { getFournisseurs, getFournisseurById };
