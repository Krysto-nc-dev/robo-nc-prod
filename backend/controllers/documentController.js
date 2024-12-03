import asyncHandler from "../middlewares/async.js";
import Document from "../models/documentModel.js";
import fs from "fs";

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find();
  res.status(200).json(documents);
});

// @desc    Get document by ID
// @route   GET /api/documents/:id
// @access  Public
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document introuvable.");
  }

  res.status(200).json(document);
});

// @desc    Create a new document
// @route   POST /api/documents
// @access  Public
const createDocument = asyncHandler(async (req, res) => {
  const { name, fileType } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Aucun fichier téléchargé.");
  }

  const newDocument = new Document({
    name,
    fileType,
    filePath: req.file.path,
  });

  const createdDocument = await newDocument.save();
  res.status(201).json(createdDocument);
});

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Public
const updateDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, fileType } = req.body;

  const document = await Document.findById(id);

  if (!document) {
    res.status(404);
    throw new Error("Document introuvable.");
  }

  // Mettre à jour les champs
  if (name) document.name = name;
  if (fileType) document.fileType = fileType;

  const updatedDocument = await document.save();
  res.status(200).json(updatedDocument);
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Public
const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await Document.findById(id);

  if (!document) {
    res.status(404);
    throw new Error("Document introuvable.");
  }

  // Supprimer le fichier associé
  if (fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }

  await document.deleteOne();
  res.status(200).json({ message: "Document supprimé avec succès." });
});

// @desc    Download a document
// @route   GET /api/documents/:id/download
// @access  Public
const downloadDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await Document.findById(id);

  if (!document) {
    res.status(404);
    throw new Error("Document introuvable.");
  }

  const filePath = document.filePath;

  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error("Fichier introuvable sur le serveur.");
  }

  res.download(filePath, document.name, (err) => {
    if (err) {
      console.error("Erreur lors du téléchargement du fichier :", err);
      res.status(500).json({ message: "Erreur lors du téléchargement du fichier." });
    }
  });
});

export {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
};
