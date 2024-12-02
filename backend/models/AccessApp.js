import mongoose from "mongoose";

// 2. Schéma de l'Agent (AGENT)
const AccessAppSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["global", "master", "autre"],
      default: "global",
    },

  },
  { timestamps: true }
);

export default mongoose.model("AccessApp", AccessAppSchema);
