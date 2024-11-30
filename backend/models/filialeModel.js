import mongoose from 'mongoose';

// 2. Schéma de l'Agent (AGENT)
const FillialeSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Veuillez fournir le nom de la filiale"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    acronyme: {
      type: String,
      required: [true, "Veuillez fournir l'acronyme de la filiale"],
      trim: true,
      maxlength: [5, "L'acronyme ne peut pas dépasser 5 caractères"],
    },
    website: {
      type: String,
      trim: true,
    },
    adresse: {
      type: String,
      required: [true, "Veuillez fournir l'adresse de la filiale"],
      maxlength: [100, "L'adresse ne peut pas dépasser 100 caractères"],
      trim: true,
    },
    logo: {
      type: String,
    },
    debutAnneeFiscale: {
      type: Number,
      required: [true, "Veuillez fournir le début de l'année fiscale (mois)"],
      min: [1, "Le mois doit être entre 1 (janvier) et 12 (décembre)"],
      max: [12, "Le mois doit être entre 1 (janvier) et 12 (décembre)"],
    },
    finAnneeFiscale: {
      type: Number,
      required: [true, "Veuillez fournir la fin de l'année fiscale (mois)"],
      min: [1, "Le mois doit être entre 1 (janvier) et 12 (décembre)"],
      max: [12, "Le mois doit être entre 1 (janvier) et 12 (décembre)"],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Filliale', FillialeSchema);
