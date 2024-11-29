import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { DBFFile } from 'dbffile';

// Définir __filename et __dirname avec ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map pour associer les fichiers DBF aux modèles MongoDB correspondants
const dbfMappings = {
   
    'fourniss.dbf': {
        model: './models/qcFournisseurModel.js',
        fields: ['FOURN', 'NOM', 'AD1'], // Champs à importer
        transform: record => ({
            fourn: record.FOURN,
            nom: record.NOM,
            ad1: record.AD1,
        }),
    },
    
 
    'proformat.dbf': {
        model: './models/qcProformatModel.js',
        fields: ['NUMFACT', 'DATFACT', 'TIERS', 'REPRES', 'MONTANT'], // Champs à importer
        transform: record => ({
            numfact: record.NUMFACT,
            datfact: record.DATFACT,
            tiers: record.TIERS,
            repres: record.REPRES,
            montant: record.MONTANT,
           
        }),
    },
    
   
    'facture.dbf': {
        model: './models/qcFactureModel.js',
        fields: ['NUMFACT', 'TYPEFACT', 'DATEFACT', "TIERS", "MONTANT" , "FACTREM", "MONTAXE", "HEURE", "TEXTE", "REPRES"], // Champs à importer
        transform: record => ({
            numfact: record.NUMFACT,
            typefact: record.TYPEFACT,
            datefact: record.DATEFACT,
            tiers: record.TIERS,
            montant: record.MONTANT,
            factrem: record.FACTREM,
            montaxe: record.MONTAXE,
            heure: record.HEURE,
            texte: record.TEXTE,
            repres: record.REPRES,
        }),
    },
 
    'article.dbf': {
        model: './models/qcArticleModel.js',
        fields: ['NART', 'GENCOD', 'DESIGN', 'FOURN'], // Champs à importer
        transform: record => ({
            nart: record.NART,
            gencod: record.GENCOD,
            design: record.DESIGN,
            fourn: record.FOURN,
        }),
    },
};

// Fonction pour importer un fichier DBF avec un modèle spécifique
async function importDbf(fileName, retries = 5, delay = 1000) {
    if (!dbfMappings[fileName]) {
        throw new Error(`No mapping found for file: ${fileName}`);
    }

    const { model, fields, transform } = dbfMappings[fileName];
    const Model = (await import(model)).default;

    const dbfFilePath = path.join(__dirname, 'dbf_files', fileName);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Ouvrir le fichier DBF
            const dbf = await DBFFile.open(dbfFilePath);
            console.log(`Found ${dbf.recordCount} records in ${fileName}`);

            // Supprimer les données existantes avant d'importer de nouvelles données
            await Model.deleteMany({});
            console.log('Existing records deleted.');

            // Lire chaque enregistrement du fichier DBF
            for (let record of await dbf.readRecords()) {
                try {
                    const filteredRecord = transform(record);
                    console.log('Inserting record:', filteredRecord);
                    await Model.create(filteredRecord);
                    console.log('Record inserted successfully.');
                } catch (error) {
                    console.error('Error while saving record:', error);
                }
            }

            console.log(`Finished reading ${fileName} and importing records.`);
            break;

        } catch (error) {
            if (error.code === 'EBUSY' && attempt < retries) {
                console.warn(`Attempt ${attempt} failed with 'EBUSY'. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Error during DBF import:', error);
                break;
            }
        }
    }
}

// Fonction pour importer plusieurs fichiers DBF
async function importMultipleDbfs(files) {
    for (const fileName of files) {
        try {
            await importDbf(fileName);
        } catch (error) {
            console.error(`Error importing ${fileName}:`, error);
        }
    }
}

export { importDbf, importMultipleDbfs };
