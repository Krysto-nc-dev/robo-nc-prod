import mongoose from "mongoose";

const RepportGeneratorSchema = new mongoose.Schema(
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
    path: {
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
    type: {
      type: String,
      enum: ["Access", "Script", "autre"],
      default: "Access",
    },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket", // Référence au modèle Ticket
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("RepportGenerator", RepportGeneratorSchema);
