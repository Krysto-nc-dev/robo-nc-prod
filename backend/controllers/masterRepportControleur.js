import asyncHandler from '../middlewares/async.js';
import MasterRepport from '../models/MasterRepportModel.js';

// @desc    Get all MasterRepports
// @route   GET /api/master-repports
// @access  Public
const getMasterRepports = asyncHandler(async (req, res) => {
  const masterRepports = await MasterRepport.find()
  res.status(200).json(masterRepports);
});

// @desc    Create a new MasterRepport
// @route   POST /api/master-repports
// @access  Public
const createMasterRepport = asyncHandler(async (req, res) => {
  const { nom, note, description, status, multisociete, externe, filliales, frequence } = req.body;

  if (!nom) {
    res.status(400);
    throw new Error('Veuillez fournir le nom du rapport');
  }

  const masterRepport = new MasterRepport({
    nom,
    note,
    description,
    status,
    multisociete,
    externe,
    filliales,
    frequence,
  });

  const createdMasterRepport = await masterRepport.save();
  res.status(201).json(createdMasterRepport);
});

// @desc    Get MasterRepport by ID
// @route   GET /api/master-repports/:id
// @access  Public
const getMasterRepportById = asyncHandler(async (req, res) => {
    const masterRepport = await MasterRepport.findById(req.params.id);
  
    if (masterRepport) {
      res.status(200).json(masterRepport);
    } else {
      res.status(404);
      throw new Error("Rapport introuvable");
    }
  });
  

// @desc    Update MasterRepport
// @route   PUT /api/master-repports/:id
// @access  Public
const updateMasterRepport = asyncHandler(async (req, res) => {
  const { nom, note, description, status, multisociete, externe, filliales, frequence } = req.body;

  const masterRepport = await MasterRepport.findById(req.params.id);

  if (masterRepport) {
    masterRepport.nom = nom || masterRepport.nom;
    masterRepport.note = note || masterRepport.note;
    masterRepport.description = description || masterRepport.description;
    masterRepport.status = status || masterRepport.status;
    masterRepport.multisociete = multisociete ?? masterRepport.multisociete;
    masterRepport.externe = externe ?? masterRepport.externe;
    masterRepport.filliales = filliales || masterRepport.filliales;
    masterRepport.frequence = frequence || masterRepport.frequence;

    const updatedMasterRepport = await masterRepport.save();
    res.status(200).json(updatedMasterRepport);
  } else {
    res.status(404);
    throw new Error('Rapport introuvable');
  }
});

// @desc    Delete MasterRepport
// @route   DELETE /api/master-repports/:id
// @access  Public
const deleteMasterRepport = asyncHandler(async (req, res) => {
  const masterRepport = await MasterRepport.findById(req.params.id);

  if (masterRepport) {
    await masterRepport.deleteOne();
    res.status(200).json({ message: 'Rapport supprimé' });
  } else {
    res.status(404);
    throw new Error('Rapport introuvable');
  }
});

// @desc    Add a document to a MasterRepport
// @route   POST /api/master-repports/:id/documents
// @access  Public
const addDocumentToMasterRepport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { filename, url } = req.body;
  
    if (!filename || !url) {
      res.status(400);
      throw new Error("Veuillez fournir le nom et l'URL du fichier");
    }
  
    const masterRepport = await MasterRepport.findById(id);
  
    if (!masterRepport) {
      res.status(404);
      throw new Error("Rapport introuvable");
    }
  
    const newDocument = {
      filename,
      url,
      generatedAt: Date.now(),
    };
  
    masterRepport.documents.push(newDocument);
    await masterRepport.save();
  
    res.status(201).json(masterRepport);
  });
  

// @desc    Delete a document from a MasterRepport
// @route   DELETE /api/master-repports/:id/documents/:docId
// @access  Public
const deleteDocumentFromMasterRepport = asyncHandler(async (req, res) => {
    const { id, docId } = req.params;
  
    const masterRepport = await MasterRepport.findById(id);
  
    if (!masterRepport) {
      res.status(404);
      throw new Error("Rapport introuvable");
    }
  
    const documentIndex = masterRepport.documents.findIndex(
      (doc) => doc._id.toString() === docId
    );
  
    if (documentIndex === -1) {
      res.status(404);
      throw new Error("Document introuvable");
    }
  
    // Supprimer le document
    masterRepport.documents.splice(documentIndex, 1);
    await masterRepport.save();
  
    res.status(200).json({ message: "Document supprimé avec succès" });
  });
  
  export {
    addDocumentToMasterRepport,
    deleteDocumentFromMasterRepport,
    getMasterRepports,
    createMasterRepport,
    getMasterRepportById,
    updateMasterRepport,
    deleteMasterRepport,
  };
  