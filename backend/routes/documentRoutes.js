import express from 'express';
import path from 'path'; // Assurez-vous que `path` est bien importé
import upload from '../middlewares/upload.js'; // Middleware Multer
import Document from '../models/documentModel.js'; // Modèle Mongoose ou Sequelize

const router = express.Router();

// Route pour uploader un fichier
router.post('/uploads', async (req, res) => {
  try {
    // Gestion du middleware `upload.single`
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: `Erreur d'upload : ${err.message}` });
      }

      // Vérification si un fichier a été reçu
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
      }

      // Création d'un nouvel enregistrement dans la base de données
      const document = new Document({
        name: req.file.originalname, // Nom original du fichier
        fileType: path.extname(req.file.originalname).substring(1).toLowerCase(), // Extension
        filePath: req.file.path, // Chemin où le fichier est stocké
      });

      // Sauvegarde dans la base de données
      await document.save();

      // Réponse en cas de succès
      res.status(201).json({ message: 'Fichier téléchargé avec succès.', document });
    });
  } catch (error) {
    console.error(error);
    // Réponse en cas d'erreur
    res.status(500).json({ message: 'Erreur lors du téléchargement.', error });
  }
});

export default router;
