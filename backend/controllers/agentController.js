import asyncHandler from '../middlewares/async.js';
import Agent from '../models/agentModel.js';
import Inventory from '../models/inventoryModel.js';

import mongoose from 'mongoose'; // Ajout de mongoose
// @desc    Get all agents
// @route   GET /api/agents
// @access  Public
const getAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find();
  res.status(200).json(agents);
});

// @desc    Create a new agent
// @route   POST /api/agents
// @access  Public

const createAgent = asyncHandler(async (req, res) => {
  const { nom, prenom, inventaire } = req.body;

  if (!inventaire) {
    res.status(400);
    throw new Error("Veuillez fournir un inventaire associé.");
  }

  const agent = new Agent({ nom, prenom, inventaire });

  // Sauvegarder l'agent
  const createdAgent = await agent.save();

  // Ajouter l'ID de l'agent dans le tableau `agents` de l'inventaire
  await Inventory.findByIdAndUpdate(
    inventaire,
    { $push: { agents: createdAgent._id } },
    { new: true }
  );

  res.status(201).json(createdAgent);
});







// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Public
const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (agent) {
    res.status(200).json(agent);
  } else {
    res.status(404);
    throw new Error("Agent introuvable.");
  }
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Public
const updateAgent = asyncHandler(async (req, res) => {
  const { nom, prenom } = req.body;

  const agent = await Agent.findById(req.params.id);

  if (agent) {
    agent.nom = nom || agent.nom;
    agent.prenom = prenom || agent.prenom;

    const updatedAgent = await agent.save();
    res.status(200).json(updatedAgent);
  } else {
    res.status(404);
    throw new Error("Agent introuvable.");
  }
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Public
const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id);

  if (agent) {
    await agent.deleteOne();
    res.status(200).json({ message: "Agent supprimé avec succès." });
  } else {
    res.status(404);
    throw new Error("Agent introuvable.");
  }
});

export { getAgents, createAgent, getAgentById, updateAgent, deleteAgent };
