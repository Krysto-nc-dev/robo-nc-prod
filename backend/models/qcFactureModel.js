import mongoose from 'mongoose';

// Définir le schéma Mongoose pour correspondre aux données importées
const QcFactureSchema = new mongoose.Schema(
  {
      numfact: {
      type: String,
      required: true,
      trim: true,
    },
typefact: {
      type: String,
      trim: true,
      default: 'inconnue'
    },
    datefact: {
      type: String,
      trim: true,
    },
    tiers: {
      type: String,
      trim: true,
    },
    montant: {
      type: String,
      trim: true,
    },
    factrem: {
      type: String,
      trim: true,
    },
    montaxe: {
      type: String,
      trim: true,
    },
    repres: {
      type: String,
      trim: true,
    },
    heure: {
      type: String,
      trim: true,
    },
    texte: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
  }
);

// Pré-middleware avant l'enregistrement (ici on pourrait ajouter des validations ou modifications supplémentaires)
QcFactureSchema.pre('save', async function (next) {
  // Ajout potentiel de logique de validation ou d'autres actions avant l'enregistrement
  next();
});

// Créer et exporter le modèle basé sur le schéma
const QcFacture = mongoose.model('QcFacture', QcFactureSchema);

export default QcFacture;
