import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au modèle utilisateur
      required: true,
    },
    action: {
      type: String,
      enum: ["Créer", "Modifier", "Supprimer", "Consulter"], // Actions possibles
      required: true,
    },
    category: {
      type: String,
      enum: ["Utilisateur", "Inventaire", "Rapport", "Filliale", "Autre"], // Ajout de "Filliale"
      required: true,
    },
    target: {
      type: String,
      required: true, // Nom de l'objet affecté (ex: Inventory, User)
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: function () {
        return this.target; // Obligatoire si `target` est défini
      },
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Permet des objets ou des chaînes
      default: {}, // Par défaut, un objet vide
    },
    result: {
      type: String,
      enum: ["Succès", "Échec"], // Résultat de l'action
      default: "Succès",
    },
    ipAddress: {
      type: String, // Adresse IP de l'utilisateur
      trim: true,
    },
    location: {
      type: String, // Localisation de l'utilisateur
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Date et heure
    },
  },
  {
    timestamps: false, // Désactiver les champs `createdAt` et `updatedAt` automatiques
  }
);

// Index pour optimiser les recherches fréquentes
LogSchema.index({ user: 1, timestamp: -1 });

export default mongoose.model("Log", LogSchema);
