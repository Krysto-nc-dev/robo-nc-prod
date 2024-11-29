import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import { importMultipleDbfs } from './importDbf.js';

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

// Fonction pour importer les fichiers DBF
const importDbfFiles = async () => {
  try {
    console.log('Starting DBF import script...'.cyan);

    // Fichiers DBF à importer
    const filesToImport = [
      'article.dbf',
      'fourniss.dbf',
      'clients.dbf',
      'facture.dbf',
      'proformat.dbf',
    ];

    console.log('Files to import:', filesToImport);

    // Appel à la fonction d'importation
    await importMultipleDbfs(filesToImport);

    console.log('DBF files imported successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error during DBF import: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Fonction pour nettoyer les collections MongoDB
const destroyDbfData = async () => {
  try {
    console.log('Starting DBF data cleanup...'.cyan);

    // Ajoutez ici les collections à nettoyer si nécessaire
    // Exemple : await SomeModel.deleteMany();

    console.log('DBF data cleaned successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error during DBF data cleanup: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Vérification des arguments de commande
if (process.argv[2] === '-d') {
  destroyDbfData();
} else {
  importDbfFiles();
}
