import asyncHandler from '../middlewares/async.js';
import Inventory from '../models/inventoryModel.js';
import Zone from '../models/zoneModel.js';
import csv from 'csv-parser';
import PDFDocument from 'pdfkit';
import { generateBarcode, generateBarcodeImage } from '../utils/barcode.js';
import fs from 'fs';

// @desc    Get all inventories
// @route   GET /api/inventories
// @access  Public
const getInventories = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find()
    .populate('zones')
    .populate('agents');
  res.status(200).json(inventories);
});

// @desc    Create a new inventory
// @route   POST /api/inventories
// @access  Public
const createInventory = asyncHandler(async (req, res) => {
  const { zones, agents, dateDebut, dateFin, statut, nom } = req.body;

  if (!zones || zones.length === 0) {
    res.status(400);
    throw new Error('Veuillez fournir au moins une zone associée à cet inventaire.');
  }

  const inventory = new Inventory({
    zones,
    agents,
    dateDebut,
    dateFin,
    statut,
    nom,
  });

  const createdInventory = await inventory.save();
  res.status(201).json(createdInventory);
});

// @desc    Get inventory by ID
// @route   GET /api/inventories/:id
// @access  Public
// @desc    Get inventory by ID
// @route   GET /inventories/:id
// @access  Public
const getInventoryById = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id)
    .populate('zones')
    .populate('agents'); // Inclure les agents associés

  if (inventory) {
    res.status(200).json(inventory);
  } else {
    res.status(404);
    throw new Error("Inventaire introuvable.");
  }
});


// @desc    Update inventory
// @route   PUT /api/inventories/:id
// @access  Public
const updateInventory = asyncHandler(async (req, res) => {
  const inventoryId = req.params.id;

  // Vérification de l'ID
  if (!inventoryId) {
    res.status(400);
    throw new Error("L'ID de l'inventaire est requis.");
  }

  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      { ...req.body },
      { new: true }
    );

    if (!updatedInventory) {
      res.status(404);
      throw new Error("Inventaire introuvable.");
    }

    res.status(200).json(updatedInventory);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});


// @desc    Delete inventory
// @route   DELETE /api/inventories/:id
// @access  Public
// const deleteInventory = asyncHandler(async (req, res) => {
//   const inventory = await Inventory.findById(req.params.id);

//   if (inventory) {
//     await inventory.deleteOne();
//     res.status(200).json({ message: 'Inventaire supprimé avec succès.' });
//   } else {
//     res.status(404);
//     throw new Error('Inventaire introuvable.');
//   }
// });
// @desc    Delete inventory and its associated agents
// @route   DELETE /api/inventories/:id
// @access  Public
const deleteInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (inventory) {
    await inventory.deleteOne(); // Supprime l'inventaire et déclenche le middleware pour les agents
    res.status(200).json({ message: "Inventaire et agents associés supprimés avec succès." });
  } else {
    res.status(404);
    throw new Error("Inventaire introuvable.");
  }
});
// @desc    Import zones from CSV
// @route   POST /api/inventories/import-zones
// @access  Public
const importZonesFromCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Veuillez fournir un fichier CSV.');
  }

  const zones = [];
  const filePath = req.file.path;

  try {
    const readStream = fs.createReadStream(filePath).pipe(csv());

    const newInventory = new Inventory({
      zones: [],
      agents: [],
      dateDebut: new Date(),
      statut: 'En cours',
    });

    await newInventory.save();

    for await (const row of readStream) {
      if (!row.nom || !row.designation || !row.lieu) {
        throw new Error('Le fichier CSV contient des champs manquants.');
      }

      zones.push({
        nom: row.nom,
        designation: row.designation,
        lieu: row.lieu,
        parties: [
          { type: 'COMPTAGE', codeBarre: generateBarcode(), status: 'À faire' },
          { type: 'BIPAGE', codeBarre: generateBarcode(), status: 'À faire' },
          { type: 'CONTROLE', codeBarre: generateBarcode(), status: 'À faire' },
        ],
        inventaire: newInventory._id,
      });
    }

    const createdZones = await Zone.insertMany(zones);
    newInventory.zones = createdZones.map((zone) => zone._id);
    await newInventory.save();

    res.status(201).json({
      message: 'Inventaire créé avec succès et zones importées.',
      inventory: newInventory,
      zones: createdZones,
    });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

// @desc    Generate PDF for inventory zones
// @route   GET /api/inventories/:id/generate-pdf
// @access  Public
const generatePDFInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id).populate('zones');

  if (!inventory) {
    res.status(404);
    throw new Error('Inventaire introuvable.');
  }

  // Création du document PDF avec marges réduites
  const doc = new PDFDocument({ size: 'A4', margin: 20 }); // Marges réduites pour occuper tout l'espace
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=inventory-${inventory._id}.pdf`);
  doc.pipe(res);

  inventory.zones.forEach((zone, zoneIndex) => {
    // Affichage des informations générales de la zone
    doc.fontSize(20).text(`Zone: ${zone.nom}`, { align: 'center', underline: true });
    doc.moveDown(0.5);
    doc.fontSize(14).text(`Désignation: ${zone.designation}`);
    doc.text(`Lieu: ${zone.lieu}`).moveDown(1);

    // Dimensions des cases
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const caseWidth = pageWidth / 3; // Diviser en 3 colonnes égales
    const caseHeight = 150; // Hauteur des cases ajustée pour une meilleure disposition
    const startY = doc.page.height - caseHeight - 5; // 5 est l'espace minimal pour ne pas couper le contenu

    const startX = doc.page.margins.left;

    zone.parties.forEach((partie, index) => {
      const xPosition = startX + index * caseWidth; // Espacement horizontal entre les cases

      // Dessin de la case avec bordures en pointillés
      doc
        .lineWidth(1)
        .dash(5, { space: 5 }) // Bordures pointillées
        .rect(xPosition, startY, caseWidth, caseHeight)
        .stroke()
        .undash(); // Désactiver les pointillés après la case

      // Nom de la zone en haut à droite dans chaque case
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('black')
        .text(zone.nom, xPosition + caseWidth - 60, startY + 10, { align: 'right' });

      // Nom de l'action (COMPTAGE, BIPAGE, CONTROLE)
      doc.fontSize(12).fillColor('black').text(partie.type, xPosition + 10, startY + 10);

      // Ajout du code-barres
      const barcodeImage = generateBarcodeImage(partie.codeBarre);
      if (barcodeImage) {
        doc.image(barcodeImage, xPosition + 10, startY + 40, { fit: [caseWidth - 20, 50] });
      } else {
        doc.fontSize(10).fillColor('red').text('Erreur : Code-barres non généré', xPosition + 10, startY + 50);
      }

      // Champ pour nom
      doc.fontSize(10).fillColor('black').text('Nom : __________________', xPosition + 10, startY + 100);

      // Champ pour signature
      doc.text('Signature : ________________', xPosition + 10, startY + 120);
    });

    // Ajouter une nouvelle page sauf pour la dernière zone
    if (zoneIndex !== inventory.zones.length - 1) {
      doc.addPage();
    }
  });

  doc.end();
});


export {
  getInventories,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  importZonesFromCSV,
  generatePDFInventory,
};
