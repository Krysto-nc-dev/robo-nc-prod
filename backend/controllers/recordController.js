import asyncHandler from '../middlewares/async.js';
import Record from '../models/recordModel.js';
import Agent from '../models/agentModel.js';

// @desc    Get all records
// @route   GET /api/records
// @access  Public
const getRecords = asyncHandler(async (req, res) => {
  const records = await Record.find().populate('zone').populate('agent');
  res.status(200).json(records);
});

// @desc    Create a new record
// @route   POST /api/records
// @access  Public
const createRecord = asyncHandler(async (req, res) => {
  const { zone, typeAction, agent, codeBarre } = req.body;

  const record = new Record({
    zone,
    typeAction,
    agent,
    codeBarre,
  });

  const createdRecord = await record.save();
  res.status(201).json(createdRecord);
});

// @desc    Get record by ID
// @route   GET /api/records/:id
// @access  Public
const getRecordById = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id).populate('zone').populate('agent');

  if (record) {
    res.status(200).json(record);
  } else {
    res.status(404);
    throw new Error("Record not found");
  }
});

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Public
const updateRecord = asyncHandler(async (req, res) => {
  const { zone, typeAction, agent, codeBarre } = req.body;

  const record = await Record.findById(req.params.id);

  if (record) {
    record.zone = zone || record.zone;
    record.typeAction = typeAction || record.typeAction;
    record.agent = agent || record.agent;
    record.codeBarre = codeBarre || record.codeBarre;

    const updatedRecord = await record.save();
    res.status(200).json(updatedRecord);
  } else {
    res.status(404);
    throw new Error("Record not found");
  }
});

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Public
const deleteRecord = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (record) {
    await record.deleteOne();
    res.status(200).json({ message: "Record removed" });
  } else {
    res.status(404);
    throw new Error("Record not found");
  }
});

// @desc    Update record status and assign an agent by scanning a barcode
// @route   PUT /api/records/scan
// @access  Public
const updateRecordByBarcode = asyncHandler(async (req, res) => {
  const { codeBarre, agentId } = req.body;

  if (!codeBarre || !agentId) {
    res.status(400);
    throw new Error("Veuillez fournir un code-barres et un ID d'agent.");
  }

  // Vérifier l'existence de l'agent
  const agent = await Agent.findById(agentId);
  if (!agent) {
    res.status(404);
    throw new Error("Agent introuvable.");
  }

  // Trouver l'enregistrement correspondant au code-barre
  const record = await Record.findOne({ codeBarre }).populate('zone');

  if (!record) {
    res.status(404);
    throw new Error("Aucune action trouvée pour ce code-barres.");
  }

  // Mettre à jour l'état et l'agent de l'enregistrement
  record.typeAction = "En cours"; // Par exemple : Comptage, Bipage, Contrôle
  record.agent = agentId;

  const updatedRecord = await record.save();

  res.status(200).json({
    message: "Action mise à jour avec succès",
    record: updatedRecord,
  });
});

// @desc    Get records by zone ID
// @route   GET /api/records/zone/:zoneId
// @access  Public
const getRecordsByZone = asyncHandler(async (req, res) => {
  const { zoneId } = req.params;

  const records = await Record.find({ zone: zoneId }).populate('zone').populate('agent');

  if (records.length === 0) {
    res.status(404);
    throw new Error("Aucun enregistrement trouvé pour cette zone.");
  }

  res.status(200).json(records);
});

export {
  getRecords,
  createRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
  updateRecordByBarcode,
  getRecordsByZone,
};
