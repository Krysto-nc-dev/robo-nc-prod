import asyncHandler from "../middlewares/async.js";
import Module from "../models/moduleModel.js";

// @desc    Get all modules
// @route   GET /api/modules
// @access  Public
const getModules = asyncHandler(async (req, res) => {
  const modules = await Module.find();
  res.status(200).json(modules);
});

// @desc    Create a new module
// @route   POST /api/modules
// @access  Public
const createModule = asyncHandler(async (req, res) => {
  const { titre, description, categorie, image, documentation, telechargement, estActif } = req.body;

  if (!titre || !categorie || !image || !documentation || !telechargement) {
    res.status(400);
    throw new Error("Veuillez fournir toutes les informations requises pour créer un module.");
  }

  const newModule = new Module({
    titre,
    description,
    categorie,
    image,
    documentation,
    telechargement,
    estActif,
    createdBy: req.user._id, // Utilisateur connecté
  });

  const createdModule = await newModule.save();
  res.status(201).json(createdModule);
});

// @desc    Get module by ID
// @route   GET /api/modules/:id
// @access  Public
const getModuleById = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    res.status(404);
    throw new Error("Module introuvable.");
  }

  res.status(200).json(module);
});

// @desc    Update a module
// @route   PUT /api/modules/:id
// @access  Public
const updateModule = asyncHandler(async (req, res) => {
  const moduleId = req.params.id;

  const updatedModule = await Module.findByIdAndUpdate(
    moduleId,
    { ...req.body, updatedBy: req.user._id }, // Mettre à jour avec les données reçues et l'utilisateur connecté
    { new: true }
  );

  if (!updatedModule) {
    res.status(404);
    throw new Error("Module introuvable.");
  }

  res.status(200).json(updatedModule);
});

// @desc    Delete a module
// @route   DELETE /api/modules/:id
// @access  Public
const deleteModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    res.status(404);
    throw new Error("Module introuvable.");
  }

  await module.deleteOne();
  res.status(200).json({ message: "Module supprimé avec succès." });
});

// @desc    Activate a module
// @route   PATCH /api/modules/:id/activate
// @access  Public
const activateModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    res.status(404);
    throw new Error("Module introuvable.");
  }

  module.estActif = true;
  module.dateActivation = new Date();
  await module.save();

  res.status(200).json({ message: "Module activé avec succès.", module });
});

// @desc    Deactivate a module
// @route   PATCH /api/modules/:id/deactivate
// @access  Public
const deactivateModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    res.status(404);
    throw new Error("Module introuvable.");
  }

  module.estActif = false;
  module.dateDesactivation = new Date();
  await module.save();

  res.status(200).json({ message: "Module désactivé avec succès.", module });
});

// @desc    Download a module
// @route   GET /api/modules/:id/download
// @access  Public
const downloadModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);

  if (!module || !module.telechargement) {
    res.status(404);
    throw new Error("Module ou fichier de téléchargement introuvable.");
  }

  res.redirect(module.telechargement); // Redirection vers l'URL du fichier à télécharger
});

export {
  getModules,
  createModule,
  getModuleById,
  updateModule,
  deleteModule,
  activateModule,
  deactivateModule,
  downloadModule,
};
