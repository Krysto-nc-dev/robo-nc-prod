import mongoose from 'mongoose';

// Définir le schéma Mongoose pour correspondre aux données importées
const QcArticleSchema = new mongoose.Schema(
  {
    nart: {
      type: String,
      required: true,
      trim: true,
    },
    gencod: {
      type: String,
      trim: true,
      default: 'inconnue'
    },
    design: {
      type: String,
      trim: true,
    },
    fourn: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
  }
);

// Pré-middleware avant l'enregistrement (ici on pourrait ajouter des validations ou modifications supplémentaires)
QcArticleSchema.pre('save', async function (next) {
  // Ajout potentiel de logique de validation ou d'autres actions avant l'enregistrement
  next();
});

// Créer et exporter le modèle basé sur le schéma
const QcArticle = mongoose.model('QcArticle', QcArticleSchema);

export default QcArticle;
