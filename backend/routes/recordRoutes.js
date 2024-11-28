import express from 'express';
import {
  getRecords,
  createRecord,
  getRecordById,
  updateRecord,
  deleteRecord,
  updateRecordByBarcode,
  getRecordsByZone,
} from '../controllers/recordController.js';

const router = express.Router();

router.route('/').get(getRecords).post(createRecord);
router.route('/:id').get(getRecordById).put(updateRecord).delete(deleteRecord);
router.route('/scan').put(updateRecordByBarcode); // Nouvelle route pour scan
router.route('/zone/:zoneId').get(getRecordsByZone); // Nouveaux enregistrements par zone

export default router;
