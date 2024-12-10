import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, "Veuillez fournir un titre pour le module"],
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
      trim: true,
    },
    categorie: {
      type: String,
      enum: ["Compta", "Commerce", "Communication", "Autre"], // Liste des catégories possibles
      required: [true, "Veuillez définir une catégorie pour le module"],
    },
    image: {
      type: String,
      trim: true,
      required: [true, "Veuillez fournir une URL pour l'image du module"],
    },
    documentation: {
      type: String,
      trim: true,
      required: [true, "Veuillez fournir une URL pour la documentation du module"],
    },
    telechargement: {
      type: String,
      trim: true,
      required: [true, "Veuillez fournir une URL pour le téléchargement du module"],

    },
    estActif: {
      type: Boolean,
      default: false, // Par défaut, le module est inactif
    },
    afficheDansSidebar: {
      type: Boolean,
      default: false, // Par défaut, le module n'est pas affiché dans la sidebar
    },
    version: {
      type: String,
      trim: true,
      default: "1.0.0", // Version par défaut
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence à l'utilisateur qui a créé le module
      required: [true, "Le créateur du module doit être défini"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence à l'utilisateur ayant mis à jour le module
    },
    status: {
      type: String,
      enum: ["Actif", "Inactif", "En Maintenance"],
      default: "Inactif",
    },
    dateActivation: {
      type: Date,
      default: null, // Date d'activation du module
    },
    dateDesactivation: {
      type: Date,
      default: null, // Date de désactivation du module
    },
  },
  { timestamps: true } // Ajout de `createdAt` et `updatedAt`
);

export default mongoose.model("Module", ModuleSchema);
