import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recréer __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dossier de stockage des fichiers
const uploadDir = path.join(__dirname, '..', 'uploads');

// Vérifiez si le dossier existe, sinon créez-le
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nom unique pour éviter les conflits
  },
});

// Filtrage des fichiers autorisés (tous les fichiers acceptés par défaut)
const fileFilter = (req, file, cb) => {
  cb(null, true); // Accepte tous les fichiers
};

// Création de l'instance Multer avec les options définies
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille : 10 Mo
});

// Gestionnaire d'erreurs personnalisées pour Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erreurs liées à Multer (ex. : dépassement de taille)
    return res.status(400).json({ error: `Erreur Multer : ${err.message}` });
  } else if (err) {
    // Autres erreurs (ex. : type de fichier non autorisé)
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Export par défaut pour `upload` et export nommé pour `handleMulterError`
export default upload;
export { handleMulterError };
