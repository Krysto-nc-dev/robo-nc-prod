import path from 'path';
import fs from 'fs';
import { DBFFile } from 'dbffile'; // Utilisation de la bibliothèque dbffile
import dotenv from 'dotenv';
import colors from 'colors';
import { SingleBar, Presets } from 'cli-progress'; // Import de la barre de progression
import connectDB from '../config/db.js';

// Import des modèles
import Fournisseur from '../models/qc/fournisseurModel.js';
import Article from '../models/qc/articleModel.js';
import Classnum from '../models/qc/classNumModel.js'; // Ajout du modèle Classnum

// Gestion des chemins compatibles avec ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const DBF_FOLDER = path.join(__dirname, '../dbf/qc');

// Liste des fichiers DBF avec leurs modèles associés
const dbfFiles = [
  { fileName: 'classes.dbf', model: Classnum, label: 'Classnums' }, // Ajout de la table Classnums
  { fileName: 'fourniss.dbf', model: Fournisseur, label: 'Fournisseurs' },
  { fileName: 'article.dbf', model: Article, label: 'Articles' },
];

// Fonction pour nettoyer les enregistrements avant insertion
const sanitizeRecord = (record) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(record)) {
    // Remplacer NaN par 0 pour les champs numériques
    if (typeof value === 'number' && isNaN(value)) {
      sanitized[key] = 0;
    } else {
      sanitized[key] = value; // Garder la valeur telle quelle si elle est valide
    }
  }

  return sanitized;
};

const importDbfsData = async () => {
  try {
    console.log('Connexion à MongoDB...'.green);
    await connectDB();

    for (const { fileName, model, label } of dbfFiles) {
      const filePath = path.join(DBF_FOLDER, fileName);

      console.log(`Lecture du fichier DBF : ${filePath}`.yellow);

      if (!fs.existsSync(filePath)) {
        console.error(`Le fichier ${filePath} est introuvable.`.red);
        continue;
      }

      // Lire le fichier DBF avec dbffile
      const dbf = await DBFFile.open(filePath);
      console.log(`Fichier DBF ${label} ouvert. Nombre d'enregistrements : ${dbf.recordCount}`.blue);

      // Lire tous les enregistrements par lots pour éviter une surcharge mémoire
      const records = await dbf.readRecords(dbf.recordCount);

      if (!records || records.length === 0) {
        console.warn(`Aucun enregistrement trouvé dans le fichier ${label}.`.yellow);
        continue;
      }

      console.log(`Suppression des anciennes données pour ${label}...`.yellow);
      await model.deleteMany();

      // Initialisation de la barre de progression
      const progressBar = new SingleBar({
        format: `${label} |{bar}| {percentage}% | {value}/{total} Enregistrements`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      }, Presets.shades_classic);

      // Nettoyer les données avant l'insertion
      const sanitizedRecords = records.map(sanitizeRecord);

      console.log(`Insertion dans la collection ${label}...`.green);

      // Démarrer la barre de progression
      progressBar.start(sanitizedRecords.length, 0);

      // Insérer les données avec la mise à jour de la barre de progression
      for (let i = 0; i < sanitizedRecords.length; i++) {
        await model.create(sanitizedRecords[i]); // Insertion d'un enregistrement
        progressBar.update(i + 1); // Mise à jour de la barre
      }

      // Terminer la barre de progression
      progressBar.stop();

      console.log(`Importation pour ${label} terminée avec succès !`.green.inverse);
    }

    process.exit();
  } catch (error) {
    console.error(`Erreur lors de l'importation : ${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  const destroyDbfsData = async () => {
    console.log('Suppression des données existantes pour tous les fichiers...'.yellow);
    for (const { model, label } of dbfFiles) {
      console.log(`Suppression des données pour ${label}...`.yellow);
      await model.deleteMany();
    }
    console.log('Toutes les données ont été supprimées avec succès !'.red.inverse);
    process.exit();
  };
  destroyDbfsData();
} else {
  importDbfsData();
}
