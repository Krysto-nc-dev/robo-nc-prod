import mongoose from 'mongoose';

// Définir le schéma Mongoose pour correspondre aux données importées
const QcProformatSchema = new mongoose.Schema(
  {
      numfact: {
      type: String,
      trim: true,
    },
datfact: {
      type: String,
      trim: true,
      default: 'inconnue'
    },
 tiers: {
      type: String,
      trim: true,
      default: 'inconnue'
    },
    repres: {
      type: String,
      trim: true,
    },
    montant: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
  }
);

// Pré-middleware avant l'enregistrement (ici on pourrait ajouter des validations ou modifications supplémentaires)
QcProformatSchema.pre('save', async function (next) {
  // Ajout potentiel de logique de validation ou d'autres actions avant l'enregistrement
  next();
});

// Créer et exporter le modèle basé sur le schéma
const QcProformat = mongoose.model('QcProformat', QcProformatSchema);

export default QcProformat;
