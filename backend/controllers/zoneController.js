import asyncHandler from '../middlewares/async.js';
import Zone from '../models/zoneModel.js';
import { v4 as uuidv4 } from 'uuid';
import Inventory from '../models/inventoryModel.js';
import { generateBarcode } from '../utils/barcode.js'; // Fonction pour générer un code-barres unique


// Fonction pour générer un code-barre unique
const generateCodeBarre = () => uuidv4().slice(0, 8);

// @desc    Get all zones
// @route   GET /api/zones
// @access  Public
const getZones = asyncHandler(async (req, res) => {
  const zones = await Zone.find().populate('inventaire'); // Inclure les données d'inventaire si nécessaires
  res.status(200).json(zones);
});

// @desc    Create a new zone
// @route   POST /api/zones
// @access  Public
// const createZone = asyncHandler(async (req, res) => {
//   const { nom, designation, lieu, observation, inventaire } = req.body;

//   if (!nom || !designation || !lieu) {
//     res.status(400);
//     throw new Error('Veuillez fournir le nom, la désignation et le lieu.');
//   }

//   const parties = [
//     { type: 'COMPTAGE', codeBarre: generateCodeBarre(), status: 'À faire' },
//     { type: 'BIPAGE', codeBarre: generateCodeBarre(), status: 'À faire' },
//     { type: 'CONTROLE', codeBarre: generateCodeBarre(), status: 'À faire' },
//   ];

//   const zone = new Zone({
//     nom,
//     designation,
//     observation,
//     lieu,
//     parties,
//     inventaire,
//   });

//   const createdZone = await zone.save();
//   res.status(201).json(createdZone);
// });
// @desc    Ajouter une nouvelle zone
// @route   POST /api/zones
// @access  Public
const createZone = asyncHandler(async (req, res) => {
  const { nom, designation, lieu, observation, inventaire } = req.body;

  // Validation des champs obligatoires
  if (!nom || !designation || !lieu || !inventaire) {
    res.status(400);
    throw new Error('Veuillez fournir un nom, une désignation, un lieu, et un inventaire associé.');
  }

  // Vérification que l'inventaire existe
  const existingInventory = await Inventory.findById(inventaire);
  if (!existingInventory) {
    res.status(404);
    throw new Error("Inventaire associé introuvable.");
  }

  // Génération des parties avec codes-barres
  const parties = [
    { type: 'COMPTAGE', codeBarre: generateBarcode(), status: 'À faire' },
    { type: 'BIPAGE', codeBarre: generateBarcode(), status: 'À faire' },
    { type: 'CONTROLE', codeBarre: generateBarcode(), status: 'À faire' },
  ];

  // Création de la zone
  const newZone = new Zone({
    nom,
    designation,
    lieu,
    observation,
    parties,
    inventaire,
  });

  // Sauvegarde de la zone
  const createdZone = await newZone.save();

  // Ajout de la zone à l'inventaire associé
  existingInventory.zones.push(createdZone._id);
  await existingInventory.save();

  res.status(201).json({
    message: 'Zone créée avec succès.',
    zone: createdZone,
  });
});


// @desc    Get zone by ID
// @route   GET /api/zones/:id
// @access  Public
const getZoneById = asyncHandler(async (req, res) => {
  const zone = await Zone.findById(req.params.id).populate('inventaire');

  if (zone) {
    res.status(200).json(zone);
  } else {
    res.status(404);
    throw new Error('Zone not found');
  }
});

// @desc    Update a zone and its parts
// @route   PUT /api/zones/:id
// @access  Public
const updateZone = asyncHandler(async (req, res) => {
  const { nom, designation, lieu, observation, parties } = req.body;

  const zone = await Zone.findById(req.params.id);

  if (!zone) {
    res.status(404);
    throw new Error('Zone not found');
  }

  zone.nom = nom || zone.nom;
  zone.designation = designation || zone.designation;
  zone.lieu = lieu || zone.lieu;
  zone.observation = observation || zone.observation;

  if (parties) {
    zone.parties = zone.parties.map((existingPart) => {
      const updatedPart = parties.find((p) => p.type === existingPart.type);
      return updatedPart ? { ...existingPart.toObject(), ...updatedPart } : existingPart;
    });
  }

  const updatedZone = await zone.save();
  res.status(200).json(updatedZone);
});

// @desc    Scan a zone part
// @route   POST /api/zones/:zoneId/scan
// @access  Public
const scanZonePart = asyncHandler(async (req, res) => {
  const { type, agentId } = req.body;
  const zone = await Zone.findById(req.params.zoneId);

  if (!zone) {
    res.status(404);
    throw new Error('Zone not found');
  }

  const part = zone.parties.find((p) => p.type === type);
  if (!part) {
    res.status(400);
    throw new Error(`Part ${type} not found in this zone.`);
  }

  if (part.status === 'Terminé') {
    res.status(400);
    throw new Error(`Part ${type} is already marked as completed.`);
  }

  part.status = 'Terminé';
  part.agent = agentId;
  part.dateScan = new Date();

  await zone.save();
  res.status(200).json({ message: `Part ${type} scanned successfully.`, part });
});

// @desc    Delete a zone
// @route   DELETE /api/zones/:id
// @access  Public
const deleteZone = asyncHandler(async (req, res) => {
  const zone = await Zone.findById(req.params.id);

  if (zone) {
    await zone.deleteOne();
    res.status(200).json({ message: 'Zone removed' });
  } else {
    res.status(404);
    throw new Error('Zone not found');
  }
});

// Exportation des fonctions
export {
  getZones,
  createZone,
  getZoneById,
  updateZone,
  scanZonePart,
  deleteZone,
};
