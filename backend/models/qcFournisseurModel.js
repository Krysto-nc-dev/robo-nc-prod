import mongoose from 'mongoose';

// Définir le schéma Mongoose pour correspondre aux données importées
const QcFournisseurSchema = new mongoose.Schema(
  {
      nom: {
      type: String,
      required: true,
      trim: true,
    },
ad1: {
      type: String,
      trim: true,
      default: 'inconnue'
    },
    fourn: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
  }
);

// Pré-middleware avant l'enregistrement (ici on pourrait ajouter des validations ou modifications supplémentaires)
QcFournisseurSchema.pre('save', async function (next) {
  // Ajout potentiel de logique de validation ou d'autres actions avant l'enregistrement
  next();
});

// Créer et exporter le modèle basé sur le schéma
const QcFournisseur = mongoose.model('QcFournisseur', QcFournisseurSchema);

export default QcFournisseur;
