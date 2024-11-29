import express from 'express';
import {
  getFilliales,
  createFilliale,
  getFillialeById,
  updateFilliale,
  deleteFilliale,
} from '../controllers/fillialeController.js';

const router = express.Router();

router.route('/').get(getFilliales).post(createFilliale);
router
  .route('/:id')
  .get(getFillialeById)
  .put(updateFilliale)
  .delete(deleteFilliale);

export default router;
