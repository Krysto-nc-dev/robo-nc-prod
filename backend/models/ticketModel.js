import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Veuillez fournir un titre pour le ticket"],
      maxlength: [150, "Le titre ne peut pas dépasser 150 caractères"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Veuillez fournir une description pour le ticket"],
      maxlength: [1000, "La description ne peut pas dépasser 1000 caractères"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Ouvert", "En cours", "Résolu", "Fermé", "Rejeté"],
      default: "Ouvert",
    },
    priorite: {
      type: String,
      enum: ["Basse", "Moyenne", "Haute", "Critique"],
      default: "Moyenne",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence à l'utilisateur assigné
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au créateur du ticket
      required: true,
    },
    commentaires: [
      {
        utilisateur: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Référence à l'utilisateur qui commente
          required: true,
        },
        texte: {
          type: String,
          required: [true, "Veuillez fournir un commentaire"],
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    fichiers: [
      {
        nom: {
          type: String,
          trim: true,
        },
        chemin: {
          type: String, // Chemin du fichier téléchargé
          required: true,
        },
        type: {
          type: String, // Type de fichier (PDF, image, etc.)
        },
        dateTelechargement: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    parentModel: {
      type: String, // Exemple : 'RepportGenerator', 'AnotherModel'
      required: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId, // Référence à l'instance du parent
      required: false,
    },
    dueDate: {
      type: Date, // Date limite pour résoudre le ticket
    },
    tags: [
      {
        type: String,
        trim: true, // Tags pour catégoriser ou rechercher les tickets
      },
    ],
    resolutionDetails: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Référence à l'utilisateur qui a résolu le ticket
      },
      resolutionDate: {
        type: Date, // Date de résolution
      },
      resolutionNote: {
        type: String, // Note ou commentaire sur la résolution
        trim: true,
      },
    },
  },
  { timestamps: true } // Ajout des champs `createdAt` et `updatedAt`
);

// Index pour optimiser les recherches fréquentes
TicketSchema.index({ createdBy: 1, status: 1, dueDate: 1 });

export default mongoose.model("Ticket", TicketSchema);
