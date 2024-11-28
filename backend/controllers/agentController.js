import asyncHandler from '../middlewares/async.js'
import Agent from '../models/agentModel.js'

// @desc    Get all agents
// @route   GET /api/agents
// @access  Public
const getAgents = asyncHandler(async (req, res) => {
  const agents = await Agent.find()
  res.status(200).json(agents)
})

// @desc    Create a new agent
// @route   POST /api/agents
// @access  Public
const createAgent = asyncHandler(async (req, res) => {
  const { nom, prenom } = req.body

  const agent = new Agent({
    nom,
    prenom,
  })

  const createdAgent = await agent.save()
  res.status(201).json(createdAgent)
})

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Public
const getAgentById = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id)

  if (agent) {
    res.status(200).json(agent)
  } else {
    res.status(404)
    throw new Error("Agent not found")
  }
})

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Public
const updateAgent = asyncHandler(async (req, res) => {
  const { nom, prenom } = req.body

  const agent = await Agent.findById(req.params.id)

  if (agent) {
    agent.nom = nom || agent.nom
    agent.prenom = prenom || agent.prenom

    const updatedAgent = await agent.save()
    res.status(200).json(updatedAgent)
  } else {
    res.status(404)
    throw new Error("Agent not found")
  }
})

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Public
const deleteAgent = asyncHandler(async (req, res) => {
  const agent = await Agent.findById(req.params.id)

  if (agent) {
    await agent.deleteOne()
    res.status(200).json({ message: "Agent removed" })
  } else {
    res.status(404)
    throw new Error("Agent not found")
  }
})

export {
  getAgents,
  createAgent,
  getAgentById,
  updateAgent,
  deleteAgent,
}
