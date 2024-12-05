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
    category: {
      type: String,
      enum: ["Codeve", "Global", "Master", "Autre"],
      default: "Access",
    },
    maintainedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence à l'utilisateur ou équipe en charge de la maintenance
    },
    lastExecution: {
      type: Date,
      default: null, // Date de dernière exécution du générateur
    },
    frequence: {
      type: {
        type: String,
        enum: ["Journalier", "Hebdomadaire", "Mensuel", "Bi-Mensuel", "Trimestriel", "Annuel"],
        required: true,
        default: "Mensuel",
      },
      details: {
        type: String,
        trim: true,
        maxlength: [500, "Les détails de la fréquence ne peuvent pas dépasser 500 caractères"],
      },
    },
  },
  { timestamps: true } // Ajout de `createdAt` et `updatedAt`
);

export default mongoose.model("Repport", RepportSchema);
