import asyncHandler from '../middlewares/async.js';
import AccessApp from '../models/AccessApp.js';

// @desc    Get all AccessApps
// @route   GET /api/access-apps
// @access  Public
const getAccessApps = asyncHandler(async (req, res) => {
  const accessApps = await AccessApp.find();
  res.status(200).json(accessApps);
});

// @desc    Create a new AccessApp
// @route   POST /api/access-apps
// @access  Public
const createAccessApp = asyncHandler(async (req, res) => {
  const { nom, note, description, status, multisociete, externe, type } = req.body;

  if (!nom) {
    res.status(400);
    throw new Error('Veuillez fournir le nom de l\'application');
  }

  const accessApp = new AccessApp({
    nom,
    note,
    description,
    status,
    multisociete,
    externe,
    type,
  });

  const createdAccessApp = await accessApp.save();
  res.status(201).json(createdAccessApp);
});

// @desc    Get AccessApp by ID
// @route   GET /api/access-apps/:id
// @access  Public
const getAccessAppById = asyncHandler(async (req, res) => {
  const accessApp = await AccessApp.findById(req.params.id);

  if (accessApp) {
    res.status(200).json(accessApp);
  } else {
    res.status(404);
    throw new Error('Application introuvable');
  }
});

// @desc    Update AccessApp
// @route   PUT /api/access-apps/:id
// @access  Public
const updateAccessApp = asyncHandler(async (req, res) => {
  const { nom, note, description, status, multisociete, externe, type } = req.body;

  const accessApp = await AccessApp.findById(req.params.id);

  if (accessApp) {
    accessApp.nom = nom || accessApp.nom;
    accessApp.note = note || accessApp.note;
    accessApp.description = description || accessApp.description;
    accessApp.status = status || accessApp.status;
    accessApp.multisociete = multisociete ?? accessApp.multisociete; // Pour les booléens, utilisation de l'opérateur nullish coalescing
    accessApp.externe = externe ?? accessApp.externe;
    accessApp.type = type || accessApp.type;

    const updatedAccessApp = await accessApp.save();
    res.status(200).json(updatedAccessApp);
  } else {
    res.status(404);
    throw new Error('Application introuvable');
  }
});

// @desc    Delete AccessApp
// @route   DELETE /api/access-apps/:id
// @access  Public
const deleteAccessApp = asyncHandler(async (req, res) => {
  const accessApp = await AccessApp.findById(req.params.id);

  if (accessApp) {
    await accessApp.deleteOne();
    res.status(200).json({ message: 'Application supprimée' });
  } else {
    res.status(404);
    throw new Error('Application introuvable');
  }
});

export {
  getAccessApps,
  createAccessApp,
  getAccessAppById,
  updateAccessApp,
  deleteAccessApp,
};
