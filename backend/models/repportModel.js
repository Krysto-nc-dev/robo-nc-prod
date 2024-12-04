import mongoose from "mongoose";

const RepportSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Veuillez fournir le nom du générateur de rapport"],
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Actif", "Inactif", "En Maintenance"],
      default: "Actif",
    },

    type: {
      type: String,
      enum: ["Access", "Script", "Python", "Excel", "PowerBI", "Autre"],
      default: "Access",
    },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket", // Référence au modèle Ticket
      },
    ],
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document", // Référence au modèle Document
      },
    ],

    maintainedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence à l'utilisateur ou équipe en charge de la maintenance
    },
    lastExecution: {
      type: Date,
      default: null, // Date de dernière exécution du générateur
    },

  },
  { timestamps: true } // Ajout de `createdAt` et `updatedAt`
);

export default mongoose.model("Repport", RepportSchema);
