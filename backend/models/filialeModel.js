
import mongoose from 'mongoose';

// 2. Schéma de l'Agent (AGENT)
const FillialeSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Veuillez fournir le nom de la filliale"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    acronyme: {
        type: String,
        required: [true, "Veuillez fournir l'acronyme de la filliale"],
        trim: true,
        maxlength: [5 , "l'acronyme ne peut pas dépasser 5 caractères"],
    },
    website: {
        type: String,
        trim: true,
    },
    
    adresse :{
      type: String,
      required: [true, "Veuillez fournir le prénom de l'agent"],
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
      trim: true,
    },

    logo: {
        type : String,
    },

  },
  { timestamps: true }
);

export default mongoose.model('Filliale', FillialeSchema);