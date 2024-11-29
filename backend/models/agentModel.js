import mongoose from 'mongoose';

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
    inventaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, "Veuillez fournir un inventaire associé"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Agent', AgentSchema);
