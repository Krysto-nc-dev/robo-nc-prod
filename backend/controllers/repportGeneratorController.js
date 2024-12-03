import asyncHandler from '../middlewares/async.js';
import RepportGenerator from '../models/repportGeneratorModel.js';
import Document from '../models/documentModel.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';

// @desc    Get all report generators
// @route   GET /api/repportgenerators
// @access  Public
const getRepportGenerators = asyncHandler(async (req, res) => {
  const reports = await RepportGenerator.find()
    .populate('documents', 'name fileType') // Inclure les noms des documents associés
    .populate('tickets', 'title status'); // Inclure les tickets associés
  res.status(200).json(reports);
});

// @desc    Create a new report generator
// @route   POST /api/repportgenerators
// @access  Public
const createRepportGenerator = asyncHandler(async (req, res) => {
  const { nom, note, description, path, status, multisociete, type, tickets } = req.body;

  // Validation des champs obligatoires
  if (!nom || !type) {
    res.status(400);
    throw new Error('Veuillez fournir les champs requis : nom, type.');
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
    createdBy: req.user?._id || null, // Utilisateur connecté
  });

  const createdReport = await report.save();
  res.status(201).json(createdReport);
});

// @desc    Get report generator by ID
// @route   GET /api/repportgenerators/:id
// @access  Public
const getRepportGeneratorById = asyncHandler(async (req, res) => {
  const report = await RepportGenerator.findById(req.params.id)
    .populate('documents', 'name fileType filePath') // Inclure les documents associés
    .populate('tickets', 'title status'); // Inclure les tickets associés

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  res.status(200).json(report);
});

// @desc    Update report generator
// @route   PUT /api/repportgenerators/:id
// @access  Public
const updateRepportGenerator = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedReport = await RepportGenerator.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!updatedReport) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  res.status(200).json(updatedReport);
});

// @desc    Delete report generator
// @route   DELETE /api/repportgenerators/:id
// @access  Public
const deleteRepportGenerator = asyncHandler(async (req, res) => {
  const report = await RepportGenerator.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  await report.deleteOne();
  res.status(200).json({ message: 'Rapport supprimé avec succès.' });
});

// @desc    Upload and add document to report generator
// @route   POST /api/repportgenerators/:id/upload-document
// @access  Public
const uploadDocumentToReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error('Aucun fichier téléchargé.');
  }

  const document = new Document({
    name: file.originalname,
    fileType: file.mimetype.split('/')[1],
    filePath: file.path,
  });

  await document.save();

  const report = await RepportGenerator.findById(id);

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  report.documents.push(document._id);
  await report.save();

  res.status(200).json({ message: 'Fichier ajouté avec succès.', report });
});

// @desc    Generate PDF for a report generator
// @route   GET /api/repportgenerators/:id/generate-pdf
// @access  Public
const generatePDFReport = asyncHandler(async (req, res) => {
  const report = await RepportGenerator.findById(req.params.id)
    .populate('documents', 'name filePath fileType')
    .populate('tickets', 'title description status');

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  const doc = new PDFDocument({ size: 'A4', margin: 20 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report-${report.nom}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text(`Rapport : ${report.nom}`, { align: 'center', underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Description : ${report.description || 'Aucune'}`);
  doc.moveDown();
  doc.text(`Statut : ${report.status}`);
  doc.text(`Multisociété : ${report.multisociete ? 'Oui' : 'Non'}`);
  doc.moveDown();

  if (report.documents.length > 0) {
    doc.addPage();
    doc.fontSize(16).text('Documents associés :', { underline: true });
    report.documents.forEach((docItem, index) => {
      doc.fontSize(12).text(`${index + 1}. ${docItem.name} (${docItem.fileType})`);
      doc.text(`Path: ${docItem.filePath}`);
    });
  }

  if (report.tickets.length > 0) {
    doc.addPage();
    doc.fontSize(16).text('Tickets associés :', { underline: true });
    report.tickets.forEach((ticket, index) => {
      doc.fontSize(12).text(`${index + 1}. ${ticket.title}`);
      doc.text(`Description: ${ticket.description}`);
      doc.text(`Statut: ${ticket.status}`);
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
