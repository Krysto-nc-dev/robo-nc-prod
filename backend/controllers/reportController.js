import asyncHandler from '../middlewares/async.js';
import Repport from '../models/repportModel.js';
import Document from '../models/documentModel.js';
import Log from '../models/logModel.js';
import PDFDocument from 'pdfkit';

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
const getReports = asyncHandler(async (req, res) => {
  const reports = await Repport.find()
    .populate('documents', 'name fileType')
    .populate('tickets', 'title status')
    .populate('maintainedBy', 'name email');
  res.status(200).json(reports);
});

// @desc    Create a new report
// @route   POST /api/reports
// @access  Public
const createReport = asyncHandler(async (req, res) => {
  const {
    nom,
    description,
    note,
    status,
    type,
    category,
    tickets,
    documents,
    maintainedBy,
    frequence,
  } = req.body;

  if (!nom || !type || !frequence?.type || !category) {
    res.status(400);
    throw new Error('Veuillez fournir les champs requis : nom, type, frequence.type, category.');
  }

  const report = new Repport({
    nom,
    description,
    note,
    status,
    type,
    category,
    tickets,
    documents,
    maintainedBy,
    frequence,
  });

  const createdReport = await report.save();

  // Log de création
  await Log.create({
    user: req.user?._id || null,
    action: 'Créer',
    category: 'Rapport',
    target: 'Rapport',
    targetId: createdReport._id,
    details: { nom: createdReport.nom, type: createdReport.type, category: createdReport.category },
    result: 'Succès',
    ipAddress: req.ip,
    location: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  });

  res.status(201).json(createdReport);
});

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Public
const getReportById = asyncHandler(async (req, res) => {
  const report = await Repport.findById(req.params.id)
    .populate('documents', 'name fileType filePath')
    .populate('tickets', 'title status')
    .populate('maintainedBy', 'name email');

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  res.status(200).json(report);
});

// @desc    Update a report
// @route   PUT /api/reports/:id
// @access  Public
const updateReport = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedReport = await Repport.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!updatedReport) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  // Log de mise à jour
  await Log.create({
    user: req.user?._id || null,
    action: 'Modifier',
    category: 'Rapport',
    target: 'Rapport',
    targetId: updatedReport._id,
    details: req.body,
    result: 'Succès',
    ipAddress: req.ip,
    location: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  });

  res.status(200).json(updatedReport);
});

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Public
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Repport.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  await report.deleteOne();

  // Log de suppression
  await Log.create({
    user: req.user?._id || null,
    action: 'Supprimer',
    category: 'Rapport',
    target: 'Rapport',
    targetId: req.params.id,
    details: { nom: report.nom, category: report.category },
    result: 'Succès',
    ipAddress: req.ip,
    location: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  });

  res.status(200).json({ message: 'Rapport supprimé avec succès.' });
});

// @desc    Add a document to a report
// @route   POST /api/reports/:id/add-document
// @access  Public
const addDocumentToReport = asyncHandler(async (req, res) => {
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

  const report = await Repport.findById(id);

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  report.documents.push(document._id);
  await report.save();

  // Log d'ajout de document
  await Log.create({
    user: req.user?._id || null,
    action: 'Ajouter Document',
    category: 'Rapport',
    target: 'Rapport',
    targetId: id,
    details: { documentName: document.name, category: report.category },
    result: 'Succès',
    ipAddress: req.ip,
    location: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
  });

  res.status(200).json({ message: 'Document ajouté avec succès.', report });
});

// @desc    Generate PDF for a report
// @route   GET /api/reports/:id/generate-pdf
// @access  Public
const generatePDFReport = asyncHandler(async (req, res) => {
  const report = await Repport.findById(req.params.id)
    .populate('documents', 'name filePath fileType')
    .populate('tickets', 'title description status');

  if (!report) {
    res.status(404);
    throw new Error('Rapport introuvable.');
  }

  const doc = new PDFDocument({ size: 'A4', margin: 20 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=report-${report.nom}.pdf`
  );
  doc.pipe(res);

  doc.fontSize(20).text(`Rapport : ${report.nom}`, { align: 'center', underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Description : ${report.description || 'Aucune'}`);
  doc.moveDown();
  doc.text(`Statut : ${report.status}`);
  doc.text(`Catégorie : ${report.category}`);
  doc.text(`Dernière exécution : ${report.lastExecution || 'Jamais'}`);
  doc.text(`Fréquence : ${report.frequence?.type || 'Non spécifiée'}`);
  doc.text(`Détails Fréquence : ${report.frequence?.details || 'Aucun'}`);
  doc.moveDown();

  if (report.documents.length > 0) {
    doc.addPage();
    doc.fontSize(16).text('Documents associés :', { underline: true });
    report.documents.forEach((docItem, index) => {
      doc.fontSize(12).text(`${index + 1}. ${docItem.name} (${docItem.fileType})`);
    });
  }

  if (report.tickets.length > 0) {
    doc.addPage();
    doc.fontSize(16).text('Tickets associés :', { underline: true });
    report.tickets.forEach((ticket, index) => {
      doc.fontSize(12).text(`${index + 1}. ${ticket.title}`);
    });
  }

  doc.end();
});

export {
  getReports,
  createReport,
  getReportById,
  updateReport,
  deleteReport,
  addDocumentToReport,
  generatePDFReport,
};
