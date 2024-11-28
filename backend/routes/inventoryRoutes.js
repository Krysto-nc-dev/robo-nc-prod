import express from 'express';
import multer from 'multer';
import {
  getInventories,
  createInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  importZonesFromCSV,
  generatePDFForInventory,
} from '../controllers/inventoryController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Répertoire où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom unique pour chaque fichier
  },
});
const upload = multer({ storage });

router.route('/').get(getInventories).post(createInventory);

router.post('/import-zones', upload.single('file'), importZonesFromCSV);
router.get('/:id/generate-pdf', generatePDFForInventory);
router.route('/:id').get(getInventoryById).put(updateInventory).delete(deleteInventory);

export default router;
