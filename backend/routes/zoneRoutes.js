import express from 'express'
import {
  getZones,
  createZone,
  getZoneById,
  updateZone,
  deleteZone,
} from '../controllers/zoneController.js'

const router = express.Router()

router.route('/').get(getZones).post(createZone)
router
  .route('/:id')
  .get(getZoneById)
  .put(updateZone)
  .delete(deleteZone)

export default router
