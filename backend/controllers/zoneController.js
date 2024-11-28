import asyncHandler from '../middlewares/async.js';
import Zone from '../models/zoneModel.js';
import { v4 as uuidv4 } from 'uuid'; // Pour générer des identifiants uniques

// Fonction pour générer un code-barre unique
const generateCodeBarre = () => uuidv4().slice(0, 8); // Exemple : 8 caractères uniques

// @desc    Get all zones
// @route   GET /api/zones
// @access  Public
const getZones = asyncHandler(async (req, res) => {
  const zones = await Zone.find();
  res.status(200).json(zones);
});

// @desc    Create a new zone with auto-generated barcodes and default statuses
// @route   POST /api/zones
// @access  Public
const createZone = asyncHandler(async (req, res) => {
  const { nom, designation, lieu, observation } = req.body;

  // Générer automatiquement les parties avec codes-barres et statuts
  const parties = [
    { type: 'COMPTAGE', codeBarre: generateCodeBarre(), status: 'À faire' },
    { type: 'BIPAGE', codeBarre: generateCodeBarre(), status: 'À faire' },
    { type: 'CONTROLE', codeBarre: generateCodeBarre(), status: 'À faire' },
  ];

  const zone = new Zone({
    nom,
    designation,
    observation,
    lieu,
    parties,
  });

  const createdZone = await zone.save();
  res.status(201).json(createdZone);
});

// @desc    Get zone by ID
// @route   GET /api/zones/:id
// @access  Public
const getZoneById = asyncHandler(async (req, res) => {
  const zone = await Zone.findById(req.params.id);

  if (zone) {
    res.status(200).json(zone);
  } else {
    res.status(404);
    throw new Error('Zone not found');
  }
});

// @desc    Update zone and its parts
// @route   PUT /api/zones/:id
// @access  Public
const updateZone = asyncHandler(async (req, res) => {
  const { nom, designation, lieu, parties } = req.body;

  const zone = await Zone.findById(req.params.id);

  if (zone) {
    zone.nom = nom || zone.nom;
    zone.designation = designation || zone.designation;
    zone.lieu = lieu || zone.lieu;

    // Mettre à jour les parties si elles sont fournies
    if (parties) {
      const updatedParties = zone.parties.map((existingPart) => {
        const updatedPart = parties.find((p) => p.type === existingPart.type);
        return updatedPart
          ? { ...existingPart, ...updatedPart }
          : existingPart;
      });

      zone.parties = updatedParties;
    }

    const updatedZone = await zone.save();
    res.status(200).json(updatedZone);
  } else {
    res.status(404);
    throw new Error('Zone not found');
  }
});

// @desc    Delete zone
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

export {
  getZones,
  createZone,
  getZoneById,
  updateZone,
  deleteZone,
};
