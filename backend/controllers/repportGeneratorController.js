import asyncHandler from '../middlewares/async.js';
import RepportGenerator from '../models/repportGeneratorModel.js';
import Document from '../models/documentModel.js'; // Pour ajouter des documents
import fs from 'fs';

// @desc    Get all reports
// @route   GET /api/repportgenerators
// @access  Public
const getRepportGenerators = asyncHandler(async (req, res) => {
  const reports = await RepportGenerator.find()
    // .populate('documents') // Pour récupérer les documents associés
    // .populate('tickets');  // Pour récupérer les tickets associés
  res.status(200).json(reports);
});

// @desc    Create a new report
// @route   POST /api/repportgenerators
// @access  Public
const createRepportGenerator = asyncHandler(async (req, res) => {
  const { nom, note, description, path, status, multisociete, type, tickets } = req.body;

  if (!nom) {
    res.status(400);
    throw new Error('Veuillez fournir le nom du rapport.');
  }

  const report = new RepportGenerator({
    nom,
    note,
    description,
    path,
    status,
    multisociete,
    type,
    tickets,
  });

  const createdReport = await report.save();
  res.status(201).json(createdReport);
});

// @desc    Get report by ID
// @route   GET /api/repportgenerators/:id
// @access  Public
const getRepportGeneratorById = asyncHandler(async (req, res) => {
  const report = await RepportGenerator.findById(req.params.id)
    // .populate('documents') // Inclure les documents associés
    // .populate('tickets');  // Inclure les tickets associés

  if (report) {
    res.status(200).json(report);
  } else {
    res.status(404);
    throw new Error("Rapport introuvable.");
  }
});

// @desc    Update report
// @route   PUT /api/repportgenerators/:id
// @access  Public
const updateRepportGenerator = asyncHandler(async (req, res) => {
  const reportId = req.params.id;

  // Vérification de l'ID
  if (!reportId) {
    res.status(400);
    throw new Error("L'ID du rapport est requis.");
  }

  try {
    const updatedReport = await RepportGenerator.findByIdAndUpdate(
      reportId,
      { ...req.body },
      { new: true }
    );

    if (!updatedReport) {
      res.status(404);
      throw new Error("Rapport introuvable.");
    }

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

// @desc    Delete report
// @route   DELETE /api/repportgenerators/:id
// @access  Public
const deleteRepportGenerator = asyncHandler(async (req, res) => {
  const report = await RepportGenerator.findById(req.params.id);

  if (report) {
    await report.deleteOne(); // Supprimer le rapport
    res.status(200).json({ message: "Rapport supprimé avec succès." });
  } else {
    res.status(404);
    throw new Error("Rapport introuvable.");
  }
});

// @desc    Upload and add document to report
// @route   POST /api/repportgenerators/:id/upload-document
// @access  Public
const uploadDocumentToReport = asyncHandler(async (req, res) => {
  const { id } = req.params;  // ID du rapport à mettre à jour
  const { file } = req;       // Le fichier téléchargé

  if (!file) {
    res.status(400);
    throw new Error('Aucun fichier téléchargé.');
  }

  // Créer un document à partir des informations du fichier
  const document = new Document({
    name: file.originalname,
    fileType: file.mimetype.split('/')[1], // Prendre l'extension de type MIME
    filePath: file.path,
  });

  // Sauvegarder le document dans la base de données
  await document.save();

  // Trouver le rapport par ID
  const report = await RepportGenerator.findById(id);

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  // Ajouter le document au tableau de documents du rapport
  report.documents.push(document._id);

  // Sauvegarder le rapport mis à jour
  await report.save();

  res.status(200).json({ message: 'Fichier ajouté avec succès.', report });
});

// @desc    Generate PDF for report
// @route   GET /api/repportgenerators/:id/generate-pdf
// @access  Public
const generatePDFReport = asyncHandler(async (req, res) => {
  const report = await RepportGenerator.findById(req.params.id)
    .populate('documents') // Inclure les documents associés
    .populate('tickets');  // Inclure les tickets associés

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  // Création du document PDF
  const doc = new PDFDocument({ size: 'A4', margin: 20 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report-${report._id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text(`Rapport : ${report.nom}`, { align: 'center', underline: true });
  doc.moveDown(0.5);
  doc.fontSize(14).text(`Description : ${report.description}`).moveDown(1);
  doc.fontSize(14).text(`Statut : ${report.status}`);

  // Ajouter les documents associés au PDF
  if (report.documents.length > 0) {
    doc.addPage();
    doc.fontSize(16).text('Documents associés :', { underline: true });
    report.documents.forEach((doc, index) => {
      doc.fontSize(12).text(`${index + 1}. ${doc.name} (${doc.fileType})`);
      doc.text(`Path: ${doc.filePath}`).moveDown(0.5);
    });
  }

  doc.end();
});

export {
  getRepportGenerators,
  createRepportGenerator,
  getRepportGeneratorById,
  updateRepportGenerator,
  deleteRepportGenerator,
  uploadDocumentToReport,
  generatePDFReport,
};
