import mongoose from "mongoose";

// 2. Schéma de l'Agent (AGENT)
const MasterRepportSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Veuillez fournir le nom du rapport"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Actif", "Inactif"],
      default: "Actif",
    },
    multisociete: {
      type: Boolean,
      default: false,
    },
    externe: {
      type: Boolean,
      default: false,
    },
    filliales: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Filiale',
        },
      ],
    frequence: {
      type: String,
      trim: true,
    },
    type: {
        type: String,
        enum: ["global", "master", "autre"],
        default: "global",
      },

    documents: [
        {
          filename: { type: String, required: true }, // Nom du fichier
          url: { type: String, required: true }, // URL ou chemin d'accès
          generatedAt: { type: Date, default: Date.now }, // Date de génération
        },
      ],
  },
  { timestamps: true }
);

export default mongoose.model("MasterRepport", MasterRepportSchema);