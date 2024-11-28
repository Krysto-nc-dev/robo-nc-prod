import express from 'express'
import {
  getAgents,
  createAgent,
  getAgentById,
  updateAgent,
  deleteAgent,
} from '../controllers/agentController.js'

const router = express.Router()

router.route('/').get(getAgents).post(createAgent)
router
  .route('/:id')
  .get(getAgentById)
  .put(updateAgent)
  .delete(deleteAgent)

export default router
