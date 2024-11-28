
import mongoose from 'mongoose';

// 2. Schéma de l'Agent (AGENT)
const AgentSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Veuillez fournir le nom de l'agent"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Veuillez fournir le prénom de l'agent"],
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Agent', AgentSchema);