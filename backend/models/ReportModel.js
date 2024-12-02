import mongoose from "mongoose";

// 2. Schéma de l'Agent (AGENT)
const RepportSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Veuillez fournir le nom du rapport"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    
    frequence: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Repport", RepportSchema);