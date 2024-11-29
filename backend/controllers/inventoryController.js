import asyncHandler from '../middlewares/async.js';
import Inventory from '../models/inventoryModel.js';
import Zone from '../models/zoneModel.js';
import csv from 'csv-parser';

import PDFDocument from 'pdfkit';
import { generateBarcode , generateBarcodeImage} from '../utils/barcode.js';
import fs from 'fs';

// @desc    Get all inventories
// @route   GET /api/inventories
// @access  Public
const getInventories = asyncHandler(async (req, res) => {
  const inventories = await Inventory.find()
    .populate('zones')
    .populate('agents'); // Populate agents
  res.status(200).json(inventories);
});

// @desc    Create a new inventory
// @route   POST /api/inventories
// @access  Public
const createInventory = asyncHandler(async (req, res) => {
  const { zones, agents, dateDebut, dateFin, statut, nom } = req.body;

  if (!zones || zones.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir au moins une zone associée à cet inventaire.");
  }

  if (!agents || agents.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir au moins un agent responsable pour cet inventaire.");
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
const getInventoryById = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id)
    .populate('zones')
    .populate('agents');

  if (inventory) {
    res.status(200).json(inventory);
  } else {
    res.status(404);
    throw new Error("Inventory not found");
  }
});

// @desc    Update inventory
// @route   PUT /api/inventories/:id
// @access  Public
const updateInventory = asyncHandler(async (req, res) => {
  const { zones, agents, dateDebut, dateFin, statut } = req.body;

  const inventory = await Inventory.findById(req.params.id);

  if (inventory) {
    inventory.zones = zones || inventory.zones;
    inventory.agents = agents || inventory.agents;
    inventory.dateDebut = dateDebut || inventory.dateDebut;
    inventory.dateFin = dateFin || inventory.dateFin;
    inventory.statut = statut || inventory.statut;

    const updatedInventory = await inventory.save();
    res.status(200).json(updatedInventory);
  } else {
    res.status(404);
    throw new Error("Inventory not found");
  }
});

// @desc    Delete inventory
// @route   DELETE /api/inventories/:id
// @access  Public
const deleteInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id);

  if (inventory) {
    await inventory.deleteOne();
    res.status(200).json({ message: "Inventory removed" });
  } else {
    res.status(404);
    throw new Error("Inventory not found");
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

    // Création de l'inventaire associé
    const newInventory = new Inventory({
      zones: [], // Zones seront ajoutées après leur création
      agents: [], // À personnaliser si nécessaire
      dateDebut: new Date(),
      statut: 'En cours',
    });

    await newInventory.save(); // Sauvegarde de l'inventaire

    for await (const row of readStream) {
      // Vérification des champs obligatoires
      if (!row.nom || !row.designation || !row.lieu) {
        console.error('Données CSV invalides :', row);
        throw new Error('Le fichier CSV contient des champs manquants.');
      }

      // Ajout des zones avec génération automatique des codes-barres
      zones.push({
        nom: row.nom,
        designation: row.designation,
        lieu: row.lieu,
        parties: [
          { type: 'COMPTAGE', codeBarre: generateBarcode(), status: 'À faire' },
          { type: 'BIPAGE', codeBarre: generateBarcode(), status: 'À faire' },
          { type: 'CONTROLE', codeBarre: generateBarcode(), status: 'À faire' },
        ],
        inventaire: newInventory._id, // Lien avec l'inventaire
      });
    }

    // Insertion des nouvelles zones
    const createdZones = await Zone.insertMany(zones);

    // Mise à jour de l'inventaire avec les zones créées
    newInventory.zones = createdZones.map((zone) => zone._id);
    await newInventory.save();

    res.status(201).json({
      message: 'Inventaire créé avec succès et zones importées.',
      inventory: newInventory,
      zones: createdZones,
    });
  } catch (error) {
    console.error('Erreur lors de l\'importation :', error.message);
    res.status(500);
    throw new Error('Erreur lors de l\'importation des zones et de la création de l\'inventaire.');
  } finally {
    // Suppression du fichier CSV temporaire
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('Fichier CSV temporaire supprimé.');
    }
  }
});

// @desc    Generate PDF for inventory zones
// @route   GET /api/inventories/:id/generate-pdf
// @access  Public
// @desc    Generate PDF for inventory zones
// @route   GET /api/inventories/:id/generate-pdf
// @access  Public
const generatePDFForInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.findById(req.params.id).populate('zones');

  if (!inventory) {
    res.status(404).json({ message: 'Inventaire non trouvé.' });
    return;
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50 }); // Format A4 avec marges
  const filePath = `./uploads/inventory-${inventory._id}.pdf`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  for (const zone of inventory.zones) {
    // Titre de la zone
    doc.fontSize(20).text(`Zone: ${zone.nom}`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(14).text(`Désignation: ${zone.designation}`);
    doc.text(`Lieu: ${zone.lieu}`);
    doc.moveDown(1);

    // Section "Remarques"
    doc.fontSize(12).text('Remarques :', { underline: true });
    doc.moveDown(1);
    doc.rect(doc.x, doc.y, doc.page.width - doc.x * 2, 50).stroke(); // Encadré pour remarques
    doc.moveDown(3);

    // Dimensions des cases
    const caseWidth = (doc.page.width - 120) / 3; // Largeur pour chaque case
    const caseHeight = 180; // Hauteur ajustée pour les cases
    const startX = 50; // Point de départ horizontal
    const startY = doc.page.height - doc.page.margins.bottom - caseHeight - 50; // Position verticale (en bas)

    // Dessiner les cases avec les codes-barres
    zone.parties.forEach((partie, index) => {
      const xPosition = startX + index * (caseWidth + 10); // Position horizontale
      const barcodeImage = generateBarcodeImage(partie.codeBarre); // Générer le code-barres

      // Dessin de la case
      doc
        .rect(xPosition, startY, caseWidth, caseHeight)
        .stroke()
        .fontSize(12)
        .fillColor('black')
        .text(partie.type, xPosition + 10, startY + 10); // Titre de la case

      // Ajout du code-barres
      if (barcodeImage) {
        doc.image(barcodeImage, xPosition + 10, startY + 40, { fit: [caseWidth - 20, 70] });
      } else {
        doc.fontSize(10).fillColor('red').text('Erreur code-barre', xPosition + 10, startY + 50);
      }

      // Champ pour le nom
      doc
        .rect(xPosition + 10, startY + 120, caseWidth - 20, 20) // Champ pour le nom
        .stroke()
        .fontSize(10)
        .fillColor('gray')
        .text('Nom :', xPosition + 15, startY + 125);

      // Champ pour la signature
      doc
        .rect(xPosition + 10, startY + 150, caseWidth - 20, 20) // Champ pour la signature
        .stroke()
        .fontSize(10)
        .fillColor('gray')
        .text('Signature :', xPosition + 15, startY + 155);

      // Ajout du nom de la zone dans chaque case
      doc.fontSize(10).fillColor('black').text(zone.nom, xPosition + 10, startY + 170, {
        align: 'left',
      });
    });

    // Ajouter une nouvelle page sauf pour la dernière zone
    if (inventory.zones.indexOf(zone) !== inventory.zones.length - 1) {
      doc.addPage();
    }
  }

  doc.end();

  // Envoie le PDF au client
  stream.on('finish', () => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=inventory-${inventory._id}.pdf`);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlinkSync(filePath);
    });
  });

  stream.on('error', (err) => {
    console.error('Erreur lors de la génération du PDF :', err.message);
    res.status(500).json({ message: 'Erreur lors de la génération du PDF.' });
  });
});




export {
  getInventories,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  importZonesFromCSV,
  generatePDFForInventory,
};
