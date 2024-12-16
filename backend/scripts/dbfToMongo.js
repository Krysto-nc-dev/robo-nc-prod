import path from "path";
import fs from "fs";
import { DBFFile } from "dbffile";
import dotenv from "dotenv";
import colors from "colors";
import { SingleBar, Presets } from "cli-progress";
import connectDB from "../config/db.js";

// Import des modèles
import Fournisseur from "../models/qc/fournisseurModel.js";
import Article from "../models/qc/articleModel.js";
import Classnum from "../models/qc/classNumModel.js";
import Tier from "../models/qc/tierModel.js";
import Facture from "../models/qc/factureModel.js";
import FactureDetails from "../models/qc/factureDetailsModel.js";
import Commande from "../models/qc/commandeModel.js";

// Gestion des chemins compatibles avec ES Modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const DBF_FOLDER = path.join(__dirname, "../dbf/qc");

// Liste des fichiers DBF avec leurs modèles associés
const dbfFiles = [
  { fileName: "classes.dbf", model: Classnum, label: "Classnums" },
  { fileName: "tiers.dbf", model: Tier, label: "Tiers" },
  { fileName: "fourniss.dbf", model: Fournisseur, label: "Fournisseurs" },
  { fileName: "facture.dbf", model: Facture, label: "Factures" },
  { fileName: "detail.dbf", model: FactureDetails, label: "FactureDetails" },
  { fileName: "article.dbf", model: Article, label: "Articles" },
  { fileName: "cmdref.dbf", model: Commande, label: "Commandes" },
];

// Fonction pour nettoyer les enregistrements avant insertion
const sanitizeRecord = (record) => {
  const sanitized = {};

  for (const [key, value] of Object.entries(record)) {
    // Remplacer NaN par 0 pour les champs numériques
    if (typeof value === "number" && isNaN(value)) {
      sanitized[key] = 0;
    } else {
      sanitized[key] = value; // Garder la valeur telle quelle si elle est valide
    }
  }

  return sanitized;
};

// Fonction principale d'importation
const importDbfsData = async () => {
  try {
    console.log("Connexion à MongoDB...".green);
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
      console.log(
        `Fichier DBF ${label} ouvert. Nombre d'enregistrements : ${dbf.recordCount}`.blue
      );

      if (dbf.recordCount === 0) {
        console.warn(`Aucun enregistrement trouvé dans le fichier ${label}.`.yellow);
        continue;
      }

      console.log(`Suppression des anciennes données pour ${label}...`.yellow);
      await model.deleteMany();

      const batchSize = 1000; // Taille des lots pour insertion
      let start = 0;

      // Initialiser la barre de progression
      const progressBar = new SingleBar(
        {
          format: `${label} |{bar}| {percentage}% | {value}/{total} Enregistrements`,
          barCompleteChar: "\u2588",
          barIncompleteChar: "\u2591",
          hideCursor: true,
        },
        Presets.shades_classic
      );

      progressBar.start(dbf.recordCount, 0);

      while (start < dbf.recordCount) {
        // Lire un lot d'enregistrements
        const records = await dbf.readRecords(batchSize);

        // Nettoyer les enregistrements
        const sanitizedRecords = records.map(sanitizeRecord);

        // Insérer les enregistrements dans la base de données
        await model.insertMany(sanitizedRecords);

        // Mettre à jour la barre de progression
        progressBar.increment(records.length);

        start += batchSize;
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

// Supprimer toutes les données
const destroyDbfsData = async () => {
  console.log("Suppression des données existantes pour tous les fichiers...".yellow);
  for (const { model, label } of dbfFiles) {
    console.log(`Suppression des données pour ${label}...`.yellow);
    await model.deleteMany();
  }
  console.log("Toutes les données ont été supprimées avec succès !".red.inverse);
  process.exit();
};

// Gestion des arguments pour supprimer ou importer les données
if (process.argv[2] === "-d") {
  destroyDbfsData();
} else {
  importDbfsData();
}
